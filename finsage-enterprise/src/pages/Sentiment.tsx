import React, { useState, useEffect } from 'react';

const Sentiment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    // Load initial market sentiment data
    loadMarketSentiment();
  }, []);

  const loadMarketSentiment = () => {
    setLoading(true);
    setTimeout(() => {
      setSentimentData({
        overall: {
          score: 65.5,
          trend: 'Bullish',
          change: 2.3,
          confidence: 78
        },
        sectors: [
          { name: 'Technology', score: 72.1, trend: 'Bullish', change: 3.2 },
          { name: 'Healthcare', score: 58.3, trend: 'Neutral', change: -1.1 },
          { name: 'Finance', score: 61.7, trend: 'Bullish', change: 1.8 },
          { name: 'Energy', score: 45.2, trend: 'Bearish', change: -2.5 },
          { name: 'Consumer', score: 68.9, trend: 'Bullish', change: 2.1 }
        ],
        socialMedia: {
          twitter: 67.2,
          reddit: 58.9,
          news: 71.3,
          analyst: 69.8
        },
        fearGreedIndex: 68,
        vix: 18.45
      });
      setLoading(false);
    }, 1000);
  };

  const searchSentiment = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      // Simulate sentiment analysis for search term
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
      
      // Generate mock news articles
      const mockNews = [
        {
          title: `${searchTerm} shows strong performance in recent trading`,
          source: 'Financial Times',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          sentiment: 'positive',
          summary: `Analysis shows ${searchTerm} has been performing well with positive market sentiment.`,
          url: '#'
        },
        {
          title: `Market analysts optimistic about ${searchTerm} prospects`,
          source: 'Bloomberg',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          sentiment: 'positive',
          summary: `Leading analysts have upgraded their outlook for ${searchTerm} based on recent developments.`,
          url: '#'
        },
        {
          title: `${searchTerm} faces headwinds in current market conditions`,
          source: 'Reuters',
          publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          sentiment: 'negative',
          summary: `Recent market volatility has impacted ${searchTerm} performance.`,
          url: '#'
        }
      ];
      
      setNewsArticles(mockNews);
      setLoading(false);
    }, 1500);
  };

  const getSentimentColor = (score: number) => {
    if (score >= 70) return '#059669';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getSentimentEmoji = (score: number) => {
    if (score >= 70) return '😊';
    if (score >= 50) return '😐';
    return '😟';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Sentiment Analysis
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Real-time market sentiment and news analysis powered by AI
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Analyze Sentiment
        </h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter stock symbol, company name, or topic..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
            onKeyPress={(e) => e.key === 'Enter' && searchSentiment()}
          />
          <button
            onClick={searchSentiment}
            disabled={loading || !searchTerm.trim()}
            style={{
              backgroundColor: loading || !searchTerm.trim() ? '#9ca3af' : '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading || !searchTerm.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        
        {/* Time Period Selector */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['1h', '24h', '7d', '30d'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimeframe(period)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid',
                borderColor: selectedTimeframe === period ? '#2563eb' : '#d1d5db',
                backgroundColor: selectedTimeframe === period ? '#eff6ff' : 'white',
                color: selectedTimeframe === period ? '#2563eb' : '#374151',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Analyzing sentiment...</p>
        </div>
      )}

      {sentimentData && (
        <>
          {/* Overall Sentiment */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              {sentimentData.search ? `Sentiment for "${sentimentData.search.term}"` : 'Overall Market Sentiment'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                  {getSentimentEmoji(sentimentData.overall?.score || sentimentData.search?.score)}
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: getSentimentColor(sentimentData.overall?.score || sentimentData.search?.score),
                  marginBottom: '0.5rem'
                }}>
                  {(sentimentData.overall?.score || sentimentData.search?.score)?.toFixed(1)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sentiment Score</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: getSentimentColor(sentimentData.overall?.score || sentimentData.search?.score),
                  marginBottom: '0.5rem'
                }}>
                  {sentimentData.overall?.trend || sentimentData.search?.trend}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Market Trend</div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  marginBottom: '0.5rem'
                }}>
                  {(sentimentData.overall?.confidence || sentimentData.search?.confidence)?.toFixed(0)}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Confidence</div>
              </div>
              
              {sentimentData.search && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {sentimentData.search.sources}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sources Analyzed</div>
                </div>
              )}
            </div>
          </div>

          {/* Sector Sentiment */}
          {sentimentData.sectors && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
                Sector Sentiment
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {sentimentData.sectors.map((sector: any, index: number) => (
                  <div key={index} style={{
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                      {sector.name}
                    </h3>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: getSentimentColor(sector.score),
                      marginBottom: '0.25rem'
                    }}>
                      {sector.score.toFixed(1)}
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: getSentimentColor(sector.score),
                      fontWeight: '500',
                      marginBottom: '0.25rem'
                    }}>
                      {sector.trend}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: sector.change > 0 ? '#059669' : '#ef4444'
                    }}>
                      {sector.change > 0 ? '+' : ''}{sector.change.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media Sentiment */}
          {sentimentData.socialMedia && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
                Social Media Sentiment
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {Object.entries(sentimentData.socialMedia).map(([platform, score]: [string, any]) => (
                  <div key={platform} style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827', textTransform: 'capitalize' }}>
                      {platform}
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: getSentimentColor(score),
                      marginBottom: '0.25rem'
                    }}>
                      {score.toFixed(1)}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      Sentiment Score
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Indicators */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              Market Indicators
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: getSentimentColor(sentimentData.fearGreedIndex),
                  marginBottom: '0.5rem'
                }}>
                  {sentimentData.fearGreedIndex}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Fear & Greed Index</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  {sentimentData.vix}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>VIX (Volatility)</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* News Articles */}
      {newsArticles.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            Related News
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {newsArticles.map((article, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0, flex: 1 }}>
                    {article.title}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: article.sentiment === 'positive' ? '#dcfce7' : '#fef2f2',
                    color: article.sentiment === 'positive' ? '#166534' : '#991b1b',
                    marginLeft: '1rem'
                  }}>
                    {article.sentiment === 'positive' ? '😊' : '😟'} {article.sentiment}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {article.summary}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                  <a href={article.url} style={{
                    fontSize: '0.875rem',
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}>
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sentiment;