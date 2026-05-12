#!/usr/bin/env bash
#
# Provisions the CloudFront half of the stack:
#   - Origin Access Control (OAC)
#   - CloudFront Function (www → james 301 redirect)
#   - Response Headers Policy (HSTS / CSP / nosniff / no-iframe / referrer / Permissions-Policy)
#   - CloudFront distribution (S3 origin via OAC, both domains, HTTPS, HTTP/2 + HTTP/3)
#   - S3 bucket policy granting OAC read access
#
# Run this AFTER bootstrap.sh and AFTER the ACM cert reaches ISSUED.
# Re-runs detect existing resources by name.

set -euo pipefail

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
BUCKET="james.spry-leverton.com"
PRIMARY_DOMAIN="james.spry-leverton.com"
WWW_DOMAIN="www.spry-leverton.com"
ACM_REGION="us-east-1"
OAC_NAME="james-spry-leverton-oac"
FN_NAME="james-spry-leverton-www-redirect"
RHP_NAME="james-spry-leverton-security-headers"
DIST_COMMENT="james.spry-leverton.com"

cd "$(dirname "$0")"
say() { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }

# --- 0. Resolve the ACM cert ARN -------------------------------------------

say "ACM cert lookup ($PRIMARY_DOMAIN, $ACM_REGION)"
CERT_ARN="$(aws acm list-certificates \
    --region "$ACM_REGION" \
    --query "CertificateSummaryList[?DomainName=='${PRIMARY_DOMAIN}'].CertificateArn | [0]" \
    --output text)"
CERT_STATUS="$(aws acm describe-certificate \
    --region "$ACM_REGION" --certificate-arn "$CERT_ARN" \
    --query 'Certificate.Status' --output text)"
echo "    $CERT_ARN ($CERT_STATUS)"
if [[ "$CERT_STATUS" != "ISSUED" ]]; then
    echo "    cert is not yet ISSUED — add the DNS validation records and wait." >&2
    exit 1
fi

# --- 1. Origin Access Control ----------------------------------------------

say "Origin Access Control: $OAC_NAME"
OAC_ID="$(aws cloudfront list-origin-access-controls \
    --query "OriginAccessControlList.Items[?Name=='${OAC_NAME}'].Id | [0]" \
    --output text)"
if [[ "$OAC_ID" == "None" || -z "$OAC_ID" ]]; then
    OAC_ID="$(aws cloudfront create-origin-access-control \
        --origin-access-control-config "Name=${OAC_NAME},Description=OAC for ${BUCKET},SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" \
        --query 'OriginAccessControl.Id' --output text)"
    echo "    created $OAC_ID"
else
    echo "    exists $OAC_ID"
fi

# --- 2. CloudFront Function (www redirect) ---------------------------------

say "CloudFront Function: $FN_NAME"
FN_EXISTS="$(aws cloudfront list-functions \
    --query "FunctionList.Items[?Name=='${FN_NAME}'].Name | [0]" \
    --output text)"

if [[ "$FN_EXISTS" == "None" || -z "$FN_EXISTS" ]]; then
    FN_OUT="$(aws cloudfront create-function \
        --name "$FN_NAME" \
        --function-config "Comment=Redirect www to apex,Runtime=cloudfront-js-2.0" \
        --function-code "fileb://cloudfront-function.js")"
    FN_ETAG="$(echo "$FN_OUT" | jq -r '.ETag')"
    echo "    created"
else
    DESC="$(aws cloudfront describe-function --name "$FN_NAME")"
    FN_ETAG="$(echo "$DESC" | jq -r '.ETag')"
    UPDATE_OUT="$(aws cloudfront update-function \
        --name "$FN_NAME" \
        --if-match "$FN_ETAG" \
        --function-config "Comment=Redirect www to apex,Runtime=cloudfront-js-2.0" \
        --function-code "fileb://cloudfront-function.js")"
    FN_ETAG="$(echo "$UPDATE_OUT" | jq -r '.ETag')"
    echo "    updated"
fi

PUB_OUT="$(aws cloudfront publish-function --name "$FN_NAME" --if-match "$FN_ETAG")"
FN_ARN="$(echo "$PUB_OUT" | jq -r '.FunctionSummary.FunctionMetadata.FunctionARN')"
echo "    published $FN_ARN"

# --- 3. Response Headers Policy --------------------------------------------

say "Response Headers Policy: $RHP_NAME"
RHP_ID="$(aws cloudfront list-response-headers-policies \
    --query "ResponseHeadersPolicyList.Items[?ResponseHeadersPolicy.ResponseHeadersPolicyConfig.Name=='${RHP_NAME}'].ResponseHeadersPolicy.Id | [0]" \
    --output text)"
if [[ "$RHP_ID" == "None" || -z "$RHP_ID" ]]; then
    RHP_ID="$(aws cloudfront create-response-headers-policy \
        --response-headers-policy-config "file://security-headers-policy.json" \
        --query 'ResponseHeadersPolicy.Id' --output text)"
    echo "    created $RHP_ID"
else
    echo "    exists $RHP_ID"
fi

# --- 4. CloudFront distribution --------------------------------------------

say "CloudFront distribution: $DIST_COMMENT"

# AWS managed cache + origin request policy IDs (stable, public):
CACHE_POLICY_OPTIMIZED="658327ea-f89d-4fab-a63d-7e88639e58f6"   # CachingOptimized
ORIGIN_REQ_CORS_S3="88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"        # CORS-S3Origin

DIST_ID="$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?contains(Aliases.Items, '${PRIMARY_DOMAIN}')].Id | [0]" \
    --output text)"

if [[ "$DIST_ID" != "None" && -n "$DIST_ID" ]]; then
    echo "    exists $DIST_ID (skipping create — edit by hand if config changes needed)"
else
    CALLER_REF="james-site-$(date +%s)"
    cat > /tmp/cf-config.json <<EOF
{
  "CallerReference": "$CALLER_REF",
  "Comment": "$DIST_COMMENT",
  "Enabled": true,
  "IsIPV6Enabled": true,
  "HttpVersion": "http2and3",
  "PriceClass": "PriceClass_100",
  "Aliases": {
    "Quantity": 2,
    "Items": ["$PRIMARY_DOMAIN", "$WWW_DOMAIN"]
  },
  "DefaultRootObject": "index.html",
  "ViewerCertificate": {
    "ACMCertificateArn": "$CERT_ARN",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "Certificate": "$CERT_ARN",
    "CertificateSource": "acm"
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "s3-$BUCKET",
        "DomainName": "$BUCKET.s3.eu-west-2.amazonaws.com",
        "OriginAccessControlId": "$OAC_ID",
        "S3OriginConfig": { "OriginAccessIdentity": "" },
        "CustomHeaders": { "Quantity": 0 },
        "ConnectionAttempts": 3,
        "ConnectionTimeout": 10
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-$BUCKET",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 3,
      "Items": ["GET", "HEAD", "OPTIONS"],
      "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] }
    },
    "Compress": true,
    "CachePolicyId": "$CACHE_POLICY_OPTIMIZED",
    "OriginRequestPolicyId": "$ORIGIN_REQ_CORS_S3",
    "ResponseHeadersPolicyId": "$RHP_ID",
    "FunctionAssociations": {
      "Quantity": 1,
      "Items": [
        {
          "FunctionARN": "$FN_ARN",
          "EventType": "viewer-request"
        }
      ]
    },
    "LambdaFunctionAssociations": { "Quantity": 0 },
    "SmoothStreaming": false,
    "FieldLevelEncryptionId": ""
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      }
    ]
  },
  "Logging": { "Enabled": false, "IncludeCookies": false, "Bucket": "", "Prefix": "" },
  "WebACLId": "",
  "Restrictions": { "GeoRestriction": { "RestrictionType": "none", "Quantity": 0 } }
}
EOF
    DIST_ID="$(aws cloudfront create-distribution \
        --distribution-config "file:///tmp/cf-config.json" \
        --query 'Distribution.Id' --output text)"
    echo "    created $DIST_ID (Deployed status takes ~15–20 minutes)"
    rm /tmp/cf-config.json
fi

DIST_DOMAIN="$(aws cloudfront get-distribution \
    --id "$DIST_ID" --query 'Distribution.DomainName' --output text)"

# --- 5. S3 bucket policy grants OAC read access ----------------------------

say "S3 bucket policy: grant CloudFront OAC read access"
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOACRead",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/$DIST_ID"
        }
      }
    }
  ]
}
EOF
aws s3api put-bucket-policy --bucket "$BUCKET" --policy "file:///tmp/bucket-policy.json"
rm /tmp/bucket-policy.json
echo "    applied"

# --- 6. Summary ------------------------------------------------------------

say "Done"
cat <<EOF

Distribution ID ........... $DIST_ID
Distribution domain ....... $DIST_DOMAIN

== Final DNS records (add at your registrar) ==

  $PRIMARY_DOMAIN   CNAME   $DIST_DOMAIN
  $WWW_DOMAIN       CNAME   $DIST_DOMAIN

  (For an apex/root domain pointing here you'd use an ALIAS / ANAME / flattened
  CNAME at your DNS provider; for these two subdomains a plain CNAME is fine.)

== Then add this GitHub repo variable ==

  CF_DISTRIBUTION_ID = $DIST_ID

It can take 15–20 minutes for the distribution to leave the "InProgress"
state before HTTPS to your domain works end to end.
EOF
