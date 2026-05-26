terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }

  backend "s3" {
    # Remote state lives in this bucket — created out-of-band by
    # scripts/bootstrap-state.sh before `terraform init`.
    bucket       = "vintract-website-tfstate-prod-764416828771"
    key          = "infra/prod/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true
  }
}

# Primary provider — every regional resource lives in ap-south-1
# (Mumbai). The S3 bucket follows the same convention.
provider "aws" {
  region  = "ap-south-1"
  profile = var.aws_profile

  default_tags {
    tags = {
      "vintract:company"    = "vintract"
      "vintract:customer"   = "vintract"   # the company itself, not a downstream customer
      "vintract:location"   = "global"
      "vintract:env"        = "prod"
      "vintract:managed-by" = "terraform"
      "vintract:repo"       = "vintract-website"
      "vintract:cost-center" = "marketing"
    }
  }
}

# CloudFront requires its ACM cert in us-east-1 — alias the provider
# explicitly so the cert resource can target that region while
# everything else stays in ap-south-1.
provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  profile = var.aws_profile

  default_tags {
    tags = {
      "vintract:company"    = "vintract"
      "vintract:customer"   = "vintract"
      "vintract:location"   = "global"
      "vintract:env"        = "prod"
      "vintract:managed-by" = "terraform"
      "vintract:repo"       = "vintract-website"
      "vintract:cost-center" = "marketing"
    }
  }
}
