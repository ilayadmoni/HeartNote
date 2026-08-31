#!/bin/bash
# Deploy the current main branch onto this EC2 instance.
#
# Invoked by the GitHub Actions deploy job via SSM (see
# .github/workflows/ci.yml), and safe to run by hand over SSH.
#
# .env is NOT touched — secrets live only on the instance, never in CI.
set -euo pipefail

APP_DIR=/opt/heartnote
CLIENT_DIR="$APP_DIR/client"

echo "==> Fetching latest main"
cd "$APP_DIR"
git fetch --depth 1 origin main
git reset --hard origin/main

cd "$CLIENT_DIR"
test -f .env || { echo "FATAL: $CLIENT_DIR/.env missing"; exit 1; }

# The builder stage carries the toolchain (prisma CLI, full node_modules);
# the runner stage is the slim image that actually serves traffic.
echo "==> Building images"
docker build --target builder -t heartnote-builder .
docker build --target runner -t heartnote-app .

echo "==> Syncing database schema"
docker run --rm --env-file .env heartnote-builder npx prisma db push --skip-generate

echo "==> Restarting container"
docker rm -f heartnote 2>/dev/null || true
docker run -d --name heartnote --restart unless-stopped \
  -p 127.0.0.1:3000:3000 --env-file .env heartnote-app

# Give Next.js a moment to bind before we call it dead.
echo "==> Health check"
for i in $(seq 1 20); do
  if curl -fsS -o /dev/null http://localhost:3000/api/auth/providers; then
    echo "OK: app responding after ${i}s"
    docker image prune -f >/dev/null 2>&1 || true
    exit 0
  fi
  sleep 1
done

echo "FATAL: app did not become healthy within 20s"
docker logs heartnote --tail 50
exit 1
