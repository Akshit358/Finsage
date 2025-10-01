"""
Main API router that combines all route modules.
Centralizes all API endpoints under a single router.
"""

from fastapi import APIRouter
from app.routes import status, prediction, portfolio, blockchain

# Create main API router
api_router = APIRouter()

# Include all route modules
api_router.include_router(status.router)
api_router.include_router(prediction.router)
api_router.include_router(portfolio.router)
api_router.include_router(blockchain.router)
