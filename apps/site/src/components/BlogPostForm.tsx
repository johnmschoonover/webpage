import { type FormEvent, useMemo, useState } from 'react';
import { ensureSlug } from '@lib/slugify';
import { cn } from '@lib/utils';

type FormState = {
  title: string;
  summary: string;
  body: string;
  tags: string;
  date: string;
  updated: string;
  canonical: string;
  slug: string;
  token: string;
};

type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string; path: string }
  | { status: 'error'; message: string };

const initialFormState: FormState = {
  title: '',
  summary: '',
  body: '',
  tags: '',
  date: new Date().toISOString().slice(0, 10),
  updated: '',
  canonical: '',
  slug: '',
  token: ''
};

function normalizeTags(tags: string) {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function BlogPostForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submission, setSubmission] = useState<SubmissionState>({ status: 'idle' });

  const derivedSlug = useMemo(() => {
    return ensureSlug(form.slug, form.title);
  }, [form.slug, form.title]);

  const tagList = useMemo(() => normalizeTags(form.tags), [form.tags]);

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ status: 'submitting' });

    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      body: form.body.trim(),
      tags: tagList,
      date: form.date,
      updated: form.updated.trim() || undefined,
      canonical: form.canonical.trim() || undefined,
      slug: form.slug.trim() || undefined
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(form.token ? { Authorization: `Bearer ${form.token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const body = (await response.json()) as { ok: boolean; message?: string; path?: string; slug?: string };

      if (!response.ok || !body.ok) {
        setSubmission({
          status: 'error',
          message: body.message ?? 'The server rejected the post. Please review the fields and try again.'
        });
        return;
      }

      setSubmission({
        status: 'success',
        message: `Draft created for slug “${body.slug ?? derivedSlug}”.`,
        path: body.path ?? ''
      });
      setForm(initialFormState);
    } catch (error) {
      console.error('Failed to publish post', error);
      setSubmission({
        status: 'error',
        message: 'Unexpected error while sending the post. Check your connection and try again.'
      });
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="token" className="text-sm font-medium text-foreground">
            Publisher token
          </label>
          <input
            id="token"
            type="password"
            value={form.token}
            onChange={(event) => updateField('token', event.target.value)}
            placeholder="Optional — required if BLOG_PUBLISH_TOKEN is set"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
          <p className="text-xs text-muted-foreground">
            Stored only in memory and sent with this request. Configure <code>BLOG_PUBLISH_TOKEN</code> to require it.
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-foreground">
            Custom slug
          </label>
          <input
            id="slug"
            value={form.slug}
            onChange={(event) => updateField('slug', event.target.value)}
            placeholder="Optional — defaults to the title"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
          <p className="text-xs text-muted-foreground">Final slug preview: <code>{derivedSlug}</code></p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            required
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="summary" className="text-sm font-medium text-foreground">
            Summary
          </label>
          <textarea
            id="summary"
            required
            value={form.summary}
            onChange={(event) => updateField('summary', event.target.value)}
            className="h-32 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="body" className="text-sm font-medium text-foreground">
          Post body (MDX supported)
        </label>
        <textarea
          id="body"
          required
          value={form.body}
          onChange={(event) => updateField('body', event.target.value)}
          className="min-h-[16rem] w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
        <p className="text-xs text-muted-foreground">
          Write in Markdown or MDX. Uploads assets separately to <code>apps/site/public/images/posts</code>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium text-foreground">
            Publish date
          </label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(event) => updateField('date', event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="updated" className="text-sm font-medium text-foreground">
            Last updated
          </label>
          <input
            id="updated"
            type="date"
            value={form.updated}
            onChange={(event) => updateField('updated', event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="canonical" className="text-sm font-medium text-foreground">
            Canonical URL
          </label>
          <input
            id="canonical"
            type="url"
            value={form.canonical}
            onChange={(event) => updateField('canonical', event.target.value)}
            placeholder="https://example.com/post"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium text-foreground">
          Tags
        </label>
        <input
          id="tags"
          value={form.tags}
          onChange={(event) => updateField('tags', event.target.value)}
          placeholder="leadership, analytics, platform"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
        <p className="text-xs text-muted-foreground">
          Separate tags with commas. Current tags: {tagList.length > 0 ? tagList.join(', ') : 'none yet'}.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="submit"
          disabled={submission.status === 'submitting'}
          className={cn(
            'inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-60'
          )}
        >
          {submission.status === 'submitting' ? 'Saving draft…' : 'Create post draft'}
        </button>
        <div role="status" aria-live="polite" className="text-sm">
          {submission.status === 'success' && (
            <p className="text-emerald-500">
              {submission.message}{' '}
              {submission.path && (
                <>
                  File saved to <code>{submission.path}</code>.
                </>
              )}
            </p>
          )}
          {submission.status === 'error' && <p className="text-destructive">{submission.message}</p>}
        </div>
      </div>
    </form>
  );
}
