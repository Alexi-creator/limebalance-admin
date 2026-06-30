#!/bin/sh
# Generates env-config.js from the container's env variables before nginx starts.
# The official nginx image runs all /docker-entrypoint.d/*.sh scripts at startup.
set -e

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = {
  VITE_API_URL: "${VITE_API_URL:-/api}",
  VITE_TELEGRAM_BOT_USERNAME: "${VITE_TELEGRAM_BOT_USERNAME}",
};
EOF
