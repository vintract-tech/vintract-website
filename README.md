# vintract-website

Static marketing site for `vintract.com`. Plain HTML + Tailwind (CDN) +
GSAP ScrollTrigger, hosted on S3 behind CloudFront with HTTPS.

## Repo shape

```
site/         the actual website (index.html, css/, js/, assets/)
infra/        Terraform — S3 bucket, CloudFront, ACM cert, Route 53
scripts/      bootstrap-state.sh (one-time), deploy.sh (every push)
```

## First-time setup

```bash
# 1. Bootstrap the Terraform state bucket (one-time per environment).
bash scripts/bootstrap-state.sh

# 2. Init + apply the infra.
cd infra
terraform init
terraform apply
```

The first apply takes ~20 minutes because the CloudFront distribution
takes a while to deploy globally. Watch progress with
`terraform apply` — it will block until the cert validates and the
distribution becomes ready.

## Day-to-day: deploying site changes

```bash
bash scripts/deploy.sh
```

This syncs `site/` to S3 (with sane cache-control headers — assets get
a year, HTML gets no-cache) and invalidates the CloudFront cache so
visitors pick up the new bytes immediately.

## Local preview

```bash
cd site
python -m http.server 5500
# open http://127.0.0.1:5500
```

Tailwind and GSAP load from CDNs, so there's no build step.

## Naming

Bucket: `vintract-website-prod-764416828771`
Distribution alias: `vintract.com`, `www.vintract.com`
Hosted zone: `Z04050942ERHM745QH3VL` (shared with motley-hosur-infra)
Terraform state: `s3://vintract-website-tfstate-prod-764416828771/infra/prod/terraform.tfstate`

## Editing copy

Open `site/index.html`. Sections are clearly delimited (`<!-- ============ X ============ -->`).
Most copy edits are obvious; the scroll animations are wired by class
(`.reveal`, `.card`, `.ai-tile`, etc.) so adding a new block is just
HTML — `js/main.js` picks it up automatically.

## Cost

- S3 (versioned, encrypted): pennies/mo for a marketing site
- CloudFront: ~₹50–150/mo for low traffic; price-per-GB after that
- ACM cert: free
- Route 53 query charges: paise

Round-number: under ₹200/mo total at launch.
