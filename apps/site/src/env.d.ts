/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@astrojs/image/client" />

interface ImportMetaEnv {
  readonly PUBLIC_HCAPTCHA_SITEKEY?: string;
  readonly HCAPTCHA_SECRET?: string;
  readonly CONTACT_RATE_LIMIT_MAX?: string;
  readonly CONTACT_RATE_LIMIT_WINDOW_MS?: string;
  readonly BLOG_PUBLISH_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
