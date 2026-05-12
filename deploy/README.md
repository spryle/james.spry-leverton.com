# Deploying james.spry-leverton.com

The site is plain static files. Production hosting is **AWS S3 + CloudFront**, fronted by an ACM certificate, with `www.spry-leverton.com` 301-redirecting to `james.spry-leverton.com`. CI/CD runs in GitHub Actions and authenticates to AWS via **OIDC** — no long-lived access keys live anywhere.

## Architecture

```
                      ┌──────────────────────────────┐
   DNS (registrar) ───▶│ CloudFront distribution      │
   james → CF          │  - cert: ACM (us-east-1)     │──▶  S3 bucket (private, OAC-only)
   www   → CF          │  - aliases: james + www      │      james.spry-leverton.com
                      │  - viewer-request fn (www →) │
                      │  - response headers policy   │
                      │     (HSTS / CSP / nosniff …) │
                      └──────────────────────────────┘
                                  ▲
                                  │ invalidate
                                  │
                      ┌──────────────────────────────┐
   git push master ──▶│ GitHub Actions (OIDC)        │──▶  s3 sync + invalidate
                      └──────────────────────────────┘
```

## One-time setup

You only run this when first deploying the site. Re-runs are safe; the
scripts detect existing resources by name.

### 1. Run `bootstrap.sh`

Creates the S3 bucket, the GitHub OIDC provider, the IAM role for the
deploy workflow, and **requests** the ACM certificate (DNS-validated).

```bash
./deploy/bootstrap.sh
```

Output includes:
- IAM role ARN to add as a GitHub repo variable.
- The CNAME records you must add at your DNS registrar so ACM can
  validate the cert.

### 2. Add ACM validation CNAMEs at your registrar

For each row the bootstrap script printed under "DNS validation
records", create the matching `CNAME` at your DNS host. Validation
usually completes within minutes.

Watch for the cert to reach `ISSUED`:

```bash
aws acm describe-certificate \
    --region us-east-1 \
    --certificate-arn <CERT_ARN> \
    --query Certificate.Status \
    --output text
```

### 3. Run `provision.sh`

Creates the CloudFront pieces (Origin Access Control, the www → james
viewer-request function, the Response Headers Policy with security
headers, the distribution itself) and applies the S3 bucket policy that
grants the distribution read access.

```bash
./deploy/provision.sh
```

Output includes:
- The CloudFront distribution ID (for the GitHub variable).
- The distribution domain name (for the final DNS records).

The distribution takes 15–20 minutes to leave `InProgress`. You can do
steps 4 and 5 while it deploys.

### 4. Add the final DNS records at your registrar

```
james.spry-leverton.com.   CNAME   <distribution>.cloudfront.net
www.spry-leverton.com.     CNAME   <distribution>.cloudfront.net
```

### 5. Add GitHub repo variables

Settings → Secrets and variables → Actions → **Variables** tab → New variable.

| Name                 | Value                                              |
| -------------------- | -------------------------------------------------- |
| `AWS_ROLE_ARN`       | from `bootstrap.sh` output                         |
| `S3_BUCKET`          | `james.spry-leverton.com`                          |
| `CF_DISTRIBUTION_ID` | from `provision.sh` output                         |

These are public-ish (no real secrets), so use **Variables**, not
Secrets.

### 6. Push to deploy

```bash
git push origin master
```

`.github/workflows/deploy.yml` runs on every push to `master` (or via
`workflow_dispatch`) and does the same thing as `deploy/deploy.sh`.

## Manual deploy

If you want to push without going through CI:

```bash
export CF_DISTRIBUTION_ID=<id from provision.sh>
./deploy/deploy.sh
```

## Cache strategy

| Path           | Cache-Control                              |
| -------------- | ------------------------------------------ |
| `/assets/*`    | `public,max-age=31536000,immutable`        |
| everything else | `public,max-age=300,must-revalidate`      |

Every deploy issues a CloudFront invalidation for the HTML/CSS/JS so
updates appear in under a minute regardless of the short browser
cache. The hashed `assets/` paths (favicons, font) are immutable in
practice; if a future asset URL changes, the new filename bypasses
the immutable cache naturally.

## Security headers

Applied by the Response Headers Policy attached to the distribution
(see `security-headers-policy.json`):

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self'; script-src 'self'; style-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; manifest-src 'self'`

The CSP is tight — every resource we ship is same-origin. If you ever
add a third-party (analytics, an embed), edit
`security-headers-policy.json` and re-create the RHP, then update the
distribution's default behaviour to reference the new policy.

## Things you might want to add later

- `og:image` — the OG / Twitter meta tags reference a card image; we
  haven't shipped one. Drop a `1200×630` PNG at `assets/og-image.png`
  and add `<meta property="og:image" content="https://james.spry-leverton.com/assets/og-image.png" />`.
- **Route 53** — if you ever move DNS into AWS, the CNAMEs become
  ALIAS A/AAAA records pointing to the distribution, which removes
  one DNS hop.
- **Logging / WAF** — currently off. Add an access-log bucket or a
  WAF ACL if you ever need them.
- **Stop using root** — the AWS account is currently being driven
  from the root identity. Long-term, create an admin IAM user (or
  better, IAM Identity Center) and disable root access keys.
