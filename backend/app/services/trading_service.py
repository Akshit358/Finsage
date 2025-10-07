"""
Advanced Trading Service
Provides paper trading, order management, and technical analysis features
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from enum import Enum
import pandas as pd
import numpy as np
from app.core.logger import app_logger

class OrderType(Enum):
    MARKET = "market"
    LIMIT = "limit"
    STOP = "stop"
    STOP_LIMIT = "stop_limit"

class OrderSide(Enum):
    BUY = "buy"
    SELL = "sell"

class OrderStatus(Enum):
    PENDING = "pending"
    FILLED = "filled"
    CANCELLED = "cancelled"
    REJECTED = "rejected"

class TradingService:
    def __init__(self):
        app_logger.info("Initializing Trading Service...")
        self.orders = {}
        self.positions = {}
        self.portfolio_value = 100000  # Starting with $100k paper trading
        self.cash_balance = 100000
        self.technical_indicators = {}
        app_logger.info("Trading Service initialized.")

    async def create_order(self, user_id: str, symbol: str, side: str, quantity: int, 
                          order_type: str = "market", limit_price: float = None, 
                          stop_price: float = None) -> Dict[str, Any]:
        """Create a new trading order"""
        app_logger.info(f"Creating {side} order for {quantity} shares of {symbol}")
        
        order_id = f"order_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{symbol}"
        
        # Get current market price
        current_price = await self._get_current_price(symbol)
        
        order = {
            "order_id": order_id,
            "user_id": user_id,
            "symbol": symbol,
            "side": side,
            "quantity": quantity,
            "order_type": order_type,
            "limit_price": limit_price,
            "stop_price": stop_price,
            "current_price": current_price,
            "status": OrderStatus.PENDING.value,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        # Process order based on type
        if order_type == "market":
            order = await self._process_market_order(order)
        elif order_type == "limit":
            order = await self._process_limit_order(order)
        elif order_type == "stop":
            order = await self._process_stop_order(order)
        
        self.orders[order_id] = order
        
        # Update positions if filled
        if order["status"] == OrderStatus.FILLED.value:
            await self._update_position(user_id, symbol, side, quantity, order["fill_price"])
        
        return order

    async def get_orders(self, user_id: str, status: str = None) -> Dict[str, Any]:
        """Get user's orders"""
        app_logger.info(f"Fetching orders for user {user_id}")
        
        user_orders = [order for order in self.orders.values() if order["user_id"] == user_id]
        
        if status:
            user_orders = [order for order in user_orders if order["status"] == status]
        
        return {
            "orders": user_orders,
            "total_count": len(user_orders),
            "timestamp": datetime.now().isoformat()
        }

    async def cancel_order(self, order_id: str) -> Dict[str, Any]:
        """Cancel an order"""
        app_logger.info(f"Cancelling order {order_id}")
        
        if order_id not in self.orders:
            return {"error": "Order not found"}
        
        order = self.orders[order_id]
        if order["status"] != OrderStatus.PENDING.value:
            return {"error": "Order cannot be cancelled"}
        
        order["status"] = OrderStatus.CANCELLED.value
        order["updated_at"] = datetime.now().isoformat()
        
        return {"message": "Order cancelled successfully", "order": order}

    async def get_positions(self, user_id: str) -> Dict[str, Any]:
        """Get user's current positions"""
        app_logger.info(f"Fetching positions for user {user_id}")
        
        user_positions = []
        for symbol, position in self.positions.items():
            if position["user_id"] == user_id:
                # Get current market price
                current_price = await self._get_current_price(symbol)
                market_value = position["quantity"] * current_price
                unrealized_pnl = market_value - position["cost_basis"]
                
                position_data = {
                    **position,
                    "current_price": current_price,
                    "market_value": round(market_value, 2),
                    "unrealized_pnl": round(unrealized_pnl, 2),
                    "unrealized_pnl_percent": round((unrealized_pnl / position["cost_basis"]) * 100, 2)
                }
                user_positions.append(position_data)
        
        return {
            "positions": user_positions,
            "total_count": len(user_positions),
            "timestamp": datetime.now().isoformat()
        }

    async def get_portfolio_summary(self, user_id: str) -> Dict[str, Any]:
        """Get portfolio summary"""
        app_logger.info(f"Fetching portfolio summary for user {user_id}")
        
        positions = await self.get_positions(user_id)
        total_market_value = sum(pos["market_value"] for pos in positions["positions"])
        total_unrealized_pnl = sum(pos["unrealized_pnl"] for pos in positions["positions"])
        
        # Calculate portfolio performance
        total_value = total_market_value + self.cash_balance
        portfolio_return = ((total_value - 100000) / 100000) * 100
        
        # Calculate sector allocation
        sector_allocation = await self._calculate_sector_allocation(positions["positions"])
        
        # Calculate risk metrics
        risk_metrics = await self._calculate_risk_metrics(positions["positions"])
        
        return {
            "user_id": user_id,
            "total_value": round(total_value, 2),
            "cash_balance": round(self.cash_balance, 2),
            "market_value": round(total_market_value, 2),
            "unrealized_pnl": round(total_unrealized_pnl, 2),
            "portfolio_return": round(portfolio_return, 2),
            "sector_allocation": sector_allocation,
            "risk_metrics": risk_metrics,
            "positions_count": len(positions["positions"]),
            "timestamp": datetime.now().isoformat()
        }

    async def get_technical_analysis(self, symbol: str, timeframe: str = "1d") -> Dict[str, Any]:
        """Get comprehensive technical analysis"""
        app_logger.info(f"Performing technical analysis for {symbol}")
        
        # Generate price data
        prices = await self._generate_price_data(symbol, timeframe)
        
        # Calculate technical indicators
        sma_20 = np.mean(prices[-20:])
        sma_50 = np.mean(prices[-50:])
        ema_12 = self._calculate_ema(prices, 12)
        ema_26 = self._calculate_ema(prices, 26)
        rsi = self._calculate_rsi(prices)
        macd = ema_12 - ema_26
        bollinger_upper = sma_20 + 2 * np.std(prices[-20:])
        bollinger_lower = sma_20 - 2 * np.std(prices[-20:])
        
        # Generate trading signals
        signals = self._generate_trading_signals(prices, {
            "sma_20": sma_20,
            "sma_50": sma_50,
            "rsi": rsi,
            "macd": macd,
            "bollinger_upper": bollinger_upper,
            "bollinger_lower": bollinger_lower
        })
        
        # Calculate support and resistance levels
        support_resistance = self._calculate_support_resistance(prices)
        
        return {
            "symbol": symbol,
            "timeframe": timeframe,
            "current_price": prices[-1],
            "indicators": {
                "sma_20": round(sma_20, 2),
                "sma_50": round(sma_50, 2),
                "ema_12": round(ema_12, 2),
                "ema_26": round(ema_26, 2),
                "rsi": round(rsi, 2),
                "macd": round(macd, 2),
                "bollinger_upper": round(bollinger_upper, 2),
                "bollinger_lower": round(bollinger_lower, 2)
            },
            "signals": signals,
            "support_resistance": support_resistance,
            "trend_analysis": self._analyze_trend(prices),
            "volatility": round(np.std(prices[-20:]), 2),
            "timestamp": datetime.now().isoformat()
        }

    async def get_options_strategies(self, symbol: str, current_price: float) -> Dict[str, Any]:
        """Get options trading strategies"""
        app_logger.info(f"Generating options strategies for {symbol}")
        
        strategies = []
        
        # Covered Call
        strike_price = current_price * 1.05
        strategies.append({
            "name": "Covered Call",
            "description": "Sell call option against owned stock",
            "max_profit": round((strike_price - current_price) * 100, 2),
            "max_loss": "Unlimited (if stock price falls)",
            "breakeven": round(current_price, 2),
            "risk_level": "Low",
            "setup": f"Buy 100 shares at ${current_price:.2f}, Sell 1 call at ${strike_price:.2f}"
        })
        
        # Protective Put
        put_strike = current_price * 0.95
        strategies.append({
            "name": "Protective Put",
            "description": "Buy put option to protect long position",
            "max_profit": "Unlimited (if stock price rises)",
            "max_loss": round((current_price - put_strike) * 100, 2),
            "breakeven": round(current_price, 2),
            "risk_level": "Low",
            "setup": f"Buy 100 shares at ${current_price:.2f}, Buy 1 put at ${put_strike:.2f}"
        })
        
        # Straddle
        strategies.append({
            "name": "Long Straddle",
            "description": "Buy call and put at same strike",
            "max_profit": "Unlimited (if stock moves significantly)",
            "max_loss": round(current_price * 0.1, 2),
            "breakeven": f"${current_price * 0.95:.2f} and ${current_price * 1.05:.2f}",
            "risk_level": "High",
            "setup": f"Buy 1 call and 1 put at ${current_price:.2f}"
        })
        
        return {
            "symbol": symbol,
            "current_price": current_price,
            "strategies": strategies,
            "timestamp": datetime.now().isoformat()
        }

    async def _get_current_price(self, symbol: str) -> float:
        """Get current market price for symbol"""
        # Simulate market price
        base_prices = {
            "AAPL": 175.0, "MSFT": 350.0, "GOOGL": 2800.0, "AMZN": 3200.0,
            "TSLA": 250.0, "META": 300.0, "NVDA": 450.0, "NFLX": 400.0
        }
        base_price = base_prices.get(symbol, 100.0)
        change = random.uniform(-0.02, 0.02)
        return round(base_price * (1 + change), 2)

    async def _process_market_order(self, order: Dict) -> Dict:
        """Process market order"""
        order["fill_price"] = order["current_price"]
        order["status"] = OrderStatus.FILLED.value
        order["filled_at"] = datetime.now().isoformat()
        return order

    async def _process_limit_order(self, order: Dict) -> Dict:
        """Process limit order"""
        if order["side"] == "buy" and order["current_price"] <= order["limit_price"]:
            order["fill_price"] = order["current_price"]
            order["status"] = OrderStatus.FILLED.value
            order["filled_at"] = datetime.now().isoformat()
        elif order["side"] == "sell" and order["current_price"] >= order["limit_price"]:
            order["fill_price"] = order["current_price"]
            order["status"] = OrderStatus.FILLED.value
            order["filled_at"] = datetime.now().isoformat()
        else:
            order["status"] = OrderStatus.PENDING.value
        return order

    async def _process_stop_order(self, order: Dict) -> Dict:
        """Process stop order"""
        if order["side"] == "buy" and order["current_price"] >= order["stop_price"]:
            order["fill_price"] = order["current_price"]
            order["status"] = OrderStatus.FILLED.value
            order["filled_at"] = datetime.now().isoformat()
        elif order["side"] == "sell" and order["current_price"] <= order["stop_price"]:
            order["fill_price"] = order["current_price"]
            order["status"] = OrderStatus.FILLED.value
            order["filled_at"] = datetime.now().isoformat()
        else:
            order["status"] = OrderStatus.PENDING.value
        return order

    async def _update_position(self, user_id: str, symbol: str, side: str, quantity: int, price: float):
        """Update user position"""
        position_key = f"{user_id}_{symbol}"
        
        if position_key not in self.positions:
            self.positions[position_key] = {
                "user_id": user_id,
                "symbol": symbol,
                "quantity": 0,
                "cost_basis": 0,
                "average_price": 0
            }
        
        position = self.positions[position_key]
        
        if side == "buy":
            total_cost = position["cost_basis"] + (quantity * price)
            total_quantity = position["quantity"] + quantity
            position["quantity"] = total_quantity
            position["cost_basis"] = total_cost
            position["average_price"] = total_cost / total_quantity
            self.cash_balance -= quantity * price
        else:  # sell
            position["quantity"] -= quantity
            position["cost_basis"] -= quantity * position["average_price"]
            self.cash_balance += quantity * price
            
            if position["quantity"] <= 0:
                del self.positions[position_key]

    async def _generate_price_data(self, symbol: str, timeframe: str) -> List[float]:
        """Generate price data for technical analysis"""
        base_price = await self._get_current_price(symbol)
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

    def _generate_trading_signals(self, prices: List[float], indicators: Dict) -> Dict[str, Any]:
        """Generate trading signals based on technical indicators"""
        current_price = prices[-1]
        signals = {
            "overall_signal": "HOLD",
            "strength": "NEUTRAL",
            "signals": []
        }
        
        # RSI signals
        if indicators["rsi"] > 70:
            signals["signals"].append({"indicator": "RSI", "signal": "SELL", "strength": "STRONG"})
        elif indicators["rsi"] < 30:
            signals["signals"].append({"indicator": "RSI", "signal": "BUY", "strength": "STRONG"})
        
        # Moving average signals
        if current_price > indicators["sma_20"] > indicators["sma_50"]:
            signals["signals"].append({"indicator": "MA", "signal": "BUY", "strength": "MEDIUM"})
        elif current_price < indicators["sma_20"] < indicators["sma_50"]:
            signals["signals"].append({"indicator": "MA", "signal": "SELL", "strength": "MEDIUM"})
        
        # Bollinger Bands signals
        if current_price > indicators["bollinger_upper"]:
            signals["signals"].append({"indicator": "BB", "signal": "SELL", "strength": "WEAK"})
        elif current_price < indicators["bollinger_lower"]:
            signals["signals"].append({"indicator": "BB", "signal": "BUY", "strength": "WEAK"})
        
        # Determine overall signal
        buy_signals = len([s for s in signals["signals"] if s["signal"] == "BUY"])
        sell_signals = len([s for s in signals["signals"] if s["signal"] == "SELL"])
        
        if buy_signals > sell_signals:
            signals["overall_signal"] = "BUY"
        elif sell_signals > buy_signals:
            signals["overall_signal"] = "SELL"
        
        return signals

    def _calculate_support_resistance(self, prices: List[float]) -> Dict[str, float]:
        """Calculate support and resistance levels"""
        recent_prices = prices[-20:]
        return {
            "resistance_1": round(max(recent_prices) * 1.02, 2),
            "resistance_2": round(max(recent_prices) * 1.05, 2),
            "support_1": round(min(recent_prices) * 0.98, 2),
            "support_2": round(min(recent_prices) * 0.95, 2)
        }

    def _analyze_trend(self, prices: List[float]) -> Dict[str, Any]:
        """Analyze price trend"""
        recent_prices = prices[-10:]
        trend_slope = (recent_prices[-1] - recent_prices[0]) / len(recent_prices)
        
        if trend_slope > 0.5:
            trend = "STRONG_UPTREND"
        elif trend_slope > 0:
            trend = "UPTREND"
        elif trend_slope < -0.5:
            trend = "STRONG_DOWNTREND"
        elif trend_slope < 0:
            trend = "DOWNTREND"
        else:
            trend = "SIDEWAYS"
        
        return {
            "trend": trend,
            "slope": round(trend_slope, 4),
            "strength": "STRONG" if abs(trend_slope) > 0.5 else "WEAK"
        }

    async def _calculate_sector_allocation(self, positions: List[Dict]) -> Dict[str, float]:
        """Calculate sector allocation"""
        # Mock sector mapping
        sector_mapping = {
            "AAPL": "Technology", "MSFT": "Technology", "GOOGL": "Technology",
            "AMZN": "Consumer", "TSLA": "Automotive", "META": "Technology",
            "NVDA": "Technology", "NFLX": "Communication"
        }
        
        sector_values = {}
        total_value = sum(pos["market_value"] for pos in positions)
        
        for position in positions:
            sector = sector_mapping.get(position["symbol"], "Other")
            if sector not in sector_values:
                sector_values[sector] = 0
            sector_values[sector] += position["market_value"]
        
        return {sector: round((value / total_value) * 100, 2) for sector, value in sector_values.items()}

    async def _calculate_risk_metrics(self, positions: List[Dict]) -> Dict[str, float]:
        """Calculate portfolio risk metrics"""
        if not positions:
            return {"beta": 0, "sharpe_ratio": 0, "max_drawdown": 0}
        
        # Mock risk calculations
        return {
            "beta": round(random.uniform(0.8, 1.5), 2),
            "sharpe_ratio": round(random.uniform(0.5, 2.0), 2),
            "max_drawdown": round(random.uniform(-20, -5), 2),
            "volatility": round(random.uniform(10, 30), 2)
        }

