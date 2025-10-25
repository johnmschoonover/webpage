# AGENTS.md — Workflow Guardrails

- Keep preview and release publishing in separate workflows: `preview.yml` handles PR/main validation plus `main_*` tags, while `release.yml` is reserved for `release-*` tag pushes and `release_*` tags.
- Use pnpm 10.19.0 and Node.js 20 in all workflows to stay aligned with the workspace pin.
- For preview workflows, ensure container pushes happen only on `push` events (never on pull requests) and limit tags to the `main_*` aliases described in `docs/OPS.md`.
- Release workflows must publish `release_commit<sha[:8]>` and `release_latest` alongside the raw tag reference so RackStation Watchtower can promote the image.
