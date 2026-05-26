variable "aws_profile" {
  description = "Local AWS profile used by the provider — set to whatever you authenticate as. Override at apply time."
  type        = string
  default     = "vintract"
}

variable "domain" {
  description = "Apex domain to serve from CloudFront."
  type        = string
  default     = "vintract.com"
}

variable "www_alias" {
  description = "Also serve www.<domain> from the same distribution."
  type        = bool
  default     = true
}

variable "hosted_zone_id" {
  description = "Existing Route53 hosted zone for the domain. Looked up by name if you leave this blank, but pinning it avoids the data-source lookup."
  type        = string
  default     = "Z04050942ERHM745QH3VL"
}

variable "bucket_name" {
  description = "S3 bucket that holds the static site. Suffix the account ID to avoid the global S3 namespace collision."
  type        = string
  default     = "vintract-website-prod-764416828771"
}

variable "price_class" {
  description = "CloudFront price class. _All covers India; _100 is US/EU only and slower for South Asia."
  type        = string
  default     = "PriceClass_All"
}
