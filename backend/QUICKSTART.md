# FinSage Backend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment
```bash
# Copy the environment template
cp env_template.txt .env

# Edit .env with your configuration (optional for basic testing)
# The application will work with default values
```

### 3. Create Directories
```bash
mkdir -p logs models contracts
```

### 4. Start the Application
```bash
# Option 1: Using the startup script
python3 start.py

# Option 2: Using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Option 3: Using Make (if available)
make run
```

### 5. Test the Application
```bash
# Run the test suite
python3 test_app.py

# Or test individual endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/status/health
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build the image
docker build -t finsage-backend .

# Run the container
docker run -p 8000:8000 finsage-backend

# Or use Docker Compose
docker-compose up -d
```

## 🧪 Testing

### Run Tests
```bash
# Run the test suite
python3 test_app.py

# Run specific tests (when pytest is set up)
pytest tests/
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Get prediction
curl -X POST "http://localhost:8000/api/v1/prediction/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 30,
    "annual_income": 75000,
    "risk_tolerance": "medium",
    "investment_horizon_years": 10
  }'

# Get portfolio
curl http://localhost:8000/api/v1/portfolio/user123

# Blockchain status
curl http://localhost:8000/api/v1/blockchain/status
```

## 🔧 Configuration

### Environment Variables
The application uses these key environment variables:

- `APP_NAME`: Application name (default: FinSage)
- `DEBUG`: Debug mode (default: True)
- `ML_MODEL_PATH`: Path to ML model file
- `BLOCKCHAIN_RPC_URL`: Blockchain RPC URL (optional)
- `CORS_ORIGINS`: Allowed CORS origins

### Default Configuration
The application works out of the box with default settings. No blockchain connection is required for basic functionality.

## 📁 Project Structure

```
backend/
├── app/
│   ├── core/           # Configuration and logging
│   ├── models/         # Pydantic schemas
│   ├── services/       # AI and blockchain services
│   ├── routes/         # API endpoints
│   └── utils/          # Utility functions
├── logs/               # Application logs
├── models/             # ML model files
├── contracts/          # Smart contract ABIs
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose setup
└── requirements.txt    # Python dependencies
```

## 🚨 Troubleshooting

### Common Issues

1. **ModuleNotFoundError**: Install dependencies with `pip install -r requirements.txt`
2. **Port already in use**: Change the port in the startup command
3. **Permission denied**: Make sure you have write permissions for logs directory
4. **Blockchain connection failed**: This is expected if no RPC URL is configured

### Logs
Check the logs directory for detailed error information:
```bash
tail -f logs/finsage.log
tail -f logs/error.log
```

## 🎯 Next Steps

1. **Configure Blockchain**: Add your Infura/Alchemy RPC URL to `.env`
2. **Add Authentication**: Implement JWT-based authentication
3. **Database Integration**: Connect to PostgreSQL or MongoDB
4. **Frontend Integration**: Connect with the React frontend
5. **Production Deployment**: Deploy to cloud platform

## 📞 Support

For issues and questions:
1. Check the logs in the `logs/` directory
2. Review the API documentation at `/docs`
3. Run the test suite to verify functionality
4. Check the GitHub issues page

---

**Happy coding with FinSage! 🚀**
