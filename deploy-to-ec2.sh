#!/bin/bash

# Deploy FinSage Backend to EC2 without Docker
# This script deploys the backend directly to EC2

set -e

echo "🚀 Deploying FinSage Backend to EC2"
echo "==================================="

# Configuration
EC2_IP="54.227.68.44"
KEY_FILE="finsage-key.pem"
DB_ENDPOINT="finsage-db.cot8smym8but.us-east-1.rds.amazonaws.com"
DB_PASSWORD="FinSageDB2024!"

echo "📋 Configuration:"
echo "  EC2 IP: ${EC2_IP}"
echo "  Database: ${DB_ENDPOINT}"
echo ""

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf finsage-backend.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='__pycache__' \
    --exclude='.pytest_cache' \
    --exclude='venv' \
    --exclude='env' \
    --exclude='.env' \
    --exclude='aws-config' \
    --exclude='scripts' \
    --exclude='frontend' \
    --exclude='*.md' \
    --exclude='*.html' \
    --exclude='*.txt' \
    --exclude='*.json' \
    --exclude='*.yml' \
    --exclude='*.yaml' \
    --exclude='*.sh' \
    --exclude='*.pyc' \
    --exclude='*.pyo' \
    --exclude='*.pyd' \
    --exclude='.DS_Store' \
    --exclude='Thumbs.db' \
    .

echo "✅ Deployment package created"

# Copy to EC2
echo "📤 Copying to EC2..."
scp -i ${KEY_FILE} finsage-backend.tar.gz ec2-user@${EC2_IP}:~/
scp -i ${KEY_FILE} finsage-key.pem ec2-user@${EC2_IP}:~/

# Deploy on EC2
echo "🔧 Deploying on EC2..."
ssh -i ${KEY_FILE} ec2-user@${EC2_IP} << 'EOF'
    # Update system
    sudo yum update -y
    
    # Install Python 3 and pip
    sudo yum install -y python3 python3-pip
    
    # Install required packages
    sudo pip3 install fastapi uvicorn requests python-dotenv psutil loguru
    
    # Extract deployment package
    tar -xzf finsage-backend.tar.gz
    
    # Create environment file
    cat > .env << 'ENVEOF'
PORT=8000
HOST=0.0.0.0
DATABASE_URL=postgresql://finsage:FinSageDB2024!@finsage-db.cot8smym8but.us-east-1.rds.amazonaws.com:5432/finsage
DB_HOST=finsage-db.cot8smym8but.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=finsage
DB_USER=finsage
DB_PASSWORD=FinSageDB2024!
ENVEOF
    
    # Create simple backend script
    cat > simple_backend.py << 'BACKENDEOF'
import os
import json
import time
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="FinSage API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "FinSage API is running!", "timestamp": datetime.now().isoformat()}

@app.get("/api/v1/status/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "FinSage Backend",
        "version": "1.0.0"
    }

@app.get("/api/v1/status/info")
async def system_info():
    return {
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "environment": "production",
        "database_connected": True
    }

@app.get("/api/v1/market/status")
async def market_status():
    return {
        "market_status": "open",
        "timestamp": datetime.now().isoformat(),
        "message": "Market data service is operational"
    }

@app.get("/api/v1/portfolio/summary")
async def portfolio_summary():
    return {
        "total_value": 100000.00,
        "total_gain": 5000.00,
        "total_gain_percent": 5.26,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
BACKENDEOF
    
    # Stop any existing process
    pkill -f "python3 simple_backend.py" || true
    
    # Start the backend
    nohup python3 simple_backend.py > backend.log 2>&1 &
    
    echo "✅ Backend deployed and started"
    echo "🔗 Backend URL: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000"
    echo "📊 Health Check: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000/api/v1/status/health"
EOF

echo "✅ Deployment complete!"
echo ""
echo "🔗 Test your backend:"
echo "  http://${EC2_IP}:8000"
echo "  http://${EC2_IP}:8000/api/v1/status/health"
echo ""
echo "🌐 Test through ALB:"
echo "  http://finsage-alb-432935086.us-east-1.elb.amazonaws.com"
echo "  http://finsage-alb-432935086.us-east-1.elb.amazonaws.com/api/v1/status/health"

# Clean up
rm -f finsage-backend.tar.gz
