import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const AIDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'agent' | 'analytics' | 'optimizer'>('agent');

  const demos = [
    {
      id: 'agent',
      title: '🤖 AI Financial Agent',
      description: 'Intelligent chat interface with ML predictions and market insights',
      features: [
        'Natural language conversation',
        'Real-time ML predictions',
        'AI-generated market insights',
        'Confidence scoring',
        'Smart recommendations'
      ],
      url: '/ai-agent',
      color: '#8b5cf6'
    },
    {
      id: 'analytics',
      title: '🧠 ML Analytics Dashboard',
      description: 'Advanced machine learning model performance and analytics',
      features: [
        'Model performance tracking',
        'Feature importance analysis',
        'Prediction accuracy metrics',
        'Real-time model monitoring',
        'Interactive visualizations'
      ],
      url: '/ml-analytics',
      color: '#f59e0b'
    },
    {
      id: 'optimizer',
      title: '🎯 AI Portfolio Optimizer',
      description: 'AI-powered portfolio optimization with multiple strategies',
      features: [
        'Multiple optimization strategies',
        'Real-time portfolio analysis',
        'AI recommendations',
        'Risk assessment',
        'Interactive portfolio visualization'
      ],
      url: '/analytics',
      color: '#059669'
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          🤖 AI Features Demo
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Experience the power of AI and machine learning in financial analysis
        </p>
      </div>

      {/* Demo Selection */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Choose AI Feature to Demo
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {demos.map((demo) => (
            <div
              key={demo.id}
              onClick={() => setActiveDemo(demo.id as any)}
              style={{
                padding: '1.5rem',
                border: '2px solid',
                borderColor: activeDemo === demo.id ? demo.color : '#e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: activeDemo === demo.id ? `${demo.color}10` : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                {demo.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                {demo.description}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Key Features:
                </h4>
                <ul style={{ fontSize: '0.75rem', color: '#6b7280', paddingLeft: '1rem', margin: 0 }}>
                  {demo.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = demo.url;
                }}
                style={{
                  width: '100%',
                  backgroundColor: demo.color,
                  color: 'white',
                  border: 'none'
                }}
              >
                Try {demo.title.split(' ')[1]}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Demo Preview */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          {demos.find(d => d.id === activeDemo)?.title} Preview
        </h2>
        
        {activeDemo === 'agent' && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '1rem',
                fontSize: '0.875rem',
                maxWidth: '80%'
              }}>
                Analyze AAPL stock performance
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'white',
                color: '#111827',
                borderRadius: '1rem',
                fontSize: '0.875rem',
                maxWidth: '80%',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                Based on my analysis, AAPL shows strong technical indicators with RSI at 65 and MACD showing bullish divergence. The stock appears to be in an uptrend with good volume support. Confidence: 88%
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}>
                Show detailed technical analysis
              </button>
              <button style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}>
                Compare with sector performance
              </button>
            </div>
          </div>
        )}

        {activeDemo === 'analytics' && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>4</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Models</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>87.5%</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Accuracy</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>56,500</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Predictions</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#111827' }}>LSTM Price Predictor</span>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>87%</div>
                  <div style={{ width: '60px', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                    <div style={{ width: '87%', height: '100%', backgroundColor: '#059669', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'white', borderRadius: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#111827' }}>BERT Sentiment Analysis</span>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>92%</div>
                  <div style={{ width: '60px', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                    <div style={{ width: '92%', height: '100%', backgroundColor: '#059669', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'optimizer' && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>Portfolio Metrics</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Return</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>15.2%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Volatility</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>18.5%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sharpe Ratio</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>0.82</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>Risk Analysis</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Risk Level</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>MEDIUM</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Concentration</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>25.0%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sector Risk</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>45.0%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>AI Recommendations</h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem' }}>
                  <div style={{ padding: '0.25rem 0.5rem', backgroundColor: '#059669', color: 'white', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}>BUY</div>
                  <span style={{ fontSize: '0.875rem', color: '#111827' }}>AAPL - Increase allocation to 30%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem' }}>
                  <div style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}>SELL</div>
                  <span style={{ fontSize: '0.875rem', color: '#111827' }}>JPM - Reduce allocation to 7%</span>
                </div>
              </div>
            </div>
          </div>
        )}
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
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Button
            onClick={() => window.location.href = '/ai-agent'}
            style={{ width: '100%', backgroundColor: '#8b5cf6', color: 'white' }}
          >
            🤖 Try AI Agent
          </Button>
          <Button
            onClick={() => window.location.href = '/ml-analytics'}
            style={{ width: '100%', backgroundColor: '#f59e0b', color: 'white' }}
          >
            🧠 View ML Analytics
          </Button>
          <Button
            onClick={() => window.location.href = '/analytics'}
            style={{ width: '100%', backgroundColor: '#059669', color: 'white' }}
          >
            🎯 Optimize Portfolio
          </Button>
          <Button
            onClick={() => window.location.href = '/charts'}
            style={{ width: '100%', backgroundColor: '#2563eb', color: 'white' }}
          >
            📊 Dynamic Charts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIDemo;
