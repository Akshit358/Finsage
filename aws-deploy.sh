#!/bin/bash

# FinSage AWS Deployment Script
# This script helps deploy FinSage to AWS

echo "🚀 FinSage AWS Deployment Script"
echo "================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install AWS CLI first:"
    echo "   curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
    echo "   unzip awscliv2.zip"
    echo "   sudo ./aws/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Build Docker image
echo "🔧 Building Docker image..."
docker build -t finsage-backend .

# Tag for ECR (replace with your account ID and region)
echo "🏷️  Tagging image for ECR..."
docker tag finsage-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/finsage-backend:latest

echo "📋 Next steps:"
echo "1. Create ECR repository: aws ecr create-repository --repository-name finsage-backend"
echo "2. Login to ECR: aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com"
echo "3. Push image: docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/finsage-backend:latest"
echo "4. Create EC2 instance and deploy"
echo "5. Deploy frontend to S3 + CloudFront"

echo "🎯 Deployment guide available in AWS_DEPLOYMENT.md"
