import React, { useState, useEffect, useRef } from 'react';

interface AdvancedChartProps {
  symbol: string;
  timeframe?: string;
  height?: number;
  width?: number;
}

const AdvancedChart: React.FC<AdvancedChartProps> = ({ 
  symbol = 'AAPL', 
  timeframe = '1D',
  height = 400,
  width = 800
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'area'>('line');
  const [indicators, setIndicators] = useState<string[]>([]);

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

  const chartTypes = [
    { value: 'line', label: 'Line', icon: '📈' },
    { value: 'candlestick', label: 'Candlestick', icon: '🕯️' },
    { value: 'area', label: 'Area', icon: '📊' }
  ];

  const availableIndicators = [
    { value: 'sma', label: 'SMA' },
    { value: 'ema', label: 'EMA' },
    { value: 'rsi', label: 'RSI' },
    { value: 'macd', label: 'MACD' },
    { value: 'bollinger', label: 'Bollinger Bands' }
  ];

  useEffect(() => {
    loadChartData();
  }, [symbol, selectedTimeframe]);

  const loadChartData = () => {
    setLoading(true);
    
    // Simulate loading chart data
    setTimeout(() => {
      const data = generateMockChartData(100);
      setChartData(data);
      setLoading(false);
    }, 1000);
  };

  const generateMockChartData = (points: number) => {
    const data = [];
    let price = 150;
    const baseTime = Date.now() - (points * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.5) * 5;
      price += change;
      
      const time = new Date(baseTime + (i * 24 * 60 * 60 * 1000));
      
      data.push({
        time: time.getTime(),
        open: price - Math.random() * 2,
        high: price + Math.random() * 3,
        low: price - Math.random() * 3,
        close: price,
        volume: Math.random() * 1000000
      });
    }
    
    return data;
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Chart dimensions
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    // Find min/max values
    const prices = chartData.map(d => [d.high, d.low, d.open, d.close]).flat();
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw price line
    if (chartType === 'line' || chartType === 'area') {
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();

      chartData.forEach((point, index) => {
        const x = padding + (chartWidth / (chartData.length - 1)) * index;
        const y = padding + chartHeight - ((point.close - minPrice) / priceRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area if area chart
      if (chartType === 'area') {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw candlesticks
    if (chartType === 'candlestick') {
      chartData.forEach((point, index) => {
        const x = padding + (chartWidth / (chartData.length - 1)) * index;
        const candleWidth = Math.max(1, chartWidth / chartData.length - 2);
        
        const openY = padding + chartHeight - ((point.open - minPrice) / priceRange) * chartHeight;
        const closeY = padding + chartHeight - ((point.close - minPrice) / priceRange) * chartHeight;
        const highY = padding + chartHeight - ((point.high - minPrice) / priceRange) * chartHeight;
        const lowY = padding + chartHeight - ((point.low - minPrice) / priceRange) * chartHeight;

        const isGreen = point.close > point.open;
        
        // Draw wick
        ctx.strokeStyle = isGreen ? '#059669' : '#ef4444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // Draw body
        ctx.fillStyle = isGreen ? '#059669' : '#ef4444';
        const bodyHeight = Math.abs(closeY - openY);
        const bodyY = Math.min(openY, closeY);
        
        ctx.fillRect(x - candleWidth/2, bodyY, candleWidth, Math.max(1, bodyHeight));
      });
    }

    // Draw indicators
    if (indicators.includes('sma')) {
      drawSMA(ctx, chartData, minPrice, priceRange, padding, chartWidth, chartHeight);
    }
    if (indicators.includes('ema')) {
      drawEMA(ctx, chartData, minPrice, priceRange, padding, chartWidth, chartHeight);
    }

    // Draw price labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange / 5) * (5 - i);
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(price.toFixed(2), padding - 10, y + 4);
    }

    // Draw time labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const index = Math.floor((chartData.length - 1) / 4) * i;
      const x = padding + (chartWidth / 4) * i;
      const time = new Date(chartData[index].time);
      ctx.fillText(time.toLocaleDateString(), x, height - 10);
    }
  };

  const drawSMA = (ctx: CanvasRenderingContext2D, data: any[], minPrice: number, priceRange: number, padding: number, chartWidth: number, chartHeight: number) => {
    const period = 20;
    if (data.length < period) return;

    const smaData = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, point) => acc + point.close, 0);
      smaData.push({ time: data[i].time, value: sum / period });
    }

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();

    smaData.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * (index + period - 1);
      const y = padding + chartHeight - ((point.value - minPrice) / priceRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  const drawEMA = (ctx: CanvasRenderingContext2D, data: any[], minPrice: number, priceRange: number, padding: number, chartWidth: number, chartHeight: number) => {
    const period = 12;
    if (data.length < period) return;

    const multiplier = 2 / (period + 1);
    let ema = data[0].close;
    const emaData = [{ time: data[0].time, value: ema }];

    for (let i = 1; i < data.length; i++) {
      ema = (data[i].close * multiplier) + (ema * (1 - multiplier));
      emaData.push({ time: data[i].time, value: ema });
    }

    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    emaData.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = padding + chartHeight - ((point.value - minPrice) / priceRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  useEffect(() => {
    if (chartData.length > 0) {
      drawChart();
    }
  }, [chartData, chartType, indicators, width, height]);

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Chart Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
            {symbol} Chart
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            {chartData.length > 0 && `Last: $${chartData[chartData.length - 1].close.toFixed(2)}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={loadChartData}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🔄
          </button>
        </div>
      </div>

      {/* Chart Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* Timeframe Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>
            Timeframe
          </label>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setSelectedTimeframe(tf.value)}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid',
                  borderColor: selectedTimeframe === tf.value ? '#2563eb' : '#d1d5db',
                  backgroundColor: selectedTimeframe === tf.value ? '#eff6ff' : 'white',
                  color: selectedTimeframe === tf.value ? '#2563eb' : '#374151',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Type Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>
            Chart Type
          </label>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {chartTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setChartType(type.value as any)}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid',
                  borderColor: chartType === type.value ? '#2563eb' : '#d1d5db',
                  backgroundColor: chartType === type.value ? '#eff6ff' : 'white',
                  color: chartType === type.value ? '#2563eb' : '#374151',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div>
          <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', display: 'block' }}>
            Indicators
          </label>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {availableIndicators.map((indicator) => (
              <button
                key={indicator.value}
                onClick={() => toggleIndicator(indicator.value)}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid',
                  borderColor: indicators.includes(indicator.value) ? '#2563eb' : '#d1d5db',
                  backgroundColor: indicators.includes(indicator.value) ? '#eff6ff' : 'white',
                  color: indicators.includes(indicator.value) ? '#2563eb' : '#374151',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {indicator.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '1rem',
            borderRadius: '0.5rem'
          }}>
            <div style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: `${height}px`,
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem'
          }}
        />
      </div>

      {/* Chart Legend */}
      {indicators.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {indicators.includes('sma') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '2px', backgroundColor: '#f59e0b' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>SMA (20)</span>
            </div>
          )}
          {indicators.includes('ema') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '2px', backgroundColor: '#8b5cf6' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>EMA (12)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedChart;
