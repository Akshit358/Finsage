# 🚀 FinSage AWS Deployment - Detailed Step-by-Step Guide

## Overview
This guide provides a complete walkthrough for deploying FinSage to AWS. Tasks are clearly divided between **HUMAN** (you) and **AI** (me) responsibilities.

## 🏗️ Architecture
```
Internet → CloudFront → S3 (Frontend)
                    ↓
Internet → ALB → EC2 (Backend) → RDS (Database)
```

## 📋 Prerequisites Checklist

### HUMAN TASKS (You):
- [ ] AWS Account with billing enabled
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Docker installed locally
- [ ] Domain name (optional but recommended)
- [ ] Credit card on file for AWS billing

### AI TASKS (Me):
- [x] Analyze project structure
- [x] Create deployment scripts
- [x] Set up environment configurations
- [x] Prepare monitoring configurations

---

## 🚀 PHASE 1: AWS Account Setup & Prerequisites

### HUMAN TASKS:
1. **Create AWS Account**
   - Go to https://aws.amazon.com
   - Sign up for new account
   - Complete billing information
   - Enable MFA (Multi-Factor Authentication)

2. **Install AWS CLI**
   ```bash
   # macOS
   brew install awscli
   
   # Or download from: https://aws.amazon.com/cli/
   ```

3. **Configure AWS CLI**
   ```bash
   aws configure
   # Enter your Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
   ```

4. **Create IAM User (Recommended)**
   - Go to AWS Console → IAM → Users → Create User
   - Attach policies: `AmazonEC2FullAccess`, `AmazonS3FullAccess`, `AmazonRDSFullAccess`, `AmazonCloudFrontFullAccess`
   - Create access keys for this user

### AI TASKS:
- [x] Verify project structure
- [x] Prepare deployment scripts

---

## 🚀 PHASE 2: Backend Deployment (EC2 + ECR)

### HUMAN TASKS:

1. **Get AWS Account ID**
   ```bash
   aws sts get-caller-identity --query Account --output text
   ```
   Save this number - we'll need it for ECR URLs.

2. **Create Key Pair**
   ```bash
   aws ec2 create-key-pair --key-name finsage-key --query 'KeyMaterial' --output text > finsage-key.pem
   chmod 400 finsage-key.pem
   ```

### AI TASKS:

1. **Create ECR Repository**
   ```bash
   # I'll run this command for you
   aws ecr create-repository --repository-name finsage-backend --region us-east-1
   ```

2. **Build and Push Docker Image**
   ```bash
   # I'll create and run this script
   ./scripts/deploy-backend.sh
   ```

3. **Create EC2 Infrastructure**
   ```bash
   # I'll create security groups, launch EC2 instance, and configure it
   ./scripts/setup-ec2.sh
   ```

### HUMAN TASKS (After AI completes EC2 setup):

4. **SSH into EC2 Instance**
   ```bash
   ssh -i finsage-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
   ```

5. **Verify Backend is Running**
   ```bash
   curl http://localhost:8000/api/v1/status/health
   ```

---

## 🚀 PHASE 3: Database Setup (RDS PostgreSQL)

### HUMAN TASKS:

1. **Choose Database Password**
   - Create a strong password (save it securely)
   - We'll use this for the RDS instance

### AI TASKS:

1. **Create VPC and Subnets**
   ```bash
   ./scripts/setup-vpc.sh
   ```

2. **Create RDS Instance**
   ```bash
   ./scripts/setup-rds.sh
   ```

3. **Update Backend Configuration**
   - I'll modify the backend to connect to RDS
   - Update environment variables

### HUMAN TASKS (After AI completes RDS setup):

2. **Test Database Connection**
   ```bash
   # I'll provide you with the connection test command
   ```

---

## 🚀 PHASE 4: Frontend Deployment (S3 + CloudFront)

### HUMAN TASKS:

1. **Choose S3 Bucket Name**
   - Must be globally unique
   - Example: `finsage-frontend-yourname-2024`

### AI TASKS:

1. **Build React Frontend**
   ```bash
   ./scripts/build-frontend.sh
   ```

2. **Create S3 Bucket and Upload**
   ```bash
   ./scripts/deploy-frontend.sh
   ```

3. **Create CloudFront Distribution**
   ```bash
   ./scripts/setup-cloudfront.sh
   ```

### HUMAN TASKS (After AI completes frontend setup):

2. **Test Frontend**
   - Visit the CloudFront URL
   - Verify all features work

---

## 🚀 PHASE 5: Load Balancer & SSL

### AI TASKS:

1. **Create Application Load Balancer**
   ```bash
   ./scripts/setup-alb.sh
   ```

2. **Configure SSL Certificate**
   ```bash
   ./scripts/setup-ssl.sh
   ```

3. **Update DNS (if you have a domain)**
   - I'll provide instructions for domain setup

---

## 🚀 PHASE 6: Monitoring & Security

### AI TASKS:

1. **Set up CloudWatch Monitoring**
   ```bash
   ./scripts/setup-monitoring.sh
   ```

2. **Configure Security Groups**
   ```bash
   ./scripts/setup-security.sh
   ```

3. **Set up Logging**
   ```bash
   ./scripts/setup-logging.sh
   ```

---

## 🚀 PHASE 7: Testing & Validation

### HUMAN TASKS:

1. **Test All Endpoints**
   - Frontend: CloudFront URL
   - Backend API: ALB URL
   - Health checks

2. **Performance Testing**
   - Load test the application
   - Monitor CloudWatch metrics

### AI TASKS:

1. **Create Health Check Dashboard**
   ```bash
   ./scripts/setup-dashboard.sh
   ```

2. **Set up Alerts**
   ```bash
   ./scripts/setup-alerts.sh
   ```

---

## 📊 Expected Costs

| Service | Free Tier | Production (Monthly) |
|---------|-----------|---------------------|
| EC2 t3.micro | $0 (750 hrs) | $8.50 |
| RDS db.t3.micro | $0 (750 hrs) | $12.50 |
| S3 | $0 (5GB) | $0.50 |
| CloudFront | $0 (1TB) | $1.00 |
| ALB | $0 | $16.50 |
| **Total** | **$0** | **~$39/month** |

---

## 🔧 Configuration Files I'll Create

1. **Deployment Scripts** (`/scripts/`)
   - `deploy-backend.sh` - Backend deployment
   - `deploy-frontend.sh` - Frontend deployment
   - `setup-ec2.sh` - EC2 configuration
   - `setup-rds.sh` - Database setup
   - `setup-cloudfront.sh` - CDN setup
   - `setup-alb.sh` - Load balancer setup
   - `setup-monitoring.sh` - Monitoring setup

2. **Environment Files** (`/aws-config/`)
   - `backend.env` - Backend environment variables
   - `frontend.env` - Frontend environment variables
   - `database.env` - Database configuration

3. **Infrastructure as Code** (`/aws-config/`)
   - `cloudformation-template.yaml` - Complete infrastructure
   - `terraform/` - Terraform configurations (alternative)

---

## 🎯 Final URLs (After Deployment)

- **Frontend**: `https://d1234567890.cloudfront.net`
- **Backend API**: `https://finsage-alb-1234567890.us-east-1.elb.amazonaws.com`
- **Health Check**: `https://finsage-alb-1234567890.us-east-1.elb.amazonaws.com/api/v1/status/health`

---

## ⚠️ Important Notes

### HUMAN RESPONSIBILITIES:
- Keep AWS credentials secure
- Monitor billing dashboard
- Test application functionality
- Handle domain registration (if using custom domain)
- Review and approve security configurations

### AI RESPONSIBILITIES:
- Create all deployment scripts
- Configure infrastructure
- Set up monitoring and logging
- Handle code modifications for AWS compatibility
- Provide troubleshooting guidance

---

## 🚨 Emergency Contacts & Troubleshooting

If something goes wrong during deployment:

1. **Check AWS Console** for service status
2. **Review CloudWatch Logs** for application errors
3. **Verify Security Groups** are properly configured
4. **Test connectivity** between services

I'll provide specific troubleshooting commands for each phase.

---

## 📝 Deployment Checklist

### Pre-Deployment:
- [ ] AWS account ready
- [ ] AWS CLI configured
- [ ] Docker installed
- [ ] Project code ready

### Phase 1: Backend
- [ ] ECR repository created
- [ ] Docker image built and pushed
- [ ] EC2 instance launched
- [ ] Backend running and healthy

### Phase 2: Database
- [ ] VPC and subnets created
- [ ] RDS instance launched
- [ ] Database connection tested
- [ ] Backend connected to database

### Phase 3: Frontend
- [ ] React app built
- [ ] S3 bucket created
- [ ] Files uploaded to S3
- [ ] CloudFront distribution created
- [ ] Frontend accessible

### Phase 4: Load Balancer
- [ ] ALB created
- [ ] SSL certificate configured
- [ ] Backend connected to ALB
- [ ] Health checks passing

### Phase 5: Monitoring
- [ ] CloudWatch dashboards created
- [ ] Alerts configured
- [ ] Logging set up
- [ ] Security groups reviewed

---

## 🎉 Success Criteria

Deployment is successful when:
- [ ] Frontend loads at CloudFront URL
- [ ] Backend API responds at ALB URL
- [ ] Database connections work
- [ ] All health checks pass
- [ ] Monitoring shows green status
- [ ] SSL certificates are valid
- [ ] Performance is acceptable

---

**Ready to start?** Let me know when you've completed the prerequisites, and I'll begin creating the deployment scripts and configurations!

