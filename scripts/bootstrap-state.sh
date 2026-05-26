#!/usr/bin/env bash
# One-time bootstrap: create the S3 bucket that backs the Terraform
# remote state. Subsequent `terraform init` runs against this bucket.
#
# This is the chicken-and-egg setup — Terraform can't manage the bucket
# that holds its own state, so we provision it imperatively here. Safe
# to re-run; the create calls are idempotent.

set -euo pipefail

PROFILE="${AWS_PROFILE:-vintract}"
REGION="ap-south-1"
BUCKET="vintract-website-tfstate-prod-764416828771"

echo "Using profile=$PROFILE region=$REGION bucket=$BUCKET"

if aws s3api head-bucket --bucket "$BUCKET" --profile "$PROFILE" 2>/dev/null; then
  echo "State bucket already exists — nothing to do."
  exit 0
fi

aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region "$REGION" \
  --create-bucket-configuration "LocationConstraint=$REGION" \
  --profile "$PROFILE"

aws s3api put-bucket-versioning \
  --bucket "$BUCKET" \
  --versioning-configuration "Status=Enabled" \
  --profile "$PROFILE"

aws s3api put-bucket-encryption \
  --bucket "$BUCKET" \
  --server-side-encryption-configuration '{
    "Rules": [{ "ApplyServerSideEncryptionByDefault": { "SSEAlgorithm": "AES256" } }]
  }' \
  --profile "$PROFILE"

aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --profile "$PROFILE"

echo "Done. You can now run \`terraform init\` from infra/."
