"""
Portfolio management routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from models.user_model import User

from database import get_db
from services.portfolio_service import PortfolioService
from routes.auth import get_current_user

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

# Pydantic models
class PortfolioCreate(BaseModel):
    name: str = "My Portfolio"
    description: Optional[str] = None

class HoldingCreate(BaseModel):
    symbol: str
    quantity: float
    price: float
    asset_type: str = "stock"

class TransactionCreate(BaseModel):
    symbol: str
    transaction_type: str  # buy or sell
    quantity: float
    price: float
    notes: Optional[str] = None
    asset_type: str = "stock"

@router.post("", status_code=status.HTTP_201_CREATED)
def create_portfolio(
    portfolio_data: PortfolioCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new portfolio"""
    portfolio = PortfolioService.create_portfolio(
        db=db,
        user_id=current_user.id,
        name=portfolio_data.name,
        description=portfolio_data.description
    )
    return {
        "id": portfolio.id,
        "name": portfolio.name,
        "description": portfolio.description,
        "created_at": portfolio.created_at
    }

@router.get("")
def get_portfolios(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all portfolios for current user"""
    portfolios = PortfolioService.get_user_portfolios(db, current_user.id)
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "created_at": p.created_at
        }
        for p in portfolios
    ]

@router.get("/{portfolio_id}")
def get_portfolio(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get portfolio summary with current values"""
    summary = PortfolioService.get_portfolio_summary(
        db, portfolio_id, current_user.id
    )
    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    return summary

@router.post("/{portfolio_id}/holdings", status_code=status.HTTP_201_CREATED)
def add_holding(
    portfolio_id: int,
    holding_data: HoldingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a holding to portfolio"""
    # Verify portfolio belongs to user
    portfolio = PortfolioService.get_portfolio(db, portfolio_id, current_user.id)
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    holding = PortfolioService.add_holding(
        db=db,
        portfolio_id=portfolio_id,
        symbol=holding_data.symbol,
        quantity=holding_data.quantity,
        price=holding_data.price,
        asset_type=holding_data.asset_type
    )
    
    return {
        "id": holding.id,
        "symbol": holding.symbol,
        "quantity": holding.quantity,
        "average_price": holding.average_price,
        "current_price": holding.current_price
    }

@router.delete("/holdings/{holding_id}")
def remove_holding(
    holding_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a holding from portfolio"""
    success = PortfolioService.remove_holding(db, holding_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Holding not found"
        )
    return {"message": "Holding removed successfully"}

@router.post("/{portfolio_id}/transactions", status_code=status.HTTP_201_CREATED)
def add_transaction(
    portfolio_id: int,
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a transaction to portfolio"""
    # Verify portfolio belongs to user
    portfolio = PortfolioService.get_portfolio(db, portfolio_id, current_user.id)
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    if transaction_data.transaction_type.lower() not in ["buy", "sell"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transaction type must be 'buy' or 'sell'"
        )
    
    transaction = PortfolioService.add_transaction(
        db=db,
        portfolio_id=portfolio_id,
        symbol=transaction_data.symbol,
        transaction_type=transaction_data.transaction_type,
        quantity=transaction_data.quantity,
        price=transaction_data.price,
        notes=transaction_data.notes,
        asset_type=transaction_data.asset_type
    )
    
    return {
        "id": transaction.id,
        "symbol": transaction.symbol,
        "transaction_type": transaction.transaction_type,
        "quantity": transaction.quantity,
        "price": transaction.price,
        "total_amount": transaction.total_amount,
        "transaction_date": transaction.transaction_date
    }

@router.post("/{portfolio_id}/refresh")
def refresh_portfolio(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Refresh portfolio prices"""
    summary = PortfolioService.refresh_portfolio_prices(
        db, portfolio_id, current_user.id
    )
    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    return summary
