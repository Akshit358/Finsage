import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';

interface APIProvider {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  apiKey: string;
  status: 'connected' | 'disconnected' | 'error';
  rateLimit: number;
  requestsUsed: number;
  lastRequest: string;
  features: string[];
}

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
  timestamp: string;
}

interface NewsData {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: number;
  symbols: string[];
}

const APIIntegration: React.FC = () => {
  const [providers, setProviders] = useState<APIProvider[]>([
    {
      id: 'alpha_vantage',
      name: 'Alpha Vantage',
      description: 'Real-time and historical stock data, forex, and cryptocurrencies',
      baseUrl: 'https://www.alphavantage.co/query',
      apiKey: '',
      status: 'disconnected',
      rateLimit: 500,
      requestsUsed: 0,
      lastRequest: '',
      features: ['Real-time quotes', 'Historical data', 'Technical indicators', 'Forex', 'Crypto']
    },
    {
      id: 'finnhub',
      name: 'Finnhub',
      description: 'Real-time stock market data, news, and financial data',
      baseUrl: 'https://finnhub.io/api/v1',
      apiKey: '',
      status: 'disconnected',
      rateLimit: 60,
      requestsUsed: 0,
      lastRequest: '',
      features: ['Real-time quotes', 'News', 'Company profiles', 'Earnings', 'Insider trading']
    },
    {
      id: 'twelve_data',
      name: 'Twelve Data',
      description: 'Comprehensive financial market data API',
      baseUrl: 'https://api.twelvedata.com',
      apiKey: '',
      status: 'disconnected',
      rateLimit: 800,
      requestsUsed: 0,
      lastRequest: '',
      features: ['Real-time quotes', 'Historical data', 'Technical indicators', 'Forex', 'Crypto', 'Options']
    },
    {
      id: 'newsapi',
      name: 'NewsAPI',
      description: 'Financial news and market sentiment analysis',
      baseUrl: 'https://newsapi.org/v2',
      apiKey: '',
      status: 'disconnected',
      rateLimit: 1000,
      requestsUsed: 0,
      lastRequest: '',
      features: ['Financial news', 'Sentiment analysis', 'Company news', 'Market news']
    },
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'AI-powered financial analysis and insights',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      status: 'disconnected',
      rateLimit: 10000,
      requestsUsed: 0,
      lastRequest: '',
      features: ['AI analysis', 'Sentiment analysis', 'Market insights', 'Predictions']
    }
  ]);

  const [selectedProvider, setSelectedProvider] = useState<string>('alpha_vantage');
  const [testSymbol, setTestSymbol] = useState('AAPL');
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateProviderApiKey = (providerId: string, apiKey: string) => {
    setProviders(prev => prev.map(provider => 
      provider.id === providerId 
        ? { ...provider, apiKey }
        : provider
    ));
  };

  const testConnection = async (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider || !provider.apiKey) {
      setError('Please provide an API key first');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      setProviders(prev => prev.map(p => 
        p.id === providerId 
          ? { 
              ...p, 
              status: success ? 'connected' : 'error',
              requestsUsed: p.requestsUsed + 1,
              lastRequest: new Date().toISOString()
            }
          : p
      ));

      if (success) {
        setSuccess(`Successfully connected to ${provider.name}!`);
      } else {
        setError(`Failed to connect to ${provider.name}. Please check your API key.`);
      }
      
      setIsLoading(false);
    }, 2000);
  };

  const testMarketData = async () => {
    const provider = providers.find(p => p.id === selectedProvider);
    if (!provider || provider.status !== 'connected') {
      setError('Please connect to a provider first');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate market data fetch
    setTimeout(() => {
      const mockData: MarketData = {
        symbol: testSymbol,
        price: 175.00 + (Math.random() - 0.5) * 10,
        change: (Math.random() - 0.5) * 5,
        changePercent: (Math.random() - 0.5) * 3,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        marketCap: Math.floor(Math.random() * 1000000000000) + 2000000000000,
        high52w: 180.00,
        low52w: 150.00,
        pe: 25 + Math.random() * 10,
        timestamp: new Date().toISOString()
      };

      setTestResults(mockData);
      setIsLoading(false);
      setSuccess(`Successfully fetched data for ${testSymbol} from ${provider.name}`);
    }, 1500);
  };

  const testNewsData = async () => {
    const provider = providers.find(p => p.id === selectedProvider);
    if (!provider || provider.status !== 'connected') {
      setError('Please connect to a provider first');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate news data fetch
    setTimeout(() => {
      const mockNews: NewsData[] = [
        {
          id: '1',
          title: `${testSymbol} Reports Strong Q4 Earnings`,
          summary: 'Company exceeds expectations with robust revenue growth and improved margins.',
          source: 'Financial Times',
          publishedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          url: 'https://example.com/news/1',
          sentiment: 0.7,
          symbols: [testSymbol]
        },
        {
          id: '2',
          title: `Analysts Upgrade ${testSymbol} Price Target`,
          summary: 'Multiple analysts raise price targets following positive outlook.',
          source: 'Bloomberg',
          publishedAt: new Date(Date.now() - Math.random() * 7200000).toISOString(),
          url: 'https://example.com/news/2',
          sentiment: 0.8,
          symbols: [testSymbol]
        }
      ];

      setTestResults(mockNews);
      setIsLoading(false);
      setSuccess(`Successfully fetched news data for ${testSymbol} from ${provider.name}`);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return '✅';
      case 'error': return '❌';
      default: return '⚪';
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
        background: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
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
          🔌 API Integration Manager
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Connect and manage real-time market data APIs
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginBottom: '2rem',
          padding: '1rem',
          borderRadius: '1rem',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginBottom: '2rem',
          padding: '1rem',
          borderRadius: '1rem',
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          color: '#22c55e',
          fontSize: '0.875rem'
        }}>
          {success}
        </div>
      )}

      {/* API Providers */}
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
            📡 API Providers
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {providers.map((provider) => (
              <div key={provider.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0 }}>
                        {provider.name}
                      </h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        background: `rgba(${getStatusColor(provider.status).slice(1)}, 0.2)`,
                        color: getStatusColor(provider.status),
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {getStatusIcon(provider.status)} {provider.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1rem' }}>
                      {provider.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {provider.features.map((feature, index) => (
                        <span key={index} style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.75rem'
                        }}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                      API Key
                    </label>
                    <Input
                      type="password"
                      value={provider.apiKey}
                      onChange={(e) => updateProviderApiKey(provider.id, e.target.value)}
                      placeholder={`Enter your ${provider.name} API key`}
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
                    />
                  </div>
                  <Button
                    onClick={() => testConnection(provider.id)}
                    disabled={isLoading || !provider.apiKey}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '1rem',
                      background: provider.status === 'connected' ? 'rgba(34, 197, 94, 0.2)' : 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                      border: 'none',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: provider.status === 'connected' ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : provider.status === 'connected' ? 'Connected' : 'Test Connection'}
                  </Button>
                </div>

                {provider.status === 'connected' && (
                  <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    <div>
                      <div>Rate Limit: {provider.rateLimit}/day</div>
                      <div>Used: {provider.requestsUsed}</div>
                    </div>
                    <div>
                      <div>Remaining: {provider.rateLimit - provider.requestsUsed}</div>
                      <div>Last Request: {provider.lastRequest ? new Date(provider.lastRequest).toLocaleTimeString() : 'Never'}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Testing */}
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
            🧪 API Testing
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
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
                {providers.map(provider => (
                  <option key={provider.id} value={provider.id} style={{ background: '#1f2937', color: 'white' }}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Symbol
              </label>
              <Input
                type="text"
                value={testSymbol}
                onChange={(e) => setTestSymbol(e.target.value.toUpperCase())}
                placeholder="AAPL"
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
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Button
              onClick={testMarketData}
              disabled={isLoading}
              style={{
                padding: '1rem 2rem',
                borderRadius: '1.5rem',
                background: isLoading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #059669, #047857)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(5, 150, 105, 0.3)'
              }}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : '📊 Test Market Data'}
            </Button>
            <Button
              onClick={testNewsData}
              disabled={isLoading}
              style={{
                padding: '1rem 2rem',
                borderRadius: '1.5rem',
                background: isLoading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : '📰 Test News Data'}
            </Button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                Test Results
              </h3>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflowX: 'auto'
              }}>
                <pre style={{
                  color: 'white',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  margin: 0
                }}>
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            </div>
          )}
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

export default APIIntegration;
