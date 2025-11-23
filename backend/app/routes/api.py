"""
Main API router that combines all route modules.
Centralizes all API endpoints under a single router.
"""

from fastapi import APIRouter
from app.routes import status, prediction, portfolio, blockchain, advanced_features, advanced_market_routes, trading_routes, social_routes

# Create main API router
api_router = APIRouter()

# Include all route modules
api_router.include_router(status.router)
api_router.include_router(prediction.router)
api_router.include_router(portfolio.router)
api_router.include_router(blockchain.router)
api_router.include_router(advanced_features.router)
api_router.include_router(advanced_market_routes.router)
api_router.include_router(trading_routes.router)
api_router.include_router(social_routes.router)
