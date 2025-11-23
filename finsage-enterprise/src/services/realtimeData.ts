// Real-time data service for dynamic charts and market data
export interface MarketDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface MarketData {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  dataPoints: MarketDataPoint[];
}

class RealtimeDataService {
  private subscribers: Map<string, ((data: MarketData) => void)[]> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private dataCache: Map<string, MarketData> = new Map();

  // Subscribe to real-time data for a symbol
  subscribe(symbol: string, callback: (data: MarketData) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    this.subscribers.get(symbol)!.push(callback);

    // Start real-time updates if this is the first subscriber
    if (this.subscribers.get(symbol)!.length === 1) {
      this.startRealTimeUpdates(symbol);
    }

    // Return current data immediately
    if (this.dataCache.has(symbol)) {
      callback(this.dataCache.get(symbol)!);
    }
  }

  // Unsubscribe from real-time data
  unsubscribe(symbol: string, callback: (data: MarketData) => void) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }

      // Stop real-time updates if no more subscribers
      if (subscribers.length === 0) {
        this.stopRealTimeUpdates(symbol);
      }
    }
  }

  private startRealTimeUpdates(symbol: string) {
    // Generate initial data
    const initialData = this.generateInitialData(symbol);
    this.dataCache.set(symbol, initialData);

    // Start updating every 2 seconds for smooth animation
    const interval = setInterval(() => {
      this.updateMarketData(symbol);
    }, 2000);

    this.intervals.set(symbol, interval);
  }

  private stopRealTimeUpdates(symbol: string) {
    const interval = this.intervals.get(symbol);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(symbol);
    }
  }

  private generateInitialData(symbol: string): MarketData {
    const basePrice = this.getBasePrice(symbol);
    const now = Date.now();
    const dataPoints: MarketDataPoint[] = [];

    // Generate 100 data points for the last 24 hours
    for (let i = 0; i < 100; i++) {
      const timestamp = now - (100 - i) * 15 * 60 * 1000; // 15-minute intervals
      const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
      const volume = Math.random() * 1000000;
      
      dataPoints.push({
        timestamp,
        price,
        volume,
        high: price + Math.random() * basePrice * 0.02,
        low: price - Math.random() * basePrice * 0.02,
        open: i === 0 ? price : dataPoints[i - 1].close,
        close: price
      });
    }

    const currentPrice = dataPoints[dataPoints.length - 1].price;
    const previousPrice = dataPoints[dataPoints.length - 2].price;
    const change = currentPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;

    return {
      symbol,
      currentPrice,
      change,
      changePercent,
      volume: dataPoints[dataPoints.length - 1].volume,
      high24h: Math.max(...dataPoints.map(d => d.high)),
      low24h: Math.min(...dataPoints.map(d => d.low)),
      dataPoints
    };
  }

  private updateMarketData(symbol: string) {
    const currentData = this.dataCache.get(symbol);
    if (!currentData) return;

    const lastPoint = currentData.dataPoints[currentData.dataPoints.length - 1];
    const now = Date.now();
    
    // Generate new price with realistic movement
    const volatility = 0.02; // 2% volatility
    const trend = (Math.random() - 0.5) * 0.001; // Small trend component
    const randomWalk = (Math.random() - 0.5) * volatility;
    
    const newPrice = lastPoint.price * (1 + trend + randomWalk);
    const newVolume = Math.random() * 1000000;
    
    const newPoint: MarketDataPoint = {
      timestamp: now,
      price: newPrice,
      volume: newVolume,
      high: Math.max(newPrice, lastPoint.high),
      low: Math.min(newPrice, lastPoint.low),
      open: lastPoint.close,
      close: newPrice
    };

    // Add new point and remove oldest if we have too many
    const updatedDataPoints = [...currentData.dataPoints.slice(-99), newPoint];
    
    const updatedData: MarketData = {
      ...currentData,
      currentPrice: newPrice,
      change: newPrice - currentData.dataPoints[currentData.dataPoints.length - 2].price,
      changePercent: ((newPrice - currentData.dataPoints[currentData.dataPoints.length - 2].price) / currentData.dataPoints[currentData.dataPoints.length - 2].price) * 100,
      volume: newVolume,
      high24h: Math.max(...updatedDataPoints.map(d => d.high)),
      low24h: Math.min(...updatedDataPoints.map(d => d.low)),
      dataPoints: updatedDataPoints
    };

    this.dataCache.set(symbol, updatedData);

    // Notify all subscribers
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(updatedData));
    }
  }

  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'AAPL': 175.00,
      'GOOGL': 140.00,
      'MSFT': 350.00,
      'TSLA': 250.00,
      'AMZN': 150.00,
      'NVDA': 450.00,
      'META': 300.00,
      'NFLX': 400.00,
      'SPY': 485.00,
      'QQQ': 380.00,
      'BTC': 45000.00,
      'ETH': 3000.00
    };
    
    return basePrices[symbol] || 100.00;
  }

  // Get historical data for a specific timeframe
  getHistoricalData(symbol: string, timeframe: string): MarketDataPoint[] {
    const data = this.dataCache.get(symbol);
    if (!data) return [];

    const now = Date.now();
    let intervalMs: number;

    switch (timeframe) {
      case '1m': intervalMs = 60 * 1000; break;
      case '5m': intervalMs = 5 * 60 * 1000; break;
      case '15m': intervalMs = 15 * 60 * 1000; break;
      case '1h': intervalMs = 60 * 60 * 1000; break;
      case '4h': intervalMs = 4 * 60 * 60 * 1000; break;
      case '1D': intervalMs = 24 * 60 * 60 * 1000; break;
      case '1W': intervalMs = 7 * 24 * 60 * 60 * 1000; break;
      case '1M': intervalMs = 30 * 24 * 60 * 60 * 1000; break;
      default: intervalMs = 15 * 60 * 1000;
    }

    const points = Math.min(100, Math.floor(24 * 60 * 60 * 1000 / intervalMs));
    const filteredPoints = data.dataPoints.filter(point => 
      now - point.timestamp <= 24 * 60 * 60 * 1000
    );

    return filteredPoints.slice(-points);
  }
}

export const realtimeDataService = new RealtimeDataService();
