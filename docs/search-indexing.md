# Search & Indexing Guide

## Overview
This document describes how on-site search, tagging, and external indexing operate for `theschoonover.net`. The goal is to keep local search responsive while ensuring major search engines index the right canonical content with structured data support.

## Architecture
- **Static Index Build:** Astro content collections export JSON that feeds a MiniSearch index built during `pnpm build`.
- **Client Delivery:** The generated `search-index.json` ships to `/public/data/` and loads lazily when users engage the command palette or search bar.
- **Fields Indexed:** `title`, `summary`, `body`, `tags`, `category`, `publishDate`, `lastUpdated`, `slug`.
- **Ranking Strategy:** Weighted fields (title 5x, tags 3x, summary 2x, body 1x). Recent content gets freshness boost (publish date within 180 days).
- **Synonyms & Stemming:** Maintain `apps/site/src/lib/search/synonyms.json` for term mappings (e.g., `siem` ↔ `security analytics`). Use MiniSearch stemming for English.

## Build & Rebuild Steps
1. Ensure content frontmatter includes `tags`, `summary`, and `status` fields.
2. Run local build: `pnpm build`.
3. Confirm `dist/data/search-index.json` generated and includes new entries (`jq '.entries | length' dist/data/search-index.json`).
4. Commit updated content and index seeds if they live in repo (for static export).
5. Deploy via standard pipeline; CDN cache purges automatically via DSM reverse proxy reload.

### CI Integration
- CI workflow runs `pnpm test:search` (to be added) to validate schema and ensure no empty fields.
- Fails build if duplicate slugs or missing canonical URLs are detected.
- Uploads `search-index.json` as artifact for QA spot checks.

## Operational Playbook
- **Cache Busting:** Append build hash query parameter when fetching index (`/data/search-index.json?v=<hash>`).
- **Access Controls:** Ensure index omits drafts (`status: draft`) by filtering during build.
- **Security:** Do not include contact information or private notes in searchable fields.
- **Localization (future):** Partition index by locale once i18n lands (e.g., `/data/search-index.en.json`).

## Troubleshooting Matrix
| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| Search returns no results | Fetch failure or empty index | Check network tab; verify `search-index.json` served with `200`. Rebuild index via `pnpm build` and redeploy. |
| Draft content appearing | `status` filter missing | Ensure build script excludes `status !== 'published'`. Add unit test coverage. |
| Stale search results | CDN caching old index | Bump version hash, purge DSM reverse proxy cache, redeploy. |
| Missing new content | Frontmatter fields incomplete | Confirm `title`, `summary`, `tags`, `slug` present; rerun build. |
| Search relevance off | Weighting misconfigured | Adjust MiniSearch weighting in `apps/site/src/lib/search/config.ts` and rerun regression tests. |
| Command palette errors | JSON parse error | Validate index JSON via `pnpm lint` and ensure no trailing commas. |

## External Search Engine Indexing
- Submit XML sitemap (`/sitemap-index.xml`) to Google/Bing via Search Console/Bing Webmaster Tools.
- Ensure canonical URLs in head metadata; avoid duplicate content between case studies and downloads.
- Maintain structured data exports (Person, Article, Breadcrumb) to assist rich results.
- Monitor coverage reports monthly and log actions in `docs/OPS.md`.
- Use `robots.txt` to disallow staging domains; production should allow all.

## Disaster Recovery
If index build fails or file becomes corrupted in production:
1. Restore last known good `search-index.json` from backup (`/volume1/backups/site/data/`).
2. Place file into `/volume1/docker/site/dist/data/` and restart site container.
3. Investigate build logs for errors (missing fields, JSON serialization issues).
4. Document incident in `docs/OPS.md` and schedule follow-up to add regression tests.

## Ownership
- **Primary:** Agent A (App Scaffold & Search maintainer).
- **Secondary:** Agent B (Content) for tagging taxonomy.
- **Escalation:** Notify Agent E if deployment automation needs fixes.
