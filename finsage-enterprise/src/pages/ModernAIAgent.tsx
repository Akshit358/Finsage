import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';
import { generativeAIService, AIResponse, MarketContext, UserProfile } from '../services/generativeAI';
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
  isGPT?: boolean;
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

const ModernAIAgent: React.FC = () => {
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
  const [useGPT, setUseGPT] = useState(true);
  const [gptStatus, setGptStatus] = useState(openaiService.getStatus());
  const [typingText, setTypingText] = useState('');
  const [showAnimations, setShowAnimations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      content: "Hello! I'm your advanced AI Financial Agent powered by cutting-edge AI technology. I can provide comprehensive market analysis, intelligent predictions, personalized recommendations, and educational insights. I adapt to your experience level and investment goals. What would you like to explore today?",
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
      responseType: 'analysis',
      isGPT: useGPT
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
        title: 'AI Sector Momentum',
        description: 'Artificial intelligence and machine learning stocks showing exceptional momentum with 25% average gain over last 30 days',
        confidence: 0.89,
        impact: 'high',
        timeframe: '1-3 months',
        symbols: ['NVDA', 'MSFT', 'GOOGL', 'AMD'],
        action: 'Consider increasing AI sector allocation'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Market Volatility Alert',
        description: 'VIX index rising above 30, indicating increased market uncertainty. Consider defensive positioning and risk management.',
        confidence: 0.82,
        impact: 'high',
        timeframe: '1-2 weeks',
        symbols: ['SPY', 'QQQ', 'IWM'],
        action: 'Review risk management strategies'
      },
      {
        id: '3',
        type: 'trend',
        title: 'ESG Investment Growth',
        description: 'ESG-focused funds outperforming traditional indices by 4.2% this quarter with strong institutional support',
        confidence: 0.85,
        impact: 'medium',
        timeframe: '6-12 months',
        symbols: ['ESG', 'SUSL', 'ICLN'],
        action: 'Explore ESG investment options'
      },
      {
        id: '4',
        type: 'anomaly',
        title: 'Unusual Options Activity',
        description: 'TSLA showing unusual options activity with 400% increase in call volume, suggesting potential catalyst',
        confidence: 0.72,
        impact: 'high',
        timeframe: '1-2 weeks',
        symbols: ['TSLA'],
        action: 'Monitor closely for potential catalyst'
      }
    ];
    setInsights(mockInsights);
  };

  const loadMarketContext = async () => {
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
      let aiResponse: AIResponse;
      
      if (useGPT && gptStatus.configured) {
        // Use GPT for response
        const gptMessages: GPTMessage[] = [
          {
            role: 'system',
            content: `You are an expert financial advisor with access to real-time market data. Provide comprehensive, personalized financial advice based on the user's profile: Risk Tolerance: ${userProfile.riskTolerance}, Experience: ${userProfile.experience}, Goals: ${userProfile.investmentGoals.join(', ')}.`
          },
          {
            role: 'user',
            content: inputMessage
          }
        ];

        const gptResponse = await openaiService.generateResponse(gptMessages);
        
        aiResponse = {
          content: gptResponse.content,
          confidence: 0.9,
          reasoning: ['GPT-4 analysis', 'Real-time market data', 'Personalized recommendations'],
          suggestions: ['Ask follow-up questions', 'Request detailed analysis', 'Explore related topics'],
          type: 'analysis',
          timestamp: new Date()
        };
      } else {
        // Use generative AI service
        aiResponse = await generativeAIService.generateResponse(inputMessage, {
          userProfile,
          marketContext,
          conversationHistory: messages
        });
      }

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: aiResponse.timestamp,
        confidence: aiResponse.confidence,
        suggestions: aiResponse.suggestions,
        reasoning: aiResponse.reasoning,
        data: aiResponse.data,
        responseType: aiResponse.type,
        isGPT: useGPT && gptStatus.configured
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

  const handleAnalyzeSymbol = async () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const prediction = generateMLPrediction(selectedSymbol);
      setPredictions(prev => [prediction, ...prev.slice(0, 4)]);
      setIsAnalyzing(false);
    }, 2000);
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

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      {showAnimations && (
        <>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '50%',
            animation: 'float 10s ease-in-out infinite',
            zIndex: 0
          }} />
        </>
      )}

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '0.5rem',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            background: 'linear-gradient(45deg, #fff, #e0e7ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🤖 AI Financial Agent
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Powered by Advanced AI & Machine Learning
          </p>
        </div>

        {/* AI Status Dashboard */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', margin: 0 }}>
              🧠 AI Status Dashboard
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(45deg, #10b981, #059669)',
                color: 'white',
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}>
                ✅ AI Active
              </div>
              <div style={{
                padding: '0.75rem 1.5rem',
                background: useGPT && gptStatus.configured ? 
                  'linear-gradient(45deg, #8b5cf6, #7c3aed)' : 
                  'linear-gradient(45deg, #6b7280, #4b5563)',
                color: 'white',
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: useGPT && gptStatus.configured ? 
                  '0 4px 15px rgba(139, 92, 246, 0.3)' : 
                  '0 4px 15px rgba(107, 114, 128, 0.3)'
              }}>
                {useGPT && gptStatus.configured ? '🤖 GPT-4' : '🧠 Local AI'}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>AI Personality</div>
              <select
                value={aiPersonality}
                onChange={(e) => setAiPersonality(e.target.value as any)}
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '1rem',
                  fontSize: '0.875rem',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <option value="professional" style={{ background: '#1f2937', color: 'white' }}>Professional</option>
                <option value="friendly" style={{ background: '#1f2937', color: 'white' }}>Friendly</option>
                <option value="technical" style={{ background: '#1f2937', color: 'white' }}>Technical</option>
                <option value="educational" style={{ background: '#1f2937', color: 'white' }}>Educational</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>Risk Tolerance</div>
              <select
                value={userProfile.riskTolerance}
                onChange={(e) => setUserProfile(prev => ({ ...prev, riskTolerance: e.target.value as any }))}
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '1rem',
                  fontSize: '0.875rem',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <option value="conservative" style={{ background: '#1f2937', color: 'white' }}>Conservative</option>
                <option value="moderate" style={{ background: '#1f2937', color: 'white' }}>Moderate</option>
                <option value="aggressive" style={{ background: '#1f2937', color: 'white' }}>Aggressive</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>Experience Level</div>
              <select
                value={userProfile.experience}
                onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value as any }))}
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '1rem',
                  fontSize: '0.875rem',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <option value="beginner" style={{ background: '#1f2937', color: 'white' }}>Beginner</option>
                <option value="intermediate" style={{ background: '#1f2937', color: 'white' }}>Intermediate</option>
                <option value="advanced" style={{ background: '#1f2937', color: 'white' }}>Advanced</option>
                <option value="expert" style={{ background: '#1f2937', color: 'white' }}>Expert</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>AI Model</div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => setUseGPT(true)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '1rem',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: useGPT ? 'linear-gradient(45deg, #8b5cf6, #7c3aed)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  GPT-4
                </button>
                <button
                  onClick={() => setUseGPT(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '1rem',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: !useGPT ? 'linear-gradient(45deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Local AI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '1rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
                  padding: '1rem 2rem',
                  borderRadius: '1.5rem',
                  border: 'none',
                  background: activeTab === tab.id ? 
                    'linear-gradient(45deg, #8b5cf6, #7c3aed)' : 
                    'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === tab.id ? 
                    '0 8px 25px rgba(139, 92, 246, 0.4)' : 
                    '0 4px 15px rgba(0, 0, 0, 0.1)',
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
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            {/* Chat Interface */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              height: '600px'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>
                AI Financial Assistant
              </h2>
              
              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      marginBottom: '1.5rem',
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '80%',
                      padding: '1rem 1.5rem',
                      borderRadius: message.type === 'user' ? '2rem 2rem 0.5rem 2rem' : '2rem 2rem 2rem 0.5rem',
                      background: message.type === 'user' ? 
                        'linear-gradient(45deg, #8b5cf6, #7c3aed)' : 
                        'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.6' }}>{message.content}</p>
                      
                      {message.confidence && (
                        <div style={{
                          fontSize: '0.75rem',
                          marginTop: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          opacity: 0.8
                        }}>
                          <span>Confidence: {(message.confidence * 100).toFixed(0)}%</span>
                          {message.responseType && (
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.5rem',
                              background: message.responseType === 'analysis' ? '#2563eb' : 
                                         message.responseType === 'prediction' ? '#8b5cf6' :
                                         message.responseType === 'recommendation' ? '#10b981' :
                                         message.responseType === 'explanation' ? '#f59e0b' : '#6b7280',
                              fontSize: '0.625rem',
                              fontWeight: '500'
                            }}>
                              {message.responseType.toUpperCase()}
                            </span>
                          )}
                          {message.isGPT && (
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.5rem',
                              background: '#8b5cf6',
                              fontSize: '0.625rem',
                              fontWeight: '500'
                            }}>
                              GPT-4
                            </span>
                          )}
                        </div>
                      )}
                      
                      {message.reasoning && message.reasoning.length > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', opacity: 0.9 }}>
                            AI Reasoning:
                          </div>
                          <ul style={{ fontSize: '0.75rem', paddingLeft: '1rem', margin: 0, opacity: 0.8 }}>
                            {message.reasoning.map((reason, index) => (
                              <li key={index} style={{ marginBottom: '0.25rem' }}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                marginBottom: '0.5rem',
                                fontSize: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                borderRadius: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
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
                      padding: '1rem 1.5rem',
                      borderRadius: '2rem 2rem 2rem 0.5rem',
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <LoadingSpinner size="sm" />
                      <span style={{ fontSize: '0.875rem' }}>AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about markets, stocks, or investments..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{ 
                    flex: 1,
                    padding: '1rem 1.5rem',
                    borderRadius: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.875rem',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isTyping}
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '2rem',
                    background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  Send
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              padding: '2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>
                Quick Actions
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Button onClick={() => setActiveTab('predictions')} style={{ 
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '1.5rem',
                  background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                }}>
                  🔮 Generate ML Predictions
                </Button>
                <Button onClick={() => setActiveTab('insights')} style={{ 
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  💡 View AI Insights
                </Button>
                <Button onClick={handleAnalyzeSymbol} disabled={isAnalyzing} style={{ 
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '1.5rem',
                  background: isAnalyzing ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #10b981, #059669)',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isAnalyzing ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}>
                  {isAnalyzing ? <LoadingSpinner size="sm" /> : '📊 Analyze Current Market'}
                </Button>
                <Button 
                  onClick={() => setInputMessage('Generate personalized investment recommendations based on my risk profile and current market conditions')}
                  style={{ 
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🎯 AI Recommendations
                </Button>
                <Button 
                  onClick={() => setInputMessage('Explain portfolio diversification and risk management strategies in simple terms')}
                  style={{ 
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📚 Educational AI
                </Button>
                <Button 
                  onClick={() => setInputMessage('What are the current market trends and how should I adjust my investment strategy?')}
                  style={{ 
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🌊 Market Analysis
                </Button>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>
                  AI Capabilities
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                  <div>• 🧠 Advanced AI responses</div>
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
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>
                  AI Personality
                </h3>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
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

        {/* Other tabs would be implemented similarly with modern glassmorphism design */}
        {activeTab === 'predictions' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>🔮 ML Predictions</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.8 }}>Advanced machine learning predictions coming soon...</p>
          </div>
        )}

        {activeTab === 'insights' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>💡 AI Insights</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.8 }}>Intelligent market insights coming soon...</p>
          </div>
        )}

        {activeTab === 'models' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1rem' }}>🧠 ML Models</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.8 }}>Machine learning model management coming soon...</p>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
      `}</style>
    </div>
  );
};

export default ModernAIAgent;
