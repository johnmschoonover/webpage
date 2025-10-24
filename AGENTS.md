# AGENTS.md — Build & Ship Plan for `theschoonover.net`

> **Purpose:** Step‑by‑step instructions for Codex to generate a production‑grade personal brand website for John Schoonover and deploy it to a Synology RackStation at `theschoonover.net`.

---

## 0) Guiding Principles

* **Fast, accessible, private by default.** Lighthouse 90+/95+ a11y. No third‑party trackers.
* **Git‑driven content.** MDX + static export where feasible.
* **Small, composable PRs.** Parallelize by surface area.
* **Automate checks.** CI runs typecheck, build, lint, a11y, Lighthouse CI.

---

## 1) Tech Stack

* **Framework:** Astro (content‑first, MDX) with React islands. (Alt: Next.js static export.)
* **Styles:** Tailwind CSS + shadcn/ui, lucide icons.
* **Content:** MD/MDX in `/content`. Images in `/public`. OG image generator.
* **Runtime:** Node.js 20.11.x LTS (align with `node` Docker base image for Synology compatibility).
* **Package Manager:** pnpm 10.19.0. Keep the workspace `packageManager` field authoritative and ensure every CI workflow (e.g., `deploy.yml`) installs the same pnpm release—either by pinning the version in `pnpm/action-setup` or delegating to Corepack—before running `pnpm install --frozen-lockfile`.
* **Analytics (optional):** Self‑hosted Plausible via Docker.
* **Forms:** API route with nodemailer to SMTP relay (Synology MailPlus or env‑provided SMTP). hCaptcha.

---

## 2) Target Repo Layout

```
/ (repo root)
  ├─ apps/site/               # Astro app
  │   ├─ src/
  │   │   ├─ components/
  │   │   ├─ layouts/
  │   │   ├─ pages/
  │   │   ├─ lib/
  │   │   └─ styles/
  │   ├─ public/
  │   └─ astro.config.mjs
  ├─ content/                 # MDX content (posts, case studies, talks)
  │   ├─ case-studies/
  │   ├─ posts/
  │   ├─ talks/
  │   └─ data/                # JSON/TS seed data (timeline, stats)
  ├─ downloads/               # CV PDF, one‑pager, PGP key, speaker kit
  ├─ infra/
  │   ├─ docker-compose.yml
  │   ├─ nginx/
  │   │   └─ site.conf
  │   └─ plausible/ (optional)
  ├─ .github/workflows/
  │   └─ deploy.yml
  ├─ docs/
  │   ├─ PRD.md
  │   └─ OPS.md
  ├─ package.json
  ├─ pnpm-lock.yaml
  └─ README.md
```

---

## 3) Agents & Parallelization Plan

### Agents

* **Agent A — App Scaffold & Design System**

  * Initialize Astro + Tailwind + shadcn/ui.
  * Global theming (light/dark), typography scale, color tokens.
  * Shared components: `Hero`, `StatBadge`, `Card`, `Timeline`, `Tag`, `Button`, `Callout`, `Figure`, `CodeBlock`, `ReadingProgress`, `CommandK`.

* **Agent B — Content Model & MDX Pipelines**

  * MDX config, remark/rehype plugins (slug, autolink, footnotes).
  * Content collections (Zod schemas) for posts/case studies/talks.
  * JSON‑LD helpers (`Person`, `Article`, `BreadcrumbList`).

* **Agent C — Pages & Routing**

  * Pages: Home, About, Experience/CV, Case Studies index+detail, Writing index+post, Talks & Media, Patents & IP, Contact, Legal.
  * OG image generation (Satori/resvg or astro‑og‑image).

* **Agent D — Forms & Email**

  * Contact API (`/api/contact`), hCaptcha verify, spam throttling, nodemailer SMTP relay.
  * Server‑side logging and error handling.

* **Agent E — Infra (Docker, DSM, Reverse Proxy)**

  * Dockerfile + `docker-compose.yml`.
  * Nginx conf with HSTS, CSP, security headers. Readme for DSM reverse proxy.

* **Agent F — CI/CD & QA**

  * GitHub Actions: install/build/test/lint/a11y/LHCI.
  * Artifact upload; deploy via SSH/rsync or container push + Watchtower.

### Parallelization

1. Agents A, B, E, F start in parallel (scaffold, content model, infra, CI).
2. Agent C builds pages using A/B primitives.
3. Agent D integrates once C has Contact page.

---

## 4) Issues & PR Workflow

* Create GitHub labels: `feat`, `fix`, `infra`, `content`, `a11y`, `perf`, `docs`.
* Conventional commits; one scope per PR; size S/M.
* Branch protection: required checks (typecheck, build, test, a11y, LHCI).

---

## 5) Environment & Secrets

* `SITE_URL` (e.g., [https://theschoonover.net](https://theschoonover.net))
* `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
* `HCAPTCHA_SECRET`, `HCAPTCHA_SITEKEY`
* `PLAUSIBLE_DOMAIN` (optional)

Add `.env.example`; never commit real secrets.

---

## 6) Acceptance Gates (per PR)

* `pnpm typecheck` and `pnpm build` succeed.
* `pnpm test` (unit) and `pnpm a11y` (axe) pass.
* Lighthouse CI ≥ 90 Perf/SEO/Best; ≥ 95 Accessibility (mobile).

---

## 7) Tasks (each = separate PR unless noted)

### 7.1 Bootstrap & Design System (Agent A)

* [ ] `pnpm dlx create-astro@latest apps/site` (or template).
* [ ] Add Tailwind; configure dark mode with `class`.
* [ ] Add shadcn/ui; set primary/neutral scales.
* [ ] Global layout, header, footer, nav, theme toggle, skip links.

### 7.2 Content Model (Agent B)

* [ ] Setup `@astrojs/mdx`, content collections with Zod.
* [ ] Create schemas: `post`, `caseStudy`, `talk`.
* [ ] Remark/rehype plugins and code highlighting.

### 7.3 Pages (Agent C)

* [ ] Home: hero, stats, featured case studies, recent posts/talks, CTAs.
* [ ] About: bio (short/long), headshots, values.
* [ ] Experience/CV: printable layout + link to PDF; skills matrix.
* [ ] Case Studies: index + detail page (sticky ToC, reading progress).
* [ ] Writing: index + post; tags & pagination.
* [ ] Talks & Media: abstracts, links, speaker kit.
* [ ] Patents & IP: list + summaries.
* [ ] Contact: form + PGP key; hCaptcha widget.
* [ ] Legal: privacy, imprint.

### 7.4 Forms & Email (Agent D)

* [ ] `/api/contact` with validation, rate‑limit, hCaptcha verify.
* [ ] Nodemailer SMTP relay; env‑driven config.

### 7.5 Infra & DSM (Agent E)

* [ ] Dockerfile (multi‑stage) for Astro static + nginx (or node for SSR routes).
* [ ] `infra/docker-compose.yml` for `web`, `plausible` (optional), `mail-relay` (optional).
* [ ] `infra/nginx/site.conf` with CSP/HSTS/security headers.
* [ ] `docs/OPS.md` with DSM reverse proxy steps, Let’s Encrypt, AAAA record.

### 7.6 CI/CD & QA (Agent F)

* [ ] `.github/workflows/deploy.yml` build + deploy.
* [ ] LHCI config; axe tests; Playwright smoke.

### 7.7 Content Seeds (shared)

* [ ] Place seed MDX (below) and images in `public/`.
* [ ] Add `downloads/` with placeholder CV.pdf and PGP public key.

---

## 8) Seed Content (MDX)

> Save the following files exactly as specified.

### 8.1 Case Study #1 — Dual‑SIEM Migration

**Path:** `content/case-studies/dual-siem-migration.mdx`

```mdx
---
title: "Dual‑SIEM Migration at Scale"
date: 2025-10-01
tags: [siem, data-platforms, migrations]
summary: "Designed and led a dual‑SIEM posture covering N sources / M BPS with zero downtime and measurable latency improvements."
metrics:
  - "70% reduction in controllable event delay"
  - "100% uptime during cutover window"
  - "N→M ingestion sources with schema normalization"
---

import Figure from "../../apps/site/src/components/Figure.astro";

## TL;DR
Executed a risk‑aware, phased migration to a dual‑SIEM architecture with strict SLOs, delivering lower latency and higher operational resilience.

## Problem
Single‑vendor risk and scaling constraints threatened SLOs during peak ingest. Regulatory audit windows required continuity.

## Approach
- Capability map and parity matrix
- Source‑by‑source migration runbooks
- Schema normalization + field validation
- Shadow read + mirrored alerts before cutover

## Architecture
<Figure caption="High‑level dual‑SIEM topology with normalization + routing." src="/images/diagrams/dual-siem-topology.png" />

## Implementation
- Rules migration via translator + unit tests
- Deterministic routing with fingerprinting
- Real‑time dashboards and error budgets

## Results
- 70% reduction in controllable event delay
- Zero downtime during cutover
- Faster MTTD/MTTR across critical detections

## Lessons Learned
Prefer canonical events + adapters; treat rules as code with tests.
```

### 8.2 Case Study #2 — Enrichments‑at‑Scale

**Path:** `content/case-studies/enrichments-at-scale.mdx`

```mdx
---
title: "Enrichments‑at‑Scale for Reliable Detections"
date: 2025-09-15
tags: [data-engineering, siem, reliability]
summary: "Built a resilient enrichment pipeline with backpressure control and SLAs for upstream teams."
metrics:
  - "p99 enrichment latency under 500ms"
  - "Automatic degradation with hot‑path guarantees"
---

## TL;DR
Established contract‑driven enrichments with strict SLAs and graceful degradation to protect critical alert paths.

## Problem
Unbounded enrichments caused tail latencies and alert starvation during surges.

## Approach
- Bounded queues + circuit breakers
- Hot path vs. cold path segregation
- Cached lookups with TTL

## Architecture
```

[Ingest] → [Normalizer] → [Router] → [Enrichment Hot Path] → [Detections]
↘ [Cold Path / Batch]

```

## Results
- p99 < 500ms under surge
- Clear SLAs and dashboards for upstream services

## Lessons Learned
SLAs + backpressure > ad‑hoc enrichments; design for partial failure.
```

### 8.3 Case Study #3 — Real‑Time Operational Visibility

**Path:** `content/case-studies/real-time-visibility.mdx`

```mdx
---
title: "Real‑Time Operational Visibility"
date: 2025-08-10
tags: [observability, platform, leadership]
summary: "Delivered live SLO dashboards, budget burn alerts, and on‑call ergonomics for SIEM pipelines."
metrics:
  - "Budget burn alerts minute‑granular"
  - "On‑call triage time reduced by 40%"
---

## TL;DR
Turned opaque pipelines into transparent systems with SLOs, error budgets, and humane on‑call.

## Approach
- Golden signals (ingest, queue, process, emit)
- Error budget burn alerts and runbooks
- Unified dashboards + chat‑ops
```

> **Companion assets:** Architecture diagram (`real-time-visibility-architecture.png`) stored at `apps/site/public/images/case-studies/` and budget burn chart (`real-time-visibility-burn.png`) at `apps/site/public/images/charts/`. Reference via `/images/...` paths inside MDX.

### 8.4 Blog Post Seed

**Path:** `content/posts/product-vs-platform.mdx`

```mdx
---
title: "Product vs. Platform: Picking the Right Lens for Security Engineering"
date: 2025-09-22
tags: [leadership, strategy]
summary: "How reframing work as products or platforms clarifies investments and outcomes."
---

Short intro paragraph…

## When to think "Product"
- Clear user and value stream
- SLAs and roadmaps

## When to think "Platform"
- Leverage and common capabilities
- Internal developer experience
```

> **Companion assets:** Place supporting diagrams (e.g., `product-vs-platform-lens.svg`) in `apps/site/public/images/posts/` and screenshots in `apps/site/public/images/posts/screens/`. Ensure MDX imports use absolute public URLs.

### 8.5 Patents & IP Index Seed

**Path:** `content/data/patents.json`

```json
[
  {"title": "Parse Failure Fingerprinting for Intelligent Drop Control", "status": "Filed", "year": 2025},
  {"title": "UID‑Based Drop Control in High‑Throughput Pipelines", "status": "Draft", "year": 2025}
]
```

---

## 9) OG Images & Social

* Add dynamic OG component generating per‑page images with title and tag pills.

---

## 10) Accessibility Checklist (must pass before merge)

* Keyboard traps: none. Focus order logical. Skip link visible on focus.
* Color contrast ≥ 4.5:1. Headings hierarchical.
* Form errors announced via ARIA. Labels tied to inputs.

---

## 11) Performance Budget

* Initial JS ≤ 200KB. Lazy‑load non‑critical.
* Images responsive (`srcset`) and compressed. Preload fonts.

---

## 12) Infra Notes (DSM)

* DSM → Application Portal → Reverse Proxy: `theschoonover.net` → `web:80`.
* DSM → Certificate: Let’s Encrypt; enable HSTS.
* AAAA record for IPv6 if available.
* Optional: Cloudflare proxy in front; keep origin SSL full strict.
* **RackStation hardware guardrails:** Assume Intel Atom C3538 (4 cores/8 threads) with 12GB RAM allocated to Docker, 4TB usable SSD volume, and 200Mbps symmetric WAN uplink.
* **Container sizing targets:** App container ≤ 512MB RSS baseline; Plausible stack ≤ 2GB combined; reserve ≥20% headroom for DSM services.
* **Concurrency assumptions:** ≤50 concurrent sessions, peak 5 req/s sustained; favor static export and tuned Node workers within CPU budget.

---

## 13) CI/CD Workflow (GitHub Actions)

* On push to `main`:

  1. `pnpm i --frozen-lockfile`
  2. `pnpm typecheck && pnpm build`
  3. Run axe + LHCI
  4. Upload artifact `dist/`
  5. **Option A (rsync):** `rsync` to RackStation bind mount path for nginx container.
  6. **Option B (containers):** Build/push image `registry/site:SHA`; Watchtower restarts service on RackStation.

---

## 14) Done Criteria (Release GA)

* All pages shipped with seed content and pass checks.
* Contact form delivers email via SMTP, with server logs.
* Deployed behind DSM reverse proxy with HTTPS and security headers.

---

## 15) Post‑GA Backlog Hooks

* Newsletter (self‑hosted), Consulting page, Case study PDF export, Command‑K quick finder.

---

## 16) Commands Cheat‑Sheet

```
pnpm dlx create-astro@latest apps/site
pnpm i
pnpm dev
pnpm build
pnpm test
```

> **Codex:** Execute tasks in the order and roles above. Open PRs per task group with checklists, attach Lighthouse/Axe results, and reference file paths exactly as listed so the seeds land in the correct locations.

---

## 17) Documentation Deliverables & Owners

* **`docs/OPS.md` minimum contents:** Deployment runbook (RackStation steps, Docker Compose commands), backup/restore procedures, incident response contacts, environment variable matrix, and rollback instructions. *Owner:* Agent E (Infra) with review from Agent F (QA).
* **Content Guide (`docs/content-guide.md` or README section):** Voice/tone guardrails, MDX formatting conventions, asset naming/location rules, metadata/frontmatter checklist, accessibility reminders (alt text, captions). *Owner:* Agent B (Content) with sign-off from John.
* **Support docs:**
  * `docs/analytics.md`: Event taxonomy, dashboards, reporting cadence, data retention notes. *Owner:* Agent F (QA/Analytics).
  * `docs/search-indexing.md`: Search/tag indexing approach, rebuild steps, failure playbook. *Owner:* Agent A (App Scaffold).
* **Pre-merge checklist:** Confirm docs updated, owners tagged in review, and README links to each document.
