import type { APIRoute } from 'astro';
import profile from '@data/profile.json';
import { getRuntimeEnv } from '../../lib/server-env';

function getPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return fallback;
}

const RATE_LIMIT_WINDOW_MS = getPositiveInteger(import.meta.env.CONTACT_RATE_LIMIT_WINDOW_MS, 60_000);
const RATE_LIMIT_MAX_ATTEMPTS = getPositiveInteger(import.meta.env.CONTACT_RATE_LIMIT_MAX, 5);

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const TURNSTILE_SITEVERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
// Submissions go to the public address in data/profile.json unless CONTACT_TO overrides it.
const DEFAULT_CONTACT_TO = (profile as { email_public: string }).email_public;
// Must be an address on a domain verified in Resend.
const DEFAULT_CONTACT_FROM = 'theschoonover.net contact form <contact@theschoonover.net>';

// Hidden field that real visitors never fill in. Bots that fill every input reveal themselves.
const HONEYPOT_FIELD = 'company';

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export const prerender = false;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Real names include characters like "(", "&" and "/". The name only lands in a plain-text
// email and its subject, so reject just control characters and line breaks.
const namePattern = /^[^\p{Cc}\p{Zl}\p{Zp}]{2,}$/u;

type ValidationErrors = {
  name?: string;
  email?: string;
  message?: string;
  captcha?: string;
};

type Submission = {
  name: string;
  email: string;
  message: string;
};

// Outcome codes shared with the contact page, which reads them from ?status= after a redirect.
type ContactStatus = 'sent' | 'invalid' | 'captcha' | 'rate-limited' | 'error';

function getClientIdentifier(request: Request) {
  // Cloudflare sets cf-connecting-ip itself; x-forwarded-for can carry client-supplied entries.
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const [first] = forwardedFor.split(',').map((part) => part.trim());
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
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

async function verifyTurnstile(token: string | null, remoteIp: string | undefined) {
  const { TURNSTILE_SECRET_KEY } = await getRuntimeEnv();
  if (!TURNSTILE_SECRET_KEY) {
    // getRuntimeEnv() returns no bindings outside production, so local dev skips the check.
    if (!import.meta.env.PROD) {
      console.info('Turnstile check skipped: no runtime env in dev');
      return { ok: true } as const;
    }

    console.error('Turnstile check failed closed: TURNSTILE_SECRET_KEY is not configured');
    return { ok: false, error: 'turnstile secret not configured' } as const;
  }

  // Turnstile tokens are at most 2048 characters.
  if (!token || token.length > 2048) {
    return {
      ok: false,
      error: 'captcha token missing'
    } as const;
  }

  const params = new URLSearchParams({
    response: token,
    secret: TURNSTILE_SECRET_KEY
  });

  if (remoteIp) {
    params.append('remoteip', remoteIp);
  }

  try {
    const response = await fetch(TURNSTILE_SITEVERIFY_ENDPOINT, {
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
    console.error('Turnstile verification error', error);
    return {
      ok: false,
      error: 'captcha verification error'
    } as const;
  }
}

async function sendContactEmail(submission: Submission, clientIdentifier: string | undefined) {
  const env = await getRuntimeEnv();
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    // getRuntimeEnv() returns no bindings outside production, so local dev never sends mail.
    if (!import.meta.env.PROD) {
      console.info('Contact email skipped: no runtime env in dev', {
        emailDomain: submission.email.split('@')[1] ?? 'unknown',
        messageLength: submission.message.length
      });
      return { ok: true } as const;
    }

    console.error('Contact email not sent: RESEND_API_KEY is not configured');
    return { ok: false, error: 'mail transport not configured' } as const;
  }

  const to = env.CONTACT_TO || DEFAULT_CONTACT_TO;
  const from = env.CONTACT_FROM || DEFAULT_CONTACT_FROM;

  const text = [
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Client IP: ${clientIdentifier ?? 'unknown'}`,
    `Received: ${new Date().toISOString()}`,
    '',
    submission.message
  ].join('\n');

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: submission.email,
        subject: `Contact form: ${submission.name}`,
        text
      })
    });

    if (!response.ok) {
      // Resend error bodies describe the request problem and never echo the API key.
      const detail = (await response.text()).slice(0, 500);
      console.error('Contact email rejected by Resend', { status: response.status, detail });
      return { ok: false, error: `resend responded ${response.status}` } as const;
    }

    const payload = (await response.json().catch(() => ({}))) as { id?: string };
    console.info('Contact email sent', { resendId: payload.id });
    return { ok: true } as const;
  } catch (error) {
    console.error('Contact email send error', error);
    return { ok: false, error: 'resend request failed' } as const;
  }
}

// A plain HTML form post navigates the browser to this endpoint, so answer it with a redirect
// back to the contact page. Scripted callers that ask for JSON keep getting JSON.
function wantsHtml(request: Request) {
  const accept = request.headers.get('accept') ?? '';
  return accept.includes('text/html');
}

function respond(
  request: Request,
  status: ContactStatus,
  httpStatus: number,
  body: Record<string, unknown>,
  extraHeaders: Record<string, string> = {}
) {
  if (wantsHtml(request)) {
    const location = new URL('/contact', request.url);
    location.searchParams.set('status', status);
    location.hash = 'contact-form';
    return new Response(null, {
      status: 303,
      headers: { Location: location.toString(), 'Cache-Control': 'no-store', ...extraHeaders }
    });
  }

  return new Response(JSON.stringify(body), {
    status: httpStatus,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders }
  });
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
    captchaToken: formData.get('cf-turnstile-response')
      ? String(formData.get('cf-turnstile-response'))
      : null
  };

  const clientIdentifier = getClientIdentifier(request);

  if (String(formData.get(HONEYPOT_FIELD) ?? '').trim()) {
    // Answer like a success so the bot has nothing to learn from.
    console.warn('Dropped contact submission: honeypot filled', { clientIdentifier });
    return respond(request, 'sent', 202, { ok: true, message: 'Thanks for reaching out.' });
  }

  const { errors, isValid } = validateSubmission(submission.name, submission.email, submission.message);
  if (!isValid) {
    console.warn('Rejected contact submission: validation failed', {
      nameLength: submission.name.length,
      emailDomain: submission.email.split('@')[1] ?? 'unknown',
      messageLength: submission.message.length
    });

    return respond(request, 'invalid', 400, { ok: false, errors });
  }

  const rateLimitResult = enforceRateLimit(clientIdentifier);

  if (!rateLimitResult.allowed) {
    console.warn('Rejected contact submission: rate limited', {
      clientIdentifier,
      windowMs: RATE_LIMIT_WINDOW_MS,
      maxAttempts: RATE_LIMIT_MAX_ATTEMPTS
    });

    const headers: Record<string, string> = {};
    if (rateLimitResult.retryAfterSeconds) {
      headers['Retry-After'] = String(rateLimitResult.retryAfterSeconds);
    }

    return respond(
      request,
      'rate-limited',
      429,
      { ok: false, message: 'Too many attempts. Please retry in a moment.' },
      headers
    );
  }

  const captchaResult = await verifyTurnstile(submission.captchaToken, clientIdentifier);

  if (!captchaResult.ok) {
    console.warn('Rejected contact submission: captcha failed', {
      clientIdentifier,
      reason: captchaResult.error
    });

    return respond(request, 'captcha', 400, {
      ok: false,
      errors: { captcha: 'Captcha verification failed. Please retry.' }
    });
  }

  const sendResult = await sendContactEmail(submission, clientIdentifier);

  if (!sendResult.ok) {
    console.error('Contact submission not delivered', {
      clientIdentifier,
      reason: sendResult.error
    });

    return respond(request, 'error', 502, {
      ok: false,
      message: 'The message could not be delivered. Please email directly instead.'
    });
  }

  console.info('Contact submission delivered', {
    clientIdentifier,
    nameLength: submission.name.length,
    emailDomain: submission.email.split('@')[1] ?? 'unknown',
    messageLength: submission.message.length
  });

  return respond(request, 'sent', 202, {
    ok: true,
    message: 'Thanks for reaching out. John will reply soon.'
  });
};
