import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';
import { openaiService, GPTMessage } from '../services/openaiService';
import { 
  Send, 
  Mic, 
  MicOff, 
  Settings, 
  Zap, 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target, 
  Shield, 
  Activity, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock, 
  Calendar, 
  Star, 
  StarOff,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MessageSquare,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  BookOpen,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
  Bookmark,
  BookmarkCheck,
  History,
  Trash2,
  Edit3,
  Save,
  Loader
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  confidence?: number;
  suggestions?: string[];
  data?: any;
  reasoning?: string[];
  responseType?: 'analysis' | 'prediction' | 'recommendation' | 'explanation' | 'question';
  isGPT?: boolean;
  isTyping?: boolean;
  attachments?: any[];
  reactions?: { type: string; count: number }[];
}

interface MLPrediction {
  symbol: string;
  prediction: {
    price: number;
    confidence: number;
    timeframe: string;
    reasoning: string[];
  };
  technicalAnalysis: {
    trend: 'bullish' | 'bearish' | 'neutral';
    support: number;
    resistance: number;
    rsi: number;
    macd: number;
    bollingerPosition: 'upper' | 'middle' | 'lower';
  };
  sentimentAnalysis: {
    overall: number;
    news: number;
    social: number;
    analyst: number;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    volatility: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'trend' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
  symbols: string[];
  data: any;
}

interface MLModel {
  id: string;
  name: string;
  type: 'regression' | 'classification' | 'clustering' | 'neural_network';
  accuracy: number;
  lastTrained: Date;
  status: 'active' | 'training' | 'inactive';
  description: string;
  metrics: {
    precision: number;
    recall: number;
    f1Score: number;
    auc: number;
  };
}

const ModernAIAgent: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGPTMode, setIsGPTMode] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState({
    riskTolerance: 'moderate',
    investmentGoals: ['growth', 'income'],
    experience: 'intermediate',
    preferences: ['tech', 'finance']
  });
  const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([]);
  const [favoriteMessages, setFavoriteMessages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showConversationHistory, setShowConversationHistory] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [messageReactions, setMessageReactions] = useState<{ [key: string]: { type: string; count: number }[] }>({});
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [quickActions, setQuickActions] = useState([
    'Analyze AAPL stock',
    'Market outlook for next week',
    'Portfolio optimization advice',
    'Risk assessment for tech stocks',
    'Explain RSI indicator',
    'Best dividend stocks',
    'Crypto market analysis',
    'Fed rate impact analysis'
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      type: 'ai',
      content: "Hello! I'm your AI Financial Assistant. I can help you with market analysis, portfolio optimization, risk assessment, and investment strategies. How can I assist you today?",
      timestamp: new Date(),
      confidence: 0.95,
      responseType: 'explanation',
      suggestions: [
        'Analyze AAPL stock performance',
        'Market outlook for next week',
        'Portfolio optimization advice',
        'Risk assessment for tech stocks'
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    if (isGPTMode) {
      try {
        const gptMessages: GPTMessage[] = [
          {
            role: 'system',
            content: `You are an expert AI financial advisor with deep knowledge of markets, investments, and financial analysis. 
            Provide accurate, helpful, and professional financial advice. Always consider risk factors and provide balanced perspectives.
            User profile: Risk tolerance: ${userProfile.riskTolerance}, Goals: ${userProfile.investmentGoals.join(', ')}, 
            Experience: ${userProfile.experience}, Preferences: ${userProfile.preferences.join(', ')}`
          },
          {
            role: 'user',
            content: userMessage
          }
        ];

        const response = await openaiService.generateChatCompletion(gptMessages);
        return response.content;
      } catch (error) {
        console.error('GPT API Error:', error);
        return "I apologize, but I'm having trouble connecting to the AI service right now. Please try again later.";
      }
    } else {
      // Local AI responses
      const responses = {
        'analyze': 'Based on current market data, I recommend analyzing the technical indicators and fundamental metrics. The stock shows strong momentum with RSI at 65 and MACD indicating bullish crossover.',
        'portfolio': 'For portfolio optimization, consider diversifying across sectors with 60% stocks, 30% bonds, and 10% alternatives. Rebalance quarterly to maintain target allocation.',
        'risk': 'Risk assessment shows moderate volatility with VaR of 2.5% and Sharpe ratio of 1.2. Consider reducing position sizes in high-beta stocks.',
        'market': 'Market outlook remains cautiously optimistic with Fed policy supporting growth while inflation concerns persist. Focus on quality companies with strong fundamentals.'
      };
      
      const lowerMessage = userMessage.toLowerCase();
      if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
        return responses.analyze;
      } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('optimize')) {
        return responses.portfolio;
      } else if (lowerMessage.includes('risk') || lowerMessage.includes('assessment')) {
        return responses.risk;
      } else if (lowerMessage.includes('market') || lowerMessage.includes('outlook')) {
        return responses.market;
      } else {
        return "I understand you're asking about financial topics. Could you be more specific about what you'd like to know? I can help with market analysis, portfolio optimization, risk assessment, and investment strategies.";
      }
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      responseType: 'question'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        confidence: 0.85,
        responseType: 'analysis',
        isGPT: isGPTMode,
        suggestions: [
          'Tell me more about this',
          'What are the risks?',
          'How does this affect my portfolio?',
          'Show me similar opportunities'
        ]
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const toggleFavorite = (messageId: string) => {
    setFavoriteMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const addReaction = (messageId: string, reactionType: string) => {
    setMessageReactions(prev => {
      const currentReactions = prev[messageId] || [];
      const existingReaction = currentReactions.find(r => r.type === reactionType);
      
      if (existingReaction) {
        existingReaction.count += 1;
      } else {
        currentReactions.push({ type: reactionType, count: 1 });
      }
      
      return { ...prev, [messageId]: currentReactions };
    });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const filteredMessages = messages.filter(message => {
    if (searchQuery && !message.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && message.responseType !== filterType) {
      return false;
    }
    return true;
  });

  const generateMockPredictions = (): MLPrediction[] => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
    return symbols.map(symbol => ({
      symbol,
      prediction: {
        price: Math.random() * 100 + 100,
        confidence: Math.random() * 0.3 + 0.7,
        timeframe: '1 week',
        reasoning: [
          'Strong technical indicators',
          'Positive earnings outlook',
          'Market momentum support'
        ]
      },
      technicalAnalysis: {
        trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
        support: Math.random() * 50 + 50,
        resistance: Math.random() * 50 + 150,
        rsi: Math.random() * 40 + 30,
        macd: Math.random() * 2 - 1,
        bollingerPosition: Math.random() > 0.5 ? 'upper' : 'lower'
      },
      sentimentAnalysis: {
        overall: Math.random() * 0.4 + 0.3,
        news: Math.random() * 0.4 + 0.3,
        social: Math.random() * 0.4 + 0.3,
        analyst: Math.random() * 0.4 + 0.3
      },
      riskAssessment: {
        level: Math.random() > 0.5 ? 'medium' : 'high',
        volatility: Math.random() * 20 + 10,
        maxDrawdown: Math.random() * 15 + 5,
        sharpeRatio: Math.random() * 1.5 + 0.5
      }
    }));
  };

  const generateMockInsights = (): AIInsight[] => [
    {
      id: '1',
      type: 'opportunity',
      title: 'Tech Sector Momentum',
      description: 'Technology stocks showing strong momentum with RSI breakout patterns',
      confidence: 0.85,
      impact: 'high',
      timeframe: '2-4 weeks',
      symbols: ['AAPL', 'GOOGL', 'MSFT'],
      data: { momentum: 0.75, volume: 'increasing' }
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Volatility Alert',
      description: 'Market volatility exceeding normal levels, consider reducing position sizes',
      confidence: 0.92,
      impact: 'medium',
      timeframe: '1-2 weeks',
      symbols: ['TSLA', 'NVDA'],
      data: { vix: 25.5, volatility: 'high' }
    },
    {
      id: '3',
      type: 'trend',
      title: 'Sector Rotation',
      description: 'Rotation from growth to value stocks accelerating',
      confidence: 0.78,
      impact: 'high',
      timeframe: '4-6 weeks',
      symbols: ['SPY', 'QQQ'],
      data: { rotation: 0.65, trend: 'strengthening' }
    }
  ];

  const generateMockModels = (): MLModel[] => [
    {
      id: '1',
      name: 'Price Prediction LSTM',
      type: 'neural_network',
      accuracy: 0.87,
      lastTrained: new Date(Date.now() - 86400000),
      status: 'active',
      description: 'Long Short-Term Memory network for price prediction',
      metrics: {
        precision: 0.85,
        recall: 0.82,
        f1Score: 0.83,
        auc: 0.89
      }
    },
    {
      id: '2',
      name: 'Sentiment Classifier',
      type: 'classification',
      accuracy: 0.91,
      lastTrained: new Date(Date.now() - 172800000),
      status: 'active',
      description: 'BERT-based sentiment analysis for news and social media',
      metrics: {
        precision: 0.89,
        recall: 0.93,
        f1Score: 0.91,
        auc: 0.94
      }
    },
    {
      id: '3',
      name: 'Risk Assessment Model',
      type: 'regression',
      accuracy: 0.83,
      lastTrained: new Date(Date.now() - 259200000),
      status: 'training',
      description: 'Multi-factor risk model for portfolio optimization',
      metrics: {
        precision: 0.81,
        recall: 0.85,
        f1Score: 0.83,
        auc: 0.87
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Financial Agent</h1>
                <p className="text-gray-600">Powered by GPT-4 & Advanced ML Models</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* AI Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">AI Mode:</span>
                <button
                  onClick={() => setIsGPTMode(!isGPTMode)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    isGPTMode 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGPTMode ? 'GPT-4' : 'Local'}</span>
                </button>
              </div>
              
              {/* Audio Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    audioEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                
                <button
                  onClick={() => setShowConversationHistory(!showConversationHistory)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
                </button>
                
                <button
                  onClick={() => setMessages([])}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                <select
                  value={userProfile.riskTolerance}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, riskTolerance: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={userProfile.experience}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto Scroll</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Enable automatic scrolling</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['chat', 'predictions', 'insights', 'models'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Chat with AI</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isGPTMode ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-sm text-gray-600">
                          {isGPTMode ? 'GPT-4 Active' : 'Local AI'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-96 overflow-y-auto p-6 space-y-4">
                    {filteredMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <div className="flex items-start space-x-2">
                            {message.type === 'ai' && (
                              <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-70">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                                {message.confidence && (
                                  <span className="text-xs opacity-70">
                                    {Math.round(message.confidence * 100)}% confidence
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Message Actions */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => addReaction(message.id, '👍')}
                                className="p-1 hover:bg-gray-200 rounded text-xs"
                              >
                                👍
                              </button>
                              <button
                                onClick={() => addReaction(message.id, '👎')}
                                className="p-1 hover:bg-gray-200 rounded text-xs"
                              >
                                👎
                              </button>
                              <button
                                onClick={() => addReaction(message.id, '❤️')}
                                className="p-1 hover:bg-gray-200 rounded text-xs"
                              >
                                ❤️
                              </button>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => copyMessage(message.content)}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => toggleFavorite(message.id)}
                                className="p-1 hover:bg-gray-200 rounded"
                              >
                                {favoriteMessages.has(message.id) ? 
                                  <BookmarkCheck className="w-3 h-3 text-yellow-500" /> : 
                                  <Bookmark className="w-3 h-3" />
                                }
                              </button>
                            </div>
                          </div>
                          
                          {/* Suggestions */}
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-500 mb-2">Suggested follow-ups:</p>
                              <div className="flex flex-wrap gap-1">
                                {message.suggestions.map((suggestion, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setInputMessage(suggestion)}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input Area */}
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything about markets, investments, or financial analysis..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          !inputMessage.trim() || isTyping
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {isTyping ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Quick Actions */}
                    {showSuggestions && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-2">Quick actions:</p>
                        <div className="flex flex-wrap gap-2">
                          {quickActions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => setInputMessage(action)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors duration-200"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* User Profile */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Risk Tolerance:</span>
                      <p className="font-medium">{userProfile.riskTolerance}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Experience:</span>
                      <p className="font-medium">{userProfile.experience}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Goals:</span>
                      <p className="font-medium">{userProfile.investmentGoals.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Preferences:</span>
                      <p className="font-medium">{userProfile.preferences.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* AI Status */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Mode:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isGPTMode ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isGPTMode ? 'GPT-4' : 'Local AI'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Audio:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        audioEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {audioEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Listening:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isListening ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isListening ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">ML Predictions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generateMockPredictions().map((prediction) => (
                    <div key={prediction.symbol} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{prediction.symbol}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          prediction.technicalAnalysis.trend === 'bullish' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {prediction.technicalAnalysis.trend}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Predicted Price:</span>
                          <span className="font-medium">${prediction.prediction.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Confidence:</span>
                          <span className="font-medium">{Math.round(prediction.prediction.confidence * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">RSI:</span>
                          <span className="font-medium">{prediction.technicalAnalysis.rsi.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Risk Level:</span>
                          <span className={`font-medium ${
                            prediction.riskAssessment.level === 'low' ? 'text-green-600' :
                            prediction.riskAssessment.level === 'medium' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {prediction.riskAssessment.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {generateMockInsights().map((insight) => (
                    <div key={insight.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            insight.type === 'opportunity' ? 'bg-green-100' :
                            insight.type === 'warning' ? 'bg-red-100' :
                            insight.type === 'trend' ? 'bg-blue-100' : 'bg-yellow-100'
                          }`}>
                            {insight.type === 'opportunity' ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                             insight.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                             insight.type === 'trend' ? <BarChart3 className="w-4 h-4 text-blue-600" /> :
                             <Activity className="w-4 h-4 text-yellow-600" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                            <p className="text-sm text-gray-600">{insight.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Confidence</div>
                          <div className="font-medium">{Math.round(insight.confidence * 100)}%</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Impact:</span>
                          <p className="font-medium">{insight.impact}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Timeframe:</span>
                          <p className="font-medium">{insight.timeframe}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Symbols:</span>
                          <p className="font-medium">{insight.symbols.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">ML Models</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {generateMockModels().map((model) => (
                    <div key={model.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{model.name}</h4>
                          <p className="text-sm text-gray-600">{model.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          model.status === 'active' ? 'bg-green-100 text-green-800' :
                          model.status === 'training' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {model.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Accuracy:</span>
                          <p className="font-medium">{Math.round(model.accuracy * 100)}%</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Precision:</span>
                          <p className="font-medium">{Math.round(model.metrics.precision * 100)}%</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Recall:</span>
                          <p className="font-medium">{Math.round(model.metrics.recall * 100)}%</p>
                        </div>
                        <div>
                          <span className="text-gray-500">F1 Score:</span>
                          <p className="font-medium">{Math.round(model.metrics.f1Score * 100)}%</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-500">
                        Last trained: {model.lastTrained.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernAIAgent;