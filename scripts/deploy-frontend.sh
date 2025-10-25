#!/bin/bash

# FinSage Frontend Deployment Script
# This script builds and deploys the React frontend to S3

set -e  # Exit on any error

echo "🎨 FinSage Frontend Deployment Script"
echo "===================================="

# Configuration
AWS_REGION="us-east-1"
BUCKET_NAME="finsage-frontend-$(date +%s)"  # Unique bucket name
CLOUDFRONT_DISTRIBUTION_ID=""

echo "📋 Configuration:"
echo "  AWS Region: ${AWS_REGION}"
echo "  S3 Bucket: ${BUCKET_NAME}"
echo ""

# Build React application
echo "🔧 Building React application..."
cd /Users/ak/Documents/TechProjects/Finsage/frontend/finsage-ui

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🏗️  Building application..."
npm run build

if [ ! -d "build" ]; then
    echo "❌ Build failed - build directory not found"
    exit 1
fi

echo "✅ React application built successfully"

# Create S3 bucket
echo "🪣 Creating S3 bucket..."
aws s3 mb s3://${BUCKET_NAME} --region ${AWS_REGION}

# Enable static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://${BUCKET_NAME} \
    --index-document index.html \
    --error-document index.html \
    --region ${AWS_REGION}

# Upload files to S3
echo "📤 Uploading files to S3..."
aws s3 sync build/ s3://${BUCKET_NAME} --delete --region ${AWS_REGION}

# Set proper content types
echo "🔧 Setting content types..."
aws s3 cp s3://${BUCKET_NAME} s3://${BUCKET_NAME} --recursive --metadata-directive REPLACE \
    --content-type "text/html" --exclude "*" --include "*.html"
aws s3 cp s3://${BUCKET_NAME} s3://${BUCKET_NAME} --recursive --metadata-directive REPLACE \
    --content-type "text/css" --exclude "*" --include "*.css"
aws s3 cp s3://${BUCKET_NAME} s3://${BUCKET_NAME} --recursive --metadata-directive REPLACE \
    --content-type "application/javascript" --exclude "*" --include "*.js"
aws s3 cp s3://${BUCKET_NAME} s3://${BUCKET_NAME} --recursive --metadata-directive REPLACE \
    --content-type "image/png" --exclude "*" --include "*.png"
aws s3 cp s3://${BUCKET_NAME} s3://${BUCKET_NAME} --recursive --metadata-directive REPLACE \
    --content-type "image/svg+xml" --exclude "*" --include "*.svg"
aws s3 cp s3://${BUCKET_NAME} s3://${BUCKET_NAME} --recursive --metadata-directive REPLACE \
    --content-type "image/jpeg" --exclude "*" --include "*.jpg"
aws s3 cp s3://${BUCKET_NAME} s3://${BUCKET_NAME} --recursive --metadata-directive REPLACE \
    --content-type "image/jpeg" --exclude "*" --include "*.jpeg"

# Make bucket public (for static website hosting)
echo "🔓 Making bucket public for static website hosting..."
aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::'${BUCKET_NAME}'/*"
        }
    ]
}' --region ${AWS_REGION}

echo "✅ Frontend deployed to S3 successfully!"
echo ""
echo "📋 Deployment Details:"
echo "  S3 Bucket: ${BUCKET_NAME}"
echo "  Website URL: http://${BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com"
echo "  Region: ${AWS_REGION}"
echo ""
echo "🔗 Test the frontend:"
echo "  http://${BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com"
echo ""
echo "📋 Next steps:"
echo "1. Run: ./scripts/setup-cloudfront.sh ${BUCKET_NAME}"
echo "2. Configure custom domain (optional)"
echo "3. Set up HTTPS with SSL certificate"
echo ""

# Save deployment details
cat > /Users/ak/Documents/TechProjects/Finsage/aws-config/frontend-deployment.txt << EOF
Frontend Deployment Details
==========================

S3 Bucket: ${BUCKET_NAME}
Website URL: http://${BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com
Region: ${AWS_REGION}
Deployment Date: $(date)

Files uploaded:
- index.html
- static/ (CSS, JS, images)
- manifest.json
- robots.txt
- favicon.ico

Next steps:
1. Set up CloudFront distribution
2. Configure custom domain
3. Set up SSL certificate
EOF

echo "💾 Deployment details saved to: aws-config/frontend-deployment.txt"

