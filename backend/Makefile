# FinSage Backend Makefile
# Common commands for development and deployment

.PHONY: help install test run docker-build docker-run clean lint format

# Default target
help:
	@echo "FinSage Backend - Available Commands:"
	@echo "======================================"
	@echo "  install     - Install dependencies"
	@echo "  test        - Run tests"
	@echo "  run         - Start the application"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run  - Run with Docker Compose"
	@echo "  clean       - Clean up temporary files"
	@echo "  lint        - Run linting checks"
	@echo "  format      - Format code with black and isort"
	@echo "  setup       - Initial setup (install + create dirs)"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	pip install -r requirements.txt
	@echo "✅ Dependencies installed"

# Run tests
test:
	@echo "🧪 Running tests..."
	python test_app.py
	@echo "✅ Tests completed"

# Start the application
run:
	@echo "🚀 Starting FinSage Backend..."
	python start.py

# Build Docker image
docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t finsage-backend .
	@echo "✅ Docker image built"

# Run with Docker Compose
docker-run:
	@echo "🐳 Starting with Docker Compose..."
	docker-compose up -d
	@echo "✅ Services started"

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf htmlcov
	@echo "✅ Cleanup completed"

# Run linting
lint:
	@echo "🔍 Running linting checks..."
	flake8 app/ --count --select=E9,F63,F7,F82 --show-source --statistics
	black --check app/
	isort --check-only app/
	mypy app/ --ignore-missing-imports
	@echo "✅ Linting completed"

# Format code
format:
	@echo "🎨 Formatting code..."
	black app/
	isort app/
	@echo "✅ Code formatted"

# Initial setup
setup: install
	@echo "🔧 Setting up FinSage Backend..."
	mkdir -p logs models contracts
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file from template..."; \
		cp env_template.txt .env; \
		echo "⚠️  Please edit .env file with your configuration"; \
	fi
	@echo "✅ Setup completed"

# Development mode with auto-reload
dev:
	@echo "🔄 Starting in development mode..."
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
prod:
	@echo "🚀 Starting in production mode..."
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Stop Docker services
docker-stop:
	@echo "🛑 Stopping Docker services..."
	docker-compose down
	@echo "✅ Services stopped"

# View logs
logs:
	@echo "📋 Viewing application logs..."
	tail -f logs/finsage.log

# Health check
health:
	@echo "🏥 Checking application health..."
	curl -f http://localhost:8000/health || echo "❌ Application not responding"
