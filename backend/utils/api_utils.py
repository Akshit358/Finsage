"""
API utility functions for external API calls
"""
import requests
from typing import Optional, Dict, Any
from config import settings
import time
from functools import lru_cache

class APIError(Exception):
    """Custom exception for API errors"""
    pass

def get_alpha_vantage_data(function: str, symbol: str, **kwargs) -> Optional[Dict[str, Any]]:
    """
    Get data from Alpha Vantage API
    
    Args:
        function: API function (e.g., 'TIME_SERIES_DAILY', 'GLOBAL_QUOTE')
        symbol: Stock symbol
        **kwargs: Additional parameters
    
    Returns:
        API response data or None
    """
    if not settings.ALPHA_VANTAGE_API_KEY:
        return None
    
    url = "https://www.alphavantage.co/query"
    params = {
        "function": function,
        "symbol": symbol,
        "apikey": settings.ALPHA_VANTAGE_API_KEY,
        **kwargs
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Check for API errors
        if "Error Message" in data or "Note" in data:
            return None
        
        return data
    except (requests.RequestException, ValueError) as e:
        print(f"Alpha Vantage API error: {e}")
        return None

def get_crypto_price_alphavantage(symbol: str) -> Optional[Dict[str, Any]]:
    """
    Get crypto price from Alpha Vantage
    
    Args:
        symbol: Crypto symbol (e.g., 'BTC', 'ETH')
    
    Returns:
        Price data or None
    """
    if not settings.ALPHA_VANTAGE_API_KEY:
        return None
    
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "CURRENCY_EXCHANGE_RATE",
        "from_currency": symbol.upper(),
        "to_currency": "USD",
        "apikey": settings.ALPHA_VANTAGE_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if "Realtime Currency Exchange Rate" in data:
            return data["Realtime Currency Exchange Rate"]
        return None
    except (requests.RequestException, ValueError) as e:
        print(f"Crypto API error: {e}")
        return None

def get_coingecko_price(symbol: str) -> Optional[Dict[str, Any]]:
    """
    Get crypto price from CoinGecko (free, no API key required)
    
    Args:
        symbol: Crypto symbol (e.g., 'bitcoin', 'ethereum')
    
    Returns:
        Price data or None
    """
    # Map common symbols to CoinGecko IDs
    symbol_map = {
        "BTC": "bitcoin",
        "ETH": "ethereum",
        "BNB": "binancecoin",
        "SOL": "solana",
        "ADA": "cardano",
        "XRP": "ripple",
        "DOT": "polkadot",
        "DOGE": "dogecoin",
        "MATIC": "matic-network",
        "AVAX": "avalanche-2"
    }
    
    coin_id = symbol_map.get(symbol.upper(), symbol.lower())
    
    url = f"https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": coin_id,
        "vs_currencies": "usd",
        "include_24hr_change": "true",
        "include_market_cap": "true",
        "include_24hr_vol": "true"
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if coin_id in data:
            return {
                "symbol": symbol.upper(),
                "usd_price": data[coin_id]["usd"],
                "change_24h": data[coin_id].get("usd_24h_change", 0),
                "market_cap": data[coin_id].get("usd_market_cap", 0),
                "volume_24h": data[coin_id].get("usd_24h_vol", 0)
            }
        return None
    except (requests.RequestException, ValueError) as e:
        print(f"CoinGecko API error: {e}")
        return None

def get_yahoo_finance_quote(symbol: str) -> Optional[Dict[str, Any]]:
    """
    Get stock quote using Yahoo Finance (free, no API key)
    Note: This is a simple implementation. For production, consider yfinance library
    
    Args:
        symbol: Stock symbol
    
    Returns:
        Quote data or None
    """
    # Using a free API endpoint (alternative to yfinance)
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if "chart" in data and "result" in data["chart"]:
            result = data["chart"]["result"][0]
            meta = result.get("meta", {})
            indicators = result.get("indicators", {})
            quote = indicators.get("quote", [{}])[0]
            
            current_price = meta.get("regularMarketPrice", 0)
            previous_close = meta.get("previousClose", 0)
            change = current_price - previous_close
            change_percent = (change / previous_close * 100) if previous_close else 0
            
            return {
                "symbol": symbol.upper(),
                "price": current_price,
                "change": change,
                "changePercent": change_percent,
                "volume": meta.get("regularMarketVolume", 0),
                "high": meta.get("regularMarketDayHigh", 0),
                "low": meta.get("regularMarketDayLow", 0),
                "open": meta.get("regularMarketOpen", 0),
                "previousClose": previous_close
            }
        return None
    except (requests.RequestException, ValueError) as e:
        print(f"Yahoo Finance API error: {e}")
        return None
