# ─────────────────────────────────────────────────────────────────────────
# App distribution bucket — public, versioned APK hosting for the three
# Vintract mobile apps. Built locally (docs/local_android_build.sh) or by
# CI and pushed to a STABLE "-latest.apk" key per app, so the download URL
# never changes ("always latest available"). Bucket versioning keeps every
# prior upload, so a bad build can be rolled back by restoring a version.
#
# Three prefixes (S3 has no real folders — these are key namespaces, seeded
# with a .keep object so they're visible in the console):
#   punch/   — Vintract Punch  (face-attendance kiosk)
#   mobile/  — Vintract Ops     (operator: inventory + production)  [repo: vintract-mobile]
#   people/  — Vintract People  (employee self-service)             [future]
#
# Download URL pattern (HTTPS, no CloudFront needed):
#   https://<bucket>.s3.ap-south-1.amazonaws.com/punch/vintract-punch-latest.apk
# ─────────────────────────────────────────────────────────────────────────

variable "app_downloads_bucket_name" {
  type    = string
  default = "vintract-app-downloads-prod-764416828771"
}

resource "aws_s3_bucket" "app_downloads" {
  bucket = var.app_downloads_bucket_name
}

resource "aws_s3_bucket_versioning" "app_downloads" {
  bucket = aws_s3_bucket.app_downloads.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app_downloads" {
  bucket = aws_s3_bucket.app_downloads.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Public read of objects (download links). We deliberately allow a public
# bucket POLICY (block_public_policy = false) but still block public ACLs —
# access is granted only by the explicit policy below, not by per-object
# ACLs.
resource "aws_s3_bucket_public_access_block" "app_downloads" {
  bucket                  = aws_s3_bucket.app_downloads.id
  block_public_acls       = true
  ignore_public_acls      = true
  block_public_policy     = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "app_downloads" {
  bucket = aws_s3_bucket.app_downloads.id
  # The policy + the public-access-block must settle in the right order.
  depends_on = [aws_s3_bucket_public_access_block.app_downloads]
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadApks"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.app_downloads.arn}/*"
    }]
  })
}

# Seed the three prefixes so the folders exist in the console immediately.
resource "aws_s3_object" "app_folders" {
  for_each = toset(["punch", "mobile", "people"])
  bucket   = aws_s3_bucket.app_downloads.id
  key      = "${each.value}/.keep"
  content  = "vintract app distribution — ${each.value}\n"
}

output "app_downloads_bucket" {
  value = aws_s3_bucket.app_downloads.id
}

output "app_downloads_base_url" {
  value = "https://${aws_s3_bucket.app_downloads.id}.s3.ap-south-1.amazonaws.com"
}
