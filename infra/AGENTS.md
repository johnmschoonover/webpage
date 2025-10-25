# AGENTS.md — Infra Guidelines

- Keep Docker Compose files compatible with Synology's Docker engine; stay on version `3.x` syntax and avoid unsupported features (e.g., buildx-specific options).
- Minimize container restarts by using Watchtower labels to opt in only the services that should auto-update.
- Pass secrets via environment variables or external files referenced in `.env`; never hard-code credentials directly into compose files.
- For private registries, mount a Docker `config.json` into the Watchtower container (or set `DOCKER_CONFIG`) instead of inventing custom environment variables—the upstream image only understands the standard Docker auth file.
- When adding new operational docs for infra changes, update `docs/OPS.md` in the same PR so runbooks stay synchronized.
- Log meaningful infra exercises (smoke tests, failovers) in the `docs/OPS.md` Operations Journal so future maintainers can trace validation history.
