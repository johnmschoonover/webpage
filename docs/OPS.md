# Operations Runbook

## Overview
This runbook provides the day-to-day operational guidance for the `theschoonover.net` deployment on the Synology RackStation (DSM). It covers how to provision and update the Astro static build, manage the supporting Docker services, and ensure the site remains fast, reliable, and compliant with privacy guardrails.

## Environment Matrix
| Environment | Purpose | Hosting Details | Branch | Core Services | Notes |
|-------------|---------|-----------------|--------|---------------|-------|
| Local Dev   | Component/content work, QA before PR | Developer workstation, Node.js 20.11.x with pnpm 10.19.0 | feature branches | Astro dev server (`pnpm dev`) | Use `.env.local` for secrets; never commit.
| Staging     | Optional dry-run for major releases | RackStation Docker stack, staging compose profile | `staging` (optional) | `site` static container, `nginx` reverse proxy | Enable HTTP basic auth if exposed.
| Production  | Public site | RackStation Docker stack served via DSM reverse proxy at `theschoonover.net` | `main` | `site` static container, `nginx` reverse proxy, optional `plausible` | Watchtower monitors production tags.

### Required Secrets & Configuration
| Variable | Description | Scope | Source |
|----------|-------------|-------|--------|
| `SITE_URL` | Canonical site URL used for OG tags and sitemap | Build & runtime | DSM `.env` or GitHub Actions secret |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Contact form SMTP relay | API container (if enabled) | DSM Secrets Manager or env file |
| `HCAPTCHA_SITEKEY`, `HCAPTCHA_SECRET` | hCaptcha keys for contact form | Frontend + API | hCaptcha dashboard |
| `PLAUSIBLE_DOMAIN`, `PLAUSIBLE_API_HOST` | Self-hosted Plausible analytics | Plausible container | Docker compose `.env` |
| `SSH_DEPLOY_KEY` | Read-only key for RackStation deploys | GitHub Actions secret | Stored as deploy key |
| `REGISTRY_USERNAME`, `REGISTRY_PASSWORD` | Credentials for `docker.theschoonover.net` | GitHub Actions secret | DSM Credentials Manager |

## Deployment Runbook
1. **Prep Git:**
   - Merge changes to `main` via reviewed PR.
   - Tag release if desired: `git tag -a vX.Y.Z -m "Release notes"` then `git push --tags`.
2. **Trigger CI/CD:**
   - GitHub Actions workflow builds the Astro site with `pnpm build`.
   - Artifact uploaded to workflow for verification.
3. **RackStation Deploy (rsync mode):**
   - Workflow uses `SSH_DEPLOY_KEY` to `rsync` `dist/` to the DSM Docker bind mount (e.g., `/volume1/docker/site/dist`).
   - DSM reverse proxy serves updated static files through nginx container.
4. **RackStation Deploy (container mode, optional):**
   - `docker build -t docker.theschoonover.net/theschoonover/site:<sha> .`
   - `docker push docker.theschoonover.net/theschoonover/site:<sha>`
   - Watchtower or Portainer pulls latest image and restarts stack.

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
| YYYY-MM-DD | _Placeholder_ | _Name_ | _Details_ |
