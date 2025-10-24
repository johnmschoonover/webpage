# Product Requirements Document (PRD)

**Product:** Personal Brand Website for John Schoonover
**Domain:** `theschoonover.net`
**Host:** Synology RackStation (DSM) behind home network; reverse proxy + TLS
**Primary Persona:** Director/Head of Cybersecurity Engineering & Data Platforms (SIEM/CFC)
**Secondary Personas:** Recruiters, CTO/CISO peers, conference organizers, collaborators

---

## 1) Goals & Non‑Goals

### 1.1 Goals

* Present a crisp, executive‑level personal brand: strategic cybersecurity leader, platform engineer, patent innovator.
* Showcase impact: case studies (SIEM at scale, dual‑SIEM posture, real‑time visibility), patents/IDFs, talks, writing.
* Provide an **easy path to contact** and **downloadable one‑pager/CV**.
* Be **fast, accessible, and privacy‑respecting**. No heavy trackers; first‑party analytics.
* Be **easy to maintain** via Markdown/MDX content and Git‑based workflow.

### 1.2 Non‑Goals

* No community forum or user accounts at launch.
* No complex CMS admin UI (prefer Git‑driven content for GA).
* No e‑commerce in GA (leave room for future consulting bookings).

---

## 2) Success Metrics

* **Performance:** LCP ≤ 1.8s, CLS ≤ 0.1, TBT ≤ 200ms on mid‑tier mobile; 95+ Lighthouse Perf.
  * **Measurement:** Lighthouse CI mobile run on each PR and nightly cron; quarterly WebPageTest lab audits.
  * **Data sources:** GitHub Actions artifacts, Plausible custom `performance.lcp` event.
  * **Reporting cadence:** Weekly summary captured in `docs/analytics.md`; regressions escalated to Agent F.
* **Accessibility:** WCAG 2.2 AA; 95+ Lighthouse Accessibility.
  * **Measurement:** axe-core CI suite plus manual keyboard sweep before each release.
  * **Data sources:** GitHub Actions accessibility report, issue tracker with `a11y` label.
  * **Reporting cadence:** Included in bi-weekly ops review; blockers must be resolved pre-deploy.
* **SEO:** Core pages indexed; 80+ Lighthouse SEO; proper structured data.
  * **Measurement:** Lighthouse CI SEO audit, Google Search Console coverage, Schema validator spot checks.
  * **Data sources:** Search Console property for `theschoonover.net`, CI artifacts.
  * **Reporting cadence:** Monthly SEO health check logged in `docs/OPS.md`.
* **Engagement:** ≥ 60% of visitors view 2+ pages; ≥ 2% contact CTR (CTA clicks / sessions).
  * **Measurement:** Plausible events `pageview`, `cta_contact_click`, `download_cv`, plus goal funnel for multi-page sessions.
  * **Data sources:** Plausible dashboard exports (CSV) aggregated in shared sheet/Notion.
  * **Reporting cadence:** Monthly executive summary for John; anomalies reviewed within 48h.

---

## 3) Audience & Narrative

* **Recruiters / execs:** Want quick signal: who you are, 3–5 signature wins, CV download, contact.
* **Peers (CTO/CISO/Head of Eng):** Want tangible depth: architecture diagrams, migration stories, metrics.
* **Conference organizers:** Want speaker bio, talk abstracts, prior recordings, headshot kit.

**Voice & Tone:** Executive, technical, outcome‑oriented; confident but not boastful. Evidence‑backed bullets; plain English.

---

## 4) Information Architecture (GA)

* **Home** – Hero, value prop, featured case studies, patents, writing, talks, contact CTA.
* **About** – Bio (short/long), leadership philosophy, headshot(s), quick stats, values.
* **Experience / CV** – Printable resume, downloadable PDF; highlights with impact metrics.
* **Case Studies** – 3–6 in‑depth writeups (SIEM at scale, dual‑SIEM migration, enrichments‑at‑scale, replacement rules engine, real‑time operational visibility, patent pipeline). Each with problem → approach → architecture → results.
* **Writing** – Articles, notes, external posts; tag by topic (SIEM, data eng, AI/ML ops, leadership).
* **Talks & Media** – Conference abstracts, slides, recordings, speaker kit.
* **Patents & IP** – Filed/pending concepts and high‑level summaries; responsible disclosure stance.
* **Contact** – Secure contact form + alternative channels (LinkedIn, email, PGP key).
* **Legal** – Privacy, cookies, licensing.

**Future (Backlog):** Newsletter (first‑party), consulting page, booking links, reading list, D&D/creative section as optional personal touch.

---

## 5) Content Requirements

### 5.1 Home (sample content models)

* **Hero:** Name, title ("Director of Cybersecurity Engineering — SIEM & CFC"), one‑sentence value prop, primary CTA (Contact) + secondary CTA (Download CV).
* **Stats Row:** Uptime, event delay reduction, scale metrics, patent applications, org size.
* **Featured Case Studies:** 3 cards with title, 2–3 bullets, badge metrics, link to full case study.
* **Writing/Talks Teaser:** Latest 3 posts and 2 talks.
* **Logos Row (optional):** Conferences/platforms (as monochrome marks with permission).

### 5.2 Case Study Template

* Header: title, timeframe, tags, TL;DR.
* Problem: context, constraints.
* Approach: architecture diagram, team, decisions/tradeoffs.
* Implementation: tech stack, process, milestones.
* Results: metrics with before/after, graphs.
* Lessons: what changed, what you’d do differently.

### 5.3 Resume/CV

* Executive summary; core competencies; roles with quantified impact; selected patents; talks; education; skills matrix.

### 5.4 Writing/Talks

* MDX posts; code and diagrams support; canonical URLs; social preview images.

---

## 6) Brand & Design System

* **Brand Attributes:** reliable, precise, systems‑thinking, pragmatic innovator.
* **Color:** Neutral base (charcoal/ink), accent (electric blue/teal), success (emerald). Provide light/dark themes.
* **Typography:** Headings: geometric sans; Body: humanist sans/serif with excellent legibility. Use variable fonts.
* **Components:**

  * App shell: responsive nav, footer with contact + socials.
  * Hero, Stat badges, Card, Timeline, Tag, Pill buttons, Callout, Figure with caption, Code block, Accordion.
  * Case study layout with sticky ToC and reading progress.
* **Imagery:** Professional headshots (light/dark backgrounds), architecture diagrams (clean, consistent notation), auto‑generated social cards.

---

## 7) Functional Requirements (MVP)

* Static or hybrid site with MDX content.
* Site‑wide search and tag filters powered by a build-time generated MiniSearch index (JSON emitted to `public/search-index.json`) hydrated client-side with `@minisearch/mini-search`; no external services.
* **Contact Form:** protected by hCaptcha; server endpoint with email relay.
* **Downloadables:** CV (PDF), one‑pager (PDF), speaker kit ZIP.
* **Dark/Light Mode:** system preference + manual toggle; persisted.
* **Analytics:** first‑party (Plausible self‑hosted) with cookieless tracking.
* **Sitemap & Feeds:** XML sitemap, RSS/Atom for writing.
* **Structured Data:** `Person`, `Article`, `BreadcrumbList`, `Organization` where relevant.
* **Open Graph/Twitter cards:** dynamic OG image generation per page.

**Nice‑to‑Have (Near‑term):**

* Print‑optimized resume and case studies (CSS @media print).
* Reading time and progress indicator.
* Command‑K quick finder.

---

## 8) Non‑Functional Requirements

* **Performance Budget:**

  * No JS > 200KB initial; fonts preloaded; images lazy‑loaded; responsive images; HTTP/2 or HTTP/3.
* **Accessibility:**

  * Keyboard‑only flows; focus-visible; ARIA landmarks; color contrast ≥ 4.5:1; captions/transcripts for media.
* **Security:**

  * HTTPS everywhere; HSTS; CSP (script/style/img/frame-src allowlists); referrer‑policy; X‑Content‑Type‑Options; basic rate limiting on form endpoint; secrets via env vars only.
* **Privacy:**

  * No third‑party ads; no cross‑site trackers; clear privacy statement; DNT honored.
* **Reliability:**

  * Uptime monitoring (Uptime Kuma container) with notifications; graceful degradation without JS.

---

## 9) Tech Stack & Architecture

### 9.1 Recommendation (GA)

* **Framework:** Astro (content‑first, ultra‑fast) with MDX + React islands *or* Next.js (static export where possible).
* **Styling:** Tailwind CSS + shadcn/ui for accessible components; Icons via lucide.
* **Content:** Markdown/MDX in `content/` with front‑matter; image assets in `public/`.
* **Runtime:** Node.js 20.11.x LTS (DSM-compatible); pin via `.nvmrc` and CI.
* **Package Manager:** pnpm 10.19.0 with `pnpm-lock.yaml` committed and enforced via Corepack.
* **Analytics:** Self‑hosted Plausible (Docker on RackStation) or lightweight serverless endpoint.
* **Forms:** Next.js / Astro endpoint + nodemailer (SMTP to Synology MailPlus) or Cloudflare Email Routing; hCaptcha for bot protection.
* **Diagrams:** `@mermaid-js/mermaid` or `kroki` static renders during build.

### 9.2 Alternative (Backlog)

* Headless CMS (Sanity/Contentlayer) if content volume grows; retain Git‑based workflow until needed.

### 9.3 SEO & Metadata

* Canonical URLs; robots.txt; meta tags; JSON‑LD via component; OG image generation function.

---

## 10) Deployment on Synology RackStation

* **Containerized runtime** via Docker Compose on DSM.
* **Reverse Proxy:** DSM Application Portal → Reverse Proxy to expose `theschoonover.net` → container; HTTP → HTTPS redirect.
* **TLS:** Let’s Encrypt via DSM; enable HSTS.
* **Static Assets:** Served from container (nginx) or the app framework.
* **IPv6:** Enable if available; AAAA record.
* **Backups:** Nightly backup of repo + `content/` to another NAS volume/cloud.
* **Hardware constraints:** Synology RackStation (Intel Atom C3538, 12GB RAM for Docker, 4TB SSD pool, 200Mbps symmetrical uplink); size containers ≤512MB app / ≤2GB Plausible, retain 20% headroom.
* **Traffic assumptions:** ≤50 concurrent sessions, ~5 req/s peak; prioritize static export to stay within CPU budget.

### 10.1 Example `docker-compose.yml`

Services: `web` (Astro/Next container), `plausible` (optional), `mail-relay` (if used).

### 10.2 Reverse Proxy & Security Headers (nginx snippet)

* Strict `Content-Security-Policy` (allow self + plausible subdomain if used).
* `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 11) CI/CD & Repository

* **Repo Structure:**

```
/ (repo root)
  ├─ apps/site/ (Astro or Next.js app)
  ├─ content/ (mdx: posts, case‑studies, talks)
  ├─ public/ (images, downloads)
  ├─ infra/
  │   ├─ docker-compose.yml
  │   └─ nginx/ (conf, CSP)
  ├─ scripts/
  │   ├─ build.sh
  │   └─ deploy.sh (rsync/ssh to RackStation)
  ├─ docs/
  │   └─ PRD.md (this document)
  └─ .github/workflows/deploy.yml
```

* **Build:** `pnpm install && pnpm build` (Astro/Next).
* **Deploy:** GitHub Actions on `main` → build → `rsync` artifacts via SSH to RackStation Docker bind mount or trigger Portainer/Watchtower to pull latest image.
* **Secrets:** Stored as repo secrets (SSH key, SMTP creds, hCaptcha secret).

### 11.4 Documentation Deliverables

* **`docs/OPS.md`:** Deployment runbook (DSM reverse proxy steps, Docker Compose commands), backup/restore procedures, incident response contacts, environment variable registry, rollback plan. *Owner:* Infra lead (Agent E) with QA review (Agent F).
* **`docs/CONTENT_GUIDE.md`:** Voice/tone pillars, MDX frontmatter checklist, asset storage conventions (public paths), accessibility requirements (alt text, captions). *Owner:* Content lead (Agent B) with John approval.
* **`docs/analytics.md`:** Event taxonomy for success metrics, dashboard links, reporting cadence, data retention policy. *Owner:* QA/Analytics (Agent F).
* **`docs/search-indexing.md`:** MiniSearch build pipeline, rebuild command, troubleshooting matrix, ownership for re-indexing. *Owner:* App scaffold lead (Agent A).
* **Review checklist:** Prior to launch ensure docs updated, cross-linked from README, and owners tagged in PR reviews.

---

## 12) Integrations

* **Identity Links:** LinkedIn, GitHub, Google Scholar/Patents.
* **Contact:** mailto: with obfuscation, contact form with hCaptcha, PGP public key download.
* **Social Cards:** OG images per page; favicon + touch icons; webmanifest.

---

## 13) Accessibility & Internationalization

* Ensure semantic HTML, heading order, alt text, visible skip links.
* English GA; structure for future i18n (route‑based locales, i18n JSON).

---

## 14) Observability & Ops

* **Logging:** Access logs in container volume; error logs with rotation.
* **Monitoring:** Uptime Kuma (Docker) checks `/` and `/health`.
* **Health Endpoint:** `/health` returns app version + 200.

---

## 15) Legal & Compliance

* Privacy page (data we collect = minimal); cookie notice only if adding non‑essential cookies later.
* License for site content (default © with permissions for sharing posts under CC BY‑NC if desired).

---

## 16) Acceptance Criteria (GA)

* Pages implemented: Home, About, Experience/CV, Case Studies (min 3), Writing index + 1 post, Talks & Media, Patents & IP, Contact, Legal.
* Passes Lighthouse (Mobile) ≥ 90 in Perf/SEO/Best Practices and ≥ 95 in Accessibility.
* Valid structured data (Rich Results test passes for Person/Article/Breadcrumb).
* Contact form delivers to configured email and logs server‑side events.
* CI/CD builds on push to `main` and deploys to RackStation; rollback available (previous container image retained).
* TLS with valid cert; HTTP→HTTPS enforced; HSTS active.

---

## 17) Backlog (Post‑GA)

* Consulting & advisory page with tiered offerings and intake form.
* Newsletter with double opt‑in (self‑hosted list, no tracking pixels).
* Case study PDF exporter.
* Interactive architecture galleries (zoom/pan diagrams).
* Talks calendar + proposal builder.

---

## 18) Risks & Mitigations

* **Home hosting availability:** Use Uptime Kuma alerts; optionally put Cloudflare proxy in front.
* **Email deliverability:** Use authenticated SMTP (SPF/DKIM), or third‑party relay.
* **Content drift / staleness:** Quarterly review reminder; show “last updated” on pages.

---

## 19) Deliverables for Codex

1. **Scaffold** Astro (or Next) project with MDX support, Tailwind, shadcn/ui.
2. **Pages & layouts** per IA with components (Hero, Stats, Card, Timeline, CaseStudyLayout, PostLayout, OG image generator).
3. **Content seeds**: 3 case studies (stubbed), 1 blog post, resume/CV page, patents index, talks index, contact form.
4. **Infra**: `docker-compose.yml`, nginx conf with headers & CSP, DSM reverse proxy instructions (README).
5. **CI/CD**: GitHub Actions workflow to build and deploy to RackStation via SSH/rsync or container image push + Watchtower.
6. **Analytics**: Optional Plausible container + snippet or self‑hosted endpoint stub.
7. **Testing**: Playwright/Lighthouse CI script; axe-core accessibility checks.
8. **Docs**: `README.md` (local dev, build, deploy), `docs/PRD.md` (this), `docs/CONTENT_GUIDE.md` (how to write MDX), `docs/OPS.md` (backups, monitoring).

---

## 20) Copy Prompts (Seeds)

* **Value Prop (Home):** “Cybersecurity engineering leader building reliable, data‑driven platforms that scale—turning ambiguity into resilient systems and measurable results.”
* **CTA:** “Let’s talk” / “Download CV”.
* **Case Study Metrics (example):** “Reduced controllable event delay by 70%”, “Achieved 100% uptime over X months”, “Designed dual‑SIEM migration covering N sources / M BPS”.

---

> **Hand‑off Note for Codex:** Use this PRD to generate the repo, scaffold pages/components, create seed content in MDX, wire up CI/CD, and ship a Dockerized site ready for DSM reverse proxy at `theschoonover.net`. Ensure Lighthouse and a11y checks pass in CI before deploy.
