#!/usr/bin/env python3
"""
FinSage Comprehensive Test Suite
Tests all API endpoints and functionality
"""

import requests
import json
import time
import sys

BASE_URL = "http://localhost:8000"

def test_endpoint(method, endpoint, data=None, expected_status=200):
    """Test a single endpoint"""
    try:
        if method == "GET":
            response = requests.get(f"{BASE_URL}{endpoint}")
        elif method == "POST":
            response = requests.post(f"{BASE_URL}{endpoint}", json=data)
        
        print(f"✅ {method} {endpoint} - Status: {response.status_code}")
        
        if response.status_code == expected_status:
            result = response.json()
            print(f"   Response: {json.dumps(result, indent=2)[:200]}...")
            return True, result
        else:
            print(f"   ❌ Expected {expected_status}, got {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ {method} {endpoint} - Error: {str(e)}")
        return False, None

def test_ai_predictions():
    """Test AI prediction functionality with various scenarios"""
    print("\n🧠 Testing AI Predictions...")
    
    test_cases = [
        {
            "name": "Young High-Risk Investor",
            "data": {"age": 25, "annual_income": 120000, "risk_tolerance": "high", "investment_horizon_years": 20}
        },
        {
            "name": "Middle-Aged Conservative Investor",
            "data": {"age": 45, "annual_income": 80000, "risk_tolerance": "low", "investment_horizon_years": 10}
        },
        {
            "name": "Balanced Medium-Risk Investor",
            "data": {"age": 35, "annual_income": 95000, "risk_tolerance": "medium", "investment_horizon_years": 15}
        },
        {
            "name": "Senior Conservative Investor",
            "data": {"age": 60, "annual_income": 70000, "risk_tolerance": "low", "investment_horizon_years": 5}
        }
    ]
    
    success_count = 0
    for test_case in test_cases:
        print(f"\n   Testing: {test_case['name']}")
        success, result = test_endpoint("POST", "/api/v1/prediction/predict", test_case['data'])
        
        if success and result:
            # Validate response structure
            required_fields = ['confidence_score', 'expected_return', 'risk_level', 'asset_allocations']
            if all(field in result for field in required_fields):
                print(f"   ✅ All required fields present")
                print(f"   📊 Confidence: {result['confidence_score']}%")
                print(f"   💰 Expected Return: {result['expected_return']}%")
                print(f"   🎯 Risk Level: {result['risk_level']}")
                print(f"   📈 Asset Allocations: {len(result['asset_allocations'])} types")
                success_count += 1
            else:
                print(f"   ❌ Missing required fields")
        else:
            print(f"   ❌ Request failed")
    
    print(f"\n🧠 AI Predictions: {success_count}/{len(test_cases)} tests passed")
    return success_count == len(test_cases)

def test_portfolio_management():
    """Test portfolio management functionality"""
    print("\n💼 Testing Portfolio Management...")
    
    success, result = test_endpoint("GET", "/api/v1/portfolio/user123")
    
    if success and result:
        # Validate portfolio structure
        required_fields = ['user_id', 'total_value', 'total_return', 'assets']
        if all(field in result for field in required_fields):
            print(f"   ✅ Portfolio structure valid")
            print(f"   💰 Total Value: ${result['total_value']:,}")
            print(f"   📈 Total Return: {result['total_return']}%")
            print(f"   📊 Assets: {len(result['assets'])} holdings")
            
            # Validate asset structure
            asset_fields = ['name', 'symbol', 'value', 'return_percentage', 'quantity']
            valid_assets = 0
            for asset in result['assets']:
                if all(field in asset for field in asset_fields):
                    valid_assets += 1
            
            print(f"   📈 Valid Assets: {valid_assets}/{len(result['assets'])}")
            return valid_assets == len(result['assets'])
        else:
            print(f"   ❌ Invalid portfolio structure")
            return False
    else:
        print(f"   ❌ Portfolio request failed")
        return False

def test_blockchain_integration():
    """Test blockchain integration functionality"""
    print("\n⛓️ Testing Blockchain Integration...")
    
    # Test blockchain status
    success1, status_result = test_endpoint("GET", "/api/v1/blockchain/status")
    
    # Test wallet balance
    test_wallet = "0x742d35Cc6634C0532925a3b8D0C9e8b4e8b4e8b4"
    success2, balance_result = test_endpoint("GET", f"/api/v1/blockchain/balance/{test_wallet}")
    
    if success1 and status_result:
        print(f"   ✅ Blockchain Status: {status_result['connected']}")
        print(f"   🌐 Network: {status_result['network']}")
        print(f"   🔢 Latest Block: {status_result['latest_block']}")
    
    if success2 and balance_result:
        print(f"   ✅ Wallet Balance Retrieved")
        print(f"   💎 ETH Balance: {balance_result['eth_balance']}")
        print(f"   💵 USD Value: ${balance_result['usd_value']}")
    
    return success1 and success2

def test_health_monitoring():
    """Test health monitoring endpoints"""
    print("\n🏥 Testing Health Monitoring...")
    
    success, result = test_endpoint("GET", "/api/v1/status/health")
    
    if success and result:
        print(f"   ✅ Health Check: {result['status']}")
        print(f"   🔧 Service: {result['service']}")
        print(f"   📊 Version: {result['version']}")
        return True
    else:
        print(f"   ❌ Health check failed")
        return False

def main():
    """Run all tests"""
    print("🚀 FinSage Comprehensive Test Suite")
    print("=" * 50)
    
    # Check if backend is running
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code != 200:
            print("❌ Backend server is not running!")
            print("   Please start the backend with: python3 simple_backend.py")
            sys.exit(1)
    except:
        print("❌ Cannot connect to backend server!")
        print("   Please start the backend with: python3 simple_backend.py")
        sys.exit(1)
    
    print("✅ Backend server is running")
    
    # Run all tests
    tests = [
        ("Health Monitoring", test_health_monitoring),
        ("AI Predictions", test_ai_predictions),
        ("Portfolio Management", test_portfolio_management),
        ("Blockchain Integration", test_blockchain_integration)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test failed with error: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{len(results)} test suites passed")
    
    if passed == len(results):
        print("🎉 All tests passed! FinSage is working perfectly!")
        return 0
    else:
        print("⚠️ Some tests failed. Please check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
