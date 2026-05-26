#!/usr/bin/env bash
# Sync the contents of site/ to S3 and invalidate the CloudFront cache
# so the new bytes are served on the next request. Run from anywhere —
# the script cd's to the repo root via its own location.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PROFILE="${AWS_PROFILE:-vintract}"

# Pull the bucket + distribution from the Terraform outputs so the
# script never goes out of sync with infra.
cd "$REPO_ROOT/infra"
BUCKET="$(terraform output -raw bucket_name)"
DIST_ID="$(terraform output -raw cloudfront_id)"
cd "$REPO_ROOT"

echo "Bucket:        $BUCKET"
echo "Distribution:  $DIST_ID"

# Two-pass sync to set cache-control properly:
# 1. Hashed assets / fonts → long-lived cache.
# 2. HTML → no-cache so visitors pick up the latest copy immediately.
echo "Syncing assets (long cache)…"
aws s3 sync site/ "s3://$BUCKET/" \
  --profile "$PROFILE" \
  --delete \
  --exclude "*.html" \
  --cache-control "public,max-age=31536000,immutable"

echo "Syncing HTML (no-cache)…"
aws s3 sync site/ "s3://$BUCKET/" \
  --profile "$PROFILE" \
  --exclude "*" \
  --include "*.html" \
  --cache-control "public,max-age=0,must-revalidate" \
  --content-type "text/html; charset=utf-8"

echo "Invalidating CloudFront…"
aws cloudfront create-invalidation \
  --profile "$PROFILE" \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --query 'Invalidation.{id:Id,status:Status}'

echo "Done. https://vintract.com"
