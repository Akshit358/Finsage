"""
Environment configuration loader using Pydantic.
Handles all environment variables and application settings.
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application settings
    app_name: str = Field(default="FinSage", env="APP_NAME")
    debug: bool = Field(default=False, env="DEBUG")
    version: str = Field(default="1.0.0", env="VERSION")
    
    # API settings
    api_v1_prefix: str = "/api/v1"
    cors_origins: list = Field(default=["http://localhost:3000"], env="CORS_ORIGINS")
    
    # ML Model settings
    ml_model_path: str = Field(default="./models/fin_predictor.pkl", env="ML_MODEL_PATH")
    
    # Blockchain settings
    blockchain_rpc_url: str = Field(default="", env="BLOCKCHAIN_RPC_URL")
    private_key: str = Field(default="", env="PRIVATE_KEY")
    contract_address: str = Field(default="", env="CONTRACT_ADDRESS")
    
    # Database settings (for future use)
    database_url: str = Field(default="", env="DATABASE_URL")
    
    # Security settings
    secret_key: str = Field(default="your-secret-key-change-in-production", env="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # External API settings
    alpaca_api_key: str = Field(default="", env="ALPACA_API_KEY")
    alpaca_secret_key: str = Field(default="", env="ALPACA_SECRET_KEY")
    
    # Redis settings
    redis_url: str = Field(default="", env="REDIS_URL")
    
    # Logging settings
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_file: str = Field(default="logs/finsage.log", env="LOG_FILE")
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get application settings."""
    return settings
