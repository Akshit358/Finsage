import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [predictionData, setPredictionData] = useState({
    age: 30,
    annual_income: 75000,
    risk_tolerance: 'medium',
    investment_horizon_years: 10
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('0x742d35Cc6634C0532925a3b8D0C9e8b4e8b4e8b4');

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/portfolio/user123`);
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  // Fetch blockchain status
  const fetchBlockchainStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/blockchain/status`);
      setBlockchainStatus(response.data);
    } catch (error) {
      console.error('Error fetching blockchain status:', error);
    }
  };

  // Get AI prediction
  const getPrediction = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/prediction/predict`, predictionData);
      setPredictionResult(response.data);
    } catch (error) {
      console.error('Error getting prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get wallet balance
  const getWalletBalance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/blockchain/balance/${walletAddress}`);
      setBlockchainStatus(prev => ({ ...prev, balance: response.data }));
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchBlockchainStatus();
  }, []);

  const TabButton = ({ id, label, icon }) => (
    <button
      className={`tab-button ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      <span className="tab-icon">{icon}</span>
      {label}
    </button>
  );

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>FinSage Dashboard</h1>
        <p>AI-Powered Financial Intelligence Platform</p>
      </div>
      
      <div className="stats-grid">
        <StatCard
          title="Portfolio Value"
          value={portfolio?.total_value ? `$${portfolio.total_value.toLocaleString()}` : 'Loading...'}
          subtitle="Total Investment"
          icon="💰"
          color="green"
        />
        <StatCard
          title="AI Confidence"
          value={predictionResult?.confidence_score ? `${Math.round(predictionResult.confidence_score)}%` : 'N/A'}
          subtitle="Prediction Accuracy"
          icon="🤖"
          color="blue"
        />
        <StatCard
          title="Blockchain Status"
          value={blockchainStatus?.connected ? 'Connected' : 'Disconnected'}
          subtitle="Web3 Integration"
          icon="⛓️"
          color="purple"
        />
        <StatCard
          title="Risk Level"
          value={predictionData.risk_tolerance.toUpperCase()}
          subtitle="Current Profile"
          icon="📊"
          color="orange"
        />
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn primary" onClick={getPrediction}>
            <span className="btn-icon">🔮</span>
            Get AI Prediction
          </button>
          <button className="action-btn secondary" onClick={fetchPortfolio}>
            <span className="btn-icon">📈</span>
            Refresh Portfolio
          </button>
          <button className="action-btn secondary" onClick={getWalletBalance}>
            <span className="btn-icon">💳</span>
            Check Wallet
          </button>
        </div>
      </div>
    </div>
  );

  const Predictions = () => (
    <div className="predictions">
      <div className="section-header">
        <h1>AI Investment Predictions</h1>
        <p>Get personalized investment recommendations based on your profile</p>
      </div>

      <div className="prediction-form">
        <h2>Your Investment Profile</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={predictionData.age}
              onChange={(e) => setPredictionData({...predictionData, age: parseInt(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Annual Income ($)</label>
            <input
              type="number"
              value={predictionData.annual_income}
              onChange={(e) => setPredictionData({...predictionData, annual_income: parseInt(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>Risk Tolerance</label>
            <select
              value={predictionData.risk_tolerance}
              onChange={(e) => setPredictionData({...predictionData, risk_tolerance: e.target.value})}
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
          <div className="form-group">
            <label>Investment Horizon (years)</label>
            <input
              type="number"
              value={predictionData.investment_horizon_years}
              onChange={(e) => setPredictionData({...predictionData, investment_horizon_years: parseInt(e.target.value)})}
            />
          </div>
        </div>
        
        <button className="predict-btn" onClick={getPrediction} disabled={loading}>
          {loading ? 'Analyzing...' : 'Get AI Prediction'}
        </button>
      </div>

      {predictionResult && (
        <div className="prediction-result">
          <h2>AI Recommendation</h2>
          <div className="recommendation-card">
            <div className="confidence-score">
              <span className="score-label">Confidence Score</span>
              <span className="score-value">{Math.round(predictionResult.confidence_score)}%</span>
            </div>
            <div className="expected-return">
              <span className="return-label">Expected Return</span>
              <span className="return-value">{predictionResult.expected_return}%</span>
            </div>
            <div className="risk-assessment">
              <span className="risk-label">Risk Assessment</span>
              <span className="risk-value">{predictionResult.risk_level}</span>
            </div>
          </div>
          
          <div className="asset-allocation">
            <h3>Recommended Asset Allocation</h3>
            <div className="allocation-grid">
              {predictionResult.asset_allocations?.map((asset, index) => (
                <div key={index} className="allocation-item">
                  <div className="asset-name">{asset.asset_type}</div>
                  <div className="asset-percentage">{asset.percentage}%</div>
                  <div className="asset-amount">${asset.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Portfolio = () => (
    <div className="portfolio">
      <div className="section-header">
        <h1>Portfolio Management</h1>
        <p>Track and manage your investment portfolio</p>
      </div>

      {portfolio ? (
        <div className="portfolio-content">
          <div className="portfolio-summary">
            <div className="summary-card">
              <h3>Portfolio Summary</h3>
              <div className="summary-stats">
                <div className="summary-item">
                  <span className="label">Total Value</span>
                  <span className="value">${portfolio.total_value?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Return</span>
                  <span className="value">{portfolio.total_return || 'N/A'}%</span>
                </div>
                <div className="summary-item">
                  <span className="label">Number of Assets</span>
                  <span className="value">{portfolio.assets?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="assets-list">
            <h3>Your Assets</h3>
            {portfolio.assets?.map((asset, index) => (
              <div key={index} className="asset-card">
                <div className="asset-info">
                  <div className="asset-name">{asset.name}</div>
                  <div className="asset-symbol">{asset.symbol}</div>
                </div>
                <div className="asset-metrics">
                  <div className="metric">
                    <span className="metric-label">Value</span>
                    <span className="metric-value">${asset.value?.toLocaleString()}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Return</span>
                    <span className="metric-value">{asset.return_percentage}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Quantity</span>
                    <span className="metric-value">{asset.quantity}</span>
                  </div>
                </div>
              </div>
            )) || <p>No assets found</p>}
          </div>
        </div>
      ) : (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading portfolio...</p>
        </div>
      )}
    </div>
  );

  const Blockchain = () => (
    <div className="blockchain">
      <div className="section-header">
        <h1>Blockchain Integration</h1>
        <p>Web3 and smart contract interactions</p>
      </div>

      <div className="blockchain-content">
        <div className="status-section">
          <h2>Network Status</h2>
          <div className="status-card">
            <div className="status-item">
              <span className="status-label">Connection Status</span>
              <span className={`status-value ${blockchainStatus?.connected ? 'connected' : 'disconnected'}`}>
                {blockchainStatus?.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Network</span>
              <span className="status-value">{blockchainStatus?.network || 'N/A'}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Latest Block</span>
              <span className="status-value">{blockchainStatus?.latest_block || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="wallet-section">
          <h2>Wallet Balance</h2>
          <div className="wallet-form">
            <input
              type="text"
              placeholder="Enter wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="wallet-input"
            />
            <button className="check-balance-btn" onClick={getWalletBalance} disabled={loading}>
              {loading ? 'Checking...' : 'Check Balance'}
            </button>
          </div>
          
          {blockchainStatus?.balance && (
            <div className="balance-card">
              <h3>Wallet Balance</h3>
              <div className="balance-info">
                <div className="balance-item">
                  <span className="balance-label">ETH</span>
                  <span className="balance-value">{blockchainStatus.balance.eth_balance}</span>
                </div>
                <div className="balance-item">
                  <span className="balance-label">USD Value</span>
                  <span className="balance-value">${blockchainStatus.balance.usd_value}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">
          <span className="logo-icon">🧠</span>
          <span className="logo-text">FinSage</span>
        </div>
        <nav className="nav">
          <TabButton id="dashboard" label="Dashboard" icon="📊" />
          <TabButton id="predictions" label="AI Predictions" icon="🤖" />
          <TabButton id="portfolio" label="Portfolio" icon="💼" />
          <TabButton id="blockchain" label="Blockchain" icon="⛓️" />
        </nav>
      </div>

      <div className="main-content">
        <div className="content-area">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'predictions' && <Predictions />}
          {activeTab === 'portfolio' && <Portfolio />}
          {activeTab === 'blockchain' && <Blockchain />}
        </div>
      </div>
    </div>
  );
}

export default App;