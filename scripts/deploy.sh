#!/usr/bin/env bash
# Builds the static site and publishes out/ to the gh-pages branch,
# which GitHub Pages serves at https://easongan123.github.io.
set -euo pipefail
cd "$(dirname "$0")/.."

REMOTE_URL="$(git remote get-url origin)"
rm -rf .next out
npm run build
touch out/.nojekyll   # serve the _next/ folder as-is

cd out
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(git -C .. rev-parse --short HEAD) $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -q -f "$REMOTE_URL" gh-pages
rm -rf .git
echo "Deployed. Live in about a minute at https://easongan123.github.io"
