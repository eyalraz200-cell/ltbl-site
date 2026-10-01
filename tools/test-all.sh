#!/usr/bin/env bash
# Runs every check; a red test fails the whole run (no masking by pipes).
set -euo pipefail
cd "$(dirname "$0")/.."
./tools/check-assets.sh
for t in browser-test browser-test-intro browser-test-world; do echo "== $t"; node tools/$t.js | tail -3; done
node tools/parity.js all | grep -E 'DRIFT|boxes'
echo "ALL CHECKS PASSED"
