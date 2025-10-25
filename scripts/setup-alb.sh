#!/bin/bash

# FinSage Application Load Balancer Setup Script
# This script creates ALB and connects it to the backend

set -e  # Exit on any error

echo "⚖️  FinSage ALB Setup Script"
echo "============================"

# Configuration
AWS_REGION="us-east-1"
ALB_NAME="finsage-alb"
TARGET_GROUP_NAME="finsage-backend-tg"
ALB_SECURITY_GROUP_NAME="finsage-alb-sg"

echo "📋 Configuration:"
echo "  AWS Region: ${AWS_REGION}"
echo "  ALB Name: ${ALB_NAME}"
echo "  Target Group: ${TARGET_GROUP_NAME}"
echo ""

# Get default VPC ID
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --region ${AWS_REGION} --query 'Vpcs[0].VpcId' --output text)

# Get subnets for ALB
echo "🔍 Getting subnets for ALB..."
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}" --region ${AWS_REGION} --query 'Subnets[].SubnetId' --output text)
SUBNET_ARRAY=($SUBNETS)

if [ ${#SUBNET_ARRAY[@]} -lt 2 ]; then
    echo "❌ Need at least 2 subnets for ALB"
    exit 1
fi

echo "✅ Found ${#SUBNET_ARRAY[@]} subnets"

# Create ALB security group
echo "🛡️  Creating ALB security group..."
if ! aws ec2 describe-security-groups --group-names ${ALB_SECURITY_GROUP_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
    aws ec2 create-security-group \
        --group-name ${ALB_SECURITY_GROUP_NAME} \
        --description "FinSage ALB Security Group" \
        --vpc-id ${VPC_ID} \
        --region ${AWS_REGION}
    echo "✅ ALB security group created"
else
    echo "✅ ALB security group already exists"
fi

# Get ALB security group ID
ALB_SG_ID=$(aws ec2 describe-security-groups --group-names ${ALB_SECURITY_GROUP_NAME} --region ${AWS_REGION} --query 'SecurityGroups[0].GroupId' --output text)

# Add security group rules for ALB
echo "🔧 Configuring ALB security group rules..."

# HTTP access
aws ec2 authorize-security-group-ingress \
    --group-id ${ALB_SG_ID} \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region ${AWS_REGION} 2>/dev/null || echo "HTTP rule already exists"

# HTTPS access
aws ec2 authorize-security-group-ingress \
    --group-id ${ALB_SG_ID} \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region ${AWS_REGION} 2>/dev/null || echo "HTTPS rule already exists"

echo "✅ ALB security group rules configured"

# Create Application Load Balancer
echo "🚀 Creating Application Load Balancer..."
if ! aws elbv2 describe-load-balancers --names ${ALB_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
    ALB_OUTPUT=$(aws elbv2 create-load-balancer \
        --name ${ALB_NAME} \
        --subnets ${SUBNET_ARRAY[0]} ${SUBNET_ARRAY[1]} \
        --security-groups ${ALB_SG_ID} \
        --region ${AWS_REGION})
    
    ALB_ARN=$(echo $ALB_OUTPUT | jq -r '.LoadBalancers[0].LoadBalancerArn')
    ALB_DNS=$(echo $ALB_OUTPUT | jq -r '.LoadBalancers[0].DNSName')
    
    echo "✅ ALB created successfully"
else
    echo "✅ ALB already exists"
    ALB_ARN=$(aws elbv2 describe-load-balancers --names ${ALB_NAME} --region ${AWS_REGION} --query 'LoadBalancers[0].LoadBalancerArn' --output text)
    ALB_DNS=$(aws elbv2 describe-load-balancers --names ${ALB_NAME} --region ${AWS_REGION} --query 'LoadBalancers[0].DNSName' --output text)
fi

# Create target group
echo "🎯 Creating target group..."
if ! aws elbv2 describe-target-groups --names ${TARGET_GROUP_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
    TARGET_GROUP_OUTPUT=$(aws elbv2 create-target-group \
        --name ${TARGET_GROUP_NAME} \
        --protocol HTTP \
        --port 8000 \
        --vpc-id ${VPC_ID} \
        --health-check-path /api/v1/status/health \
        --health-check-interval-seconds 30 \
        --health-check-timeout-seconds 5 \
        --healthy-threshold-count 2 \
        --unhealthy-threshold-count 3 \
        --region ${AWS_REGION})
    
    TARGET_GROUP_ARN=$(echo $TARGET_GROUP_OUTPUT | jq -r '.TargetGroups[0].TargetGroupArn')
    
    echo "✅ Target group created"
else
    echo "✅ Target group already exists"
    TARGET_GROUP_ARN=$(aws elbv2 describe-target-groups --names ${TARGET_GROUP_NAME} --region ${AWS_REGION} --query 'TargetGroups[0].TargetGroupArn' --output text)
fi

# Get EC2 instance ID
echo "🔍 Finding EC2 instance..."
INSTANCE_ID=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=finsage-backend" "Name=instance-state-name,Values=running" \
    --region ${AWS_REGION} \
    --query 'Reservations[0].Instances[0].InstanceId' \
    --output text)

if [ "$INSTANCE_ID" = "None" ] || [ -z "$INSTANCE_ID" ]; then
    echo "❌ No running EC2 instance found with name 'finsage-backend'"
    echo "Please make sure your EC2 instance is running and has the correct tag"
    exit 1
fi

echo "✅ Found EC2 instance: ${INSTANCE_ID}"

# Register EC2 instance with target group
echo "🔗 Registering EC2 instance with target group..."
aws elbv2 register-targets \
    --target-group-arn ${TARGET_GROUP_ARN} \
    --targets Id=${INSTANCE_ID},Port=8000 \
    --region ${AWS_REGION}

echo "✅ EC2 instance registered with target group"

# Create listener for ALB
echo "👂 Creating ALB listener..."
if ! aws elbv2 describe-listeners --load-balancer-arn ${ALB_ARN} --region ${AWS_REGION} >/dev/null 2>&1; then
    aws elbv2 create-listener \
        --load-balancer-arn ${ALB_ARN} \
        --protocol HTTP \
        --port 80 \
        --default-actions Type=forward,TargetGroupArn=${TARGET_GROUP_ARN} \
        --region ${AWS_REGION}
    
    echo "✅ ALB listener created"
else
    echo "✅ ALB listener already exists"
fi

# Wait for ALB to be active
echo "⏳ Waiting for ALB to be active..."
aws elbv2 wait load-balancer-available --load-balancer-arns ${ALB_ARN} --region ${AWS_REGION}

echo "✅ ALB is active!"
echo ""
echo "📋 ALB Details:"
echo "  ALB Name: ${ALB_NAME}"
echo "  ALB ARN: ${ALB_ARN}"
echo "  ALB DNS: ${ALB_DNS}"
echo "  Target Group: ${TARGET_GROUP_NAME}"
echo "  EC2 Instance: ${INSTANCE_ID}"
echo ""
echo "🔗 Backend API URL:"
echo "  http://${ALB_DNS}"
echo ""
echo "🔗 Health Check URL:"
echo "  http://${ALB_DNS}/api/v1/status/health"
echo ""
echo "📋 Next steps:"
echo "1. Test the ALB endpoints"
echo "2. Set up SSL certificate for HTTPS"
echo "3. Update frontend to use ALB URL"
echo "4. Configure custom domain (optional)"
echo ""

# Save ALB details
cat > /Users/ak/Documents/TechProjects/Finsage/aws-config/alb-deployment.txt << EOF
Application Load Balancer Details
=================================

ALB Name: ${ALB_NAME}
ALB ARN: ${ALB_ARN}
ALB DNS: ${ALB_DNS}
Target Group: ${TARGET_GROUP_NAME}
EC2 Instance: ${INSTANCE_ID}
Security Group: ${ALB_SECURITY_GROUP_NAME} (${ALB_SG_ID})

Backend API URL: http://${ALB_DNS}
Health Check URL: http://${ALB_DNS}/api/v1/status/health

Created: $(date)

Next steps:
1. Test ALB endpoints
2. Set up SSL certificate
3. Update frontend configuration
4. Configure custom domain
EOF

echo "💾 ALB details saved to: aws-config/alb-deployment.txt"

