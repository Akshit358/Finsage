import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/Skeleton';
import DynamicChart from '../components/charts/DynamicChart';
import { 
  TrendingUp, 
  TrendingDown, 
  Play, 
  Pause, 
  RefreshCw, 
  Bell, 
  BellOff, 
  Settings, 
  Filter,
  Search,
  Star,
  StarOff,
  Volume2,
  Activity,
  AlertTriangle,
  BarChart3,
  PieChart,
  Eye,
  EyeOff,
  Plus,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  pe: number;
  eps: number;
  dividend: number;
  lastUpdate: Date;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  symbols: string[];
}

interface MarketIndicators {
  vix: number;
  fearGreed: number;
  putCallRatio: number;
  advancers: number;
  decliners: number;
  newHighs: number;
  newLows: number;
}

const RealtimeDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [indicators, setIndicators] = useState<MarketIndicators | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA']);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const wsRef = useRef<WebSocket | null>(null);

  // Generate mock real-time data
  const generateMarketData = (): MarketData[] => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX', 'SPY', 'QQQ'];
    const basePrices: { [key: string]: number } = {
      'AAPL': 175, 'GOOGL': 140, 'MSFT': 350, 'TSLA': 250, 'NVDA': 450,
      'AMZN': 150, 'META': 300, 'NFLX': 400, 'SPY': 450, 'QQQ': 380
    };

    return symbols.map(symbol => {
      const basePrice = basePrices[symbol] || 100;
      const change = (Math.random() - 0.5) * basePrice * 0.1;
      const price = basePrice + change;
      const changePercent = (change / basePrice) * 100;
      
      return {
        symbol,
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: Math.floor(Math.random() * 10000000),
        marketCap: Math.floor(Math.random() * 1000000000000),
        high52w: basePrice * 1.3,
        low52w: basePrice * 0.7,
        pe: Math.round((Math.random() * 30 + 10) * 100) / 100,
        eps: Math.round((Math.random() * 10 + 1) * 100) / 100,
        dividend: Math.round((Math.random() * 5) * 100) / 100,
        lastUpdate: new Date()
      };
    });
  };

  const generateNews = (): NewsItem[] => {
    const newsTemplates = [
      {
        title: "Tech Stocks Rally on Strong Earnings Reports",
        summary: "Major technology companies report better-than-expected quarterly results",
        source: "Financial Times",
        sentiment: 'positive' as const,
        impact: 'high' as const,
        symbols: ['AAPL', 'GOOGL', 'MSFT']
      },
      {
        title: "Federal Reserve Signals Potential Rate Cut",
        summary: "Central bank hints at possible monetary policy adjustments",
        source: "Wall Street Journal",
        sentiment: 'positive' as const,
        impact: 'medium' as const,
        symbols: ['SPY', 'QQQ']
      },
      {
        title: "Energy Sector Faces Headwinds",
        summary: "Oil prices decline amid global economic concerns",
        source: "Reuters",
        sentiment: 'negative' as const,
        impact: 'medium' as const,
        symbols: []
      }
    ];

    return newsTemplates.map((template, index) => ({
      id: `news-${index}`,
      ...template,
      publishedAt: new Date(Date.now() - Math.random() * 3600000)
    }));
  };

  const generateIndicators = (): MarketIndicators => ({
    vix: Math.round((Math.random() * 20 + 10) * 100) / 100,
    fearGreed: Math.floor(Math.random() * 100),
    putCallRatio: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    advancers: Math.floor(Math.random() * 3000 + 1000),
    decliners: Math.floor(Math.random() * 2000 + 500),
    newHighs: Math.floor(Math.random() * 100 + 10),
    newLows: Math.floor(Math.random() * 50 + 5)
  });

  useEffect(() => {
    // Initial data load
    setMarketData(generateMarketData());
    setNews(generateNews());
    setIndicators(generateIndicators());

    // Real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        setMarketData(generateMarketData());
        setNews(prev => {
          const newNews = generateNews();
          return [...newNews.slice(0, 3), ...prev.slice(0, 2)];
        });
        setIndicators(generateIndicators());
        setLastUpdate(new Date());
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isLive, refreshInterval]);

  const addToWatchlist = (symbol: string) => {
    if (symbol && !watchlist.includes(symbol.toUpperCase())) {
      setWatchlist(prev => [...prev, symbol.toUpperCase()]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  const toggleCardExpansion = (symbol: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500 bg-green-50';
      case 'negative': return 'text-red-500 bg-red-50';
      default: return 'text-yellow-500 bg-yellow-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMarketData = marketData
    .filter(stock => 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery === ''
    )
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'change':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'volume':
          aValue = a.volume;
          bValue = b.volume;
          break;
        default:
          aValue = a.price;
          bValue = b.price;
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real-Time Market Dashboard</h1>
              <p className="text-gray-600">Live market data and analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search symbols..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
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

              {/* View Mode Toggle */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <PieChart className="w-4 h-4" />
                </button>
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
                  onClick={() => setIsLive(!isLive)}
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
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    notificationsEnabled 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  <span>Alerts</span>
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto Refresh</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Enable automatic updates</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Interval</label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1000}>1 second</option>
                  <option value={3000}>3 seconds</option>
                  <option value={5000}>5 seconds</option>
                  <option value={10000}>10 seconds</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as 'grid' | 'list')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="grid">Grid View</option>
                  <option value="list">List View</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Watchlist Management */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Watchlist Management</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add symbol (e.g., AAPL)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => addToWatchlist(searchQuery)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {watchlist.map(symbol => (
              <div key={symbol} className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">{symbol}</span>
                <button
                  onClick={() => removeFromWatchlist(symbol)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Market Indicators */}
        {indicators && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">VIX</p>
                  <p className="text-3xl font-bold">{indicators.vix}</p>
                </div>
                <Activity className="w-8 h-8 text-red-200" />
              </div>
              <div className="mt-4">
                <span className="text-red-300 text-sm font-medium">
                  {indicators.vix > 20 ? 'High Volatility' : 'Normal'}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Fear & Greed</p>
                  <p className="text-3xl font-bold">{indicators.fearGreed}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
              <div className="mt-4">
                <span className="text-green-300 text-sm font-medium">
                  {indicators.fearGreed > 75 ? 'Extreme Greed' : 
                   indicators.fearGreed > 50 ? 'Greed' : 
                   indicators.fearGreed > 25 ? 'Neutral' : 'Fear'}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Advancers</p>
                  <p className="text-3xl font-bold">{indicators.advancers.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
              <div className="mt-4">
                <span className="text-blue-300 text-sm font-medium">
                  vs {indicators.decliners.toLocaleString()} decliners
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">New Highs</p>
                  <p className="text-3xl font-bold">{indicators.newHighs}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
              <div className="mt-4">
                <span className="text-purple-300 text-sm font-medium">
                  vs {indicators.newLows} new lows
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Market Data Grid/List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Live Market Data</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="price">Price</option>
                    <option value="change">Change %</option>
                    <option value="volume">Volume</option>
                  </select>
                </div>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                >
                  {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarketData.map((stock) => (
                  <div key={stock.symbol} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{stock.symbol[0]}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{stock.symbol}</h4>
                          <p className="text-sm text-gray-500">${stock.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleCardExpansion(stock.symbol)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedCards.has(stock.symbol) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => addToWatchlist(stock.symbol)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Star className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center ${getChangeColor(stock.change)}`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        <span className="font-medium">
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Vol: {(stock.volume / 1000000).toFixed(1)}M
                      </div>
                    </div>

                    {expandedCards.has(stock.symbol) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">52W High:</span>
                            <p className="font-medium">${stock.high52w.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">52W Low:</span>
                            <p className="font-medium">${stock.low52w.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">P/E:</span>
                            <p className="font-medium">{stock.pe}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">EPS:</span>
                            <p className="font-medium">${stock.eps}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <DynamicChart symbol={stock.symbol} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMarketData.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-xs font-bold text-blue-600">{stock.symbol[0]}</span>
                            </div>
                            <span className="font-medium text-gray-900">{stock.symbol}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">${stock.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {stock.change >= 0 ? (
                              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                            )}
                            <span className={getChangeColor(stock.change)}>
                              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{(stock.volume / 1000000).toFixed(1)}M</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">${(stock.marketCap / 1000000000).toFixed(1)}B</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => addToWatchlist(stock.symbol)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Star className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => setSelectedSymbol(stock.symbol)}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200"
                            >
                              View Chart
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* News Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Latest Financial News</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{item.source}</span>
                        <span>•</span>
                        <span>{item.publishedAt.toLocaleTimeString()}</span>
                        {item.symbols.length > 0 && (
                          <>
                            <span>•</span>
                            <span>Related: {item.symbols.join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(item.impact)}`}>
                        {item.impact} impact
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Symbol Chart */}
        {selectedSymbol && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{selectedSymbol} Chart</h3>
                <button
                  onClick={() => setSelectedSymbol('')}
                  className="p-2 hover:bg-gray-200 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <DynamicChart symbol={selectedSymbol} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeDashboard;