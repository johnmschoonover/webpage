import type { APIRoute } from 'astro';
import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import keystaticConfig from '../../../../keystatic.config';
import { getRuntimeEnv } from '../../../lib/server-env';

export const prerender = false;

// @keystatic/astro 5.x reads context.locals.runtime.env, which @astrojs/cloudflare
// removed in Astro v6+ (the getter now throws). This file-based route takes priority
// over the integration-injected one and passes the env explicitly instead.
// Remove once @keystatic/astro supports Astro 7.

export const ALL: APIRoute = async (context) => {
  const envVars = await getRuntimeEnv();
  const handler = makeGenericAPIRouteHandler(
    {
      config: keystaticConfig,
      clientId: envVars.KEYSTATIC_GITHUB_CLIENT_ID ?? import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID,
      // Secrets come only from the runtime env (local storage mode needs none in dev).
      clientSecret: envVars.KEYSTATIC_GITHUB_CLIENT_SECRET,
      secret: envVars.KEYSTATIC_SECRET,
    },
    { slugEnvName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG' }
  );
  const { body, headers, status } = await handler(context.request);
  return new Response(body as BodyInit | null, { status, headers: headers as HeadersInit });
};
