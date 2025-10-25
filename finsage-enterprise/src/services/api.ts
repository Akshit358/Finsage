import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  ApiResponse, 
  User, 
  Portfolio, 
  MarketIndicators, 
  PredictionRequest, 
  PredictionResponse,
  SentimentRequest,
  SentimentResponse,
  OptimizationRequest,
  OptimizationResponse,
  RoboAdvisorRequest,
  RoboAdvisorResponse,
  BlockchainStatus,
  PerformanceMetrics,
  PaginatedResponse
} from '../types';

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://54.227.68.44:8000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message);
    
    return Promise.reject(error);
  }
);

// Generic API call wrapper
const apiCall = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  params?: Record<string, any>
): Promise<T> => {
  try {
    const response = await apiClient.request({
      method,
      url: endpoint,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Authentication API
export const authApi = {
  login: (email: string, password: string) =>
    apiCall<{ token: string; user: User }>('POST', '/auth/login', { email, password }),
  
  register: (userData: Partial<User>) =>
    apiCall<{ token: string; user: User }>('POST', '/auth/register', userData),
  
  logout: () =>
    apiCall<void>('POST', '/auth/logout'),
  
  refreshToken: () =>
    apiCall<{ token: string }>('POST', '/auth/refresh'),
  
  forgotPassword: (email: string) =>
    apiCall<void>('POST', '/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    apiCall<void>('POST', '/auth/reset-password', { token, password }),
};

// Mock data for development
const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    userId: 'user123',
    name: 'Growth Portfolio',
    description: 'Aggressive growth focused portfolio',
    totalValue: 125000,
    totalGain: 15000,
    totalGainPercent: 13.64,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    positions: [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 50,
        avgPrice: 150.00,
        currentPrice: 175.00,
        value: 8750,
        gain: 1250,
        gainPercent: 16.67,
        allocation: 7.0
      },
      {
        id: '2',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        shares: 25,
        avgPrice: 120.00,
        currentPrice: 140.00,
        value: 3500,
        gain: 500,
        gainPercent: 16.67,
        allocation: 2.8
      },
      {
        id: '3',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        shares: 30,
        avgPrice: 300.00,
        currentPrice: 350.00,
        value: 10500,
        gain: 1500,
        gainPercent: 16.67,
        allocation: 8.4
      }
    ]
  },
  {
    id: '2',
    userId: 'user123',
    name: 'Conservative Portfolio',
    description: 'Low-risk income focused portfolio',
    totalValue: 75000,
    totalGain: 2500,
    totalGainPercent: 3.45,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    positions: [
      {
        id: '4',
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        shares: 100,
        avgPrice: 150.00,
        currentPrice: 155.00,
        value: 15500,
        gain: 500,
        gainPercent: 3.33,
        allocation: 20.67
      },
      {
        id: '5',
        symbol: 'PG',
        name: 'Procter & Gamble',
        shares: 80,
        avgPrice: 140.00,
        currentPrice: 145.00,
        value: 11600,
        gain: 400,
        gainPercent: 3.57,
        allocation: 15.47
      }
    ]
  }
];

// Portfolio API
export const portfolioApi = {
  getPortfolios: async (userId: string) => {
    try {
      return await apiCall<Portfolio[]>('GET', `/api/v1/portfolio/${userId}`);
    } catch (error) {
      console.log('Using mock portfolio data');
      return mockPortfolios;
    }
  },
  
  getPortfolio: async (userId: string, portfolioId: string) => {
    try {
      return await apiCall<Portfolio>('GET', `/api/v1/portfolio/${userId}/${portfolioId}`);
    } catch (error) {
      console.log('Using mock portfolio data');
      return mockPortfolios.find(p => p.id === portfolioId) || mockPortfolios[0];
    }
  },
  
  createPortfolio: (userId: string, portfolioData: Partial<Portfolio>) =>
    apiCall<Portfolio>('POST', `/api/v1/portfolio/${userId}`, portfolioData),
  
  updatePortfolio: (userId: string, portfolioId: string, portfolioData: Partial<Portfolio>) =>
    apiCall<Portfolio>('PUT', `/api/v1/portfolio/${userId}/${portfolioId}`, portfolioData),
  
  deletePortfolio: (userId: string, portfolioId: string) =>
    apiCall<void>('DELETE', `/api/v1/portfolio/${userId}/${portfolioId}`),
  
  addPosition: (userId: string, portfolioId: string, positionData: any) =>
    apiCall<Portfolio>('POST', `/api/v1/portfolio/${userId}/${portfolioId}/positions`, positionData),
  
  updatePosition: (userId: string, portfolioId: string, positionId: string, positionData: any) =>
    apiCall<Portfolio>('PUT', `/api/v1/portfolio/${userId}/${portfolioId}/positions/${positionId}`, positionData),
  
  removePosition: (userId: string, portfolioId: string, positionId: string) =>
    apiCall<Portfolio>('DELETE', `/api/v1/portfolio/${userId}/${portfolioId}/positions/${positionId}`),
};

// Mock market data
const mockMarketIndicators: MarketIndicators = {
  sp500: { value: 4850.43, change: 1.25, changePercent: 0.03 },
  nasdaq: { value: 15235.71, change: -0.45, changePercent: -0.003 },
  dow: { value: 37856.52, change: 0.89, changePercent: 0.002 },
  vix: { value: 18.45, change: -0.32, changePercent: -0.017 },
  sentiment: 65.5,
  lastUpdated: new Date().toISOString()
};

// Market Data API
export const marketApi = {
  getMarketIndicators: async () => {
    try {
      return await apiCall<MarketIndicators>('GET', '/api/v1/advanced/market/indicators');
    } catch (error) {
      console.log('Using mock market data');
      return mockMarketIndicators;
    }
  },
  
  getStockQuote: (symbol: string) =>
    apiCall<any>('GET', `/api/v1/market/quote/${symbol}`),
  
  getCryptoPrices: () =>
    apiCall<any>('GET', '/api/v1/crypto/prices'),
  
  getCryptoNews: () =>
    apiCall<any>('GET', '/api/v1/crypto/news'),
  
  getEthereumData: () =>
    apiCall<any>('GET', '/api/v1/crypto/ethereum'),
  
  searchSymbols: (query: string) =>
    apiCall<any[]>('GET', '/api/v1/market/search', { q: query }),
};

// Mock prediction data
const generateMockPrediction = (data: PredictionRequest): PredictionResponse => {
  const riskMultiplier = data.riskTolerance === 'aggressive' ? 1.5 : data.riskTolerance === 'moderate' ? 1.0 : 0.5;
  const expectedReturn = 8 + (Math.random() * 12 * riskMultiplier);
  const confidence = 75 + Math.random() * 20;
  const riskScore = data.riskTolerance === 'aggressive' ? 8 : data.riskTolerance === 'moderate' ? 5 : 3;
  
  const recommendations = [
    { symbol: 'AAPL', action: 'BUY', allocation: 25, confidence: 85, reasoning: 'Strong fundamentals and growth potential' },
    { symbol: 'GOOGL', action: 'BUY', allocation: 20, confidence: 80, reasoning: 'AI leadership and cloud growth' },
    { symbol: 'MSFT', action: 'BUY', allocation: 15, confidence: 82, reasoning: 'Cloud computing dominance' },
    { symbol: 'JNJ', action: 'HOLD', allocation: 10, confidence: 70, reasoning: 'Stable dividend income' },
    { symbol: 'VTI', action: 'BUY', allocation: 30, confidence: 90, reasoning: 'Broad market diversification' }
  ];

  return {
    id: `pred_${Date.now()}`,
    userId: 'user123',
    prediction: {
      expectedReturn,
      confidence,
      riskScore,
      marketTrend: expectedReturn > 12 ? 'Bullish' : expectedReturn > 8 ? 'Neutral' : 'Bearish',
      recommendations
    },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
};

// AI Prediction API
export const predictionApi = {
  getPrediction: async (data: PredictionRequest) => {
    try {
      return await apiCall<PredictionResponse>('POST', '/api/v1/prediction/predict', data);
    } catch (error) {
      console.log('Using mock prediction data');
      return generateMockPrediction(data);
    }
  },
  
  getPredictionHistory: (userId: string) =>
    apiCall<PredictionResponse[]>('GET', `/api/v1/prediction/history/${userId}`),
  
  savePrediction: (userId: string, prediction: PredictionResponse) =>
    apiCall<void>('POST', `/api/v1/prediction/save/${userId}`, prediction),
};

// Sentiment Analysis API
export const sentimentApi = {
  analyzeSentiment: (data: SentimentRequest) =>
    apiCall<SentimentResponse>('POST', '/api/v1/advanced/sentiment/analyze', data),
  
  getSentimentHistory: (symbol?: string, timeframe?: string) =>
    apiCall<SentimentResponse[]>('GET', '/api/v1/advanced/sentiment/history', { symbol, timeframe }),
};

// Portfolio Optimization API
export const optimizationApi = {
  optimizePortfolio: (data: OptimizationRequest) =>
    apiCall<OptimizationResponse>('POST', '/api/v1/advanced/portfolio/optimize', data),
  
  getOptimizationHistory: (userId: string) =>
    apiCall<OptimizationResponse[]>('GET', `/api/v1/advanced/portfolio/optimization-history/${userId}`),
};

// Performance Analytics API
export const analyticsApi = {
  getPerformanceMetrics: (userId: string, portfolioId: string, timeframe?: string) =>
    apiCall<PerformanceMetrics>('GET', `/api/v1/analytics/performance/${userId}/${portfolioId}`, { timeframe }),
  
  getPortfolioAnalytics: (userId: string, portfolioId: string) =>
    apiCall<any>('GET', `/api/v1/analytics/portfolio/${userId}/${portfolioId}`),
  
  getBenchmarkComparison: (userId: string, portfolioId: string, benchmark: string) =>
    apiCall<any>('GET', `/api/v1/analytics/benchmark/${userId}/${portfolioId}`, { benchmark }),
};

// Robo-Advisor API
export const roboAdvisorApi = {
  getRecommendations: (data: RoboAdvisorRequest) =>
    apiCall<RoboAdvisorResponse>('POST', '/api/v1/advanced/robo-advisor/recommendations', data),
  
  getQuestionnaire: () =>
    apiCall<any>('GET', '/api/v1/advanced/robo-advisor/questionnaire'),
  
  saveProfile: (userId: string, profile: RoboAdvisorRequest) =>
    apiCall<void>('POST', `/api/v1/advanced/robo-advisor/profile/${userId}`, profile),
};

// Blockchain API
export const blockchainApi = {
  getStatus: () =>
    apiCall<BlockchainStatus>('GET', '/api/v1/blockchain/status'),
  
  getBalance: (address: string) =>
    apiCall<any>('GET', `/api/v1/blockchain/balance/${address}`),
  
  getTransactions: (address: string) =>
    apiCall<any[]>('GET', `/api/v1/blockchain/transactions/${address}`),
  
  connectWallet: (address: string) =>
    apiCall<void>('POST', '/api/v1/blockchain/connect', { address }),
  
  disconnectWallet: () =>
    apiCall<void>('POST', '/api/v1/blockchain/disconnect'),
};

// Education API
export const educationApi = {
  getTopics: () =>
    apiCall<any[]>('GET', '/api/v1/education/topics'),
  
  getGlossary: () =>
    apiCall<any[]>('GET', '/api/v1/education/glossary'),
  
  getArticle: (id: string) =>
    apiCall<any>('GET', `/api/v1/education/articles/${id}`),
  
  searchContent: (query: string) =>
    apiCall<any[]>('GET', '/api/v1/education/search', { q: query }),
};

// Goals API
export const goalsApi = {
  getGoals: (userId: string) =>
    apiCall<any[]>('GET', `/api/v1/goals/${userId}`),
  
  createGoal: (userId: string, goalData: any) =>
    apiCall<any>('POST', `/api/v1/goals/${userId}`, goalData),
  
  updateGoal: (userId: string, goalId: string, goalData: any) =>
    apiCall<any>('PUT', `/api/v1/goals/${userId}/${goalId}`, goalData),
  
  deleteGoal: (userId: string, goalId: string) =>
    apiCall<void>('DELETE', `/api/v1/goals/${userId}/${goalId}`),
};

// Alerts API
export const alertsApi = {
  getAlerts: (userId: string) =>
    apiCall<any[]>('GET', `/api/v1/alerts/${userId}`),
  
  createAlert: (userId: string, alertData: any) =>
    apiCall<any>('POST', `/api/v1/alerts/${userId}`, alertData),
  
  updateAlert: (userId: string, alertId: string, alertData: any) =>
    apiCall<any>('PUT', `/api/v1/alerts/${userId}/${alertId}`, alertData),
  
  deleteAlert: (userId: string, alertId: string) =>
    apiCall<void>('DELETE', `/api/v1/alerts/${userId}/${alertId}`),
  
  markAsRead: (userId: string, alertId: string) =>
    apiCall<void>('POST', `/api/v1/alerts/${userId}/${alertId}/read`),
};

// User API
export const userApi = {
  getProfile: (userId: string) =>
    apiCall<User>('GET', `/api/v1/user/${userId}`),
  
  updateProfile: (userId: string, userData: Partial<User>) =>
    apiCall<User>('PUT', `/api/v1/user/${userId}`, userData),
  
  updatePreferences: (userId: string, preferences: any) =>
    apiCall<User>('PUT', `/api/v1/user/${userId}/preferences`, preferences),
  
  changePassword: (userId: string, passwordData: any) =>
    apiCall<void>('POST', `/api/v1/user/${userId}/change-password`, passwordData),
  
  deleteAccount: (userId: string) =>
    apiCall<void>('DELETE', `/api/v1/user/${userId}`),
};

// Health Check API
export const healthApi = {
  checkHealth: () =>
    apiCall<{ status: string; timestamp: string }>('GET', '/health'),
  
  checkServices: () =>
    apiCall<Record<string, { status: string; latency: number }>>('GET', '/health/services'),
};

export default apiClient;
