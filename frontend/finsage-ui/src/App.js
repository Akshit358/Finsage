import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Login from './components/Login';
import PortfolioManager from './components/PortfolioManager';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [currentView, setCurrentView] = useState('dashboard');
  const [historicalData, setHistoricalData] = useState([]);
  const [realtimeData, setRealtimeData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [symbol, setSymbol] = useState('AAPL');
  const [assetType, setAssetType] = useState('stock');

  const handleLogin = (newToken) => {
    setToken(newToken);
    setUsername(localStorage.getItem('username'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setCurrentView('dashboard');
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/market/historical?days=${days}&symbol=${symbol}&asset_type=${assetType}`
      );
      setHistoricalData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  // Fetch real-time data
  const fetchRealtimeData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/market/realtime?symbol=${symbol}&asset_type=${assetType}`
      );
      setRealtimeData(response.data);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  // Fetch portfolio data (public endpoint for demo)
  const fetchPortfolioData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/market/portfolio`);
      setPortfolioData(response.data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchHistoricalData(),
        fetchRealtimeData(),
        fetchPortfolioData()
      ]);
      setLoading(false);
    };
    loadData();
  }, [days, symbol, assetType]);

  // Set up real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealtimeData();
      if (!token) {
        fetchPortfolioData();
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [symbol, assetType, token]);

  // If not logged in, show login page
  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading && currentView === 'dashboard') {
    return (
      <div className="App">
        <div className="loading">Loading FinSage Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div>
            <h1>📊 FinSage - Financial Intelligence Dashboard</h1>
            <p className="subtitle">AI-Powered Market Analytics & Portfolio Management</p>
          </div>
          <div className="user-info">
            <span>Welcome, {username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
        <nav className="main-nav">
          <button
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
            📈 Dashboard
          </button>
          <button
            className={currentView === 'portfolio' ? 'active' : ''}
            onClick={() => setCurrentView('portfolio')}
          >
            💼 My Portfolio
          </button>
        </nav>
      </header>

      {currentView === 'dashboard' ? (
        <div className="dashboard">
          {/* Symbol Selector */}
          <div className="card symbol-selector-card">
            <h2>Select Symbol</h2>
            <div className="symbol-controls">
              <input
                type="text"
                placeholder="Enter symbol (e.g., AAPL, BTC)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="symbol-input"
              />
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                className="asset-type-select"
              >
                <option value="stock">Stock</option>
                <option value="crypto">Crypto</option>
              </select>
              <button onClick={fetchHistoricalData} className="fetch-btn">
                Fetch Data
              </button>
            </div>
          </div>

          {/* Real-time Price Display */}
          {realtimeData && (
            <div className="card realtime-card">
              <h2>Real-Time Market Data - {symbol}</h2>
              <div className="realtime-info">
                <div className="price-display">
                  <span className="price">${realtimeData.price.toFixed(2)}</span>
                  <span className={`change ${realtimeData.change >= 0 ? 'positive' : 'negative'}`}>
                    {realtimeData.change >= 0 ? '↑' : '↓'} ${Math.abs(realtimeData.change).toFixed(2)} 
                    ({Math.abs(realtimeData.changePercent).toFixed(2)}%)
                  </span>
                </div>
                <div className="realtime-details">
                  <div>Volume: {realtimeData.volume.toLocaleString()}</div>
                  <div>Last Updated: {new Date(realtimeData.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* Historical Price Chart */}
          <div className="card chart-card">
            <div className="chart-header">
              <h2>Historical Price Trend - {symbol}</h2>
              <div className="time-selector">
                <button 
                  className={days === 7 ? 'active' : ''} 
                  onClick={() => setDays(7)}
                >
                  7D
                </button>
                <button 
                  className={days === 30 ? 'active' : ''} 
                  onClick={() => setDays(30)}
                >
                  30D
                </button>
                <button 
                  className={days === 90 ? 'active' : ''} 
                  onClick={() => setDays(90)}
                >
                  90D
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  name="Price"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* OHLC Chart */}
          <div className="card chart-card">
            <h2>Price Range (High/Low) - {symbol}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="high" fill="#82ca9d" name="High" />
                <Bar dataKey="low" fill="#ffc658" name="Low" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Volume Chart */}
          <div className="card chart-card">
            <h2>Trading Volume - {symbol}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="volume" fill="#8884d8" name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sample Portfolio Overview (if not logged in portfolio) */}
          {portfolioData && (
            <div className="card portfolio-card">
              <h2>Sample Portfolio Overview</h2>
              <div className="portfolio-summary">
                <div className="summary-item">
                  <span className="label">Total Value:</span>
                  <span className="value">${portfolioData.totalValue.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Change:</span>
                  <span className={`value ${portfolioData.totalChange >= 0 ? 'positive' : 'negative'}`}>
                    ${portfolioData.totalChange.toFixed(2)} ({portfolioData.totalChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="portfolio-table">
                <table>
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Price</th>
                      <th>Change</th>
                      <th>Shares</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData.portfolio.map((stock, index) => (
                      <tr key={index}>
                        <td><strong>{stock.symbol}</strong></td>
                        <td>${stock.price.toFixed(2)}</td>
                        <td className={stock.change >= 0 ? 'positive' : 'negative'}>
                          {stock.change >= 0 ? '↑' : '↓'} ${Math.abs(stock.change).toFixed(2)} 
                          ({Math.abs(stock.changePercent).toFixed(2)}%)
                        </td>
                        <td>{stock.shares}</td>
                        <td>${stock.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Line Chart for Price Movement */}
          <div className="card chart-card">
            <h2>Price Movement (Line Chart) - {symbol}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Price"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="open" 
                  stroke="#82ca9d" 
                  strokeWidth={1}
                  name="Open"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#ffc658" 
                  strokeWidth={1}
                  name="Close"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <PortfolioManager token={token} />
      )}
    </div>
  );
}

export default App;