output "bucket_name" {
  description = "S3 bucket holding the site files — target for `aws s3 sync`."
  value       = aws_s3_bucket.site.bucket
}

output "cloudfront_id" {
  description = "Distribution ID — pass to `aws cloudfront create-invalidation` after each deploy."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain" {
  description = "*.cloudfront.net hostname (useful for sanity-check before DNS propagates)."
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "Primary URL once Route 53 + cert validation complete."
  value       = "https://${var.domain}"
}
