// Environment Configuration
export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4',
    maxTokens: 2000,
    temperature: 0.7
  },
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
    timeout: 10000
  },
  app: {
    name: 'FinSage Enterprise',
    version: '1.0.0',
    description: 'Advanced AI-Powered Financial Intelligence Platform'
  }
};

export default config;
