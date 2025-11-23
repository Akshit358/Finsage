"""
FinSage FastAPI Application
Financial Intelligence Platform powered by AI and Blockchain
"""

import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.core.logger import app_logger
from app.routes.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    """
    # Startup
    app_logger.info("Starting FinSage application...")
    app_logger.info(f"Application: {settings.app_name}")
    app_logger.info(f"Version: {settings.version}")
    app_logger.info(f"Debug mode: {settings.debug}")
    
    # Create logs directory if it doesn't exist
    os.makedirs("logs", exist_ok=True)
    
    # Create models directory if it doesn't exist
    os.makedirs("models", exist_ok=True)
    
    # Create contracts directory if it doesn't exist
    os.makedirs("contracts", exist_ok=True)
    
    app_logger.info("Application startup completed")
    
    yield
    
    # Shutdown
    app_logger.info("Shutting down FinSage application...")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="""
    ## FinSage - Financial Intelligence Platform
    
    A production-ready, scalable backend system powered by AI and blockchain technologies.
    
    ### Features
    
    * **AI-Powered Predictions**: Get personalized investment recommendations using machine learning
    * **Portfolio Management**: Track and manage your investment portfolio
    * **Blockchain Integration**: Interact with smart contracts and check token balances
    * **Health Monitoring**: Comprehensive health checks and service monitoring
    
    ### API Endpoints
    
    * `/status` - Application health and status monitoring
    * `/prediction` - AI-powered investment predictions
    * `/portfolio` - Portfolio management operations
    * `/blockchain` - Blockchain and Web3 interactions
    
    ### Authentication
    
    Authentication endpoints are planned for future implementation.
    """,
    version=settings.version,
    debug=settings.debug,
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware for security
if not settings.debug:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "*.yourdomain.com"]
    )


# Global exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with proper logging."""
    app_logger.error(f"HTTP {exc.status_code}: {exc.detail} - {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Error",
            "message": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url)
        }
    )


@app.exception_handler(StarletteHTTPException)
async def starlette_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle Starlette HTTP exceptions."""
    app_logger.error(f"Starlette HTTP {exc.status_code}: {exc.detail} - {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Error",
            "message": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url)
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors."""
    app_logger.error(f"Validation error: {exc.errors()} - {request.url}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "message": "Request validation failed",
            "details": exc.errors(),
            "path": str(request.url)
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions."""
    app_logger.error(f"Unhandled exception: {str(exc)} - {request.url}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "path": str(request.url)
        }
    )


# Include API routes
app.include_router(api_router, prefix=settings.api_v1_prefix)


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint providing basic API information.
    
    Returns:
        Basic API information and available endpoints
    """
    return {
        "message": f"Welcome to {settings.app_name} API",
        "version": settings.version,
        "status": "running",
        "docs_url": "/docs" if settings.debug else "Documentation not available in production",
        "api_prefix": settings.api_v1_prefix,
        "endpoints": {
            "health": f"{settings.api_v1_prefix}/status/health",
            "predictions": f"{settings.api_v1_prefix}/prediction/predict",
            "portfolio": f"{settings.api_v1_prefix}/portfolio/{{user_id}}",
            "blockchain": f"{settings.api_v1_prefix}/blockchain/status"
        }
    }


# Health check endpoint (for load balancers)
@app.get("/health", tags=["Health"])
async def health():
    """
    Simple health check endpoint for load balancers and monitoring.
    
    Returns:
        Simple health status
    """
    return {"status": "healthy", "service": settings.app_name}


# Startup event
@app.on_event("startup")
async def startup_event():
    """Application startup event."""
    app_logger.info("FinSage application started successfully")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event."""
    app_logger.info("FinSage application shutdown completed")


if __name__ == "__main__":
    import uvicorn
    
    # Run the application
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )
