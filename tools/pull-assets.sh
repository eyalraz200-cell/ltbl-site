#!/usr/bin/env bash
# usage: tools/pull-assets.sh <fold> <assetPathPrefix> slug=file.png ...   → assets/_raw/<fold>/<slug>.png
set -eu
fold=$1; prefix=$2; shift 2; mkdir -p "assets/_raw/$fold"
for pair in "$@"; do
  slug=${pair%%=*}; file=${pair#*=}; out="assets/_raw/$fold/$slug.png"
  curl -sL -o "$out" "$prefix/$file"; printf '%-34s %s\n' "$out" "$(python3 -c "import struct,sys;d=open(sys.argv[1],'rb').read(26);print('%dx%d'%struct.unpack('>II',d[16:24]) if d[:4]==b'\x89PNG' else 'NOT PNG: '+d[:20].decode('latin1'))" "$out")"
done
