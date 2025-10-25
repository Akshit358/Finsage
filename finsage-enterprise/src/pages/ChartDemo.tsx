import React, { useState } from 'react';
import DynamicChart from '../components/charts/DynamicChart';
import MultiChartDashboard from '../components/MultiChartDashboard';

const ChartDemo: React.FC = () => {
  const [demoMode, setDemoMode] = useState<'single' | 'multi'>('single');
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'area'>('line');

  const symbols = [
    { value: 'AAPL', name: 'Apple Inc.' },
    { value: 'GOOGL', name: 'Alphabet Inc.' },
    { value: 'MSFT', name: 'Microsoft Corp.' },
    { value: 'TSLA', name: 'Tesla Inc.' },
    { value: 'AMZN', name: 'Amazon.com Inc.' },
    { value: 'NVDA', name: 'NVIDIA Corp.' },
    { value: 'META', name: 'Meta Platforms Inc.' },
    { value: 'NFLX', name: 'Netflix Inc.' },
    { value: 'SPY', name: 'SPDR S&P 500 ETF' },
    { value: 'QQQ', name: 'Invesco QQQ Trust' }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: '📈', description: 'Smooth price movement visualization' },
    { value: 'candlestick', label: 'Candlestick Chart', icon: '🕯️', description: 'OHLC data with volume indicators' },
    { value: 'area', label: 'Area Chart', icon: '📊', description: 'Filled area under price curve' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Dynamic Charts Demo
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Experience real-time, animated financial charts with professional features
        </p>
      </div>

      {/* Demo Mode Selector */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Demo Mode
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setDemoMode('single')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid',
              borderColor: demoMode === 'single' ? '#2563eb' : '#d1d5db',
              backgroundColor: demoMode === 'single' ? '#eff6ff' : 'white',
              color: demoMode === 'single' ? '#2563eb' : '#374151',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            📊 Single Chart
          </button>
          <button
            onClick={() => setDemoMode('multi')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid',
              borderColor: demoMode === 'multi' ? '#2563eb' : '#d1d5db',
              backgroundColor: demoMode === 'multi' ? '#eff6ff' : 'white',
              color: demoMode === 'multi' ? '#2563eb' : '#374151',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            📈 Multi-Chart Dashboard
          </button>
        </div>
      </div>

      {demoMode === 'single' && (
        <>
          {/* Single Chart Controls */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Chart Configuration
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Symbol
                </label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                >
                  {symbols.map((symbol) => (
                    <option key={symbol.value} value={symbol.value}>
                      {symbol.value} - {symbol.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Chart Type
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                >
                  {chartTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {chartTypes.map((type) => (
                <div
                  key={type.value}
                  onClick={() => setChartType(type.value as any)}
                  style={{
                    padding: '1rem',
                    border: '1px solid',
                    borderColor: chartType === type.value ? '#2563eb' : '#e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: chartType === type.value ? '#eff6ff' : '#f8fafc',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{type.icon}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    {type.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {type.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Single Dynamic Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              {selectedSymbol} - {chartTypes.find(t => t.value === chartType)?.label}
            </h2>
            <DynamicChart
              symbol={selectedSymbol}
              timeframe="1D"
              height={500}
              chartType={chartType}
              showIndicators={true}
              animated={true}
            />
          </div>
        </>
      )}

      {demoMode === 'multi' && (
        <div style={{ marginBottom: '2rem' }}>
          <MultiChartDashboard />
        </div>
      )}

      {/* Features Showcase */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
          Dynamic Chart Features
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
              Real-time Updates
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Charts update every 2 seconds with simulated market data, showing live price movements and volume changes.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
              Multiple Chart Types
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Line charts, candlestick charts, and area charts with smooth animations and professional styling.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
              Technical Indicators
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              SMA, EMA, RSI, MACD, and Bollinger Bands with real-time calculations and visual overlays.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
              Interactive Features
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Hover tooltips, crosshair cursors, zoom controls, and timeframe switching for detailed analysis.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
              Smooth Animations
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Canvas-based rendering with 60fps animations, smooth transitions, and professional visual effects.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f8fafc'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔗</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
              API Ready
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Built-in integration points for real market data APIs like Alpha Vantage, Finnhub, and Twelve Data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDemo;
