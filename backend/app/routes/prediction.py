"""
Prediction and AI recommendation endpoints.
Handles investment predictions and financial recommendations.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse

from app.core.logger import app_logger
from app.models.schemas import (
    PredictionRequest, 
    PredictionResponse, 
    ErrorResponse,
    AssetAllocation
)
from app.services.ai_service import ai_service

router = APIRouter(prefix="/prediction", tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponse, summary="Get Investment Prediction")
async def predict_investment(request: PredictionRequest):
    """
    Generate investment prediction and recommendations based on user profile.
    
    This endpoint analyzes user financial data including age, income, risk tolerance,
    and investment horizon to provide personalized investment recommendations.
    
    Args:
        request: User financial profile and preferences
        
    Returns:
        PredictionResponse with investment recommendations and asset allocations
        
    Raises:
        HTTPException: If prediction generation fails
    """
    try:
        app_logger.info(f"Generating prediction for user with risk tolerance: {request.risk_tolerance}")
        
        # Generate prediction using AI service
        prediction = ai_service.predict_investment_recommendation(request)
        
        app_logger.info(f"Prediction generated successfully with score: {prediction.recommendation_score}")
        return prediction
        
    except Exception as e:
        app_logger.error(f"Prediction generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate investment prediction: {str(e)}"
        )


@router.get("/model-info", summary="Get AI Model Information")
async def get_model_info():
    """
    Get information about the loaded AI model.
    
    Returns:
        Model information including type, features, and status
    """
    try:
        model_info = ai_service.get_model_info()
        return {
            "model_info": model_info,
            "status": "success",
            "timestamp": ai_service._create_mock_model.__name__ if not model_info["model_loaded"] else "loaded"
        }
    except Exception as e:
        app_logger.error(f"Failed to get model info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get model information: {str(e)}"
        )


@router.get("/risk-profiles", summary="Get Available Risk Profiles")
async def get_risk_profiles():
    """
    Get available risk tolerance profiles and their characteristics.
    
    Returns:
        Information about different risk profiles
    """
    risk_profiles = {
        "low": {
            "name": "Conservative",
            "description": "Focus on capital preservation with minimal risk",
            "characteristics": [
                "Low volatility investments",
                "High allocation to bonds and cash",
                "Suitable for short-term goals",
                "Minimal exposure to stocks"
            ],
            "typical_allocation": {
                "bonds": 60,
                "large_cap_stocks": 25,
                "reits": 10,
                "cash": 5
            }
        },
        "medium": {
            "name": "Moderate",
            "description": "Balanced approach between growth and stability",
            "characteristics": [
                "Mix of stocks and bonds",
                "Moderate risk tolerance",
                "Suitable for medium-term goals",
                "Diversified portfolio"
            ],
            "typical_allocation": {
                "large_cap_stocks": 40,
                "bonds": 30,
                "international_stocks": 15,
                "reits": 10,
                "small_cap_stocks": 5
            }
        },
        "high": {
            "name": "Aggressive",
            "description": "Focus on growth with higher risk tolerance",
            "characteristics": [
                "High allocation to stocks",
                "Growth-oriented investments",
                "Suitable for long-term goals",
                "Higher volatility expected"
            ],
            "typical_allocation": {
                "large_cap_stocks": 35,
                "small_cap_stocks": 25,
                "international_stocks": 20,
                "emerging_markets": 10,
                "bonds": 10
            }
        }
    }
    
    return {
        "risk_profiles": risk_profiles,
        "status": "success"
    }


@router.get("/asset-classes", summary="Get Available Asset Classes")
async def get_asset_classes():
    """
    Get information about available asset classes for investment.
    
    Returns:
        Information about different asset classes
    """
    asset_classes = {
        "stocks": {
            "name": "Stocks",
            "description": "Equity investments in companies",
            "subcategories": [
                "Large Cap Stocks",
                "Mid Cap Stocks", 
                "Small Cap Stocks",
                "International Stocks",
                "Emerging Market Stocks"
            ],
            "risk_level": "Medium to High",
            "expected_return": "7-12% annually",
            "liquidity": "High"
        },
        "bonds": {
            "name": "Bonds",
            "description": "Fixed-income securities",
            "subcategories": [
                "Government Bonds",
                "Corporate Bonds",
                "Municipal Bonds",
                "International Bonds"
            ],
            "risk_level": "Low to Medium",
            "expected_return": "2-5% annually",
            "liquidity": "Medium to High"
        },
        "real_estate": {
            "name": "Real Estate",
            "description": "Property and real estate investments",
            "subcategories": [
                "REITs (Real Estate Investment Trusts)",
                "Direct Property Investment",
                "Real Estate Crowdfunding"
            ],
            "risk_level": "Medium",
            "expected_return": "6-10% annually",
            "liquidity": "Low to Medium"
        },
        "commodities": {
            "name": "Commodities",
            "description": "Physical goods and raw materials",
            "subcategories": [
                "Gold",
                "Silver",
                "Oil",
                "Agricultural Products"
            ],
            "risk_level": "High",
            "expected_return": "Variable",
            "liquidity": "Medium"
        },
        "cryptocurrency": {
            "name": "Cryptocurrency",
            "description": "Digital currencies and blockchain assets",
            "subcategories": [
                "Bitcoin",
                "Ethereum",
                "Altcoins",
                "DeFi Tokens"
            ],
            "risk_level": "Very High",
            "expected_return": "Highly Variable",
            "liquidity": "High"
        },
        "cash": {
            "name": "Cash and Cash Equivalents",
            "description": "Liquid assets and short-term investments",
            "subcategories": [
                "Savings Accounts",
                "Money Market Funds",
                "Certificates of Deposit",
                "Treasury Bills"
            ],
            "risk_level": "Very Low",
            "expected_return": "1-3% annually",
            "liquidity": "Very High"
        }
    }
    
    return {
        "asset_classes": asset_classes,
        "status": "success"
    }


@router.post("/validate-profile", summary="Validate User Profile")
async def validate_user_profile(request: PredictionRequest):
    """
    Validate user profile data for prediction requests.
    
    Args:
        request: User profile to validate
        
    Returns:
        Validation results and suggestions
    """
    validation_results = {
        "is_valid": True,
        "warnings": [],
        "suggestions": [],
        "profile_analysis": {}
    }
    
    # Age validation
    if request.age < 25:
        validation_results["warnings"].append("Young investors should consider long-term strategies")
        validation_results["suggestions"].append("Consider starting with lower risk investments and gradually increasing risk tolerance")
    elif request.age > 60:
        validation_results["warnings"].append("Older investors should focus on capital preservation")
        validation_results["suggestions"].append("Consider higher allocation to bonds and lower risk assets")
    
    # Income validation
    if request.annual_income < 30000:
        validation_results["warnings"].append("Lower income may limit investment options")
        validation_results["suggestions"].append("Consider starting with low-cost index funds and ETFs")
    elif request.annual_income > 200000:
        validation_results["suggestions"].append("High income allows for more sophisticated investment strategies")
    
    # Investment horizon validation
    if request.investment_horizon_years < 3:
        validation_results["warnings"].append("Short investment horizon may limit growth potential")
        validation_results["suggestions"].append("Consider more conservative investments for short-term goals")
    elif request.investment_horizon_years > 20:
        validation_results["suggestions"].append("Long investment horizon allows for higher risk tolerance")
    
    # Risk tolerance analysis
    risk_analysis = {
        "age_factor": "favorable" if 25 <= request.age <= 55 else "unfavorable",
        "income_factor": "favorable" if request.annual_income > 50000 else "moderate",
        "horizon_factor": "favorable" if request.investment_horizon_years > 5 else "unfavorable"
    }
    
    validation_results["profile_analysis"] = risk_analysis
    
    # Overall validation
    if len(validation_results["warnings"]) > 2:
        validation_results["is_valid"] = False
        validation_results["suggestions"].append("Consider consulting with a financial advisor")
    
    return validation_results


@router.get("/prediction-history", summary="Get Prediction History")
async def get_prediction_history(user_id: str, limit: int = 10):
    """
    Get prediction history for a user (placeholder for future implementation).
    
    Args:
        user_id: User identifier
        limit: Maximum number of predictions to return
        
    Returns:
        Prediction history
    """
    # This would be implemented with a database in production
    return {
        "message": "Prediction history not yet implemented",
        "user_id": user_id,
        "limit": limit,
        "status": "not_implemented"
    }
