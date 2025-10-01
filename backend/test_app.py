#!/usr/bin/env python3
"""
Simple test script to verify FinSage application functionality.
Run this script to test the basic functionality of the application.
"""

import sys
import os
import asyncio
import json
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.services.ai_service import ai_service
from app.services.blockchain_service import blockchain_service
from app.models.schemas import PredictionRequest, RiskTolerance


async def test_ai_service():
    """Test AI service functionality."""
    print("🤖 Testing AI Service...")
    
    try:
        # Test model info
        model_info = ai_service.get_model_info()
        print(f"   ✅ Model loaded: {model_info['model_loaded']}")
        print(f"   ✅ Model type: {model_info['model_type']}")
        
        # Test prediction
        request = PredictionRequest(
            age=30,
            annual_income=75000,
            risk_tolerance=RiskTolerance.MEDIUM,
            investment_horizon_years=10
        )
        
        prediction = ai_service.predict_investment_recommendation(request)
        print(f"   ✅ Prediction generated: {prediction.recommendation_score}%")
        print(f"   ✅ Asset allocations: {len(prediction.asset_allocations)}")
        
        return True
    except Exception as e:
        print(f"   ❌ AI Service test failed: {str(e)}")
        return False


async def test_blockchain_service():
    """Test blockchain service functionality."""
    print("⛓️  Testing Blockchain Service...")
    
    try:
        # Test blockchain status
        status = await blockchain_service.get_blockchain_status()
        print(f"   ✅ Blockchain connected: {status.is_connected}")
        
        if status.is_connected:
            print(f"   ✅ Network ID: {status.network_id}")
            print(f"   ✅ Latest block: {status.latest_block}")
        else:
            print("   ⚠️  Blockchain not connected (expected in test environment)")
        
        return True
    except Exception as e:
        print(f"   ❌ Blockchain Service test failed: {str(e)}")
        return False


def test_models():
    """Test Pydantic models."""
    print("📋 Testing Pydantic Models...")
    
    try:
        # Test PredictionRequest
        request = PredictionRequest(
            age=25,
            annual_income=50000,
            risk_tolerance=RiskTolerance.HIGH,
            investment_horizon_years=5
        )
        print(f"   ✅ PredictionRequest created: {request.age} years old")
        
        # Test validation
        try:
            invalid_request = PredictionRequest(
                age=15,  # Too young
                annual_income=-1000,  # Negative income
                risk_tolerance=RiskTolerance.LOW,
                investment_horizon_years=0  # Invalid horizon
            )
            print("   ❌ Validation should have failed")
            return False
        except Exception:
            print("   ✅ Validation working correctly")
        
        return True
    except Exception as e:
        print(f"   ❌ Models test failed: {str(e)}")
        return False


def test_utilities():
    """Test utility functions."""
    print("🔧 Testing Utility Functions...")
    
    try:
        from app.utils.helpers import validate_ethereum_address, format_currency, calculate_percentage_change
        
        # Test Ethereum address validation
        valid_address = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
        invalid_address = "invalid_address"
        
        assert validate_ethereum_address(valid_address) == True
        assert validate_ethereum_address(invalid_address) == False
        print("   ✅ Ethereum address validation working")
        
        # Test currency formatting
        formatted = format_currency(1234.56, "USD")
        assert formatted == "$1,234.56"
        print("   ✅ Currency formatting working")
        
        # Test percentage calculation
        change = calculate_percentage_change(100, 120)
        assert change == 20.0
        print("   ✅ Percentage calculation working")
        
        return True
    except Exception as e:
        print(f"   ❌ Utilities test failed: {str(e)}")
        return False


async def test_fastapi_app():
    """Test FastAPI application."""
    print("🚀 Testing FastAPI Application...")
    
    try:
        from fastapi.testclient import TestClient
        
        client = TestClient(app)
        
        # Test root endpoint
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Welcome to FinSage API"
        print("   ✅ Root endpoint working")
        
        # Test health endpoint
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("   ✅ Health endpoint working")
        
        # Test API health endpoint
        response = client.get("/api/v1/status/health")
        assert response.status_code == 200
        print("   ✅ API health endpoint working")
        
        return True
    except Exception as e:
        print(f"   ❌ FastAPI app test failed: {str(e)}")
        return False


async def main():
    """Run all tests."""
    print("🧪 FinSage Backend Test Suite")
    print("=" * 50)
    
    tests = [
        ("Pydantic Models", test_models),
        ("Utility Functions", test_utilities),
        ("AI Service", test_ai_service),
        ("Blockchain Service", test_blockchain_service),
        ("FastAPI Application", test_fastapi_app),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        try:
            if asyncio.iscoroutinefunction(test_func):
                result = await test_func()
            else:
                result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"   ❌ {test_name} failed with exception: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! FinSage backend is ready to go!")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
