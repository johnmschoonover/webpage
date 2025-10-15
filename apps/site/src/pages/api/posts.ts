import type { APIRoute } from 'astro';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
} as const;

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultPostsDirectory = path.resolve(moduleDirectory, '../../content/posts');

const candidateDirectories = [
  defaultPostsDirectory,
  path.resolve(process.cwd(), 'apps/site/src/content/posts'),
  path.resolve(process.cwd(), 'src/content/posts')
];

async function ensureDirectory(target: string) {
  try {
    await access(target, constants.W_OK);
    return target;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === 'ENOENT') {
      await mkdir(target, { recursive: true });
      return target;
    }

    throw error;
  }
}

function resolvePostsDirectory() {
  for (const directory of candidateDirectories) {
    if (existsSync(directory)) {
      return directory;
    }
  }

  return defaultPostsDirectory;
}

function toArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,\n]/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [];
}

function sanitiseFrontmatter(value: string) {
  return value.replace(/"/g, '\\"').trim();
}

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/['"]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (base) {
    return base;
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  return `post-${timestamp}`;
}

function buildFrontmatter(payload: {
  title: string;
  summary: string;
  tags: string[];
  body: string;
  date?: string;
}) {
  const { title, summary, tags, body, date } = payload;
  const renderedTags = tags.map((tag) => `"${sanitiseFrontmatter(tag)}"`).join(', ');
  const published = date ? new Date(date) : new Date();
  const isoDate = Number.isNaN(published.getTime()) ? new Date() : published;

  const frontmatter = `---\n` +
    `title: "${sanitiseFrontmatter(title)}"\n` +
    `date: ${isoDate.toISOString()}\n` +
    `summary: "${sanitiseFrontmatter(summary)}"\n` +
    `tags: [${renderedTags}]\n` +
    `---\n\n`;

  return frontmatter + `${body.trim()}\n`;
}

async function writePostFile(directory: string, slug: string, contents: string) {
  const targetPath = path.join(directory, `${slug}.mdx`);

  if (existsSync(targetPath)) {
    return {
      ok: false,
      status: 409,
      body: {
        ok: false,
        message: `A post with the slug “${slug}” already exists.`,
        slug
      }
    } as const;
  }

  await writeFile(targetPath, contents, 'utf8');

  return {
    ok: true,
    status: 201,
    body: {
      ok: true,
      slug,
      path: targetPath
    }
  } as const;
}

function parseBody(record: Record<string, unknown>) {
  const title = typeof record.title === 'string' ? record.title.trim() : '';
  const summary = typeof record.summary === 'string' ? record.summary.trim() : '';
  const body = typeof record.body === 'string' ? record.body : '';
  const tags = toArray(record.tags);
  const date = typeof record.date === 'string' ? record.date : undefined;
  const slugOverride = typeof record.slug === 'string' ? record.slug.trim() : undefined;

  const errors: Record<string, string> = {};

  if (!title) {
    errors.title = 'Title is required.';
  }

  if (!summary) {
    errors.summary = 'Summary is required.';
  }

  if (!body.trim()) {
    errors.body = 'Body content is required.';
  }

  if (tags.length === 0) {
    errors.tags = 'At least one tag is required.';
  }

  if (slugOverride && !/^[-a-z0-9]+$/.test(slugOverride)) {
    errors.slug = 'Slug may only include lowercase letters, numbers, and hyphens.';
  }

  return {
    errors,
    post: {
      title,
      summary,
      body,
      tags,
      date,
      slug: slugOverride || slugify(title)
    }
  } as const;
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';

  if (!/application\/json/i.test(contentType)) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Unsupported content type. Expecting application/json.' }),
      { status: 415, headers: JSON_HEADERS }
    );
  }

  let payload: Record<string, unknown>;

  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ ok: false, message: 'Invalid JSON payload.' }), {
      status: 400,
      headers: JSON_HEADERS
    });
  }

  const { errors, post } = parseBody(payload);

  if (Object.keys(errors).length > 0) {
    return new Response(
      JSON.stringify({ ok: false, message: 'Validation failed.', errors }),
      { status: 422, headers: JSON_HEADERS }
    );
  }

  const targetDirectory = resolvePostsDirectory();

  try {
    const directory = await ensureDirectory(targetDirectory);
    const frontmatter = buildFrontmatter(post);
    const result = await writePostFile(directory, post.slug, frontmatter);

    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: JSON_HEADERS
    });
  } catch (error) {
    console.error('Failed to write blog post', error);
    return new Response(
      JSON.stringify({ ok: false, message: 'Failed to persist blog post content.' }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
};

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ ok: false, message: 'Method not allowed. Use POST to submit content.' }), {
    status: 405,
    headers: {
      ...JSON_HEADERS,
      Allow: 'POST'
    }
  });
