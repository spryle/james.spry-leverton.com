#!/usr/bin/env bash
#
# Push the working tree to S3 + invalidate CloudFront.
# Used for manual deploys; CI does the same thing in .github/workflows/deploy.yml.

set -euo pipefail

BUCKET="${S3_BUCKET:-james.spry-leverton.com}"
DIST_ID="${CF_DISTRIBUTION_ID:-}"

if [[ -z "$DIST_ID" ]]; then
    echo "Set CF_DISTRIBUTION_ID (or export it from the provision output)." >&2
    exit 1
fi

cd "$(dirname "$0")/.."

echo "==> Sync assets/ (long cache)"
aws s3 sync ./assets "s3://${BUCKET}/assets" \
    --delete \
    --cache-control "public,max-age=31536000,immutable"

echo "==> Upload HTML / CSS / JS (short cache)"
for f in index.html style.css wallpaper.js manifest.json sitemap.xml robots.txt; do
    [[ -f "$f" ]] || continue
    aws s3 cp "$f" "s3://${BUCKET}/$f" \
        --cache-control "public,max-age=300,must-revalidate"
done

echo "==> Invalidate CloudFront"
aws cloudfront create-invalidation \
    --distribution-id "${DIST_ID}" \
    --paths "/index.html" "/style.css" "/wallpaper.js" \
            "/manifest.json" "/sitemap.xml" "/robots.txt" \
    --query 'Invalidation.Id' --output text
