#!/bin/bash

# FinSage Enterprise - Complete AWS Production Deployment Script
# This script deploys the entire FinSage platform to AWS

set -e

echo "🚀 Starting FinSage Enterprise AWS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="finsage-enterprise"
AWS_REGION="us-east-1"
EC2_INSTANCE_TYPE="t3.medium"
RDS_INSTANCE_CLASS="db.t3.micro"
DOMAIN_NAME="finsage-enterprise.com"  # Replace with your domain

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Please install AWS CLI first.${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v terraform &> /dev/null; then
    echo -e "${YELLOW}⚠️ Terraform not found. Will use AWS CLI instead.${NC}"
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Create deployment directory
mkdir -p aws-deployment
cd aws-deployment

# 1. Create VPC and Networking
echo -e "${BLUE}🌐 Setting up VPC and networking...${NC}"

cat > vpc-setup.sh << 'EOF'
#!/bin/bash

# Create VPC
VPC_ID=$(aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 \
    --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=finsage-vpc}]' \
    --query 'Vpc.VpcId' \
    --output text)

echo "Created VPC: $VPC_ID"

# Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway \
    --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=finsage-igw}]' \
    --query 'InternetGateway.InternetGatewayId' \
    --output text)

aws ec2 attach-internet-gateway \
    --vpc-id $VPC_ID \
    --internet-gateway-id $IGW_ID

# Create public subnets
PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.1.0/24 \
    --availability-zone ${AWS_REGION}a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=finsage-public-1}]' \
    --query 'Subnet.SubnetId' \
    --output text)

PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.2.0/24 \
    --availability-zone ${AWS_REGION}b \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=finsage-public-2}]' \
    --query 'Subnet.SubnetId' \
    --output text)

# Create private subnets
PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.3.0/24 \
    --availability-zone ${AWS_REGION}a \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=finsage-private-1}]' \
    --query 'Subnet.SubnetId' \
    --output text)

PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block 10.0.4.0/24 \
    --availability-zone ${AWS_REGION}b \
    --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=finsage-private-2}]' \
    --query 'Subnet.SubnetId' \
    --output text)

# Enable auto-assign public IP for public subnets
aws ec2 modify-subnet-attribute \
    --subnet-id $PUBLIC_SUBNET_1 \
    --map-public-ip-on-launch

aws ec2 modify-subnet-attribute \
    --subnet-id $PUBLIC_SUBNET_2 \
    --map-public-ip-on-launch

# Create route table for public subnets
PUBLIC_RT=$(aws ec2 create-route-table \
    --vpc-id $VPC_ID \
    --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=finsage-public-rt}]' \
    --query 'RouteTable.RouteTableId' \
    --output text)

aws ec2 create-route \
    --route-table-id $PUBLIC_RT \
    --destination-cidr-block 0.0.0.0/0 \
    --gateway-id $IGW_ID

aws ec2 associate-route-table \
    --subnet-id $PUBLIC_SUBNET_1 \
    --route-table-id $PUBLIC_RT

aws ec2 associate-route-table \
    --subnet-id $PUBLIC_SUBNET_2 \
    --route-table-id $PUBLIC_RT

echo "VPC_ID=$VPC_ID" > vpc-config.env
echo "PUBLIC_SUBNET_1=$PUBLIC_SUBNET_1" >> vpc-config.env
echo "PUBLIC_SUBNET_2=$PUBLIC_SUBNET_2" >> vpc-config.env
echo "PRIVATE_SUBNET_1=$PRIVATE_SUBNET_1" >> vpc-config.env
echo "PRIVATE_SUBNET_2=$PRIVATE_SUBNET_2" >> vpc-config.env
echo "IGW_ID=$IGW_ID" >> vpc-config.env
echo "PUBLIC_RT=$PUBLIC_RT" >> vpc-config.env

echo "✅ VPC setup completed"
EOF

chmod +x vpc-setup.sh
./vpc-setup.sh

# Load VPC configuration
source vpc-config.env

# 2. Create Security Groups
echo -e "${BLUE}🔒 Creating security groups...${NC}"

# Web Security Group
WEB_SG=$(aws ec2 create-security-group \
    --group-name finsage-web-sg \
    --description "Security group for FinSage web servers" \
    --vpc-id $VPC_ID \
    --query 'GroupId' \
    --output text)

aws ec2 authorize-security-group-ingress \
    --group-id $WEB_SG \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id $WEB_SG \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id $WEB_SG \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0

# Database Security Group
DB_SG=$(aws ec2 create-security-group \
    --group-name finsage-db-sg \
    --description "Security group for FinSage database" \
    --vpc-id $VPC_ID \
    --query 'GroupId' \
    --output text)

aws ec2 authorize-security-group-ingress \
    --group-id $DB_SG \
    --protocol tcp \
    --port 5432 \
    --source-group $WEB_SG

echo "WEB_SG=$WEB_SG" >> vpc-config.env
echo "DB_SG=$DB_SG" >> vpc-config.env

# 3. Create RDS Database
echo -e "${BLUE}🗄️ Creating RDS PostgreSQL database...${NC}"

# Create DB subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name finsage-db-subnet-group \
    --db-subnet-group-description "Subnet group for FinSage database" \
    --subnet-ids $PRIVATE_SUBNET_1 $PRIVATE_SUBNET_2

# Create RDS instance
DB_INSTANCE=$(aws rds create-db-instance \
    --db-instance-identifier finsage-db \
    --db-instance-class $RDS_INSTANCE_CLASS \
    --engine postgres \
    --engine-version 15.4 \
    --allocated-storage 20 \
    --storage-type gp2 \
    --db-name finsage \
    --master-username finsage_admin \
    --master-user-password 'FinSage2024!' \
    --vpc-security-group-ids $DB_SG \
    --db-subnet-group-name finsage-db-subnet-group \
    --backup-retention-period 7 \
    --multi-az \
    --storage-encrypted \
    --query 'DBInstance.DBInstanceIdentifier' \
    --output text)

echo "DB_INSTANCE=$DB_INSTANCE" >> vpc-config.env

# 4. Create Application Load Balancer
echo -e "${BLUE}⚖️ Creating Application Load Balancer...${NC}"

ALB_ARN=$(aws elbv2 create-load-balancer \
    --name finsage-alb \
    --subnets $PUBLIC_SUBNET_1 $PUBLIC_SUBNET_2 \
    --security-groups $WEB_SG \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text)

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --load-balancer-arns $ALB_ARN \
    --query 'LoadBalancers[0].DNSName' \
    --output text)

echo "ALB_ARN=$ALB_ARN" >> vpc-config.env
echo "ALB_DNS=$ALB_DNS" >> vpc-config.env

# 5. Create ECR Repository
echo -e "${BLUE}📦 Creating ECR repository...${NC}"

aws ecr create-repository \
    --repository-name finsage-backend \
    --image-scanning-configuration scanOnPush=true

# Get ECR login token
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

ECR_URI=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/finsage-backend
echo "ECR_URI=$ECR_URI" >> vpc-config.env

# 6. Build and Push Docker Image
echo -e "${BLUE}🐳 Building and pushing Docker image...${NC}"

cd ..
cat > Dockerfile.production << 'EOF'
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY finsage-enterprise/package*.json ./
RUN npm ci --only=production

COPY finsage-enterprise/src ./src
COPY finsage-enterprise/public ./public
COPY finsage-enterprise/tailwind.config.js ./
COPY finsage-enterprise/postcss.config.js ./
COPY finsage-enterprise/vite.config.ts ./

RUN npm run build

FROM python:3.11-slim AS backend-builder

WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

FROM nginx:alpine AS production

# Install Node.js for serving frontend
RUN apk add --no-cache nodejs npm

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy backend
COPY --from=backend-builder /app/backend /app/backend

# Install Python for backend
RUN apk add --no-cache python3 py3-pip
RUN pip3 install --no-cache-dir fastapi uvicorn python-multipart

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'cd /app/backend && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80 8000

CMD ["/start.sh"]
EOF

cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    upstream backend {
        server localhost:8000;
    }

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Frontend routes
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API routes
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

# Build and push image
docker build -f Dockerfile.production -t finsage-backend .
docker tag finsage-backend:latest $ECR_URI:latest
docker push $ECR_URI:latest

# 7. Create ECS Cluster and Service
echo -e "${BLUE}🚀 Creating ECS cluster and service...${NC}"

cd aws-deployment

# Create ECS cluster
aws ecs create-cluster \
    --cluster-name finsage-cluster \
    --capacity-providers EC2

# Create task definition
cat > task-definition.json << EOF
{
    "family": "finsage-task",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["EC2"],
    "cpu": "512",
    "memory": "1024",
    "executionRoleArn": "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "finsage-container",
            "image": "$ECB_URI:latest",
            "portMappings": [
                {
                    "containerPort": 80,
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
            },
            "environment": [
                {
                    "name": "DATABASE_URL",
                    "value": "postgresql://finsage_admin:FinSage2024!@$DB_INSTANCE.$(aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE --query 'DBInstances[0].Endpoint.Address' --output text):5432/finsage"
                }
            ]
        }
    ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create CloudWatch log group
aws logs create-log-group --log-group-name /ecs/finsage

# Create ECS service
aws ecs create-service \
    --cluster finsage-cluster \
    --service-name finsage-service \
    --task-definition finsage-task \
    --desired-count 2 \
    --launch-type EC2 \
    --network-configuration "awsvpcConfiguration={subnets=[$PUBLIC_SUBNET_1,$PUBLIC_SUBNET_2],securityGroups=[$WEB_SG],assignPublicIp=ENABLED}" \
    --load-balancers "targetGroupArn=$(aws elbv2 create-target-group --name finsage-tg --protocol HTTP --port 80 --vpc-id $VPC_ID --query 'TargetGroups[0].TargetGroupArn' --output text),containerName=finsage-container,containerPort=80"

# 8. Create S3 Bucket for Frontend
echo -e "${BLUE}🪣 Creating S3 bucket for frontend...${NC}"

BUCKET_NAME="finsage-frontend-$(date +%s)"
aws s3 mb s3://$BUCKET_NAME --region $AWS_REGION

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Upload frontend build
cd ../finsage-enterprise
npm run build
aws s3 sync dist/ s3://$BUCKET_NAME --delete

echo "BUCKET_NAME=$BUCKET_NAME" >> ../aws-deployment/vpc-config.env

# 9. Create CloudFront Distribution
echo -e "${BLUE}☁️ Creating CloudFront distribution...${NC}"

cd ../aws-deployment

cat > cloudfront-config.json << EOF
{
    "CallerReference": "finsage-$(date +%s)",
    "Comment": "FinSage Enterprise Frontend",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com",
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
        "MinTTL": 0,
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        }
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
EOF

CLOUDFRONT_ID=$(aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json \
    --query 'Distribution.Id' \
    --output text)

CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
    --id $CLOUDFRONT_ID \
    --query 'Distribution.DomainName' \
    --output text)

echo "CLOUDFRONT_ID=$CLOUDFRONT_ID" >> vpc-config.env
echo "CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN" >> vpc-config.env

# 10. Create Route 53 DNS (if domain provided)
if [ ! -z "$DOMAIN_NAME" ]; then
    echo -e "${BLUE}🌐 Setting up Route 53 DNS...${NC}"
    
    # Create hosted zone
    HOSTED_ZONE_ID=$(aws route53 create-hosted-zone \
        --name $DOMAIN_NAME \
        --caller-reference "finsage-$(date +%s)" \
        --query 'HostedZone.Id' \
        --output text | sed 's|/hostedzone/||')
    
    # Create A record for ALB
    cat > dns-record.json << EOF
{
    "Changes": [
        {
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "$DOMAIN_NAME",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "$ALB_DNS",
                    "EvaluateTargetHealth": true,
                    "HostedZoneId": "Z35SXDOTRQ7X7K"
                }
            }
        }
    ]
}
EOF
    
    aws route53 change-resource-record-sets \
        --hosted-zone-id $HOSTED_ZONE_ID \
        --change-batch file://dns-record.json
    
    echo "HOSTED_ZONE_ID=$HOSTED_ZONE_ID" >> vpc-config.env
fi

# 11. Create SSL Certificate
echo -e "${BLUE}🔒 Creating SSL certificate...${NC}"

if [ ! -z "$DOMAIN_NAME" ]; then
    CERT_ARN=$(aws acm request-certificate \
        --domain-name $DOMAIN_NAME \
        --validation-method DNS \
        --query 'CertificateArn' \
        --output text)
    
    echo "CERT_ARN=$CERT_ARN" >> vpc-config.env
fi

# 12. Create monitoring and alerts
echo -e "${BLUE}📊 Setting up monitoring and alerts...${NC}"

# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
    --alarm-name "finsage-high-cpu" \
    --alarm-description "High CPU utilization" \
    --metric-name CPUUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2

aws cloudwatch put-metric-alarm \
    --alarm-name "finsage-high-memory" \
    --alarm-description "High memory utilization" \
    --metric-name MemoryUtilization \
    --namespace AWS/ECS \
    --statistic Average \
    --period 300 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 2

# 13. Create deployment summary
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"

cat > deployment-summary.md << EOF
# FinSage Enterprise - AWS Deployment Summary

## 🚀 Deployment Details

**Deployment Date:** $(date)
**Region:** $AWS_REGION
**Project:** $PROJECT_NAME

## 🌐 URLs

- **Frontend (CloudFront):** https://$CLOUDFRONT_DOMAIN
- **Backend (ALB):** http://$ALB_DNS
- **Database:** $DB_INSTANCE (Private)

## 📊 Infrastructure

### VPC
- **VPC ID:** $VPC_ID
- **Public Subnets:** $PUBLIC_SUBNET_1, $PUBLIC_SUBNET_2
- **Private Subnets:** $PRIVATE_SUBNET_1, $PRIVATE_SUBNET_2

### Security Groups
- **Web SG:** $WEB_SG
- **Database SG:** $DB_SG

### Load Balancer
- **ALB ARN:** $ALB_ARN
- **ALB DNS:** $ALB_DNS

### Database
- **RDS Instance:** $DB_INSTANCE
- **Engine:** PostgreSQL 15.4
- **Instance Class:** $RDS_INSTANCE_CLASS

### Container Registry
- **ECR URI:** $ECR_URI

### Storage
- **S3 Bucket:** $BUCKET_NAME
- **CloudFront:** $CLOUDFRONT_DOMAIN

## 🔧 Next Steps

1. **Configure Domain:** Update DNS settings to point to CloudFront
2. **SSL Certificate:** Validate SSL certificate for HTTPS
3. **Environment Variables:** Update application with production values
4. **Monitoring:** Set up additional CloudWatch dashboards
5. **Backup:** Configure automated backups for RDS

## 📝 Important Notes

- Database credentials are stored in ECS task definition
- SSL certificate needs validation for HTTPS
- CloudFront distribution may take 15-20 minutes to deploy
- Monitor CloudWatch logs for application health

## 🆘 Support

For issues or questions, check:
- CloudWatch Logs: /ecs/finsage
- ECS Service: finsage-service
- ALB Target Group health checks
EOF

echo -e "${GREEN}✅ Deployment summary created: deployment-summary.md${NC}"
echo -e "${BLUE}📋 Check vpc-config.env for all resource IDs${NC}"

echo -e "${GREEN}🎉 FinSage Enterprise successfully deployed to AWS!${NC}"
echo -e "${YELLOW}⏳ CloudFront distribution may take 15-20 minutes to be fully available${NC}"
echo -e "${BLUE}🌐 Frontend URL: https://$CLOUDFRONT_DOMAIN${NC}"
echo -e "${BLUE}🔗 Backend URL: http://$ALB_DNS${NC}"
