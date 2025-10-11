# theschoonover.net

This repository contains the source for the theschoonover.net website.

## Getting started

1. Install dependencies (Astro, pnpm, etc.).
2. Configure your environment variables as described below.
3. Run the development server with your preferred package manager (for example, `pnpm dev`).

## Environment configuration

A template named [`.env.example`](./.env.example) lives at the root of the project and enumerates every environment variable used by the site (core site settings, SMTP credentials, hCaptcha keys, Plausible analytics, and optional diagnostics).

To set up your local environment:

```bash
cp .env.example .env
```

Edit `.env` to provide development-safe values. Never commit real secrets—keep the `.env` file local, and rely on deployment-specific secret managers (e.g., GitHub Actions secrets, DSM environment variables) for production credentials.

Refer to the inline comments in `.env.example` for guidance on which values are required versus optional.
