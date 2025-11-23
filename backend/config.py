"""
Configuration management for FinSage backend
"""
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

class Settings:
    """Application settings loaded from environment variables"""
    
    # App Configuration
    APP_NAME: str = os.getenv("APP_NAME", "FinSage")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./finsage.db")
    
    # API Keys
    ALPHA_VANTAGE_API_KEY: Optional[str] = os.getenv("ALPHA_VANTAGE_API_KEY")
    COINGECKO_API_KEY: Optional[str] = os.getenv("COINGECKO_API_KEY")
    
    # CORS Configuration
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]
    
    # Market Data Configuration
    DEFAULT_HISTORICAL_DAYS: int = 30
    CACHE_TTL_SECONDS: int = 300  # 5 minutes
    
    @classmethod
    def get_database_url(cls) -> str:
        """Get database URL, handling SQLite path"""
        if cls.DATABASE_URL.startswith("sqlite"):
            return cls.DATABASE_URL
        return cls.DATABASE_URL

settings = Settings()
