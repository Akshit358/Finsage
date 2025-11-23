import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, BarChart3, PieChart, RefreshCw, Play, Pause } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedWidgets, setExpandedWidgets] = useState<Set<string>>(new Set());
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [marketAlerts, setMarketAlerts] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadInitialData();
    generateRecentActivity();
    generateMarketAlerts();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      if (isLive) {
        updateMarketData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLive]);

  const loadInitialData = () => {
    setLoading(true);
    setTimeout(() => {
      setPortfolioData({
        totalValue: 125000,
        totalGain: 15000,
        totalGainPercent: 13.64,
        positions: [
          { symbol: 'AAPL', name: 'Apple Inc.', value: 8750, gain: 1250, gainPercent: 16.67 },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 3500, gain: 500, gainPercent: 16.67 },
          { symbol: 'MSFT', name: 'Microsoft Corporation', value: 10500, gain: 1500, gainPercent: 16.67 }
        ]
      });
      
      setMarketData({
        sp500: { value: 4850.43, change: 1.25, changePercent: 0.03 },
        nasdaq: { value: 15235.71, change: -0.45, changePercent: -0.003 },
        dow: { value: 37856.52, change: 0.89, changePercent: 0.002 },
        vix: { value: 18.45, change: -0.32, changePercent: -0.017 },
        sentiment: 65.5,
        lastUpdated: new Date().toISOString()
      });

      // Generate initial notifications
      setNotifications([
        {
          id: 1,
          type: 'success',
          title: 'Portfolio Update',
          message: 'Your portfolio has gained 2.3% today',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false
        },
        {
          id: 2,
          type: 'info',
          title: 'Market Alert',
          message: 'S&P 500 reached new all-time high',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false
        },
        {
          id: 3,
          type: 'warning',
          title: 'Price Alert',
          message: 'AAPL crossed your target price of $175',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: true
        }
      ]);
      
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const updateMarketData = () => {
    // Simulate real-time market data updates
    setMarketData((prev: any) => ({
      ...prev,
      sp500: {
        ...prev.sp500,
        value: prev.sp500.value + (Math.random() - 0.5) * 10,
        change: prev.sp500.change + (Math.random() - 0.5) * 2,
        changePercent: ((prev.sp500.value + (Math.random() - 0.5) * 10) - 4850.43) / 4850.43 * 100
      },
      nasdaq: {
        ...prev.nasdaq,
        value: prev.nasdaq.value + (Math.random() - 0.5) * 20,
        change: prev.nasdaq.change + (Math.random() - 0.5) * 3,
        changePercent: ((prev.nasdaq.value + (Math.random() - 0.5) * 20) - 15235.71) / 15235.71 * 100
      },
      dow: {
        ...prev.dow,
        value: prev.dow.value + (Math.random() - 0.5) * 15,
        change: prev.dow.change + (Math.random() - 0.5) * 2,
        changePercent: ((prev.dow.value + (Math.random() - 0.5) * 15) - 37856.52) / 37856.52 * 100
      },
      vix: {
        ...prev.vix,
        value: Math.max(10, prev.vix.value + (Math.random() - 0.5) * 2),
        change: prev.vix.change + (Math.random() - 0.5) * 0.5,
        changePercent: ((Math.max(10, prev.vix.value + (Math.random() - 0.5) * 2)) - 18.45) / 18.45 * 100
      },
      sentiment: Math.max(0, Math.min(100, prev.sentiment + (Math.random() - 0.5) * 5)),
      lastUpdated: new Date().toISOString()
    }));

    setLastUpdated(new Date());

    // Occasionally add new notifications
    if (Math.random() < 0.3) {
      const newNotification = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'success' : 'info',
        title: Math.random() > 0.5 ? 'Market Update' : 'Portfolio Alert',
        message: Math.random() > 0.5 
          ? 'Market showing positive momentum' 
          : 'One of your positions moved significantly',
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }
  };

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notification: any) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date(),
      read: false
    };
    setNotifications((prev: any[]) => [newNotification, ...prev.slice(0, 9)]);
  };


  const toggleWidgetExpansion = (widgetId: string) => {
    setExpandedWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadInitialData();
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  const addToWatchlist = (symbol: string) => {
    addNotification({
      type: 'success',
      title: 'Added to Watchlist',
      message: `${symbol} has been added to your watchlist`,
      read: false
    });
  };


  const generateRecentActivity = () => {
    const activities = [
      { type: 'trade', symbol: 'AAPL', action: 'Bought', shares: 10, price: 175.50, time: '2 min ago' },
      { type: 'alert', message: 'TSLA hit resistance level', time: '5 min ago' },
      { type: 'prediction', symbol: 'GOOGL', direction: 'up', confidence: 85, time: '8 min ago' },
      { type: 'news', title: 'Fed announces rate decision', impact: 'high', time: '12 min ago' },
      { type: 'portfolio', action: 'Rebalanced', change: '+2.3%', time: '15 min ago' }
    ];
    setRecentActivity(activities);
  };

  const generateMarketAlerts = () => {
    const alerts = [
      { id: 1, type: 'warning', symbol: 'NVDA', message: 'High volatility detected', severity: 'medium' },
      { id: 2, type: 'opportunity', symbol: 'MSFT', message: 'Breakout pattern forming', severity: 'high' },
      { id: 3, type: 'risk', symbol: 'BTC', message: 'Support level breached', severity: 'high' },
      { id: 4, type: 'info', symbol: 'SPY', message: 'Volume spike detected', severity: 'low' }
    ];
    setMarketAlerts(alerts);
  };


  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FinSage Enterprise</h1>
              <p className="text-gray-600">Financial Intelligence Platform</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search stocks, news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute right-3 top-2.5">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Timeframe Selector */}
              <div className="flex space-x-2">
                {['1D', '1W', '1M', '3M', '1Y'].map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedTimeframe === timeframe
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>

              {/* Live Status and Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">
                    {isLive ? 'Live' : 'Paused'}
                  </span>
                </div>
                
                <button
                  onClick={toggleLiveUpdates}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isLive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isLive ? 'Pause' : 'Live'}</span>
                </button>
                
                <button
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isRefreshing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'markets', 'portfolio', 'news', 'alerts'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Enhanced Notifications */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Notifications ({notifications.filter(n => !n.read).length})
                  </h2>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {notifications.filter(n => !n.read).length} new
                    </div>
                  )}
                </div>
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationAsRead(notification.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    notification.read ? 'opacity-70' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.type === 'success' ? 'bg-green-100' : 
                      notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {notification.type === 'success' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : notification.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Activity className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-500">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('portfolio')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => toggleWidgetExpansion('portfolio')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Portfolio Value</p>
                <p className="text-3xl font-bold">${portfolioData?.totalValue?.toLocaleString()}</p>
              </div>
              <DollarSign className={`w-8 h-8 text-blue-200 transition-transform duration-200 ${hoveredCard === 'portfolio' ? 'scale-110' : ''}`} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
                <span className="text-sm font-medium text-green-300">
                  +{portfolioData?.totalGainPercent?.toFixed(2)}% today
                </span>
              </div>
              <div className="text-xs text-blue-200">
                {expandedWidgets.has('portfolio') ? 'Click to collapse' : 'Click to expand'}
              </div>
            </div>
            {expandedWidgets.has('portfolio') && (
              <div className="mt-4 pt-4 border-t border-blue-400">
                <div className="text-xs text-blue-200 space-y-1">
                  <div>Day Change: +${portfolioData?.totalGain?.toLocaleString()}</div>
                  <div>Positions: {portfolioData?.positions?.length || 0}</div>
                  <div>Last Updated: {lastUpdated?.toLocaleTimeString()}</div>
                </div>
              </div>
            )}
          </div>

          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('gains')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => toggleWidgetExpansion('gains')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Gain/Loss</p>
                <p className="text-3xl font-bold">+${portfolioData?.totalGain?.toLocaleString()}</p>
              </div>
              <TrendingUp className={`w-8 h-8 text-green-200 transition-transform duration-200 ${hoveredCard === 'gains' ? 'scale-110' : ''}`} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-green-300 text-sm font-medium">
                +{portfolioData?.totalGainPercent?.toFixed(2)}% return
              </span>
              <div className="text-xs text-green-200">
                {expandedWidgets.has('gains') ? 'Click to collapse' : 'Click to expand'}
              </div>
            </div>
            {expandedWidgets.has('gains') && (
              <div className="mt-4 pt-4 border-t border-green-400">
                <div className="text-xs text-green-200 space-y-1">
                  <div>Week Change: +$2,500</div>
                  <div>Month Change: +$8,500</div>
                  <div>Best Performer: AAPL (+16.7%)</div>
                </div>
              </div>
            )}
          </div>

          <div 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('positions')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => toggleWidgetExpansion('positions')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Positions</p>
                <p className="text-3xl font-bold">{portfolioData?.positions?.length || 0}</p>
              </div>
              <PieChart className={`w-8 h-8 text-purple-200 transition-transform duration-200 ${hoveredCard === 'positions' ? 'scale-110' : ''}`} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-purple-300 text-sm font-medium">
                {portfolioData?.positions?.filter((p: any) => p.gain > 0).length || 0} gaining
              </span>
              <div className="text-xs text-purple-200">
                {expandedWidgets.has('positions') ? 'Click to collapse' : 'Click to expand'}
              </div>
            </div>
            {expandedWidgets.has('positions') && (
              <div className="mt-4 pt-4 border-t border-purple-400">
                <div className="text-xs text-purple-200 space-y-1">
                  {portfolioData?.positions?.slice(0, 3).map((pos: any) => (
                    <div key={pos.symbol} className="flex justify-between">
                      <span>{pos.symbol}</span>
                      <span className={pos.gainPercent > 0 ? 'text-green-300' : 'text-red-300'}>
                        {pos.gainPercent > 0 ? '+' : ''}{pos.gainPercent.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div 
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onMouseEnter={() => setHoveredCard('activity')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => toggleWidgetExpansion('activity')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Market Activity</p>
                <p className="text-3xl font-bold">High</p>
              </div>
              <Activity className={`w-8 h-8 text-orange-200 transition-transform duration-200 ${hoveredCard === 'activity' ? 'scale-110' : ''}`} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-orange-300 text-sm font-medium">
                {isLive ? 'Live updates' : 'Paused'}
              </span>
              <div className="text-xs text-orange-200">
                {expandedWidgets.has('activity') ? 'Click to collapse' : 'Click to expand'}
              </div>
            </div>
            {expandedWidgets.has('activity') && (
              <div className="mt-4 pt-4 border-t border-orange-400">
                <div className="text-xs text-orange-200 space-y-1">
                  <div>S&P 500: {marketData?.sp500?.value?.toFixed(2)}</div>
                  <div>NASDAQ: {marketData?.nasdaq?.value?.toFixed(2)}</div>
                  <div>VIX: {marketData?.vix?.value?.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.type + activity.time} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'trade' ? 'bg-green-100' :
                      activity.type === 'alert' ? 'bg-yellow-100' :
                      activity.type === 'prediction' ? 'bg-blue-100' :
                      activity.type === 'news' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {activity.type === 'trade' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : activity.type === 'alert' ? (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      ) : activity.type === 'prediction' ? (
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                      ) : activity.type === 'news' ? (
                        <Activity className="w-4 h-4 text-purple-600" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'trade' ? `${activity.action} ${activity.shares} shares of ${activity.symbol}` :
                         activity.type === 'alert' ? activity.message :
                         activity.type === 'prediction' ? `${activity.symbol} prediction: ${activity.direction} (${activity.confidence}%)` :
                         activity.type === 'news' ? activity.title :
                         `${activity.action}: ${activity.change}`}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Alerts */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Market Alerts</h3>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {marketAlerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{alert.symbol}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            alert.type === 'warning' ? 'bg-red-100 text-red-700' :
                            alert.type === 'opportunity' ? 'bg-green-100 text-green-700' :
                            alert.type === 'risk' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {alert.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                      </div>
                      <button 
                        onClick={() => setMarketAlerts(prev => prev.filter(a => a.id !== alert.id))}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button 
                  onClick={() => addToWatchlist('TSLA')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Add TSLA to Watchlist</span>
                </button>
                <button 
                  onClick={() => addToWatchlist('NVDA')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Add NVDA to Watchlist</span>
                </button>
                <button 
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isRefreshing 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh All Data'}</span>
                </button>
                <button 
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <Activity className="w-4 h-4" />
                  <span>{showQuickActions ? 'Hide' : 'Show'} Quick Actions</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Overview */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {portfolioData?.positions?.map((position: any) => (
                      <div key={position.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">{position.symbol[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{position.symbol}</p>
                            <p className="text-sm text-gray-500">{position.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${position.value.toLocaleString()}</p>
                          <div className="flex items-center">
                            {position.gain >= 0 ? (
                              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                            )}
                            <span className={`text-sm font-medium ${position.gain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              ${position.gain.toLocaleString()} ({position.gainPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Buy Stock</span>
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                      <TrendingDown className="w-5 h-5" />
                      <span>Sell Stock</span>
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                      <PieChart className="w-5 h-5" />
                      <span>Optimize</span>
                    </button>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Analyze</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'markets' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Live Market Data</h3>
                  {isLive && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">LIVE</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      S&P 500: {marketData?.sp500?.value?.toFixed(2)}
                    </div>
                    <div className={`text-sm font-medium ${marketData?.sp500?.changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketData?.sp500?.changePercent > 0 ? '+' : ''}{marketData?.sp500?.changePercent?.toFixed(3)}%
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      NASDAQ: {marketData?.nasdaq?.value?.toFixed(2)}
                    </div>
                    <div className={`text-sm font-medium ${marketData?.nasdaq?.changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketData?.nasdaq?.changePercent > 0 ? '+' : ''}{marketData?.nasdaq?.changePercent?.toFixed(3)}%
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      DOW: {marketData?.dow?.value?.toFixed(2)}
                    </div>
                    <div className={`text-sm font-medium ${marketData?.dow?.changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {marketData?.dow?.changePercent > 0 ? '+' : ''}{marketData?.dow?.changePercent?.toFixed(3)}%
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      VIX: {marketData?.vix?.value?.toFixed(2)}
                    </div>
                    <div className={`text-sm font-medium ${marketData?.vix?.changePercent > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {marketData?.vix?.changePercent > 0 ? '+' : ''}{marketData?.vix?.changePercent?.toFixed(3)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Portfolio Details</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {portfolioData?.positions?.map((position: any) => (
                        <tr key={position.symbol} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-xs font-bold text-blue-600">{position.symbol[0]}</span>
                              </div>
                              <span className="font-medium text-gray-900">{position.symbol}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">{position.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">${position.value.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {position.gain >= 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                              )}
                              <span className={position.gain >= 0 ? 'text-green-500' : 'text-red-500'}>
                                ${position.gain.toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={position.gainPercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                              {position.gainPercent >= 0 ? '+' : ''}{position.gainPercent.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Financial News</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Market Update</h4>
                          <p className="text-sm text-gray-600 mt-1">S&P 500 reaches new all-time high amid strong earnings reports</p>
                          <span className="text-xs text-gray-500">2 minutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Tech Rally</h4>
                          <p className="text-sm text-gray-600 mt-1">Technology stocks show strong momentum in pre-market trading</p>
                          <span className="text-xs text-gray-500">15 minutes ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Fed Meeting</h4>
                          <p className="text-sm text-gray-600 mt-1">Federal Reserve signals potential rate adjustments in upcoming meeting</p>
                          <span className="text-xs text-gray-500">1 hour ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Market Alerts</h3>
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800">High volatility detected in tech stocks</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Market opening in 2 hours</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">Portfolio up 2.3% today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;