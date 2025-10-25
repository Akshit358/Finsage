#!/bin/bash

# FinSage CloudFront Setup Script
# This script creates CloudFront distribution for the frontend

set -e  # Exit on any error

echo "☁️  FinSage CloudFront Setup Script"
echo "=================================="

# Check if bucket name is provided
if [ -z "$1" ]; then
    echo "❌ Please provide S3 bucket name as argument"
    echo "Usage: $0 <bucket-name>"
    exit 1
fi

BUCKET_NAME=$1
AWS_REGION="us-east-1"

echo "📋 Configuration:"
echo "  S3 Bucket: ${BUCKET_NAME}"
echo "  AWS Region: ${AWS_REGION}"
echo ""

# Get S3 bucket website URL
S3_WEBSITE_URL="${BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com"

echo "🔍 Verifying S3 bucket exists..."
if ! aws s3 ls s3://${BUCKET_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
    echo "❌ S3 bucket '${BUCKET_NAME}' not found!"
    exit 1
fi
echo "✅ S3 bucket verified"

# Create CloudFront distribution
echo "🚀 Creating CloudFront distribution..."

# Create distribution configuration
cat > /tmp/cloudfront-config.json << EOF
{
    "CallerReference": "finsage-frontend-$(date +%s)",
    "Comment": "FinSage Frontend Distribution",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-${BUCKET_NAME}",
                "DomainName": "${S3_WEBSITE_URL}",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-${BUCKET_NAME}",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100",
    "CustomErrorResponses": {
        "Quantity": 2,
        "Items": [
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            },
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "HttpVersion": "http2"
}
EOF

# Create the distribution
echo "⏳ Creating CloudFront distribution (this may take a few minutes)..."
DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution --distribution-config file:///tmp/cloudfront-config.json)

# Extract distribution ID and domain name
DISTRIBUTION_ID=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.Id')
DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.DomainName')
DISTRIBUTION_STATUS=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.Status')

echo "✅ CloudFront distribution created!"
echo ""
echo "📋 Distribution Details:"
echo "  Distribution ID: ${DISTRIBUTION_ID}"
echo "  Domain Name: ${DISTRIBUTION_DOMAIN}"
echo "  Status: ${DISTRIBUTION_STATUS}"
echo "  S3 Origin: ${S3_WEBSITE_URL}"
echo ""

# Wait for distribution to be deployed
echo "⏳ Waiting for distribution to be deployed (this may take 10-15 minutes)..."
aws cloudfront wait distribution-deployed --id ${DISTRIBUTION_ID}

# Get final distribution details
FINAL_DISTRIBUTION=$(aws cloudfront get-distribution --id ${DISTRIBUTION_ID})
FINAL_DOMAIN=$(echo $FINAL_DISTRIBUTION | jq -r '.Distribution.DomainName')
FINAL_STATUS=$(echo $FINAL_DISTRIBUTION | jq -r '.Distribution.Status')

echo "✅ CloudFront distribution is deployed!"
echo ""
echo "🎉 Frontend is now live!"
echo ""
echo "📋 Final Details:"
echo "  Distribution ID: ${DISTRIBUTION_ID}"
echo "  Frontend URL: https://${FINAL_DOMAIN}"
echo "  Status: ${FINAL_STATUS}"
echo ""
echo "🔗 Test your frontend:"
echo "  https://${FINAL_DOMAIN}"
echo ""
echo "📋 Next steps:"
echo "1. Configure custom domain (optional)"
echo "2. Set up SSL certificate with AWS Certificate Manager"
echo "3. Update backend CORS settings to allow CloudFront domain"
echo "4. Test all frontend features"
echo ""

# Save distribution details
cat > /Users/ak/Documents/TechProjects/Finsage/aws-config/cloudfront-deployment.txt << EOF
CloudFront Distribution Details
==============================

Distribution ID: ${DISTRIBUTION_ID}
Frontend URL: https://${FINAL_DOMAIN}
S3 Origin: ${S3_WEBSITE_URL}
Status: ${FINAL_STATUS}
Created: $(date)

Features:
- HTTPS enabled
- Gzip compression
- Error page redirects to index.html (for React Router)
- Global edge locations
- HTTP/2 support

Next steps:
1. Configure custom domain
2. Set up SSL certificate
3. Update CORS settings
4. Test all features
EOF

echo "💾 Distribution details saved to: aws-config/cloudfront-deployment.txt"

# Clean up
rm -f /tmp/cloudfront-config.json

