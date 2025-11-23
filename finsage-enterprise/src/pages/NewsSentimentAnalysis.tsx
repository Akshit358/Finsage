import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: Date;
  url: string;
  sentiment: {
    score: number; // -1 to 1
    label: 'positive' | 'negative' | 'neutral';
    confidence: number; // 0 to 1
  };
  entities: {
    symbol: string;
    name: string;
    relevance: number;
    sentiment: number;
  }[];
  impact: 'low' | 'medium' | 'high';
  category: string;
}

interface SentimentTrend {
  timestamp: Date;
  positive: number;
  negative: number;
  neutral: number;
  average: number;
}

interface MarketMood {
  overall: number;
  fearGreed: number;
  volatility: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  keyEvents: string[];
}

const NewsSentimentAnalysis: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sentimentTrends, setSentimentTrends] = useState<SentimentTrend[]>([]);
  const [marketMood, setMarketMood] = useState<MarketMood | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [filterImpact, setFilterImpact] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const symbols = ['ALL', 'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX', 'SPY', 'QQQ'];

  // Generate mock news articles
  const generateMockArticles = (): NewsArticle[] => {
    const articleTemplates = [
      {
        title: 'Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty',
        content: 'The Federal Reserve hints at possible interest rate reductions as inflation shows signs of cooling and economic growth moderates. This could provide relief to both consumers and businesses facing higher borrowing costs.',
        source: 'Reuters',
        category: 'Monetary Policy',
        sentiment: { score: 0.3, label: 'positive' as const, confidence: 0.85 },
        entities: [
          { symbol: 'SPY', name: 'S&P 500', relevance: 0.9, sentiment: 0.4 },
          { symbol: 'QQQ', name: 'NASDAQ', relevance: 0.8, sentiment: 0.3 }
        ],
        impact: 'high' as const
      },
      {
        title: 'Apple Reports Strong Q4 Earnings, iPhone Sales Exceed Expectations',
        content: 'Apple Inc. reports better-than-expected quarterly earnings with iPhone sales showing robust growth in international markets. The company also announced new AI initiatives that could drive future growth.',
        source: 'Bloomberg',
        category: 'Earnings',
        sentiment: { score: 0.7, label: 'positive' as const, confidence: 0.92 },
        entities: [
          { symbol: 'AAPL', name: 'Apple Inc.', relevance: 0.95, sentiment: 0.8 }
        ],
        impact: 'high' as const
      },
      {
        title: 'Tesla Announces New Gigafactory in Southeast Asia',
        content: 'Tesla reveals plans for a new manufacturing facility in Southeast Asia to meet growing demand for electric vehicles. The move is expected to reduce production costs and improve supply chain efficiency.',
        source: 'CNBC',
        category: 'Corporate News',
        sentiment: { score: 0.6, label: 'positive' as const, confidence: 0.78 },
        entities: [
          { symbol: 'TSLA', name: 'Tesla Inc.', relevance: 0.9, sentiment: 0.7 }
        ],
        impact: 'medium' as const
      },
      {
        title: 'Tech Stocks Face Headwinds as AI Hype Cools',
        content: 'Technology stocks experience selling pressure as investors reassess AI valuations and growth prospects. Some analysts suggest the sector may be overvalued relative to fundamentals.',
        source: 'Wall Street Journal',
        category: 'Market Analysis',
        sentiment: { score: -0.4, label: 'negative' as const, confidence: 0.75 },
        entities: [
          { symbol: 'NVDA', name: 'NVIDIA Corp', relevance: 0.8, sentiment: -0.3 },
          { symbol: 'META', name: 'Meta Platforms', relevance: 0.7, sentiment: -0.4 },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', relevance: 0.6, sentiment: -0.2 }
        ],
        impact: 'medium' as const
      },
      {
        title: 'Oil Prices Surge on Middle East Tensions',
        content: 'Crude oil futures jump 3% following escalating tensions in the Middle East and supply concerns. Energy sector stocks rally while broader market shows mixed reactions.',
        source: 'Financial Times',
        category: 'Geopolitics',
        sentiment: { score: -0.2, label: 'negative' as const, confidence: 0.68 },
        entities: [
          { symbol: 'XLE', name: 'Energy Select Sector SPDR', relevance: 0.9, sentiment: 0.5 },
          { symbol: 'USO', name: 'United States Oil Fund', relevance: 0.8, sentiment: 0.6 }
        ],
        impact: 'high' as const
      },
      {
        title: 'Healthcare Sector Shows Resilience Amid Market Volatility',
        content: 'Healthcare companies demonstrate strong defensive characteristics with consistent demand and stable earnings. The sector benefits from demographic trends and innovation in biotechnology.',
        source: 'MarketWatch',
        category: 'Sector Analysis',
        sentiment: { score: 0.4, label: 'positive' as const, confidence: 0.82 },
        entities: [
          { symbol: 'XLV', name: 'Health Care Select Sector SPDR', relevance: 0.85, sentiment: 0.5 }
        ],
        impact: 'low' as const
      },
      {
        title: 'Cryptocurrency Market Shows Signs of Recovery',
        content: 'Bitcoin and other major cryptocurrencies gain momentum as institutional adoption increases. Several companies announce new crypto-related products and services.',
        source: 'CoinDesk',
        category: 'Cryptocurrency',
        sentiment: { score: 0.5, label: 'positive' as const, confidence: 0.70 },
        entities: [
          { symbol: 'BTC', name: 'Bitcoin', relevance: 0.9, sentiment: 0.6 }
        ],
        impact: 'medium' as const
      },
      {
        title: 'Renewable Energy Stocks Rally on Climate Policy Updates',
        content: 'Clean energy companies surge as governments announce new climate initiatives and carbon reduction targets. Solar and wind energy stocks lead the sector higher.',
        source: 'Green Tech Media',
        category: 'Environmental',
        sentiment: { score: 0.6, label: 'positive' as const, confidence: 0.88 },
        entities: [
          { symbol: 'ICLN', name: 'iShares Global Clean Energy ETF', relevance: 0.9, sentiment: 0.7 }
        ],
        impact: 'medium' as const
      }
    ];

    return articleTemplates.map((template, index) => ({
      id: `article-${index}`,
      ...template,
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time in last 24 hours
      url: `https://example.com/article-${index}`
    }));
  };

  // Generate sentiment trends
  const generateSentimentTrends = (): SentimentTrend[] => {
    const trends: SentimentTrend[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // Last 24 hours
      const baseSentiment = 0.1 + Math.sin(i * 0.3) * 0.3; // Oscillating sentiment
      
      trends.push({
        timestamp,
        positive: Math.max(0, baseSentiment + Math.random() * 0.2),
        negative: Math.max(0, -baseSentiment + Math.random() * 0.2),
        neutral: 1 - Math.abs(baseSentiment) - Math.random() * 0.1,
        average: baseSentiment + (Math.random() - 0.5) * 0.1
      });
    }
    
    return trends;
  };

  // Generate market mood
  const generateMarketMood = (): MarketMood => {
    const overallSentiment = articles.reduce((sum, article) => sum + article.sentiment.score, 0) / articles.length;
    
    return {
      overall: overallSentiment,
      fearGreed: Math.floor(30 + Math.random() * 40), // 30-70 range
      volatility: 0.15 + Math.random() * 0.1, // 15-25% volatility
      trend: overallSentiment > 0.2 ? 'bullish' : overallSentiment < -0.2 ? 'bearish' : 'neutral',
      keyEvents: [
        'Fed signals potential rate cuts',
        'AI sector showing strong momentum',
        'Earnings season exceeding expectations',
        'Geopolitical tensions affecting energy markets'
      ]
    };
  };

  // Filter articles based on selected criteria
  const filteredArticles = articles.filter(article => {
    const matchesSymbol = selectedSymbol === 'ALL' || 
      article.entities.some(entity => entity.symbol === selectedSymbol);
    
    const matchesSentiment = filterSentiment === 'all' || 
      article.sentiment.label === filterSentiment;
    
    const matchesImpact = filterImpact === 'all' || 
      article.impact === filterImpact;
    
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSymbol && matchesSentiment && matchesImpact && matchesSearch;
  });

  // Initialize data
  useEffect(() => {
    const mockArticles = generateMockArticles();
    setArticles(mockArticles);
    setSentimentTrends(generateSentimentTrends());
    setMarketMood(generateMarketMood());
  }, []);

  // Update sentiment trends periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSentimentTrends(prev => {
        const newTrend = generateSentimentTrends();
        return newTrend;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (score: number) => {
    if (score > 0.2) return '#10b981'; // Green for positive
    if (score < -0.2) return '#ef4444'; // Red for negative
    return '#f59e0b'; // Yellow for neutral
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.2) return 'Positive';
    if (score < -0.2) return 'Negative';
    return 'Neutral';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return '#10b981';
      case 'bearish': return '#ef4444';
      case 'neutral': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        animation: 'pulse 10s ease-in-out infinite'
      }} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '0.5rem',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          📰 News Sentiment Analysis
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Real-time sentiment analysis of financial news and market impact
        </p>
      </div>

      {/* Market Mood Overview */}
      {marketMood && (
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
              🎭 Market Mood
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😊</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: getSentimentColor(marketMood.overall),
                  marginBottom: '0.25rem'
                }}>
                  {getSentimentLabel(marketMood.overall)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Overall Sentiment</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>😨</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: marketMood.fearGreed > 50 ? '#ef4444' : '#10b981',
                  marginBottom: '0.25rem'
                }}>
                  {marketMood.fearGreed}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Fear & Greed Index</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: 'white',
                  marginBottom: '0.25rem'
                }}>
                  {(marketMood.volatility * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Volatility</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: getTrendColor(marketMood.trend),
                  marginBottom: '0.25rem'
                }}>
                  {marketMood.trend.toUpperCase()}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Market Trend</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            🔍 Filters
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Symbol
              </label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  width: '100%'
                }}
              >
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol} style={{ background: '#1f2937', color: 'white' }}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Sentiment
              </label>
              <select
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value as any)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  width: '100%'
                }}
              >
                <option value="all" style={{ background: '#1f2937', color: 'white' }}>All Sentiments</option>
                <option value="positive" style={{ background: '#1f2937', color: 'white' }}>Positive</option>
                <option value="negative" style={{ background: '#1f2937', color: 'white' }}>Negative</option>
                <option value="neutral" style={{ background: '#1f2937', color: 'white' }}>Neutral</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Impact
              </label>
              <select
                value={filterImpact}
                onChange={(e) => setFilterImpact(e.target.value as any)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  width: '100%'
                }}
              >
                <option value="all" style={{ background: '#1f2937', color: 'white' }}>All Impact Levels</option>
                <option value="high" style={{ background: '#1f2937', color: 'white' }}>High Impact</option>
                <option value="medium" style={{ background: '#1f2937', color: 'white' }}>Medium Impact</option>
                <option value="low" style={{ background: '#1f2937', color: 'white' }}>Low Impact</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Search
              </label>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* News Articles */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            📰 News Articles ({filteredArticles.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredArticles.map((article) => (
              <div key={article.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0, flex: 1, marginRight: '1rem' }}>
                    {article.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      background: `rgba(${getSentimentColor(article.sentiment.score).slice(1)}, 0.2)`,
                      color: getSentimentColor(article.sentiment.score),
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {article.sentiment.label.toUpperCase()}
                    </div>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      background: `rgba(${getImpactColor(article.impact).slice(1)}, 0.2)`,
                      color: getImpactColor(article.impact),
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {article.impact.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {article.content}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {article.source} • {article.category} • {article.publishedAt.toLocaleTimeString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    Confidence: {(article.sentiment.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {article.entities.map((entity, index) => (
                    <div key={index} style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <span>{entity.symbol}</span>
                      <span style={{ 
                        color: getSentimentColor(entity.sentiment),
                        fontWeight: '600'
                      }}>
                        {entity.sentiment > 0 ? '+' : ''}{entity.sentiment.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default NewsSentimentAnalysis;
