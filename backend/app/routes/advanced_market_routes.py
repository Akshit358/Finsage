"""
Advanced Market Data Routes
Provides real-time market data, technical analysis, and market indicators
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, List, Any, Optional
from app.services.advanced_market_service import AdvancedMarketService
from app.core.logger import app_logger

router = APIRouter(prefix="/market", tags=["Advanced Market Data"])

@router.get("/realtime")
async def get_realtime_market_data(
    symbols: str = Query(..., description="Comma-separated list of symbols"),
    market_service: AdvancedMarketService = Depends()
):
    """
    Get real-time market data for multiple symbols.
    
    Example: /market/realtime?symbols=AAPL,MSFT,GOOGL
    """
    app_logger.info(f"Request for real-time market data for symbols: {symbols}")
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]
        data = await market_service.get_realtime_market_data(symbol_list)
        return {"message": "Real-time market data retrieved", "data": data}
    except Exception as e:
        app_logger.error(f"Error fetching real-time market data: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve market data")

@router.get("/technical/{symbol}")
async def get_technical_indicators(
    symbol: str,
    timeframe: str = Query("1d", description="Timeframe: 1d, 4h, 1h"),
    market_service: AdvancedMarketService = Depends()
):
    """
    Get technical indicators for a symbol.
    
    Example: /market/technical/AAPL?timeframe=1d
    """
    app_logger.info(f"Request for technical indicators for {symbol} ({timeframe})")
    try:
        indicators = await market_service.get_technical_indicators(symbol, timeframe)
        return {"message": f"Technical indicators for {symbol}", "indicators": indicators}
    except Exception as e:
        app_logger.error(f"Error calculating technical indicators for {symbol}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to calculate technical indicators")

@router.get("/sentiment/{symbol}")
async def get_market_sentiment(
    symbol: str,
    market_service: AdvancedMarketService = Depends()
):
    """
    Get market sentiment analysis for a symbol.
    
    Example: /market/sentiment/AAPL
    """
    app_logger.info(f"Request for market sentiment for {symbol}")
    try:
        sentiment = await market_service.get_market_sentiment(symbol)
        return {"message": f"Market sentiment for {symbol}", "sentiment": sentiment}
    except Exception as e:
        app_logger.error(f"Error analyzing market sentiment for {symbol}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to analyze market sentiment")

@router.get("/overview")
async def get_market_overview(
    market_service: AdvancedMarketService = Depends()
):
    """
    Get overall market overview and indices.
    
    Example: /market/overview
    """
    app_logger.info("Request for market overview")
    try:
        overview = await market_service.get_market_overview()
        return {"message": "Market overview retrieved", "overview": overview}
    except Exception as e:
        app_logger.error(f"Error fetching market overview: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve market overview")

@router.get("/earnings")
async def get_earnings_calendar(
    days: int = Query(7, description="Number of days to look ahead"),
    market_service: AdvancedMarketService = Depends()
):
    """
    Get upcoming earnings announcements.
    
    Example: /market/earnings?days=7
    """
    app_logger.info(f"Request for earnings calendar for next {days} days")
    try:
        earnings = await market_service.get_earnings_calendar(days)
        return {"message": "Earnings calendar retrieved", "earnings": earnings}
    except Exception as e:
        app_logger.error(f"Error fetching earnings calendar: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve earnings calendar")

@router.get("/sectors")
async def get_sector_performance(
    market_service: AdvancedMarketService = Depends()
):
    """
    Get sector performance data.
    
    Example: /market/sectors
    """
    app_logger.info("Request for sector performance")
    try:
        overview = await market_service.get_market_overview()
        sectors = overview.get("sector_performance", {})
        return {"message": "Sector performance retrieved", "sectors": sectors}
    except Exception as e:
        app_logger.error(f"Error fetching sector performance: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve sector performance")

@router.get("/crypto")
async def get_crypto_data(
    symbols: str = Query("BTC,ETH,ADA", description="Comma-separated list of crypto symbols"),
    market_service: AdvancedMarketService = Depends()
):
    """
    Get cryptocurrency market data.
    
    Example: /market/crypto?symbols=BTC,ETH,ADA
    """
    app_logger.info(f"Request for crypto data for symbols: {symbols}")
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]
        data = await market_service.get_realtime_market_data(symbol_list)
        return {"message": "Cryptocurrency data retrieved", "crypto_data": data}
    except Exception as e:
        app_logger.error(f"Error fetching crypto data: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve cryptocurrency data")

@router.get("/forex")
async def get_forex_data(
    pairs: str = Query("EURUSD,GBPUSD,USDJPY", description="Comma-separated list of forex pairs"),
    market_service: AdvancedMarketService = Depends()
):
    """
    Get forex market data.
    
    Example: /market/forex?pairs=EURUSD,GBPUSD,USDJPY
    """
    app_logger.info(f"Request for forex data for pairs: {pairs}")
    try:
        pair_list = [p.strip().upper() for p in pairs.split(",")]
        data = await market_service.get_realtime_market_data(pair_list)
        return {"message": "Forex data retrieved", "forex_data": data}
    except Exception as e:
        app_logger.error(f"Error fetching forex data: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve forex data")
