#!/bin/bash

# FinSage RDS Setup Script
# This script creates RDS PostgreSQL database

set -e  # Exit on any error

echo "🗄️  FinSage RDS Setup Script"
echo "============================"

# Configuration
AWS_REGION="us-east-1"
DB_INSTANCE_ID="finsage-db"
DB_INSTANCE_CLASS="db.t3.micro"
DB_ENGINE="postgres"
DB_MASTER_USERNAME="finsage"
DB_NAME="finsage"
DB_SUBNET_GROUP_NAME="finsage-db-subnet-group"
DB_SECURITY_GROUP_NAME="finsage-db-sg"

# Get default VPC ID
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --region ${AWS_REGION} --query 'Vpcs[0].VpcId' --output text)

echo "📋 Configuration:"
echo "  AWS Region: ${AWS_REGION}"
echo "  DB Instance ID: ${DB_INSTANCE_ID}"
echo "  DB Instance Class: ${DB_INSTANCE_CLASS}"
echo "  DB Engine: ${DB_ENGINE}"
echo "  VPC ID: ${VPC_ID}"
echo ""

# Prompt for database password
echo "🔐 Database Password Setup"
echo "Please enter a strong password for the database (minimum 8 characters):"
read -s DB_MASTER_PASSWORD
echo ""

if [ ${#DB_MASTER_PASSWORD} -lt 8 ]; then
    echo "❌ Password must be at least 8 characters long"
    exit 1
fi

# Create DB security group
echo "🛡️  Creating database security group..."
if ! aws ec2 describe-security-groups --group-names ${DB_SECURITY_GROUP_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
    aws ec2 create-security-group \
        --group-name ${DB_SECURITY_GROUP_NAME} \
        --description "FinSage Database Security Group" \
        --vpc-id ${VPC_ID} \
        --region ${AWS_REGION}
    echo "✅ Database security group created"
else
    echo "✅ Database security group already exists"
fi

# Get database security group ID
DB_SG_ID=$(aws ec2 describe-security-groups --group-names ${DB_SECURITY_GROUP_NAME} --region ${AWS_REGION} --query 'SecurityGroups[0].GroupId' --output text)

# Get backend security group ID (for allowing backend to access database)
BACKEND_SG_ID=$(aws ec2 describe-security-groups --group-names "finsage-backend-sg" --region ${AWS_REGION} --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "")

# Add security group rules for database
echo "🔧 Configuring database security group rules..."

# PostgreSQL access from backend
if [ ! -z "${BACKEND_SG_ID}" ]; then
    aws ec2 authorize-security-group-ingress \
        --group-id ${DB_SG_ID} \
        --protocol tcp \
        --port 5432 \
        --source-group ${BACKEND_SG_ID} \
        --region ${AWS_REGION} 2>/dev/null || echo "Backend access rule already exists"
fi

# PostgreSQL access from EC2 instances (for debugging)
aws ec2 authorize-security-group-ingress \
    --group-id ${DB_SG_ID} \
    --protocol tcp \
    --port 5432 \
    --cidr 0.0.0.0/0 \
    --region ${AWS_REGION} 2>/dev/null || echo "Public access rule already exists"

echo "✅ Database security group rules configured"

# Get subnets for DB subnet group
echo "🔍 Getting subnets for DB subnet group..."
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=${VPC_ID}" --region ${AWS_REGION} --query 'Subnets[].SubnetId' --output text)
SUBNET_ARRAY=($SUBNETS)

if [ ${#SUBNET_ARRAY[@]} -lt 2 ]; then
    echo "❌ Need at least 2 subnets for RDS subnet group"
    exit 1
fi

# Create DB subnet group
echo "📦 Creating DB subnet group..."
if ! aws rds describe-db-subnet-groups --db-subnet-group-name ${DB_SUBNET_GROUP_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
    aws rds create-db-subnet-group \
        --db-subnet-group-name ${DB_SUBNET_GROUP_NAME} \
        --db-subnet-group-description "FinSage DB Subnet Group" \
        --subnet-ids ${SUBNET_ARRAY[0]} ${SUBNET_ARRAY[1]} \
        --region ${AWS_REGION}
    echo "✅ DB subnet group created"
else
    echo "✅ DB subnet group already exists"
fi

# Create RDS instance
echo "🚀 Creating RDS instance..."
if ! aws rds describe-db-instances --db-instance-identifier ${DB_INSTANCE_ID} --region ${AWS_REGION} >/dev/null 2>&1; then
    aws rds create-db-instance \
        --db-instance-identifier ${DB_INSTANCE_ID} \
        --db-instance-class ${DB_INSTANCE_CLASS} \
        --engine ${DB_ENGINE} \
        --master-username ${DB_MASTER_USERNAME} \
        --master-user-password ${DB_MASTER_PASSWORD} \
        --allocated-storage 20 \
        --storage-type gp2 \
        --vpc-security-group-ids ${DB_SG_ID} \
        --db-subnet-group-name ${DB_SUBNET_GROUP_NAME} \
        --backup-retention-period 7 \
        --multi-az false \
        --publicly-accessible true \
        --storage-encrypted \
        --region ${AWS_REGION}
    
    echo "✅ RDS instance creation initiated"
    echo "⏳ This will take 5-10 minutes..."
    
    # Wait for DB instance to be available
    echo "⏳ Waiting for database to be available..."
    aws rds wait db-instance-available --db-instance-identifier ${DB_INSTANCE_ID} --region ${AWS_REGION}
    
    echo "✅ RDS instance is available!"
else
    echo "✅ RDS instance already exists"
fi

# Get database endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier ${DB_INSTANCE_ID} \
    --region ${AWS_REGION} \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

DB_PORT=$(aws rds describe-db-instances \
    --db-instance-identifier ${DB_INSTANCE_ID} \
    --region ${AWS_REGION} \
    --query 'DBInstances[0].Endpoint.Port' \
    --output text)

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📋 Database Details:"
echo "  Instance ID: ${DB_INSTANCE_ID}"
echo "  Endpoint: ${DB_ENDPOINT}"
echo "  Port: ${DB_PORT}"
echo "  Username: ${DB_MASTER_USERNAME}"
echo "  Database: ${DB_NAME}"
echo ""
echo "🔗 Connection String:"
echo "  postgresql://${DB_MASTER_USERNAME}:${DB_MASTER_PASSWORD}@${DB_ENDPOINT}:${DB_PORT}/${DB_NAME}"
echo ""
echo "📋 Next steps:"
echo "1. Update backend environment variables with database connection"
echo "2. Test database connection from EC2 instance"
echo "3. Run database migrations if needed"
echo ""
echo "⚠️  Important: Save the database password securely!"

# Save connection details to file
cat > /Users/ak/Documents/TechProjects/Finsage/aws-config/database-connection.txt << EOF
Database Connection Details
==========================

Instance ID: ${DB_INSTANCE_ID}
Endpoint: ${DB_ENDPOINT}
Port: ${DB_PORT}
Username: ${DB_MASTER_USERNAME}
Password: ${DB_MASTER_PASSWORD}
Database: ${DB_NAME}

Connection String:
postgresql://${DB_MASTER_USERNAME}:${DB_MASTER_PASSWORD}@${DB_ENDPOINT}:${DB_PORT}/${DB_NAME}

Security Group: ${DB_SECURITY_GROUP_NAME} (${DB_SG_ID})
Subnet Group: ${DB_SUBNET_GROUP_NAME}
EOF

echo "💾 Connection details saved to: aws-config/database-connection.txt"

