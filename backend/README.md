# FinSage Backend

A production-ready, scalable backend system for the FinSage financial intelligence platform powered by AI and blockchain technologies.

## 🚀 Features

- **AI-Powered Predictions**: Machine learning-based investment recommendations
- **Portfolio Management**: Complete portfolio tracking and management
- **Blockchain Integration**: Web3 and smart contract interactions
- **Health Monitoring**: Comprehensive service monitoring and health checks
- **RESTful API**: Clean, well-documented API endpoints
- **Docker Support**: Containerized deployment ready
- **CI/CD Pipeline**: Automated testing and deployment

## 🏗️ Architecture

```
backend/
├── app/
│   ├── core/           # Configuration and logging
│   ├── models/         # Pydantic schemas
│   ├── services/       # Business logic services
│   ├── routes/         # API route handlers
│   ├── db/            # Database models (future)
│   └── utils/         # Utility functions
├── logs/              # Application logs
├── models/            # ML model files
├── contracts/         # Smart contract ABIs
└── tests/            # Test files
```

## 🛠️ Installation

### Prerequisites

- Python 3.10+
- pip
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finsage/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Create necessary directories**
   ```bash
   mkdir -p logs models contracts
   ```

6. **Run the application**
   ```bash
   python -m app.main
   # or
   uvicorn app.main:app --reload
   ```

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t finsage-backend .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | FinSage |
| `DEBUG` | Debug mode | True |
| `VERSION` | Application version | 1.0.0 |
| `ML_MODEL_PATH` | Path to ML model | ./models/fin_predictor.pkl |
| `BLOCKCHAIN_RPC_URL` | Blockchain RPC URL | - |
| `PRIVATE_KEY` | Private key for blockchain | - |
| `CONTRACT_ADDRESS` | Smart contract address | - |

### API Endpoints

#### Status & Health
- `GET /api/v1/status/health` - Application health check
- `GET /api/v1/status/ping` - Simple ping endpoint
- `GET /api/v1/status/services` - Service status details

#### Predictions
- `POST /api/v1/prediction/predict` - Get investment prediction
- `GET /api/v1/prediction/model-info` - AI model information
- `GET /api/v1/prediction/risk-profiles` - Available risk profiles

#### Portfolio Management
- `GET /api/v1/portfolio/{user_id}` - Get user portfolio
- `POST /api/v1/portfolio/{user_id}` - Update portfolio
- `GET /api/v1/portfolio/{user_id}/performance` - Portfolio performance

#### Blockchain
- `GET /api/v1/blockchain/status` - Blockchain connection status
- `GET /api/v1/blockchain/balance/{wallet_address}` - Get wallet balance
- `POST /api/v1/blockchain/contract/call` - Call smart contract

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_prediction.py
```

## 🚀 Deployment

### Production Deployment

1. **Set production environment variables**
2. **Build Docker image**
   ```bash
   docker build -t finsage-backend:latest .
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## 📊 Monitoring

The application includes comprehensive monitoring:

- **Health Checks**: `/health` endpoint for load balancers
- **Metrics**: System and application metrics
- **Logging**: Structured logging with Loguru
- **Service Status**: Individual service health monitoring

## 🔒 Security

- CORS configuration
- Input validation with Pydantic
- Error handling and logging
- Environment-based configuration
- Docker security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the logs in the `logs/` directory

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Real-time WebSocket connections
- [ ] Advanced ML model training pipeline
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Redis caching
- [ ] Rate limiting
- [ ] API versioning
- [ ] GraphQL support
- [ ] Microservices architecture
