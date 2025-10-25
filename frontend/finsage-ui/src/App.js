import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Brain, 
  Link, 
  BarChart3, 
  Wallet, 
  RefreshCw, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Activity,
  DollarSign,
  Target,
  Zap,
  Shield,
  Clock,
  Coins,
  Newspaper,
  TrendingUp as CryptoUp,
  TrendingDown as CryptoDown,
  BookOpen,
  BarChart,
  Bell,
  AlertTriangle,
  TrendingUp as AnalyticsUp,
  TrendingDown as AnalyticsDown,
  Activity as AnalyticsActivity
} from 'lucide-react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://54.227.68.44:8000';

// Component definitions
const Education = ({ educationTopics, glossary }) => (
  <motion.div 
    className="education"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div 
      className="section-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h1>Financial Education Center</h1>
      <p>Learn the fundamentals of investing and financial planning</p>
    </motion.div>

    {/* Learning Topics */}
    {educationTopics && (
      <motion.div 
        className="topics-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h2>Learning Topics</h2>
        <div className="topics-grid">
          {educationTopics.topics.map((topic, index) => (
            <motion.div 
              key={topic.id}
              className="topic-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <div className="topic-header">
                <div className="topic-level">
                  <span className={`level-badge ${topic.level}`}>{topic.level}</span>
                </div>
                <div className="topic-duration">
                  <Clock size={14} />
                  <span>{topic.duration}</span>
                </div>
              </div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <div className="topic-footer">
                <div className="lessons-count">
                  <BookOpen size={14} />
                  <span>{topic.lessons} lessons</span>
                </div>
                <motion.button 
                  className="start-learning-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Learning
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}

    {/* Financial Glossary */}
    {glossary && (
      <motion.div 
        className="glossary-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h2>Financial Glossary</h2>
        <div className="glossary-grid">
          {glossary.terms.map((term, index) => (
            <motion.div 
              key={term.term}
              className="glossary-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <h4>{term.term}</h4>
              <p>{term.definition}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}
  </motion.div>
);

const Goals = ({ goals }) => (
  <motion.div 
    className="goals"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div 
      className="section-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h1>Financial Goals</h1>
      <p>Track your progress towards achieving your financial objectives</p>
    </motion.div>

    {goals && (
      <motion.div 
        className="goals-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="goals-grid">
          {goals.goals.map((goal, index) => {
            const progress = (goal.current_amount / goal.target_amount) * 100;
            const daysLeft = Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <motion.div 
                key={goal.id}
                className="goal-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="goal-header">
                  <h3>{goal.title}</h3>
                  <span className={`priority-badge ${goal.priority}`}>{goal.priority}</span>
                </div>
                
                <div className="goal-progress">
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                    />
                  </div>
                  <div className="progress-text">
                    <span>{progress.toFixed(1)}% Complete</span>
                    <span>{daysLeft} days left</span>
                  </div>
                </div>

                <div className="goal-amounts">
                  <div className="current-amount">
                    <span className="label">Current</span>
                    <span className="value">${goal.current_amount.toLocaleString()}</span>
                  </div>
                  <div className="target-amount">
                    <span className="label">Target</span>
                    <span className="value">${goal.target_amount.toLocaleString()}</span>
                  </div>
                  <div className="remaining-amount">
                    <span className="label">Remaining</span>
                    <span className="value">${(goal.target_amount - goal.current_amount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="goal-actions">
                  <motion.button 
                    className="add-money-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Money
                  </motion.button>
                  <motion.button 
                    className="edit-goal-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit Goal
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    )}
  </motion.div>
);

const Analytics = ({ analytics }) => (
  <motion.div 
    className="analytics"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div 
      className="section-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h1>Advanced Analytics</h1>
      <p>Deep insights into your portfolio performance and risk metrics</p>
    </motion.div>

    {analytics && (
      <motion.div 
        className="analytics-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Risk Metrics */}
        <div className="risk-metrics-section">
          <h2>Risk Metrics</h2>
          <div className="metrics-grid">
            <motion.div 
              className="metric-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="metric-header">
                <h3>Sharpe Ratio</h3>
                <TrendingUp size={20} className="positive" />
              </div>
              <div className="metric-value">{analytics.analytics.sharpe_ratio}</div>
              <div className="metric-description">Risk-adjusted return measure</div>
            </motion.div>

            <motion.div 
              className="metric-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="metric-header">
                <h3>Beta</h3>
                <TrendingDown size={20} className="negative" />
              </div>
              <div className="metric-value">{analytics.analytics.beta}</div>
              <div className="metric-description">Market volatility sensitivity</div>
            </motion.div>

            <motion.div 
              className="metric-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="metric-header">
                <h3>Alpha</h3>
                <TrendingUp size={20} className="positive" />
              </div>
              <div className="metric-value">{analytics.analytics.alpha}</div>
              <div className="metric-description">Excess return over benchmark</div>
            </motion.div>

            <motion.div 
              className="metric-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="metric-header">
                <h3>Volatility</h3>
                <Activity size={20} />
              </div>
              <div className="metric-value">{analytics.analytics.volatility}%</div>
              <div className="metric-description">Portfolio price volatility</div>
            </motion.div>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="sector-allocation-section">
          <h2>Sector Allocation</h2>
          <div className="sector-chart">
            {Object.entries(analytics.analytics.sector_allocation).map(([sector, percentage], index) => (
              <motion.div 
                key={sector}
                className="sector-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                <div className="sector-info">
                  <span className="sector-name">{sector}</span>
                  <span className="sector-percentage">{percentage}%</span>
                </div>
                <div className="sector-bar">
                  <motion.div 
                    className="sector-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    )}
  </motion.div>
);

const Alerts = ({ alerts }) => (
  <motion.div 
    className="alerts"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div 
      className="section-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h1>Smart Alerts</h1>
      <p>Stay informed about important market changes and portfolio updates</p>
    </motion.div>

    {alerts && (
      <motion.div 
        className="alerts-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="alerts-grid">
          {alerts.alerts.map((alert, index) => (
            <motion.div 
              key={alert.id}
              className={`alert-card ${alert.priority} ${alert.read ? 'read' : 'unread'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="alert-header">
                <div className="alert-icon">
                  {alert.type === 'price_alert' && <TrendingUp size={20} />}
                  {alert.type === 'portfolio_alert' && <BarChart3 size={20} />}
                  {alert.type === 'market_alert' && <AlertTriangle size={20} />}
                </div>
                <div className="alert-priority">
                  <span className={`priority-badge ${alert.priority}`}>{alert.priority}</span>
                </div>
              </div>
              
              <div className="alert-content">
                <h3>{alert.title}</h3>
                <p>{alert.message}</p>
              </div>

              <div className="alert-footer">
                <div className="alert-time">
                  <Clock size={14} />
                  <span>{new Date(alert.timestamp * 1000).toLocaleString()}</span>
                </div>
                <div className="alert-actions">
                  {!alert.read && (
                    <motion.button 
                      className="mark-read-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Mark as Read
                    </motion.button>
                  )}
                  <motion.button 
                    className="dismiss-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dismiss
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}
  </motion.div>
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [predictionData, setPredictionData] = useState({
    age: 30,
    annual_income: 75000,
    risk_tolerance: 'medium',
    investment_horizon_years: 10,
    financial_goals: 'retirement',
    dependents: 0,
    debt_amount: 0,
    monthly_expenses: 3000,
    emergency_fund: 0
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('0x742d35Cc6634C0532925a3b8D0C9e8b4e8b4e8b4');
  const [notifications, setNotifications] = useState([]);
  const [cryptoData, setCryptoData] = useState(null);
  const [cryptoNews, setCryptoNews] = useState(null);
  const [ethereumData, setEthereumData] = useState(null);
  const [educationTopics, setEducationTopics] = useState(null);
  const [glossary, setGlossary] = useState(null);
  const [goals, setGoals] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState(null);

  // Notification system
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Fetch portfolio data
  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching portfolio data...');
      const response = await axios.get(`${API_BASE_URL}/api/v1/portfolio/user123`);
      console.log('Portfolio response:', response.data);
      setPortfolio(response.data);
      addNotification('Portfolio data refreshed successfully!', 'success');
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      addNotification('Failed to fetch portfolio data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch blockchain status
  const fetchBlockchainStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/blockchain/status`);
      setBlockchainStatus(response.data);
      addNotification('Blockchain status updated', 'success');
    } catch (error) {
      console.error('Error fetching blockchain status:', error);
      addNotification('Failed to connect to blockchain', 'error');
    }
  }, []);

  // Get AI prediction
  const getPrediction = async () => {
    setLoading(true);
    try {
      console.log('Sending prediction request with data:', predictionData);
      console.log('API URL:', `${API_BASE_URL}/api/v1/prediction/predict`);
      
      const response = await axios.post(`${API_BASE_URL}/api/v1/prediction/predict`, predictionData);
      console.log('Prediction response status:', response.status);
      console.log('Prediction response data:', response.data);
      
      if (response.data && response.data.prediction) {
        setPredictionResult(response.data);
        addNotification('AI prediction generated successfully!', 'success');
      } else {
        console.error('Invalid prediction response:', response.data);
        addNotification('Invalid prediction response from server', 'error');
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
      console.error('Error response:', error.response);
      console.error('Error details:', error.response?.data);
      addNotification(`Failed to generate AI prediction: ${error.message}`, 'error');
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
      addNotification('Wallet balance updated', 'success');
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      addNotification('Failed to fetch wallet balance', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cryptocurrency prices
  const fetchCryptoData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/crypto/prices`);
      setCryptoData(response.data);
      addNotification('Cryptocurrency data updated', 'success');
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      addNotification('Failed to fetch cryptocurrency data', 'error');
    }
  }, []);

  // Fetch cryptocurrency news
  const fetchCryptoNews = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/crypto/news`);
      setCryptoNews(response.data);
      addNotification('Crypto news updated', 'success');
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      addNotification('Failed to fetch crypto news', 'error');
    }
  }, []);

  // Fetch Ethereum specific data
  const fetchEthereumData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/crypto/ethereum`);
      setEthereumData(response.data);
    } catch (error) {
      console.error('Error fetching Ethereum data:', error);
    }
  }, []);

  // Fetch education topics
  const fetchEducationTopics = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/education/topics`);
      setEducationTopics(response.data);
    } catch (error) {
      console.error('Error fetching education topics:', error);
    }
  }, []);

  // Fetch glossary
  const fetchGlossary = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/education/glossary`);
      setGlossary(response.data);
    } catch (error) {
      console.error('Error fetching glossary:', error);
    }
  }, []);

  // Fetch goals
  const fetchGoals = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/goals/user123`);
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  }, []);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/analytics/portfolio`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, []);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/alerts/user123`);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  }, []);

  useEffect(() => {
    console.log('App mounted, fetching initial data...');
    console.log('API_BASE_URL:', API_BASE_URL);
    
    // Test API connection first
    fetch(`${API_BASE_URL}/api/v1/portfolio/user123`)
      .then(response => {
        console.log('API test response status:', response.status);
        if (response.ok) {
          console.log('API connection successful, fetching data...');
          fetchPortfolio();
          fetchBlockchainStatus();
          fetchCryptoData();
          fetchCryptoNews();
          fetchEthereumData();
          fetchEducationTopics();
          fetchGlossary();
          fetchGoals();
          fetchAnalytics();
          fetchAlerts();
        } else {
          console.error('API test failed with status:', response.status);
          addNotification('Failed to connect to backend API', 'error');
        }
      })
      .catch(error => {
        console.error('API test failed:', error);
        addNotification('Failed to connect to backend API', 'error');
      });
  }, []); // Remove dependencies to avoid infinite loops

  const TabButton = ({ id, label, icon: Icon }) => (
    <motion.button
      className={`tab-button ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.span 
        className="tab-icon"
        animate={{ rotate: activeTab === id ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Icon size={20} />
      </motion.span>
      {label}
    </motion.button>
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) => (
    <motion.div 
      className={`stat-card ${color}`}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="stat-icon"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon size={48} />
      </motion.div>
      <div className="stat-content">
        <h3>{title}</h3>
        <motion.div 
          className="stat-value"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          {value}
        </motion.div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        {trend && trendValue && (
          <motion.div 
            className={`trend-indicator ${trend}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trendValue}%</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  // Progress Ring Component
  const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, color = 'var(--primary-gradient)' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="progress-ring-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="progress-ring">
          <circle
            className="progress-ring-background"
            stroke="rgba(255, 255, 255, 0.1)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <motion.circle
            className="progress-ring-progress"
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <div className="progress-ring-text">
          <span className="progress-percentage">{percentage}%</span>
      </div>
    </div>
  );
  };

  // Animated Counter Component
  const AnimatedCounter = ({ value, duration = 2, prefix = '', suffix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setDisplayValue(Math.floor(progress * value));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [value, duration]);

    return (
      <span>
        {prefix}{displayValue.toLocaleString()}{suffix}
      </span>
    );
  };

  const Dashboard = () => (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          FinSage Dashboard
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          AI-Powered Financial Intelligence Platform
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <StatCard
          title="Portfolio Value"
          value={portfolio?.totalValue ? <AnimatedCounter value={portfolio.totalValue} prefix="$" /> : 'Loading...'}
          subtitle="Total Investment"
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue="12.5"
        />
        <StatCard
          title="AI Confidence"
          value={predictionResult?.confidence_score ? `${Math.round(predictionResult.confidence_score)}%` : 'N/A'}
          subtitle="Prediction Accuracy"
          icon={Brain}
          color="blue"
          trend="up"
          trendValue="8.3"
        />
        <StatCard
          title="Blockchain Status"
          value={blockchainStatus?.connected ? 'Connected' : 'Disconnected'}
          subtitle="Web3 Integration"
          icon={Link}
          color="purple"
        />
        <StatCard
          title="Risk Level"
          value={predictionData.risk_tolerance.toUpperCase()}
          subtitle="Current Profile"
          icon={Shield}
          color="orange"
        />
      </motion.div>

      {/* Modern Widgets Section */}
      <motion.div 
        className="widgets-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2>Performance Metrics</h2>
        <div className="widgets-grid">
          <motion.div 
            className="widget-card"
            whileHover={{ scale: 1.02, y: -4 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="widget-header">
              <h3>Portfolio Performance</h3>
              <Activity size={24} />
      </div>
            <div className="progress-container">
              <ProgressRing 
                percentage={portfolio?.totalGainPercent || 0} 
                size={100} 
                color="url(#success-gradient)"
              />
              <div className="progress-info">
                <span className="progress-label">Total Return</span>
                <span className="progress-value">{portfolio?.totalGainPercent || 0}%</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="widget-card"
            whileHover={{ scale: 1.02, y: -4 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="widget-header">
              <h3>Risk Assessment</h3>
              <Target size={24} />
            </div>
            <div className="risk-meters">
              <div className="risk-meter">
                <span className="risk-label">Market Risk</span>
                <div className="risk-bar">
                  <motion.div 
                    className="risk-fill low"
                    initial={{ width: 0 }}
                    animate={{ width: '30%' }}
                    transition={{ delay: 0.8, duration: 1 }}
                  />
                </div>
                <span className="risk-value">30%</span>
              </div>
              <div className="risk-meter">
                <span className="risk-label">Volatility</span>
                <div className="risk-bar">
                  <motion.div 
                    className="risk-fill medium"
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ delay: 0.9, duration: 1 }}
                  />
                </div>
                <span className="risk-value">60%</span>
              </div>
              <div className="risk-meter">
                <span className="risk-label">Liquidity</span>
                <div className="risk-bar">
                  <motion.div 
                    className="risk-fill high"
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ delay: 1.0, duration: 1 }}
                  />
                </div>
                <span className="risk-value">85%</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="widget-card"
            whileHover={{ scale: 1.02, y: -4 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="widget-header">
              <h3>AI Insights</h3>
              <Zap size={24} />
            </div>
            <div className="insights-list">
              <div className="insight-item">
                <Clock size={16} />
                <span>Market sentiment is bullish</span>
              </div>
              <div className="insight-item">
                <TrendingUp size={16} />
                <span>Tech stocks showing strong momentum</span>
              </div>
              <div className="insight-item">
                <Shield size={16} />
                <span>Diversification level optimal</span>
              </div>
            </div>
          </motion.div>
      </div>
      </motion.div>

      <motion.div 
        className="quick-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <motion.button 
            className="action-btn primary" 
            onClick={getPrediction}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <motion.span 
              className="btn-icon"
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
            >
              {loading ? <Loader2 size={20} /> : <Sparkles size={20} />}
            </motion.span>
            {loading ? 'Analyzing...' : 'Get AI Prediction'}
          </motion.button>
          <motion.button 
            className="action-btn secondary" 
            onClick={fetchPortfolio}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <motion.span 
              className="btn-icon"
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
            >
              <RefreshCw size={20} />
            </motion.span>
            Refresh Portfolio
          </motion.button>
          <motion.button 
            className="action-btn secondary" 
            onClick={getWalletBalance}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <motion.span 
              className="btn-icon"
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
            >
              <Wallet size={20} />
            </motion.span>
            Check Wallet
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  const Predictions = () => {
    const getAgeBracket = (age) => {
      if (age < 30) return 'young_professional';
      if (age < 40) return 'early_career';
      if (age < 50) return 'mid_career';
      if (age < 60) return 'pre_retirement';
      return 'retirement';
    };

    const getInvestmentStrategy = (profile) => {
      const ageBracket = getAgeBracket(profile.age);
      const riskScore = profile.risk_tolerance === 'low' ? 1 : profile.risk_tolerance === 'medium' ? 2 : 3;
      const incomeLevel = profile.annual_income < 50000 ? 'low' : profile.annual_income < 100000 ? 'medium' : 'high';
      
      return {
        ageBracket,
        riskScore,
        incomeLevel,
        emergencyFundNeeded: profile.monthly_expenses * 6,
        maxDebtToIncome: profile.annual_income * 0.36,
        recommendedMonthlyInvestment: Math.max(profile.annual_income * 0.15 / 12, 500)
      };
    };

    return (
    <div className="predictions">
      <div className="section-header">
          <h1>🧠 AI Investment Intelligence</h1>
          <p>Get personalized, age-appropriate investment strategies with detailed explanations</p>
      </div>

      <div className="prediction-form">
          <h2>📊 Your Financial Profile</h2>
        <div className="form-grid">
          <div className="form-group">
              <label>👤 Age</label>
            <input
              type="number"
              value={predictionData.age}
              onChange={(e) => setPredictionData({...predictionData, age: parseInt(e.target.value)})}
                min="18"
                max="80"
            />
              <small>Your age determines your investment timeline and risk capacity</small>
          </div>
          <div className="form-group">
              <label>💰 Annual Income ($)</label>
            <input
              type="number"
              value={predictionData.annual_income}
              onChange={(e) => setPredictionData({...predictionData, annual_income: parseInt(e.target.value)})}
                min="20000"
            />
              <small>Helps determine how much you can invest monthly</small>
          </div>
          <div className="form-group">
              <label>🎯 Financial Goals</label>
              <select
                value={predictionData.financial_goals}
                onChange={(e) => setPredictionData({...predictionData, financial_goals: e.target.value})}
              >
                <option value="retirement">Retirement Planning</option>
                <option value="house">Buy a House</option>
                <option value="education">Education Fund</option>
                <option value="emergency">Emergency Fund</option>
                <option value="wealth_building">Wealth Building</option>
                <option value="debt_payoff">Debt Payoff</option>
              </select>
            </div>
            <div className="form-group">
              <label>⚖️ Risk Tolerance</label>
            <select
              value={predictionData.risk_tolerance}
              onChange={(e) => setPredictionData({...predictionData, risk_tolerance: e.target.value})}
            >
                <option value="conservative">Conservative (Preserve Capital)</option>
                <option value="moderate">Moderate (Balanced Growth)</option>
                <option value="aggressive">Aggressive (Maximum Growth)</option>
            </select>
          </div>
          <div className="form-group">
              <label>⏰ Investment Horizon (years)</label>
            <input
              type="number"
              value={predictionData.investment_horizon_years}
              onChange={(e) => setPredictionData({...predictionData, investment_horizon_years: parseInt(e.target.value)})}
                min="1"
                max="50"
              />
              <small>How long before you need this money?</small>
            </div>
            <div className="form-group">
              <label>👨‍👩‍👧‍👦 Dependents</label>
              <input
                type="number"
                value={predictionData.dependents}
                onChange={(e) => setPredictionData({...predictionData, dependents: parseInt(e.target.value)})}
                min="0"
                max="10"
              />
              <small>Number of people financially dependent on you</small>
            </div>
            <div className="form-group">
              <label>💳 Current Debt ($)</label>
              <input
                type="number"
                value={predictionData.debt_amount}
                onChange={(e) => setPredictionData({...predictionData, debt_amount: parseInt(e.target.value)})}
                min="0"
              />
              <small>Total outstanding debt (credit cards, loans, etc.)</small>
            </div>
            <div className="form-group">
              <label>🏠 Monthly Expenses ($)</label>
              <input
                type="number"
                value={predictionData.monthly_expenses}
                onChange={(e) => setPredictionData({...predictionData, monthly_expenses: parseInt(e.target.value)})}
                min="500"
              />
              <small>Your monthly living expenses</small>
          </div>
        </div>
        
        <button className="predict-btn" onClick={getPrediction} disabled={loading}>
            {loading ? '🤖 Analyzing Your Profile...' : '🚀 Get My Investment Strategy'}
        </button>
      </div>

      {predictionResult && (
        <div className="prediction-result">
            <div className="strategy-overview">
              <h2>🎯 Your Personalized Investment Strategy</h2>
              <div className="strategy-summary">
                <div className="summary-card">
                  <h3>📈 Expected Annual Return</h3>
                  <div className="return-value">{predictionResult.expected_return || 0}%</div>
                  <p>Based on your risk profile and market conditions</p>
            </div>
                <div className="summary-card">
                  <h3>🛡️ Risk Level</h3>
                  <div className="risk-value">{predictionResult.risk_level || 'Unknown'}</div>
                  <p>Optimized for your age and financial situation</p>
            </div>
                <div className="summary-card">
                  <h3>🎯 Confidence Score</h3>
                  <div className="confidence-value">{Math.round(predictionResult.confidence_score || 0)}%</div>
                  <p>How confident we are in this recommendation</p>
                </div>
            </div>
          </div>
          
            <div className="investment-categories">
              <h2>💼 Recommended Investment Categories</h2>
              <div className="categories-grid">
                {(predictionResult.investment_categories || []).map((category, index) => (
                  <div key={index} className="category-card">
                    <div className="category-header">
                      <h3>{category.name}</h3>
                      <div className="category-percentage">{category.allocation}%</div>
                </div>
                    <div className="category-amount">
                      ${(category.amount || 0).toLocaleString()}
                    </div>
                    <div className="category-explanation">
                      <h4>Why This Investment?</h4>
                      <p>{category.explanation}</p>
                    </div>
                    <div className="category-benefits">
                      <h4>Key Benefits:</h4>
                      <ul>
                        {(category.benefits || []).map((benefit, idx) => (
                          <li key={idx}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="category-risks">
                      <h4>Risks to Consider:</h4>
                      <ul>
                        {(category.risks || []).map((risk, idx) => (
                          <li key={idx}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="age-specific-advice">
              <h2>👥 Age-Specific Financial Advice</h2>
              <div className="advice-card">
                <h3>{predictionResult.age_advice?.title || 'Age-Specific Financial Advice'}</h3>
                <p>{predictionResult.age_advice?.description || 'Personalized advice based on your age and financial situation.'}</p>
                <div className="advice-tips">
                  <h4>💡 Key Tips for Your Age Group:</h4>
                  <ul>
                    {(predictionResult.age_advice?.tips || []).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="financial-health-check">
              <h2>🏥 Your Financial Health Check</h2>
              <div className="health-metrics">
                <div className="metric-card">
                  <h3>Emergency Fund Status</h3>
                  <div className="metric-value">
                    {predictionResult.emergency_fund_status || 'Unknown'}
                  </div>
                  <p>{predictionResult.emergency_fund_advice || 'Please complete your financial profile to get personalized advice.'}</p>
                </div>
                <div className="metric-card">
                  <h3>Debt-to-Income Ratio</h3>
                  <div className="metric-value">
                    {predictionResult.debt_ratio || 0}%
                  </div>
                  <p>{predictionResult.debt_advice || 'Please complete your financial profile to get personalized advice.'}</p>
                </div>
                <div className="metric-card">
                  <h3>Recommended Monthly Investment</h3>
                  <div className="metric-value">
                    ${(predictionResult.recommended_monthly_investment || 0).toLocaleString()}
                  </div>
                  <p>{predictionResult.investment_advice || 'Please complete your financial profile to get personalized advice.'}</p>
                </div>
              </div>
            </div>

            <div className="action-plan">
              <h2>📋 Your 30-Day Action Plan</h2>
              <div className="action-steps">
                {(predictionResult.action_plan || []).map((step, index) => (
                  <div key={index} className="action-step">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                      <div className="step-priority">
                        Priority: <span className={`priority ${step.priority}`}>{step.priority}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  };

  const Portfolio = () => (
    <div className="portfolio">
      <div className="section-header">
        <h1>Portfolio Management</h1>
        <p>Track and manage your investment portfolio</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading portfolio data...</p>
        </div>
      ) : portfolio ? (
        <div className="portfolio-content">
          <div className="portfolio-summary">
            <div className="summary-card">
              <h3>Portfolio Summary</h3>
              <div className="summary-stats">
                <div className="summary-item">
                  <span className="label">Total Value</span>
                  <span className="value">${portfolio.totalValue?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Return</span>
                  <span className="value">{portfolio.totalGainPercent || 'N/A'}%</span>
                </div>
                <div className="summary-item">
                  <span className="label">Number of Assets</span>
                  <span className="value">{portfolio.positions?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="assets-list">
            <h3>Your Assets</h3>
            {portfolio.positions?.map((asset, index) => (
              <div key={index} className="asset-card">
                <div className="asset-info">
                  <div className="asset-name">{asset.symbol}</div>
                  <div className="asset-symbol">{asset.symbol}</div>
                </div>
                <div className="asset-metrics">
                  <div className="metric">
                    <span className="metric-label">Shares</span>
                    <span className="metric-value">{asset.shares}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Current Price</span>
                    <span className="metric-value">${asset.currentPrice?.toLocaleString()}</span>
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
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p>Failed to load portfolio data</p>
          <button onClick={fetchPortfolio} className="retry-btn">
            Try Again
          </button>
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

  // Cryptocurrency Component
  const Cryptocurrency = () => (
    <motion.div 
      className="cryptocurrency"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1>Cryptocurrency Market</h1>
        <p>Live cryptocurrency prices and market news</p>
      </motion.div>

      {/* Ethereum Spotlight */}
      {ethereumData && (
        <motion.div 
          className="ethereum-spotlight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="spotlight-header">
            <h2>Ethereum (ETH) Spotlight</h2>
            <motion.button 
              className="refresh-btn"
              onClick={fetchEthereumData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={16} />
            </motion.button>
          </div>
          <div className="ethereum-card">
            <div className="eth-price">
              <span className="eth-symbol">Ξ</span>
              <span className="eth-value">${ethereumData.ethereum.price.toLocaleString()}</span>
              <motion.span 
                className={`eth-change ${ethereumData.ethereum.change_24h >= 0 ? 'positive' : 'negative'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {ethereumData.ethereum.change_24h >= 0 ? <CryptoUp size={16} /> : <CryptoDown size={16} />}
                {Math.abs(ethereumData.ethereum.change_24h).toFixed(2)}%
              </motion.span>
            </div>
            <div className="eth-details">
              <div className="detail-item">
                <span className="label">Market Cap</span>
                <span className="value">${(ethereumData.ethereum.market_cap / 1000000000).toFixed(2)}B</span>
              </div>
              <div className="detail-item">
                <span className="label">24h Change</span>
                <span className={`value ${ethereumData.ethereum.change_24h >= 0 ? 'positive' : 'negative'}`}>
                  {ethereumData.ethereum.change_24h >= 0 ? '+' : ''}{ethereumData.ethereum.change_24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Crypto Prices Grid */}
      {cryptoData && (
        <motion.div 
          className="crypto-prices-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="section-header-small">
            <h2>Live Cryptocurrency Prices</h2>
            <motion.button 
              className="refresh-btn"
              onClick={fetchCryptoData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={16} />
            </motion.button>
          </div>
          <div className="crypto-grid">
            {cryptoData.cryptocurrencies.map((crypto, index) => (
              <motion.div 
                key={crypto.id}
                className="crypto-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="crypto-header">
                  <div className="crypto-info">
                    <h3>{crypto.name}</h3>
                    <span className="crypto-symbol">{crypto.symbol}</span>
                  </div>
                  <div className={`crypto-change ${crypto.change_24h >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.change_24h >= 0 ? <CryptoUp size={16} /> : <CryptoDown size={16} />}
                    {Math.abs(crypto.change_24h).toFixed(2)}%
                  </div>
                </div>
                <div className="crypto-price">
                  ${crypto.price.toLocaleString()}
                </div>
                <div className="crypto-market-cap">
                  ${(crypto.market_cap / 1000000000).toFixed(2)}B
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Crypto News */}
      {cryptoNews && (
        <motion.div 
          className="crypto-news-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <div className="section-header-small">
            <h2>Latest Cryptocurrency News</h2>
            <motion.button 
              className="refresh-btn"
              onClick={fetchCryptoNews}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={16} />
            </motion.button>
          </div>
          <div className="news-grid">
            {cryptoNews.news.map((article, index) => (
              <motion.article 
                key={article.id}
                className="news-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="news-header">
                  <span className={`news-category ${article.category.toLowerCase()}`}>
                    {article.category}
                  </span>
                  <span className={`news-sentiment ${article.sentiment}`}>
                    {article.sentiment === 'positive' ? '📈' : article.sentiment === 'negative' ? '📉' : '📊'}
                  </span>
                </div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-summary">{article.summary}</p>
                <div className="news-footer">
                  <div className="news-source">
                    <Newspaper size={14} />
                    <span>{article.source}</span>
                  </div>
                  <div className="news-time">
                    <Clock size={14} />
                    <span>{new Date(article.published_at * 1000).toLocaleTimeString()}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Education Component
  const Education = () => (
    <motion.div 
      className="education"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1>Financial Education Center</h1>
        <p>Learn the fundamentals of investing and financial planning</p>
      </motion.div>

      {/* Learning Topics */}
      {educationTopics && (
        <motion.div 
          className="topics-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2>Learning Topics</h2>
          <div className="topics-grid">
            {educationTopics.topics.map((topic, index) => (
              <motion.div 
                key={topic.id}
                className="topic-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="topic-header">
                  <div className="topic-level">
                    <span className={`level-badge ${topic.level}`}>{topic.level}</span>
                  </div>
                  <div className="topic-duration">
                    <Clock size={14} />
                    <span>{topic.duration}</span>
                  </div>
                </div>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <div className="topic-footer">
                  <div className="lessons-count">
                    <BookOpen size={14} />
                    <span>{topic.lessons} lessons</span>
                  </div>
                  <motion.button 
                    className="start-learning-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Learning
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Financial Glossary */}
      {glossary && (
        <motion.div 
          className="glossary-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2>Financial Glossary</h2>
          <div className="glossary-grid">
            {glossary.terms.map((term, index) => (
              <motion.div 
                key={term.term}
                className="glossary-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <h4>{term.term}</h4>
                <p>{term.definition}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Goals Component
  const Goals = () => (
    <motion.div 
      className="goals"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1>Financial Goals</h1>
        <p>Track your progress towards achieving your financial objectives</p>
      </motion.div>

      {goals && (
        <motion.div 
          className="goals-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="goals-grid">
            {goals.goals.map((goal, index) => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              const daysLeft = Math.ceil((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24));
              
              return (
                <motion.div 
                  key={goal.id}
                  className="goal-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="goal-header">
                    <h3>{goal.title}</h3>
                    <span className={`priority-badge ${goal.priority}`}>{goal.priority}</span>
                  </div>
                  
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <motion.div 
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                      />
                    </div>
                    <div className="progress-text">
                      <span>{progress.toFixed(1)}% Complete</span>
                      <span>{daysLeft} days left</span>
                    </div>
                  </div>

                  <div className="goal-amounts">
                    <div className="current-amount">
                      <span className="label">Current</span>
                      <span className="value">${goal.current_amount.toLocaleString()}</span>
                    </div>
                    <div className="target-amount">
                      <span className="label">Target</span>
                      <span className="value">${goal.target_amount.toLocaleString()}</span>
                    </div>
                    <div className="remaining-amount">
                      <span className="label">Remaining</span>
                      <span className="value">${(goal.target_amount - goal.current_amount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="goal-actions">
                    <motion.button 
                      className="add-money-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Money
                    </motion.button>
                    <motion.button 
                      className="edit-goal-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Edit Goal
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Analytics Component
  const Analytics = () => (
    <motion.div 
      className="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1>Advanced Analytics</h1>
        <p>Deep insights into your portfolio performance and risk metrics</p>
      </motion.div>

      {analytics && (
        <motion.div 
          className="analytics-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Risk Metrics */}
          <div className="risk-metrics-section">
            <h2>Risk Metrics</h2>
            <div className="metrics-grid">
              <motion.div 
                className="metric-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="metric-header">
                  <h3>Sharpe Ratio</h3>
                  <AnalyticsUp size={20} className="positive" />
                </div>
                <div className="metric-value">{analytics.analytics.sharpe_ratio}</div>
                <div className="metric-description">Risk-adjusted return measure</div>
              </motion.div>

              <motion.div 
                className="metric-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="metric-header">
                  <h3>Beta</h3>
                  <AnalyticsDown size={20} className="negative" />
                </div>
                <div className="metric-value">{analytics.analytics.beta}</div>
                <div className="metric-description">Market volatility sensitivity</div>
              </motion.div>

              <motion.div 
                className="metric-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="metric-header">
                  <h3>Alpha</h3>
                  <AnalyticsUp size={20} className="positive" />
                </div>
                <div className="metric-value">{analytics.analytics.alpha}</div>
                <div className="metric-description">Excess return over benchmark</div>
              </motion.div>

              <motion.div 
                className="metric-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="metric-header">
                  <h3>Volatility</h3>
                  <AnalyticsActivity size={20} />
                </div>
                <div className="metric-value">{analytics.analytics.volatility}%</div>
                <div className="metric-description">Portfolio price volatility</div>
              </motion.div>
            </div>
          </div>

          {/* Sector Allocation */}
          <div className="sector-allocation-section">
            <h2>Sector Allocation</h2>
            <div className="sector-chart">
              {Object.entries(analytics.analytics.sector_allocation).map(([sector, percentage], index) => (
                <motion.div 
                  key={sector}
                  className="sector-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                >
                  <div className="sector-info">
                    <span className="sector-name">{sector}</span>
                    <span className="sector-percentage">{percentage}%</span>
                  </div>
                  <div className="sector-bar">
                    <motion.div 
                      className="sector-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Alerts Component
  const Alerts = () => (
    <motion.div 
      className="alerts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1>Smart Alerts</h1>
        <p>Stay informed about important market changes and portfolio updates</p>
      </motion.div>

      {alerts && (
        <motion.div 
          className="alerts-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="alerts-grid">
            {alerts.alerts.map((alert, index) => (
              <motion.div 
                key={alert.id}
                className={`alert-card ${alert.priority} ${alert.read ? 'read' : 'unread'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="alert-header">
                  <div className="alert-icon">
                    {alert.type === 'price_alert' && <TrendingUp size={20} />}
                    {alert.type === 'portfolio_alert' && <BarChart3 size={20} />}
                    {alert.type === 'market_alert' && <AlertTriangle size={20} />}
                  </div>
                  <div className="alert-priority">
                    <span className={`priority-badge ${alert.priority}`}>{alert.priority}</span>
                  </div>
                </div>
                
                <div className="alert-content">
                  <h3>{alert.title}</h3>
                  <p>{alert.message}</p>
                </div>

                <div className="alert-footer">
                  <div className="alert-time">
                    <Clock size={14} />
                    <span>{new Date(alert.timestamp * 1000).toLocaleString()}</span>
                  </div>
                  <div className="alert-actions">
                    {!alert.read && (
                      <motion.button 
                        className="mark-read-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Mark as Read
                      </motion.button>
                    )}
                    <motion.button 
                      className="dismiss-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Dismiss
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Notification Component
  const Notification = ({ notification, onRemove }) => (
    <motion.div
      className={`notification ${notification.type}`}
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={() => onRemove(notification.id)}
    >
      <div className="notification-content">
        {notification.type === 'success' && <CheckCircle size={20} />}
        {notification.type === 'error' && <AlertCircle size={20} />}
        {notification.type === 'info' && <Sparkles size={20} />}
        <span>{notification.message}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="app">
      {/* Notifications */}
      <div className="notifications-container">
        <AnimatePresence>
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              notification={notification}
              onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        className="sidebar"
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="logo">
          <motion.span 
            className="logo-icon"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Brain size={40} />
          </motion.span>
          <span className="logo-text">FinSage</span>
        </div>
        <nav className="nav">
          <TabButton id="dashboard" label="Dashboard" icon={BarChart3} />
          <TabButton id="predictions" label="AI Predictions" icon={Brain} />
          <TabButton id="portfolio" label="Portfolio" icon={TrendingUp} />
          <TabButton id="cryptocurrency" label="Crypto" icon={Coins} />
          <TabButton id="education" label="Learn" icon={BookOpen} />
          <TabButton id="goals" label="Goals" icon={Target} />
          <TabButton id="analytics" label="Analytics" icon={BarChart} />
          <TabButton id="alerts" label="Alerts" icon={Bell} />
          <TabButton id="blockchain" label="Blockchain" icon={Link} />
        </nav>
      </motion.div>

      <div className="main-content">
        <div className="content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'predictions' && <Predictions />}
          {activeTab === 'portfolio' && <Portfolio />}
              {activeTab === 'cryptocurrency' && <Cryptocurrency />}
              {activeTab === 'education' && <Education educationTopics={educationTopics} glossary={glossary} />}
              {activeTab === 'goals' && <Goals goals={goals} />}
              {activeTab === 'analytics' && <Analytics analytics={analytics} />}
              {activeTab === 'alerts' && <Alerts alerts={alerts} />}
          {activeTab === 'blockchain' && <Blockchain />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;