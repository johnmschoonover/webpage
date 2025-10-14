import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureSlug } from '@lib/slugify';

function findPostsDirectory() {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const searchRoots = [moduleDir, process.cwd()];

  for (const root of searchRoots) {
    let current = root;
    while (true) {
      const candidate = path.join(current, 'src/content/posts');
      if (existsSync(candidate)) {
        return candidate;
      }

      const parent = path.dirname(current);
      if (parent === current) {
        break;
      }
      current = parent;
    }
  }

  throw new Error('Unable to locate posts content directory from API route.');
}

const postsDirectory = findPostsDirectory();
const BLOG_PUBLISH_TOKEN = import.meta.env.BLOG_PUBLISH_TOKEN;

export const prerender = false;

async function ensureDirectoryExists(directory: string) {
  await mkdir(directory, { recursive: true });
}

async function fileExists(filePath: string) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function formatDate(value: string | undefined) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsed.toISOString().slice(0, 10);
}

function buildFrontmatter(payload: {
  title: string;
  summary: string;
  date: string;
  tags: string[];
  canonical?: string;
  updated?: string;
}) {
  const lines = [
    `title: ${JSON.stringify(payload.title)}`,
    `summary: ${JSON.stringify(payload.summary)}`,
    `date: \"${payload.date}\"`
  ];

  if (payload.tags.length > 0) {
    lines.push(`tags: [${payload.tags.map((tag) => JSON.stringify(tag)).join(', ')}]`);
  }

  if (payload.canonical) {
    lines.push(`canonical: ${JSON.stringify(payload.canonical)}`);
  }

  if (payload.updated) {
    lines.push(`updated: \"${payload.updated}\"`);
  }

  return `---\n${lines.join('\n')}\n---\n`;
}

function validateBody(body: unknown) {
  if (typeof body !== 'string' || body.trim().length < 50) {
    return 'Post body must contain at least 50 characters.';
  }
  return undefined;
}

function validateSummary(summary: string) {
  if (summary.length < 20) {
    return 'Summary should contain at least 20 characters to provide context.';
  }
  if (summary.length > 300) {
    return 'Summary must be under 300 characters to keep meta descriptions concise.';
  }
  return undefined;
}

function normalizeTags(input: unknown) {
  if (!input) return [] as string[];
  if (Array.isArray(input)) {
    return input
      .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
      .filter(Boolean)
      .map((tag) => tag.toLowerCase());
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => tag.toLowerCase());
  }
  return [] as string[];
}

function normalizeCanonical(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    return url.toString();
  } catch {
    return undefined;
  }
}

function normalizeUpdated(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

function respondWithJson(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

function authorize(request: Request) {
  if (!BLOG_PUBLISH_TOKEN) {
    return { ok: true } as const;
  }

  const header = request.headers.get('authorization');
  if (!header) {
    return {
      ok: false,
      response: respondWithJson(401, { ok: false, message: 'Missing authorization header.' })
    } as const;
  }

  const [, token] = header.split(/Bearer\s+/i);
  if (!token || token.trim() !== BLOG_PUBLISH_TOKEN) {
    return {
      ok: false,
      response: respondWithJson(401, { ok: false, message: 'Invalid publish token.' })
    } as const;
  }

  return { ok: true } as const;
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');
  const payload = posts
    .map((post) => ({
      slug: post.slug,
      title: post.data.title,
      summary: post.data.summary,
      date: post.data.date,
      tags: post.data.tags ?? []
    }))
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return respondWithJson(200, { ok: true, posts: payload });
};

export const POST: APIRoute = async ({ request }) => {
  const authResult = authorize(request);
  if (!authResult.ok) {
    return authResult.response;
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return respondWithJson(415, {
      ok: false,
      message: 'Use application/json content type.'
    });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return respondWithJson(400, { ok: false, message: 'Invalid JSON payload.' });
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const summary = typeof payload.summary === 'string' ? payload.summary.trim() : '';
  const body = typeof payload.body === 'string' ? payload.body : '';
  const tags = normalizeTags(payload.tags);
  const canonical = normalizeCanonical(payload.canonical);
  const updated = normalizeUpdated(payload.updated);
  const slug = ensureSlug(typeof payload.slug === 'string' ? payload.slug : undefined, title);
  const date = formatDate(typeof payload.date === 'string' ? payload.date : undefined);

  if (!title) {
    return respondWithJson(400, { ok: false, message: 'Title is required.' });
  }

  const summaryError = validateSummary(summary);
  if (summaryError) {
    return respondWithJson(400, { ok: false, message: summaryError });
  }

  const bodyError = validateBody(body);
  if (bodyError) {
    return respondWithJson(400, { ok: false, message: bodyError });
  }

  await ensureDirectoryExists(postsDirectory);
  const fileName = `${slug}.mdx`;
  const filePath = path.join(postsDirectory, fileName);

  if (await fileExists(filePath)) {
    return respondWithJson(409, {
      ok: false,
      message: `A post with the slug \"${slug}\" already exists.`
    });
  }

  const frontmatter = buildFrontmatter({ title, summary, date, tags, canonical, updated });
  const contents = `${frontmatter}\n${body.trim()}\n`;

  await writeFile(filePath, contents, 'utf-8');

  return respondWithJson(201, {
    ok: true,
    slug,
    path: `src/content/posts/${fileName}`
  });
};
