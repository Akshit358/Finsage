import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Plus,
  Minus,
  Edit,
  Trash2,
  RefreshCw,
  Filter,
  Search,
  Download,
  Upload,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Activity,
  Zap,
  Shield,
  Users,
  Building,
  Globe,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Settings,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';

const Portfolio: React.FC = () => {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [showPortfolioSettings, setShowPortfolioSettings] = useState(false);
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());
  const [favoritePositions, setFavoritePositions] = useState<Set<string>>(new Set(['AAPL', 'GOOGL']));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showPerformanceChart, setShowPerformanceChart] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showAllocationChart, setShowAllocationChart] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');

  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', '2Y', '5Y'];
  const filterTypes = ['all', 'stocks', 'bonds', 'etfs', 'crypto', 'cash'];

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockPortfolios = [
        {
          id: '1',
          name: 'Growth Portfolio',
          description: 'Aggressive growth focused portfolio',
          type: 'growth',
          totalValue: 125000,
          totalGain: 15000,
          totalGainPercent: 13.64,
          dayChange: 2500,
          dayChangePercent: 2.04,
          weekChange: 5200,
          weekChangePercent: 4.34,
          monthChange: 8500,
          monthChangePercent: 7.3,
          riskScore: 7,
          sharpeRatio: 1.2,
          maxDrawdown: -8.5,
          positions: [
            { 
              symbol: 'AAPL', 
              name: 'Apple Inc.', 
              shares: 50, 
              currentPrice: 175.00, 
              value: 8750, 
              gain: 1250, 
              gainPercent: 16.67, 
              allocation: 7.0,
              sector: 'Technology',
              marketCap: '2.8T',
              pe: 28.5,
              dividend: 0.96,
              beta: 1.2,
              dayChange: 2.3,
              dayChangePercent: 1.33,
              weekChange: 8.5,
              weekChangePercent: 5.1,
              monthChange: 15.2,
              monthChangePercent: 9.5,
              isFavorite: true
            },
            { 
              symbol: 'GOOGL', 
              name: 'Alphabet Inc.', 
              shares: 25, 
              currentPrice: 140.00, 
              value: 3500, 
              gain: 500, 
              gainPercent: 16.67, 
              allocation: 2.8,
              sector: 'Technology',
              marketCap: '1.8T',
              pe: 24.2,
              dividend: 0.0,
              beta: 1.1,
              dayChange: 1.8,
              dayChangePercent: 1.28,
              weekChange: 6.2,
              weekChangePercent: 4.6,
              monthChange: 12.8,
              monthChangePercent: 10.1,
              isFavorite: true
            },
            { 
              symbol: 'MSFT', 
              name: 'Microsoft Corporation', 
              shares: 30, 
              currentPrice: 350.00, 
              value: 10500, 
              gain: 1500, 
              gainPercent: 16.67, 
              allocation: 8.4,
              sector: 'Technology',
              marketCap: '2.8T',
              pe: 32.1,
              dividend: 3.00,
              beta: 0.9,
              dayChange: 3.2,
              dayChangePercent: 0.85,
              weekChange: 7.8,
              weekChangePercent: 2.3,
              monthChange: 18.5,
              monthChangePercent: 5.6,
              isFavorite: false
            },
            { 
              symbol: 'TSLA', 
              name: 'Tesla Inc.', 
              shares: 20, 
              currentPrice: 250.00, 
              value: 5000, 
              gain: -500, 
              gainPercent: -9.09, 
              allocation: 4.0,
              sector: 'Automotive',
              marketCap: '800B',
              pe: 45.2,
              dividend: 0.0,
              beta: 2.1,
              dayChange: -2.1,
              dayChangePercent: -0.83,
              weekChange: -8.5,
              weekChangePercent: -3.3,
              monthChange: -15.2,
              monthChangePercent: -5.7,
              isFavorite: false
            },
            { 
              symbol: 'NVDA', 
              name: 'NVIDIA Corporation', 
              shares: 15, 
              currentPrice: 450.00, 
              value: 6750, 
              gain: 1200, 
              gainPercent: 21.62, 
              allocation: 5.4,
              sector: 'Technology',
              marketCap: '1.1T',
              pe: 65.8,
              dividend: 0.16,
              beta: 1.8,
              dayChange: 5.2,
              dayChangePercent: 1.17,
              weekChange: 12.8,
              weekChangePercent: 2.9,
              monthChange: 25.6,
              monthChangePercent: 6.0,
              isFavorite: false
            }
          ],
          performance: {
            '1D': 2.04,
            '1W': 4.34,
            '1M': 7.30,
            '3M': 12.45,
            '6M': 18.92,
            '1Y': 13.64,
            '2Y': 28.75,
            '5Y': 156.80
          },
          allocation: {
            'Technology': 28.6,
            'Healthcare': 15.2,
            'Financial': 12.8,
            'Consumer': 18.4,
            'Industrial': 10.5,
            'Energy': 8.2,
            'Utilities': 6.3
          },
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Conservative Portfolio',
          description: 'Low-risk income focused portfolio',
          type: 'conservative',
          totalValue: 75000,
          totalGain: 2500,
          totalGainPercent: 3.45,
          dayChange: 150,
          dayChangePercent: 0.20,
          weekChange: 450,
          weekChangePercent: 0.60,
          monthChange: 1200,
          monthChangePercent: 1.60,
          riskScore: 3,
          sharpeRatio: 0.8,
          maxDrawdown: -3.2,
          positions: [
            { 
              symbol: 'JNJ', 
              name: 'Johnson & Johnson', 
              shares: 100, 
              currentPrice: 155.00, 
              value: 15500, 
              gain: 500, 
              gainPercent: 3.33, 
              allocation: 20.67,
              sector: 'Healthcare',
              marketCap: '420B',
              pe: 15.8,
              dividend: 4.76,
              beta: 0.6,
              dayChange: 0.3,
              dayChangePercent: 0.19,
              weekChange: 1.2,
              weekChangePercent: 0.78,
              monthChange: 2.8,
              monthChangePercent: 1.84,
              isFavorite: false
            },
            { 
              symbol: 'PG', 
              name: 'Procter & Gamble', 
              shares: 80, 
              currentPrice: 145.00, 
              value: 11600, 
              gain: 400, 
              gainPercent: 3.57, 
              allocation: 15.47,
              sector: 'Consumer',
              marketCap: '350B',
              pe: 25.2,
              dividend: 2.48,
              beta: 0.4,
              dayChange: 0.2,
              dayChangePercent: 0.14,
              weekChange: 0.8,
              weekChangePercent: 0.55,
              monthChange: 1.9,
              monthChangePercent: 1.33,
              isFavorite: false
            },
            { 
              symbol: 'KO', 
              name: 'Coca-Cola Company', 
              shares: 120, 
              currentPrice: 60.00, 
              value: 7200, 
              gain: 200, 
              gainPercent: 2.86, 
              allocation: 9.60,
              sector: 'Consumer',
              marketCap: '260B',
              pe: 22.5,
              dividend: 3.00,
              beta: 0.5,
              dayChange: 0.1,
              dayChangePercent: 0.17,
              weekChange: 0.4,
              weekChangePercent: 0.67,
              monthChange: 0.9,
              monthChangePercent: 1.52,
              isFavorite: false
            }
          ],
          performance: {
            '1D': 0.20,
            '1W': 0.60,
            '1M': 1.60,
            '3M': 2.85,
            '6M': 4.20,
            '1Y': 3.45,
            '2Y': 7.20,
            '5Y': 18.50
          },
          allocation: {
            'Healthcare': 35.2,
            'Consumer': 45.1,
            'Utilities': 12.8,
            'Financial': 6.9
          },
          lastUpdated: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Balanced Portfolio',
          description: 'Diversified portfolio with moderate risk',
          type: 'balanced',
          totalValue: 95000,
          totalGain: 8500,
          totalGainPercent: 9.84,
          dayChange: 800,
          dayChangePercent: 0.84,
          weekChange: 2100,
          weekChangePercent: 2.26,
          monthChange: 4200,
          monthChangePercent: 4.63,
          riskScore: 5,
          sharpeRatio: 1.0,
          maxDrawdown: -5.8,
          positions: [
            { 
              symbol: 'SPY', 
              name: 'SPDR S&P 500 ETF', 
              shares: 200, 
              currentPrice: 450.00, 
              value: 90000, 
              gain: 8000, 
              gainPercent: 9.76, 
              allocation: 94.74,
              sector: 'ETF',
              marketCap: '400B',
              pe: 18.5,
              dividend: 1.89,
              beta: 1.0,
              dayChange: 2.1,
              dayChangePercent: 0.47,
              weekChange: 5.8,
              weekChangePercent: 1.31,
              monthChange: 12.2,
              monthChangePercent: 2.78,
              isFavorite: false
            }
          ],
          performance: {
            '1D': 0.84,
            '1W': 2.26,
            '1M': 4.63,
            '3M': 7.85,
            '6M': 11.20,
            '1Y': 9.84,
            '2Y': 18.45,
            '5Y': 65.20
          },
          allocation: {
            'ETF': 94.74,
            'Cash': 5.26
          },
          lastUpdated: new Date().toISOString()
        }
      ];
      
      setPortfolios(mockPortfolios);
      setSelectedPortfolio(mockPortfolios[0]);
      setLoading(false);
    }, 1000);
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await loadPortfolios();
    setIsRefreshing(false);
  };

  const toggleFavorite = (symbol: string) => {
    setFavoritePositions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
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

  const filteredPositions = selectedPortfolio?.positions?.filter((position: any) => {
    const matchesSearch = position.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         position.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || position.sector.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  const sortedPositions = [...filteredPositions].sort((a: any, b: any) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'value' || sortBy === 'gain') {
      aValue = a[sortBy];
      bValue = b[sortBy];
    } else if (sortBy === 'gainPercent') {
      aValue = a.gainPercent;
      bValue = b.gainPercent;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeBgColor = (value: number) => {
    return value >= 0 ? 'bg-green-50' : 'bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
              <p className="text-gray-600 text-lg">Track and manage your investment portfolios</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isRefreshing 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200">
                <Plus className="w-5 h-5 mr-2" />
                Add Position
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Portfolio List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Portfolios</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Settings className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    onClick={() => setSelectedPortfolio(portfolio)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedPortfolio?.id === portfolio.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{portfolio.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        portfolio.type === 'growth' ? 'bg-green-100 text-green-700' :
                        portfolio.type === 'conservative' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {portfolio.type}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{portfolio.description}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{portfolio.positions.length} positions</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          portfolio.riskScore <= 3 ? 'bg-green-500' :
                          portfolio.riskScore <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">Risk: {portfolio.riskScore}/10</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        ${portfolio.totalValue.toLocaleString()}
                      </div>
                      <div className={`text-sm font-medium ${getChangeColor(portfolio.totalGainPercent)}`}>
                        {portfolio.totalGainPercent > 0 ? '+' : ''}{portfolio.totalGainPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Details */}
          <div className="lg:col-span-3">
            {selectedPortfolio ? (
              <div className="space-y-6">
                {/* Portfolio Header */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedPortfolio.name}</h2>
                      <p className="text-gray-600">{selectedPortfolio.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPortfolioSettings(!showPortfolioSettings)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <Settings className="w-5 h-5 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium">Total Value</p>
                          <p className="text-2xl font-bold">${selectedPortfolio.totalValue.toLocaleString()}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-200" />
                      </div>
                    </div>

                    <div className={`rounded-lg p-4 ${getChangeBgColor(selectedPortfolio.totalGain)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Total Gain</p>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedPortfolio.totalGain)}`}>
                            {selectedPortfolio.totalGain > 0 ? '+' : ''}${selectedPortfolio.totalGain.toLocaleString()}
                          </p>
                        </div>
                        {selectedPortfolio.totalGain >= 0 ? (
                          <TrendingUp className="w-8 h-8 text-green-600" />
                        ) : (
                          <TrendingDown className="w-8 h-8 text-red-600" />
                        )}
                      </div>
                    </div>

                    <div className={`rounded-lg p-4 ${getChangeBgColor(selectedPortfolio.totalGainPercent)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Return %</p>
                          <p className={`text-2xl font-bold ${getChangeColor(selectedPortfolio.totalGainPercent)}`}>
                            {selectedPortfolio.totalGainPercent > 0 ? '+' : ''}{selectedPortfolio.totalGainPercent.toFixed(2)}%
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-gray-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm font-medium">Risk Score</p>
                          <p className="text-2xl font-bold">{selectedPortfolio.riskScore}/10</p>
                        </div>
                        <Shield className="w-8 h-8 text-purple-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Overview */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Performance Overview</h3>
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {timeframes.map(timeframe => (
                          <option key={timeframe} value={timeframe}>{timeframe}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowPerformanceChart(!showPerformanceChart)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                          showPerformanceChart 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {showPerformanceChart ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {timeframes.slice(0, 4).map(timeframe => (
                      <div key={timeframe} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-500 mb-1">{timeframe}</div>
                        <div className={`text-lg font-semibold ${getChangeColor(selectedPortfolio.performance[timeframe])}`}>
                          {selectedPortfolio.performance[timeframe] > 0 ? '+' : ''}{selectedPortfolio.performance[timeframe].toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Holdings Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Holdings</h3>
                    <div className="flex items-center space-x-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search positions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Filter */}
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {filterTypes.map(type => (
                          <option key={type} value={type} className="capitalize">{type}</option>
                        ))}
                      </select>

                      {/* Sort */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="value">Value</option>
                        <option value="gain">Gain</option>
                        <option value="gainPercent">Return %</option>
                        <option value="allocation">Allocation</option>
                      </select>

                      {/* Sort Order */}
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sortedPositions.map((position: any) => (
                      <div 
                        key={position.symbol}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          expandedPositions.has(position.symbol)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onMouseEnter={() => setHoveredCard(position.symbol)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-lg font-bold text-blue-600">{position.symbol[0]}</span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-lg font-semibold text-gray-900">{position.symbol}</h4>
                                <button
                                  onClick={() => toggleFavorite(position.symbol)}
                                  className="transition-colors duration-200"
                                >
                                  {favoritePositions.has(position.symbol) ? (
                                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                  ) : (
                                    <StarOff className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                                  )}
                                </button>
                              </div>
                              <p className="text-sm text-gray-600">{position.name}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{position.sector}</span>
                                <span>•</span>
                                <span>{position.shares} shares</span>
                                <span>•</span>
                                <span>{position.allocation.toFixed(1)}% allocation</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Current Price</div>
                              <div className="text-lg font-semibold text-gray-900">${position.currentPrice}</div>
                              <div className={`text-sm ${getChangeColor(position.dayChange)}`}>
                                {position.dayChange > 0 ? '+' : ''}{position.dayChange} ({position.dayChangePercent}%)
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Value</div>
                              <div className="text-lg font-semibold text-gray-900">${position.value.toLocaleString()}</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-sm text-gray-500">Total Return</div>
                              <div className={`text-lg font-semibold ${getChangeColor(position.gainPercent)}`}>
                                {position.gainPercent > 0 ? '+' : ''}{position.gainPercent.toFixed(2)}%
                              </div>
                              <div className={`text-sm ${getChangeColor(position.gain)}`}>
                                {position.gain > 0 ? '+' : ''}${position.gain.toLocaleString()}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => togglePositionExpansion(position.symbol)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                expandedPositions.has(position.symbol) ? 'rotate-180' : ''
                              }`} />
                            </button>
                          </div>
                        </div>

                        {expandedPositions.has(position.symbol) && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <div className="text-sm text-gray-500">Market Cap</div>
                                <div className="text-lg font-semibold text-gray-900">{position.marketCap}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">P/E Ratio</div>
                                <div className="text-lg font-semibold text-gray-900">{position.pe}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Beta</div>
                                <div className="text-lg font-semibold text-gray-900">{position.beta}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Dividend Yield</div>
                                <div className="text-lg font-semibold text-gray-900">{position.dividend}%</div>
                              </div>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Week Change</div>
                                <div className={`font-semibold ${getChangeColor(position.weekChange)}`}>
                                  {position.weekChange > 0 ? '+' : ''}{position.weekChangePercent.toFixed(2)}%
                                </div>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Month Change</div>
                                <div className={`font-semibold ${getChangeColor(position.monthChange)}`}>
                                  {position.monthChange > 0 ? '+' : ''}{position.monthChangePercent.toFixed(2)}%
                                </div>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Risk Level</div>
                                <div className={`font-semibold ${
                                  position.beta <= 0.8 ? 'text-green-600' :
                                  position.beta <= 1.2 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {position.beta <= 0.8 ? 'Low' :
                                   position.beta <= 1.2 ? 'Medium' : 'High'}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allocation Chart */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Portfolio Allocation</h3>
                    <button
                      onClick={() => setShowAllocationChart(!showAllocationChart)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                        showAllocationChart 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {showAllocationChart ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {showAllocationChart && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(selectedPortfolio.allocation).map(([sector, percentage]: [string, any]) => (
                        <div key={sector} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">{sector}</div>
                          <div className="text-2xl font-bold text-gray-900">{percentage.toFixed(1)}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Portfolio Selected</h3>
                <p className="text-gray-600">Select a portfolio from the list to view its details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;