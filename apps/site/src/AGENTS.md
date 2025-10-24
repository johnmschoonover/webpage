# AGENTS.md — Site Application Surfaces

## Scope
Applies to everything under `apps/site/src/`, covering layouts, components, and pages. More specific `AGENTS.md` files within
subdirectories (e.g., `components/`, `layouts/`) take precedence for their scope.

## Voice & Story
- Maintain a pragmatic, security-leadership tone that balances credibility with approachability.
- Surface GitHub as the primary hub for prototypes, instrumentation, and lab notes whenever presenting alternative contact
  options.
- Align copy with canonical data in `data/profile.json` or collection content. Avoid duplicating strings when data already exists.

## Page Coverage Checklist
- **Home (`pages/index.astro`)** — Hero includes GitHub CTA; final CTA reminds visitors to review GitHub before contacting.
- **About** — Sidebar or callout references GitHub focus areas from `profile.github_focus`.
- **Contact** — Sidebar explains what GitHub contains and renders `contactChannels` so GitHub, LinkedIn, and email remain synced.
- **Projects** — Closing note links to GitHub for ongoing build notes.

## Data Source Rules
- Introduce new surfaces via utilities in `@lib/utils` when multiple areas require the same metadata (e.g., `contactChannels`).
- Only use hard-coded fallback URLs (`https://github.com/johnmschoonover`) when canonical data is missing, and annotate the code
  with a TODO explaining why.

## Interaction Rules
- Any link or button that triggers a file download must set the HTML `download` attribute so the asset is saved locally instead of navigating away.

## QA Loop
- Run `pnpm --filter site build` before requesting review; capture warnings in the PR if any appear.
- Spot-check responsive layouts at 375px, 768px, and ≥1280px widths.
- Keyboard-test CTAs for focus visibility and logical order.
