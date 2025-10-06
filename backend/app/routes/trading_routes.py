"""
Advanced Trading Routes
Provides paper trading, order management, and technical analysis features
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, List, Any, Optional
from app.services.trading_service import TradingService
from app.core.logger import app_logger

router = APIRouter(prefix="/trading", tags=["Advanced Trading"])

@router.post("/orders")
async def create_order(
    user_id: str,
    symbol: str,
    side: str,
    quantity: int,
    order_type: str = "market",
    limit_price: float = None,
    stop_price: float = None,
    trading_service: TradingService = Depends()
):
    """
    Create a new trading order.
    
    Example: POST /trading/orders?user_id=123&symbol=AAPL&side=buy&quantity=100&order_type=market
    """
    app_logger.info(f"Creating {side} order for {quantity} shares of {symbol}")
    try:
        order = await trading_service.create_order(
            user_id=user_id,
            symbol=symbol,
            side=side,
            quantity=quantity,
            order_type=order_type,
            limit_price=limit_price,
            stop_price=stop_price
        )
        return {"message": "Order created successfully", "order": order}
    except Exception as e:
        app_logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create order")

@router.get("/orders/{user_id}")
async def get_orders(
    user_id: str,
    status: str = Query(None, description="Filter by order status"),
    trading_service: TradingService = Depends()
):
    """
    Get user's orders.
    
    Example: GET /trading/orders/123?status=filled
    """
    app_logger.info(f"Fetching orders for user {user_id}")
    try:
        orders = await trading_service.get_orders(user_id, status)
        return {"message": "Orders retrieved successfully", "orders": orders}
    except Exception as e:
        app_logger.error(f"Error fetching orders: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve orders")

@router.delete("/orders/{order_id}")
async def cancel_order(
    order_id: str,
    trading_service: TradingService = Depends()
):
    """
    Cancel an order.
    
    Example: DELETE /trading/orders/order_20241206_143022_AAPL
    """
    app_logger.info(f"Cancelling order {order_id}")
    try:
        result = await trading_service.cancel_order(order_id)
        return result
    except Exception as e:
        app_logger.error(f"Error cancelling order: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to cancel order")

@router.get("/positions/{user_id}")
async def get_positions(
    user_id: str,
    trading_service: TradingService = Depends()
):
    """
    Get user's current positions.
    
    Example: GET /trading/positions/123
    """
    app_logger.info(f"Fetching positions for user {user_id}")
    try:
        positions = await trading_service.get_positions(user_id)
        return {"message": "Positions retrieved successfully", "positions": positions}
    except Exception as e:
        app_logger.error(f"Error fetching positions: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve positions")

@router.get("/portfolio/{user_id}")
async def get_portfolio_summary(
    user_id: str,
    trading_service: TradingService = Depends()
):
    """
    Get portfolio summary.
    
    Example: GET /trading/portfolio/123
    """
    app_logger.info(f"Fetching portfolio summary for user {user_id}")
    try:
        portfolio = await trading_service.get_portfolio_summary(user_id)
        return {"message": "Portfolio summary retrieved", "portfolio": portfolio}
    except Exception as e:
        app_logger.error(f"Error fetching portfolio summary: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve portfolio summary")

@router.get("/analysis/{symbol}")
async def get_technical_analysis(
    symbol: str,
    timeframe: str = Query("1d", description="Timeframe: 1d, 4h, 1h"),
    trading_service: TradingService = Depends()
):
    """
    Get comprehensive technical analysis.
    
    Example: GET /trading/analysis/AAPL?timeframe=1d
    """
    app_logger.info(f"Performing technical analysis for {symbol}")
    try:
        analysis = await trading_service.get_technical_analysis(symbol, timeframe)
        return {"message": f"Technical analysis for {symbol}", "analysis": analysis}
    except Exception as e:
        app_logger.error(f"Error performing technical analysis: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to perform technical analysis")

@router.get("/options/{symbol}")
async def get_options_strategies(
    symbol: str,
    current_price: float = Query(..., description="Current price of the underlying asset"),
    trading_service: TradingService = Depends()
):
    """
    Get options trading strategies.
    
    Example: GET /trading/options/AAPL?current_price=175.50
    """
    app_logger.info(f"Generating options strategies for {symbol}")
    try:
        strategies = await trading_service.get_options_strategies(symbol, current_price)
        return {"message": f"Options strategies for {symbol}", "strategies": strategies}
    except Exception as e:
        app_logger.error(f"Error generating options strategies: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate options strategies")

@router.get("/screener")
async def get_stock_screener(
    sector: str = Query(None, description="Filter by sector"),
    market_cap_min: float = Query(None, description="Minimum market cap"),
    market_cap_max: float = Query(None, description="Maximum market cap"),
    pe_min: float = Query(None, description="Minimum P/E ratio"),
    pe_max: float = Query(None, description="Maximum P/E ratio"),
    trading_service: TradingService = Depends()
):
    """
    Get stock screener results.
    
    Example: GET /trading/screener?sector=Technology&market_cap_min=1000000000&pe_max=20
    """
    app_logger.info("Running stock screener")
    try:
        # Mock screener results
        screener_results = {
            "filters": {
                "sector": sector,
                "market_cap_min": market_cap_min,
                "market_cap_max": market_cap_max,
                "pe_min": pe_min,
                "pe_max": pe_max
            },
            "results": [
                {
                    "symbol": "AAPL",
                    "name": "Apple Inc.",
                    "sector": "Technology",
                    "market_cap": 2800000000000,
                    "pe_ratio": 25.5,
                    "price": 175.50,
                    "change_percent": 2.3
                },
                {
                    "symbol": "MSFT",
                    "name": "Microsoft Corporation",
                    "sector": "Technology",
                    "market_cap": 2600000000000,
                    "pe_ratio": 28.2,
                    "price": 350.25,
                    "change_percent": 1.8
                }
            ],
            "total_count": 2
        }
        return {"message": "Stock screener results", "screener": screener_results}
    except Exception as e:
        app_logger.error(f"Error running stock screener: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to run stock screener")

@router.get("/watchlist/{user_id}")
async def get_watchlist(
    user_id: str,
    trading_service: TradingService = Depends()
):
    """
    Get user's watchlist.
    
    Example: GET /trading/watchlist/123
    """
    app_logger.info(f"Fetching watchlist for user {user_id}")
    try:
        # Mock watchlist data
        watchlist = {
            "user_id": user_id,
            "symbols": ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"],
            "alerts": [
                {
                    "symbol": "AAPL",
                    "type": "price_above",
                    "value": 180.0,
                    "active": True
                },
                {
                    "symbol": "TSLA",
                    "type": "price_below",
                    "value": 200.0,
                    "active": True
                }
            ],
            "created_at": "2024-01-01T00:00:00Z"
        }
        return {"message": "Watchlist retrieved", "watchlist": watchlist}
    except Exception as e:
        app_logger.error(f"Error fetching watchlist: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve watchlist")
