# 🚀 FinSage - AI-Powered Financial Intelligence Platform

## MacBook Setup Guide

This guide is specifically optimized for older MacBook systems and provides a simple, reliable setup process.

## ✨ Features

- **🧠 AI-Powered Predictions**: Get personalized investment recommendations
- **💼 Portfolio Management**: Track and manage your investment portfolio  
- **⛓️ Blockchain Integration**: Check wallet balances and blockchain status
- **🎨 Modern UI**: Beautiful, responsive interface with animations
- **📱 Mobile-Friendly**: Works perfectly on all devices

## 🛠️ Prerequisites

### Required Software
- **Python 3**: For the backend server
- **Node.js**: For the frontend React application
- **curl**: For testing (usually pre-installed on macOS)

### Check Your System
```bash
# Check Python 3
python3 --version

# Check Node.js  
node --version

# Check npm
npm --version
```

## 🚀 Quick Start

### Option 1: One-Command Startup (Recommended)
```bash
cd /Users/AkshitTribbiani/Documents/--CODING/Finsage
./start_finsage.sh
```

This will:
- Start the backend server on port 8000
- Start the frontend server on port 3000
- Open your browser to http://localhost:3000

### Option 2: Manual Startup

#### Start Backend
```bash
cd /Users/AkshitTribbiani/Documents/--CODING/Finsage
python3 simple_backend.py
```

#### Start Frontend (in a new terminal)
```bash
cd /Users/AkshitTribbiani/Documents/--CODING/Finsage/frontend/finsage-ui
npm start
```

## 🧪 Testing

### Run Comprehensive Tests
```bash
cd /Users/AkshitTribbiani/Documents/--CODING/Finsage
python3 test_finsage.py
```

### Test Individual Endpoints
```bash
# Health Check
curl http://localhost:8000/api/v1/status/health

# AI Prediction
curl -X POST http://localhost:8000/api/v1/prediction/predict \
  -H "Content-Type: application/json" \
  -d '{"age": 30, "annual_income": 75000, "risk_tolerance": "medium", "investment_horizon_years": 10}'

# Portfolio Data
curl http://localhost:8000/api/v1/portfolio/user123

# Blockchain Status
curl http://localhost:8000/api/v1/blockchain/status
```

## 🎯 How to Use

### 1. AI Predictions
- Navigate to the "AI Predictions" tab
- Fill in your investment profile:
  - Age
  - Annual Income
  - Risk Tolerance (Low/Medium/High)
  - Investment Horizon (years)
- Click "Get AI Prediction"
- View personalized recommendations with confidence scores

### 2. Portfolio Management
- Navigate to the "Portfolio" tab
- View your current portfolio value and returns
- See individual asset holdings with performance metrics
- Refresh data to get latest information

### 3. Blockchain Integration
- Navigate to the "Blockchain" tab
- Check blockchain connection status
- Enter a wallet address to check balance
- View ETH balance and USD value

## 🔧 Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:8000/api/v1/status/health

# If not running, start it manually
python3 simple_backend.py
```

### Frontend Issues
```bash
# Check if frontend is running
curl http://localhost:3000

# If not running, start it manually
cd frontend/finsage-ui
npm start
```

### Port Conflicts
If ports 3000 or 8000 are in use:
```bash
# Find what's using the ports
lsof -i :3000
lsof -i :8000

# Kill the processes if needed
kill -9 <PID>
```

### Python Issues
```bash
# If you get "command not found" for python3
which python3

# If python3 is not found, install it
brew install python3
```

### Node.js Issues
```bash
# If npm commands fail
npm cache clean --force
rm -rf node_modules
npm install
```

## 📁 Project Structure

```
FinSage/
├── simple_backend.py          # Simple backend server
├── test_finsage.py           # Comprehensive test suite
├── start_finsage.sh          # One-command startup script
├── README_MACBOOK.md         # This file
└── frontend/
    └── finsage-ui/
        ├── src/
        │   ├── App.js        # Main React component
        │   ├── App.css       # Modern styling
        │   └── index.css     # Base styles
        ├── package.json      # Dependencies
        └── public/           # Static assets
```

## 🎨 UI Features

### Modern Design Elements
- **Glassmorphism**: Frosted glass effect cards
- **Gradient Backgrounds**: Dynamic animated gradients
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Works on all screen sizes
- **Dark Theme**: Professional dark interface

### Interactive Components
- **Animated Progress Rings**: Circular progress indicators
- **Risk Assessment Meters**: Visual risk level displays
- **Trend Indicators**: Up/down arrows with colors
- **Real-time Notifications**: Toast messages for feedback
- **Hover Effects**: Cards lift and glow on interaction

## 🔒 Security Notes

- The backend server runs on localhost only
- No external network access required
- All data is generated locally (no real financial data)
- CORS is enabled for development only

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/status/health` | Health check |
| GET | `/api/v1/blockchain/status` | Blockchain status |
| GET | `/api/v1/portfolio/{user_id}` | Portfolio data |
| GET | `/api/v1/blockchain/balance/{address}` | Wallet balance |
| POST | `/api/v1/prediction/predict` | AI prediction |

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:3000
- ✅ All API endpoints responding
- ✅ Beautiful, animated UI
- ✅ AI predictions working
- ✅ Portfolio data displaying
- ✅ Blockchain integration active

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Run the test suite: `python3 test_finsage.py`
3. Check the terminal output for error messages
4. Ensure all prerequisites are installed

---

**FinSage** - Making financial intelligence accessible and beautiful! 🚀
