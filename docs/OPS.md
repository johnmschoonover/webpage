# Operations Runbook

## Overview
This runbook provides the day-to-day operational guidance for the `theschoonover.net` deployment on the Synology RackStation (DSM). It covers how to provision and update the Astro static build, manage the supporting Docker services, and ensure the site remains fast, reliable, and compliant with privacy guardrails.

## Environment Matrix
| Environment | Purpose | Hosting Details | Branch | Core Services | Notes |
|-------------|---------|-----------------|--------|---------------|-------|
| Local Dev   | Component/content work, QA before PR | Developer workstation, Node.js 20.11.x with pnpm 8.15.1 | feature branches | Astro dev server (`pnpm dev`) | Use `.env.local` for secrets; never commit.
| Main Preview | Auto-refresh stack for merged changes | RackStation Docker stack exposing port `8079` | `main` | `site_main_preview` container following `main_latest`, shared nginx config | LAN/VPN only; validates integration before promotion.
| Staging     | Optional dry-run for major releases | RackStation Docker stack, staging compose profile | `staging` (optional) | `site` static container, `nginx` reverse proxy | Enable HTTP basic auth if exposed.
| Production  | Public site | RackStation Docker stack served via DSM reverse proxy at `theschoonover.net` | `main` | `site` static container, `nginx` reverse proxy, optional `plausible` | Watchtower tracks `release_*` tags.

### Required Secrets & Configuration
| Variable | Description | Scope | Source |
|----------|-------------|-------|--------|
| `SITE_URL` | Canonical site URL used for OG tags and sitemap | Build & runtime | DSM `.env` or GitHub Actions secret |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Contact form SMTP relay | API container (if enabled) | DSM Secrets Manager or env file |
| `HCAPTCHA_SITEKEY`, `HCAPTCHA_SECRET` | hCaptcha keys for contact form | Frontend + API | hCaptcha dashboard |
| `PLAUSIBLE_DOMAIN`, `PLAUSIBLE_API_HOST` | Self-hosted Plausible analytics | Plausible container | Docker compose `.env` |
| `SSH_DEPLOY_KEY` | Read-only key for RackStation deploys | GitHub Actions secret | Stored as deploy key |
| `REGISTRY_USERNAME`, `REGISTRY_PASSWORD` | Credentials for `docker.theschoonover.net` | GitHub Actions secret & RackStation Watchtower env | DSM Credentials Manager |

## Deployment Runbook
1. **Prep Git:**
   - Merge changes to `main` via reviewed PR.
   - Tag release for promotion: `git tag -a release-YYYY-MM-DD -m "Release notes"` then `git push --tags`.
2. **Trigger CI/CD:**
   - The **PR Validation** workflow (`.github/workflows/pr-validation.yml`) runs on every pull request, performing `pnpm install`, Astro type checking, and a production `pnpm build` without touching container registries.
   - The **Main Image Publish** workflow (`.github/workflows/main-publish.yml`) runs on pushes to `main`, publishes container tags `{{sha}}`, `main_commit<sha[:8]>`, and `main_latest` to `docker.theschoonover.net/theschoonover/site`, and feeds the preview stack.
   - The **Release Tag Publish** workflow (`.github/workflows/release.yml`) fires when a GitHub release is published, confirms the matching `main_commit<sha[:8]>` image exists, and retags it as `release_commit<sha[:8]>`, `release_latest`, and the GitHub release tag for production Watchtower to promote.
3. **RackStation Deploy (rsync mode):**
   - Workflow uses `SSH_DEPLOY_KEY` to `rsync` `dist/` to the DSM Docker bind mount (e.g., `/volume1/docker/site/dist`).
   - DSM reverse proxy serves updated static files through nginx container.
4. **RackStation Deploy (container mode):**
   - No manual build required; CI publishes the images directly to the internal registry.
   - For preview validation, Watchtower tracks `main_latest` and refreshes the `site_main_preview` container bound to port `8079`.
   - Production promotion occurs when a GitHub release is published for the desired commit; Watchtower sees the `release_*` tags within five minutes and restarts the `site` service.

### Configure Watchtower auto-updates
Watchtower runs alongside the production stack to poll the RackStation registry for new container tags and restart services automatically. The compose file already defines the service—follow the steps below to provision credentials and verify the automation.

1. **Generate a Docker config with registry credentials**
   - SSH into the RackStation and change into the `infra/` directory that holds `docker-compose.yml`.
   - Create a credentials folder next to the compose file: `mkdir -p watchtower-config`.
   - Run a targeted login that stores credentials in that folder: `docker login docker.theschoonover.net --username <service-account> --password-stdin --config ./watchtower-config`.
   - Confirm `watchtower-config/config.json` exists and contains an auth block for `docker.theschoonover.net`. Watchtower mounts this file read-only when the stack starts.
2. **Launch the stack with Watchtower enabled**
   - From the `infra/` directory run `docker compose up -d`.
   - Confirm both the `site` and `watchtower` services report `Up` in DSM Docker UI or via `docker compose ps`.
3. **Verify registry access**
   - Check logs with `docker compose logs -f watchtower`. The watcher should log `Found new site image` after you push a new tag from CI.
   - If you see auth errors, rerun `./scripts/test-registry-login.sh` locally to validate the credentials and ensure the RackStation trusts the registry TLS certificate.
4. **Test an auto-update**
   - Push a throwaway tag (e.g., `docker push docker.theschoonover.net/theschoonover/site:watchtower-smoke`).
   - Update the `site` service temporarily to point at that tag (`docker compose up -d site`). Within the poll interval, Watchtower should pull the canonical `release_latest` tag and restart the container—confirm by checking `docker compose logs site` for the restart timestamp.
   - Once verified, delete the temporary tag from the registry or let Watchtower clean up old images automatically.

Watchtower uses scoped labels on the `site` service, so additional containers can opt in later by applying the same `com.centurylinklabs.watchtower.enable=true` label with a shared scope name.

> **Why not an environment variable?** Watchtower authenticates to private registries via the standard Docker `config.json`. As long as the mounted config includes an entry for `docker.theschoonover.net`, no extra environment flag is required (and none exists) to list the registry.

### Publish the static bundle with DSM Web Station
If you prefer to serve the Astro build without Docker, DSM Web Station can expose the exported `dist/` directory as a traditional virtual host. This is useful for quickly validating a manual upload like the one performed on 2025-10-24.

1. **Enable Web Station and create a site root**
   - DSM Package Center → install/enable **Web Station** and **Apache HTTP Server** (static hosting only needs the core package).
   - DSM Control Panel → Shared Folder → create (or reuse) a folder such as `/volume1/web/theschoonover-net`.
   - Grant write access to the deploy user (the account tied to `SSH_DEPLOY_KEY` if CI/CD will push the files).
2. **Upload the Astro build**
   - Run `pnpm build` locally or in CI; upload or `rsync` the contents of `apps/site/dist/` into the Web Station folder created above. Preserve the folder structure so `/index.html` and `/assets/` land at the root.
3. **Create a Web Station virtual host**
   - Web Station → **Virtual Host** → **Create** → select **Name-based**.
   - Set **Hostname** to the production domain (e.g., `theschoonover.net`) or a staging subdomain, choose the shared folder path, and pick the **HTTP Back-end Server** type “Static”.
   - If you already rely on DSM’s reverse proxy, keep it in place and point the backend to `http://127.0.0.1:<auto-port>` shown in the virtual host summary.
4. **Wire up TLS and redirects**
   - DSM Control Panel → Security → Certificate → assign the Let’s Encrypt cert to the new virtual host.
   - Application Portal → Reverse Proxy (or Web Station **HSTS** settings) → force HTTPS and enable HSTS so the static site keeps the same security posture as the containerized nginx stack.
5. **Verify the deployment**
   - Visit the hostname directly (e.g., `https://theschoonover.net`) via the internet and confirm the build hash matches the uploaded bundle.
   - From DSM, open Web Station → **Virtual Host** → click **View** to ensure the portal preview loads without directory listing warnings.
   - If assets 404, re-run the upload with `rsync --delete` to clear stale files and confirm folder permissions inherit for `http` user.

To revert to the Docker-based workflow later, simply point the DSM reverse proxy back to the container and stop the Web Station virtual host—no additional cleanup is required.

### Test registry credentials locally
Before storing or rotating the `REGISTRY_USERNAME` / `REGISTRY_PASSWORD` secrets in GitHub, validate them against the internal registry from a workstation with Docker installed:

1. Copy `.env.registry.example` to `.env.registry` (ignored by git) at the repo root and update the password:
   ```bash
   cp .env.registry.example .env.registry
   $EDITOR .env.registry
   ```
   Replace `REGISTRY_PASSWORD` with the credential from DSM's Credential Manager.
2. Run the helper script to mirror the GitHub Actions `docker/login-action` step:
   ```bash
   ./scripts/test-registry-login.sh
   ```
3. Confirm `Login Succeeded`. If you see TLS or auth failures, verify the RackStation certificate trust chain and that the account is not locked out.

The script simply shells out to `docker login` using `--password-stdin`, so it is safe to run on macOS, Linux, or Windows Subsystem for Linux with Docker Desktop.

5. **Post-Deploy Verification:**
   - Hit `https://theschoonover.net/health` and confirm `200` with correct version hash.
   - Run Lighthouse smoke test (CI publishes report) and manual keyboard sweep.
   - Check DSM reverse proxy logs for errors; confirm SSL cert valid.

## DSM Reverse Proxy Checklist
1. DSM Control Panel → Application Portal → Reverse Proxy.
2. Create entry `theschoonover.net` → `http://site:80`.
3. Enable HSTS, HTTP → HTTPS redirect, and WebSocket support (for future features).
4. Attach Let’s Encrypt certificate; configure auto-renew.
5. Forwarded headers: enable `X-Forwarded-For` and `X-Forwarded-Proto`.

### Raspberry Pi Edge Proxy (NGINX)
If public traffic lands on a Raspberry Pi running nginx before reaching the RackStation, configure it as an SSL-terminating reverse proxy that forwards requests to DSM:

1. Copy `infra/nginx/rpi-edge.conf` to the Pi (e.g., `/etc/nginx/conf.d/theschoonover.net.conf`).
2. Replace the placeholder `192.168.1.50` with the RackStation’s LAN IP or DNS name.
3. Update the `ssl_certificate` paths to match your Let’s Encrypt (or other) certificate locations on the Pi.
4. Reload nginx: `sudo systemctl reload nginx`.

The config enforces the same security headers as the internal RackStation nginx, preserves client IPs via the `X-Forwarded-*` headers, and proxies `/health.json` so uptime monitors continue to work end-to-end.

### Raspberry Pi Edge Proxy (Caddy)
If you prefer Caddy for its automatic certificate management and simpler syntax, mirror the same forwarding behavior with the provided Caddyfile:

1. Copy `infra/caddy/rpi-edge.caddyfile` to the Pi (e.g., `/etc/caddy/Caddyfile`).
2. Replace `192.168.1.50` with the RackStation’s LAN IP or DNS name (or internal DNS record).
3. If you want to reuse existing certificates instead of Caddy’s built-in ACME, uncomment the `tls` stanza values and point them at your certificate and key paths.
4. Reload Caddy: `sudo systemctl reload caddy`.

The Caddyfile maintains the same security headers, preserves client IP details, forwards `/health.json` explicitly for uptime checks, and enables HTTP/2 + TLS for the hop between the Pi and DSM using `tls_server_name`.

## Docker Compose Commands
```bash
# Start or update stack
docker compose pull && docker compose up -d

# View logs for the site container
docker compose logs -f site

# Restart specific service
docker compose restart site
```

## Backup & Restore Procedures
### Daily Backups
- Schedule DSM Hyper Backup to copy `/volume1/docker/site` (static assets), `apps/site/public/downloads`, and Plausible Postgres volume to external NAS or cloud bucket.
- Retain 30 daily versions + 12 monthly snapshots.

### Restoring the Site
1. Restore desired snapshot via Hyper Backup to staging directory.
2. Validate restored build (`dist/`) locally using `pnpm preview`.
3. Swap the restored directory into the production bind mount and reload nginx (`docker compose restart nginx`).
4. Announce restore in ops channel and document incident in `docs/OPS.md` log section.

### Restoring Plausible Analytics
1. Stop Plausible stack: `docker compose stop plausible events-db clickhouse`.
2. Restore Postgres and ClickHouse volumes from backup.
3. Start stack: `docker compose up -d plausible events-db clickhouse`.
4. Run Plausible integrity check: `docker compose exec plausible ./bin/plausible db check`.

## Rollback Plan
1. Maintain previous build artifact (`dist/prev-<timestamp>`) on RackStation.
2. To rollback, symlink nginx root to previous artifact and restart container:  
   ```bash
   ln -sfn /volume1/docker/site/dist_prev /volume1/docker/site/dist_current
   docker compose restart nginx
   ```
3. Record rollback details (trigger, start time, completion) in incident log.
4. Open follow-up issue to address root cause before redeploying latest build.

## Incident Response
- **Severity Levels:**
  - Sev1: Full outage or data leak.
  - Sev2: Major feature broken (contact form, downloads) or security misconfiguration.
  - Sev3: Minor regression (styling bug, partial analytics outage).
- **Contacts:**
  - Primary On-Call (Infra / Agent E): infra@theschoonover.net, Signal +1-555-0100.
  - Secondary (QA / Agent F): qa@theschoonover.net, Signal +1-555-0101.
  - Site Owner (John Schoonover): john@theschoonover.net.
- **Runbook:**
  1. Acknowledge alert in less than 15 minutes (Uptime Kuma or manual report).
  2. Assess impact; log incident in DSM Notes or shared incident tracker.
  3. Mitigate using rollback or hotfix; capture timeline and metrics.
  4. Postmortem within 48 hours with action items tracked in GitHub.

## Monitoring & Reporting Cadence
- **Uptime Kuma:** Poll `/` and `/health` every 1 minute, notify via Signal.
- **Plausible Dashboards:** Weekly review of performance and engagement metrics documented in `docs/analytics.md`.
- **SEO Health:** Monthly crawl summary logged here with Search Console findings.
- **Log Review:** Weekly scan DSM nginx and application logs for anomalies.

## Change Management Checklist
- [ ] PR reviewed and CI green (build, lint, tests, accessibility, Lighthouse).
- [ ] README and docs updated for new workflows.
- [ ] Release notes drafted when user-facing change occurs.
- [ ] Post-deploy validation captured in ops journal.

## Ops Journal
Maintain a chronological log of significant operational events below (latest at top).

| Date | Event | Owner | Notes |
|------|-------|-------|-------|
| 2025-10-25 | Watchtower smoke test | John Schoonover | Validated Watchtower auto-pull/restart against `docker.theschoonover.net` after pushing a fresh `site` tag; CI/CD path confirmed end-to-end. |
| 2025-10-24 | Manual static deploy | John Schoonover | Built `apps/site` with `pnpm build` and uploaded `dist/` bundle to DSM Web Station share for production validation. |
| YYYY-MM-DD | _Placeholder_ | _Name_ | _Details_ |
