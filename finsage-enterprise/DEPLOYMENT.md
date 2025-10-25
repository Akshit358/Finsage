# FinSage Enterprise - Deployment Guide

This guide covers multiple deployment options for the FinSage Enterprise frontend application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- AWS CLI configured (for AWS deployment)
- Docker installed (for containerized deployment)

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 🌐 Deployment Options

### 1. AWS S3 + CloudFront (Recommended)

#### Automated Deployment
```bash
# Make script executable
chmod +x deploy-aws.sh

# Deploy to AWS
./deploy-aws.sh
```

#### Manual Deployment
```bash
# Build the application
npm run build

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Configure for static hosting
aws s3 website s3://your-bucket-name --index-document index.html

# Upload files
aws s3 sync dist/ s3://your-bucket-name --delete

# Create CloudFront distribution (use AWS Console)
```

#### Environment Variables
Create `.env` file:
```env
VITE_API_BASE_URL=https://your-backend-api.com
VITE_APP_NAME=FinSage Enterprise
VITE_APP_VERSION=1.0.0
```

### 2. Vercel (Easiest)

#### Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

#### Deploy with Git Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

#### Environment Variables in Vercel
- `VITE_API_BASE_URL`: Your backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Version number

### 3. Netlify

#### Deploy with Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Deploy with Git Integration
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables

### 4. Docker Deployment

#### Build and Run
```bash
# Build Docker image
docker build -t finsage-enterprise .

# Run container
docker run -p 3000:80 finsage-enterprise
```

#### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Traditional Web Server

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/finsage-enterprise;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache Configuration
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/finsage-enterprise
    
    # Handle client-side routing
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
    
    # Cache static assets
    <LocationMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` | Yes |
| `VITE_APP_NAME` | Application name | `FinSage Enterprise` | No |
| `VITE_APP_VERSION` | Version number | `1.0.0` | No |

### Build Configuration

#### Vite Configuration
The application uses Vite for building. Key configurations:

- **Base URL**: Set in `vite.config.ts` if needed
- **Build Output**: `dist/` directory
- **Asset Handling**: Automatic optimization
- **Code Splitting**: Enabled by default

#### TypeScript Configuration
- **Strict Mode**: Enabled
- **Target**: ES2020
- **Module**: ESNext
- **JSX**: React

## 🚀 Production Optimizations

### Build Optimizations
```bash
# Production build with optimizations
npm run build

# Analyze bundle size
npm run build -- --analyze
```

### Performance Features
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and CSS optimization
- **Gzip Compression**: Enabled in nginx config
- **Caching**: Aggressive caching for static assets

### Security Headers
The nginx configuration includes:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- CORS headers for API calls

## 📊 Monitoring and Analytics

### Health Checks
- **Endpoint**: `/health`
- **Response**: `200 OK` with "healthy"
- **Use Case**: Load balancer health checks

### Error Tracking
Consider integrating:
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and error tracking
- **Google Analytics**: User behavior analytics

### Performance Monitoring
- **Web Vitals**: Core Web Vitals tracking
- **Bundle Analysis**: Regular bundle size monitoring
- **API Performance**: Backend response time monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to AWS S3
        run: ./deploy-aws.sh
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### GitLab CI Example
```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - ./deploy-aws.sh
  only:
    - main
```

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

#### Runtime Errors
- Check browser console for errors
- Verify API endpoints are accessible
- Check CORS configuration
- Verify environment variables

#### Performance Issues
- Enable gzip compression
- Optimize images
- Check bundle size
- Monitor API response times

### Debug Mode
```bash
# Enable debug logging
VITE_DEBUG=true npm run dev

# Build with source maps
npm run build -- --sourcemap
```

## 📚 Additional Resources

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

### Support
- GitHub Issues: Report bugs and feature requests
- Documentation: Check the README.md
- Community: Join our Discord server

---

**Need Help?** Contact our support team at support@finsage.com
