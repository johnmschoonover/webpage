import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';

const initialForm = {
  title: '',
  summary: '',
  tags: '',
  body: '',
  date: ''
};

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

type ApiResponse = {
  ok: boolean;
  message?: string;
  slug?: string;
  errors?: Record<string, string>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"`]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function BlogPostForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const slug = useMemo(() => slugify(form.title) || 'post-preview', [form.title]);

  function updateField(key: keyof typeof initialForm) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus('submitting');
    setMessage(null);
    setFieldErrors({});

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          summary: form.summary,
          body: form.body,
          tags: form.tags,
          date: form.date || undefined
        })
      });

      const payload = (await response.json()) as ApiResponse;

      if (!response.ok || !payload.ok) {
        setStatus('error');
        setMessage(payload.message ?? 'Failed to create blog post.');
        setFieldErrors(payload.errors ?? {});
        return;
      }

      setStatus('success');
      setMessage(`Post saved! Slug: ${payload.slug ?? slug}`);
      setForm(initialForm);
    } catch (error) {
      console.error('Blog post submission failed', error);
      setStatus('error');
      setMessage('An unexpected error occurred while saving the post.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={updateField('title')}
          required
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        {fieldErrors.title ? (
          <p className="text-sm text-rose-600" role="alert">
            {fieldErrors.title}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="summary">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          value={form.summary}
          onChange={updateField('summary')}
          rows={3}
          required
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        {fieldErrors.summary ? (
          <p className="text-sm text-rose-600" role="alert">
            {fieldErrors.summary}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="tags">
          Tags <span className="font-normal text-slate-500">(comma or newline separated)</span>
        </label>
        <textarea
          id="tags"
          name="tags"
          value={form.tags}
          onChange={updateField('tags')}
          rows={2}
          placeholder="leadership, strategy"
          required
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        {fieldErrors.tags ? (
          <p className="text-sm text-rose-600" role="alert">
            {fieldErrors.tags}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="date">
          Publish date <span className="font-normal text-slate-500">(optional ISO string)</span>
        </label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={updateField('date')}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="body">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          value={form.body}
          onChange={updateField('body')}
          rows={12}
          required
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        {fieldErrors.body ? (
          <p className="text-sm text-rose-600" role="alert">
            {fieldErrors.body}
          </p>
        ) : null}
      </div>

      <p className="text-sm text-slate-500">Slug preview: <span className="font-mono text-slate-700 dark:text-slate-300">{slug}</span></p>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {status === 'submitting' ? 'Saving…' : 'Save post'}
      </button>

      <div aria-live="polite" className="min-h-[1.5rem] text-sm">
        {message ? (
          <span className={status === 'error' ? 'text-rose-600' : 'text-emerald-600'}>{message}</span>
        ) : null}
      </div>
    </form>
  );
}
