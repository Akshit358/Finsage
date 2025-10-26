import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';
import { generativeAIService, MarketContext, UserProfile } from '../services/generativeAI';
import { openaiService, GPTMessage } from '../services/openaiService';

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
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  symbols: string[];
  action?: string;
}

const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'predictions' | 'insights' | 'models'>('chat');
  const [predictions, setPredictions] = useState<MLPrediction[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    riskTolerance: 'moderate',
    investmentGoals: ['retirement', 'wealth_building'],
    experience: 'intermediate',
    portfolioSize: 'medium',
    timeHorizon: 'long',
    interests: ['technology', 'sustainability', 'growth_stocks']
  });
  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);
  const [aiPersonality, setAiPersonality] = useState<'professional' | 'friendly' | 'technical' | 'educational'>('professional');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX', 'SPY', 'QQQ'];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: AIMessage = {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your advanced AI Financial Agent powered by generative AI. I can provide comprehensive market analysis, intelligent predictions, personalized recommendations, and educational insights. I adapt to your experience level and investment goals. What would you like to explore today?",
      timestamp: new Date(),
      confidence: 0.95,
      suggestions: [
        "Analyze AAPL stock with full technical and fundamental analysis",
        "What are the current market trends and how do they affect my portfolio?",
        "Generate AI-powered investment recommendations for my risk profile",
        "Explain complex financial concepts in simple terms",
        "Predict market movements using advanced ML models"
      ],
      reasoning: [
        "Comprehensive analysis combines multiple data sources",
        "Personalized recommendations based on your risk tolerance",
        "Real-time market context integration",
        "Advanced AI models for accurate predictions"
      ],
      responseType: 'analysis'
    };
    setMessages([welcomeMessage]);
    generateInitialInsights();
    loadMarketContext();
  }, []);

  const generateInitialInsights = () => {
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'opportunity',
        title: 'Tech Sector Momentum',
        description: 'AI and cloud computing stocks showing strong momentum with 15% average gain over last 30 days',
        confidence: 0.87,
        impact: 'high',
        timeframe: '1-3 months',
        symbols: ['NVDA', 'MSFT', 'GOOGL'],
        action: 'Consider increasing tech allocation'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Market Volatility Alert',
        description: 'VIX index rising above 25, indicating increased market uncertainty. Consider defensive positioning.',
        confidence: 0.78,
        impact: 'medium',
        timeframe: '1-2 weeks',
        symbols: ['SPY', 'QQQ'],
        action: 'Review risk management strategies'
      },
      {
        id: '3',
        type: 'trend',
        title: 'ESG Investment Growth',
        description: 'ESG-focused funds outperforming traditional indices by 3.2% this quarter',
        confidence: 0.82,
        impact: 'medium',
        timeframe: '6-12 months',
        symbols: ['ESG', 'SUSL'],
        action: 'Explore ESG investment options'
      },
      {
        id: '4',
        type: 'anomaly',
        title: 'Unusual Trading Activity',
        description: 'TSLA showing unusual options activity with 300% increase in call volume',
        confidence: 0.65,
        impact: 'high',
        timeframe: '1-2 weeks',
        symbols: ['TSLA'],
        action: 'Monitor closely for potential catalyst'
      }
    ];
    setInsights(mockInsights);
  };

  const generateMLPrediction = (symbol: string): MLPrediction => {
    const basePrice = getBasePrice(symbol);
    const volatility = 0.15 + Math.random() * 0.1;
    const trend = Math.random() > 0.5 ? 1 : -1;
    const priceChange = (Math.random() * 0.2 + 0.05) * trend;
    const predictedPrice = basePrice * (1 + priceChange);
    
    return {
      symbol,
      prediction: {
        price: predictedPrice,
        confidence: 0.75 + Math.random() * 0.2,
        timeframe: '30 days',
        reasoning: [
          'Strong technical indicators suggest upward momentum',
          'Positive earnings outlook based on recent data',
          'Market sentiment analysis shows bullish trend',
          'Volume patterns indicate institutional interest'
        ]
      },
      technicalAnalysis: {
        trend: priceChange > 0.05 ? 'bullish' : priceChange < -0.05 ? 'bearish' : 'neutral',
        support: basePrice * 0.95,
        resistance: basePrice * 1.15,
        rsi: 30 + Math.random() * 40,
        macd: (Math.random() - 0.5) * 2,
        bollingerPosition: Math.random() > 0.5 ? 'upper' : Math.random() > 0.5 ? 'lower' : 'middle'
      },
      sentimentAnalysis: {
        overall: 0.3 + Math.random() * 0.4,
        news: 0.2 + Math.random() * 0.6,
        social: 0.1 + Math.random() * 0.8,
        analyst: 0.4 + Math.random() * 0.4
      },
      riskAssessment: {
        level: volatility > 0.2 ? 'high' : volatility > 0.15 ? 'medium' : 'low',
        volatility: volatility,
        maxDrawdown: volatility * 0.8,
        sharpeRatio: 0.5 + Math.random() * 1.5
      }
    };
  };

  const getBasePrice = (symbol: string): number => {
    const prices: { [key: string]: number } = {
      'AAPL': 175.00, 'GOOGL': 140.00, 'MSFT': 350.00, 'TSLA': 250.00,
      'AMZN': 150.00, 'NVDA': 450.00, 'META': 300.00, 'NFLX': 400.00,
      'SPY': 485.00, 'QQQ': 380.00
    };
    return prices[symbol] || 100.00;
  };

  const loadMarketContext = async () => {
    // Simulate loading market context
    setTimeout(() => {
      setMarketContext({
        currentMarket: 'bull',
        sentiment: 'positive',
        volatility: 'medium',
        sectorTrends: {
          'Technology': 'up',
          'Healthcare': 'stable',
          'Financials': 'up',
          'Energy': 'down',
          'Consumer': 'stable'
        },
        keyEvents: [
          'Fed signals potential rate cuts',
          'AI sector showing strong momentum',
          'Earnings season exceeding expectations'
        ],
        economicIndicators: {
          inflation: 3.2,
          interestRates: 5.25,
          gdp: 2.8,
          unemployment: 3.7
        }
      });
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Use generative AI service for advanced responses
      const aiResponse = await generativeAIService.generateResponse(inputMessage, {
        userProfile,
        marketContext,
        conversationHistory: messages
      });

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: aiResponse.timestamp,
        confidence: aiResponse.confidence,
        suggestions: aiResponse.suggestions,
        reasoning: aiResponse.reasoning,
        data: aiResponse.data,
        responseType: aiResponse.type
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const fallbackMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        confidence: 0.5
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // const generateAIResponse = (userInput: string): AIMessage => {
  //   const responses = [
  //     {
  //       pattern: /analyze|analysis|performance/i,
  //       response: "Based on my analysis, I'm seeing strong technical indicators with RSI at 65 and MACD showing bullish divergence. The stock appears to be in an uptrend with good volume support.",
  //       confidence: 0.88,
  //       suggestions: ["Show detailed technical analysis", "Compare with sector performance", "Check risk metrics"]
  //     },
  //     {
  //       pattern: /predict|forecast|future/i,
  //       response: "My ML models suggest a 15% upside potential over the next 30 days with 78% confidence. Key factors include positive earnings momentum and favorable market conditions.",
  //       confidence: 0.78,
  //       suggestions: ["View detailed prediction", "Check model accuracy", "See alternative scenarios"]
  //     },
  //     {
  //       pattern: /portfolio|optimize|allocation/i,
  //       response: "I recommend rebalancing your portfolio with 40% growth stocks, 30% value stocks, 20% bonds, and 10% alternatives. This allocation provides optimal risk-adjusted returns.",
  //       confidence: 0.82,
  //       suggestions: ["Implement rebalancing", "View portfolio analysis", "Check tax implications"]
  //     },
  //     {
  //       pattern: /risk|volatility|safe/i,
  //       response: "Current portfolio risk is moderate with a Sharpe ratio of 1.2. I suggest adding some defensive positions to reduce volatility while maintaining growth potential.",
  //       confidence: 0.75,
  //       suggestions: ["View risk analysis", "Add defensive stocks", "Check correlation matrix"]
  //     },
  //     {
  //       pattern: /market|trend|sector/i,
  //       response: "The market is showing mixed signals with tech sector leading gains while energy sector facing headwinds. Overall sentiment is cautiously optimistic.",
  //       confidence: 0.70,
  //       suggestions: ["View sector analysis", "Check market indicators", "See trend predictions"]
  //     }
  //   ];

  //   const matchedResponse = responses.find(r => r.pattern.test(userInput)) || responses[0];
    
  //   return {
  //     id: Date.now().toString(),
  //     type: 'ai',
  //     content: matchedResponse.response,
  //     timestamp: new Date(),
  //     confidence: matchedResponse.confidence,
  //     suggestions: matchedResponse.suggestions
  //   };
  // };

  const handleAnalyzeSymbol = async () => {
    setIsAnalyzing(true);
    
    // Simulate ML analysis
    setTimeout(() => {
      const prediction = generateMLPrediction(selectedSymbol);
      setPredictions(prev => [prediction, ...prev.slice(0, 4)]); // Keep last 5 predictions
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#059669';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return '🚀';
      case 'warning': return '⚠️';
      case 'trend': return '📈';
      case 'anomaly': return '🔍';
      default: return '💡';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          🤖 AI Financial Agent
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Advanced AI-powered financial intelligence and machine learning analytics
        </p>
      </div>

      {/* AI Status and Controls */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
            🤖 Advanced AI Agent Status
          </h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#059669',
              color: 'white',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              ✅ AI Active
            </div>
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              🧠 Generative AI
            </div>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>AI Personality</div>
            <select
              value={aiPersonality}
              onChange={(e) => setAiPersonality(e.target.value as any)}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                width: '100%'
              }}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="technical">Technical</option>
              <option value="educational">Educational</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Risk Tolerance</div>
            <select
              value={userProfile.riskTolerance}
              onChange={(e) => setUserProfile(prev => ({ ...prev, riskTolerance: e.target.value as any }))}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                width: '100%'
              }}
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Experience Level</div>
            <select
              value={userProfile.experience}
              onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value as any }))}
              style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                width: '100%'
              }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Market Context</div>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
              {marketContext ? `${marketContext.currentMarket.toUpperCase()} Market` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { id: 'chat', label: '💬 AI Chat', icon: '💬' },
            { id: 'predictions', label: '🔮 ML Predictions', icon: '🔮' },
            { id: 'insights', label: '💡 AI Insights', icon: '💡' },
            { id: 'models', label: '🧠 ML Models', icon: '🧠' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid',
                borderColor: activeTab === tab.id ? '#2563eb' : '#d1d5db',
                backgroundColor: activeTab === tab.id ? '#eff6ff' : 'white',
                color: activeTab === tab.id ? '#2563eb' : '#374151',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Chat Interface */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            height: '600px'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              AI Financial Assistant
            </h2>
            
            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem'
            }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    backgroundColor: message.type === 'user' ? '#2563eb' : 'white',
                    color: message.type === 'user' ? 'white' : '#111827',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    position: 'relative'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>{message.content}</p>
                    {message.confidence && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : '#6b7280',
                        marginTop: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span>Confidence: {(message.confidence * 100).toFixed(0)}%</span>
                        {message.responseType && (
                          <span style={{
                            padding: '0.125rem 0.5rem',
                            backgroundColor: message.responseType === 'analysis' ? '#2563eb' : 
                                           message.responseType === 'prediction' ? '#8b5cf6' :
                                           message.responseType === 'recommendation' ? '#059669' :
                                           message.responseType === 'explanation' ? '#f59e0b' : '#6b7280',
                            color: 'white',
                            borderRadius: '0.25rem',
                            fontSize: '0.625rem',
                            fontWeight: '500'
                          }}>
                            {message.responseType.toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}
                    {message.reasoning && message.reasoning.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: message.type === 'user' ? 'rgba(255,255,255,0.8)' : '#374151', marginBottom: '0.25rem' }}>
                          AI Reasoning:
                        </div>
                        <ul style={{ fontSize: '0.75rem', color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : '#6b7280', paddingLeft: '1rem', margin: 0 }}>
                          {message.reasoning.map((reason, index) => (
                            <li key={index} style={{ marginBottom: '0.125rem' }}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '0.25rem 0.5rem',
                              marginBottom: '0.25rem',
                              fontSize: '0.75rem',
                              backgroundColor: 'transparent',
                              border: '1px solid',
                              borderColor: message.type === 'user' ? 'rgba(255,255,255,0.3)' : '#d1d5db',
                              color: message.type === 'user' ? 'white' : '#374151',
                              borderRadius: '0.25rem',
                              cursor: 'pointer'
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <LoadingSpinner size="sm" />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about markets, stocks, or investments..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                style={{ flex: 1 }}
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                Send
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Quick Actions
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button onClick={() => setActiveTab('predictions')} style={{ width: '100%' }}>
                🔮 Generate ML Predictions
              </Button>
              <Button onClick={() => setActiveTab('insights')} variant="outline" style={{ width: '100%' }}>
                💡 View AI Insights
              </Button>
              <Button onClick={handleAnalyzeSymbol} disabled={isAnalyzing} style={{ width: '100%' }}>
                {isAnalyzing ? <LoadingSpinner size="sm" /> : '📊 Analyze Current Market'}
              </Button>
              <Button 
                onClick={() => setInputMessage('Generate personalized investment recommendations based on my risk profile and current market conditions')}
                variant="outline" 
                style={{ width: '100%' }}
              >
                🎯 AI Recommendations
              </Button>
              <Button 
                onClick={() => setInputMessage('Explain portfolio diversification and risk management strategies in simple terms')}
                variant="outline" 
                style={{ width: '100%' }}
              >
                📚 Educational AI
              </Button>
              <Button 
                onClick={() => setInputMessage('What are the current market trends and how should I adjust my investment strategy?')}
                variant="outline" 
                style={{ width: '100%' }}
              >
                🌊 Market Analysis
              </Button>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                Advanced AI Capabilities
              </h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                <div>• 🧠 Generative AI responses</div>
                <div>• 📊 Real-time market analysis</div>
                <div>• 🔮 ML-powered predictions</div>
                <div>• 💭 Sentiment analysis</div>
                <div>• ⚠️ Risk assessment</div>
                <div>• 🎯 Portfolio optimization</div>
                <div>• 📈 Technical analysis</div>
                <div>• 🎓 Educational explanations</div>
                <div>• 🎨 Personalized recommendations</div>
                <div>• 🔄 Context-aware responses</div>
                <div>• 📚 Knowledge base integration</div>
                <div>• 🎭 Adaptive personality</div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                AI Personality
              </h3>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                <div>Current: <strong>{aiPersonality.charAt(0).toUpperCase() + aiPersonality.slice(1)}</strong></div>
                <div style={{ marginTop: '0.5rem' }}>
                  {aiPersonality === 'professional' && 'Formal, data-driven responses with technical accuracy'}
                  {aiPersonality === 'friendly' && 'Conversational, approachable tone with encouragement'}
                  {aiPersonality === 'technical' && 'Detailed, analytical responses with deep insights'}
                  {aiPersonality === 'educational' && 'Teaching-focused responses with clear explanations'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                ML Predictions
              </h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem'
                  }}
                >
                  {symbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))}
                </select>
                <Button onClick={handleAnalyzeSymbol} disabled={isAnalyzing}>
                  {isAnalyzing ? <LoadingSpinner size="sm" /> : 'Analyze'}
                </Button>
              </div>
            </div>

            {predictions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                  No Predictions Yet
                </h3>
                <p>Click "Analyze" to generate ML predictions for your selected symbol</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {predictions.map((prediction, index) => (
                  <div key={index} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    backgroundColor: '#f8fafc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                        {prediction.symbol} - 30 Day Prediction
                      </h3>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        backgroundColor: getConfidenceColor(prediction.prediction.confidence),
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {(prediction.prediction.confidence * 100).toFixed(0)}% Confidence
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Predicted Price</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                          ${prediction.prediction.price.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Trend</div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: prediction.technicalAnalysis.trend === 'bullish' ? '#059669' : 
                                 prediction.technicalAnalysis.trend === 'bearish' ? '#ef4444' : '#6b7280'
                        }}>
                          {prediction.technicalAnalysis.trend.toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Risk Level</div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: prediction.riskAssessment.level === 'low' ? '#059669' : 
                                 prediction.riskAssessment.level === 'medium' ? '#f59e0b' : '#ef4444'
                        }}>
                          {prediction.riskAssessment.level.toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Sharpe Ratio</div>
                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                          {prediction.riskAssessment.sharpeRatio.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                        Key Reasoning:
                      </h4>
                      <ul style={{ fontSize: '0.875rem', color: '#6b7280', paddingLeft: '1.5rem' }}>
                        {prediction.prediction.reasoning.map((reason, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                          Technical Analysis
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          <div>RSI: {prediction.technicalAnalysis.rsi.toFixed(1)}</div>
                          <div>MACD: {prediction.technicalAnalysis.macd.toFixed(3)}</div>
                          <div>Support: ${prediction.technicalAnalysis.support.toFixed(2)}</div>
                          <div>Resistance: ${prediction.technicalAnalysis.resistance.toFixed(2)}</div>
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                          Sentiment Analysis
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          <div>Overall: {(prediction.sentimentAnalysis.overall * 100).toFixed(0)}%</div>
                          <div>News: {(prediction.sentimentAnalysis.news * 100).toFixed(0)}%</div>
                          <div>Social: {(prediction.sentimentAnalysis.social * 100).toFixed(0)}%</div>
                          <div>Analyst: {(prediction.sentimentAnalysis.analyst * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              AI-Generated Insights
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {insights.map((insight) => (
                <div key={insight.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{getTypeIcon(insight.type)}</span>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                        {insight.title}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        backgroundColor: getConfidenceColor(insight.confidence),
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {(insight.confidence * 100).toFixed(0)}%
                      </div>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        backgroundColor: getImpactColor(insight.impact),
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {insight.impact.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {insight.description}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      <div>Timeframe: {insight.timeframe}</div>
                      <div>Symbols: {insight.symbols.join(', ')}</div>
                    </div>
                    {insight.action && (
                      <Button variant="outline" style={{ fontSize: '0.75rem' }}>
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Models Tab */}
      {activeTab === 'models' && (
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              ML Models & Performance
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  name: 'Price Prediction LSTM',
                  accuracy: 0.87,
                  description: 'Deep learning model for price forecasting',
                  features: ['Historical prices', 'Volume', 'Technical indicators'],
                  status: 'Active'
                },
                {
                  name: 'Sentiment Analysis BERT',
                  accuracy: 0.92,
                  description: 'Natural language processing for market sentiment',
                  features: ['News articles', 'Social media', 'Analyst reports'],
                  status: 'Active'
                },
                {
                  name: 'Risk Assessment Random Forest',
                  accuracy: 0.89,
                  description: 'Ensemble model for portfolio risk evaluation',
                  features: ['Volatility', 'Correlation', 'Market conditions'],
                  status: 'Active'
                },
                {
                  name: 'Anomaly Detection Autoencoder',
                  accuracy: 0.94,
                  description: 'Unsupervised learning for market anomalies',
                  features: ['Price patterns', 'Volume spikes', 'Trading behavior'],
                  status: 'Active'
                }
              ].map((model, index) => (
                <div key={index} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                      {model.name}
                    </h3>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      backgroundColor: '#059669',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {model.status}
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    {model.description}
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Accuracy</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                        {(model.accuracy * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${model.accuracy * 100}%`,
                        height: '100%',
                        backgroundColor: '#059669',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                      Features:
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {model.features.map((feature, idx) => (
                        <div key={idx} style={{ marginBottom: '0.25rem' }}>• {feature}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgent;
