# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import market, auth, portfolio
from config import settings
from database import init_db

# Initialize database
init_db()

app = FastAPI(
    title="FinSage API",
    description="AI-Powered Blockchain-Based Financial Intelligence System",
    version="1.0.0"
)

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(market.router, prefix="/market", tags=["market"])
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(portfolio.router, tags=["portfolio"])

@app.get("/")
def home():
    return {
        "message": "FinSage API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
