# theschoonover.net Web Platform

Personal brand site for John Schoonover, optimized for fast, accessible storytelling about cybersecurity engineering leadership. This repository houses the Astro-based site, content collections, infrastructure automation, and operational runbooks required to deploy on a Synology RackStation.

## Project Overview
- **Framework:** Astro with React islands, Tailwind CSS, and shadcn/ui components.
- **Content Strategy:** Git-driven MDX collections for case studies, writing, talks, and patents with structured data helpers.
- **Deployment Target:** Synology RackStation (DSM) behind reverse proxy at `theschoonover.net` with optional self-hosted Plausible analytics.
- **Quality Gates:** CI enforces typecheck, build, lint, accessibility (axe), and Lighthouse performance budgets.

## Getting Started
### Prerequisites
- Node.js 20.11.x (use `fnm`/`nvm` or Docker image to match production).
- pnpm 8.15.1 (`corepack enable` recommended).
- GitHub deploy key (read access) for CI/CD interactions.

### Initial Setup
```bash
pnpm install
cp .env.example .env.local # populate with local secrets
pnpm dev
```
Visit `http://localhost:4321` to preview the site.

### Useful Scripts
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Astro dev server with hot reload. |
| `pnpm build` | Generate static production build in `dist/`. |
| `pnpm preview` | Serve the production build locally. |
| `pnpm lint` | Run linting suite (ESLint, style checks). |
| `pnpm test` | Execute unit/integration tests (placeholder until implemented). |
| `pnpm check` | Aggregate command to run typecheck + lint + tests. |
| `pnpm content:lint` | Validate MDX frontmatter and content guidelines (to be implemented per `docs/content-guide.md`). |
| `pnpm analytics:export` | Planned CLI to snapshot Plausible metrics (see `docs/analytics.md`). |

## Deployment Workflow
1. Work on feature branches; open PRs with updated documentation and passing CI.
2. Merge to `main` to trigger GitHub Actions build pipeline (Astro build, Lighthouse, accessibility checks).
3. CI publishes the `dist/` artifact and deploys to RackStation via rsync or container push depending on environment configuration.
4. Post-deploy, validate `/health`, run Lighthouse smoke test, and update the ops journal per `docs/OPS.md`.

Refer to [`docs/OPS.md`](docs/OPS.md) for full deployment, backup, and rollback procedures.

## Content Management
- Author MDX content within `/content` using the conventions in [`docs/content-guide.md`](docs/content-guide.md).
- Store assets in `/apps/site/public/images` and `/downloads` following naming standards.
- Update analytics taxonomy and dashboards when adding new CTAs or conversion points (see [`docs/analytics.md`](docs/analytics.md)).
- Maintain search metadata and rebuild the index per [`docs/search-indexing.md`](docs/search-indexing.md).

## Supporting Documentation
- Product requirements and roadmap: [`docs/PRD.md`](docs/PRD.md)
- Operations runbook: [`docs/OPS.md`](docs/OPS.md)
- Content voice & MDX conventions: [`docs/content-guide.md`](docs/content-guide.md)
- Analytics playbook: [`docs/analytics.md`](docs/analytics.md)
- Search indexing guide: [`docs/search-indexing.md`](docs/search-indexing.md)

## Deployment Notes (RackStation)
- DSM Reverse Proxy routes `theschoonover.net` → `site` container with HSTS and Let’s Encrypt certificates.
- Docker Compose stack includes site container, nginx reverse proxy, and optional Plausible analytics.
- Backups handled via DSM Hyper Backup; retain daily and monthly snapshots as documented in `docs/OPS.md`.
- Watchtower or Portainer can automate container updates; ensure rollbacks are available by keeping previous build artifacts.

## Contributing
### Spec-driven workflow
- Start every net-new feature or major refactor by opening a **Spec** issue using the [GitHub template](.github/ISSUE_TEMPLATE/spec.yml). Keep the auto-applied `spec`/`docs` labels in place (add surface labels as needed) so planning work stays searchable. The issue should cite the authoritative requirement source (e.g., `docs/PRD.md`) and capture scope, acceptance criteria, rollout notes, and validation plan before coding begins.
- Keep the spec issue up to date as decisions are made. Log amendments in the decision log section and link out to design artifacts or supporting documents committed in `docs/`.
- Link each implementation PR back to the parent spec issue and confirm the acceptance criteria have been satisfied in the PR description. If the spec evolves mid-stream, update the template and secure reviewer sign-off before merging.

### Day-to-day expectations
1. Fork/branch from `main`.
2. Follow Conventional Commit formatting (`type(scope): message`).
3. Update relevant documentation and add links in README if new guides are created.
4. Ensure CI passes locally before pushing (`pnpm check`).
5. Request reviews from designated owners (Content, Infra, QA) based on change surface.

## Support & Escalation
- Ops & Infra: infra@theschoonover.net (Agent E)
- Content & Editorial: content@theschoonover.net (Agent B)
- Analytics & QA: qa@theschoonover.net (Agent F)
- Site Owner: John Schoonover — john@theschoonover.net

For urgent incidents, follow the escalation protocol outlined in [`docs/OPS.md`](docs/OPS.md).
