# AGENTS.md — Brand-Critical Components

## Scope
This file governs components within `apps/site/src/components/` that present personal-brand messaging (e.g., `Hero`, `CommandK`,
`Callout` when reused as a CTA).

## Tone & Copy Guardrails
- Anchor copy in canonical data from `data/profile.json`; do not hard-code names, titles, or URLs inline unless the data source
  lacks a field and you document a TODO.
- Reinforce credibility and clarity. Lead with mission, active initiatives, and outcomes; avoid hype or vague platitudes.
- Highlight GitHub as the hub for prototypes and lab notes when a component introduces quick actions or social context.

## Coverage Checklist
When adjusting any component here, confirm the following before requesting review:
1. Hero: includes a primary CTA (contact), secondary CTA (resume/download), and tertiary CTA (GitHub or equivalent showcase).
2. Command palette: exposes navigation destinations plus the GitHub profile with `rel="me noopener noreferrer"`.
3. Buttons or links opening in new tabs use `rel="noopener noreferrer"` and add `rel="me"` when pointing to owned profiles.

## QA Loop
- Run `pnpm --filter site build` to ensure Astro builds succeed.
- Manually verify responsive behavior at 375px, 768px, and ≥1280px widths (shrink-to-fit check in devtools).
- Keyboard test: ensure tabbing reaches new CTAs and visible focus states remain legible.
