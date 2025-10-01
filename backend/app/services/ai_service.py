"""
AI/ML service for investment predictions and recommendations.
Handles model loading, prediction generation, and asset allocation.
"""

import joblib
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime
import os
from pathlib import Path

from app.core.config import settings
from app.core.logger import app_logger
from app.models.schemas import PredictionRequest, PredictionResponse, AssetAllocation, RiskTolerance


class AIService:
    """AI service for financial predictions and recommendations."""
    
    def __init__(self):
        """Initialize the AI service."""
        self.model = None
        self.model_loaded = False
        self._load_model()
    
    def _load_model(self) -> None:
        """Load the ML model from file."""
        try:
            model_path = Path(settings.ml_model_path)
            if model_path.exists():
                self.model = joblib.load(model_path)
                self.model_loaded = True
                app_logger.info(f"ML model loaded successfully from {model_path}")
            else:
                app_logger.warning(f"Model file not found at {model_path}, using mock predictions")
                self.model_loaded = False
        except Exception as e:
            app_logger.error(f"Failed to load ML model: {str(e)}")
            self.model_loaded = False
    
    def _create_mock_model(self) -> None:
        """Create a mock model for demonstration purposes."""
        # This would be replaced with actual model training in production
        from sklearn.ensemble import RandomForestRegressor
        from sklearn.preprocessing import StandardScaler
        
        # Generate mock training data
        np.random.seed(42)
        n_samples = 1000
        
        # Features: age, income, risk_tolerance_encoded, horizon_years
        X = np.random.rand(n_samples, 4)
        X[:, 0] = np.random.randint(18, 80, n_samples)  # age
        X[:, 1] = np.random.uniform(30000, 200000, n_samples)  # income
        X[:, 2] = np.random.randint(0, 3, n_samples)  # risk tolerance (0=low, 1=medium, 2=high)
        X[:, 3] = np.random.randint(1, 30, n_samples)  # horizon years
        
        # Target: recommendation score (0-100)
        y = np.random.uniform(20, 95, n_samples)
        
        # Train a simple model
        self.model = RandomForestRegressor(n_estimators=10, random_state=42)
        self.model.fit(X, y)
        self.model_loaded = True
        
        app_logger.info("Mock ML model created and trained")
    
    def _encode_risk_tolerance(self, risk_tolerance: RiskTolerance) -> int:
        """Encode risk tolerance to numeric value."""
        mapping = {
            RiskTolerance.LOW: 0,
            RiskTolerance.MEDIUM: 1,
            RiskTolerance.HIGH: 2
        }
        return mapping[risk_tolerance]
    
    def _generate_asset_allocations(self, risk_tolerance: RiskTolerance, 
                                  recommendation_score: float) -> List[AssetAllocation]:
        """Generate asset allocation recommendations based on risk tolerance and score."""
        
        # Base allocations by risk tolerance
        base_allocations = {
            RiskTolerance.LOW: [
                ("Bonds", 60, 3.5, "Low"),
                ("Large Cap Stocks", 25, 7.0, "Medium"),
                ("REITs", 10, 6.0, "Medium"),
                ("Cash", 5, 2.0, "Low")
            ],
            RiskTolerance.MEDIUM: [
                ("Large Cap Stocks", 40, 8.0, "Medium"),
                ("Bonds", 30, 4.0, "Low"),
                ("International Stocks", 15, 9.0, "High"),
                ("REITs", 10, 6.5, "Medium"),
                ("Small Cap Stocks", 5, 12.0, "High")
            ],
            RiskTolerance.HIGH: [
                ("Large Cap Stocks", 35, 8.5, "Medium"),
                ("Small Cap Stocks", 25, 12.0, "High"),
                ("International Stocks", 20, 9.5, "High"),
                ("Emerging Markets", 10, 11.0, "Very High"),
                ("Bonds", 10, 4.5, "Low")
            ]
        }
        
        allocations = base_allocations[risk_tolerance]
        
        # Adjust based on recommendation score
        score_factor = recommendation_score / 100.0
        
        asset_allocations = []
        for asset_class, base_pct, base_return, risk_level in allocations:
            # Adjust percentage based on score (higher score = more aggressive)
            adjusted_pct = base_pct * (0.8 + 0.4 * score_factor)
            adjusted_return = base_return * (0.9 + 0.2 * score_factor)
            
            asset_allocations.append(AssetAllocation(
                asset_class=asset_class,
                percentage=round(adjusted_pct, 1),
                expected_return=round(adjusted_return, 2),
                risk_level=risk_level
            ))
        
        # Normalize percentages to sum to 100
        total_pct = sum(a.percentage for a in asset_allocations)
        for allocation in asset_allocations:
            allocation.percentage = round((allocation.percentage / total_pct) * 100, 1)
        
        return asset_allocations
    
    def _calculate_total_expected_return(self, allocations: List[AssetAllocation]) -> float:
        """Calculate total expected return based on allocations."""
        total_return = 0.0
        for allocation in allocations:
            total_return += (allocation.percentage / 100.0) * allocation.expected_return
        return round(total_return, 2)
    
    def _get_risk_assessment(self, risk_tolerance: RiskTolerance, 
                           recommendation_score: float) -> str:
        """Generate risk assessment based on risk tolerance and score."""
        if risk_tolerance == RiskTolerance.LOW:
            if recommendation_score < 40:
                return "Conservative - Focus on capital preservation"
            elif recommendation_score < 70:
                return "Moderate Conservative - Balanced growth with low risk"
            else:
                return "Moderate - Some growth potential with controlled risk"
        elif risk_tolerance == RiskTolerance.MEDIUM:
            if recommendation_score < 40:
                return "Moderate Conservative - Steady growth approach"
            elif recommendation_score < 70:
                return "Moderate - Balanced growth and income"
            else:
                return "Moderate Aggressive - Growth-focused with moderate risk"
        else:  # HIGH risk tolerance
            if recommendation_score < 40:
                return "Moderate - Growth potential with some risk"
            elif recommendation_score < 70:
                return "Aggressive - High growth potential with significant risk"
            else:
                return "Very Aggressive - Maximum growth potential with high risk"
    
    def predict_investment_recommendation(self, request: PredictionRequest) -> PredictionResponse:
        """
        Generate investment recommendation based on user profile.
        
        Args:
            request: User financial data and preferences
            
        Returns:
            PredictionResponse with recommendations and asset allocations
        """
        try:
            app_logger.info(f"Generating prediction for user with risk tolerance: {request.risk_tolerance}")
            
            # Prepare features for model prediction
            features = np.array([[
                request.age,
                request.annual_income,
                self._encode_risk_tolerance(request.risk_tolerance),
                request.investment_horizon_years
            ]])
            
            # Get prediction from model or generate mock prediction
            if self.model_loaded and self.model is not None:
                recommendation_score = float(self.model.predict(features)[0])
                confidence_level = 85.0  # Mock confidence level
            else:
                # Generate mock prediction based on rules
                recommendation_score = self._generate_mock_prediction(request)
                confidence_level = 75.0  # Lower confidence for mock predictions
            
            # Ensure score is within valid range
            recommendation_score = max(0, min(100, recommendation_score))
            
            # Generate asset allocations
            asset_allocations = self._generate_asset_allocations(
                request.risk_tolerance, 
                recommendation_score
            )
            
            # Calculate total expected return
            total_expected_return = self._calculate_total_expected_return(asset_allocations)
            
            # Generate risk assessment
            risk_assessment = self._get_risk_assessment(request.risk_tolerance, recommendation_score)
            
            response = PredictionResponse(
                recommendation_score=round(recommendation_score, 1),
                asset_allocations=asset_allocations,
                total_expected_return=total_expected_return,
                risk_assessment=risk_assessment,
                confidence_level=confidence_level
            )
            
            app_logger.info(f"Prediction generated successfully with score: {recommendation_score}")
            return response
            
        except Exception as e:
            app_logger.error(f"Error generating prediction: {str(e)}")
            raise Exception(f"Failed to generate investment recommendation: {str(e)}")
    
    def _generate_mock_prediction(self, request: PredictionRequest) -> float:
        """Generate mock prediction based on user profile."""
        base_score = 50.0
        
        # Adjust based on age (younger = higher score)
        age_factor = max(0, (65 - request.age) / 65) * 20
        
        # Adjust based on income (higher income = higher score)
        income_factor = min(20, request.annual_income / 10000)
        
        # Adjust based on risk tolerance
        risk_factors = {
            RiskTolerance.LOW: 0,
            RiskTolerance.MEDIUM: 10,
            RiskTolerance.HIGH: 20
        }
        risk_factor = risk_factors[request.risk_tolerance]
        
        # Adjust based on investment horizon (longer = higher score)
        horizon_factor = min(15, request.investment_horizon_years * 2)
        
        # Calculate final score
        final_score = base_score + age_factor + income_factor + risk_factor + horizon_factor
        
        return min(95, max(20, final_score))
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the loaded model."""
        return {
            "model_loaded": self.model_loaded,
            "model_type": type(self.model).__name__ if self.model else None,
            "model_path": settings.ml_model_path,
            "features": ["age", "annual_income", "risk_tolerance", "investment_horizon_years"]
        }


# Global AI service instance
ai_service = AIService()
