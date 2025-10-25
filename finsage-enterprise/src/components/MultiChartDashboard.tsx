import React, { useState } from 'react';
import DynamicChart from './charts/DynamicChart';

const MultiChartDashboard: React.FC = () => {
  const [selectedSymbols, setSelectedSymbols] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA']);
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'area'>('line');
  const [timeframe, setTimeframe] = useState('1D');
  const [showIndicators, setShowIndicators] = useState(true);

  const availableSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.', color: '#059669' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', color: '#2563eb' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', color: '#7c3aed' },
    { symbol: 'TSLA', name: 'Tesla Inc.', color: '#dc2626' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', color: '#ea580c' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', color: '#0891b2' },
    { symbol: 'META', name: 'Meta Platforms Inc.', color: '#be123c' },
    { symbol: 'NFLX', name: 'Netflix Inc.', color: '#e11d48' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', color: '#059669' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', color: '#2563eb' }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line', icon: '📈' },
    { value: 'candlestick', label: 'Candlestick', icon: '🕯️' },
    { value: 'area', label: 'Area', icon: '📊' }
  ];

  const timeframes = [
    { value: '1m', label: '1M' },
    { value: '5m', label: '5M' },
    { value: '15m', label: '15M' },
    { value: '1h', label: '1H' },
    { value: '4h', label: '4H' },
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' }
  ];

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
        Multi-Symbol Dashboard
      </h2>

      {/* Controls */}
      <div style={{ marginBottom: '2rem' }}>
        {/* Symbol Selection */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Select Symbols
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {availableSymbols.map((item) => (
              <button
                key={item.symbol}
                onClick={() => toggleSymbol(item.symbol)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid',
                  borderColor: selectedSymbols.includes(item.symbol) ? item.color : '#d1d5db',
                  backgroundColor: selectedSymbols.includes(item.symbol) ? `${item.color}20` : 'white',
                  color: selectedSymbols.includes(item.symbol) ? item.color : '#374151',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: item.color
                }}></div>
                {item.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Settings */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Chart Type
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {chartTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setChartType(type.value as any)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid',
                    borderColor: chartType === type.value ? '#2563eb' : '#d1d5db',
                    backgroundColor: chartType === type.value ? '#eff6ff' : 'white',
                    color: chartType === type.value ? '#2563eb' : '#374151',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Timeframe
            </label>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    border: '1px solid',
                    borderColor: timeframe === tf.value ? '#2563eb' : '#d1d5db',
                    backgroundColor: timeframe === tf.value ? '#eff6ff' : 'white',
                    color: timeframe === tf.value ? '#2563eb' : '#374151',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showIndicators}
                onChange={(e) => setShowIndicators(e.target.checked)}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Show Indicators
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: selectedSymbols.length <= 2 ? 'repeat(auto-fit, minmax(400px, 1fr))' : 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {selectedSymbols.map((symbol) => {
          const symbolInfo = availableSymbols.find(s => s.symbol === symbol);
          return (
            <div key={symbol} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                    {symbol}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                    {symbolInfo?.name}
                  </p>
                </div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: symbolInfo?.color || '#6b7280'
                }}></div>
              </div>
              <div style={{ padding: '1rem' }}>
                <DynamicChart
                  symbol={symbol}
                  timeframe={timeframe}
                  height={300}
                  chartType={chartType}
                  showIndicators={showIndicators}
                  animated={true}
                />
              </div>
            </div>
          );
        })}
      </div>

      {selectedSymbols.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
            No Symbols Selected
          </h3>
          <p>Select one or more symbols above to view their charts</p>
        </div>
      )}
    </div>
  );
};

export default MultiChartDashboard;
