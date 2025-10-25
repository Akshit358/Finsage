import React, { useState, useEffect } from 'react';
import DynamicChart from '../components/charts/DynamicChart';
import MultiChartDashboard from '../components/MultiChartDashboard';
import AIPortfolioOptimizer from '../components/AIPortfolioOptimizer';

const Analytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Advanced Analytics
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Comprehensive portfolio analysis and performance metrics
        </p>
      </div>

      {/* Time Period Selector */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Time Period
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['1M', '3M', '6M', '1Y', '2Y', '5Y'].map((period) => (
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

      {/* Performance Metrics */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
          Performance Metrics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
              +{performanceData?.metrics?.totalReturn?.toFixed(2)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Return</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {performanceData?.metrics?.annualizedReturn?.toFixed(2)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Annualized Return</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {performanceData?.metrics?.volatility?.toFixed(2)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Volatility</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              {performanceData?.metrics?.sharpeRatio?.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sharpe Ratio</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
              {performanceData?.metrics?.maxDrawdown?.toFixed(2)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Max Drawdown</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4' }}>
              {performanceData?.metrics?.beta?.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Beta</div>
          </div>
        </div>
      </div>

      {/* Multi-Chart Dashboard */}
      <div style={{ marginBottom: '2rem' }}>
        <MultiChartDashboard />
      </div>

      {/* Single Chart Analysis */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
          Detailed Chart Analysis
        </h2>
        <DynamicChart 
          symbol="AAPL" 
          timeframe="1D" 
          height={500} 
          chartType="candlestick"
          showIndicators={true}
          animated={true}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Asset Allocation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            Asset Allocation
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {performanceData?.allocation?.map((item: any, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: item.color,
                  borderRadius: '2px'
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {item.value}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    marginTop: '0.25rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.value}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            Top Performers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {performanceData?.topPerformers?.map((stock: any, index: number) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                    {stock.symbol}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {stock.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: stock.return > 0 ? '#059669' : '#ef4444'
                  }}>
                    {stock.return > 0 ? '+' : ''}{stock.return.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {stock.weight}% weight
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Portfolio Optimization */}
      <div style={{ marginTop: '2rem' }}>
        <AIPortfolioOptimizer />
      </div>
    </div>
  );
};

export default Analytics;