# FinSage AWS Deployment Guide

## 🏗️ Architecture Overview

```
Internet → CloudFront → S3 (Frontend)
                    ↓
Internet → ALB → EC2 (Backend) → RDS (Database)
```

## 📋 Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Docker** installed locally
4. **Domain name** (optional, for custom domain)

## 🚀 Step-by-Step Deployment

### Step 1: Backend Deployment (EC2 + ECR)

#### 1.1 Create ECR Repository
```bash
# Create ECR repository
aws ecr create-repository --repository-name finsage-backend --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

#### 1.2 Build and Push Docker Image
```bash
# Build image
docker build -t finsage-backend .

# Tag for ECR
docker tag finsage-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/finsage-backend:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/finsage-backend:latest
```

#### 1.3 Create EC2 Instance
```bash
# Create security group
aws ec2 create-security-group --group-name finsage-backend-sg --description "FinSage Backend Security Group"

# Add inbound rules
aws ec2 authorize-security-group-ingress --group-name finsage-backend-sg --protocol tcp --port 8000 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name finsage-backend-sg --protocol tcp --port 22 --cidr YOUR_IP/32

# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.micro \
  --key-name YOUR_KEY_PAIR \
  --security-groups finsage-backend-sg \
  --user-data file://ec2-user-data.sh
```

#### 1.4 Deploy to EC2
```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@YOUR_EC2_IP

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Pull and run container
docker pull YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/finsage-backend:latest
docker run -d -p 8000:8000 --name finsage-backend YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/finsage-backend:latest
```

### Step 2: Frontend Deployment (S3 + CloudFront)

#### 2.1 Build Frontend
```bash
cd frontend/finsage-ui
npm run build
```

#### 2.2 Create S3 Bucket
```bash
# Create S3 bucket
aws s3 mb s3://finsage-frontend-YOUR_UNIQUE_ID

# Enable static website hosting
aws s3 website s3://finsage-frontend-YOUR_UNIQUE_ID --index-document index.html --error-document index.html

# Upload files
aws s3 sync build/ s3://finsage-frontend-YOUR_UNIQUE_ID --delete
```

#### 2.3 Create CloudFront Distribution
```bash
# Create CloudFront distribution (use AWS Console for this)
# Origin: S3 bucket
# Default root object: index.html
# Error pages: 404 → /index.html (for React Router)
```

### Step 3: Database Setup (RDS PostgreSQL)

#### 3.1 Create RDS Instance
```bash
# Create DB subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name finsage-db-subnet-group \
  --db-subnet-group-description "FinSage DB Subnet Group" \
  --subnet-ids subnet-12345 subnet-67890

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier finsage-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username finsage \
  --master-user-password YOUR_DB_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-12345 \
  --db-subnet-group-name finsage-db-subnet-group
```

### Step 4: Load Balancer Setup

#### 4.1 Create Application Load Balancer
```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name finsage-alb \
  --subnets subnet-12345 subnet-67890 \
  --security-groups sg-12345

# Create target group
aws elbv2 create-target-group \
  --name finsage-backend-tg \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-12345

# Register targets
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/finsage-backend-tg/1234567890123456 \
  --targets Id=i-1234567890abcdef0
```

## 🔧 Configuration Files

### EC2 User Data Script
```bash
#!/bin/bash
# ec2-user-data.sh
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
```

### Environment Variables
```bash
# Backend environment variables
export DATABASE_URL=postgresql://finsage:password@finsage-db.123456789012.us-east-1.rds.amazonaws.com:5432/finsage
export PORT=8000
export HOST=0.0.0.0
```

## 💰 Cost Estimation

| Service | Monthly Cost (Free Tier) | Monthly Cost (Production) |
|---------|-------------------------|---------------------------|
| **EC2 t3.micro** | $0 (750 hours) | $8.50 |
| **RDS db.t3.micro** | $0 (750 hours) | $12.50 |
| **S3** | $0 (5GB) | $0.50 |
| **CloudFront** | $0 (1TB) | $1.00 |
| **ALB** | $0 | $16.50 |
| **Total** | **$0** | **~$39/month** |

## 🔒 Security Best Practices

1. **Security Groups**: Restrict access to necessary ports only
2. **IAM Roles**: Use least privilege principle
3. **VPC**: Deploy in private subnets where possible
4. **SSL/TLS**: Use CloudFront for HTTPS
5. **Database**: Enable encryption at rest
6. **Monitoring**: Set up CloudWatch alarms

## 📊 Monitoring & Logging

### CloudWatch Setup
```bash
# Create log group
aws logs create-log-group --log-group-name /aws/ec2/finsage-backend

# Create log stream
aws logs create-log-stream --log-group-name /aws/ec2/finsage-backend --log-stream-name finsage-backend-1
```

### Health Checks
- **EC2**: Application Load Balancer health checks
- **RDS**: Automated backups and monitoring
- **S3**: CloudWatch metrics
- **CloudFront**: Real-time monitoring

## 🚀 Production Optimizations

1. **Auto Scaling**: Configure EC2 Auto Scaling Group
2. **Caching**: Use ElastiCache for Redis
3. **CDN**: CloudFront for global distribution
4. **SSL**: AWS Certificate Manager for HTTPS
5. **Monitoring**: CloudWatch dashboards and alarms
6. **Backup**: Automated RDS backups

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - name: Build and push Docker image
        run: |
          docker build -t finsage-backend .
          docker tag finsage-backend:latest $ECR_REGISTRY/finsage-backend:latest
          docker push $ECR_REGISTRY/finsage-backend:latest
      - name: Deploy to EC2
        run: |
          aws ecs update-service --cluster finsage-cluster --service finsage-service --force-new-deployment
```

## 🎯 Expected URLs

- **Frontend**: `https://d1234567890.cloudfront.net`
- **Backend API**: `https://finsage-alb-1234567890.us-east-1.elb.amazonaws.com`
- **Health Check**: `https://finsage-alb-1234567890.us-east-1.elb.amazonaws.com/api/v1/status/health`

## ⚠️ Troubleshooting

### Common Issues:
1. **CORS errors**: Check security group rules
2. **502 Bad Gateway**: Check EC2 instance health
3. **Database connection**: Verify RDS security groups
4. **CloudFront cache**: Clear cache after updates

### Debug Commands:
```bash
# Check EC2 logs
docker logs finsage-backend

# Check ALB health
aws elbv2 describe-target-health --target-group-arn YOUR_TG_ARN

# Check CloudFront distribution
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

This deployment gives you hands-on experience with:
- **EC2**: Virtual servers
- **S3**: Object storage
- **CloudFront**: CDN
- **RDS**: Managed database
- **ALB**: Load balancing
- **VPC**: Networking
- **IAM**: Security
- **CloudWatch**: Monitoring
