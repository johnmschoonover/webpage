export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function ensureSlug(value: string | undefined, fallback: string) {
  const fromValue = value ? slugify(value) : '';
  if (fromValue) return fromValue;

  const fromFallback = slugify(fallback);
  if (fromFallback) return fromFallback;

  return 'post-draft';
}
