#!/usr/bin/env bash
# Recompile scripts/*.jsx into a single scripts/app.js bundle.
# Run this after editing any .jsx file. Requires esbuild on PATH.
set -euo pipefail
cd "$(dirname "$0")"

ESB="${ESBUILD:-$(command -v esbuild || true)}"
if [ -z "$ESB" ]; then
  # fallback to the copy bundled with the vercel CLI if present
  ESB="$HOME/.nvm/versions/node/v22.22.0/lib/node_modules/vercel/node_modules/esbuild/bin/esbuild"
fi
if [ ! -x "$ESB" ]; then
  echo "esbuild not found. Install it with: npm install -g esbuild" >&2
  exit 1
fi

# Concatenate in dependency order. tweaks-panel/universe/diagrams expose globals
# that hero and app consume.
TMP="${TMPDIR:-/tmp}/sancamac-build.jsx"
cat scripts/tweaks-panel.jsx \
    scripts/universe.jsx \
    scripts/diagrams.jsx \
    scripts/hero.jsx \
    scripts/app.jsx > "$TMP"

"$ESB" "$TMP" --loader:.jsx=jsx --target=es2020 --minify \
       --outfile=scripts/app.js

rm -f "$TMP"
echo "built scripts/app.js"
