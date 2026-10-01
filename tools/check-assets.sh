#!/usr/bin/env bash
# Fails if any referenced asset is missing or empty. Run from project root.
set -u
[ -f index.html ] || { echo "index.html missing"; exit 1; }
fail=0
refs=$( { grep -oE 'src="assets/[^"]+"' index.html; grep -oE "url\((['\"]?)\.\./assets/[^)'\"]+" css/*.css; } 2>/dev/null \
        | sed -E 's/^src="//; s/^url\(["'"'"']?\.\.\///; s/"$//' | sort -u )
for f in $refs; do
  if [ ! -s "$f" ]; then echo "MISSING or EMPTY: $f"; fail=1; fi
done
if grep -rqE 'figma\.com/api/mcp/asset' index.html css js; then echo "Figma temp URL left in code"; fail=1; fi
[ $fail -eq 0 ] && echo "assets OK: $(echo "$refs" | grep -c . | tr -d ' ') files"
exit $fail
