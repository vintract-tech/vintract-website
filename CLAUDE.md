# vintract-website — for future Claude sessions

## What this is

Single-page marketing site for `vintract.com`. Static HTML + Tailwind +
GSAP ScrollTrigger, served by S3 + CloudFront. Separate from the
customer-specific deployments under `motley-hosur-*` — this is the
company's brand surface.

## Where things live

| Path | What |
|------|------|
| `site/index.html` | The page. Sections are blocks delimited by `<!-- ============ NAME ============ -->`. |
| `site/css/main.css` | Background grid, cards, AI tiles, reveal initial state. Tailwind utilities come from the CDN at runtime. |
| `site/js/main.js` | GSAP scroll animations. All `.reveal` elements get faded up; cards stagger; counters tick when in view. Respects `prefers-reduced-motion`. |
| `infra/` | Terraform — S3 bucket + bucket policy + CloudFront distribution + ACM cert (us-east-1) + Route 53 records (alias both apex and www). |
| `scripts/bootstrap-state.sh` | One-time: creates the S3 bucket that holds the Terraform state. Run before `terraform init`. |
| `scripts/deploy.sh` | Every push: syncs `site/` to S3 with proper cache-control headers, then invalidates CloudFront. Reads bucket + distribution ID straight from `terraform output`. |

## Conventions (mirrors the parent project's CLAUDE.md)

- `vintract-{customer}-{location}-{stack}[-{env}]` naming. This repo is
  `vintract` (no customer suffix — it's the company itself) and the
  resources are named `vintract-website-prod-*`.
- All infra changes go through Terraform. Don't `aws cloudfront`
  anything by hand.
- Secrets: none required for this site. If we ever add a contact form
  backend, the secret lives in AWS Secrets Manager under the same
  prefix pattern.
- Standard tag set on every resource: `vintract:company`,
  `vintract:customer`, `vintract:location`, `vintract:env`,
  `vintract:managed-by`, `vintract:repo`, `vintract:cost-center`.

## How a typical change ships

1. Edit `site/index.html` / `site/css/main.css` / `site/js/main.js`.
2. Preview locally: `cd site && python -m http.server 5500`.
3. `bash scripts/deploy.sh` — picks up the bucket + distribution ID
   from Terraform outputs, syncs with two-pass cache-control headers,
   invalidates CloudFront.
4. Wait ~30 s for the invalidation, refresh `https://vintract.com`.

## Why CloudFront despite the "no CloudFront" first ask

S3 website endpoints are HTTP-only. The user's first instruction was
"no CloudFront for cost reasons" — that's accurate at face value but
wrong on the numbers: a marketing site sees under a GB/month of
traffic, so CloudFront stays in the ₹50–150/mo band. The alternative
is a "Not Secure" badge on every page load and DPDP-Act ambiguity if
we ever capture form input. We took the explicit yes-to-HTTPS choice.

## What's intentionally not here yet

- **GitHub Actions deploy on push.** Today this is local `deploy.sh`.
  Wire OIDC into the same `vintract-motley-hosur-github-prod` role
  pattern when this gets a real release cadence.
- **Form backend.** Contact section uses `mailto:` / `tel:` links.
  When real lead capture is needed, route through SES + a tiny Lambda.
- **Customer logo wall.** Only Motley Cookers today; placeholder line
  ("more announcements soon") below.
