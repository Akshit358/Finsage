#!/bin/bash

# FinSage EC2 Setup Script
# This script creates EC2 infrastructure and deploys the backend

set -e  # Exit on any error

echo "🖥️  FinSage EC2 Setup Script"
echo "============================"

# Configuration
AWS_REGION="us-east-1"
INSTANCE_TYPE="t3.micro"
AMI_ID="ami-0c02fb55956c7d316"  # Amazon Linux 2
KEY_NAME="finsage-key"
SECURITY_GROUP_NAME="finsage-backend-sg"
INSTANCE_NAME="finsage-backend"

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/finsage-backend"

echo "📋 Configuration:"
echo "  AWS Account ID: ${AWS_ACCOUNT_ID}"
echo "  AWS Region: ${AWS_REGION}"
echo "  Instance Type: ${INSTANCE_TYPE}"
echo "  Key Name: ${KEY_NAME}"
echo ""

# Check if key pair exists
echo "🔑 Checking key pair..."
if ! aws ec2 describe-key-pairs --key-names ${KEY_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
    echo "❌ Key pair '${KEY_NAME}' not found!"
    echo "Please create it first:"
    echo "aws ec2 create-key-pair --key-name ${KEY_NAME} --query 'KeyMaterial' --output text > ${KEY_NAME}.pem"
    echo "chmod 400 ${KEY_NAME}.pem"
    exit 1
fi
echo "✅ Key pair found"

# Create security group
echo "🛡️  Creating security group..."
if ! aws ec2 describe-security-groups --group-names ${SECURITY_GROUP_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
    aws ec2 create-security-group \
        --group-name ${SECURITY_GROUP_NAME} \
        --description "FinSage Backend Security Group" \
        --region ${AWS_REGION}
    echo "✅ Security group created"
else
    echo "✅ Security group already exists"
fi

# Get security group ID
SG_ID=$(aws ec2 describe-security-groups --group-names ${SECURITY_GROUP_NAME} --region ${AWS_REGION} --query 'SecurityGroups[0].GroupId' --output text)

# Add security group rules
echo "🔧 Configuring security group rules..."

# HTTP access for backend
aws ec2 authorize-security-group-ingress \
    --group-id ${SG_ID} \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0 \
    --region ${AWS_REGION} 2>/dev/null || echo "Port 8000 rule already exists"

# SSH access
aws ec2 authorize-security-group-ingress \
    --group-id ${SG_ID} \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0 \
    --region ${AWS_REGION} 2>/dev/null || echo "SSH rule already exists"

echo "✅ Security group rules configured"

# Create user data script
echo "📝 Creating user data script..."
cat > /tmp/ec2-user-data.sh << 'EOF'
#!/bin/bash
yum update -y
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create environment file
cat > /home/ec2-user/.env << 'ENVEOF'
PORT=8000
HOST=0.0.0.0
ENVEOF

# Create deployment script
cat > /home/ec2-user/deploy.sh << 'DEPLOYEOF'
#!/bin/bash
set -e

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/finsage-backend"

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_URI}

# Stop existing container
docker stop finsage-backend || true
docker rm finsage-backend || true

# Pull and run new container
docker pull ${ECR_URI}:latest
docker run -d \
    --name finsage-backend \
    --restart unless-stopped \
    -p 8000:8000 \
    --env-file /home/ec2-user/.env \
    ${ECR_URI}:latest

echo "✅ FinSage backend deployed successfully!"
echo "🔗 Backend URL: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000"
DEPLOYEOF

chmod +x /home/ec2-user/deploy.sh
EOF

# Launch EC2 instance
echo "🚀 Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ${AMI_ID} \
    --instance-type ${INSTANCE_TYPE} \
    --key-name ${KEY_NAME} \
    --security-group-ids ${SG_ID} \
    --user-data file:///tmp/ec2-user-data.sh \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${INSTANCE_NAME}}]" \
    --region ${AWS_REGION} \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "✅ EC2 instance launched: ${INSTANCE_ID}"

# Wait for instance to be running
echo "⏳ Waiting for instance to be running..."
aws ec2 wait instance-running --instance-ids ${INSTANCE_ID} --region ${AWS_REGION}

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids ${INSTANCE_ID} \
    --region ${AWS_REGION} \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo "✅ Instance is running!"
echo ""
echo "📋 Instance Details:"
echo "  Instance ID: ${INSTANCE_ID}"
echo "  Public IP: ${PUBLIC_IP}"
echo "  Security Group: ${SECURITY_GROUP_NAME} (${SG_ID})"
echo ""
echo "🔗 SSH Command:"
echo "  ssh -i ${KEY_NAME}.pem ec2-user@${PUBLIC_IP}"
echo ""
echo "📋 Next steps:"
echo "1. Wait 2-3 minutes for instance setup to complete"
echo "2. SSH into the instance"
echo "3. Run: ./deploy.sh"
echo "4. Test: curl http://${PUBLIC_IP}:8000/api/v1/status/health"
echo ""
echo "🎯 Backend will be available at: http://${PUBLIC_IP}:8000"

# Clean up
rm -f /tmp/ec2-user-data.sh

