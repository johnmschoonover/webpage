# Monthly Dependency Maintenance Report

## Summary
Updated all dependencies across the workspace using `pnpm update -r --latest`.
No major version jumps were found.

## Minor/Patch Version Bumps

*   `@astrojs/cloudflare`: `^14.1.1` -> `^14.1.2`
*   `@keystatic/astro`: `^5.1.0` -> `^5.2.0`
*   `@keystatic/core`: `^0.5.50` -> `^0.5.51`
*   `astro`: `^7.0.6` -> `^7.0.7`
*   `lucide-react`: `^1.23.0` -> `^1.24.0`
*   `postcss`: `^8.5.16` -> `^8.5.17`
*   `@types/node`: `^26.1.0` -> `^26.1.1`
*   `wrangler`: `^4.107.0` -> `^4.110.0`

## Conflicts and Diagnoses
During the update, `@astrojs/check@0.9.9` reported an unmet peer dependency:
```
apps/site
└─┬ @astrojs/check 0.9.9
  └── ✕ unmet peer typescript@"^5.0.0 || ^6.0.0": found 7.0.2
```
This was caused by updating typescript to `7.0.2`, which is currently unreleased for stable versions and was installed from `latest` dist-tag for testing by typescript team. We fixed it by pinning the typescript dependency using:
`pnpm --filter site add -D typescript@^6.0.0`

## Build Verification
Build completed successfully via `pnpm --filter site build` and typescript checks passed with `pnpm --filter site exec astro check`. Visual verification generated via Playwright script as required.