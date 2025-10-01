"""
Pydantic models for request/response schemas.
Defines data validation and serialization for API endpoints.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class RiskTolerance(str, Enum):
    """Risk tolerance levels for investment recommendations."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class InvestmentHorizon(str, Enum):
    """Investment horizon categories."""
    SHORT_TERM = "short_term"  # < 1 year
    MEDIUM_TERM = "medium_term"  # 1-5 years
    LONG_TERM = "long_term"  # > 5 years


# Prediction Models
class PredictionRequest(BaseModel):
    """Request model for investment prediction."""
    age: int = Field(..., ge=18, le=100, description="User age")
    annual_income: float = Field(..., gt=0, description="Annual income in USD")
    risk_tolerance: RiskTolerance = Field(..., description="Risk tolerance level")
    investment_horizon_years: int = Field(..., ge=1, le=50, description="Investment horizon in years")
    current_portfolio_value: Optional[float] = Field(None, ge=0, description="Current portfolio value")
    monthly_investment: Optional[float] = Field(None, ge=0, description="Monthly investment amount")
    
    @validator('investment_horizon_years')
    def validate_investment_horizon(cls, v):
        if v < 1:
            raise ValueError('Investment horizon must be at least 1 year')
        return v


class AssetAllocation(BaseModel):
    """Asset allocation recommendation."""
    asset_class: str = Field(..., description="Asset class name")
    percentage: float = Field(..., ge=0, le=100, description="Allocation percentage")
    expected_return: float = Field(..., description="Expected annual return")
    risk_level: str = Field(..., description="Risk level of this asset")


class PredictionResponse(BaseModel):
    """Response model for investment prediction."""
    recommendation_score: float = Field(..., ge=0, le=100, description="Overall recommendation score")
    asset_allocations: List[AssetAllocation] = Field(..., description="Recommended asset allocations")
    total_expected_return: float = Field(..., description="Total expected annual return")
    risk_assessment: str = Field(..., description="Overall risk assessment")
    confidence_level: float = Field(..., ge=0, le=100, description="Model confidence level")
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Portfolio Models
class Asset(BaseModel):
    """Individual asset in a portfolio."""
    symbol: str = Field(..., description="Asset symbol")
    name: str = Field(..., description="Asset name")
    quantity: float = Field(..., ge=0, description="Quantity held")
    current_price: float = Field(..., ge=0, description="Current price per unit")
    total_value: float = Field(..., ge=0, description="Total value of this asset")
    asset_type: str = Field(..., description="Type of asset (stock, bond, crypto, etc.)")


class Portfolio(BaseModel):
    """User portfolio model."""
    user_id: str = Field(..., description="User identifier")
    total_value: float = Field(..., ge=0, description="Total portfolio value")
    assets: List[Asset] = Field(..., description="List of assets in portfolio")
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    performance_metrics: Optional[Dict[str, Any]] = Field(None, description="Performance metrics")


class PortfolioUpdateRequest(BaseModel):
    """Request model for portfolio updates."""
    assets: List[Asset] = Field(..., description="Updated list of assets")
    notes: Optional[str] = Field(None, description="Optional notes about the update")


# Blockchain Models
class BlockchainStatus(BaseModel):
    """Blockchain connection status."""
    is_connected: bool = Field(..., description="Whether blockchain is connected")
    network_id: Optional[int] = Field(None, description="Network ID")
    latest_block: Optional[int] = Field(None, description="Latest block number")
    gas_price: Optional[float] = Field(None, description="Current gas price in Gwei")
    connection_time: Optional[float] = Field(None, description="Connection response time in ms")


class TokenBalance(BaseModel):
    """Token balance information."""
    token_address: str = Field(..., description="Token contract address")
    token_symbol: str = Field(..., description="Token symbol")
    balance: float = Field(..., ge=0, description="Token balance")
    balance_usd: Optional[float] = Field(None, ge=0, description="Balance in USD")


class SmartContractCall(BaseModel):
    """Smart contract function call."""
    contract_address: str = Field(..., description="Contract address")
    function_name: str = Field(..., description="Function to call")
    parameters: List[Any] = Field(default=[], description="Function parameters")
    gas_limit: Optional[int] = Field(None, description="Gas limit for the call")


# Status Models
class HealthStatus(BaseModel):
    """Application health status."""
    status: str = Field(..., description="Overall health status")
    version: str = Field(..., description="Application version")
    uptime: float = Field(..., description="Application uptime in seconds")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    services: Dict[str, str] = Field(..., description="Status of individual services")


class ServiceStatus(BaseModel):
    """Individual service status."""
    name: str = Field(..., description="Service name")
    status: str = Field(..., description="Service status")
    response_time: Optional[float] = Field(None, description="Response time in ms")
    last_check: datetime = Field(default_factory=datetime.utcnow)
    error_message: Optional[str] = Field(None, description="Error message if any")


# Error Models
class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# Authentication Models (for future implementation)
class UserRegistration(BaseModel):
    """User registration request."""
    email: str = Field(..., description="User email")
    password: str = Field(..., min_length=8, description="User password")
    full_name: str = Field(..., description="User full name")


class UserLogin(BaseModel):
    """User login request."""
    email: str = Field(..., description="User email")
    password: str = Field(..., description="User password")


class TokenResponse(BaseModel):
    """Authentication token response."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")
