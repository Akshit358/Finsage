"""
Market data routes - Updated to use services while maintaining backward compatibility
"""
from fastapi import APIRouter, Query, Depends
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from database import get_db
from services.market_service import MarketService
from models.market_model import HistoricalDataResponse, RealtimeDataResponse, StockQuote, CryptoQuote

router = APIRouter()

# Keep backward compatibility with existing endpoints
def generate_market_data(days=30):
    """Generate realistic market data for charts (fallback)"""
    base_price = 100
    data = []
    current_price = base_price
    
    for i in range(days):
        change = random.uniform(-2, 2)
        current_price += change
        current_price = max(50, min(200, current_price))
        
        date = datetime.now() - timedelta(days=days-i-1)
        data.append({
            "date": date.strftime("%Y-%m-%d"),
            "price": round(current_price, 2),
            "volume": random.randint(1000000, 5000000),
            "high": round(current_price * 1.02, 2),
            "low": round(current_price * 0.98, 2),
            "open": round(current_price * (1 + random.uniform(-0.01, 0.01)), 2),
            "close": round(current_price, 2)
        })
    
    return data

@router.get("/")
def get_market_data():
    return {"message": "Market data endpoint", "status": "active"}

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "market"}

@router.get("/historical")
def get_historical_data(
    days: int = Query(30, ge=1, le=365),
    symbol: str = Query("FINSAGE", description="Stock or crypto symbol"),
    asset_type: str = Query("stock", description="Asset type: stock or crypto")
):
    """Get historical market data for charts"""
    try:
        data_points = MarketService.get_historical_data(symbol, days, asset_type)
        
        if data_points:
            data = [point.dict() for point in data_points]
            return {
                "symbol": symbol.upper(),
                "data": data,
                "summary": {
                    "current": data[-1]["price"] if data else 0,
                    "previous": data[-2]["price"] if len(data) > 1 else 0,
                    "high": max([d["high"] for d in data]) if data else 0,
                    "low": min([d["low"] for d in data]) if data else 0
                }
            }
    except Exception as e:
        print(f"Error fetching historical data: {e}")
    
    # Fallback to simulated data
    data = generate_market_data(days)
    return {
        "symbol": symbol.upper(),
        "data": data,
        "summary": {
            "current": data[-1]["price"] if data else 0,
            "previous": data[-2]["price"] if len(data) > 1 else 0,
            "high": max([d["high"] for d in data]) if data else 0,
            "low": min([d["low"] for d in data]) if data else 0
        }
    }

@router.get("/realtime")
def get_realtime_data(
    symbol: str = Query("FINSAGE", description="Stock or crypto symbol"),
    asset_type: str = Query("stock", description="Asset type: stock or crypto")
):
    """Get real-time market data"""
    try:
        realtime_data = MarketService.get_realtime_data(symbol, asset_type)
        if realtime_data:
            return realtime_data.dict()
    except Exception as e:
        print(f"Error fetching real-time data: {e}")
    
    # Fallback to simulated data
    base_price = 100 + random.uniform(-10, 10)
    return {
        "timestamp": datetime.now().isoformat(),
        "price": round(base_price, 2),
        "change": round(random.uniform(-1, 1), 2),
        "changePercent": round(random.uniform(-1, 1), 2),
        "volume": random.randint(500000, 2000000),
        "symbol": symbol.upper()
    }

@router.get("/quote/{symbol}")
def get_stock_quote(symbol: str, asset_type: str = Query("stock", description="Asset type: stock or crypto")):
    """Get current quote for a symbol"""
    if asset_type == "crypto":
        quote = MarketService.get_crypto_quote(symbol)
        if quote:
            return quote.dict()
    else:
        quote = MarketService.get_stock_quote(symbol)
        if quote:
            return quote.dict()
    
    return {"error": "Quote not available"}

@router.get("/portfolio")
def get_portfolio_data():
    """Get portfolio performance data (backward compatibility - returns sample data)"""
    portfolio_data = []
    symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"]
    
    for symbol in symbols:
        quote = MarketService.get_stock_quote(symbol)
        if quote:
            shares = random.randint(10, 100)
            portfolio_data.append({
                "symbol": symbol,
                "price": quote.price,
                "change": quote.change,
                "changePercent": quote.changePercent,
                "shares": shares,
                "value": round(quote.price * shares, 2)
            })
        else:
            # Fallback
            base = random.uniform(50, 200)
            shares = random.randint(10, 100)
            portfolio_data.append({
                "symbol": symbol,
                "price": round(base, 2),
                "change": round(random.uniform(-5, 5), 2),
                "changePercent": round(random.uniform(-3, 3), 2),
                "shares": shares,
                "value": round(base * shares, 2)
            })
    
    total_value = sum([p["value"] for p in portfolio_data])
    
    return {
        "portfolio": portfolio_data,
        "totalValue": round(total_value, 2),
        "totalChange": round(sum([p["change"] * p["shares"] for p in portfolio_data]), 2),
        "totalChangePercent": round((sum([p["changePercent"] for p in portfolio_data]) / len(portfolio_data)), 2)
    }