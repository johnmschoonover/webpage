#!/usr/bin/env bash
set -euo pipefail

load_env_file() {
  local file="$1"
  while IFS='=' read -r key value; do
    if [[ -z "$key" || "$key" =~ ^# ]]; then
      continue
    fi
    # Trim possible carriage returns
    value="${value%%$'\r'}"
    export "$key"="$value"
  done < "$file"
}

if [[ -f .env.registry ]]; then
  load_env_file .env.registry
fi

REGISTRY="${REGISTRY:-docker.theschoonover.net}"
USERNAME="${REGISTRY_USERNAME:-}"
PASSWORD="${REGISTRY_PASSWORD:-}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker CLI not found in PATH. Install Docker Desktop or the Docker Engine CLI before running this script." >&2
  exit 127
fi

if [[ -z "${USERNAME}" || -z "${PASSWORD}" ]]; then
  cat <<'MSG'
Missing registry credentials.

Set REGISTRY_USERNAME and REGISTRY_PASSWORD in your environment before running this script or create a local .env.registry file:

REGISTRY_USERNAME=website
REGISTRY_PASSWORD=***
MSG
  exit 1
fi

echo "Attempting docker login to ${REGISTRY} as ${USERNAME}" >&2

echo "${PASSWORD}" | docker login "${REGISTRY}" --username "${USERNAME}" --password-stdin
