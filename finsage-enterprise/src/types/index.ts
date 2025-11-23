// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  portfolioAlerts: boolean;
  marketUpdates: boolean;
}

// Portfolio Types
export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  positions: Position[];
  createdAt: string;
  updatedAt: string;
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPercent: number;
  allocation: number;
  sector?: string;
  createdAt: string;
}

// Market Data Types
export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  pe: number;
  eps: number;
  dividend: number;
  dividendYield: number;
  lastUpdated: string;
}

export interface MarketIndicators {
  sp500: MarketData;
  nasdaq: MarketData;
  dow: MarketData;
  vix: MarketData;
  sectors: SectorPerformance[];
  gainers: MarketData[];
  losers: MarketData[];
  lastUpdated: string;
}

export interface SectorPerformance {
  name: string;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
}

// AI Prediction Types
export interface PredictionRequest {
  age: number;
  annualIncome: number;
  financialGoals: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: number;
  dependents: number;
  debtAmount: number;
  monthlyExpenses: number;
  currentInvestments?: number;
}

export interface PredictionResponse {
  prediction: {
    marketTrend: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    recommendations: Recommendation[];
    expectedReturn: number;
    riskScore: number;
    nextUpdate: string;
  };
  input: PredictionRequest;
  timestamp: string;
}

export interface Recommendation {
  symbol: string;
  name: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  targetPrice?: number;
  reasoning: string;
  sector: string;
}

// Sentiment Analysis Types
export interface SentimentRequest {
  symbol?: string;
  sector?: string;
  timeframe?: '1d' | '7d' | '30d' | '90d';
}

export interface SentimentResponse {
  sentiment: {
    score: number; // -100 to 100
    trend: 'positive' | 'negative' | 'neutral';
    confidence: number;
    factors: SentimentFactor[];
    news: NewsItem[];
    socialMentions: number;
    analystRatings: AnalystRating[];
  };
  symbol?: string;
  sector?: string;
  timeframe: string;
  lastUpdated: string;
}

export interface SentimentFactor {
  name: string;
  impact: number; // -100 to 100
  weight: number; // 0 to 1
  description: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: number;
}

export interface AnalystRating {
  firm: string;
  rating: 'BUY' | 'SELL' | 'HOLD';
  targetPrice: number;
  currentPrice: number;
  publishedAt: string;
}

// Analytics Types
export interface PerformanceMetrics {
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  alpha: number;
  beta: number;
  volatility: number;
  informationRatio: number;
  calmarRatio: number;
  treynorRatio: number;
  jensenAlpha: number;
}

export interface OptimizationRequest {
  currentHoldings: Position[];
  riskTolerance: number;
  constraints: OptimizationConstraints;
  objective: 'maximize_return' | 'minimize_risk' | 'maximize_sharpe';
}

export interface OptimizationConstraints {
  maxWeight?: number;
  minWeight?: number;
  maxSectorWeight?: number;
  minSectorWeight?: number;
  maxPositions?: number;
  minPositions?: number;
  excludeSectors?: string[];
  includeSectors?: string[];
}

export interface OptimizationResponse {
  optimized: Position[];
  current: Position[];
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  rebalancingActions: RebalancingAction[];
  performance: {
    expectedReturn: number;
    risk: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export interface RebalancingAction {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  currentWeight: number;
  targetWeight: number;
  sharesChange: number;
  valueChange: number;
  priority: 'high' | 'medium' | 'low';
}

// Robo-Advisor Types
export interface RoboAdvisorRequest {
  financialSituation: {
    age: number;
    income: number;
    expenses: number;
    savings: number;
    debt: number;
    dependents: number;
  };
  investmentKnowledge: 'beginner' | 'intermediate' | 'advanced';
  riskAssessment: {
    questions: RiskQuestion[];
    score: number;
  };
  goals: {
    primary: string;
    secondary: string[];
    timeline: number;
    amount: number;
  };
  preferences: {
    esg: boolean;
    dividend: boolean;
    growth: boolean;
    value: boolean;
  };
}

export interface RiskQuestion {
  id: string;
  question: string;
  options: RiskOption[];
  selected?: string;
}

export interface RiskOption {
  value: string;
  text: string;
  score: number;
}

export interface RoboAdvisorResponse {
  strategy: {
    name: string;
    description: string;
    riskLevel: 'conservative' | 'moderate' | 'aggressive';
    expectedReturn: number;
    expectedRisk: number;
  };
  portfolio: {
    allocation: AssetAllocation[];
    rebalancing: string;
    monitoring: string;
  };
  recommendations: {
    products: ProductRecommendation[];
    actions: ActionRecommendation[];
    education: EducationResource[];
  };
  nextSteps: string[];
}

export interface AssetAllocation {
  category: string;
  percentage: number;
  description: string;
  examples: string[];
}

export interface ProductRecommendation {
  name: string;
  type: 'ETF' | 'Mutual Fund' | 'Stock' | 'Bond';
  symbol: string;
  allocation: number;
  reasoning: string;
  risk: 'low' | 'medium' | 'high';
  fees: number;
}

export interface ActionRecommendation {
  action: string;
  priority: 'high' | 'medium' | 'low';
  timeline: string;
  description: string;
}

export interface EducationResource {
  title: string;
  type: 'article' | 'video' | 'course' | 'tool';
  url: string;
  description: string;
  duration: string;
}

// Blockchain Types
export interface BlockchainStatus {
  connected: boolean;
  network: string;
  address?: string;
  balance: number;
  transactions: Transaction[];
  lastUpdated: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  gasUsed: number;
  gasPrice: number;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// API Error Types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
