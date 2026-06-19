#!/usr/bin/env bash
set -euo pipefail
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"
git fetch --quiet origin main
BEFORE="$(git rev-parse HEAD)"; AFTER="$(git rev-parse origin/main)"
[ "$BEFORE" = "$AFTER" ] && exit 0
echo "[burger-project-deploy] $(date -Is): $BEFORE -> $AFTER"
CHANGED="$(git diff --name-only "$BEFORE" "$AFTER")"
git reset --hard --quiet origin/main            # untracked .env is preserved

# The whole Next.js app is baked into the image -> rebuild on any code change
# (skip rebuild if only docs / deploy units changed).
if echo "$CHANGED" | grep -qvE '^(deploy/|.*\.md$)'; then
  docker compose up -d --build
fi
if echo "$CHANGED" | grep -q '^db/schema\.sql$'; then
  docker compose exec -T burger-project npm run migrate
fi
echo "[burger-project-deploy] done"
