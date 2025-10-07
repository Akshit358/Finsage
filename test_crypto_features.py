#!/usr/bin/env python3
"""
Test Cryptocurrency Features
Tests all new crypto endpoints and functionality
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_crypto_endpoints():
    """Test all cryptocurrency endpoints"""
    print("🚀 Testing Cryptocurrency Features")
    print("=" * 50)
    
    # Test crypto prices
    print("\n💰 Testing Cryptocurrency Prices...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/crypto/prices")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Crypto prices endpoint working")
            print(f"   📊 Found {data['count']} cryptocurrencies")
            print(f"   🕐 Last updated: {time.ctime(data['last_updated'])}")
            
            # Show first few cryptos
            for i, crypto in enumerate(data['cryptocurrencies'][:3]):
                print(f"   {i+1}. {crypto['name']} ({crypto['symbol']}): ${crypto['price']:,.2f} ({crypto['change_24h']:+.2f}%)")
        else:
            print(f"❌ Crypto prices failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing crypto prices: {e}")
    
    # Test Ethereum specific data
    print("\n🔷 Testing Ethereum Data...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/crypto/ethereum")
        if response.status_code == 200:
            data = response.json()
            eth = data['ethereum']
            print(f"✅ Ethereum endpoint working")
            print(f"   💎 ETH Price: ${eth['price']:,.2f}")
            print(f"   📈 24h Change: {eth['change_24h']:+.2f}%")
            print(f"   💰 Market Cap: ${eth['market_cap']/1e9:.2f}B")
        else:
            print(f"❌ Ethereum data failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing Ethereum data: {e}")
    
    # Test crypto news
    print("\n📰 Testing Cryptocurrency News...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/crypto/news")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Crypto news endpoint working")
            print(f"   📰 Found {data['count']} news articles")
            print(f"   🕐 Last updated: {time.ctime(data['last_updated'])}")
            
            # Show first few news items
            for i, article in enumerate(data['news'][:3]):
                print(f"   {i+1}. {article['title'][:50]}...")
                print(f"      Category: {article['category']} | Sentiment: {article['sentiment']}")
        else:
            print(f"❌ Crypto news failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing crypto news: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Cryptocurrency Features Test Complete!")

if __name__ == "__main__":
    test_crypto_endpoints()
