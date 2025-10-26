import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Shield, 
  BarChart3, 
  PieChart, 
  Settings, 
  RefreshCw,
  Play,
  Pause,
  Download,
  Upload,
  Star,
  StarOff,
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
  Zap,
  Activity,
  DollarSign
} from 'lucide-react';

interface Asset {
  symbol: string;
  name: string;
  currentPrice: number;
  weight: number;
  expectedReturn: number;
  volatility: number;
  beta: number;
  sector: string;
  marketCap: number;
}

interface OptimizationResult {
  portfolio: Asset[];
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  var95: number;
  cvar95: number;
  diversificationRatio: number;
  concentrationRisk: number;
  recommendations: string[];
  riskScore: number;
  performanceScore: number;
}

interface OptimizationStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

const AdvancedPortfolioOptimizer: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('balanced');
  const [riskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [rebalanceFrequency, setRebalanceFrequency] = useState('quarterly');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const [sortBy, setSortBy] = useState('weight');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'chart'>('grid');
  const [showSettings, setShowSettings] = useState(false);
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(new Set());
  const [favoriteAssets, setFavoriteAssets] = useState<Set<string>>(new Set());
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState<OptimizationResult[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [activeTab, setActiveTab] = useState('optimize');

  const strategies: OptimizationStrategy[] = [
    {
      id: 'conservative',
      name: 'Conservative Growth',
      description: 'Low risk, steady growth with focus on bonds and blue-chip stocks',
      riskLevel: 'conservative',
      expectedReturn: 6.5,
      volatility: 8.2,
      sharpeRatio: 0.79
    },
    {
      id: 'balanced',
      name: 'Balanced Portfolio',
      description: 'Moderate risk with diversified mix of stocks and bonds',
      riskLevel: 'moderate',
      expectedReturn: 8.2,
      volatility: 12.1,
      sharpeRatio: 0.68
    },
    {
      id: 'aggressive',
      name: 'Aggressive Growth',
      description: 'High risk, high return with focus on growth stocks',
      riskLevel: 'aggressive',
      expectedReturn: 11.8,
      volatility: 18.5,
      sharpeRatio: 0.64
    },
    {
      id: 'momentum',
      name: 'Momentum Strategy',
      description: 'Focus on trending stocks with strong recent performance',
      riskLevel: 'aggressive',
      expectedReturn: 13.2,
      volatility: 20.1,
      sharpeRatio: 0.66
    },
    {
      id: 'value',
      name: 'Value Investing',
      description: 'Undervalued stocks with strong fundamentals',
      riskLevel: 'moderate',
      expectedReturn: 9.1,
      volatility: 14.3,
      sharpeRatio: 0.64
    },
    {
      id: 'dividend',
      name: 'Dividend Growth',
      description: 'High dividend yield stocks with growth potential',
      riskLevel: 'conservative',
      expectedReturn: 7.8,
      volatility: 10.2,
      sharpeRatio: 0.76
    }
  ];

  const generateMockAssets = (): Asset[] => {
    const assetData = [
      { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', basePrice: 175 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', basePrice: 140 },
      { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', basePrice: 350 },
      { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', basePrice: 250 },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', basePrice: 450 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', basePrice: 150 },
      { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', basePrice: 300 },
      { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', basePrice: 400 },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', basePrice: 160 },
      { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', basePrice: 170 },
      { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', basePrice: 155 },
      { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Staples', basePrice: 60 }
    ];

    return assetData.map(asset => ({
      ...asset,
      currentPrice: asset.basePrice + (Math.random() - 0.5) * asset.basePrice * 0.1,
      weight: Math.random() * 15 + 2,
      expectedReturn: Math.random() * 15 + 5,
      volatility: Math.random() * 20 + 10,
      beta: Math.random() * 2 + 0.5,
      marketCap: Math.floor(Math.random() * 1000000000000 + 100000000000)
    }));
  };

  const generateOptimizationResult = (): OptimizationResult => {
    const mockAssets = generateMockAssets();
    const expectedReturn = Math.random() * 10 + 5;
    const volatility = Math.random() * 15 + 8;
    const sharpeRatio = expectedReturn / volatility;
    
    return {
      portfolio: mockAssets,
      expectedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown: Math.random() * 20 + 5,
      var95: Math.random() * 10 + 2,
      cvar95: Math.random() * 15 + 3,
      diversificationRatio: Math.random() * 2 + 1,
      concentrationRisk: Math.random() * 30 + 10,
      recommendations: [
        'Consider increasing allocation to technology sector',
        'Reduce concentration risk by diversifying across sectors',
        'Monitor volatility and adjust position sizes accordingly',
        'Rebalance portfolio quarterly to maintain target allocation'
      ],
      riskScore: Math.floor(Math.random() * 40 + 30),
      performanceScore: Math.floor(Math.random() * 30 + 70)
    };
  };

  useEffect(() => {
    setAssets(generateMockAssets());
  }, []);

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = generateOptimizationResult();
    setOptimizationResult(result);
    
    // Add to history
    setOptimizationHistory(prev => [result, ...prev.slice(0, 4)]);
    
    setIsOptimizing(false);
  };

  const toggleAssetExpansion = (symbol: string) => {
    setExpandedAssets(prev => {
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
    setFavoriteAssets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  const filteredAssets = assets
    .filter(asset => 
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery === ''
    )
    .filter(asset => filterSector === 'all' || asset.sector === filterSector)
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'weight':
          aValue = a.weight;
          bValue = b.weight;
          break;
        case 'expectedReturn':
          aValue = a.expectedReturn;
          bValue = b.expectedReturn;
          break;
        case 'volatility':
          aValue = a.volatility;
          bValue = b.volatility;
          break;
        case 'marketCap':
          aValue = a.marketCap;
          bValue = b.marketCap;
          break;
        default:
          aValue = a.weight;
          bValue = b.weight;
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'conservative': return 'text-green-500 bg-green-50';
      case 'moderate': return 'text-yellow-500 bg-yellow-50';
      case 'aggressive': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getSectorColor = (sector: string) => {
    const colors: { [key: string]: string } = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Financial Services': 'bg-purple-100 text-purple-800',
      'Consumer Discretionary': 'bg-orange-100 text-orange-800',
      'Consumer Staples': 'bg-yellow-100 text-yellow-800',
      'Communication Services': 'bg-pink-100 text-pink-800',
      'Automotive': 'bg-gray-100 text-gray-800'
    };
    return colors[sector] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Portfolio Optimizer</h1>
              <p className="text-gray-600">AI-powered portfolio optimization with advanced risk management</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Auto Optimize Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoOptimize}
                  onChange={(e) => setAutoOptimize(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Auto Optimize</span>
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
                <button
                  onClick={() => setViewMode('chart')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Target className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={runOptimization}
                  disabled={isOptimizing}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isOptimizing 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isOptimizing ? <LoadingSpinner /> : <Zap className="w-4 h-4" />}
                  <span>{isOptimizing ? 'Optimizing...' : 'Optimize'}</span>
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Activity className="w-4 h-4" />
                  <span>Compare</span>
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
              {['optimize', 'portfolio', 'analysis', 'history'].map(tab => (
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

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount</label>
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Horizon (years)</label>
                <Input
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rebalance Frequency</label>
                <select
                  value={rebalanceFrequency}
                  onChange={(e) => setRebalanceFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semi-annually">Semi-Annually</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Strategy Selection */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedStrategy === strategy.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(strategy.riskLevel)}`}>
                    {strategy.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{strategy.expectedReturn}%</div>
                    <div className="text-gray-500">Return</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{strategy.volatility}%</div>
                    <div className="text-gray-500">Volatility</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{strategy.sharpeRatio}</div>
                    <div className="text-gray-500">Sharpe</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'optimize' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search and Filters */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Search & Filters</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                      <select
                        value={filterSector}
                        onChange={(e) => setFilterSector(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Sectors</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Consumer Discretionary">Consumer Discretionary</option>
                        <option value="Consumer Staples">Consumer Staples</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="weight">Weight</option>
                        <option value="expectedReturn">Expected Return</option>
                        <option value="volatility">Volatility</option>
                        <option value="marketCap">Market Cap</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimization Results */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Results</h3>
                {optimizationResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{optimizationResult.expectedReturn.toFixed(1)}%</div>
                        <div className="text-sm text-green-700">Expected Return</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{optimizationResult.volatility.toFixed(1)}%</div>
                        <div className="text-sm text-red-700">Volatility</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{optimizationResult.sharpeRatio.toFixed(2)}</div>
                        <div className="text-sm text-blue-700">Sharpe Ratio</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{optimizationResult.riskScore}</div>
                        <div className="text-sm text-purple-700">Risk Score</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {optimizationResult.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Run optimization to see results</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Portfolio Assets</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort:</span>
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
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssets.map((asset) => (
                      <div key={asset.symbol} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">{asset.symbol[0]}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{asset.symbol}</h4>
                              <p className="text-sm text-gray-500">{asset.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleAssetExpansion(asset.symbol)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {expandedAssets.has(asset.symbol) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => toggleFavorite(asset.symbol)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {favoriteAssets.has(asset.symbol) ? 
                                <Star className="w-4 h-4 text-yellow-500 fill-current" /> : 
                                <Star className="w-4 h-4 text-gray-400" />
                              }
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Weight:</span>
                            <span className="font-medium">{asset.weight.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Expected Return:</span>
                            <span className="font-medium text-green-600">{asset.expectedReturn.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Volatility:</span>
                            <span className="font-medium text-red-600">{asset.volatility.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Sector:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSectorColor(asset.sector)}`}>
                              {asset.sector}
                            </span>
                          </div>
                        </div>

                        {expandedAssets.has(asset.symbol) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Current Price:</span>
                                <p className="font-medium">${asset.currentPrice.toFixed(2)}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Beta:</span>
                                <p className="font-medium">{asset.beta.toFixed(2)}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Market Cap:</span>
                                <p className="font-medium">${(asset.marketCap / 1000000000).toFixed(1)}B</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Allocation:</span>
                                <p className="font-medium">${(investmentAmount * asset.weight / 100).toLocaleString()}</p>
                              </div>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Return</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volatility</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAssets.map((asset) => (
                          <tr key={asset.symbol} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-xs font-bold text-blue-600">{asset.symbol[0]}</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{asset.symbol}</div>
                                  <div className="text-sm text-gray-500">{asset.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{asset.weight.toFixed(1)}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-green-600">{asset.expectedReturn.toFixed(1)}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-red-600">{asset.volatility.toFixed(1)}%</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSectorColor(asset.sector)}`}>
                                {asset.sector}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleFavorite(asset.symbol)}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  {favoriteAssets.has(asset.symbol) ? 
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" /> : 
                                    <Star className="w-4 h-4 text-gray-400" />
                                  }
                                </button>
                                <button
                                  onClick={() => toggleAssetExpansion(asset.symbol)}
                                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200"
                                >
                                  Details
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
          )}

          {activeTab === 'analysis' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Analysis */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h3>
                {optimizationResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-800">Value at Risk (95%)</span>
                        <span className="text-lg font-bold text-red-600">{optimizationResult.var95.toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-800">Conditional VaR (95%)</span>
                        <span className="text-lg font-bold text-orange-600">{optimizationResult.cvar95.toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-yellow-800">Max Drawdown</span>
                        <span className="text-lg font-bold text-yellow-600">{optimizationResult.maxDrawdown.toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Concentration Risk</span>
                        <span className="text-lg font-bold text-blue-600">{optimizationResult.concentrationRisk.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Run optimization to see risk analysis</p>
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                {optimizationResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">Performance Score</span>
                        <span className="text-lg font-bold text-green-600">{optimizationResult.performanceScore}/100</span>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Diversification Ratio</span>
                        <span className="text-lg font-bold text-blue-600">{optimizationResult.diversificationRatio.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-800">Sharpe Ratio</span>
                        <span className="text-lg font-bold text-purple-600">{optimizationResult.sharpeRatio.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">Risk Score</span>
                        <span className="text-lg font-bold text-gray-600">{optimizationResult.riskScore}/100</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Run optimization to see performance metrics</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Optimization History</h3>
              </div>
              <div className="p-6">
                {optimizationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {optimizationHistory.map((result, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Optimization #{optimizationHistory.length - index}</h4>
                          <span className="text-sm text-gray-500">{new Date().toLocaleString()}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-green-600">{result.expectedReturn.toFixed(1)}%</div>
                            <div className="text-gray-500">Return</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-red-600">{result.volatility.toFixed(1)}%</div>
                            <div className="text-gray-500">Volatility</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-blue-600">{result.sharpeRatio.toFixed(2)}</div>
                            <div className="text-gray-500">Sharpe</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-600">{result.riskScore}</div>
                            <div className="text-gray-500">Risk Score</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No optimization history yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedPortfolioOptimizer;