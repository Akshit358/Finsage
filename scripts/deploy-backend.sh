#!/bin/bash

# FinSage Backend Deployment Script
# This script builds and deploys the backend to AWS ECR and EC2

set -e  # Exit on any error

echo "🚀 FinSage Backend Deployment Script"
echo "===================================="

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="finsage-backend"
IMAGE_TAG="latest"

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

echo "📋 Configuration:"
echo "  AWS Account ID: ${AWS_ACCOUNT_ID}"
echo "  AWS Region: ${AWS_REGION}"
echo "  ECR Repository: ${ECR_REPOSITORY}"
echo "  ECR URI: ${ECR_URI}"
echo ""

# Check if ECR repository exists, create if not
echo "🔍 Checking ECR repository..."
if ! aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION} >/dev/null 2>&1; then
    echo "📦 Creating ECR repository..."
    aws ecr create-repository --repository-name ${ECR_REPOSITORY} --region ${AWS_REGION}
    echo "✅ ECR repository created"
else
    echo "✅ ECR repository already exists"
fi

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}

# Build Docker image
echo "🔧 Building Docker image..."
cd /Users/ak/Documents/TechProjects/Finsage
docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

# Tag image for ECR
echo "🏷️  Tagging image for ECR..."
docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${ECR_URI}:${IMAGE_TAG}

# Push image to ECR
echo "📤 Pushing image to ECR..."
docker push ${ECR_URI}:${IMAGE_TAG}

echo "✅ Backend image successfully pushed to ECR!"
echo ""
echo "📋 Next steps:"
echo "1. Run: ./scripts/setup-ec2.sh"
echo "2. Deploy the image to your EC2 instance"
echo ""
echo "🔗 ECR Image URI: ${ECR_URI}:${IMAGE_TAG}"

