# FinSage Enterprise - API Integration Guide

## 🚀 **REAL-TIME DATA INTEGRATION**

To make the charts truly dynamic with real market data, you'll need to integrate with financial APIs. Here's a step-by-step guide:

### **1. API Providers Setup**

#### **Option A: Alpha Vantage (Recommended for beginners)**
```bash
# Get free API key at: https://www.alphavantage.co/support/#api-key
# Free tier: 5 calls per minute, 500 calls per day
```

#### **Option B: Finnhub (Professional)**
```bash
# Get API key at: https://finnhub.io/
# Free tier: 60 calls per minute
```

#### **Option C: Twelve Data (Comprehensive)**
```bash
# Get API key at: https://twelvedata.com/
# Free tier: 800 calls per day
```

### **2. Environment Variables Setup**

Create `.env.local` file in the project root:

```env
# Alpha Vantage
VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here

# Finnhub
VITE_FINNHUB_API_KEY=your_api_key_here

# Twelve Data
VITE_TWELVE_DATA_API_KEY=your_api_key_here

# News API (for sentiment analysis)
VITE_NEWS_API_KEY=your_api_key_here

# WebSocket endpoints
VITE_WEBSOCKET_URL=wss://ws.finnhub.io?token=your_token
```

### **3. API Service Implementation**

Create `src/services/marketApi.ts`:

```typescript
// Real API integration service
class MarketApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
    this.baseUrl = 'https://www.alphavantage.co/query';
  }

  // Get real-time stock data
  async getRealTimeData(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      );
      const data = await response.json();
      return this.transformAlphaVantageData(data);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      throw error;
    }
  }

  // Get historical data
  async getHistoricalData(symbol: string, timeframe: string): Promise<any> {
    try {
      const functionMap = {
        '1m': 'TIME_SERIES_INTRADAY&interval=1min',
        '5m': 'TIME_SERIES_INTRADAY&interval=5min',
        '15m': 'TIME_SERIES_INTRADAY&interval=15min',
        '1h': 'TIME_SERIES_INTRADAY&interval=60min',
        '1D': 'TIME_SERIES_DAILY',
        '1W': 'TIME_SERIES_WEEKLY',
        '1M': 'TIME_SERIES_MONTHLY'
      };

      const functionName = functionMap[timeframe] || 'TIME_SERIES_DAILY';
      
      const response = await fetch(
        `${this.baseUrl}?function=${functionName}&symbol=${symbol}&apikey=${this.apiKey}`
      );
      const data = await response.json();
      return this.transformHistoricalData(data, timeframe);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  // Get market sentiment data
  async getSentimentData(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/social-sentiment?symbol=${symbol}&from=2024-01-01&to=2024-12-31&token=${import.meta.env.VITE_FINNHUB_API_KEY}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      throw error;
    }
  }

  // Get news data
  async getNewsData(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2024-01-01&to=2024-12-31&token=${import.meta.env.VITE_FINNHUB_API_KEY}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching news data:', error);
      throw error;
    }
  }

  private transformAlphaVantageData(data: any): any {
    const quote = data['Global Quote'];
    if (!quote) throw new Error('Invalid API response');

    return {
      symbol: quote['01. symbol'],
      currentPrice: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open'])
    };
  }

  private transformHistoricalData(data: any, timeframe: string): any[] {
    const timeSeriesKey = this.getTimeSeriesKey(timeframe);
    const timeSeries = data[timeSeriesKey];
    
    if (!timeSeries) throw new Error('Invalid API response');

    return Object.entries(timeSeries).map(([timestamp, values]: [string, any]) => ({
      timestamp: new Date(timestamp).getTime(),
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    })).sort((a, b) => a.timestamp - b.timestamp);
  }

  private getTimeSeriesKey(timeframe: string): string {
    const keyMap = {
      '1m': 'Time Series (1min)',
      '5m': 'Time Series (5min)',
      '15m': 'Time Series (15min)',
      '1h': 'Time Series (60min)',
      '1D': 'Time Series (Daily)',
      '1W': 'Weekly Time Series',
      '1M': 'Monthly Time Series'
    };
    return keyMap[timeframe] || 'Time Series (Daily)';
  }
}

export const marketApiService = new MarketApiService();
```

### **4. WebSocket Integration for Real-time Updates**

Create `src/services/websocketService.ts`:

```typescript
// WebSocket service for real-time data
class WebSocketService {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, ((data: any) => void)[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
    if (!wsUrl) {
      console.warn('WebSocket URL not configured');
      return;
    }

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  subscribe(symbol: string, callback: (data: any) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    this.subscribers.get(symbol)!.push(callback);

    // Subscribe to WebSocket feed
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        symbol: symbol
      }));
    }
  }

  unsubscribe(symbol: string, callback: (data: any) => void) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    }

    // Unsubscribe from WebSocket feed
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        symbol: symbol
      }));
    }
  }

  private handleMessage(data: any) {
    if (data.type === 'trade' && data.data) {
      const symbol = data.data.s;
      const subscribers = this.subscribers.get(symbol);
      if (subscribers) {
        subscribers.forEach(callback => callback(data.data));
      }
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), 5000);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketService = new WebSocketService();
```

### **5. Update Real-time Data Service**

Update `src/services/realtimeData.ts` to use real APIs:

```typescript
import { marketApiService } from './marketApi';
import { websocketService } from './websocketService';

class RealtimeDataService {
  // ... existing code ...

  private async loadRealData(symbol: string): Promise<MarketData> {
    try {
      // Get real-time data
      const realTimeData = await marketApiService.getRealTimeData(symbol);
      
      // Get historical data
      const historicalData = await marketApiService.getHistoricalData(symbol, '1D');
      
      return {
        symbol,
        currentPrice: realTimeData.currentPrice,
        change: realTimeData.change,
        changePercent: realTimeData.changePercent,
        volume: realTimeData.volume,
        high24h: realTimeData.high,
        low24h: realTimeData.low,
        dataPoints: historicalData
      };
    } catch (error) {
      console.error('Error loading real data:', error);
      // Fallback to mock data
      return this.generateInitialData(symbol);
    }
  }

  private startRealTimeUpdates(symbol: string) {
    // Load initial real data
    this.loadRealData(symbol).then(data => {
      this.dataCache.set(symbol, data);
      this.notifySubscribers(symbol, data);
    });

    // Subscribe to WebSocket for real-time updates
    websocketService.subscribe(symbol, (data) => {
      this.updateFromWebSocket(symbol, data);
    });
  }

  private updateFromWebSocket(symbol: string, wsData: any) {
    const currentData = this.dataCache.get(symbol);
    if (!currentData) return;

    const newPoint: MarketDataPoint = {
      timestamp: wsData.t,
      price: wsData.p,
      volume: wsData.v,
      high: wsData.h,
      low: wsData.l,
      open: wsData.o,
      close: wsData.c
    };

    const updatedDataPoints = [...currentData.dataPoints.slice(-99), newPoint];
    
    const updatedData: MarketData = {
      ...currentData,
      currentPrice: newPoint.price,
      change: newPoint.price - currentData.dataPoints[currentData.dataPoints.length - 1].price,
      changePercent: ((newPoint.price - currentData.dataPoints[currentData.dataPoints.length - 1].price) / currentData.dataPoints[currentData.dataPoints.length - 1].price) * 100,
      volume: newPoint.volume,
      high24h: Math.max(...updatedDataPoints.map(d => d.high)),
      low24h: Math.min(...updatedDataPoints.map(d => d.low)),
      dataPoints: updatedDataPoints
    };

    this.dataCache.set(symbol, updatedData);
    this.notifySubscribers(symbol, updatedData);
  }
}
```

### **6. Backend API Integration**

Update your FastAPI backend to include real market data endpoints:

```python
# Add to your FastAPI backend
import requests
import os
from fastapi import APIRouter

router = APIRouter()

@router.get("/api/v1/market/real-time/{symbol}")
async def get_real_time_data(symbol: str):
    """Get real-time market data for a symbol"""
    try:
        # Use your chosen API provider
        api_key = os.getenv("ALPHA_VANTAGE_API_KEY")
        url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}"
        
        response = requests.get(url)
        data = response.json()
        
        # Transform and return data
        return transform_alpha_vantage_data(data)
    except Exception as e:
        return {"error": str(e)}

@router.get("/api/v1/market/historical/{symbol}")
async def get_historical_data(symbol: str, timeframe: str = "1D"):
    """Get historical market data"""
    try:
        # Implementation similar to above
        pass
    except Exception as e:
        return {"error": str(e)}

@router.get("/api/v1/sentiment/{symbol}")
async def get_sentiment_data(symbol: str):
    """Get market sentiment data"""
    try:
        # Use Finnhub or similar service
        pass
    except Exception as e:
        return {"error": str(e)}
```

### **7. Testing the Integration**

1. **Get API Keys**: Sign up for the services above
2. **Add Environment Variables**: Create `.env.local` with your keys
3. **Test API Calls**: Use the browser console to test API calls
4. **Monitor Rate Limits**: Check API usage to avoid hitting limits

### **8. Production Considerations**

- **Rate Limiting**: Implement proper rate limiting
- **Caching**: Cache API responses to reduce calls
- **Error Handling**: Graceful fallbacks when APIs fail
- **Cost Management**: Monitor API usage and costs
- **Security**: Never expose API keys in client-side code

### **9. Alternative: Use Your Backend as Proxy**

For better security and rate limiting, proxy all API calls through your backend:

```typescript
// Frontend calls your backend
const response = await fetch(`/api/v1/market/real-time/${symbol}`);
const data = await response.json();
```

This way, API keys stay secure on your server, and you can implement caching, rate limiting, and data transformation.

---

## 🎯 **NEXT STEPS FOR YOU:**

1. **Choose an API provider** (I recommend starting with Alpha Vantage)
2. **Get your API key** from the chosen provider
3. **Add the environment variables** to your `.env.local` file
4. **Test the integration** by running the app
5. **Let me know if you need help** with any specific API integration!

The charts will then show **real market data** with **smooth animations** just like professional financial websites! 🚀
