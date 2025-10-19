#!/bin/bash

# FinSage AWS Deployment Script
# This script deploys FinSage to AWS using ECS, ECR, and Application Load Balancer

echo "🚀 Starting FinSage AWS Deployment"
echo "=================================="

# Configuration
AWS_REGION="us-east-1"
ECR_REPOSITORY="finsage"
ECS_CLUSTER="finsage-cluster"
ECS_SERVICE="finsage-service"
TASK_DEFINITION="finsage-task"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first:"
    echo "   curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
    echo "   unzip awscliv2.zip"
    echo "   sudo ./aws/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install it first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Step 1: Create ECR repository
echo "📦 Creating ECR repository..."
aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION 2>/dev/null || echo "Repository already exists"

# Step 2: Get ECR login token
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Step 3: Build and push Docker image
echo "🏗️ Building Docker image..."
ECR_URI=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY

docker build -t $ECR_URI:latest .
docker push $ECR_URI:latest

echo "✅ Image pushed to ECR: $ECR_URI:latest"

# Step 4: Create ECS cluster
echo "🏗️ Creating ECS cluster..."
aws ecs create-cluster --cluster-name $ECS_CLUSTER --region $AWS_REGION 2>/dev/null || echo "Cluster already exists"

# Step 5: Create task definition
echo "📋 Creating task definition..."
cat > task-definition.json << EOF
{
  "family": "$TASK_DEFINITION",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "finsage",
      "image": "$ECR_URI:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/finsage",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition.json --region $AWS_REGION

echo "✅ Task definition created"

# Step 6: Create CloudWatch log group
aws logs create-log-group --log-group-name /ecs/finsage --region $AWS_REGION 2>/dev/null || echo "Log group already exists"

echo "🎉 Deployment completed!"
echo "Your FinSage application is now running on AWS ECS"
echo "Check the ECS console to get your load balancer URL"
