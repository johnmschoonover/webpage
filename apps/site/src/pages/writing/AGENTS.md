# AGENTS.md — Writing Surfaces

## Scope
Applies to files under `apps/site/src/pages/writing/`.

## Editorial Guardrails
- Reinforce that the writing workflow is Git-driven. Direct visitors to review or contribute through the repository instead of embedding ad-hoc tools.
- Never expose on-page publishing utilities, API tokens, or credential prompts. Admin-only actions stay outside the public site.
- Keep copy outcomes-focused and reference the GitHub repository when describing how drafts get reviewed or shipped.
- Link out to the author playbook in `apps/site/src/content/posts/README.md` when visitors need contribution guidance instead of inlining the entire workflow.

## QA Loop
- Run `pnpm --filter site build` after edits to confirm content collections still compile.
- Manually verify the writing index and a sample post at 375px, 768px, and ≥1280px widths to confirm responsive spacing remains intact.
