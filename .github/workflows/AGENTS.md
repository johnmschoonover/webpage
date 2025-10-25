# AGENTS.md — Workflow Guardrails

- Maintain three workflows: `pr-validation.yml` (pull request checks only), `main-publish.yml` (push to `main` builds and pushes the `main_*` image tags), and `release.yml` (retags the matching `main_commit` image when a GitHub release is published).
- In every workflow use pnpm 10.19.0 and Node.js 20 to stay aligned with the workspace pin.
- Ensure only the `main-publish.yml` workflow pushes container images on CI; PR validation must remain build-only.
- Release retagging must confirm the `main_commit<sha[:8]>` image exists, then publish `release_commit<sha[:8]>`, `release_latest`, and the GitHub release tag so Watchtower can promote without rebuilding.
