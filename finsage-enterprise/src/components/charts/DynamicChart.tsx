import React, { useState, useEffect, useRef, useCallback } from 'react';
import { realtimeDataService, MarketData, MarketDataPoint } from '../../services/realtimeData';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Download, 
  Share2, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  Target, 
  AlertTriangle, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown,
  MousePointer,
  Move,
  RotateCcw,
  Save,
  Bookmark,
  BookmarkCheck,
  Filter,
  Search,
  Plus,
  X,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  Volume2,
  Layers,
  Grid3X3,
  Maximize,
  Minimize
} from 'lucide-react';

interface DynamicChartProps {
  symbol: string;
  timeframe?: string;
  height?: number;
  width?: number;
  chartType?: 'line' | 'candlestick' | 'area' | 'bar' | 'scatter';
  showIndicators?: boolean;
  animated?: boolean;
  interactive?: boolean;
  fullscreen?: boolean;
  onDataPointClick?: (point: MarketDataPoint) => void;
  onTimeframeChange?: (timeframe: string) => void;
  onChartTypeChange?: (chartType: string) => void;
}

const DynamicChart: React.FC<DynamicChartProps> = ({ 
  symbol = 'AAPL', 
  timeframe = '1D',
  height = 400,
  width = 800,
  chartType = 'line',
  showIndicators = true,
  animated = true,
  interactive = true,
  fullscreen = false,
  onDataPointClick,
  onTimeframeChange,
  onChartTypeChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [indicators, setIndicators] = useState<string[]>(['SMA', 'EMA']);
  const [hoveredPoint, setHoveredPoint] = useState<MarketDataPoint | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(fullscreen);
  const [showSettings, setShowSettings] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [showCrosshair, setShowCrosshair] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [favoriteChart, setFavoriteChart] = useState(false);
  const [chartHistory, setChartHistory] = useState<MarketData[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const timeframes = [
    { value: '1m', label: '1M', icon: '⚡' },
    { value: '5m', label: '5M', icon: '⚡' },
    { value: '15m', label: '15M', icon: '⚡' },
    { value: '1h', label: '1H', icon: '🕐' },
    { value: '4h', label: '4H', icon: '🕐' },
    { value: '1D', label: '1D', icon: '📅' },
    { value: '1W', label: '1W', icon: '📅' },
    { value: '1M', label: '1M', icon: '📅' }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line', icon: '📈', color: '#3b82f6' },
    { value: 'candlestick', label: 'Candlestick', icon: '🕯️', color: '#10b981' },
    { value: 'area', label: 'Area', icon: '📊', color: '#8b5cf6' },
    { value: 'bar', label: 'Bar', icon: '📊', color: '#f59e0b' },
    { value: 'scatter', label: 'Scatter', icon: '🔵', color: '#ef4444' }
  ];

  const availableIndicators = [
    { value: 'SMA', label: 'Simple Moving Average', color: '#3b82f6' },
    { value: 'EMA', label: 'Exponential Moving Average', color: '#10b981' },
    { value: 'RSI', label: 'Relative Strength Index', color: '#f59e0b' },
    { value: 'MACD', label: 'MACD', color: '#8b5cf6' },
    { value: 'BB', label: 'Bollinger Bands', color: '#ef4444' },
    { value: 'STOCH', label: 'Stochastic', color: '#06b6d4' },
    { value: 'ATR', label: 'Average True Range', color: '#84cc16' },
    { value: 'ADX', label: 'ADX', color: '#f97316' }
  ];

  const loadMarketData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await realtimeDataService.getMarketData(symbol, selectedTimeframe);
      setMarketData(data);
      
      // Add to history
      setChartHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), data]);
      setCurrentHistoryIndex(prev => prev + 1);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading market data:', error);
      setLoading(false);
    }
  }, [symbol, selectedTimeframe, currentHistoryIndex]);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !marketData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: canvasWidth, height: canvasHeight } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Set up drawing parameters
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = canvasWidth - padding.left - padding.right;
    const chartHeight = canvasHeight - padding.top - padding.bottom;
    
    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      for (let i = 0; i <= 10; i++) {
        const x = padding.left + (chartWidth / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + chartHeight);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let i = 0; i <= 8; i++) {
        const y = padding.top + (chartHeight / 8) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();
      }
    }
    
    // Calculate price range
    const prices = marketData.data.map(point => point.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.1;
    
    // Draw price axis
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 8; i++) {
      const price = maxPrice + pricePadding - ((priceRange + pricePadding * 2) / 8) * i;
      const y = padding.top + (chartHeight / 8) * i;
      ctx.fillText(price.toFixed(2), padding.left - 10, y + 4);
    }
    
    // Draw time axis
    ctx.textAlign = 'center';
    const timeStep = Math.max(1, Math.floor(marketData.data.length / 10));
    
    for (let i = 0; i < marketData.data.length; i += timeStep) {
      const x = padding.left + (chartWidth / marketData.data.length) * i;
      const time = new Date(marketData.data[i].timestamp);
      ctx.fillText(time.toLocaleTimeString(), x, canvasHeight - padding.bottom + 20);
    }
    
    // Draw chart based on type
    if (selectedChartType === 'line') {
      drawLineChart(ctx, marketData, padding, chartWidth, chartHeight, minPrice, maxPrice, priceRange, pricePadding);
    } else if (selectedChartType === 'area') {
      drawAreaChart(ctx, marketData, padding, chartWidth, chartHeight, minPrice, maxPrice, priceRange, pricePadding);
    } else if (selectedChartType === 'candlestick') {
      drawCandlestickChart(ctx, marketData, padding, chartWidth, chartHeight, minPrice, maxPrice, priceRange, pricePadding);
    }
    
    // Draw indicators
    if (showIndicators && indicators.length > 0) {
      drawIndicators(ctx, marketData, padding, chartWidth, chartHeight, minPrice, maxPrice, priceRange, pricePadding);
    }
    
    // Draw crosshair
    if (showCrosshair && hoveredPoint) {
      drawCrosshair(ctx, hoveredPoint, padding, chartWidth, chartHeight, minPrice, maxPrice, priceRange, pricePadding);
    }
    
    // Draw selected range
    if (selectedRange) {
      drawSelectedRange(ctx, selectedRange, padding, chartWidth, chartHeight);
    }
    
  }, [marketData, selectedChartType, indicators, showIndicators, showGrid, showCrosshair, hoveredPoint, selectedRange]);

  const drawLineChart = (ctx: CanvasRenderingContext2D, data: MarketData, padding: any, chartWidth: number, chartHeight: number, minPrice: number, maxPrice: number, priceRange: number, pricePadding: number) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.data.forEach((point, index) => {
      const x = padding.left + (chartWidth / data.data.length) * index;
      const y = padding.top + chartHeight - ((point.price - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#3b82f6';
    data.data.forEach((point, index) => {
      const x = padding.left + (chartWidth / data.data.length) * index;
      const y = padding.top + chartHeight - ((point.price - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawAreaChart = (ctx: CanvasRenderingContext2D, data: MarketData, padding: any, chartWidth: number, chartHeight: number, minPrice: number, maxPrice: number, priceRange: number, pricePadding: number) => {
    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    data.data.forEach((point, index) => {
      const x = padding.left + (chartWidth / data.data.length) * index;
      const y = padding.top + chartHeight - ((point.price - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, padding.top + chartHeight);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawCandlestickChart = (ctx: CanvasRenderingContext2D, data: MarketData, padding: any, chartWidth: number, chartHeight: number, minPrice: number, maxPrice: number, priceRange: number, pricePadding: number) => {
    const candleWidth = Math.max(2, chartWidth / data.data.length * 0.8);
    
    data.data.forEach((point, index) => {
      const x = padding.left + (chartWidth / data.data.length) * index;
      const high = padding.top + chartHeight - ((point.high - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
      const low = padding.top + chartHeight - ((point.low - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
      const open = padding.top + chartHeight - ((point.open - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
      const close = padding.top + chartHeight - ((point.price - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
      
      const isGreen = close > open;
      ctx.strokeStyle = isGreen ? '#10b981' : '#ef4444';
      ctx.fillStyle = isGreen ? '#10b981' : '#ef4444';
      
      // Draw wick
      ctx.beginPath();
      ctx.moveTo(x, high);
      ctx.lineTo(x, low);
      ctx.stroke();
      
      // Draw body
      const bodyTop = Math.min(open, close);
      const bodyBottom = Math.max(open, close);
      const bodyHeight = Math.max(1, bodyBottom - bodyTop);
      
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });
  };

  const drawIndicators = (ctx: CanvasRenderingContext2D, data: MarketData, padding: any, chartWidth: number, chartHeight: number, minPrice: number, maxPrice: number, priceRange: number, pricePadding: number) => {
    indicators.forEach((indicator, index) => {
      const indicatorData = calculateIndicator(data, indicator);
      const color = availableIndicators.find(ind => ind.value === indicator)?.color || '#6b7280';
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      indicatorData.forEach((value, i) => {
        const x = padding.left + (chartWidth / data.data.length) * i;
        const y = padding.top + chartHeight - ((value - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      ctx.setLineDash([]);
    });
  };

  const drawCrosshair = (ctx: CanvasRenderingContext2D, point: MarketDataPoint, padding: any, chartWidth: number, chartHeight: number, minPrice: number, maxPrice: number, priceRange: number, pricePadding: number) => {
    const index = marketData?.data.findIndex(p => p.timestamp === point.timestamp) || 0;
    const x = padding.left + (chartWidth / (marketData?.data.length || 1)) * index;
    const y = padding.top + chartHeight - ((point.price - minPrice + pricePadding) / (priceRange + pricePadding * 2)) * chartHeight;
    
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + chartHeight);
    ctx.stroke();
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const drawSelectedRange = (ctx: CanvasRenderingContext2D, range: { start: number; end: number }, padding: any, chartWidth: number, chartHeight: number) => {
    const startX = padding.left + (chartWidth / (marketData?.data.length || 1)) * range.start;
    const endX = padding.left + (chartWidth / (marketData?.data.length || 1)) * range.end;
    
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(startX, padding.top, endX - startX, chartHeight);
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, padding.top, endX - startX, chartHeight);
  };

  const calculateIndicator = (data: MarketData, indicator: string): number[] => {
    const prices = data.data.map(point => point.price);
    
    switch (indicator) {
      case 'SMA':
        return calculateSMA(prices, 20);
      case 'EMA':
        return calculateEMA(prices, 20);
      case 'RSI':
        return calculateRSI(prices, 14);
      case 'MACD':
        return calculateMACD(prices);
      case 'BB':
        return calculateBollingerBands(prices, 20, 2);
      default:
        return prices;
    }
  };

  const calculateSMA = (prices: number[], period: number): number[] => {
    const result: number[] = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
    return result;
  };

  const calculateEMA = (prices: number[], period: number): number[] => {
    const result: number[] = [];
    const multiplier = 2 / (period + 1);
    
    result[0] = prices[0];
    for (let i = 1; i < prices.length; i++) {
      result[i] = (prices[i] * multiplier) + (result[i - 1] * (1 - multiplier));
    }
    
    return result;
  };

  const calculateRSI = (prices: number[], period: number): number[] => {
    const result: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }
    
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      result.push(rsi);
    }
    
    return result;
  };

  const calculateMACD = (prices: number[]): number[] => {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const result: number[] = [];
    
    for (let i = 0; i < Math.min(ema12.length, ema26.length); i++) {
      result.push(ema12[i] - ema26[i]);
    }
    
    return result;
  };

  const calculateBollingerBands = (prices: number[], period: number, stdDev: number): number[] => {
    const sma = calculateSMA(prices, period);
    const result: number[] = [];
    
    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i - period + 1];
      const variance = slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      result.push(mean + (standardDeviation * stdDev));
    }
    
    return result;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!marketData || !interactive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = canvas.width - padding.left - padding.right;
    const chartHeight = canvas.height - padding.top - padding.bottom;
    
    if (x >= padding.left && x <= padding.left + chartWidth && y >= padding.top && y <= padding.top + chartHeight) {
      const dataIndex = Math.floor(((x - padding.left) / chartWidth) * marketData.data.length);
      const point = marketData.data[dataIndex];
      
      if (point) {
        setHoveredPoint(point);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
        setShowTooltip(true);
      }
    } else {
      setShowTooltip(false);
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setHoveredPoint(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!marketData || !interactive || !hoveredPoint) return;
    
    if (onDataPointClick) {
      onDataPointClick(hoveredPoint);
    }
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setSelectedTimeframe(newTimeframe);
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
  };

  const handleChartTypeChange = (newChartType: string) => {
    setSelectedChartType(newChartType as any);
    if (onChartTypeChange) {
      onChartTypeChange(newChartType);
    }
  };

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(ind => ind !== indicator)
        : [...prev, indicator]
    );
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 5));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const saveChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${symbol}_chart_${selectedTimeframe}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareChart = () => {
    if (navigator.share) {
      navigator.share({
        title: `${symbol} Chart`,
        text: `Check out this ${symbol} chart on FinSage`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const goBack = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1);
      setMarketData(chartHistory[currentHistoryIndex - 1]);
    }
  };

  const goForward = () => {
    if (currentHistoryIndex < chartHistory.length - 1) {
      setCurrentHistoryIndex(prev => prev + 1);
      setMarketData(chartHistory[currentHistoryIndex + 1]);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  useEffect(() => {
    if (isPlaying && animated) {
      const interval = setInterval(() => {
        loadMarketData();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, animated, loadMarketData]);

  return (
    <div ref={containerRef} className={`bg-white rounded-xl shadow-lg border border-gray-200 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Chart Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">{symbol} Chart</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">{isPlaying ? 'Live' : 'Paused'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-md transition-all duration-200 ${
                isPlaying ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            
            {/* History Navigation */}
            <button
              onClick={goBack}
              disabled={currentHistoryIndex <= 0}
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goForward}
              disabled={currentHistoryIndex >= chartHistory.length - 1}
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Zoom Controls */}
            <button onClick={zoomIn} className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={zoomOut} className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={resetZoom} className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
              <RotateCcw className="w-4 h-4" />
            </button>
            
            {/* Actions */}
            <button onClick={saveChart} className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={shareChart} className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={toggleFullscreen} className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setFavoriteChart(!favoriteChart)}
              className={`p-2 rounded-md transition-all duration-200 ${
                favoriteChart ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {favoriteChart ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Timeframe:</span>
            <div className="flex space-x-1">
              {timeframes.map(timeframe => (
                <button
                  key={timeframe.value}
                  onClick={() => handleTimeframeChange(timeframe.value)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedTimeframe === timeframe.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {timeframe.icon} {timeframe.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Type:</span>
            <div className="flex space-x-1">
              {chartTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleChartTypeChange(type.value)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedChartType === type.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Display Options */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-md transition-all duration-200 ${
                showGrid ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCrosshair(!showCrosshair)}
              className={`p-2 rounded-md transition-all duration-200 ${
                showCrosshair ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <MousePointer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`p-2 rounded-md transition-all duration-200 ${
                showVolume ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Technical Indicators</h4>
          <div className="flex flex-wrap gap-2">
            {availableIndicators.map(indicator => (
              <button
                key={indicator.value}
                onClick={() => toggleIndicator(indicator.value)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  indicators.includes(indicator.value)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {indicator.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={isFullscreen ? window.innerWidth - 32 : width}
          height={isFullscreen ? window.innerHeight - 200 : height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="cursor-crosshair"
        />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="flex items-center space-x-2">
              <LoadingSpinner />
              <span className="text-gray-600">Loading chart data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="text-sm">
            <div className="font-medium">{symbol}</div>
            <div>Price: ${hoveredPoint.price.toFixed(2)}</div>
            <div>Volume: {hoveredPoint.volume.toLocaleString()}</div>
            <div>Time: {new Date(hoveredPoint.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      {/* Chart Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
            <span>Indicators: {indicators.length}</span>
            <span>Data Points: {marketData?.data.length || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Last Update: {marketData?.lastUpdate ? new Date(marketData.lastUpdate).toLocaleTimeString() : 'N/A'}</span>
            <button
              onClick={() => loadMarketData()}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicChart;