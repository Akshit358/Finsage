#!/usr/bin/env python3
"""
Simple FinSage Backend Server
Compatible with older MacBook systems
"""

import json
import random
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import urllib.request
import urllib.error

# Cache for cryptocurrency data (simple in-memory cache)
crypto_cache = {
    'data': None,
    'timestamp': 0,
    'news': None,
    'news_timestamp': 0
}

def fetch_crypto_data():
    """Fetch cryptocurrency data from CoinGecko API (free, no API key required)"""
    try:
        # Use CoinGecko free API
        url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana,polkadot,chainlink,avalanche-2,polygon,stellar&vs_currencies=usd&include_24hr_change=true&include_market_cap=true"
        
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
            
            # Transform data to our format
            crypto_data = []
            for coin_id, info in data.items():
                crypto_data.append({
                    'id': coin_id,
                    'name': coin_id.replace('-', ' ').title(),
                    'symbol': coin_id.upper()[:3],
                    'price': info['usd'],
                    'change_24h': info.get('usd_24h_change', 0),
                    'market_cap': info.get('usd_market_cap', 0)
                })
            
            return crypto_data
    except Exception as e:
        print(f"Error fetching crypto data: {e}")
        # Return mock data if API fails
        return [
            {
                'id': 'bitcoin',
                'name': 'Bitcoin',
                'symbol': 'BTC',
                'price': 45000 + random.randint(-5000, 5000),
                'change_24h': round(random.uniform(-10, 10), 2),
                'market_cap': 850000000000
            },
            {
                'id': 'ethereum',
                'name': 'Ethereum',
                'symbol': 'ETH',
                'price': 3000 + random.randint(-500, 500),
                'change_24h': round(random.uniform(-8, 8), 2),
                'market_cap': 360000000000
            },
            {
                'id': 'binancecoin',
                'name': 'Binance Coin',
                'symbol': 'BNB',
                'price': 300 + random.randint(-50, 50),
                'change_24h': round(random.uniform(-5, 5), 2),
                'market_cap': 45000000000
            }
        ]

def fetch_crypto_news():
    """Fetch cryptocurrency news (mock data for simplicity)"""
    news_items = [
        {
            'id': 1,
            'title': 'Bitcoin Reaches New All-Time High Amid Institutional Adoption',
            'summary': 'Major corporations continue to add Bitcoin to their balance sheets, driving price momentum.',
            'source': 'CryptoNews',
            'published_at': int(time.time()) - 3600,
            'category': 'Bitcoin',
            'sentiment': 'positive'
        },
        {
            'id': 2,
            'title': 'Ethereum 2.0 Upgrade Shows Promising Results',
            'summary': 'The latest Ethereum network upgrade demonstrates improved scalability and reduced energy consumption.',
            'source': 'Ethereum Weekly',
            'published_at': int(time.time()) - 7200,
            'category': 'Ethereum',
            'sentiment': 'positive'
        },
        {
            'id': 3,
            'title': 'Regulatory Clarity Boosts DeFi Sector Confidence',
            'summary': 'New regulatory guidelines provide clearer framework for decentralized finance protocols.',
            'source': 'DeFi Times',
            'published_at': int(time.time()) - 10800,
            'category': 'DeFi',
            'sentiment': 'neutral'
        },
        {
            'id': 4,
            'title': 'Major Bank Announces Cryptocurrency Trading Services',
            'summary': 'Traditional financial institution enters the crypto space with new trading platform.',
            'source': 'Finance Today',
            'published_at': int(time.time()) - 14400,
            'category': 'Adoption',
            'sentiment': 'positive'
        },
        {
            'id': 5,
            'title': 'NFT Market Shows Signs of Recovery',
            'summary': 'After a period of decline, NFT trading volumes are showing steady growth.',
            'source': 'NFT Insider',
            'published_at': int(time.time()) - 18000,
            'category': 'NFTs',
            'sentiment': 'neutral'
        }
    ]
    return news_items

def get_cached_crypto_data():
    """Get cached crypto data or fetch new data if cache is expired"""
    current_time = time.time()
    
    # Cache for 5 minutes
    if crypto_cache['data'] is None or (current_time - crypto_cache['timestamp']) > 300:
        crypto_cache['data'] = fetch_crypto_data()
        crypto_cache['timestamp'] = current_time
    
    return crypto_cache['data']

def get_cached_crypto_news():
    """Get cached crypto news or fetch new data if cache is expired"""
    current_time = time.time()
    
    # Cache for 10 minutes
    if crypto_cache['news'] is None or (current_time - crypto_cache['news_timestamp']) > 600:
        crypto_cache['news'] = fetch_crypto_news()
        crypto_cache['news_timestamp'] = current_time
    
    return crypto_cache['news']

class FinSageHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # CORS headers
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        if path == '/api/v1/status/health':
            response = {
                "status": "healthy",
                "service": "FinSage API",
                "version": "1.0.0",
                "timestamp": int(time.time())
            }
        elif path == '/api/v1/blockchain/status':
            response = {
                "connected": True,
                "network": "Ethereum Mainnet",
                "latest_block": random.randint(18000000, 19000000),
                "gas_price": random.randint(20, 50)
            }
        elif path.startswith('/api/v1/portfolio/'):
            user_id = path.split('/')[-1]
            response = {
                "user_id": user_id,
                "total_value": random.randint(50000, 500000),
                "total_return": round(random.uniform(-15, 25), 2),
                "assets": [
                    {
                        "name": "Apple Inc.",
                        "symbol": "AAPL",
                        "value": random.randint(10000, 50000),
                        "return_percentage": round(random.uniform(-10, 20), 2),
                        "quantity": random.randint(50, 200)
                    },
                    {
                        "name": "Tesla Inc.",
                        "symbol": "TSLA",
                        "value": random.randint(15000, 75000),
                        "return_percentage": round(random.uniform(-20, 30), 2),
                        "quantity": random.randint(20, 100)
                    },
                    {
                        "name": "Microsoft Corp.",
                        "symbol": "MSFT",
                        "value": random.randint(20000, 100000),
                        "return_percentage": round(random.uniform(-5, 15), 2),
                        "quantity": random.randint(100, 500)
                    }
                ]
            }
        elif path.startswith('/api/v1/blockchain/balance/'):
            wallet_address = path.split('/')[-1]
            response = {
                "wallet_address": wallet_address,
                "eth_balance": round(random.uniform(0.5, 10.0), 4),
                "usd_value": round(random.uniform(1000, 20000), 2)
            }
        elif path == '/api/v1/crypto/prices':
            # Get live cryptocurrency prices
            crypto_data = get_cached_crypto_data()
            response = {
                "cryptocurrencies": crypto_data,
                "last_updated": int(time.time()),
                "count": len(crypto_data)
            }
        elif path == '/api/v1/crypto/news':
            # Get cryptocurrency news
            news_data = get_cached_crypto_news()
            response = {
                "news": news_data,
                "last_updated": int(time.time()),
                "count": len(news_data)
            }
        elif path == '/api/v1/crypto/ethereum':
            # Get specific Ethereum data
            crypto_data = get_cached_crypto_data()
            ethereum_data = next((coin for coin in crypto_data if coin['id'] == 'ethereum'), None)
            if ethereum_data:
                response = {
                    "ethereum": ethereum_data,
                    "last_updated": int(time.time())
                }
            else:
                response = {
                    "error": "Ethereum data not found"
                }
        elif path == '/api/v1/education/topics':
            # Get educational topics
            response = {
                "topics": [
                    {
                        "id": "beginner-basics",
                        "title": "Investment Basics",
                        "description": "Learn the fundamentals of investing",
                        "level": "beginner",
                        "duration": "15 min",
                        "lessons": 5
                    },
                    {
                        "id": "crypto-fundamentals",
                        "title": "Cryptocurrency Fundamentals",
                        "description": "Understanding digital currencies and blockchain",
                        "level": "beginner",
                        "duration": "20 min",
                        "lessons": 6
                    },
                    {
                        "id": "portfolio-management",
                        "title": "Portfolio Management",
                        "description": "How to build and manage a diversified portfolio",
                        "level": "intermediate",
                        "duration": "25 min",
                        "lessons": 8
                    },
                    {
                        "id": "risk-management",
                        "title": "Risk Management",
                        "description": "Protecting your investments from market volatility",
                        "level": "intermediate",
                        "duration": "18 min",
                        "lessons": 6
                    },
                    {
                        "id": "technical-analysis",
                        "title": "Technical Analysis",
                        "description": "Reading charts and market indicators",
                        "level": "advanced",
                        "duration": "30 min",
                        "lessons": 10
                    }
                ]
            }
        elif path == '/api/v1/education/glossary':
            # Get financial glossary
            response = {
                "terms": [
                    {"term": "Asset Allocation", "definition": "The process of dividing investments among different asset categories like stocks, bonds, and cash."},
                    {"term": "Diversification", "definition": "Spreading investments across different assets to reduce risk."},
                    {"term": "ROI", "definition": "Return on Investment - a measure of investment profitability."},
                    {"term": "Volatility", "definition": "The degree of variation in trading prices over time."},
                    {"term": "Market Cap", "definition": "Total value of all shares of a company or cryptocurrency."},
                    {"term": "Liquidity", "definition": "How easily an asset can be bought or sold without affecting its price."},
                    {"term": "Bull Market", "definition": "A market condition where prices are rising or expected to rise."},
                    {"term": "Bear Market", "definition": "A market condition where prices are falling or expected to fall."},
                    {"term": "Compound Interest", "definition": "Interest calculated on the initial principal and accumulated interest."},
                    {"term": "Risk Tolerance", "definition": "An investor's ability to handle potential losses in their portfolio."}
                ]
            }
        elif path == '/api/v1/goals/user123':
            # Get user financial goals
            response = {
                "goals": [
                    {
                        "id": 1,
                        "title": "Emergency Fund",
                        "target_amount": 10000,
                        "current_amount": 3500,
                        "target_date": "2024-12-31",
                        "priority": "high",
                        "status": "in_progress"
                    },
                    {
                        "id": 2,
                        "title": "Retirement Fund",
                        "target_amount": 500000,
                        "current_amount": 125000,
                        "target_date": "2045-12-31",
                        "priority": "high",
                        "status": "in_progress"
                    },
                    {
                        "id": 3,
                        "title": "House Down Payment",
                        "target_amount": 50000,
                        "current_amount": 15000,
                        "target_date": "2025-06-30",
                        "priority": "medium",
                        "status": "in_progress"
                    }
                ]
            }
        elif path == '/api/v1/analytics/portfolio':
            # Get advanced portfolio analytics
            response = {
                "analytics": {
                    "sharpe_ratio": 1.25,
                    "beta": 0.85,
                    "alpha": 0.12,
                    "volatility": 15.2,
                    "max_drawdown": -8.5,
                    "correlation_matrix": {
                        "stocks_bonds": 0.15,
                        "stocks_crypto": 0.45,
                        "bonds_crypto": 0.08
                    },
                    "sector_allocation": {
                        "Technology": 35,
                        "Healthcare": 20,
                        "Finance": 15,
                        "Energy": 10,
                        "Consumer": 20
                    },
                    "risk_metrics": {
                        "var_95": -2.5,
                        "expected_shortfall": -3.8,
                        "sortino_ratio": 1.45
                    }
                }
            }
        elif path == '/api/v1/alerts/user123':
            # Get user alerts
            response = {
                "alerts": [
                    {
                        "id": 1,
                        "type": "price_alert",
                        "title": "Bitcoin Price Alert",
                        "message": "Bitcoin has reached $65,000!",
                        "priority": "high",
                        "timestamp": int(time.time()) - 3600,
                        "read": False
                    },
                    {
                        "id": 2,
                        "type": "portfolio_alert",
                        "title": "Portfolio Rebalancing",
                        "message": "Your portfolio allocation has drifted. Consider rebalancing.",
                        "priority": "medium",
                        "timestamp": int(time.time()) - 7200,
                        "read": False
                    },
                    {
                        "id": 3,
                        "type": "market_alert",
                        "title": "Market Volatility",
                        "message": "High volatility detected in crypto markets.",
                        "priority": "low",
                        "timestamp": int(time.time()) - 10800,
                        "read": True
                    }
                ]
            }
        else:
            response = {
                "message": "FinSage API is running",
                "version": "1.0.0",
                "status": "running",
                "endpoints": {
                    "health": "/api/v1/status/health",
                    "predictions": "/api/v1/prediction/predict",
                    "portfolio": "/api/v1/portfolio/{user_id}",
                    "blockchain": "/api/v1/blockchain/status"
                }
            }
        
        self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # CORS headers
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        if path == '/api/v1/prediction/predict':
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                # Generate AI prediction based on input
                age = data.get('age', 30)
                income = data.get('annual_income', 75000)
                risk_tolerance = data.get('risk_tolerance', 'medium')
                horizon = data.get('investment_horizon_years', 10)
                
                # Simple AI logic based on inputs
                base_confidence = 75
                if age < 30:
                    base_confidence += 10
                elif age > 50:
                    base_confidence -= 5
                
                if income > 100000:
                    base_confidence += 5
                elif income < 50000:
                    base_confidence -= 5
                
                if risk_tolerance == 'high':
                    base_confidence += 5
                elif risk_tolerance == 'low':
                    base_confidence -= 10
                
                if horizon > 15:
                    base_confidence += 10
                elif horizon < 5:
                    base_confidence -= 5
                
                confidence_score = max(60, min(95, base_confidence + random.randint(-5, 5)))
                
                # Generate expected return based on risk tolerance
                if risk_tolerance == 'high':
                    expected_return = round(random.uniform(8, 15), 2)
                elif risk_tolerance == 'medium':
                    expected_return = round(random.uniform(5, 10), 2)
                else:
                    expected_return = round(random.uniform(2, 6), 2)
                
                # Generate asset allocations
                total_investment = income * 0.2  # Assume 20% of income for investment
                asset_allocations = []
                
                if risk_tolerance == 'high':
                    asset_allocations = [
                        {"asset_type": "Stocks", "percentage": 70, "amount": total_investment * 0.7},
                        {"asset_type": "Crypto", "percentage": 20, "amount": total_investment * 0.2},
                        {"asset_type": "Bonds", "percentage": 10, "amount": total_investment * 0.1}
                    ]
                elif risk_tolerance == 'medium':
                    asset_allocations = [
                        {"asset_type": "Stocks", "percentage": 50, "amount": total_investment * 0.5},
                        {"asset_type": "Bonds", "percentage": 30, "amount": total_investment * 0.3},
                        {"asset_type": "REITs", "percentage": 20, "amount": total_investment * 0.2}
                    ]
                else:
                    asset_allocations = [
                        {"asset_type": "Bonds", "percentage": 60, "amount": total_investment * 0.6},
                        {"asset_type": "Stocks", "percentage": 30, "amount": total_investment * 0.3},
                        {"asset_type": "Cash", "percentage": 10, "amount": total_investment * 0.1}
                    ]
                
                response = {
                    "confidence_score": confidence_score,
                    "expected_return": expected_return,
                    "risk_level": risk_tolerance.title(),
                    "asset_allocations": asset_allocations,
                    "recommendation": f"Based on your {risk_tolerance} risk tolerance and {horizon}-year horizon, we recommend a diversified portfolio with {expected_return}% expected annual return.",
                    "timestamp": int(time.time())
                }
                
            except Exception as e:
                response = {
                    "error": "Invalid request data",
                    "message": str(e)
                }
        else:
            response = {
                "error": "Endpoint not found",
                "message": f"POST {path} not implemented"
            }
        
        self.wfile.write(json.dumps(response).encode())
    
    def do_OPTIONS(self):
        """Handle preflight OPTIONS requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    """Start the simple HTTP server"""
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, FinSageHandler)
    print("🚀 FinSage Simple Backend Server starting...")
    print("📡 Server running on http://localhost:8000")
    print("🔗 Available endpoints:")
    print("   GET  /api/v1/status/health")
    print("   GET  /api/v1/blockchain/status")
    print("   GET  /api/v1/portfolio/{user_id}")
    print("   GET  /api/v1/blockchain/balance/{wallet_address}")
    print("   GET  /api/v1/crypto/prices")
    print("   GET  /api/v1/crypto/news")
    print("   GET  /api/v1/crypto/ethereum")
    print("   GET  /api/v1/education/topics")
    print("   GET  /api/v1/education/glossary")
    print("   GET  /api/v1/goals/{user_id}")
    print("   GET  /api/v1/analytics/portfolio")
    print("   GET  /api/v1/alerts/{user_id}")
    print("   POST /api/v1/prediction/predict")
    print("🛑 Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()
