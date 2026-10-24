# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring managers and executive recruiters evaluating John Schoonover for senior security engineering leadership roles (Director / VP tier). They usually arrive from LinkedIn, a resume link, or GitHub, scan quickly, and are deciding whether to advance a conversation. Their job: confirm the scale and credibility of his impact, grab the resume, and reach him.

Secondary (confirmed): senior practitioners in the field who refer to his body of work when giving a recommendation. They need citable, linkable case studies and artifacts rather than a pitch.

The original PRD also names CTO/CISO peers and conference organizers. Those were not confirmed as priority audiences during init.

## Product Purpose

theschoonover.net is John Schoonover's personal brand site. It establishes who he is, proves impact through case studies, in-flight patents, and writing, and gives visitors a direct path to contact and resume download. Success, per the PRD: a fast, accessible, privacy-respecting site where visitors view more than one page and a meaningful share click through to contact.

## Positioning

Security platform leader. John is Director of Engineering – Cybersecurity (SIEM), leading the security telemetry platform (ingestion, enrichment, storage, access) for a Cyber Fusion Center (CFC). The proof a neighboring profile could not copy: planetary-scale SIEM work (70% reduction in controllable event delay across a seven-figure EPS pipeline, >50 sources unified, feed onboarding cut from weeks to under an hour) and two named-inventor patents in flight on criticality-aware drop control and real-time visibility validation.

John chose security-first positioning over the data-platform reframing proposed in SITE_TODO.md. Data-engineering vocabulary may support the story but does not lead it.

## Operating Context

- Visitors mostly scan; the decision window is short. Resume download and contact are the conversion actions.
- Content is Git-driven MDX. Keystatic CMS is mounted at `/keystatic` (GitHub storage in production via the `theschoonover-cms` GitHub App, local storage in dev).
- Canonical data sources: `data/profile.json` (name, tagline, summary, role focus, links, education, disclaimers), `content/data/deliverables.json` (patents), and the `case-studies` and `posts` collections under `apps/site/src/content/`. Surfaces are expected to read from these rather than hard-code copy.
- Hosting: Cloudflare Pages running the Astro SSR worker (`@astrojs/cloudflare`), root `wrangler.toml` is authoritative, preview alias `webpage-bf1.pages.dev`. README, `docs/PRD.md`, and `docs/OPS.md` still describe the earlier Synology RackStation plan and are stale on hosting.
- Routes in production: Home, About, Experience, Case Studies (index + detail), Writing (index + post, RSS), Projects, Deliverables (patents), Contact, Legal, `health.json`.
- Contact form posts to `/api/contact` with validation, an in-memory rate limit, and optional hCaptcha (enabled only when `PUBLIC_HCAPTCHA_SITEKEY` is set). Whether submissions reach an inbox was not verified during init.
- Scoped `AGENTS.md` files under `apps/site/src/`, `components/`, `layouts/`, and each content collection carry per-surface guardrails and a QA loop: `pnpm --filter site build`, responsive sweep at 375 / 768 / 1280px, keyboard test of CTAs.
- CI: `pr-validation.yml` and Dependabot auto-merge; no Lighthouse or axe gate is currently wired despite PRD intent.

## Capabilities and Constraints

- Stack: Astro 7 (server output), React islands, Tailwind CSS 4, shadcn-style components with class-variance-authority, lucide icons, MDX with remark-gfm, KaTeX, Shiki (`github-dark-dimmed`), Chart.js available for post visuals.
- Light and dark themes with a persisted manual toggle (`public/scripts/theme-init.js`).
- Downloads served from `/downloads/`: `resume.pdf`, `john-schoonover-cv.pdf`, `john-schoonover-pgp.asc`, synced from repo-root `downloads/` by `scripts/sync-downloads.mjs`. Download CTAs must carry the HTML `download` attribute.
- Terminology: SIEM, Cyber Fusion Center (CFC), EPS, detection engineering, drop control, "perfect feeds", ingest / enrichment / storage / access, parse-failure resilience, fingerprinting.
- Binding (confirmed by John):
  - Never list a patent as granted or cite a patent number that does not exist. Current statuses are "Patent Pending" and "Patent In-Flight".
  - Location stays at region level ("Minnesota, USA"; "Twin Cities" in captions). No precise geolocation.
- Present in the current build but not confirmed binding during init; treat as current practice that John may change:
  - The hero line "This site is AI-built and human-reviewed."
  - No third-party trackers or analytics; the hCaptcha script is the only third-party asset loaded.
  - GitHub as a tertiary CTA alongside Contact and Resume on brand surfaces (an AGENTS.md convention).
- Undecided or not yet built: first-party analytics (Plausible planned in PRD, not deployed); site search index (planned, not built); Talks and a dedicated Patents page (named in PRD and layout guardrails, not present; patents live under Deliverables); patent application numbers (pending per SITE_TODO.md); contact email delivery path.
- Budgets from PRD and AGENTS.md: Lighthouse Accessibility ≥ 95, Performance 90 to 95+, WCAG 2.2 AA, initial JS ≤ 200KB, fonts preloaded, images responsive and lazy.

## Brand Commitments

- Name: John Schoonover. Site name and wordmark: theschoonover.net (text only; no logo).
- Tagline in canonical data: "Director of Engineering". Full title: "Director of Engineering - Cybersecurity - SIEM".
- Voice (docs/content-guide.md and PRD): executive, technical, outcome-oriented; confident but not boastful; evidence-backed bullets; plain English; attribute team contributions; spell out acronyms on first use.
- Headshot: `apps/site/public/images/headshot-light.jpeg` (light background only; no dark-background variant exists).
- PRD §6 lists brand attributes (reliable, precise, systems-thinking, pragmatic innovator) and suggests a palette and type direction. These are the original PRD's aspirations, not constraints John made binding during init.

## Evidence on Hand

- Published case studies (`apps/site/src/content/case-studies/`): "SIEM at Planetary Scale" (2022–2024), "Multi-SIEM Migration Safeguards" (2017–2020), "Homelab: The Dual-Tap Visibility Strategy" (ongoing). Each carries impact bullets and a hero stat.
- Five more case studies are placeholders marked `internal: true` with "Coming soon" metrics (alert ingest time, bare-metal patterning, broadbase schema validation, ETL monitoring, new rules engine). Never present them as finished work.
- Writing: two "Defeating the Sieve" number-theory posts (2025-11-30, 2025-12-07).
- Patents: two in flight in `content/data/deliverables.json`, with summaries and highlights but no filing numbers.
- Profile facts in `data/profile.json`: 8+ years in cybersecurity, 4+ years leading teams, education (WGU MBA and BS Cybersecurity, AS Physics with honors, UVA physics and mathematics studies), three homelab projects (SecurityOnion/Wazuh stack, Forgejo GitOps, hybrid IaC infrastructure).
- Links: LinkedIn, GitHub (johnmschoonover), public email, PGP key.
- Absent, do not fabricate: employer names or logos, testimonials, talk recordings or abstracts, press, analytics figures, a dark-background headshot, architecture diagram images (none exist under `public/images/` beyond the headshot).

## Product Principles

1. Proof before prose. Every claim on a brand surface ties to a metric, artifact, download, or canonical data field.
2. Scan-first. The primary visitor decides in about a minute; impact, resume, and contact must be reachable from the first viewport on every device.
3. Truth over polish. Placeholders stay labeled, patents stay pending until numbered, and absent evidence is left absent.
4. Security platform leadership is the headline; data-engineering and homelab depth support it rather than compete with it.
5. Data-driven surfaces. Copy and links flow from `profile.json`, `deliverables.json`, and the collections so every page stays in sync.

## Accessibility & Inclusion

WCAG 2.2 AA is the required standard. Keyboard-only flows with a visible skip link and focus states, logical focus order (skip link → nav → command palette → theme toggle → CTA), contrast ≥ 4.5:1, descriptive alt text and figure captions, form errors announced via ARIA. Each scoped AGENTS.md requires a keyboard test before review.
