#!/usr/bin/env bash
# Runs every check; a red test fails the whole run (no masking by pipes).
set -euo pipefail
cd "$(dirname "$0")/.."
./tools/check-assets.sh
for t in browser-test browser-test-intro browser-test-scroll browser-test-nav browser-test-footer; do echo "== $t"; node tools/$t.js | tail -3; done
for f in hero about day2 day3 day4 day5 day6 shabbat footer; do node tools/parity.js fold-$f | tail -1; done
echo "ALL CHECKS PASSED"
