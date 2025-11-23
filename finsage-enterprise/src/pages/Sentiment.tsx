import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  RefreshCw, 
  Filter,
  Calendar,
  Globe,
  Twitter,
  MessageSquare,
  Newspaper,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Brain,
  Eye,
  FilterX,
  Download,
  Share2,
  Bookmark,
  Star,
  ThumbsUp,
  ThumbsDown,
  TrendingFlat
} from 'lucide-react';

interface SentimentData {
  overall: {
    score: number;
    trend: string;
    change: number;
    confidence: number;
  };
  sectors: Array<{
    name: string;
    score: number;
    trend: string;
    change: number;
  }>;
  socialMedia: {
    twitter: number;
    reddit: number;
    news: number;
    analyst: number;
  };
  fearGreedIndex: number;
  vix: number;
}

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  url: string;
  score: number;
  category: string;
  readTime: number;
}

interface SentimentFilter {
  timeframe: string;
  sources: string[];
  minScore: number;
  maxScore: number;
  categories: string[];
}

const Sentiment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<SentimentFilter>({
    timeframe: '24h',
    sources: ['all'],
    minScore: 0,
    maxScore: 100,
    categories: ['all']
  });
  const [showFilters, setShowFilters] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [sentimentHistory, setSentimentHistory] = useState<Array<{
    timestamp: Date;
    score: number;
    trend: string;
  }>>([]);

  // Real-time data simulation
  useEffect(() => {
    if (!realTimeEnabled) return;

    const interval = setInterval(() => {
      if (sentimentData) {
        setSentimentData(prev => {
          if (!prev) return prev;
          
          const updatedSectors = prev.sectors.map(sector => ({
            ...sector,
            score: Math.max(0, Math.min(100, sector.score + (Math.random() - 0.5) * 2)),
            change: sector.change + (Math.random() - 0.5) * 0.5
          }));

          const newOverallScore = updatedSectors.reduce((sum, sector) => sum + sector.score, 0) / updatedSectors.length;
          
          return {
            ...prev,
            overall: {
              ...prev.overall,
              score: newOverallScore,
              change: prev.overall.change + (Math.random() - 0.5) * 0.3
            },
            sectors: updatedSectors,
            socialMedia: {
              twitter: Math.max(0, Math.min(100, prev.socialMedia.twitter + (Math.random() - 0.5) * 3)),
              reddit: Math.max(0, Math.min(100, prev.socialMedia.reddit + (Math.random() - 0.5) * 3)),
              news: Math.max(0, Math.min(100, prev.socialMedia.news + (Math.random() - 0.5) * 2)),
              analyst: Math.max(0, Math.min(100, prev.socialMedia.analyst + (Math.random() - 0.5) * 1))
            },
            fearGreedIndex: Math.max(0, Math.min(100, prev.fearGreedIndex + (Math.random() - 0.5) * 2)),
            vix: Math.max(10, Math.min(50, prev.vix + (Math.random() - 0.5) * 1))
          };
        });

        // Update sentiment history
        setSentimentHistory(prev => {
          const newEntry = {
            timestamp: new Date(),
            score: sentimentData.overall.score,
            trend: sentimentData.overall.trend
          };
          return [...prev.slice(-19), newEntry];
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeEnabled, sentimentData]);

  useEffect(() => {
    loadMarketSentiment();
    loadRecentSearches();
  }, []);

  const loadMarketSentiment = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData: SentimentData = {
        overall: {
          score: 65.5 + (Math.random() - 0.5) * 10,
          trend: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
          change: 2.3 + (Math.random() - 0.5) * 2,
          confidence: 78 + Math.random() * 15
        },
        sectors: [
          { name: 'Technology', score: 72.1 + (Math.random() - 0.5) * 8, trend: 'Bullish', change: 3.2 + (Math.random() - 0.5) * 2 },
          { name: 'Healthcare', score: 58.3 + (Math.random() - 0.5) * 6, trend: 'Neutral', change: -1.1 + (Math.random() - 0.5) * 1 },
          { name: 'Finance', score: 61.7 + (Math.random() - 0.5) * 7, trend: 'Bullish', change: 1.8 + (Math.random() - 0.5) * 1.5 },
          { name: 'Energy', score: 45.2 + (Math.random() - 0.5) * 5, trend: 'Bearish', change: -2.5 + (Math.random() - 0.5) * 1 },
          { name: 'Consumer', score: 68.9 + (Math.random() - 0.5) * 6, trend: 'Bullish', change: 2.1 + (Math.random() - 0.5) * 1.5 },
          { name: 'Real Estate', score: 55.4 + (Math.random() - 0.5) * 5, trend: 'Neutral', change: 0.8 + (Math.random() - 0.5) * 1 }
        ],
        socialMedia: {
          twitter: 67.2 + (Math.random() - 0.5) * 8,
          reddit: 58.9 + (Math.random() - 0.5) * 6,
          news: 71.3 + (Math.random() - 0.5) * 5,
          analyst: 69.8 + (Math.random() - 0.5) * 4
        },
        fearGreedIndex: 68 + (Math.random() - 0.5) * 10,
        vix: 18.45 + (Math.random() - 0.5) * 3
      };
      
      setSentimentData(mockData);
      setLoading(false);
      setIsRefreshing(false);
      
      addNotification('success', 'Market Sentiment Updated', 'Latest sentiment data has been loaded successfully');
    }, 1000);
  }, []);

  const loadRecentSearches = () => {
    const searches = JSON.parse(localStorage.getItem('recentSentimentSearches') || '[]');
    setRecentSearches(searches);
  };

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSentimentSearches', JSON.stringify(updated));
  };

  const searchSentiment = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    saveRecentSearch(searchTerm);
    
    setTimeout(() => {
      const mockSentiment = {
        term: searchTerm,
        score: 50 + Math.random() * 40,
        trend: Math.random() > 0.5 ? 'Bullish' : 'Bearish',
        confidence: 70 + Math.random() * 25,
        sources: Math.floor(Math.random() * 50) + 20,
        lastUpdated: new Date().toISOString()
      };
      
      setSentimentData(prev => ({
        ...prev,
        search: mockSentiment
      }));
      
      // Generate enhanced mock news articles
      const mockNews: NewsArticle[] = [
        {
          id: '1',
          title: `${searchTerm} shows strong performance in recent trading`,
          source: 'Financial Times',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          sentiment: 'positive',
          summary: `Analysis shows ${searchTerm} has been performing well with positive market sentiment.`,
          url: '#',
          score: 75 + Math.random() * 20,
          category: 'Market Analysis',
          readTime: Math.floor(Math.random() * 5) + 2
        },
        {
          id: '2',
          title: `Market analysts optimistic about ${searchTerm} prospects`,
          source: 'Bloomberg',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          sentiment: 'positive',
          summary: `Leading analysts have upgraded their outlook for ${searchTerm} based on recent developments.`,
          url: '#',
          score: 80 + Math.random() * 15,
          category: 'Analyst Reports',
          readTime: Math.floor(Math.random() * 4) + 3
        },
        {
          id: '3',
          title: `${searchTerm} faces headwinds in current market conditions`,
          source: 'Reuters',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          sentiment: 'negative',
          summary: `Recent market volatility has impacted ${searchTerm} performance.`,
          url: '#',
          score: 30 + Math.random() * 20,
          category: 'Market News',
          readTime: Math.floor(Math.random() * 3) + 2
        },
        {
          id: '4',
          title: `${searchTerm} maintains steady growth trajectory`,
          source: 'Wall Street Journal',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          sentiment: 'neutral',
          summary: `${searchTerm} continues to show consistent performance in the current market environment.`,
          url: '#',
          score: 55 + Math.random() * 20,
          category: 'Company News',
          readTime: Math.floor(Math.random() * 4) + 2
        }
      ];
      
      setNewsArticles(mockNews);
      setLoading(false);
      
      addNotification('success', 'Sentiment Analysis Complete', `Analyzed sentiment for "${searchTerm}"`);
    }, 1500);
  };

  const refreshData = () => {
    setIsRefreshing(true);
    loadMarketSentiment();
  };

  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const toggleFavorite = (stock: string) => {
    setFavoriteStocks(prev => 
      prev.includes(stock) 
        ? prev.filter(s => s !== stock)
        : [...prev, stock]
    );
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentBgColor = (score: number) => {
    if (score >= 70) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getSentimentEmoji = (score: number) => {
    if (score >= 70) return '😊';
    if (score >= 50) return '😐';
    return '😟';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <TrendingFlat className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredNews = newsArticles.filter(article => {
    if (filters.sources.includes('all') || filters.sources.includes(article.source)) {
      if (article.score >= filters.minScore && article.score <= filters.maxScore) {
        if (filters.categories.includes('all') || filters.categories.includes(article.category)) {
          return true;
        }
      }
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Sentiment Analysis</h1>
                  <p className="text-sm text-gray-500">Real-time market sentiment & news analysis</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  realTimeEnabled 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>{realTimeEnabled ? 'Live' : 'Static'}</span>
              </button>
              
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
                  notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                  notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                  'bg-blue-50 border-blue-400 text-blue-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                    {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                    {notification.type === 'info' && <Eye className="w-5 h-5" />}
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm opacity-90">{notification.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Analyze Sentiment</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter stock symbol, company name, or topic..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onKeyPress={(e) => e.key === 'Enter' && searchSentiment()}
              />
            </div>
            <button
              onClick={searchSentiment}
              disabled={loading || !searchTerm.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>Analyze</span>
                </div>
              )}
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(search);
                      searchSentiment();
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Period Selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Time period:</span>
            <div className="flex space-x-1">
              {['1h', '24h', '7d', '30d'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedTimeframe(period)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeframe === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sources</label>
                  <div className="space-y-2">
                    {['All', 'Twitter', 'Reddit', 'News', 'Analyst'].map(source => (
                      <label key={source} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.sources.includes(source.toLowerCase())}
                          onChange={(e) => {
                            if (source === 'All') {
                              setFilters(prev => ({
                                ...prev,
                                sources: e.target.checked ? ['all'] : []
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                sources: e.target.checked 
                                  ? [...prev.sources.filter(s => s !== 'all'), source.toLowerCase()]
                                  : prev.sources.filter(s => s !== source.toLowerCase())
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.minScore}
                        onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) }))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-12">{filters.minScore}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.maxScore}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-12">{filters.maxScore}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <div className="space-y-2">
                    {['All', 'Market Analysis', 'Analyst Reports', 'Company News', 'Market News'].map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.toLowerCase())}
                          onChange={(e) => {
                            if (category === 'All') {
                              setFilters(prev => ({
                                ...prev,
                                categories: e.target.checked ? ['all'] : []
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                categories: e.target.checked 
                                  ? [...prev.categories.filter(c => c !== 'all'), category.toLowerCase()]
                                  : prev.categories.filter(c => c !== category.toLowerCase())
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <div>
                <p className="text-lg font-medium text-gray-900">Analyzing sentiment...</p>
                <p className="text-sm text-gray-500">Processing data from multiple sources</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {sentimentData && !loading && (
          <>
            {/* Tab Navigation */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'sectors', label: 'Sectors', icon: Target },
                  { id: 'social', label: 'Social Media', icon: Twitter },
                  { id: 'news', label: 'News Analysis', icon: Newspaper },
                  { id: 'history', label: 'History', icon: Clock }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Overall Sentiment */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {sentimentData.search ? `Sentiment for "${sentimentData.search.term}"` : 'Overall Market Sentiment'}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        realTimeEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {realTimeEnabled ? 'Live Data' : 'Static Data'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-6xl mb-2">
                        {getSentimentEmoji(sentimentData.overall?.score || sentimentData.search?.score)}
                      </div>
                      <div className={`text-4xl font-bold mb-2 ${getSentimentColor(sentimentData.overall?.score || sentimentData.search?.score)}`}>
                        {(sentimentData.overall?.score || sentimentData.search?.score)?.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Sentiment Score</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {getTrendIcon(sentimentData.overall?.trend || sentimentData.search?.trend)}
                      </div>
                      <div className={`text-2xl font-bold mb-2 ${getSentimentColor(sentimentData.overall?.score || sentimentData.search?.score)}`}>
                        {sentimentData.overall?.trend || sentimentData.search?.trend}
                      </div>
                      <div className="text-sm text-gray-600">Market Trend</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {(sentimentData.overall?.confidence || sentimentData.search?.confidence)?.toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Confidence</div>
                    </div>
                    
                    {sentimentData.search && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {sentimentData.search.sources}
                        </div>
                        <div className="text-sm text-gray-600">Sources Analyzed</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Market Indicators */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Indicators</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className={`text-4xl font-bold mb-2 ${getSentimentColor(sentimentData.fearGreedIndex)}`}>
                        {sentimentData.fearGreedIndex.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">Fear & Greed Index</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getSentimentColor(sentimentData.fearGreedIndex).replace('text-', 'bg-')}`}
                          style={{ width: `${sentimentData.fearGreedIndex}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {sentimentData.vix.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">VIX (Volatility)</div>
                      <div className="text-xs text-gray-500">
                        {sentimentData.vix < 20 ? 'Low Volatility' : 
                         sentimentData.vix < 30 ? 'Moderate Volatility' : 'High Volatility'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sectors Tab */}
            {activeTab === 'sectors' && sentimentData.sectors && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sector Sentiment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sentimentData.sectors.map((sector, index) => (
                    <div key={index} className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${getSentimentBgColor(sector.score)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{sector.name}</h3>
                        <button
                          onClick={() => toggleFavorite(sector.name)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          <Star className={`w-5 h-5 ${favoriteStocks.includes(sector.name) ? 'fill-current text-yellow-500' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className={`text-3xl font-bold mb-2 ${getSentimentColor(sector.score)}`}>
                          {sector.score.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          {getTrendIcon(sector.trend)}
                          <span className={`text-sm font-medium ${getSentimentColor(sector.score)}`}>
                            {sector.trend}
                          </span>
                        </div>
                        <div className={`text-sm ${sector.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sector.change > 0 ? '+' : ''}{sector.change.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getSentimentColor(sector.score).replace('text-', 'bg-')}`}
                          style={{ width: `${sector.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && sentimentData.socialMedia && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Media Sentiment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(sentimentData.socialMedia).map(([platform, score]) => (
                    <div key={platform} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl text-center">
                      <div className="flex items-center justify-center mb-4">
                        {platform === 'twitter' && <Twitter className="w-8 h-8 text-blue-500" />}
                        {platform === 'reddit' && <MessageSquare className="w-8 h-8 text-orange-500" />}
                        {platform === 'news' && <Newspaper className="w-8 h-8 text-green-500" />}
                        {platform === 'analyst' && <Users className="w-8 h-8 text-purple-500" />}
                      </div>
                      
                      <div className="text-sm font-medium text-gray-700 mb-2 capitalize">{platform}</div>
                      <div className={`text-3xl font-bold mb-2 ${getSentimentColor(score)}`}>
                        {score.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500 mb-3">Sentiment Score</div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getSentimentColor(score).replace('text-', 'bg-')}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News Analysis Tab */}
            {activeTab === 'news' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">News Analysis</h2>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {filteredNews.map((article) => (
                    <div key={article.id} className="p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600 mb-3">{article.summary}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            article.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                            article.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {article.sentiment === 'positive' ? '😊' : 
                             article.sentiment === 'negative' ? '😟' : '😐'} {article.sentiment}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Bookmark className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Newspaper className="w-4 h-4" />
                            <span>{article.source}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime} min read</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className={`text-sm font-medium ${getSentimentColor(article.score)}`}>
                            Score: {article.score.toFixed(1)}
                          </div>
                          <a 
                            href={article.url} 
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            Read More →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sentiment History</h2>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Sentiment Trend Chart</p>
                    <p className="text-sm">Historical sentiment data visualization will be displayed here</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sentiment;