#!/bin/bash

# FinSage Monitoring Setup Script
# This script sets up CloudWatch monitoring and alerts

set -e  # Exit on any error

echo "📊 FinSage Monitoring Setup Script"
echo "=================================="

# Configuration
AWS_REGION="us-east-1"
LOG_GROUP_NAME="/aws/ec2/finsage-backend"
ALARM_TOPIC_NAME="finsage-alerts"

echo "📋 Configuration:"
echo "  AWS Region: ${AWS_REGION}"
echo "  Log Group: ${LOG_GROUP_NAME}"
echo "  Alarm Topic: ${ALARM_TOPIC_NAME}"
echo ""

# Create CloudWatch log group
echo "📝 Creating CloudWatch log group..."
if ! aws logs describe-log-groups --log-group-name-prefix ${LOG_GROUP_NAME} --region ${AWS_REGION} >/dev/null 2>&1; then
    aws logs create-log-group --log-group-name ${LOG_GROUP_NAME} --region ${AWS_REGION}
    echo "✅ Log group created"
else
    echo "✅ Log group already exists"
fi

# Set log retention policy (30 days)
echo "⏰ Setting log retention policy..."
aws logs put-retention-policy \
    --log-group-name ${LOG_GROUP_NAME} \
    --retention-in-days 30 \
    --region ${AWS_REGION}

echo "✅ Log retention policy set to 30 days"

# Create SNS topic for alerts
echo "📢 Creating SNS topic for alerts..."
if ! aws sns get-topic-attributes --topic-arn "arn:aws:sns:${AWS_REGION}:$(aws sts get-caller-identity --query Account --output text):${ALARM_TOPIC_NAME}" --region ${AWS_REGION} >/dev/null 2>&1; then
    SNS_OUTPUT=$(aws sns create-topic --name ${ALARM_TOPIC_NAME} --region ${AWS_REGION})
    SNS_TOPIC_ARN=$(echo $SNS_OUTPUT | jq -r '.TopicArn')
    echo "✅ SNS topic created"
else
    SNS_TOPIC_ARN="arn:aws:sns:${AWS_REGION}:$(aws sts get-caller-identity --query Account --output text):${ALARM_TOPIC_NAME}"
    echo "✅ SNS topic already exists"
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
    echo "Skipping EC2-specific monitoring setup"
    INSTANCE_ID=""
else
    echo "✅ Found EC2 instance: ${INSTANCE_ID}"
fi

# Create CloudWatch alarms
echo "🚨 Creating CloudWatch alarms..."

# High CPU utilization alarm
if [ ! -z "$INSTANCE_ID" ]; then
    aws cloudwatch put-metric-alarm \
        --alarm-name "finsage-high-cpu" \
        --alarm-description "High CPU utilization on FinSage backend" \
        --metric-name CPUUtilization \
        --namespace AWS/EC2 \
        --statistic Average \
        --period 300 \
        --threshold 80 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 2 \
        --alarm-actions ${SNS_TOPIC_ARN} \
        --dimensions Name=InstanceId,Value=${INSTANCE_ID} \
        --region ${AWS_REGION} 2>/dev/null || echo "CPU alarm already exists"
    
    echo "✅ CPU utilization alarm created"
fi

# High memory utilization alarm
if [ ! -z "$INSTANCE_ID" ]; then
    aws cloudwatch put-metric-alarm \
        --alarm-name "finsage-high-memory" \
        --alarm-description "High memory utilization on FinSage backend" \
        --metric-name MemoryUtilization \
        --namespace System/Linux \
        --statistic Average \
        --period 300 \
        --threshold 80 \
        --comparison-operator GreaterThanThreshold \
        --evaluation-periods 2 \
        --alarm-actions ${SNS_TOPIC_ARN} \
        --dimensions Name=InstanceId,Value=${INSTANCE_ID} \
        --region ${AWS_REGION} 2>/dev/null || echo "Memory alarm already exists"
    
    echo "✅ Memory utilization alarm created"
fi

# Application error rate alarm (custom metric)
aws cloudwatch put-metric-alarm \
    --alarm-name "finsage-high-error-rate" \
    --alarm-description "High error rate in FinSage application" \
    --metric-name ErrorCount \
    --namespace FinSage/Application \
    --statistic Sum \
    --period 300 \
    --threshold 10 \
    --comparison-operator GreaterThanThreshold \
    --evaluation-periods 1 \
    --alarm-actions ${SNS_TOPIC_ARN} \
    --region ${AWS_REGION} 2>/dev/null || echo "Error rate alarm already exists"

echo "✅ Error rate alarm created"

# Create CloudWatch dashboard
echo "📊 Creating CloudWatch dashboard..."
cat > /tmp/dashboard.json << EOF
{
    "widgets": [
        {
            "type": "metric",
            "x": 0,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/EC2", "CPUUtilization", "InstanceId", "${INSTANCE_ID}" ],
                    [ ".", "NetworkIn", ".", "." ],
                    [ ".", "NetworkOut", ".", "." ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "${AWS_REGION}",
                "title": "EC2 Metrics",
                "period": 300
            }
        },
        {
            "type": "metric",
            "x": 12,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "FinSage/Application", "RequestCount" ],
                    [ ".", "ErrorCount" ],
                    [ ".", "ResponseTime" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "${AWS_REGION}",
                "title": "Application Metrics",
                "period": 300
            }
        },
        {
            "type": "log",
            "x": 0,
            "y": 6,
            "width": 24,
            "height": 6,
            "properties": {
                "query": "SOURCE '${LOG_GROUP_NAME}' | fields @timestamp, @message | sort @timestamp desc | limit 100",
                "region": "${AWS_REGION}",
                "title": "Application Logs",
                "view": "table"
            }
        }
    ]
}
EOF

aws cloudwatch put-dashboard \
    --dashboard-name "FinSage-Monitoring" \
    --dashboard-body file:///tmp/dashboard.json \
    --region ${AWS_REGION}

echo "✅ CloudWatch dashboard created"

# Create IAM role for CloudWatch agent (if needed)
echo "🔐 Setting up IAM role for CloudWatch agent..."
ROLE_NAME="FinSage-CloudWatch-Role"
POLICY_NAME="FinSage-CloudWatch-Policy"

# Create IAM role
if ! aws iam get-role --role-name ${ROLE_NAME} >/dev/null 2>&1; then
    # Create trust policy
    cat > /tmp/trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

    aws iam create-role \
        --role-name ${ROLE_NAME} \
        --assume-role-policy-document file:///tmp/trust-policy.json

    # Attach CloudWatch agent policy
    aws iam attach-role-policy \
        --role-name ${ROLE_NAME} \
        --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy

    echo "✅ IAM role created for CloudWatch agent"
else
    echo "✅ IAM role already exists"
fi

# Create instance profile
if ! aws iam get-instance-profile --instance-profile-name ${ROLE_NAME} >/dev/null 2>&1; then
    aws iam create-instance-profile --instance-profile-name ${ROLE_NAME}
    aws iam add-role-to-instance-profile \
        --instance-profile-name ${ROLE_NAME} \
        --role-name ${ROLE_NAME}
    
    echo "✅ Instance profile created"
else
    echo "✅ Instance profile already exists"
fi

echo "✅ Monitoring setup complete!"
echo ""
echo "📋 Monitoring Details:"
echo "  Log Group: ${LOG_GROUP_NAME}"
echo "  SNS Topic: ${SNS_TOPIC_ARN}"
echo "  Dashboard: FinSage-Monitoring"
echo "  IAM Role: ${ROLE_NAME}"
echo ""
echo "🔗 CloudWatch Dashboard:"
echo "  https://${AWS_REGION}.console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=FinSage-Monitoring"
echo ""
echo "📋 Next steps:"
echo "1. Subscribe to SNS topic for email alerts"
echo "2. Install CloudWatch agent on EC2 instance"
echo "3. Configure custom metrics in your application"
echo "4. Set up log shipping from application to CloudWatch"
echo ""

# Save monitoring details
cat > /Users/ak/Documents/TechProjects/Finsage/aws-config/monitoring-setup.txt << EOF
Monitoring Setup Details
========================

Log Group: ${LOG_GROUP_NAME}
SNS Topic: ${SNS_TOPIC_ARN}
Dashboard: FinSage-Monitoring
IAM Role: ${ROLE_NAME}

Alarms Created:
- finsage-high-cpu (CPU > 80%)
- finsage-high-memory (Memory > 80%)
- finsage-high-error-rate (Errors > 10)

Dashboard URL:
https://${AWS_REGION}.console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=FinSage-Monitoring

Next steps:
1. Subscribe to SNS topic
2. Install CloudWatch agent
3. Configure custom metrics
4. Set up log shipping
EOF

echo "💾 Monitoring details saved to: aws-config/monitoring-setup.txt"

# Clean up
rm -f /tmp/dashboard.json /tmp/trust-policy.json

