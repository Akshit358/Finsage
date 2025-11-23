"""
Pydantic models for market data validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class MarketDataPoint(BaseModel):
    """Single data point for market data"""
    date: str
    price: float
    volume: int
    high: float
    low: float
    open: float
    close: float

class HistoricalDataResponse(BaseModel):
    """Response model for historical market data"""
    symbol: str
    data: List[MarketDataPoint]
    summary: dict

class RealtimeDataResponse(BaseModel):
    """Response model for real-time market data"""
    timestamp: str
    price: float
    change: float
    changePercent: float
    volume: int
    symbol: Optional[str] = None

class StockQuote(BaseModel):
    """Stock quote information"""
    symbol: str
    price: float
    change: float
    changePercent: float
    volume: int
    high: Optional[float] = None
    low: Optional[float] = None
    open: Optional[float] = None
    previousClose: Optional[float] = None

class CryptoQuote(BaseModel):
    """Crypto quote information"""
    symbol: str
    usd_price: float
    change_24h: Optional[float] = None
    change_percent_24h: Optional[float] = None
    market_cap: Optional[float] = None
    volume_24h: Optional[float] = None
