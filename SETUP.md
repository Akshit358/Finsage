# FinSage Setup Guide

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment:**
   ```bash
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate  # On Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file (optional):**
   ```bash
   # Copy the example and edit as needed
   # For real market data, get a free API key from https://www.alphavantage.co/support/#api-key
   ```

5. **Initialize database:**
   The database will be automatically created on first run.

6. **Start the server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/finsage-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## 📋 Features Implemented

### ✅ Complete Features

1. **User Authentication**
   - User registration
   - User login with JWT tokens
   - Protected routes
   - Session management

2. **Database & Persistence**
   - SQLite database (can be upgraded to PostgreSQL)
   - User management
   - Portfolio storage
   - Transaction history

3. **Market Data Integration**
   - Real-time stock quotes (Yahoo Finance - free)
   - Real-time crypto quotes (CoinGecko - free)
   - Alpha Vantage integration (optional API key)
   - Historical data fetching
   - Fallback to simulated data if APIs unavailable

4. **Portfolio Management**
   - Create multiple portfolios
   - Add/remove holdings
   - Real-time price updates
   - Gain/loss calculations
   - Transaction tracking

5. **Dashboard**
   - Live charts with real-time updates
   - Multiple chart types (Area, Bar, Line)
   - Symbol search and selection
   - Stock and crypto support
   - Time period selection (7D, 30D, 90D)

6. **API Endpoints**
   - `/auth/register` - User registration
   - `/auth/login` - User login
   - `/auth/me` - Get current user
   - `/portfolio` - Portfolio CRUD operations
   - `/market/*` - Market data endpoints

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
APP_NAME=FinSage
DEBUG=True
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./finsage.db
ALPHA_VANTAGE_API_KEY=your_api_key_here  # Optional
```

### API Keys (Optional)

- **Alpha Vantage**: Get free API key from https://www.alphavantage.co/support/#api-key
  - Enables real stock market data
  - Free tier: 5 API calls per minute, 500 per day

- **CoinGecko**: No API key required for basic usage
  - Free crypto data
  - Rate limit: 10-50 calls/minute

## 📊 Database Schema

- **users**: User accounts and authentication
- **portfolios**: User portfolio containers
- **portfolio_holdings**: Individual holdings in portfolios
- **transactions**: Transaction history

## 🎯 Usage

1. **First Time Setup:**
   - Start backend server
   - Start frontend server
   - Register a new account
   - Create your first portfolio

2. **Using the Dashboard:**
   - Enter a stock symbol (e.g., AAPL, TSLA) or crypto (e.g., BTC, ETH)
   - Select asset type (Stock or Crypto)
   - View real-time prices and charts
   - Switch between 7D, 30D, 90D views

3. **Managing Portfolio:**
   - Click "My Portfolio" tab
   - Create a new portfolio
   - Add holdings with symbol, quantity, and price
   - View real-time portfolio value and gains/losses
   - Refresh prices manually or wait for auto-updates

## 🔒 Security Notes

- Change `SECRET_KEY` in production
- Use environment variables for sensitive data
- Consider using PostgreSQL for production
- Implement rate limiting for production
- Use HTTPS in production

## 🐛 Troubleshooting

1. **Database errors:**
   - Delete `finsage.db` and restart server (will recreate)
   - Check database permissions

2. **API errors:**
   - Check internet connection
   - Verify API keys if using Alpha Vantage
   - System will fallback to simulated data

3. **Import errors:**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt` again

## 📝 Notes

- The system works without API keys (uses free APIs and fallback data)
- Real market data requires internet connection
- Database is SQLite by default (easy to upgrade to PostgreSQL)
- All existing functionality is preserved and enhanced
