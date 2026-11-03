#!/usr/bin/env bash
set -euo pipefail

MAJOR=${1:?usage: scripts/test-wdio.sh <9|10>}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
WORK=$(mktemp -d)
CONSUMER="$WORK/consumer"
EXAMPLE="$ROOT/examples/wdio-mjs"

cd "$ROOT"
TGZ="$WORK/$(npm pack --ignore-scripts --pack-destination "$WORK" | tail -n 1)"

mkdir -p "$CONSUMER" && cd "$CONSUMER"
npm init -y >/dev/null
PKGS=(webdriverio @wdio/cli @wdio/globals @wdio/local-runner @wdio/mocha-framework @wdio/spec-reporter)
npm install --strict-peer-deps --no-audit --no-fund "$TGZ" "${PKGS[@]/%/@^$MAJOR}"

node -e "if (typeof require('wdio-ui5-service').default !== 'function') process.exit(1)"
node --input-type=module -e "const m = await import('wdio-ui5-service'); if (typeof m.default !== 'function') process.exit(1)"

cp "$EXAMPLE/wdio.conf.mjs" "$EXAMPLE/ui5.test.mjs" "$CONSUMER/"
echo "webdriverio $(node -p "require('./node_modules/webdriverio/package.json').version")"
npx wdio run wdio.conf.mjs --headless
