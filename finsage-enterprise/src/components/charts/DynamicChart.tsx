import React, { useState, useEffect, useRef, useCallback } from 'react';
import { realtimeDataService, MarketData, MarketDataPoint } from '../../services/realtimeData';

interface DynamicChartProps {
  symbol: string;
  timeframe?: string;
  height?: number;
  width?: number;
  chartType?: 'line' | 'candlestick' | 'area';
  showIndicators?: boolean;
  animated?: boolean;
}

const DynamicChart: React.FC<DynamicChartProps> = ({ 
  symbol = 'AAPL', 
  timeframe = '1D',
  height = 400,
  width = 800,
  chartType = 'line',
  showIndicators = true,
  animated = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [indicators, setIndicators] = useState<string[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<MarketDataPoint | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Subscribe to real-time data
  useEffect(() => {
    const handleDataUpdate = (data: MarketData) => {
      setMarketData(data);
      setLoading(false);
      
      if (animated) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    };

    realtimeDataService.subscribe(symbol, handleDataUpdate);

    return () => {
      realtimeDataService.unsubscribe(symbol, handleDataUpdate);
    };
  }, [symbol, animated]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (marketData && canvasRef.current) {
        drawChart();
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animated) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      drawChart();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [marketData, selectedChartType, indicators, animated]);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !marketData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const padding = 60;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    // Find min/max values
    const prices = marketData.dataPoints.map(d => [d.high, d.low, d.open, d.close]).flat();
    const volumes = marketData.dataPoints.map(d => d.volume);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const maxVolume = Math.max(...volumes);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
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

    ctx.setLineDash([]);

    // Draw volume bars
    if (showIndicators) {
      const volumeHeight = chartHeight * 0.2;
      const volumeY = height - padding - volumeHeight;
      
      marketData.dataPoints.forEach((point, index) => {
        const x = padding + (chartWidth / (marketData.dataPoints.length - 1)) * index;
        const barWidth = Math.max(1, chartWidth / marketData.dataPoints.length - 1);
        const barHeight = (point.volume / maxVolume) * volumeHeight;
        
        ctx.fillStyle = point.close > point.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(x - barWidth/2, volumeY + volumeHeight - barHeight, barWidth, barHeight);
      });
    }

    // Draw price line/area/candlesticks
    if (selectedChartType === 'line' || selectedChartType === 'area') {
      ctx.strokeStyle = marketData.changePercent >= 0 ? '#059669' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();

      marketData.dataPoints.forEach((point, index) => {
        const x = padding + (chartWidth / (marketData.dataPoints.length - 1)) * index;
        const y = padding + chartHeight - ((point.close - minPrice) / priceRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area if area chart
      if (selectedChartType === 'area') {
        ctx.fillStyle = marketData.changePercent >= 0 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw candlesticks
    if (selectedChartType === 'candlestick') {
      marketData.dataPoints.forEach((point, index) => {
        const x = padding + (chartWidth / (marketData.dataPoints.length - 1)) * index;
        const candleWidth = Math.max(2, chartWidth / marketData.dataPoints.length - 2);
        
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
    if (showIndicators && indicators.length > 0) {
      if (indicators.includes('sma')) {
        drawSMA(ctx, marketData.dataPoints, minPrice, priceRange, padding, chartWidth, chartHeight);
      }
      if (indicators.includes('ema')) {
        drawEMA(ctx, marketData.dataPoints, minPrice, priceRange, padding, chartWidth, chartHeight);
      }
      if (indicators.includes('bollinger')) {
        drawBollingerBands(ctx, marketData.dataPoints, minPrice, priceRange, padding, chartWidth, chartHeight);
      }
    }

    // Draw hover effect
    if (hoveredPoint) {
      const index = marketData.dataPoints.findIndex(p => p.timestamp === hoveredPoint.timestamp);
      if (index !== -1) {
        const x = padding + (chartWidth / (marketData.dataPoints.length - 1)) * index;
        const y = padding + chartHeight - ((hoveredPoint.close - minPrice) / priceRange) * chartHeight;
        
        // Draw crosshair
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw point
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
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
      const index = Math.floor((marketData.dataPoints.length - 1) / 4) * i;
      const x = padding + (chartWidth / 4) * i;
      const time = new Date(marketData.dataPoints[index].timestamp);
      ctx.fillText(time.toLocaleTimeString(), x, height - 10);
    }

    // Draw current price indicator
    if (marketData.dataPoints.length > 0) {
      const lastPoint = marketData.dataPoints[marketData.dataPoints.length - 1];
      const x = width - padding;
      const y = padding + chartHeight - ((lastPoint.close - minPrice) / priceRange) * chartHeight;
      
      ctx.fillStyle = marketData.changePercent >= 0 ? '#059669' : '#ef4444';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(`$${lastPoint.close.toFixed(2)}`, x, y - 10);
      
      ctx.font = '12px system-ui';
      ctx.fillText(`${marketData.changePercent >= 0 ? '+' : ''}${marketData.changePercent.toFixed(2)}%`, x, y + 5);
    }
  }, [marketData, selectedChartType, indicators, hoveredPoint, showIndicators, width, height]);

  const drawSMA = (ctx: CanvasRenderingContext2D, data: MarketDataPoint[], minPrice: number, priceRange: number, padding: number, chartWidth: number, chartHeight: number) => {
    const period = 20;
    if (data.length < period) return;

    const smaData = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, point) => acc + point.close, 0);
      smaData.push({ time: data[i].timestamp, value: sum / period });
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

  const drawEMA = (ctx: CanvasRenderingContext2D, data: MarketDataPoint[], minPrice: number, priceRange: number, padding: number, chartWidth: number, chartHeight: number) => {
    const period = 12;
    if (data.length < period) return;

    const multiplier = 2 / (period + 1);
    let ema = data[0].close;
    const emaData = [{ time: data[0].timestamp, value: ema }];

    for (let i = 1; i < data.length; i++) {
      ema = (data[i].close * multiplier) + (ema * (1 - multiplier));
      emaData.push({ time: data[i].timestamp, value: ema });
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

  const drawBollingerBands = (ctx: CanvasRenderingContext2D, data: MarketDataPoint[], minPrice: number, priceRange: number, padding: number, chartWidth: number, chartHeight: number) => {
    const period = 20;
    if (data.length < period) return;

    const bbData = [];
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1);
      const sma = slice.reduce((acc, point) => acc + point.close, 0) / period;
      const variance = slice.reduce((acc, point) => acc + Math.pow(point.close - sma, 2), 0) / period;
      const stdDev = Math.sqrt(variance);
      
      bbData.push({
        time: data[i].timestamp,
        upper: sma + (2 * stdDev),
        middle: sma,
        lower: sma - (2 * stdDev)
      });
    }

    // Draw upper band
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    bbData.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * (index + period - 1);
      const y = padding + chartHeight - ((point.upper - minPrice) / priceRange) * chartHeight;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw lower band
    ctx.beginPath();
    bbData.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * (index + period - 1);
      const y = padding + chartHeight - ((point.lower - minPrice) / priceRange) * chartHeight;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw middle line
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    bbData.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * (index + period - 1);
      const y = padding + chartHeight - ((point.middle - minPrice) / priceRange) * chartHeight;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!marketData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const padding = 60;
    const chartWidth = width - (padding * 2);
    const index = Math.round(((x - padding) / chartWidth) * (marketData.dataPoints.length - 1));
    
    if (index >= 0 && index < marketData.dataPoints.length) {
      setHoveredPoint(marketData.dataPoints[index]);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  if (loading) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading real-time data...</p>
      </div>
    );
  }

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
            {symbol} {isAnimating && '🔄'}
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            {marketData && `$${marketData.currentPrice.toFixed(2)} (${marketData.changePercent >= 0 ? '+' : ''}${marketData.changePercent.toFixed(2)}%)`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: animated ? '#059669' : '#ef4444',
            animation: animated ? 'pulse 2s infinite' : 'none'
          }}></div>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {animated ? 'Live' : 'Static'}
          </span>
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
                onClick={() => setSelectedChartType(type.value as any)}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid',
                  borderColor: selectedChartType === type.value ? '#2563eb' : '#d1d5db',
                  backgroundColor: selectedChartType === type.value ? '#eff6ff' : 'white',
                  color: selectedChartType === type.value ? '#2563eb' : '#374151',
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
        {showIndicators && (
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
        )}
      </div>

      {/* Chart Canvas */}
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width: '100%',
            height: `${height}px`,
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            cursor: 'crosshair'
          }}
        />
        
        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            <div>Price: ${hoveredPoint.close.toFixed(2)}</div>
            <div>Volume: {hoveredPoint.volume.toLocaleString()}</div>
            <div>Time: {new Date(hoveredPoint.timestamp).toLocaleTimeString()}</div>
          </div>
        )}
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
          {indicators.includes('bollinger') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '16px', height: '2px', backgroundColor: '#3b82f6' }}></div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Bollinger Bands</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicChart;
