import React, { useState, useEffect } from 'react';
import DynamicChart from '../components/charts/DynamicChart';
import MultiChartDashboard from '../components/MultiChartDashboard';
import AIPortfolioOptimizer from '../components/AIPortfolioOptimizer';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target, 
  Activity, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  Settings, 
  RefreshCw, 
  Download, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock, 
  Calendar, 
  DollarSign, 
  Percent, 
  Volume2, 
  Layers, 
  Grid3X3, 
  Maximize, 
  Minimize,
  Zap,
  Brain,
  Shield,
  Star,
  StarOff
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [expandedCharts, setExpandedCharts] = useState<Set<string>>(new Set());
  const [favoriteMetrics, setFavoriteMetrics] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('performance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLive, setIsLive] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY');

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      const timeframes = {
        '1M': 30,
        '3M': 90,
        '6M': 180,
        '1Y': 365,
        '2Y': 730,
        '5Y': 1825
      };
      
      const days = timeframes[selectedTimeframe as keyof typeof timeframes];
      const portfolioData = generatePortfolioData(days);
      const benchmarkData = generateBenchmarkData(days);
      
      setPerformanceData({
        portfolio: portfolioData,
        benchmark: benchmarkData,
        metrics: {
          totalReturn: 15.67,
          annualizedReturn: 12.34,
          volatility: 18.45,
          sharpeRatio: 0.89,
          maxDrawdown: -8.23,
          beta: 1.12,
          alpha: 2.34
        },
        allocation: [
          { name: 'Stocks', value: 65, color: '#3b82f6' },
          { name: 'Bonds', value: 20, color: '#10b981' },
          { name: 'Cash', value: 10, color: '#f59e0b' },
          { name: 'Alternatives', value: 5, color: '#8b5cf6' }
        ],
        topPerformers: [
          { symbol: 'AAPL', name: 'Apple Inc.', return: 24.5, weight: 8.2 },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', return: 18.7, weight: 6.1 },
          { symbol: 'MSFT', name: 'Microsoft Corp.', return: 16.3, weight: 7.8 },
          { symbol: 'NVDA', name: 'NVIDIA Corp.', return: 45.2, weight: 4.5 },
          { symbol: 'TSLA', name: 'Tesla Inc.', return: -12.1, weight: 3.2 }
        ]
      });
      
      setLoading(false);
    }, 1000);
  }, [selectedTimeframe]);

  const generatePortfolioData = (days: number) => {
    const data = [];
    let value = 100000;
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 0.02;
      value *= (1 + change);
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round(value),
        return: ((value - 100000) / 100000) * 100
      });
    }
    return data;
  };

  const generateBenchmarkData = (days: number) => {
    const data = [];
    let value = 100000;
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 0.015;
      value *= (1 + change);
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: Math.round(value),
        return: ((value - 100000) / 100000) * 100
      });
    }
    return data;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Advanced Analytics</h1>
              <p className="text-gray-600 text-lg">Comprehensive portfolio analysis and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  autoRefresh 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <Activity className="w-5 h-5 mr-2" />
                {autoRefresh ? 'Live' : 'Paused'}
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200">
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Time Period</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">{isLive ? 'Live Updates' : 'Static Data'}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {['1M', '3M', '6M', '1Y', '2Y', '5Y'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedTimeframe === period
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Performance Metrics</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showComparison 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Compare
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">+{performanceData?.metrics?.totalReturn?.toFixed(2)}%</div>
              <div className="text-green-100 text-sm">Total Return</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{performanceData?.metrics?.annualizedReturn?.toFixed(2)}%</div>
              <div className="text-blue-100 text-sm">Annualized Return</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{performanceData?.metrics?.volatility?.toFixed(2)}%</div>
              <div className="text-yellow-100 text-sm">Volatility</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{performanceData?.metrics?.sharpeRatio?.toFixed(2)}</div>
              <div className="text-purple-100 text-sm">Sharpe Ratio</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{performanceData?.metrics?.maxDrawdown?.toFixed(2)}%</div>
              <div className="text-red-100 text-sm">Max Drawdown</div>
            </div>
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{performanceData?.metrics?.beta?.toFixed(2)}</div>
              <div className="text-cyan-100 text-sm">Beta</div>
            </div>
          </div>
        </div>

        {/* Multi-Chart Dashboard */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Performance Charts</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {viewMode === 'grid' ? <Grid3X3 className="w-4 h-4 mr-1" /> : <Layers className="w-4 h-4 mr-1" />}
                  {viewMode === 'grid' ? 'Grid' : 'List'}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Maximize className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <MultiChartDashboard />
          </div>
        </div>

        {/* Single Chart Analysis */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Detailed Chart Analysis</h2>
            <div className="flex items-center space-x-2">
              <select
                value={selectedBenchmark}
                onChange={(e) => setSelectedBenchmark(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SPY">S&P 500 (SPY)</option>
                <option value="QQQ">NASDAQ (QQQ)</option>
                <option value="IWM">Russell 2000 (IWM)</option>
                <option value="VTI">Total Market (VTI)</option>
              </select>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
          <DynamicChart 
            symbol="AAPL" 
            timeframe="1D" 
            height={500} 
            chartType="candlestick"
            showIndicators={true}
            animated={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Allocation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Asset Allocation</h3>
              <button
                onClick={() => setShowAllocationChart(!showAllocationChart)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showAllocationChart 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showAllocationChart ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showAllocationChart ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showAllocationChart && (
              <div className="space-y-4">
                {performanceData?.allocation?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded mt-1 overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ 
                            width: `${item.value}%`,
                            backgroundColor: item.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Star className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {performanceData?.topPerformers?.map((stock: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${stock.return > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.return > 0 ? '+' : ''}{stock.return.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">{stock.weight}% weight</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Portfolio Optimization */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">AI Portfolio Optimization</h2>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200">
                  <Brain className="w-4 h-4 mr-1" />
                  Optimize
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <AIPortfolioOptimizer />
          </div>
        </div>
      </div>
    </div>

export default Analytics;