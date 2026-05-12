#!/usr/bin/env bash
#
# One-time AWS setup for james.spry-leverton.com:
#   - S3 bucket (private, block-public-access on)
#   - GitHub Actions OIDC provider (idempotent)
#   - IAM role for the GitHub Actions deploy workflow
#   - ACM cert in us-east-1 covering james + www, DNS-validated
#
# Run this once. Output at the end tells you which DNS records to add
# at your registrar so the cert can validate.
#
# Re-runs are safe; existing resources are detected and skipped.

set -euo pipefail

ACCOUNT_ID="354130273474"
BUCKET="james.spry-leverton.com"
PRIMARY_DOMAIN="james.spry-leverton.com"
WWW_DOMAIN="www.spry-leverton.com"
GHA_ROLE_NAME="github-actions-james-site-deploy"
GHA_REPO="spryle/james.spry-leverton.com"
ACM_REGION="us-east-1"  # CloudFront only reads certs from us-east-1

cd "$(dirname "$0")"
say() { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }

# --- 1. S3 bucket -----------------------------------------------------------

say "S3 bucket: $BUCKET"
if aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
    echo "    exists, skipping create"
else
    aws s3api create-bucket \
        --bucket "$BUCKET" \
        --region eu-west-2 \
        --create-bucket-configuration LocationConstraint=eu-west-2
    echo "    created"
fi

aws s3api put-public-access-block \
    --bucket "$BUCKET" \
    --public-access-block-configuration \
        BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
echo "    block-public-access enforced"

aws s3api put-bucket-encryption \
    --bucket "$BUCKET" \
    --server-side-encryption-configuration \
    '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
echo "    SSE-S3 default encryption set"

# --- 2. GitHub Actions OIDC provider ---------------------------------------

say "IAM OIDC provider: token.actions.githubusercontent.com"
OIDC_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
if aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$OIDC_ARN" >/dev/null 2>&1; then
    echo "    exists, skipping create"
else
    aws iam create-open-id-connect-provider \
        --url https://token.actions.githubusercontent.com \
        --client-id-list sts.amazonaws.com \
        --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
    echo "    created"
fi

# --- 3. IAM role for the deploy workflow -----------------------------------

say "IAM role: $GHA_ROLE_NAME"
if aws iam get-role --role-name "$GHA_ROLE_NAME" >/dev/null 2>&1; then
    aws iam update-assume-role-policy \
        --role-name "$GHA_ROLE_NAME" \
        --policy-document "file://iam-trust-policy.json"
    echo "    exists, trust policy refreshed"
else
    aws iam create-role \
        --role-name "$GHA_ROLE_NAME" \
        --assume-role-policy-document "file://iam-trust-policy.json" \
        --description "Deploys $PRIMARY_DOMAIN from $GHA_REPO via GitHub Actions OIDC."
    echo "    created"
fi
aws iam put-role-policy \
    --role-name "$GHA_ROLE_NAME" \
    --policy-name "site-deploy" \
    --policy-document "file://iam-permissions-policy.json"
echo "    inline policy 'site-deploy' attached"

ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${GHA_ROLE_NAME}"

# --- 4. ACM cert (us-east-1) -----------------------------------------------

say "ACM cert: $PRIMARY_DOMAIN + $WWW_DOMAIN (region $ACM_REGION)"
EXISTING_CERT_ARN="$(aws acm list-certificates \
    --region "$ACM_REGION" \
    --query "CertificateSummaryList[?DomainName=='${PRIMARY_DOMAIN}'].CertificateArn | [0]" \
    --output text)"

if [[ "$EXISTING_CERT_ARN" != "None" && -n "$EXISTING_CERT_ARN" ]]; then
    CERT_ARN="$EXISTING_CERT_ARN"
    echo "    found existing cert: $CERT_ARN"
else
    CERT_ARN="$(aws acm request-certificate \
        --region "$ACM_REGION" \
        --domain-name "$PRIMARY_DOMAIN" \
        --subject-alternative-names "$WWW_DOMAIN" \
        --validation-method DNS \
        --query CertificateArn --output text)"
    echo "    requested cert: $CERT_ARN"
    # ACM populates validation records asynchronously; give it a moment.
    sleep 5
fi

# --- 5. Print everything you need -----------------------------------------

say "Summary"
cat <<EOF

S3 bucket .................. $BUCKET
GitHub Actions role ARN .... $ROLE_ARN
ACM certificate ARN ........ $CERT_ARN

== Step A — DNS validation records (add at your registrar) ==
EOF

aws acm describe-certificate \
    --region "$ACM_REGION" \
    --certificate-arn "$CERT_ARN" \
    --query 'Certificate.DomainValidationOptions[].{Domain:DomainName,Name:ResourceRecord.Name,Value:ResourceRecord.Value,Type:ResourceRecord.Type}' \
    --output table

cat <<EOF

== Step B — GitHub repo variables (Settings → Secrets and variables → Actions → Variables) ==

  AWS_ROLE_ARN          = $ROLE_ARN
  S3_BUCKET             = $BUCKET
  CF_DISTRIBUTION_ID    = (filled in after Step D)

== Step C — Wait for the cert to be ISSUED ==

  watch -n 30 'aws acm describe-certificate --region $ACM_REGION --certificate-arn $CERT_ARN --query Certificate.Status --output text'

== Step D — Create the CloudFront distribution ==

  See deploy/README.md for the field-by-field config, or use deploy/cloudfront-distribution.json
  with the cert ARN substituted in.

== Step E — Add the final DNS records at your registrar ==

  $PRIMARY_DOMAIN.   CNAME   <distribution>.cloudfront.net
  $WWW_DOMAIN.       CNAME   <distribution>.cloudfront.net

EOF
