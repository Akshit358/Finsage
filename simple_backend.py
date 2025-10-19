#!/usr/bin/env python3
"""
Simple FinSage Backend Server
Compatible with older MacBook systems
"""

import json
import random
import time
from http.server import HTTPServer, BaseHTTPRequestHandler

# Helper functions for enhanced AI predictions
def get_investment_explanation(asset_type, age, risk_tolerance):
    explanations = {
        'Government Bonds': f"Government bonds provide stable, guaranteed returns perfect for {age}-year-olds seeking capital preservation. They're backed by the full faith and credit of the government, making them the safest investment option.",
        'Corporate Bonds': f"Corporate bonds offer higher yields than government bonds while maintaining relatively low risk. For someone your age, they provide steady income with moderate risk exposure.",
        'Blue Chip Stocks': f"Blue chip stocks represent established, financially sound companies with a history of reliable performance. They're ideal for {risk_tolerance} investors seeking long-term growth with lower volatility.",
        'Growth Stocks': f"Growth stocks focus on companies with above-average growth potential. Perfect for younger investors like you who can weather short-term volatility for long-term gains.",
        'Technology Stocks': f"Tech stocks offer high growth potential in the digital economy. They're volatile but can provide exceptional returns for investors with a {risk_tolerance} risk profile.",
        'S&P 500 Index Fund': f"An S&P 500 index fund gives you instant diversification across 500 of America's largest companies. It's the foundation of most successful long-term investment strategies.",
        'Total Bond Market': f"Total bond market funds provide broad exposure to the entire bond market, offering stability and income generation for balanced portfolios.",
        'International Stocks': f"International stocks provide geographic diversification and access to global growth opportunities, reducing your portfolio's dependence on the US market.",
        'REITs': f"Real Estate Investment Trusts (REITs) give you exposure to real estate without owning property directly. They provide regular income and inflation protection.",
        'Commodities': f"Commodities like gold and oil provide inflation hedge and portfolio diversification. They often move independently of stock markets.",
        'Cryptocurrency': f"Crypto offers high growth potential but with significant volatility. Only suitable for {risk_tolerance} investors who can handle extreme price swings.",
        'Small Cap Stocks': f"Small cap stocks represent smaller companies with high growth potential. They're riskier but can provide exceptional returns for long-term investors.",
        'High-Yield Savings': f"High-yield savings accounts provide liquidity and safety for your emergency fund and short-term goals. They offer FDIC insurance up to $250,000.",
        'Cash/CDs': f"Cash and CDs provide maximum safety and liquidity. Essential for emergency funds and short-term financial goals."
    }
    return explanations.get(asset_type, f"{asset_type} provides diversification and growth potential for your investment portfolio.")

def get_investment_benefits(asset_type):
    benefits_map = {
        'Government Bonds': ['Guaranteed principal repayment', 'Regular interest payments', 'Tax advantages', 'Liquidity'],
        'Corporate Bonds': ['Higher yields than government bonds', 'Regular income', 'Lower risk than stocks', 'Diversification'],
        'Blue Chip Stocks': ['Dividend income', 'Long-term growth potential', 'Lower volatility', 'Liquidity'],
        'Growth Stocks': ['High growth potential', 'Capital appreciation', 'Innovation exposure', 'Long-term wealth building'],
        'Technology Stocks': ['Sector growth exposure', 'Innovation leadership', 'High return potential', 'Future-focused'],
        'S&P 500 Index Fund': ['Instant diversification', 'Low fees', 'Market performance', 'Professional management'],
        'Total Bond Market': ['Broad bond exposure', 'Income generation', 'Risk reduction', 'Professional management'],
        'International Stocks': ['Geographic diversification', 'Currency exposure', 'Global growth', 'Risk reduction'],
        'REITs': ['Real estate exposure', 'Regular dividends', 'Inflation hedge', 'Professional management'],
        'Commodities': ['Inflation protection', 'Portfolio diversification', 'Store of value', 'Global demand'],
        'Cryptocurrency': ['High growth potential', 'Decentralized', '24/7 trading', 'Innovation exposure'],
        'Small Cap Stocks': ['High growth potential', 'Undervalued opportunities', 'Market inefficiencies', 'Long-term gains'],
        'High-Yield Savings': ['FDIC insurance', 'Liquidity', 'No risk', 'Easy access'],
        'Cash/CDs': ['Maximum safety', 'Guaranteed returns', 'Liquidity', 'No risk']
    }
    return benefits_map.get(asset_type, ['Diversification', 'Growth potential', 'Professional management'])

def get_investment_risks(asset_type):
    risks_map = {
        'Government Bonds': ['Interest rate risk', 'Inflation risk', 'Lower returns', 'Opportunity cost'],
        'Corporate Bonds': ['Credit risk', 'Interest rate risk', 'Liquidity risk', 'Default risk'],
        'Blue Chip Stocks': ['Market volatility', 'Company-specific risk', 'Economic downturns', 'Dividend cuts'],
        'Growth Stocks': ['High volatility', 'Valuation risk', 'Market timing', 'Sector concentration'],
        'Technology Stocks': ['Extreme volatility', 'Regulatory risk', 'Competition', 'Valuation bubbles'],
        'S&P 500 Index Fund': ['Market risk', 'No downside protection', 'Index concentration', 'Tracking error'],
        'Total Bond Market': ['Interest rate risk', 'Credit risk', 'Inflation risk', 'Liquidity risk'],
        'International Stocks': ['Currency risk', 'Political risk', 'Regulatory differences', 'Liquidity issues'],
        'REITs': ['Interest rate sensitivity', 'Real estate cycles', 'Liquidity risk', 'Management risk'],
        'Commodities': ['High volatility', 'Storage costs', 'No income generation', 'Speculation risk'],
        'Cryptocurrency': ['Extreme volatility', 'Regulatory uncertainty', 'Technology risk', 'No intrinsic value'],
        'Small Cap Stocks': ['High volatility', 'Liquidity risk', 'Information asymmetry', 'Higher failure rates'],
        'High-Yield Savings': ['Low returns', 'Inflation erosion', 'Opportunity cost', 'Rate changes'],
        'Cash/CDs': ['Inflation risk', 'Low returns', 'Opportunity cost', 'Rate changes']
    }
    return risks_map.get(asset_type, ['Market risk', 'Volatility', 'Economic factors'])

def get_age_specific_advice(age_bracket, age):
    advice_map = {
        'young_professional': {
            'title': f'Young Professional (Age {age}) - Build Your Foundation',
            'description': f'At {age}, you have the most valuable asset: time. Your investments have decades to compound, making this the perfect time to take calculated risks and build wealth.',
            'tips': [
                'Start investing early - even small amounts compound significantly over time',
                'Take advantage of employer 401(k) matching - it\'s free money',
                'Consider a Roth IRA for tax-free growth over 30+ years',
                'Don\'t be afraid of market volatility - you have time to recover',
                'Focus on growth investments like index funds and growth stocks',
                'Build an emergency fund of 3-6 months expenses',
                'Consider real estate investment for diversification'
            ]
        },
        'early_career': {
            'title': f'Early Career (Age {age}) - Accelerate Growth',
            'description': f'You\'re in your prime earning years with {65-age} years until retirement. This is the time to maximize your investment contributions and take advantage of compound growth.',
            'tips': [
                'Maximize your 401(k) contributions - aim for 15-20% of income',
                'Consider a Health Savings Account (HSA) for triple tax benefits',
                'Diversify with international investments for global exposure',
                'Consider real estate investment through REITs or direct ownership',
                'Review and rebalance your portfolio annually',
                'Increase emergency fund to 6 months of expenses',
                'Consider starting a side business for additional income streams'
            ]
        },
        'mid_career': {
            'title': f'Mid-Career (Age {age}) - Balance Growth and Stability',
            'description': f'You\'re in your peak earning years with {65-age} years until retirement. Balance aggressive growth with some stability as you approach your financial goals.',
            'tips': [
                'Consider catch-up contributions to retirement accounts',
                'Diversify with bonds and stable investments (20-30%)',
                'Review your asset allocation - consider target-date funds',
                'Maximize tax-advantaged accounts (401k, IRA, HSA)',
                'Consider college savings plans if you have children',
                'Evaluate life insurance needs for family protection',
                'Start thinking about estate planning and wills'
            ]
        },
        'pre_retirement': {
            'title': f'Pre-Retirement (Age {age}) - Preserve and Prepare',
            'description': f'You\'re {65-age} years from retirement. Focus on capital preservation while maintaining some growth to outpace inflation.',
            'tips': [
                'Increase bond allocation to 40-50% for stability',
                'Consider annuities for guaranteed income streams',
                'Maximize catch-up contributions ($7,500 for 401k, $1,000 for IRA)',
                'Review and update your retirement budget',
                'Consider downsizing or relocating for lower costs',
                'Evaluate long-term care insurance options',
                'Create a detailed retirement income plan'
            ]
        },
        'retirement': {
            'title': f'Retirement (Age {age}) - Income and Preservation',
            'description': f'You\'re in retirement. Focus on generating reliable income while preserving capital for your remaining years.',
            'tips': [
                'Maintain 50-60% in bonds and stable investments',
                'Consider dividend-paying stocks for regular income',
                'Use the 4% rule for safe withdrawal rates',
                'Keep 2-3 years of expenses in cash/CDs',
                'Consider immediate annuities for guaranteed income',
                'Review and adjust your portfolio annually',
                'Consider charitable giving strategies for tax benefits'
            ]
        }
    }
    return advice_map.get(age_bracket, advice_map['mid_career'])

def get_action_plan(age_bracket, financial_goals, debt_ratio, emergency_fund_needed):
    base_plan = [
        {
            'title': 'Emergency Fund Assessment',
            'description': f'Evaluate your current emergency fund. You need ${emergency_fund_needed:,.0f} (6 months of expenses) for financial security.',
            'priority': 'high'
        },
        {
            'title': 'Debt Management Review',
            'description': f'Your debt-to-income ratio is {debt_ratio:.1f}%. Keep it under 36% for optimal financial health.',
            'priority': 'high' if debt_ratio > 36 else 'medium'
        },
        {
            'title': 'Retirement Account Optimization',
            'description': 'Maximize your 401(k) contributions, especially if your employer offers matching.',
            'priority': 'high'
        },
        {
            'title': 'Investment Account Setup',
            'description': 'Open a brokerage account or IRA for additional investment opportunities.',
            'priority': 'medium'
        },
        {
            'title': 'Portfolio Rebalancing',
            'description': 'Review and rebalance your portfolio to maintain your target asset allocation.',
            'priority': 'medium'
        }
    ]
    
    if financial_goals == 'house':
        base_plan.append({
            'title': 'Home Buying Preparation',
            'description': 'Research mortgage options, improve credit score, and save for down payment.',
            'priority': 'high'
        })
    elif financial_goals == 'education':
        base_plan.append({
            'title': 'Education Fund Setup',
            'description': 'Open a 529 plan or Education Savings Account for tax-advantaged education savings.',
            'priority': 'high'
        })
    elif financial_goals == 'debt_payoff':
        base_plan.append({
            'title': 'Debt Payoff Strategy',
            'description': 'Create a debt snowball or avalanche plan to eliminate high-interest debt quickly.',
            'priority': 'high'
        })
    
    return base_plan
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
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
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
                
                # Enhanced AI prediction with comprehensive analysis
                age = data.get('age', 30)
                income = data.get('annual_income', 75000)
                risk_tolerance = data.get('risk_tolerance', 'moderate')
                horizon = data.get('investment_horizon_years', 10)
                financial_goals = data.get('financial_goals', 'retirement')
                dependents = data.get('dependents', 0)
                debt_amount = data.get('debt_amount', 0)
                monthly_expenses = data.get('monthly_expenses', 3000)
                
                # Calculate financial health metrics
                debt_ratio = (debt_amount / income * 100) if income > 0 else 0
                emergency_fund_needed = monthly_expenses * 6
                recommended_monthly_investment = max(income * 0.15 / 12, 500)
                
                # Age-based strategy
                age_bracket = 'young_professional' if age < 30 else 'early_career' if age < 40 else 'mid_career' if age < 50 else 'pre_retirement' if age < 60 else 'retirement'
                
                # Risk-adjusted returns and allocations
                if risk_tolerance == 'conservative':
                    base_return = 4.5
                    confidence = 90
                    allocations = [
                        {'asset_type': 'Government Bonds', 'percentage': 40, 'amount': income * 0.2 * 0.4},
                        {'asset_type': 'Corporate Bonds', 'percentage': 25, 'amount': income * 0.2 * 0.25},
                        {'asset_type': 'Blue Chip Stocks', 'percentage': 20, 'amount': income * 0.2 * 0.2},
                        {'asset_type': 'High-Yield Savings', 'percentage': 10, 'amount': income * 0.2 * 0.1},
                        {'asset_type': 'REITs', 'percentage': 5, 'amount': income * 0.2 * 0.05}
                    ]
                elif risk_tolerance == 'aggressive':
                    base_return = 11.5
                    confidence = 75
                    allocations = [
                        {'asset_type': 'Growth Stocks', 'percentage': 45, 'amount': income * 0.2 * 0.45},
                        {'asset_type': 'Technology Stocks', 'percentage': 25, 'amount': income * 0.2 * 0.25},
                        {'asset_type': 'Cryptocurrency', 'percentage': 15, 'amount': income * 0.2 * 0.15},
                        {'asset_type': 'International Stocks', 'percentage': 10, 'amount': income * 0.2 * 0.1},
                        {'asset_type': 'Small Cap Stocks', 'percentage': 5, 'amount': income * 0.2 * 0.05}
                    ]
                else:  # moderate
                    base_return = 7.8
                    confidence = 85
                    allocations = [
                        {'asset_type': 'S&P 500 Index Fund', 'percentage': 35, 'amount': income * 0.2 * 0.35},
                        {'asset_type': 'Total Bond Market', 'percentage': 25, 'amount': income * 0.2 * 0.25},
                        {'asset_type': 'International Stocks', 'percentage': 20, 'amount': income * 0.2 * 0.2},
                        {'asset_type': 'REITs', 'percentage': 10, 'amount': income * 0.2 * 0.1},
                        {'asset_type': 'Commodities', 'percentage': 5, 'amount': income * 0.2 * 0.05},
                        {'asset_type': 'Cash/CDs', 'percentage': 5, 'amount': income * 0.2 * 0.05}
                    ]
                
                # Create comprehensive investment categories with explanations
                investment_categories = []
                for allocation in allocations:
                    category = {
                        'name': allocation['asset_type'],
                        'allocation': allocation['percentage'],
                        'amount': allocation['amount'],
                        'explanation': get_investment_explanation(allocation['asset_type'], age, risk_tolerance),
                        'benefits': get_investment_benefits(allocation['asset_type']),
                        'risks': get_investment_risks(allocation['asset_type'])
                    }
                    investment_categories.append(category)
                
                # Age-specific advice
                age_advice = get_age_specific_advice(age_bracket, age)
                
                # Financial health assessment
                emergency_fund_status = "Excellent" if emergency_fund_needed <= 10000 else "Good" if emergency_fund_needed <= 25000 else "Needs Improvement"
                emergency_fund_advice = f"You should have ${emergency_fund_needed:,.0f} in emergency savings (6 months of expenses)."
                
                debt_advice = "Excellent debt management!" if debt_ratio < 20 else "Good debt level" if debt_ratio < 36 else "Consider debt reduction before investing heavily."
                
                investment_advice = f"Based on your income, aim to invest ${recommended_monthly_investment:,.0f} monthly for optimal growth."
                
                # 30-day action plan
                action_plan = get_action_plan(age_bracket, financial_goals, debt_ratio, emergency_fund_needed)
                
                response = {
                    "expected_return": round(base_return, 1),
                    "confidence_score": confidence,
                    "risk_level": risk_tolerance.title(),
                    "investment_categories": investment_categories,
                    "age_advice": age_advice,
                    "emergency_fund_status": emergency_fund_status,
                    "emergency_fund_advice": emergency_fund_advice,
                    "debt_ratio": round(debt_ratio, 1),
                    "debt_advice": debt_advice,
                    "recommended_monthly_investment": recommended_monthly_investment,
                    "investment_advice": investment_advice,
                    "action_plan": action_plan,
                    "recommendation": f"Personalized {risk_tolerance} strategy optimized for your {age_bracket.replace('_', ' ')} profile with {len(allocations)} diversified investment categories.",
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
    import os
    
    # Get port from environment variable (for AWS deployment)
    port = int(os.environ.get('PORT', 8000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    server_address = (host, port)
    httpd = HTTPServer(server_address, FinSageHandler)
    print("🚀 FinSage Simple Backend Server starting...")
    print(f"📡 Server running on http://{host}:{port}")
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
