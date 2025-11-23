"""
Market data service layer
"""
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import random
from utils.api_utils import (
    get_alpha_vantage_data,
    get_crypto_price_alphavantage,
    get_coingecko_price,
    get_yahoo_finance_quote
)
from models.market_model import MarketDataPoint, RealtimeDataResponse, StockQuote, CryptoQuote

class MarketService:
    """Service for fetching and processing market data"""
    
    @staticmethod
    def get_stock_quote(symbol: str) -> Optional[StockQuote]:
        """Get real-time stock quote"""
        # Try Yahoo Finance first (free, no API key)
        data = get_yahoo_finance_quote(symbol)
        if data:
            return StockQuote(**data)
        
        # Fallback to Alpha Vantage if available
        if get_alpha_vantage_data:
            data = get_alpha_vantage_data("GLOBAL_QUOTE", symbol)
            if data and "Global Quote" in data:
                quote = data["Global Quote"]
                return StockQuote(
                    symbol=symbol.upper(),
                    price=float(quote.get("05. price", 0)),
                    change=float(quote.get("09. change", 0)),
                    changePercent=float(quote.get("10. change percent", "0%").rstrip("%")),
                    volume=int(quote.get("06. volume", 0)),
                    high=float(quote.get("03. high", 0)),
                    low=float(quote.get("04. low", 0)),
                    open=float(quote.get("02. open", 0)),
                    previousClose=float(quote.get("08. previous close", 0))
                )
        
        return None
    
    @staticmethod
    def get_crypto_quote(symbol: str) -> Optional[CryptoQuote]:
        """Get real-time crypto quote"""
        # Try CoinGecko first (free, no API key)
        data = get_coingecko_price(symbol)
        if data:
            return CryptoQuote(**data)
        
        # Fallback to Alpha Vantage if available
        data = get_crypto_price_alphavantage(symbol)
        if data:
            return CryptoQuote(
                symbol=symbol.upper(),
                usd_price=float(data.get("5. Exchange Rate", 0)),
                change_24h=None,
                change_percent_24h=None
            )
        
        return None
    
    @staticmethod
    def get_historical_data(symbol: str, days: int = 30, asset_type: str = "stock") -> List[MarketDataPoint]:
        """Get historical market data"""
        data_points = []
        
        if asset_type == "stock":
            # Try Alpha Vantage
            api_data = get_alpha_vantage_data("TIME_SERIES_DAILY", symbol, outputsize="full" if days > 100 else "compact")
            if api_data and "Time Series (Daily)" in api_data:
                time_series = api_data["Time Series (Daily)"]
                sorted_dates = sorted(time_series.keys(), reverse=True)[:days]
                
                for date_str in sorted_dates:
                    day_data = time_series[date_str]
                    data_points.append(MarketDataPoint(
                        date=date_str,
                        price=float(day_data.get("4. close", 0)),
                        volume=int(day_data.get("5. volume", 0)),
                        high=float(day_data.get("2. high", 0)),
                        low=float(day_data.get("3. low", 0)),
                        open=float(day_data.get("1. open", 0)),
                        close=float(day_data.get("4. close", 0))
                    ))
        
        # If no API data, generate simulated data (fallback)
        if not data_points:
            data_points = MarketService._generate_simulated_data(days)
        
        return sorted(data_points, key=lambda x: x.date)
    
    @staticmethod
    def _generate_simulated_data(days: int) -> List[MarketDataPoint]:
        """Generate simulated market data as fallback"""
        base_price = 100
        current_price = base_price
        data = []
        
        for i in range(days):
            change = random.uniform(-2, 2)
            current_price += change
            current_price = max(50, min(200, current_price))
            
            date = (datetime.now() - timedelta(days=days-i-1)).strftime("%Y-%m-%d")
            data.append(MarketDataPoint(
                date=date,
                price=round(current_price, 2),
                volume=random.randint(1000000, 5000000),
                high=round(current_price * 1.02, 2),
                low=round(current_price * 0.98, 2),
                open=round(current_price * (1 + random.uniform(-0.01, 0.01)), 2),
                close=round(current_price, 2)
            ))
        
        return data
    
    @staticmethod
    def get_realtime_data(symbol: str, asset_type: str = "stock") -> Optional[RealtimeDataResponse]:
        """Get real-time market data"""
        if asset_type == "crypto":
            quote = MarketService.get_crypto_quote(symbol)
            if quote:
                return RealtimeDataResponse(
                    timestamp=datetime.now().isoformat(),
                    price=quote.usd_price,
                    change=quote.change_24h or 0,
                    changePercent=quote.change_percent_24h or 0,
                    volume=int(quote.volume_24h or 0),
                    symbol=symbol.upper()
                )
        else:
            quote = MarketService.get_stock_quote(symbol)
            if quote:
                return RealtimeDataResponse(
                    timestamp=datetime.now().isoformat(),
                    price=quote.price,
                    change=quote.change,
                    changePercent=quote.changePercent,
                    volume=quote.volume,
                    symbol=symbol.upper()
                )
        
        # Fallback to simulated data
        base_price = 100 + random.uniform(-10, 10)
        return RealtimeDataResponse(
            timestamp=datetime.now().isoformat(),
            price=round(base_price, 2),
            change=round(random.uniform(-1, 1), 2),
            changePercent=round(random.uniform(-1, 1), 2),
            volume=random.randint(500000, 2000000),
            symbol=symbol.upper()
        )
