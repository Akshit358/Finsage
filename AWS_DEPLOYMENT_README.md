# 🚀 FinSage AWS Deployment Guide

## Overview
This guide provides a complete walkthrough for deploying FinSage to AWS with clear separation of human and AI responsibilities.

## 📁 Project Structure
```
/scripts/
├── deploy-all.sh          # Master deployment script
├── deploy-backend.sh      # Backend deployment to ECR/EC2
├── setup-ec2.sh          # EC2 infrastructure setup
├── setup-rds.sh          # RDS database setup
├── deploy-frontend.sh    # Frontend deployment to S3
├── setup-cloudfront.sh   # CloudFront CDN setup
├── setup-alb.sh          # Application Load Balancer setup
├── setup-monitoring.sh   # CloudWatch monitoring setup
└── setup-security.sh     # Security configuration

/aws-config/
├── backend.env           # Backend environment variables
├── frontend.env          # Frontend environment variables
├── database.env          # Database configuration
└── *.txt                 # Deployment details (generated)
```

## 🎯 Quick Start

### Prerequisites (HUMAN TASKS)
1. **AWS Account** with billing enabled
2. **AWS CLI** installed and configured
3. **Docker** installed locally
4. **jq** installed (`brew install jq` on macOS)

### One-Command Deployment (AI HANDLES EVERYTHING)
```bash
# Run the complete deployment
./scripts/deploy-all.sh
```

This single command will:
- ✅ Build and push backend to ECR
- ✅ Create and configure EC2 instance
- ✅ Set up RDS PostgreSQL database
- ✅ Deploy frontend to S3
- ✅ Create CloudFront distribution
- ✅ Set up Application Load Balancer
- ✅ Configure monitoring and security

## 📋 Detailed Step-by-Step Process

### Phase 1: Prerequisites (HUMAN)
1. **Create AWS Account**
   - Go to https://aws.amazon.com
   - Complete billing information
   - Enable MFA

2. **Install Prerequisites**
   ```bash
   # macOS
   brew install awscli docker jq
   
   # Configure AWS CLI
   aws configure
   ```

3. **Create Key Pair**
   ```bash
   aws ec2 create-key-pair --key-name finsage-key --query 'KeyMaterial' --output text > finsage-key.pem
   chmod 400 finsage-key.pem
   ```

### Phase 2: Backend Deployment (AI)
```bash
# Deploy backend to ECR and EC2
./scripts/deploy-backend.sh
./scripts/setup-ec2.sh
```

**What I do:**
- Create ECR repository
- Build Docker image
- Push to ECR
- Create EC2 instance
- Configure security groups
- Set up user data script

**What you do:**
- Wait for EC2 setup (2-3 minutes)
- SSH into instance: `ssh -i finsage-key.pem ec2-user@YOUR_EC2_IP`
- Run: `./deploy.sh`
- Test: `curl http://YOUR_EC2_IP:8000/api/v1/status/health`

### Phase 3: Database Setup (AI)
```bash
# Set up RDS PostgreSQL
./scripts/setup-rds.sh
```

**What I do:**
- Create VPC and subnets
- Create RDS instance
- Configure security groups
- Update backend configuration

**What you do:**
- Provide database password when prompted
- Test database connection

### Phase 4: Frontend Deployment (AI)
```bash
# Deploy React frontend
./scripts/deploy-frontend.sh
./scripts/setup-cloudfront.sh BUCKET_NAME
```

**What I do:**
- Build React application
- Create S3 bucket
- Upload files
- Create CloudFront distribution
- Configure caching and error handling

**What you do:**
- Test frontend at CloudFront URL

### Phase 5: Load Balancer (AI)
```bash
# Set up Application Load Balancer
./scripts/setup-alb.sh
```

**What I do:**
- Create ALB
- Configure target groups
- Set up health checks
- Connect to EC2 instance

**What you do:**
- Test ALB endpoints

### Phase 6: Monitoring & Security (AI)
```bash
# Set up monitoring and security
./scripts/setup-monitoring.sh
./scripts/setup-security.sh
```

**What I do:**
- Create CloudWatch dashboards
- Set up alarms
- Configure security groups
- Enable VPC Flow Logs
- Set up WAF protection

## 🔧 Configuration

### Environment Variables
Update these files with your actual values:

**Backend (`aws-config/backend.env`):**
```bash
DATABASE_URL=postgresql://finsage:password@your-rds-endpoint:5432/finsage
CORS_ORIGINS=https://your-cloudfront-domain
```

**Frontend (`aws-config/frontend.env`):**
```bash
REACT_APP_API_BASE_URL=https://your-alb-dns
```

### Database Connection
Get connection details from `aws-config/database-connection.txt`:
```bash
postgresql://finsage:password@your-rds-endpoint:5432/finsage
```

## 📊 Monitoring

### CloudWatch Dashboard
- **URL**: https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=FinSage-Monitoring
- **Metrics**: CPU, Memory, Network, Application logs
- **Alarms**: High CPU, Memory, Error rates

### Health Checks
- **Backend**: `https://your-alb-dns/api/v1/status/health`
- **Frontend**: `https://your-cloudfront-domain`

## 💰 Cost Estimation

| Service | Free Tier | Production |
|---------|-----------|------------|
| EC2 t3.micro | $0 (750 hrs) | $8.50/month |
| RDS db.t3.micro | $0 (750 hrs) | $12.50/month |
| S3 | $0 (5GB) | $0.50/month |
| CloudFront | $0 (1TB) | $1.00/month |
| ALB | $0 | $16.50/month |
| **Total** | **$0** | **~$39/month** |

## 🔒 Security Features

- ✅ **WAF Protection**: Rate limiting, DDoS protection
- ✅ **Security Groups**: Restrictive access rules
- ✅ **VPC Flow Logs**: Network traffic monitoring
- ✅ **IAM Policies**: Least privilege access
- ✅ **SSL/TLS**: HTTPS everywhere
- ✅ **Database Encryption**: At rest and in transit

## 🚨 Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   ```bash
   # Check EC2 instance
   ssh -i finsage-key.pem ec2-user@YOUR_EC2_IP
   docker logs finsage-backend
   ```

2. **CORS Errors**
   - Update `CORS_ORIGINS` in backend environment
   - Check security group rules

3. **Database Connection Failed**
   - Verify RDS security groups
   - Check connection string
   - Test from EC2 instance

4. **CloudFront Not Updating**
   - Clear CloudFront cache
   - Check S3 bucket permissions

### Debug Commands
```bash
# Check ALB health
aws elbv2 describe-target-health --target-group-arn YOUR_TG_ARN

# Check EC2 logs
aws logs describe-log-streams --log-group-name /aws/ec2/finsage-backend

# Check CloudFront distribution
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## 📝 Post-Deployment Checklist

- [ ] Backend API responding at ALB URL
- [ ] Frontend loading at CloudFront URL
- [ ] Database connection working
- [ ] Health checks passing
- [ ] Monitoring dashboards showing data
- [ ] Security groups properly configured
- [ ] SSL certificates valid
- [ ] All features working end-to-end

## 🎉 Success Criteria

Deployment is successful when:
- ✅ Frontend loads at CloudFront URL
- ✅ Backend API responds at ALB URL
- ✅ Database connections work
- ✅ All health checks pass
- ✅ Monitoring shows green status
- ✅ SSL certificates are valid
- ✅ Performance is acceptable

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review CloudWatch logs
3. Verify security group configurations
4. Test connectivity between services

## 🔄 Updates and Maintenance

### Updating Backend
```bash
# Rebuild and redeploy
./scripts/deploy-backend.sh
# SSH to EC2 and run: ./deploy.sh
```

### Updating Frontend
```bash
# Rebuild and redeploy
./scripts/deploy-frontend.sh
./scripts/setup-cloudfront.sh BUCKET_NAME
```

### Scaling
- **EC2**: Use Auto Scaling Groups
- **Database**: Scale RDS instance
- **CDN**: CloudFront handles scaling automatically

---

**Ready to deploy?** Run `./scripts/deploy-all.sh` and I'll handle everything! 🚀

