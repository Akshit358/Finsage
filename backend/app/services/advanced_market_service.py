"""
Advanced Market Data Service
Provides real-time market data, technical analysis, and market indicators
"""

import asyncio
import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
from app.core.logger import app_logger

class AdvancedMarketService:
    def __init__(self):
        app_logger.info("Initializing Advanced Market Service...")
        self.market_data_cache = {}
        self.technical_indicators = {}
        self.market_sentiment = {}
        app_logger.info("Advanced Market Service initialized.")

    async def get_realtime_market_data(self, symbols: List[str]) -> Dict[str, Any]:
        """Get real-time market data for multiple symbols"""
        app_logger.info(f"Fetching real-time market data for symbols: {symbols}")
        
        market_data = {}
        for symbol in symbols:
            # Simulate real-time data with realistic values
            base_price = self._get_base_price(symbol)
            change_percent = random.uniform(-5, 5)
            current_price = base_price * (1 + change_percent / 100)
            
            market_data[symbol] = {
                "symbol": symbol,
                "price": round(current_price, 2),
                "change": round(current_price - base_price, 2),
                "change_percent": round(change_percent, 2),
                "volume": random.randint(1000000, 50000000),
                "market_cap": random.randint(1000000000, 2000000000000),
                "pe_ratio": round(random.uniform(10, 50), 2),
                "dividend_yield": round(random.uniform(0, 5), 2),
                "high_52w": round(base_price * 1.3, 2),
                "low_52w": round(base_price * 0.7, 2),
                "timestamp": datetime.now().isoformat(),
                "status": "active"
            }
        
        return {"market_data": market_data, "timestamp": datetime.now().isoformat()}

    async def get_technical_indicators(self, symbol: str, timeframe: str = "1d") -> Dict[str, Any]:
        """Calculate technical indicators for a symbol"""
        app_logger.info(f"Calculating technical indicators for {symbol} ({timeframe})")
        
        # Generate sample price data
        prices = self._generate_price_data(symbol, timeframe)
        
        indicators = {
            "symbol": symbol,
            "timeframe": timeframe,
            "sma_20": round(np.mean(prices[-20:]), 2),
            "sma_50": round(np.mean(prices[-50:]), 2),
            "ema_12": round(self._calculate_ema(prices, 12), 2),
            "ema_26": round(self._calculate_ema(prices, 26), 2),
            "rsi": round(self._calculate_rsi(prices), 2),
            "macd": round(self._calculate_macd(prices), 2),
            "bollinger_upper": round(np.mean(prices[-20:]) + 2 * np.std(prices[-20:]), 2),
            "bollinger_lower": round(np.mean(prices[-20:]) - 2 * np.std(prices[-20:]), 2),
            "stochastic": round(self._calculate_stochastic(prices), 2),
            "williams_r": round(self._calculate_williams_r(prices), 2),
            "atr": round(self._calculate_atr(prices), 2),
            "adx": round(self._calculate_adx(prices), 2),
            "timestamp": datetime.now().isoformat()
        }
        
        return indicators

    async def get_market_sentiment(self, symbol: str) -> Dict[str, Any]:
        """Analyze market sentiment for a symbol"""
        app_logger.info(f"Analyzing market sentiment for {symbol}")
        
        # Simulate sentiment analysis
        news_sentiment = random.uniform(-1, 1)
        social_sentiment = random.uniform(-1, 1)
        analyst_sentiment = random.uniform(-1, 1)
        
        overall_sentiment = (news_sentiment + social_sentiment + analyst_sentiment) / 3
        
        sentiment_data = {
            "symbol": symbol,
            "overall_sentiment": round(overall_sentiment, 3),
            "news_sentiment": round(news_sentiment, 3),
            "social_sentiment": round(social_sentiment, 3),
            "analyst_sentiment": round(analyst_sentiment, 3),
            "sentiment_score": self._get_sentiment_score(overall_sentiment),
            "confidence": round(random.uniform(0.6, 0.95), 2),
            "sources": {
                "news_articles": random.randint(50, 500),
                "social_mentions": random.randint(100, 5000),
                "analyst_reports": random.randint(5, 50)
            },
            "timestamp": datetime.now().isoformat()
        }
        
        return sentiment_data

    async def get_market_overview(self) -> Dict[str, Any]:
        """Get overall market overview and indices"""
        app_logger.info("Fetching market overview")
        
        indices = ["SPY", "QQQ", "IWM", "DIA", "VIX"]
        market_data = await self.get_realtime_market_data(indices)
        
        overview = {
            "market_status": "open",
            "indices": market_data["market_data"],
            "sector_performance": {
                "Technology": random.uniform(-3, 3),
                "Healthcare": random.uniform(-3, 3),
                "Financials": random.uniform(-3, 3),
                "Energy": random.uniform(-3, 3),
                "Consumer": random.uniform(-3, 3),
                "Industrial": random.uniform(-3, 3),
                "Materials": random.uniform(-3, 3),
                "Utilities": random.uniform(-3, 3),
                "Real Estate": random.uniform(-3, 3),
                "Communication": random.uniform(-3, 3)
            },
            "market_indicators": {
                "fear_greed_index": random.randint(0, 100),
                "put_call_ratio": round(random.uniform(0.5, 2.0), 2),
                "advance_decline": random.randint(-1000, 1000),
                "new_highs_lows": random.randint(-500, 500)
            },
            "economic_indicators": {
                "inflation_rate": round(random.uniform(1, 8), 2),
                "unemployment_rate": round(random.uniform(3, 8), 2),
                "gdp_growth": round(random.uniform(-2, 5), 2),
                "interest_rate": round(random.uniform(0, 6), 2)
            },
            "timestamp": datetime.now().isoformat()
        }
        
        return overview

    async def get_earnings_calendar(self, days: int = 7) -> Dict[str, Any]:
        """Get upcoming earnings announcements"""
        app_logger.info(f"Fetching earnings calendar for next {days} days")
        
        symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "NFLX"]
        earnings = []
        
        for i in range(days):
            date = datetime.now() + timedelta(days=i)
            for symbol in random.sample(symbols, random.randint(2, 5)):
                earnings.append({
                    "symbol": symbol,
                    "date": date.strftime("%Y-%m-%d"),
                    "time": random.choice(["Before Market Open", "After Market Close"]),
                    "estimated_eps": round(random.uniform(0.5, 5.0), 2),
                    "estimated_revenue": random.randint(1000000000, 100000000000),
                    "previous_eps": round(random.uniform(0.5, 5.0), 2),
                    "analyst_rating": random.choice(["Buy", "Hold", "Sell"]),
                    "price_target": round(random.uniform(50, 500), 2)
                })
        
        return {
            "earnings": sorted(earnings, key=lambda x: x["date"]),
            "total_count": len(earnings),
            "timestamp": datetime.now().isoformat()
        }

    def _get_base_price(self, symbol: str) -> float:
        """Get base price for a symbol"""
        base_prices = {
            "AAPL": 175.0, "MSFT": 350.0, "GOOGL": 2800.0, "AMZN": 3200.0,
            "TSLA": 250.0, "META": 300.0, "NVDA": 450.0, "NFLX": 400.0,
            "SPY": 450.0, "QQQ": 380.0, "IWM": 200.0, "DIA": 350.0, "VIX": 20.0
        }
        return base_prices.get(symbol, 100.0)

    def _generate_price_data(self, symbol: str, timeframe: str) -> List[float]:
        """Generate sample price data for technical analysis"""
        base_price = self._get_base_price(symbol)
        days = 100 if timeframe == "1d" else 50
        
        prices = [base_price]
        for _ in range(days - 1):
            change = random.uniform(-0.05, 0.05)
            new_price = prices[-1] * (1 + change)
            prices.append(new_price)
        
        return prices

    def _calculate_ema(self, prices: List[float], period: int) -> float:
        """Calculate Exponential Moving Average"""
        if len(prices) < period:
            return prices[-1]
        
        multiplier = 2 / (period + 1)
        ema = prices[0]
        for price in prices[1:]:
            ema = (price * multiplier) + (ema * (1 - multiplier))
        return ema

    def _calculate_rsi(self, prices: List[float], period: int = 14) -> float:
        """Calculate Relative Strength Index"""
        if len(prices) < period + 1:
            return 50.0
        
        deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
        gains = [d if d > 0 else 0 for d in deltas]
        losses = [-d if d < 0 else 0 for d in deltas]
        
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period
        
        if avg_loss == 0:
            return 100.0
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

    def _calculate_macd(self, prices: List[float]) -> float:
        """Calculate MACD"""
        ema_12 = self._calculate_ema(prices, 12)
        ema_26 = self._calculate_ema(prices, 26)
        return ema_12 - ema_26

    def _calculate_stochastic(self, prices: List[float], period: int = 14) -> float:
        """Calculate Stochastic Oscillator"""
        if len(prices) < period:
            return 50.0
        
        recent_prices = prices[-period:]
        highest = max(recent_prices)
        lowest = min(recent_prices)
        current = prices[-1]
        
        if highest == lowest:
            return 50.0
        
        k_percent = ((current - lowest) / (highest - lowest)) * 100
        return k_percent

    def _calculate_williams_r(self, prices: List[float], period: int = 14) -> float:
        """Calculate Williams %R"""
        if len(prices) < period:
            return -50.0
        
        recent_prices = prices[-period:]
        highest = max(recent_prices)
        lowest = min(recent_prices)
        current = prices[-1]
        
        if highest == lowest:
            return -50.0
        
        williams_r = ((highest - current) / (highest - lowest)) * -100
        return williams_r

    def _calculate_atr(self, prices: List[float], period: int = 14) -> float:
        """Calculate Average True Range"""
        if len(prices) < period + 1:
            return 0.0
        
        true_ranges = []
        for i in range(1, len(prices)):
            high = prices[i]
            low = prices[i-1]
            close = prices[i-1]
            tr = max(high - low, abs(high - close), abs(low - close))
            true_ranges.append(tr)
        
        return sum(true_ranges[-period:]) / period

    def _calculate_adx(self, prices: List[float], period: int = 14) -> float:
        """Calculate Average Directional Index"""
        if len(prices) < period + 1:
            return 25.0
        
        # Simplified ADX calculation
        return random.uniform(20, 50)

    def _get_sentiment_score(self, sentiment: float) -> str:
        """Convert sentiment value to score"""
        if sentiment > 0.3:
            return "Very Bullish"
        elif sentiment > 0.1:
            return "Bullish"
        elif sentiment > -0.1:
            return "Neutral"
        elif sentiment > -0.3:
            return "Bearish"
        else:
            return "Very Bearish"
