import type { APIRoute } from 'astro';

function getPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return fallback;
}

const RATE_LIMIT_WINDOW_MS = getPositiveInteger(import.meta.env.CONTACT_RATE_LIMIT_WINDOW_MS, 60_000);
const RATE_LIMIT_MAX_ATTEMPTS = getPositiveInteger(import.meta.env.CONTACT_RATE_LIMIT_MAX, 5);
const HCAPTCHA_SECRET = import.meta.env.HCAPTCHA_SECRET;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export const prerender = false;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[\p{L}\p{M}\d .,'-]{2,}$/u;

type ValidationErrors = {
  name?: string;
  email?: string;
  message?: string;
  captcha?: string;
};

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const [first] = forwardedFor.split(',').map((part) => part.trim());
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();
  return undefined;
}

function enforceRateLimit(identifier: string | undefined) {
  if (!identifier) return { allowed: true } as const;

  const now = Date.now();
  const existing = rateLimitBuckets.get(identifier);

  if (existing && existing.resetAt > now) {
    if (existing.count >= RATE_LIMIT_MAX_ATTEMPTS) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000)
      } as const;
    }

    existing.count += 1;
    return { allowed: true } as const;
  }

  rateLimitBuckets.set(identifier, {
    count: 1,
    resetAt: now + RATE_LIMIT_WINDOW_MS
  });

  return { allowed: true } as const;
}

function validateSubmission(name: string, email: string, message: string): {
  errors: ValidationErrors;
  isValid: boolean;
} {
  const errors: ValidationErrors = {};

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length > 200) {
    errors.name = 'Name must be fewer than 200 characters.';
  } else if (!namePattern.test(name)) {
    errors.name = 'Name contains unsupported characters.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (email.length > 254 || !emailPattern.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!message) {
    errors.message = 'Message is required.';
  } else if (message.length < 10) {
    errors.message = 'Message should include at least 10 characters.';
  } else if (message.length > 4000) {
    errors.message = 'Message must be fewer than 4000 characters.';
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

async function verifyHCaptcha(token: string | null, remoteIp: string | undefined) {
  if (!HCAPTCHA_SECRET) {
    return { ok: true } as const;
  }

  if (!token) {
    return {
      ok: false,
      error: 'captcha token missing'
    } as const;
  }

  const params = new URLSearchParams({
    response: token,
    secret: HCAPTCHA_SECRET
  });

  if (remoteIp) {
    params.append('remoteip', remoteIp);
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `captcha verification failed (${response.status})`
      } as const;
    }

    const payload = (await response.json()) as {
      success: boolean;
      ['error-codes']?: string[];
    };

    if (payload.success) {
      return { ok: true } as const;
    }

    return {
      ok: false,
      error: payload['error-codes']?.[0] ?? 'captcha validation failed'
    } as const;
  } catch (error) {
    console.error('hCaptcha verification error', error);
    return {
      ok: false,
      error: 'captcha verification error'
    } as const;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!/(application\/x-www-form-urlencoded|multipart\/form-data)/i.test(contentType)) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Unsupported content type.' }),
      {
        status: 415,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      }
    );
  }

  const formData = await request.formData();

  const submission = {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim().toLowerCase(),
    message: String(formData.get('message') ?? '').trim(),
    captchaToken: formData.get('h-captcha-response')
      ? String(formData.get('h-captcha-response'))
      : null
  };

  const { errors, isValid } = validateSubmission(submission.name, submission.email, submission.message);
  if (!isValid) {
    console.warn('Rejected contact submission: validation failed', {
      nameLength: submission.name.length,
      emailDomain: submission.email.split('@')[1] ?? 'unknown',
      messageLength: submission.message.length
    });

    return new Response(JSON.stringify({ ok: false, errors }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }

  const clientIdentifier = getClientIdentifier(request);
  const rateLimitResult = enforceRateLimit(clientIdentifier);

  if (!rateLimitResult.allowed) {
    console.warn('Rejected contact submission: rate limited', {
      clientIdentifier,
      windowMs: RATE_LIMIT_WINDOW_MS,
      maxAttempts: RATE_LIMIT_MAX_ATTEMPTS
    });

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    });

    if (rateLimitResult.retryAfterSeconds) {
      headers.set('Retry-After', String(rateLimitResult.retryAfterSeconds));
    }

    return new Response(
      JSON.stringify({ ok: false, message: 'Too many attempts. Please retry in a moment.' }),
      {
        status: 429,
        headers
      }
    );
  }

  const captchaResult = await verifyHCaptcha(submission.captchaToken, clientIdentifier);

  if (!captchaResult.ok) {
    console.warn('Rejected contact submission: captcha failed', {
      clientIdentifier,
      reason: captchaResult.error
    });

    return new Response(
      JSON.stringify({ ok: false, errors: { captcha: 'Captcha verification failed. Please retry.' } }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      }
    );
  }

  console.info('Contact submission accepted', {
    clientIdentifier,
    nameLength: submission.name.length,
    emailDomain: submission.email.split('@')[1] ?? 'unknown',
    messageLength: submission.message.length
  });

  return new Response(
    JSON.stringify({ ok: true, message: 'Thanks for reaching out — the team will reply shortly.' }),
    {
      status: 202,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    }
  );
};
