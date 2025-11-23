"""
Portfolio management service
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from models.portfolio_model import Portfolio, PortfolioHolding, Transaction
from services.market_service import MarketService
from datetime import datetime

class PortfolioService:
    """Service for portfolio management operations"""
    
    @staticmethod
    def create_portfolio(db: Session, user_id: int, name: str = "My Portfolio", description: str = None) -> Portfolio:
        """Create a new portfolio"""
        portfolio = Portfolio(
            user_id=user_id,
            name=name,
            description=description
        )
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
        return portfolio
    
    @staticmethod
    def get_user_portfolios(db: Session, user_id: int) -> List[Portfolio]:
        """Get all portfolios for a user"""
        return db.query(Portfolio).filter(Portfolio.user_id == user_id).all()
    
    @staticmethod
    def get_portfolio(db: Session, portfolio_id: int, user_id: int) -> Optional[Portfolio]:
        """Get a specific portfolio"""
        return db.query(Portfolio).filter(
            Portfolio.id == portfolio_id,
            Portfolio.user_id == user_id
        ).first()
    
    @staticmethod
    def add_holding(
        db: Session,
        portfolio_id: int,
        symbol: str,
        quantity: float,
        price: float,
        asset_type: str = "stock"
    ) -> PortfolioHolding:
        """Add a holding to a portfolio"""
        holding = PortfolioHolding(
            portfolio_id=portfolio_id,
            symbol=symbol.upper(),
            asset_type=asset_type,
            quantity=quantity,
            average_price=price,
            current_price=price
        )
        db.add(holding)
        db.commit()
        db.refresh(holding)
        return holding
    
    @staticmethod
    def update_holding_price(db: Session, holding_id: int, current_price: float) -> Optional[PortfolioHolding]:
        """Update current price of a holding"""
        holding = db.query(PortfolioHolding).filter(PortfolioHolding.id == holding_id).first()
        if holding:
            holding.current_price = current_price
            db.commit()
            db.refresh(holding)
        return holding
    
    @staticmethod
    def remove_holding(db: Session, holding_id: int) -> bool:
        """Remove a holding from portfolio"""
        holding = db.query(PortfolioHolding).filter(PortfolioHolding.id == holding_id).first()
        if holding:
            db.delete(holding)
            db.commit()
            return True
        return False
    
    @staticmethod
    def add_transaction(
        db: Session,
        portfolio_id: int,
        symbol: str,
        transaction_type: str,
        quantity: float,
        price: float,
        notes: str = None,
        asset_type: str = "stock"
    ) -> Transaction:
        """Add a transaction"""
        transaction = Transaction(
            portfolio_id=portfolio_id,
            symbol=symbol.upper(),
            asset_type=asset_type,
            transaction_type=transaction_type.lower(),
            quantity=quantity,
            price=price,
            total_amount=quantity * price,
            notes=notes
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        return transaction
    
    @staticmethod
    def get_portfolio_summary(db: Session, portfolio_id: int, user_id: int) -> Dict[str, Any]:
        """Get portfolio summary with current values"""
        portfolio = PortfolioService.get_portfolio(db, portfolio_id, user_id)
        if not portfolio:
            return None
        
        holdings = db.query(PortfolioHolding).filter(
            PortfolioHolding.portfolio_id == portfolio_id
        ).all()
        
        portfolio_data = []
        total_value = 0
        total_cost = 0
        
        for holding in holdings:
            # Get current price
            if holding.asset_type == "crypto":
                quote = MarketService.get_crypto_quote(holding.symbol)
                current_price = quote.usd_price if quote else holding.current_price or holding.average_price
            else:
                quote = MarketService.get_stock_quote(holding.symbol)
                current_price = quote.price if quote else holding.current_price or holding.average_price
            
            # Update holding price
            if current_price != holding.current_price:
                PortfolioService.update_holding_price(db, holding.id, current_price)
            
            value = holding.quantity * current_price
            cost = holding.quantity * holding.average_price
            gain_loss = value - cost
            gain_loss_percent = (gain_loss / cost * 100) if cost > 0 else 0
            
            portfolio_data.append({
                "id": holding.id,
                "symbol": holding.symbol,
                "asset_type": holding.asset_type,
                "quantity": holding.quantity,
                "average_price": holding.average_price,
                "current_price": current_price,
                "value": value,
                "gain_loss": gain_loss,
                "gain_loss_percent": gain_loss_percent
            })
            
            total_value += value
            total_cost += cost
        
        total_gain_loss = total_value - total_cost
        total_gain_loss_percent = (total_gain_loss / total_cost * 100) if total_cost > 0 else 0
        
        return {
            "portfolio": portfolio_data,
            "totalValue": round(total_value, 2),
            "totalCost": round(total_cost, 2),
            "totalGainLoss": round(total_gain_loss, 2),
            "totalGainLossPercent": round(total_gain_loss_percent, 2)
        }
    
    @staticmethod
    def refresh_portfolio_prices(db: Session, portfolio_id: int, user_id: int) -> Dict[str, Any]:
        """Refresh all prices in a portfolio"""
        return PortfolioService.get_portfolio_summary(db, portfolio_id, user_id)
