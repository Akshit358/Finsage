import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Play, 
  Pause, 
  RefreshCw, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Settings, 
  Bell, 
  BellOff,
  Target,
  Zap,
  Activity,
  Eye,
  EyeOff,
  Filter,
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Calendar,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Wallet,
  CreditCard,
  History,
  Star,
  StarOff
} from 'lucide-react';

interface Position {
  id: string;
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  entryTime: Date;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  marketValue: number;
}

interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partially_filled';
  timestamp: Date;
  orderType: 'market' | 'limit' | 'stop';
  filledQuantity?: number;
  averagePrice?: number;
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  pnl: number;
  commission: number;
}

interface Portfolio {
  cash: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  totalPnL: number;
  totalPnLPercent: number;
  positions: Position[];
  orders: Order[];
  trades: Trade[];
  startingCapital: number;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
}

const PaperTradingSimulator: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    cash: 100000,
    totalValue: 100000,
    dayChange: 0,
    dayChangePercent: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    positions: [],
    orders: [],
    trades: [],
    startingCapital: 100000
  });
  
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderPrice, setOrderPrice] = useState(0);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState('trading');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSettings, setShowSettings] = useState(false);
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());
  const [favoriteSymbols, setFavoriteSymbols] = useState<Set<string>>(new Set(['AAPL', 'GOOGL', 'MSFT']));
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(3000);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showTradeHistory, setShowTradeHistory] = useState(false);

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX', 'SPY', 'QQQ'];
  const basePrices: { [key: string]: number } = {
    'AAPL': 175, 'GOOGL': 140, 'MSFT': 350, 'TSLA': 250, 'NVDA': 450,
    'AMZN': 150, 'META': 300, 'NFLX': 400, 'SPY': 450, 'QQQ': 380
  };

  const generateMarketData = (): MarketData[] => {
    return symbols.map(symbol => {
      const basePrice = basePrices[symbol] || 100;
      const change = (Math.random() - 0.5) * basePrice * 0.05;
      const price = basePrice + change;
      const changePercent = (change / basePrice) * 100;
      
      return {
        symbol,
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        volume: Math.floor(Math.random() * 10000000),
        high: price + Math.random() * 5,
        low: price - Math.random() * 5,
        open: basePrice
      };
    });
  };

  const updatePortfolio = () => {
    setPortfolio(prev => {
      let totalValue = prev.cash;
      let totalPnL = 0;
      let dayChange = 0;
      
      const updatedPositions = prev.positions.map(position => {
        const currentMarketData = marketData.find(m => m.symbol === position.symbol);
        if (currentMarketData) {
          const currentPrice = currentMarketData.price;
          const marketValue = position.quantity * currentPrice;
          const unrealizedPnL = marketValue - (position.quantity * position.entryPrice);
          const unrealizedPnLPercent = (unrealizedPnL / (position.quantity * position.entryPrice)) * 100;
          
          totalValue += marketValue;
          totalPnL += unrealizedPnL;
          dayChange += unrealizedPnL - (position.unrealizedPnL || 0);
          
          return {
            ...position,
            currentPrice,
            marketValue,
            unrealizedPnL,
            unrealizedPnLPercent
          };
        }
        return position;
      });
      
      const totalPnLPercent = (totalPnL / prev.startingCapital) * 100;
      const dayChangePercent = prev.totalValue > 0 ? (dayChange / prev.totalValue) * 100 : 0;
      
      return {
        ...prev,
        positions: updatedPositions,
        totalValue,
        totalPnL,
        totalPnLPercent,
        dayChange,
        dayChangePercent
      };
    });
  };

  const placeOrder = async (type: 'buy' | 'sell') => {
    if (orderQuantity <= 0) return;
    
    setIsPlacingOrder(true);
    
    const currentPrice = marketData.find(m => m.symbol === selectedSymbol)?.price || 0;
    const orderPriceToUse = orderType === 'market' ? currentPrice : orderPrice;
    
    if (type === 'buy' && portfolio.cash < orderQuantity * orderPriceToUse) {
      alert('Insufficient cash');
      setIsPlacingOrder(false);
      return;
    }
    
    if (type === 'sell') {
      const position = portfolio.positions.find(p => p.symbol === selectedSymbol);
      if (!position || position.quantity < orderQuantity) {
        alert('Insufficient shares');
        setIsPlacingOrder(false);
        return;
      }
    }
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      symbol: selectedSymbol,
      type,
      quantity: orderQuantity,
      price: orderPriceToUse,
      status: 'pending',
      timestamp: new Date(),
      orderType
    };
    
    setPortfolio(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders]
    }));
    
    // Simulate order execution
    setTimeout(() => {
      executeOrder(newOrder);
    }, 2000);
    
    setIsPlacingOrder(false);
  };

  const executeOrder = (order: Order) => {
    setPortfolio(prev => {
      const updatedOrders = prev.orders.map(o => 
        o.id === order.id ? { ...o, status: 'filled' as const, filledQuantity: order.quantity, averagePrice: order.price } : o
      );
      
      let updatedCash = prev.cash;
      let updatedPositions = [...prev.positions];
      
      if (order.type === 'buy') {
        updatedCash -= order.quantity * order.price;
        
        const existingPosition = updatedPositions.find(p => p.symbol === order.symbol);
        if (existingPosition) {
          const totalCost = (existingPosition.quantity * existingPosition.entryPrice) + (order.quantity * order.price);
          const totalQuantity = existingPosition.quantity + order.quantity;
          existingPosition.quantity = totalQuantity;
          existingPosition.entryPrice = totalCost / totalQuantity;
        } else {
          updatedPositions.push({
            id: `pos-${Date.now()}`,
            symbol: order.symbol,
            quantity: order.quantity,
            entryPrice: order.price,
            currentPrice: order.price,
            entryTime: new Date(),
            unrealizedPnL: 0,
            unrealizedPnLPercent: 0,
            marketValue: order.quantity * order.price
          });
        }
      } else {
        updatedCash += order.quantity * order.price;
        
        const position = updatedPositions.find(p => p.symbol === order.symbol);
        if (position) {
          position.quantity -= order.quantity;
          if (position.quantity <= 0) {
            updatedPositions = updatedPositions.filter(p => p.symbol !== order.symbol);
          }
        }
      }
      
      const newTrade: Trade = {
        id: `trade-${Date.now()}`,
        symbol: order.symbol,
        type: order.type,
        quantity: order.quantity,
        price: order.price,
        timestamp: new Date(),
        pnl: 0, // Will be calculated based on position
        commission: order.quantity * order.price * 0.001 // 0.1% commission
      };
      
      return {
        ...prev,
        orders: updatedOrders,
        cash: updatedCash,
        positions: updatedPositions,
        trades: [newTrade, ...prev.trades]
      };
    });
  };

  const cancelOrder = (orderId: string) => {
    setPortfolio(prev => ({
      ...prev,
      orders: prev.orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' as const } : order
      )
    }));
  };

  const togglePositionExpansion = (symbol: string) => {
    setExpandedPositions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  const toggleFavorite = (symbol: string) => {
    setFavoriteSymbols(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  useEffect(() => {
    setMarketData(generateMarketData());
  }, []);

  useEffect(() => {
    if (isLive && autoRefresh) {
      const interval = setInterval(() => {
        setMarketData(generateMarketData());
        updatePortfolio();
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [isLive, autoRefresh, refreshInterval]);

  useEffect(() => {
    updatePortfolio();
  }, [marketData]);

  const filteredOrders = portfolio.orders
    .filter(order => 
      order.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery === ''
    )
    .filter(order => filterStatus === 'all' || order.status === filterStatus)
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'timestamp':
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
          break;
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        default:
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'partially_filled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paper Trading Simulator</h1>
              <p className="text-gray-600">Virtual trading with $100,000 starting capital</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Live Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {isLive ? 'Live' : 'Paused'}
                </span>
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

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
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
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={() => setShowOrderHistory(!showOrderHistory)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Settings</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Starting Capital</label>
                <Input
                  type="number"
                  value={portfolio.startingCapital}
                  disabled
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Portfolio Value</p>
                <p className="text-3xl font-bold">${portfolio.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
            <div className="mt-4 flex items-center">
              {portfolio.dayChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-300 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                portfolio.dayChange >= 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                {portfolio.dayChange >= 0 ? '+' : ''}${portfolio.dayChange.toFixed(2)} ({portfolio.dayChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Available Cash</p>
                <p className="text-3xl font-bold">${portfolio.cash.toLocaleString()}</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-200" />
            </div>
            <div className="mt-4">
              <span className="text-blue-300 text-sm font-medium">
                {((portfolio.cash / portfolio.totalValue) * 100).toFixed(1)}% of portfolio
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total P&L</p>
                <p className="text-3xl font-bold">${portfolio.totalPnL.toFixed(2)}</p>
              </div>
              <Target className="w-8 h-8 text-purple-200" />
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                portfolio.totalPnL >= 0 ? 'text-green-300' : 'text-red-300'
              }`}>
                {portfolio.totalPnL >= 0 ? '+' : ''}{portfolio.totalPnLPercent.toFixed(2)}% return
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Active Positions</p>
                <p className="text-3xl font-bold">{portfolio.positions.length}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-200" />
            </div>
            <div className="mt-4">
              <span className="text-orange-300 text-sm font-medium">
                {portfolio.orders.filter(o => o.status === 'pending').length} pending orders
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['trading', 'portfolio', 'orders', 'market'].map(tab => (
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

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'trading' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Placement */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Order</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
                    <select
                      value={selectedSymbol}
                      onChange={(e) => setSelectedSymbol(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {symbols.map(symbol => (
                        <option key={symbol} value={symbol}>{symbol}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <Input
                        type="number"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(Number(e.target.value))}
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                      <select
                        value={orderType}
                        onChange={(e) => setOrderType(e.target.value as 'market' | 'limit' | 'stop')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="market">Market</option>
                        <option value="limit">Limit</option>
                        <option value="stop">Stop</option>
                      </select>
                    </div>
                  </div>
                  
                  {orderType !== 'market' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <Input
                        type="number"
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(Number(e.target.value))}
                        step="0.01"
                      />
                    </div>
                  )}
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => placeOrder('buy')}
                      disabled={isPlacingOrder}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isPlacingOrder 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isPlacingOrder ? <LoadingSpinner /> : <TrendingUp className="w-4 h-4" />}
                      <span>{isPlacingOrder ? 'Placing...' : 'Buy'}</span>
                    </button>
                    <button
                      onClick={() => placeOrder('sell')}
                      disabled={isPlacingOrder}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isPlacingOrder 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {isPlacingOrder ? <LoadingSpinner /> : <TrendingDown className="w-4 h-4" />}
                      <span>{isPlacingOrder ? 'Placing...' : 'Sell'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Market Data */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Data</h3>
                <div className="space-y-3">
                  {marketData.slice(0, 5).map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">{stock.symbol[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{stock.symbol}</p>
                          <p className="text-sm text-gray-500">Vol: {(stock.volume / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${stock.price.toFixed(2)}</p>
                        <div className="flex items-center">
                          {stock.change >= 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${getChangeColor(stock.change)}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Portfolio Positions</h3>
              </div>
              <div className="p-6">
                {portfolio.positions.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.positions.map((position) => (
                      <div key={position.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">{position.symbol[0]}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{position.symbol}</h4>
                              <p className="text-sm text-gray-500">{position.quantity} shares</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => togglePositionExpansion(position.symbol)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {expandedPositions.has(position.symbol) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => toggleFavorite(position.symbol)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {favoriteSymbols.has(position.symbol) ? 
                                <Star className="w-4 h-4 text-yellow-500 fill-current" /> : 
                                <Star className="w-4 h-4 text-gray-400" />
                              }
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Current Price:</span>
                            <p className="font-medium">${position.currentPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Entry Price:</span>
                            <p className="font-medium">${position.entryPrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Market Value:</span>
                            <p className="font-medium">${position.marketValue.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Unrealized P&L:</span>
                            <p className={`font-medium ${getChangeColor(position.unrealizedPnL)}`}>
                              ${position.unrealizedPnL.toFixed(2)} ({position.unrealizedPnLPercent.toFixed(2)}%)
                            </p>
                          </div>
                        </div>

                        {expandedPositions.has(position.symbol) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Entry Time:</span>
                                <p className="font-medium">{position.entryTime.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Total Cost:</span>
                                <p className="font-medium">${(position.quantity * position.entryPrice).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No positions yet. Start trading to build your portfolio!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm text-gray-600">Filter:</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="filled">Filled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {filteredOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-xs font-bold text-blue-600">{order.symbol[0]}</span>
                                </div>
                                <span className="font-medium text-gray-900">{order.symbol}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {order.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">${order.price.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{order.timestamp.toLocaleTimeString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => cancelOrder(order.id)}
                                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet. Place your first trade!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'market' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Search symbols..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">High</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {marketData
                        .filter(stock => 
                          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          searchQuery === ''
                        )
                        .map((stock) => (
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
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">${stock.high.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">${stock.low.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleFavorite(stock.symbol)}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                {favoriteSymbols.has(stock.symbol) ? 
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" /> : 
                                  <Star className="w-4 h-4 text-gray-400" />
                                }
                              </button>
                              <button
                                onClick={() => setSelectedSymbol(stock.symbol)}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200"
                              >
                                Trade
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperTradingSimulator;