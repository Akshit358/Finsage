#!/bin/bash

# FinSage Enterprise - AWS Deployment Script
# This script deploys the React frontend to AWS S3 and CloudFront

set -e

# Configuration
APP_NAME="finsage-enterprise"
BUCKET_NAME="finsage-enterprise-frontend-$(date +%s)"
REGION="us-east-1"
DISTRIBUTION_ID=""

echo "🚀 Starting FinSage Enterprise deployment to AWS..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"

# Build the application
echo "📦 Building the application..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed. No dist directory found."
    exit 1
fi

echo "✅ Build completed successfully"

# Create S3 bucket
echo "🪣 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure bucket for static website hosting
echo "🌐 Configuring bucket for static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Disable Block Public Access
echo "🔓 Disabling Block Public Access..."
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Create bucket policy for public read access
echo "📋 Creating bucket policy..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
rm bucket-policy.json

echo "✅ S3 bucket configured for public access"

# Upload files to S3
echo "📤 Uploading files to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

echo "✅ Files uploaded successfully"

# Create CloudFront distribution
echo "☁️ Creating CloudFront distribution..."
cat > cloudfront-config.json << EOF
{
    "CallerReference": "$(date +%s)",
    "Comment": "FinSage Enterprise Frontend",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
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
    "PriceClass": "PriceClass_100"
}
EOF

DISTRIBUTION_ID=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json --query 'Distribution.Id' --output text)
rm cloudfront-config.json

echo "✅ CloudFront distribution created: $DISTRIBUTION_ID"

# Get CloudFront domain name
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "  • S3 Bucket: $BUCKET_NAME"
echo "  • CloudFront Distribution: $DISTRIBUTION_ID"
echo "  • Domain: https://$CLOUDFRONT_DOMAIN"
echo ""
echo "🌐 Your application is now live at:"
echo "   https://$CLOUDFRONT_DOMAIN"
echo ""
echo "⏳ Note: CloudFront distribution may take 10-15 minutes to fully deploy."
echo "   You can check the status in the AWS Console."
echo ""
echo "🔧 To update the application, run this script again."
echo "   The script will update the existing distribution."

# Save deployment info
cat > deployment-info.json << EOF
{
    "bucketName": "$BUCKET_NAME",
    "distributionId": "$DISTRIBUTION_ID",
    "cloudfrontDomain": "$CLOUDFRONT_DOMAIN",
    "region": "$REGION",
    "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "📝 Deployment information saved to deployment-info.json"
