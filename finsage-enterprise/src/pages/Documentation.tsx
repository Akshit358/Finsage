import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface DocumentationSection {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'getting-started' | 'api' | 'deployment' | 'security' | 'troubleshooting';
  lastUpdated: string;
  tags: string[];
}

const Documentation: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const documentation: DocumentationSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick start guide for FinSage Enterprise',
      content: `# Getting Started with FinSage Enterprise

## Overview
FinSage Enterprise is a comprehensive financial intelligence platform that provides real-time market data, AI-powered insights, portfolio management, and advanced trading tools.

## Features
- **Real-time Market Data**: Live stock prices, market indicators, and news
- **AI-Powered Analysis**: GPT-4 integration for market insights and predictions
- **Portfolio Management**: Advanced portfolio optimization and risk management
- **Trading Simulator**: Paper trading with $100,000 virtual capital
- **Risk Management**: Comprehensive risk analysis and stress testing
- **Options Trading**: Complete options chain with Greeks calculations
- **Backtesting Engine**: Strategy testing with historical data
- **Authentication**: Secure user management and profiles
- **Database Integration**: Supabase integration for data persistence
- **API Management**: Multiple market data provider integrations
- **Production Monitoring**: Real-time system monitoring
- **Security Dashboard**: Security alerts and compliance management

## Quick Start
1. **Access the Application**: Navigate to the main dashboard
2. **Authentication**: Use demo credentials (demo@finsage.com / demo123) or register
3. **Explore Features**: Click on any feature from the main navigation
4. **Real-time Data**: All features include live data updates
5. **AI Integration**: Use the AI Agent for market insights

## Demo Credentials
- **Email**: demo@finsage.com
- **Password**: demo123

## Support
For technical support or questions, please refer to the troubleshooting section.`,
      category: 'getting-started',
      lastUpdated: new Date().toISOString(),
      tags: ['overview', 'features', 'quick-start', 'demo']
    },
    {
      id: 'api-integration',
      title: 'API Integration Guide',
      description: 'How to integrate with external APIs',
      content: `# API Integration Guide

## Supported APIs
FinSage Enterprise supports integration with multiple market data providers:

### 1. Alpha Vantage
- **Purpose**: Real-time and historical stock data
- **Features**: Quotes, historical data, technical indicators, forex, crypto
- **Rate Limit**: 500 requests/day (free), 75 requests/minute
- **Setup**: Get API key from alphavantage.co

### 2. Finnhub
- **Purpose**: Real-time stock market data and news
- **Features**: Real-time quotes, news, company profiles, earnings
- **Rate Limit**: 60 requests/minute (free)
- **Setup**: Get API key from finnhub.io

### 3. Twelve Data
- **Purpose**: Comprehensive financial market data
- **Features**: Real-time quotes, historical data, technical indicators, forex, crypto, options
- **Rate Limit**: 800 requests/day (free)
- **Setup**: Get API key from twelvedata.com

### 4. NewsAPI
- **Purpose**: Financial news and sentiment analysis
- **Features**: Financial news, sentiment analysis, company news
- **Rate Limit**: 1000 requests/day (free)
- **Setup**: Get API key from newsapi.org

### 5. OpenAI
- **Purpose**: AI-powered financial analysis
- **Features**: AI analysis, sentiment analysis, market insights, predictions
- **Rate Limit**: 10,000 requests/month (free tier)
- **Setup**: Get API key from openai.com

## Configuration
1. Navigate to the API Integration Manager
2. Enter your API keys for each provider
3. Test connections to verify setup
4. Monitor usage and rate limits

## Best Practices
- Monitor rate limits to avoid exceeding quotas
- Implement proper error handling
- Use caching to reduce API calls
- Implement retry logic for failed requests
- Monitor API costs and usage`,
      category: 'api',
      lastUpdated: new Date().toISOString(),
      tags: ['api', 'integration', 'market-data', 'configuration']
    },
    {
      id: 'deployment',
      title: 'Deployment Guide',
      description: 'Production deployment instructions',
      content: `# Deployment Guide

## Prerequisites
- AWS Account with appropriate permissions
- Docker installed locally
- AWS CLI configured
- Domain name (optional)

## AWS Deployment

### 1. Infrastructure Setup
Run the provided deployment scripts:
\`\`\`bash
# Setup EC2 instance
./scripts/setup-ec2.sh

# Setup RDS database
./scripts/setup-rds.sh

# Setup Application Load Balancer
./scripts/setup-alb.sh

# Setup CloudFront CDN
./scripts/setup-cloudfront.sh
\`\`\`

### 2. Backend Deployment
\`\`\`bash
# Build and push Docker image
./scripts/deploy-backend.sh

# Deploy to EC2
./scripts/deploy-to-ec2.sh
\`\`\`

### 3. Frontend Deployment
\`\`\`bash
# Build React application
npm run build

# Deploy to S3
./scripts/deploy-frontend.sh
\`\`\`

### 4. Database Setup
1. Configure Supabase project
2. Run database migrations
3. Set up environment variables
4. Test database connections

## Environment Variables
Create \`.env\` files with the following variables:

### Backend (.env)
\`\`\`
DATABASE_URL=postgresql://user:password@host:port/database
OPENAI_API_KEY=your_openai_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
FINNHUB_API_KEY=your_finnhub_key
NEWS_API_KEY=your_news_api_key
JWT_SECRET=your_jwt_secret
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_BASE_URL=https://your-api-domain.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## Monitoring
- Set up CloudWatch monitoring
- Configure log aggregation
- Set up alerts for critical metrics
- Monitor performance and errors

## Security
- Configure SSL certificates
- Set up security groups
- Enable WAF protection
- Implement rate limiting`,
      category: 'deployment',
      lastUpdated: new Date().toISOString(),
      tags: ['deployment', 'aws', 'docker', 'production']
    },
    {
      id: 'security',
      title: 'Security Best Practices',
      description: 'Security guidelines and best practices',
      content: `# Security Best Practices

## Authentication & Authorization
- **Multi-Factor Authentication**: Enable MFA for all admin accounts
- **Strong Passwords**: Enforce strong password policies
- **Session Management**: Implement secure session handling
- **JWT Tokens**: Use secure JWT tokens with proper expiration
- **Role-Based Access**: Implement RBAC for different user types

## Data Protection
- **Encryption at Rest**: Encrypt all sensitive data in database
- **Encryption in Transit**: Use HTTPS/TLS for all communications
- **Data Masking**: Mask sensitive data in logs and responses
- **Backup Encryption**: Encrypt all database backups
- **Key Management**: Use AWS KMS for key management

## API Security
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **API Keys**: Secure API key storage and rotation
- **Input Validation**: Validate all input data
- **SQL Injection Prevention**: Use parameterized queries
- **CORS Configuration**: Properly configure CORS policies

## Infrastructure Security
- **Security Groups**: Configure restrictive security groups
- **VPC**: Use private subnets for backend services
- **WAF**: Enable Web Application Firewall
- **DDoS Protection**: Implement DDoS protection
- **Regular Updates**: Keep all dependencies updated

## Monitoring & Logging
- **Security Logs**: Monitor authentication and access logs
- **Intrusion Detection**: Set up intrusion detection systems
- **Alert System**: Configure alerts for security events
- **Audit Trails**: Maintain comprehensive audit trails
- **Compliance**: Ensure compliance with relevant regulations

## Incident Response
- **Response Plan**: Have a documented incident response plan
- **Communication**: Establish communication channels
- **Recovery Procedures**: Document recovery procedures
- **Testing**: Regularly test incident response procedures

## Compliance
- **GDPR**: Ensure GDPR compliance for EU users
- **SOC 2**: Maintain SOC 2 compliance
- **PCI DSS**: If handling payment data
- **Regular Audits**: Conduct regular security audits`,
      category: 'security',
      lastUpdated: new Date().toISOString(),
      tags: ['security', 'authentication', 'encryption', 'compliance']
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Guide',
      description: 'Common issues and solutions',
      content: `# Troubleshooting Guide

## Common Issues

### 1. Application Not Loading
**Symptoms**: White screen or loading errors
**Solutions**:
- Check browser console for JavaScript errors
- Verify all environment variables are set
- Check network connectivity
- Clear browser cache and cookies
- Try incognito/private browsing mode

### 2. API Connection Issues
**Symptoms**: "Failed to fetch" or API errors
**Solutions**:
- Verify API keys are correct and active
- Check rate limits haven't been exceeded
- Verify API endpoints are accessible
- Check CORS configuration
- Test API endpoints directly

### 3. Database Connection Problems
**Symptoms**: Database errors or connection timeouts
**Solutions**:
- Verify database credentials
- Check database server status
- Verify network connectivity to database
- Check connection pool settings
- Review database logs

### 4. Authentication Issues
**Symptoms**: Login failures or session errors
**Solutions**:
- Verify JWT secret is configured
- Check session timeout settings
- Clear browser storage
- Verify user credentials
- Check authentication service logs

### 5. Performance Issues
**Symptoms**: Slow loading or high response times
**Solutions**:
- Check server resource usage (CPU, memory)
- Optimize database queries
- Enable caching where appropriate
- Review API rate limits
- Check CDN configuration

### 6. Real-time Data Issues
**Symptoms**: Data not updating or stale data
**Solutions**:
- Check WebSocket connections
- Verify real-time service status
- Check network connectivity
- Review polling intervals
- Verify data source APIs

## Debugging Tools
- **Browser DevTools**: Use for frontend debugging
- **Network Tab**: Monitor API requests and responses
- **Console**: Check for JavaScript errors
- **Application Tab**: Inspect local storage and cookies
- **Performance Tab**: Analyze performance bottlenecks

## Log Analysis
- **Application Logs**: Check application logs for errors
- **Server Logs**: Review server logs for issues
- **Database Logs**: Check database query logs
- **API Logs**: Review API request/response logs
- **Error Tracking**: Use error tracking services

## Getting Help
1. Check this documentation first
2. Review error messages and logs
3. Search for similar issues online
4. Contact support with detailed error information
5. Provide steps to reproduce the issue

## Support Information
When contacting support, please provide:
- Error messages (exact text)
- Steps to reproduce the issue
- Browser and version
- Operating system
- Screenshots if applicable
- Log files if available`,
      category: 'troubleshooting',
      lastUpdated: new Date().toISOString(),
      tags: ['troubleshooting', 'debugging', 'issues', 'support']
    }
  ];

  const filteredDocs = documentation.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedDoc = documentation.find(doc => doc.id === selectedSection);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return '🚀';
      case 'api': return '🔌';
      case 'deployment': return '🚀';
      case 'security': return '🔒';
      case 'troubleshooting': return '🔧';
      default: return '📚';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        animation: 'pulse 10s ease-in-out infinite'
      }} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '0.5rem',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          📚 Documentation
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Comprehensive guides and documentation for FinSage Enterprise
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          height: 'fit-content'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
            📖 Sections
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.875rem',
                backdropFilter: 'blur(10px)',
                width: '100%'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedSection(doc.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  background: selectedSection === doc.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{ fontSize: '1rem' }}>{getCategoryIcon(doc.category)}</span>
                <div>
                  <div style={{ fontWeight: '600' }}>{doc.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {doc.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {selectedDoc ? (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                  {getCategoryIcon(selectedDoc.category)} {selectedDoc.title}
                </h2>
                <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1rem' }}>
                  {selectedDoc.description}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedDoc.tags.map((tag, index) => (
                    <span key={index} style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.75rem'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '1rem',
                padding: '2rem',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                overflow: 'auto',
                maxHeight: '600px'
              }}>
                {selectedDoc.content}
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                Last updated: {new Date(selectedDoc.lastUpdated).toLocaleString()}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select a documentation section</div>
              <div>Choose from the sidebar to view detailed guides and documentation</div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default Documentation;
