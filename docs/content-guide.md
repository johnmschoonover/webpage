# Content Style & MDX Guide

## Voice & Tone Pillars
- **Executive clarity:** Lead with the outcome, quantify impact, and use confident but grounded language.
- **Systems thinking:** Highlight architecture, reliability, and data rigor; explain the "why" behind decisions.
- **Human & collaborative:** Attribute team contributions, avoid jargon overload, and keep sentences readable (target 18–22 words max).
- **Privacy-first:** Reaffirm zero-tracker stance; reference anonymized metrics and redact sensitive data sources.

## Editorial Checklist
1. Start with a one-sentence TL;DR summarizing the value or result.
2. Use active voice and specific verbs (e.g., "drove," "architected," "automated").
3. Quantify impact with concrete metrics (%, latency, throughput) and timeframes.
4. Attribute cross-functional partners where relevant (Security Ops, Data Eng, Legal, etc.).
5. Close with lessons learned or forward-looking callouts.

## MDX Formatting Conventions
- Use **frontmatter** on every MDX file:
  ```yaml
  ---
  title: "Reduce Event Delay by 70%"
  description: "Migrated SIEM ingest to streaming pipeline with deterministic retries."
  publishDate: 2024-04-15
  updatedDate: 2024-05-01
  tags: [siem, data-platform]
  status: published
  heroImage: "../public/images/posts/event-delay/hero.png"
  ogImage: "/images/og/event-delay.png"
  canonical: "https://theschoonover.net/writing/event-delay"
  ---
  ```
- Prefer semantic headings (`##`, `###`) with sentence case. Avoid skipping levels.
- Use MDX components for callouts (`<Callout type="info">`) and figures (`<Figure src="..." caption="..." />`).
- Keep lists under 7 bullets; split into subsections if longer.
- Embed diagrams via `<Figure>` pointing at `/images/...` paths, never relative file system paths.
- For code snippets, use fenced blocks with explicit language (` ```bash `, ` ```ts `). Include comments describing purpose.

## Asset Naming & Storage
- Store hero images under `apps/site/public/images/sections/` and post-specific media under `apps/site/public/images/posts/<slug>/`.
- Screenshots go in `apps/site/public/images/posts/<slug>/screens/` with snake_case filenames (e.g., `alert_pipeline_before.png`).
- SVG diagrams should be optimized with SVGO before commit; include source design files in `/downloads/diagrams/` if needed.
- Audio/video assets live under `apps/site/public/media/` with bitrate documented in asset notes.
- When referencing downloads (CV, speaker kit), link to `/downloads/<file>` so CDN caching works.

## Metadata & SEO Requirements
- Include `summary` and `readingTime` fields where the content model supports them.
- Add `structuredData` export for articles to power JSON-LD helpers.
- Ensure `canonical` matches the production URL; add `redirectFrom` array for legacy paths.
- Provide `excerpt` under 160 characters for meta description.
- Add `lastValidated` date for case studies to prompt periodic refresh.

## Accessibility Expectations
- Every image requires descriptive `alt` text; if decorative, set `alt=""` and `role="presentation"`.
- Provide captions for figures and transcripts for embedded media.
- Ensure link text is descriptive (avoid "click here").
- Use `<VisuallyHidden>` components for additional context where needed (e.g., metric badges).
- Verify color contrast in diagrams; provide high-contrast variants when possible.

## Review & Publishing Workflow
1. Draft MDX in feature branch with associated assets.
2. Run `pnpm lint:content` (to be defined) for frontmatter validation.
3. Request review from Content Owner (Agent B) and Site Owner (John) for narrative and accuracy.
4. Merge once CI passes; publish via standard deploy pipeline.
5. Update `docs/analytics.md` if new events or goals are introduced.

## Content Lifecyle & Refresh Cadence
- **Case Studies:** Review quarterly; ensure metrics and architecture remain accurate.
- **Talks:** Update within 48 hours after new recording or slide deck is available.
- **Writing:** Add `updatedDate` when making substantive edits; annotate changelog at end if context is important.
- **Patents & IP:** Update status immediately upon filing or publication.

## Editorial Resources
- Style reference: Microsoft Writing Style Guide for technical clarity.
- Acronym usage: Spell out on first mention, then use acronym.
- Avoid claims without supporting data; include references or footnotes when citing external research.
