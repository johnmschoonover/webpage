# AGENTS.md — Layout Surfaces

## Scope
Applies to files in `apps/site/src/layouts/`, including `BaseLayout.astro`, which renders the global header, footer, and global
utility controls.

## Tone & CTA Hierarchy
- Header keeps navigation concise: About, Experience, Case Studies, Writing, Patents, Contact.
- Provide a clear active-page affordance in the header using a subtle brand-blue bar (around 2–4px tall) that works in both light and dark themes; prefer reusing existing utility tokens over hard-coded hex values. Pair it with a complementary bottom hover indicator so navigation affordances feel balanced for mouse and keyboard users.
- Primary action in the header should accelerate recruiter/contact intent (CV download, contact) and must stay above the fold on
desktop.
- Footer must enumerate every active outreach channel from `contactChannels` so visitors always see GitHub, LinkedIn, and email.

## Data Source Rules
- Always consume contact/social metadata from `@lib/utils` exports or `data/profile.json`; never duplicate URLs inline.
- When adding a new channel, update `contactChannels` first, then render via loops so the footer and other consumers stay in sync.

## QA Loop
- Validate focus order: skip link → header nav → CommandK → Theme toggle → CTA button.
- Confirm footer links open in new tabs when `external` is true and include descriptive `title` attributes for screen readers.
- Run `pnpm --filter site build` before submitting changes.
