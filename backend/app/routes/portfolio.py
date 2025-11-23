"""
Portfolio management endpoints.
Handles user portfolio operations and asset management.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from app.core.logger import app_logger
from app.models.schemas import (
    Portfolio, 
    PortfolioUpdateRequest, 
    Asset,
    ErrorResponse
)
from app.utils.helpers import validate_portfolio_data, calculate_portfolio_performance

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

# In-memory storage for demo purposes (replace with database in production)
portfolios_db: Dict[str, Portfolio] = {}


@router.get("/{user_id}", response_model=Portfolio, summary="Get User Portfolio")
async def get_portfolio(user_id: str):
    """
    Get user's current portfolio.
    
    Args:
        user_id: User identifier
        
    Returns:
        User's portfolio information
        
    Raises:
        HTTPException: If portfolio not found
    """
    try:
        if user_id not in portfolios_db:
            # Return empty portfolio for new users
            empty_portfolio = Portfolio(
                user_id=user_id,
                total_value=0.0,
                assets=[],
                last_updated=datetime.utcnow()
            )
            portfolios_db[user_id] = empty_portfolio
            app_logger.info(f"Created empty portfolio for new user: {user_id}")
        
        portfolio = portfolios_db[user_id]
        app_logger.info(f"Retrieved portfolio for user: {user_id}")
        return portfolio
        
    except Exception as e:
        app_logger.error(f"Failed to get portfolio for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve portfolio: {str(e)}"
        )


@router.post("/{user_id}", response_model=Portfolio, summary="Update User Portfolio")
async def update_portfolio(user_id: str, request: PortfolioUpdateRequest):
    """
    Update or create user's portfolio.
    
    Args:
        user_id: User identifier
        request: Portfolio update data
        
    Returns:
        Updated portfolio information
        
    Raises:
        HTTPException: If update fails
    """
    try:
        # Validate portfolio data
        portfolio_data = {
            "user_id": user_id,
            "assets": [asset.dict() for asset in request.assets]
        }
        
        validation_errors = validate_portfolio_data(portfolio_data)
        if validation_errors:
            raise HTTPException(
                status_code=400,
                detail=f"Portfolio validation failed: {', '.join(validation_errors)}"
            )
        
        # Calculate total portfolio value
        total_value = sum(asset.total_value for asset in request.assets)
        
        # Create updated portfolio
        updated_portfolio = Portfolio(
            user_id=user_id,
            total_value=total_value,
            assets=request.assets,
            last_updated=datetime.utcnow(),
            performance_metrics=await _calculate_performance_metrics(user_id, total_value)
        )
        
        # Store portfolio
        portfolios_db[user_id] = updated_portfolio
        
        app_logger.info(f"Updated portfolio for user: {user_id}, total value: ${total_value:,.2f}")
        return updated_portfolio
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Failed to update portfolio for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update portfolio: {str(e)}"
        )


@router.post("/{user_id}/assets", response_model=Portfolio, summary="Add Asset to Portfolio")
async def add_asset(user_id: str, asset: Asset):
    """
    Add a new asset to user's portfolio.
    
    Args:
        user_id: User identifier
        asset: Asset to add
        
    Returns:
        Updated portfolio information
    """
    try:
        # Get current portfolio
        if user_id not in portfolios_db:
            current_portfolio = Portfolio(
                user_id=user_id,
                total_value=0.0,
                assets=[],
                last_updated=datetime.utcnow()
            )
        else:
            current_portfolio = portfolios_db[user_id]
        
        # Add new asset
        current_portfolio.assets.append(asset)
        
        # Recalculate total value
        current_portfolio.total_value = sum(a.total_value for a in current_portfolio.assets)
        current_portfolio.last_updated = datetime.utcnow()
        
        # Update performance metrics
        current_portfolio.performance_metrics = await _calculate_performance_metrics(
            user_id, 
            current_portfolio.total_value
        )
        
        # Store updated portfolio
        portfolios_db[user_id] = current_portfolio
        
        app_logger.info(f"Added asset {asset.symbol} to portfolio for user: {user_id}")
        return current_portfolio
        
    except Exception as e:
        app_logger.error(f"Failed to add asset to portfolio for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add asset: {str(e)}"
        )


@router.delete("/{user_id}/assets/{symbol}", response_model=Portfolio, summary="Remove Asset from Portfolio")
async def remove_asset(user_id: str, symbol: str):
    """
    Remove an asset from user's portfolio.
    
    Args:
        user_id: User identifier
        symbol: Asset symbol to remove
        
    Returns:
        Updated portfolio information
        
    Raises:
        HTTPException: If asset not found
    """
    try:
        if user_id not in portfolios_db:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        portfolio = portfolios_db[user_id]
        
        # Find and remove asset
        asset_found = False
        for i, asset in enumerate(portfolio.assets):
            if asset.symbol.upper() == symbol.upper():
                portfolio.assets.pop(i)
                asset_found = True
                break
        
        if not asset_found:
            raise HTTPException(status_code=404, detail=f"Asset {symbol} not found in portfolio")
        
        # Recalculate total value
        portfolio.total_value = sum(a.total_value for a in portfolio.assets)
        portfolio.last_updated = datetime.utcnow()
        
        # Update performance metrics
        portfolio.performance_metrics = await _calculate_performance_metrics(
            user_id, 
            portfolio.total_value
        )
        
        # Store updated portfolio
        portfolios_db[user_id] = portfolio
        
        app_logger.info(f"Removed asset {symbol} from portfolio for user: {user_id}")
        return portfolio
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Failed to remove asset from portfolio for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to remove asset: {str(e)}"
        )


@router.get("/{user_id}/performance", summary="Get Portfolio Performance")
async def get_portfolio_performance(
    user_id: str,
    days: int = Query(30, ge=1, le=365, description="Number of days for performance calculation")
):
    """
    Get portfolio performance metrics.
    
    Args:
        user_id: User identifier
        days: Number of days for performance calculation
        
    Returns:
        Portfolio performance metrics
    """
    try:
        if user_id not in portfolios_db:
            raise HTTPException(status_code=404, detail="Portfolio not found")
        
        portfolio = portfolios_db[user_id]
        
        # Mock performance calculation (in production, this would use historical data)
        current_value = portfolio.total_value
        initial_value = current_value * 0.95  # Mock 5% gain
        
        performance = calculate_portfolio_performance(initial_value, current_value, days)
        
        # Add additional metrics
        performance.update({
            "portfolio_id": user_id,
            "calculation_period_days": days,
            "current_value": current_value,
            "initial_value": initial_value,
            "number_of_assets": len(portfolio.assets),
            "last_updated": portfolio.last_updated.isoformat()
        })
        
        app_logger.info(f"Calculated performance for portfolio {user_id}")
        return performance
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Failed to calculate performance for portfolio {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate performance: {str(e)}"
        )


@router.get("/{user_id}/assets", response_model=List[Asset], summary="Get Portfolio Assets")
async def get_portfolio_assets(user_id: str):
    """
    Get all assets in user's portfolio.
    
    Args:
        user_id: User identifier
        
    Returns:
        List of assets in the portfolio
    """
    try:
        if user_id not in portfolios_db:
            return []
        
        portfolio = portfolios_db[user_id]
        app_logger.info(f"Retrieved {len(portfolio.assets)} assets for user: {user_id}")
        return portfolio.assets
        
    except Exception as e:
        app_logger.error(f"Failed to get assets for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve assets: {str(e)}"
        )


@router.get("/{user_id}/summary", summary="Get Portfolio Summary")
async def get_portfolio_summary(user_id: str):
    """
    Get portfolio summary with key metrics.
    
    Args:
        user_id: User identifier
        
    Returns:
        Portfolio summary information
    """
    try:
        if user_id not in portfolios_db:
            return {
                "user_id": user_id,
                "total_value": 0.0,
                "asset_count": 0,
                "last_updated": None,
                "status": "empty"
            }
        
        portfolio = portfolios_db[user_id]
        
        # Calculate asset type distribution
        asset_types = {}
        for asset in portfolio.assets:
            asset_type = asset.asset_type
            if asset_type not in asset_types:
                asset_types[asset_type] = {"count": 0, "value": 0.0}
            asset_types[asset_type]["count"] += 1
            asset_types[asset_type]["value"] += asset.total_value
        
        # Calculate top assets by value
        top_assets = sorted(portfolio.assets, key=lambda x: x.total_value, reverse=True)[:5]
        
        summary = {
            "user_id": user_id,
            "total_value": portfolio.total_value,
            "asset_count": len(portfolio.assets),
            "last_updated": portfolio.last_updated.isoformat(),
            "asset_type_distribution": asset_types,
            "top_assets": [
                {
                    "symbol": asset.symbol,
                    "name": asset.name,
                    "value": asset.total_value,
                    "percentage": (asset.total_value / portfolio.total_value * 100) if portfolio.total_value > 0 else 0
                }
                for asset in top_assets
            ],
            "status": "active"
        }
        
        app_logger.info(f"Generated summary for portfolio {user_id}")
        return summary
        
    except Exception as e:
        app_logger.error(f"Failed to generate summary for portfolio {user_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate portfolio summary: {str(e)}"
        )


async def _calculate_performance_metrics(user_id: str, current_value: float) -> Dict[str, Any]:
    """
    Calculate performance metrics for a portfolio.
    
    Args:
        user_id: User identifier
        current_value: Current portfolio value
        
    Returns:
        Performance metrics dictionary
    """
    # Mock performance calculation (in production, this would use historical data)
    return {
        "total_return": current_value * 0.05,  # Mock 5% return
        "total_return_percentage": 5.0,
        "annualized_return": 5.0,
        "volatility": 12.5,
        "sharpe_ratio": 0.4,
        "max_drawdown": -8.2,
        "beta": 1.1,
        "alpha": 0.3
    }
