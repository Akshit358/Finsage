import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  portfolioApi, 
  marketApi, 
  predictionApi, 
  sentimentApi, 
  optimizationApi, 
  analyticsApi, 
  roboAdvisorApi, 
  blockchainApi,
  educationApi,
  goalsApi,
  alertsApi,
  userApi,
  healthApi
} from '../services/api';
import { 
  Portfolio, 
  // MarketIndicators, 
  PredictionRequest, 
  PredictionResponse,
  SentimentRequest,
  // SentimentResponse,
  OptimizationRequest,
  // OptimizationResponse,
  RoboAdvisorRequest,
  // RoboAdvisorResponse,
  // BlockchainStatus,
  // PerformanceMetrics,
  User
} from '../types';

// Portfolio hooks
export const usePortfolios = (userId: string) => {
  return useQuery({
    queryKey: ['portfolios', userId],
    queryFn: () => portfolioApi.getPortfolios(userId),
    enabled: !!userId,
  });
};

export const usePortfolio = (userId: string, portfolioId: string) => {
  return useQuery({
    queryKey: ['portfolio', userId, portfolioId],
    queryFn: () => portfolioApi.getPortfolio(userId, portfolioId),
    enabled: !!userId && !!portfolioId,
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, portfolioData }: { userId: string; portfolioData: Partial<Portfolio> }) =>
      portfolioApi.createPortfolio(userId, portfolioData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['portfolios', userId] });
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, portfolioId, portfolioData }: { 
      userId: string; 
      portfolioId: string; 
      portfolioData: Partial<Portfolio> 
    }) => portfolioApi.updatePortfolio(userId, portfolioId, portfolioData),
    onSuccess: (_, { userId, portfolioId }) => {
      queryClient.invalidateQueries({ queryKey: ['portfolios', userId] });
      queryClient.invalidateQueries({ queryKey: ['portfolio', userId, portfolioId] });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, portfolioId }: { userId: string; portfolioId: string }) =>
      portfolioApi.deletePortfolio(userId, portfolioId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['portfolios', userId] });
    },
  });
};

// Market data hooks
export const useMarketIndicators = () => {
  return useQuery({
    queryKey: ['marketIndicators'],
    queryFn: marketApi.getMarketIndicators,
    refetchInterval: 30000, // 30 seconds
  });
};

export const useStockQuote = (symbol: string) => {
  return useQuery({
    queryKey: ['stockQuote', symbol],
    queryFn: () => marketApi.getStockQuote(symbol),
    enabled: !!symbol,
    refetchInterval: 10000, // 10 seconds
  });
};

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: marketApi.getCryptoPrices,
    refetchInterval: 30000, // 30 seconds
  });
};

export const useCryptoNews = () => {
  return useQuery({
    queryKey: ['cryptoNews'],
    queryFn: marketApi.getCryptoNews,
    refetchInterval: 300000, // 5 minutes
  });
};

export const useEthereumData = () => {
  return useQuery({
    queryKey: ['ethereumData'],
    queryFn: marketApi.getEthereumData,
    refetchInterval: 60000, // 1 minute
  });
};

// AI Prediction hooks
export const usePrediction = () => {
  return useMutation({
    mutationFn: (data: PredictionRequest) => predictionApi.getPrediction(data),
  });
};

export const usePredictionHistory = (userId: string) => {
  return useQuery({
    queryKey: ['predictionHistory', userId],
    queryFn: () => predictionApi.getPredictionHistory(userId),
    enabled: !!userId,
  });
};

export const useSavePrediction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, prediction }: { userId: string; prediction: PredictionResponse }) =>
      predictionApi.savePrediction(userId, prediction),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['predictionHistory', userId] });
    },
  });
};

// Sentiment Analysis hooks
export const useSentimentAnalysis = () => {
  return useMutation({
    mutationFn: (data: SentimentRequest) => sentimentApi.analyzeSentiment(data),
  });
};

export const useSentimentHistory = (symbol?: string, timeframe?: string) => {
  return useQuery({
    queryKey: ['sentimentHistory', symbol, timeframe],
    queryFn: () => sentimentApi.getSentimentHistory(symbol, timeframe),
  });
};

// Portfolio Optimization hooks
export const usePortfolioOptimization = () => {
  return useMutation({
    mutationFn: (data: OptimizationRequest) => optimizationApi.optimizePortfolio(data),
  });
};

export const useOptimizationHistory = (userId: string) => {
  return useQuery({
    queryKey: ['optimizationHistory', userId],
    queryFn: () => optimizationApi.getOptimizationHistory(userId),
    enabled: !!userId,
  });
};

// Performance Analytics hooks
export const usePerformanceMetrics = (userId: string, portfolioId: string, timeframe?: string) => {
  return useQuery({
    queryKey: ['performanceMetrics', userId, portfolioId, timeframe],
    queryFn: () => analyticsApi.getPerformanceMetrics(userId, portfolioId, timeframe),
    enabled: !!userId && !!portfolioId,
  });
};

export const usePortfolioAnalytics = (userId: string, portfolioId: string) => {
  return useQuery({
    queryKey: ['portfolioAnalytics', userId, portfolioId],
    queryFn: () => analyticsApi.getPortfolioAnalytics(userId, portfolioId),
    enabled: !!userId && !!portfolioId,
  });
};

export const useBenchmarkComparison = (userId: string, portfolioId: string, benchmark: string) => {
  return useQuery({
    queryKey: ['benchmarkComparison', userId, portfolioId, benchmark],
    queryFn: () => analyticsApi.getBenchmarkComparison(userId, portfolioId, benchmark),
    enabled: !!userId && !!portfolioId && !!benchmark,
  });
};

// Robo-Advisor hooks
export const useRoboAdvisorRecommendations = () => {
  return useMutation({
    mutationFn: (data: RoboAdvisorRequest) => roboAdvisorApi.getRecommendations(data),
  });
};

export const useRoboAdvisorQuestionnaire = () => {
  return useQuery({
    queryKey: ['roboAdvisorQuestionnaire'],
    queryFn: roboAdvisorApi.getQuestionnaire,
  });
};

export const useSaveRoboAdvisorProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, profile }: { userId: string; profile: RoboAdvisorRequest }) =>
      roboAdvisorApi.saveProfile(userId, profile),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};

// Blockchain hooks
export const useBlockchainStatus = () => {
  return useQuery({
    queryKey: ['blockchainStatus'],
    queryFn: blockchainApi.getStatus,
    refetchInterval: 30000, // 30 seconds
  });
};

export const useWalletBalance = (address: string) => {
  return useQuery({
    queryKey: ['walletBalance', address],
    queryFn: () => blockchainApi.getBalance(address),
    enabled: !!address,
    refetchInterval: 60000, // 1 minute
  });
};

export const useWalletTransactions = (address: string) => {
  return useQuery({
    queryKey: ['walletTransactions', address],
    queryFn: () => blockchainApi.getTransactions(address),
    enabled: !!address,
  });
};

export const useConnectWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (address: string) => blockchainApi.connectWallet(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchainStatus'] });
    },
  });
};

export const useDisconnectWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blockchainApi.disconnectWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchainStatus'] });
    },
  });
};

// Education hooks
export const useEducationTopics = () => {
  return useQuery({
    queryKey: ['educationTopics'],
    queryFn: educationApi.getTopics,
  });
};

export const useEducationGlossary = () => {
  return useQuery({
    queryKey: ['educationGlossary'],
    queryFn: educationApi.getGlossary,
  });
};

export const useEducationArticle = (id: string) => {
  return useQuery({
    queryKey: ['educationArticle', id],
    queryFn: () => educationApi.getArticle(id),
    enabled: !!id,
  });
};

export const useEducationSearch = (query: string) => {
  return useQuery({
    queryKey: ['educationSearch', query],
    queryFn: () => educationApi.searchContent(query),
    enabled: !!query && query.length > 2,
  });
};

// Goals hooks
export const useGoals = (userId: string) => {
  return useQuery({
    queryKey: ['goals', userId],
    queryFn: () => goalsApi.getGoals(userId),
    enabled: !!userId,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, goalData }: { userId: string; goalData: any }) =>
      goalsApi.createGoal(userId, goalData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, goalId, goalData }: { 
      userId: string; 
      goalId: string; 
      goalData: any 
    }) => goalsApi.updateGoal(userId, goalId, goalData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, goalId }: { userId: string; goalId: string }) =>
      goalsApi.deleteGoal(userId, goalId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
  });
};

// Alerts hooks
export const useAlerts = (userId: string) => {
  return useQuery({
    queryKey: ['alerts', userId],
    queryFn: () => alertsApi.getAlerts(userId),
    enabled: !!userId,
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, alertData }: { userId: string; alertData: any }) =>
      alertsApi.createAlert(userId, alertData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['alerts', userId] });
    },
  });
};

export const useMarkAlertAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, alertId }: { userId: string; alertId: string }) =>
      alertsApi.markAsRead(userId, alertId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['alerts', userId] });
    },
  });
};

// User hooks
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getProfile(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: Partial<User> }) =>
      userApi.updateProfile(userId, userData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });
};

// Health check hooks
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: healthApi.checkHealth,
    refetchInterval: 60000, // 1 minute
  });
};

export const useServicesHealth = () => {
  return useQuery({
    queryKey: ['servicesHealth'],
    queryFn: healthApi.checkServices,
    refetchInterval: 30000, // 30 seconds
  });
};
