// Server-only. Reads Cloudflare runtime bindings at request time. Never fall back to
// import.meta.env for secrets: Vite inlines those values into the build output.
export async function getRuntimeEnv(): Promise<Record<string, string | undefined>> {
  if (!import.meta.env.PROD) return {};
  const { env } = await import('cloudflare:workers');
  return env as Record<string, string | undefined>;
}
