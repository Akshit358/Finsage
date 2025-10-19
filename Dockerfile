# Multi-stage Docker build for FinSage
FROM node:18-alpine AS frontend-builder

# Build frontend
WORKDIR /app/frontend
COPY frontend/finsage-ui/package*.json ./
RUN npm ci --only=production
COPY frontend/finsage-ui/ ./
RUN npm run build

# Backend stage
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend files
COPY simple_backend.py .
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./static

# Expose port
EXPOSE 8000

# Start command
CMD ["python3", "simple_backend.py"]
