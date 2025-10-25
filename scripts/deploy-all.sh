#!/bin/bash

# FinSage Complete AWS Deployment Script
# This script orchestrates the entire deployment process

set -e  # Exit on any error

echo "🚀 FinSage Complete AWS Deployment"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI not found. Please install AWS CLI first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker not found. Please install Docker first."
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    print_error "jq not found. Please install jq first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

print_success "Prerequisites check passed"

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
print_status "AWS Account ID: ${AWS_ACCOUNT_ID}"

echo ""
echo "📋 Deployment Phases:"
echo "1. Backend Deployment (ECR + EC2)"
echo "2. Database Setup (RDS)"
echo "3. Frontend Deployment (S3 + CloudFront)"
echo "4. Load Balancer Setup (ALB)"
echo "5. Monitoring Setup (CloudWatch)"
echo "6. Security Configuration"
echo ""

# Ask for confirmation
read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled by user"
    exit 0
fi

echo ""
print_status "Starting deployment process..."
echo ""

# Phase 1: Backend Deployment
print_status "Phase 1: Backend Deployment"
echo "================================"
print_status "Building and pushing Docker image to ECR..."
./scripts/deploy-backend.sh
print_success "Backend image pushed to ECR"

print_status "Setting up EC2 instance..."
./scripts/setup-ec2.sh
print_success "EC2 instance setup complete"

echo ""
print_warning "IMPORTANT: Please wait 2-3 minutes for EC2 setup to complete, then:"
echo "1. SSH into your EC2 instance: ssh -i finsage-key.pem ec2-user@YOUR_EC2_IP"
echo "2. Run: ./deploy.sh"
echo "3. Test: curl http://YOUR_EC2_IP:8000/api/v1/status/health"
echo ""

read -p "Press Enter when EC2 backend is running and tested..."

# Phase 2: Database Setup
print_status "Phase 2: Database Setup"
echo "=========================="
print_status "Setting up RDS PostgreSQL database..."
./scripts/setup-rds.sh
print_success "Database setup complete"

# Phase 3: Frontend Deployment
print_status "Phase 3: Frontend Deployment"
echo "==============================="
print_status "Building and deploying React frontend..."
./scripts/deploy-frontend.sh
print_success "Frontend deployed to S3"

# Get S3 bucket name from the deployment
S3_BUCKET=$(grep "S3 Bucket:" aws-config/frontend-deployment.txt | cut -d' ' -f3)
print_status "S3 Bucket: ${S3_BUCKET}"

print_status "Setting up CloudFront distribution..."
./scripts/setup-cloudfront.sh ${S3_BUCKET}
print_success "CloudFront distribution created"

# Phase 4: Load Balancer Setup
print_status "Phase 4: Load Balancer Setup"
echo "================================"
print_status "Setting up Application Load Balancer..."
./scripts/setup-alb.sh
print_success "Load balancer setup complete"

# Phase 5: Monitoring Setup
print_status "Phase 5: Monitoring Setup"
echo "============================"
print_status "Setting up CloudWatch monitoring..."
./scripts/setup-monitoring.sh
print_success "Monitoring setup complete"

# Phase 6: Security Configuration
print_status "Phase 6: Security Configuration"
echo "=================================="
print_status "Configuring security settings..."
./scripts/setup-security.sh
print_success "Security configuration complete"

echo ""
print_success "🎉 Deployment Complete!"
echo "=========================="
echo ""

# Display final URLs
print_status "Final URLs:"
echo "============="

# Get CloudFront URL
if [ -f "aws-config/cloudfront-deployment.txt" ]; then
    CLOUDFRONT_URL=$(grep "Frontend URL:" aws-config/cloudfront-deployment.txt | cut -d' ' -f3)
    echo "Frontend: ${CLOUDFRONT_URL}"
fi

# Get ALB URL
if [ -f "aws-config/alb-deployment.txt" ]; then
    ALB_URL=$(grep "Backend API URL:" aws-config/alb-deployment.txt | cut -d' ' -f3)
    echo "Backend API: ${ALB_URL}"
    echo "Health Check: ${ALB_URL}/api/v1/status/health"
fi

echo ""
print_status "Configuration Files:"
echo "========================"
echo "Backend Environment: aws-config/backend.env"
echo "Frontend Environment: aws-config/frontend.env"
echo "Database Configuration: aws-config/database.env"
echo ""

print_status "Next Steps:"
echo "============"
echo "1. Update environment variables with actual values"
echo "2. Test all endpoints and features"
echo "3. Set up custom domain (optional)"
echo "4. Configure SSL certificates"
echo "5. Set up email alerts for monitoring"
echo "6. Review security settings"
echo ""

print_status "Monitoring:"
echo "============"
echo "CloudWatch Dashboard: https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=FinSage-Monitoring"
echo ""

print_success "Deployment completed successfully! 🚀"

