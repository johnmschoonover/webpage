# Analytics & Reporting Playbook

## Philosophy
Analytics must reinforce the privacy-first positioning. All metrics come from self-hosted Plausible and optional log-based enrichment. No third-party trackers or fingerprinting scripts are permitted. Capture only aggregate, non-PII data and provide opt-out links in the privacy policy when advanced tracking is enabled.

## Instrumentation Sources
- **Plausible (self-hosted):** Primary web analytics for pageviews, events, goals.
- **Astro build metadata:** Inject build hash and version for deployment correlation.
- **Server logs:** Nginx access/error logs stored on RackStation for anomaly detection; rotate weekly.
- **Optional custom events pipeline:** Server-side event relay (future) for deeper funnel attribution without client identifiers.

## Event Taxonomy
| Event Name | Trigger | Properties | Notes |
|------------|---------|------------|-------|
| `pageview` | Default Plausible page view | `path`, `referrer`, `utm_*` | Auto-collected; ensure canonical URLs.
| `cta_contact_click` | Primary hero/contact CTAs clicked | `label` (`hero`, `footer`, `case-study`) | Measures engagement funnel toward contact form.
| `download_cv` | CV download button clicked | `variant` (`home`, `experience`) | Tracks conversion for recruiters.
| `download_one_pager` | One-pager asset download | `format` (`pdf`) | Optional asset once available.
| `case_study_deep_read` | Scroll depth ≥ 75% on case study pages | `slug`, `timeOnPage` | Implement via IntersectionObserver with debouncing.
| `talk_watch_click` | Video or recording play | `source` (`youtube`, `loom`, etc.) | Ensure consent banner if embedding third-party players.
| `newsletter_interest` | Newsletter opt-in intent (future) | `surface` | Stub for backlog feature; disabled by default.

## Goal Definitions
- **Contact Conversion:** `cta_contact_click` → Contact form submission (form submission event to be added with backend work).
- **Multi-Page Session:** ≥ 2 `pageview` events per session; configure in Plausible goals.
- **Content Engagement:** `case_study_deep_read` events grouped by tag.
- **Asset Downloads:** `download_cv` and `download_one_pager` aggregated weekly.

## Dashboards & Reporting
- **Executive Summary Dashboard:** Weekly snapshot combining sessions, contact clicks, and downloads. Publish PDF to shared drive every Monday.
- **Performance Monitoring:** Lighthouse CI reports attached to each PR; log LCP/TBT deltas in dashboard using manual entry until automated ingestion is built.
- **SEO Health:** Integrate Search Console coverage report monthly; highlight new or dropped queries in README changelog.
- **Operational Review:** Combine analytics with uptime/incident data for monthly ops sync. Document findings in `docs/OPS.md` under SEO/analytics log.

## Data Retention & Privacy
- Retain Plausible data for 25 months to enable YoY comparisons while respecting privacy commitments.
- Anonymize IP addresses and disable personal data collection in Plausible configuration.
- Provide `Do Not Track` support and respect browser signals.
- Allow manual deletion of individual events upon verified request (export data, delete, confirm).
- Document retention and purge schedule in privacy policy.

## QA & Validation Checklist
- [ ] Confirm Plausible script uses self-hosted domain (e.g., `https://analytics.theschoonover.net/js/plausible.js`).
- [ ] Validate events fire once per interaction using browser devtools or Plausible debug view.
- [ ] Ensure contact form submission events are debounced and tied to successful server response (once implemented).
- [ ] Cross-check download counts with server logs monthly.
- [ ] Audit event schema after major site changes; update this file when new events are added or removed.

## Reporting Cadence
| Cadence | Owner | Deliverable |
|---------|-------|-------------|
| Weekly (Monday) | Agent F (QA/Analytics) | Executive dashboard export + commentary shared with John. |
| Monthly (First business day) | Agent F with Agent E | SEO health summary (Search Console, Lighthouse trends) appended to `docs/OPS.md`. |
| Quarterly | Agent F & John | Strategy review of engagement trends; adjust content roadmap accordingly. |
| Ad hoc | Feature owner | Mini report when launching new surface (case study, talk). |

## Tooling & Automation Backlog
- Build CLI script (`pnpm analytics:export`) to pull Plausible stats via API and append to `/data/metrics/` CSVs.
- Explore server-side event relay for contact form conversions to avoid double-counting.
- Automate Lighthouse report ingestion into analytics dashboard using GitHub Actions artifact API.
- Add regression alerts when contact conversion drops by >25% week-over-week.

## Incident Handling
If analytics data becomes unavailable or inaccurate:
1. Verify Plausible container health (`docker compose ps` and logs).
2. Confirm domain configuration (CNAME `analytics.theschoonover.net` pointing to RackStation public IP).
3. Re-run Plausible migration scripts if database corruption detected; consult `docs/OPS.md` backup section for restore process.
4. Notify stakeholders in analytics channel and document outage window plus recovery steps in this file.
