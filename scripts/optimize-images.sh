#!/usr/bin/env bash
# Resize a source photo into web-ready WebP files under resources/img/.
#
#   scripts/optimize-images.sh <source-image> <output-name> <size> [size...]
#
# Writes resources/img/<output-name>-<size>.webp for each size (the long
# edge is capped at <size> px, and images are never upscaled), then prints
# each file's real pixel size so it can be copied into width/height
# attributes or _data/gallery.yml.
#
# Example:
#   scripts/optimize-images.sh ~/Pictures/owl.jpg wildlife-owl 800 1600
#
# Keep the full-size originals outside the repo; only commit the output.
set -euo pipefail

if [ "$#" -lt 3 ]; then
    sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'
    exit 1
fi

src=$1
name=$2
shift 2

out_dir="$(cd "$(dirname "$0")/.." && pwd)/resources/img"
mkdir -p "$out_dir"

for size in "$@"; do
    out="$out_dir/$name-$size.webp"
    magick "$src" -auto-orient -strip \
        -resize "${size}x${size}>" \
        -quality "${QUALITY:-80}" -define webp:method=6 \
        "$out"
    printf '%s\t%s\t%s\n' \
        "resources/img/$(basename "$out")" \
        "$(magick identify -format '%wx%h' "$out")" \
        "$(du -h "$out" | cut -f1)"
done
