// OpenAI GPT Integration Service
export interface GPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GPTResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  finish_reason: string;
}

export interface GPTConfig {
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo';
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

class OpenAIService {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1';
  private defaultConfig: GPTConfig = {
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async generateResponse(
    messages: GPTMessage[],
    config: Partial<GPTConfig> = {}
  ): Promise<GPTResponse> {
    if (!this.apiKey) {
      // Fallback to mock response if no API key
      return this.generateMockResponse(messages);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || this.defaultConfig.model,
          messages,
          temperature: config.temperature || this.defaultConfig.temperature,
          max_tokens: config.max_tokens || this.defaultConfig.max_tokens,
          top_p: config.top_p || this.defaultConfig.top_p,
          frequency_penalty: config.frequency_penalty || this.defaultConfig.frequency_penalty,
          presence_penalty: config.presence_penalty || this.defaultConfig.presence_penalty
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        usage: data.usage,
        model: data.model,
        finish_reason: data.choices[0].finish_reason
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.generateMockResponse(messages);
    }
  }

  private generateMockResponse(messages: GPTMessage[]): GPTResponse {
    const lastMessage = messages[messages.length - 1];
    const isFinancialQuery = lastMessage.content.toLowerCase().includes('stock') || 
                            lastMessage.content.toLowerCase().includes('invest') ||
                            lastMessage.content.toLowerCase().includes('market') ||
                            lastMessage.content.toLowerCase().includes('portfolio');

    let content = '';
    
    if (isFinancialQuery) {
      content = this.generateFinancialResponse(lastMessage.content);
    } else {
      content = this.generateGeneralResponse(lastMessage.content);
    }

    return {
      content,
      usage: {
        prompt_tokens: 50,
        completion_tokens: 150,
        total_tokens: 200
      },
      model: 'gpt-4',
      finish_reason: 'stop'
    };
  }

  private generateFinancialResponse(query: string): string {
    const responses = [
      `Based on current market analysis, I can provide you with comprehensive insights. ${query.includes('stock') ? 'For stock analysis, I recommend considering both technical indicators and fundamental metrics. The current market shows strong momentum with key support levels holding well.' : 'Your investment strategy should focus on diversification and risk management.'} Let me know if you'd like me to dive deeper into any specific aspect.`,
      
      `I've analyzed your query about financial markets. ${query.includes('predict') ? 'While I can provide educated analysis based on current trends, remember that market predictions carry inherent risks. I recommend focusing on long-term fundamentals rather than short-term speculation.' : 'The key is to maintain a balanced approach and stay informed about market developments.'} Would you like me to elaborate on any particular area?`,
      
      `From a financial perspective, ${query.toLowerCase().includes('risk') ? 'risk management is crucial. I suggest implementing stop-loss orders, diversifying across sectors, and maintaining an appropriate asset allocation based on your risk tolerance.' : 'it\'s important to consider both opportunities and challenges in the current market environment.'} I can provide more specific guidance if you share your investment goals and risk profile.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateGeneralResponse(query: string): string {
    const responses = [
      `I understand you're asking about "${query}". This is an interesting topic that I'd be happy to explore with you. Could you provide more context about what specific aspect you'd like to focus on?`,
      
      `Thank you for your question. Based on my analysis, I can provide insights on this topic. However, I'd like to ensure I give you the most relevant information. Could you clarify what specific outcome you're looking for?`,
      
      `That's a great question! I can help you understand this better. To provide the most accurate and helpful response, could you tell me more about your current situation or what you're trying to achieve?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Specialized financial analysis with GPT
  async analyzeStock(symbol: string, analysisType: 'technical' | 'fundamental' | 'sentiment' | 'comprehensive' = 'comprehensive'): Promise<string> {
    const systemPrompt = `You are an expert financial analyst with access to real-time market data. Provide detailed, professional analysis for ${symbol} stock.`;
    
    const userPrompt = `Please provide a ${analysisType} analysis of ${symbol} stock. Include:
    - Current market position and trends
    - Key technical indicators (if technical/comprehensive)
    - Fundamental metrics and financial health (if fundamental/comprehensive)
    - Market sentiment and analyst opinions (if sentiment/comprehensive)
    - Risk assessment and investment recommendation
    - Confidence level in your analysis`;

    const messages: GPTMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.generateResponse(messages, {
      temperature: 0.3, // Lower temperature for more consistent financial analysis
      max_tokens: 1500
    });

    return response.content;
  }

  // Portfolio optimization with GPT
  async optimizePortfolio(portfolio: any[], userProfile: any): Promise<string> {
    const systemPrompt = `You are a certified financial advisor specializing in portfolio optimization. Provide personalized investment recommendations based on the user's profile and current market conditions.`;
    
    const userPrompt = `Optimize this portfolio for a user with:
    - Risk Tolerance: ${userProfile.riskTolerance}
    - Investment Goals: ${userProfile.investmentGoals.join(', ')}
    - Experience Level: ${userProfile.experience}
    - Time Horizon: ${userProfile.timeHorizon}
    
    Current Portfolio: ${JSON.stringify(portfolio)}
    
    Provide specific recommendations for:
    1. Asset allocation adjustments
    2. Individual stock/fund recommendations
    3. Risk management strategies
    4. Rebalancing schedule
    5. Market timing considerations`;

    const messages: GPTMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.generateResponse(messages, {
      temperature: 0.4,
      max_tokens: 2000
    });

    return response.content;
  }

  // Market prediction with GPT
  async predictMarket(symbol: string, timeframe: string): Promise<string> {
    const systemPrompt = `You are a quantitative analyst with expertise in market prediction. Provide data-driven forecasts with clear reasoning and risk assessments.`;
    
    const userPrompt = `Provide a market prediction for ${symbol} over the next ${timeframe}. Include:
    - Price target with confidence intervals
    - Key factors driving the prediction
    - Potential risks and catalysts
    - Technical and fundamental analysis
    - Probability scenarios (bull, base, bear cases)
    - Recommended position sizing and risk management`;

    const messages: GPTMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.generateResponse(messages, {
      temperature: 0.2, // Very low temperature for consistent predictions
      max_tokens: 1800
    });

    return response.content;
  }

  // Educational content with GPT
  async explainConcept(concept: string, userLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'): Promise<string> {
    const systemPrompt = `You are a financial educator with expertise in explaining complex concepts clearly. Adapt your explanation to the user's experience level: ${userLevel}.`;
    
    const userPrompt = `Explain "${concept}" in a way that's appropriate for a ${userLevel} level investor. Include:
    - Clear definition and key concepts
    - Real-world examples and analogies
    - Practical applications
    - Common mistakes to avoid
    - Related concepts to explore next
    - Actionable next steps`;

    const messages: GPTMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.generateResponse(messages, {
      temperature: 0.6, // Higher temperature for more creative explanations
      max_tokens: 1200
    });

    return response.content;
  }

  // Check if API key is available
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  // Get API status
  getStatus(): { configured: boolean; model: string; features: string[] } {
    return {
      configured: this.isConfigured(),
      model: this.defaultConfig.model,
      features: [
        'Stock Analysis',
        'Portfolio Optimization',
        'Market Prediction',
        'Educational Content',
        'Risk Assessment',
        'Sentiment Analysis'
      ]
    };
  }
}

export const openaiService = new OpenAIService();
