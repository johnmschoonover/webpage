import type { APIRoute } from 'astro';
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import keystaticConfig from '../../../../keystatic.config';

export const prerender = false;

// @keystatic/astro 5.x reads context.locals.runtime.env, which @astrojs/cloudflare
// removed in Astro v6+ (the getter now throws). This file-based route takes priority
// over the integration-injected one and passes the env explicitly instead.
// Remove once @keystatic/astro supports Astro 7.
async function getCloudflareEnv(): Promise<Record<string, string | undefined>> {
  if (!import.meta.env.PROD) return {};
  const { env } = await import('cloudflare:workers');
  return env as Record<string, string | undefined>;
}

export const ALL: APIRoute = async (context) => {
  const envVars = await getCloudflareEnv();
  const handler = makeGenericAPIRouteHandler(
    {
      config: keystaticConfig,
      clientId: envVars.KEYSTATIC_GITHUB_CLIENT_ID ?? import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID,
      clientSecret:
        envVars.KEYSTATIC_GITHUB_CLIENT_SECRET ?? import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
      secret: envVars.KEYSTATIC_SECRET ?? import.meta.env.KEYSTATIC_SECRET,
    },
    { slugEnvName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG' }
  );
  const { body, headers, status } = await handler(context.request);
  return new Response(body, { status, headers: headers as HeadersInit });
};
