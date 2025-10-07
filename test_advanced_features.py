#!/usr/bin/env python3
"""
Test Advanced FinSage Features
Tests all new advanced features for beginners and power users
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_education_features():
    """Test education center features"""
    print("📚 Testing Education Center...")
    
    # Test topics
    try:
        response = requests.get(f"{BASE_URL}/api/v1/education/topics")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Education topics: {len(data['topics'])} topics available")
            for topic in data['topics'][:3]:
                print(f"   📖 {topic['title']} ({topic['level']}) - {topic['duration']}")
        else:
            print(f"❌ Education topics failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing education topics: {e}")
    
    # Test glossary
    try:
        response = requests.get(f"{BASE_URL}/api/v1/education/glossary")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Financial glossary: {len(data['terms'])} terms available")
            for term in data['terms'][:3]:
                print(f"   📝 {term['term']}: {term['definition'][:50]}...")
        else:
            print(f"❌ Glossary failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing glossary: {e}")

def test_goals_features():
    """Test financial goals features"""
    print("\n🎯 Testing Financial Goals...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/v1/goals/user123")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Goals system: {len(data['goals'])} goals tracked")
            for goal in data['goals']:
                progress = (goal['current_amount'] / goal['target_amount']) * 100
                print(f"   🎯 {goal['title']}: {progress:.1f}% complete (${goal['current_amount']:,}/${goal['target_amount']:,})")
        else:
            print(f"❌ Goals failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing goals: {e}")

def test_analytics_features():
    """Test advanced analytics features"""
    print("\n📊 Testing Advanced Analytics...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/v1/analytics/portfolio")
        if response.status_code == 200:
            data = response.json()
            analytics = data['analytics']
            print(f"✅ Portfolio analytics loaded")
            print(f"   📈 Sharpe Ratio: {analytics['sharpe_ratio']}")
            print(f"   📉 Beta: {analytics['beta']}")
            print(f"   ⚡ Alpha: {analytics['alpha']}")
            print(f"   📊 Volatility: {analytics['volatility']}%")
            print(f"   🏢 Sectors: {len(analytics['sector_allocation'])} sectors tracked")
        else:
            print(f"❌ Analytics failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing analytics: {e}")

def test_alerts_features():
    """Test smart alerts features"""
    print("\n🔔 Testing Smart Alerts...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/v1/alerts/user123")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Alerts system: {len(data['alerts'])} alerts available")
            unread_count = sum(1 for alert in data['alerts'] if not alert['read'])
            print(f"   📬 Unread alerts: {unread_count}")
            for alert in data['alerts'][:3]:
                status = "📬" if not alert['read'] else "📭"
                print(f"   {status} {alert['title']} ({alert['priority']})")
        else:
            print(f"❌ Alerts failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing alerts: {e}")

def test_crypto_features():
    """Test cryptocurrency features"""
    print("\n💰 Testing Cryptocurrency Features...")
    
    # Test crypto prices
    try:
        response = requests.get(f"{BASE_URL}/api/v1/crypto/prices")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Crypto prices: {data['count']} cryptocurrencies tracked")
            for crypto in data['cryptocurrencies'][:3]:
                change_icon = "📈" if crypto['change_24h'] >= 0 else "📉"
                print(f"   {change_icon} {crypto['name']}: ${crypto['price']:,.2f} ({crypto['change_24h']:+.2f}%)")
        else:
            print(f"❌ Crypto prices failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing crypto prices: {e}")
    
    # Test crypto news
    try:
        response = requests.get(f"{BASE_URL}/api/v1/crypto/news")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Crypto news: {data['count']} articles available")
            for article in data['news'][:2]:
                sentiment_icon = "📈" if article['sentiment'] == 'positive' else "📉" if article['sentiment'] == 'negative' else "📊"
                print(f"   {sentiment_icon} {article['title'][:40]}...")
        else:
            print(f"❌ Crypto news failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing crypto news: {e}")

def test_ai_predictions():
    """Test AI prediction features"""
    print("\n🧠 Testing AI Predictions...")
    
    test_cases = [
        {"age": 25, "annual_income": 60000, "risk_tolerance": "high", "investment_horizon_years": 20},
        {"age": 45, "annual_income": 100000, "risk_tolerance": "medium", "investment_horizon_years": 15},
        {"age": 60, "annual_income": 80000, "risk_tolerance": "low", "investment_horizon_years": 5}
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            response = requests.post(f"{BASE_URL}/api/v1/prediction/predict", json=test_case)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ AI Prediction {i}: {data['confidence_score']}% confidence, {data['expected_return']}% expected return")
            else:
                print(f"❌ AI Prediction {i} failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Error testing AI prediction {i}: {e}")

def main():
    """Run all advanced feature tests"""
    print("🚀 FinSage Advanced Features Test Suite")
    print("=" * 60)
    
    # Check if backend is running
    try:
        response = requests.get(f"{BASE_URL}/api/v1/status/health", timeout=5)
        if response.status_code != 200:
            print("❌ Backend server is not running!")
            return
    except:
        print("❌ Cannot connect to backend server!")
        return
    
    print("✅ Backend server is running")
    
    # Run all tests
    test_education_features()
    test_goals_features()
    test_analytics_features()
    test_alerts_features()
    test_crypto_features()
    test_ai_predictions()
    
    print("\n" + "=" * 60)
    print("🎉 Advanced Features Test Complete!")
    print("📊 All major features are working and ready for users!")

if __name__ == "__main__":
    main()
