import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';

interface MLModel {
  id: string;
  name: string;
  type: 'regression' | 'classification' | 'clustering' | 'neural_network';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  status: 'training' | 'active' | 'retired';
  lastUpdated: Date;
  features: string[];
  predictions: number;
}

interface ModelPerformance {
  modelId: string;
  timeframe: string;
  accuracy: number[];
  loss: number[];
  validationAccuracy: number[];
  validationLoss: number[];
  timestamps: string[];
}

interface FeatureImportance {
  feature: string;
  importance: number;
  category: 'technical' | 'fundamental' | 'sentiment' | 'macro';
}

interface PredictionAccuracy {
  symbol: string;
  timeframe: string;
  actualReturn: number;
  predictedReturn: number;
  accuracy: number;
  direction: 'correct' | 'incorrect';
  confidence: number;
}

const MLAnalytics: React.FC = () => {
  const [models, setModels] = useState<MLModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [performanceData, setPerformanceData] = useState<ModelPerformance | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [predictionAccuracy, setPredictionAccuracy] = useState<PredictionAccuracy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'performance' | 'features' | 'predictions'>('overview');
  const [timeframe, setTimeframe] = useState('30d');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadMLData();
  }, []);

  useEffect(() => {
    if (selectedModel && performanceData) {
      drawPerformanceChart();
    }
  }, [selectedModel, performanceData]);

  const loadMLData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockModels: MLModel[] = [
        {
          id: '1',
          name: 'LSTM Price Predictor',
          type: 'neural_network',
          accuracy: 0.87,
          precision: 0.85,
          recall: 0.89,
          f1Score: 0.87,
          status: 'active',
          lastUpdated: new Date(),
          features: ['Price', 'Volume', 'RSI', 'MACD', 'Bollinger Bands'],
          predictions: 15420
        },
        {
          id: '2',
          name: 'Random Forest Classifier',
          type: 'classification',
          accuracy: 0.82,
          precision: 0.84,
          recall: 0.81,
          f1Score: 0.82,
          status: 'active',
          lastUpdated: new Date(Date.now() - 86400000),
          features: ['P/E Ratio', 'Market Cap', 'Sector', 'Volatility'],
          predictions: 8930
        },
        {
          id: '3',
          name: 'XGBoost Regressor',
          type: 'regression',
          accuracy: 0.91,
          precision: 0.89,
          recall: 0.93,
          f1Score: 0.91,
          status: 'active',
          lastUpdated: new Date(Date.now() - 172800000),
          features: ['Technical Indicators', 'Market Sentiment', 'Economic Data'],
          predictions: 22150
        },
        {
          id: '4',
          name: 'K-Means Clustering',
          type: 'clustering',
          accuracy: 0.78,
          precision: 0.76,
          recall: 0.80,
          f1Score: 0.78,
          status: 'training',
          lastUpdated: new Date(Date.now() - 3600000),
          features: ['Price Patterns', 'Volume Patterns', 'Volatility Clusters'],
          predictions: 0
        }
      ];

      const mockFeatureImportance: FeatureImportance[] = [
        { feature: 'RSI (14)', importance: 0.23, category: 'technical' },
        { feature: 'MACD Signal', importance: 0.19, category: 'technical' },
        { feature: 'Volume Ratio', importance: 0.17, category: 'technical' },
        { feature: 'P/E Ratio', importance: 0.15, category: 'fundamental' },
        { feature: 'Market Sentiment', importance: 0.12, category: 'sentiment' },
        { feature: 'Bollinger Position', importance: 0.08, category: 'technical' },
        { feature: 'Sector Performance', importance: 0.06, category: 'macro' }
      ];

      const mockPredictionAccuracy: PredictionAccuracy[] = [
        { symbol: 'AAPL', timeframe: '1D', actualReturn: 0.023, predictedReturn: 0.019, accuracy: 0.83, direction: 'correct', confidence: 0.87 },
        { symbol: 'GOOGL', timeframe: '1D', actualReturn: -0.015, predictedReturn: -0.012, accuracy: 0.80, direction: 'correct', confidence: 0.82 },
        { symbol: 'MSFT', timeframe: '1D', actualReturn: 0.031, predictedReturn: -0.005, accuracy: 0.16, direction: 'incorrect', confidence: 0.75 },
        { symbol: 'TSLA', timeframe: '1D', actualReturn: 0.045, predictedReturn: 0.038, accuracy: 0.84, direction: 'correct', confidence: 0.91 },
        { symbol: 'AMZN', timeframe: '1D', actualReturn: -0.008, predictedReturn: -0.011, accuracy: 0.63, direction: 'correct', confidence: 0.78 }
      ];

      setModels(mockModels);
      setFeatureImportance(mockFeatureImportance);
      setPredictionAccuracy(mockPredictionAccuracy);
      setSelectedModel(mockModels[0].id);
      generatePerformanceData(mockModels[0].id);
      setIsLoading(false);
    }, 2000);
  };

  const generatePerformanceData = (modelId: string) => {
    const days = 30;
    const timestamps = [];
    const accuracy = [];
    const loss = [];
    const validationAccuracy = [];
    const validationLoss = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      timestamps.push(date.toISOString().split('T')[0]);
      
      // Generate realistic training curves
      const baseAccuracy = 0.6 + Math.random() * 0.3;
      const trend = Math.sin(i / days * Math.PI) * 0.1;
      accuracy.push(Math.min(0.95, baseAccuracy + trend + Math.random() * 0.05));
      loss.push(Math.max(0.1, 1.5 - (i / days) * 1.2 + Math.random() * 0.2));
      validationAccuracy.push(accuracy[i] - Math.random() * 0.1);
      validationLoss.push(loss[i] + Math.random() * 0.1);
    }

    setPerformanceData({
      modelId,
      timeframe: '30d',
      accuracy,
      loss,
      validationAccuracy,
      validationLoss,
      timestamps
    });
  };

  const drawPerformanceChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !performanceData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    const padding = 60;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Draw accuracy line
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    performanceData.accuracy.forEach((value, index) => {
      const x = padding + (chartWidth / (performanceData.accuracy.length - 1)) * index;
      const y = padding + chartHeight - (value * chartHeight);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw validation accuracy line
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    performanceData.validationAccuracy.forEach((value, index) => {
      const x = padding + (chartWidth / (performanceData.validationAccuracy.length - 1)) * index;
      const y = padding + chartHeight - (value * chartHeight);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw loss line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    performanceData.loss.forEach((value, index) => {
      const x = padding + (chartWidth / (performanceData.loss.length - 1)) * index;
      const y = padding + chartHeight - ((value / 2) * chartHeight); // Scale loss to 0-0.5
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const value = i / 5;
      const y = padding + (chartHeight / 5) * (5 - i);
      ctx.fillText((value * 100).toFixed(0) + '%', padding - 10, y + 4);
    }

    // Draw legend
    ctx.textAlign = 'left';
    ctx.fillStyle = '#059669';
    ctx.fillText('Training Accuracy', canvas.width - 200, 30);
    ctx.fillStyle = '#2563eb';
    ctx.fillText('Validation Accuracy', canvas.width - 200, 50);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Loss (scaled)', canvas.width - 200, 70);
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'neural_network': return '🧠';
      case 'classification': return '📊';
      case 'regression': return '📈';
      case 'clustering': return '🔍';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#059669';
      case 'training': return '#f59e0b';
      case 'retired': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return '#2563eb';
      case 'fundamental': return '#059669';
      case 'sentiment': return '#f59e0b';
      case 'macro': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner size="lg" />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading ML Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          🧠 ML Analytics Dashboard
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Advanced machine learning model performance and analytics
        </p>
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
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'models', label: '🤖 Models', icon: '🤖' },
            { id: 'performance', label: '📈 Performance', icon: '📈' },
            { id: 'features', label: '🔍 Features', icon: '🔍' },
            { id: 'predictions', label: '🎯 Predictions', icon: '🎯' }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>🤖</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Active Models
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  {models.filter(m => m.status === 'active').length} of {models.length}
                </p>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
              {models.filter(m => m.status === 'active').length}
            </div>
          </Card>

          <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>📊</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Avg Accuracy
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Across all models
                </p>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {(models.reduce((acc, m) => acc + m.accuracy, 0) / models.length * 100).toFixed(1)}%
            </div>
          </Card>

          <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>🎯</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Total Predictions
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  This month
                </p>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              {models.reduce((acc, m) => acc + m.predictions, 0).toLocaleString()}
            </div>
          </Card>

          <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>⚡</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Avg Response Time
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Model inference
                </p>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              45ms
            </div>
          </Card>
        </div>
      )}

      {/* Models Tab */}
      {activeTab === 'models' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {models.map((model) => (
            <Card key={model.id} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>{getModelTypeIcon(model.type)}</div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                      {model.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, textTransform: 'capitalize' }}>
                      {model.type.replace('_', ' ')} • {model.predictions.toLocaleString()} predictions
                    </p>
                  </div>
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  backgroundColor: getStatusColor(model.status),
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'uppercase'
                }}>
                  {model.status}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Accuracy</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                    {(model.accuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Precision</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                    {(model.precision * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Recall</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                    {(model.recall * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>F1 Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                    {(model.f1Score * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                  Features:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {model.features.map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Last updated: {model.lastUpdated.toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="outline" style={{ fontSize: '0.75rem' }}>
                    Retrain
                  </Button>
                  <Button variant="outline" style={{ fontSize: '0.75rem' }}>
                    Deploy
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          <Card style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
                Model Performance Over Time
              </h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    generatePerformanceData(e.target.value);
                  }}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem'
                  }}
                >
                  {models.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="90d">90 Days</option>
                </select>
              </div>
            </div>
            <canvas ref={canvasRef} style={{ width: '100%', height: '400px', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
          </Card>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div>
          <Card style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Feature Importance Analysis
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {featureImportance.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: getCategoryColor(feature.category),
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    minWidth: '80px',
                    textAlign: 'center'
                  }}>
                    {feature.category.toUpperCase()}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                        {feature.feature}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                        {(feature.importance * 100).toFixed(1)}%
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
                        width: `${feature.importance * 100}%`,
                        height: '100%',
                        backgroundColor: getCategoryColor(feature.category),
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div>
          <Card style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Prediction Accuracy Analysis
            </h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Symbol</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Timeframe</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Actual Return</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Predicted Return</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Accuracy</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Direction</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {predictionAccuracy.map((prediction, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827', fontWeight: '600' }}>
                        {prediction.symbol}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {prediction.timeframe}
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: prediction.actualReturn >= 0 ? '#059669' : '#ef4444' }}>
                        {(prediction.actualReturn * 100).toFixed(2)}%
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: prediction.predictedReturn >= 0 ? '#059669' : '#ef4444' }}>
                        {(prediction.predictedReturn * 100).toFixed(2)}%
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                        {(prediction.accuracy * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: prediction.direction === 'correct' ? '#dcfce7' : '#fef2f2',
                          color: prediction.direction === 'correct' ? '#166534' : '#dc2626'
                        }}>
                          {prediction.direction}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                        {(prediction.confidence * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MLAnalytics;
