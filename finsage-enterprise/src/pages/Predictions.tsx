import React, { useState } from 'react';

const Predictions: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 30,
    annualIncome: 75000,
    riskTolerance: 'moderate',
    investmentAmount: 10000,
    financialGoals: []
  });
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const financialGoals = [
    'Retirement Planning',
    'Wealth Building',
    'Income Generation',
    'Education Funding',
    'Home Purchase',
    'Emergency Fund'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter(g => g !== goal)
        : [...prev.financialGoals, goal]
    }));
  };

  const generatePrediction = () => {
    setLoading(true);
    
    // Simulate AI prediction generation
    setTimeout(() => {
      const riskMultiplier = formData.riskTolerance === 'aggressive' ? 1.5 : formData.riskTolerance === 'moderate' ? 1.0 : 0.5;
      const expectedReturn = 8 + (Math.random() * 12 * riskMultiplier);
      const confidence = 75 + Math.random() * 20;
      const riskScore = formData.riskTolerance === 'aggressive' ? 8 : formData.riskTolerance === 'moderate' ? 5 : 3;
      
      const recommendations = [
        { symbol: 'AAPL', action: 'BUY', allocation: 25, confidence: 85, reasoning: 'Strong fundamentals and growth potential' },
        { symbol: 'GOOGL', action: 'BUY', allocation: 20, confidence: 80, reasoning: 'AI leadership and cloud growth' },
        { symbol: 'MSFT', action: 'BUY', allocation: 15, confidence: 82, reasoning: 'Cloud computing dominance' },
        { symbol: 'JNJ', action: 'HOLD', allocation: 10, confidence: 70, reasoning: 'Stable dividend income' },
        { symbol: 'VTI', action: 'BUY', allocation: 30, confidence: 90, reasoning: 'Broad market diversification' }
      ];

      setPredictionResult({
        expectedReturn,
        confidence,
        riskScore,
        marketTrend: expectedReturn > 12 ? 'Bullish' : expectedReturn > 8 ? 'Neutral' : 'Bearish',
        recommendations
      });
      
      setCurrentStep(4);
      setLoading(false);
    }, 2000);
  };

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic information about yourself' },
    { number: 2, title: 'Financial Situation', description: 'Your current financial status' },
    { number: 3, title: 'Investment Goals', description: 'What you want to achieve' },
    { number: 4, title: 'AI Analysis', description: 'Get your personalized recommendations' },
  ];

  const StepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap' }}>
      {steps.map((step, index) => (
        <div key={step.number} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid',
            borderColor: currentStep >= step.number ? '#2563eb' : '#d1d5db',
            backgroundColor: currentStep >= step.number ? '#2563eb' : 'white',
            color: currentStep >= step.number ? 'white' : '#9ca3af',
            marginRight: '0.75rem'
          }}>
            {currentStep > step.number ? '✓' : step.number}
          </div>
          <div>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: currentStep >= step.number ? '#2563eb' : '#9ca3af',
              margin: 0
            }}>
              {step.title}
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              margin: 0
            }}>
              {step.description}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div style={{
              width: '64px',
              height: '2px',
              margin: '0 1rem',
              backgroundColor: currentStep > step.number ? '#2563eb' : '#d1d5db'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  const Step1 = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
        Personal Information
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Age
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Annual Income
          </label>
          <input
            type="number"
            value={formData.annualIncome}
            onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setCurrentStep(2)}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Next Step
        </button>
      </div>
    </div>
  );

  const Step2 = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
        Financial Situation
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Risk Tolerance
          </label>
          <select
            value={formData.riskTolerance}
            onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="conservative">Conservative - Low risk, steady returns</option>
            <option value="moderate">Moderate - Balanced risk and return</option>
            <option value="aggressive">Aggressive - High risk, high potential returns</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Investment Amount
          </label>
          <input
            type="number"
            value={formData.investmentAmount}
            onChange={(e) => handleInputChange('investmentAmount', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentStep(1)}
          style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Next Step
        </button>
      </div>
    </div>
  );

  const Step3 = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
        Investment Goals
      </h2>
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '1rem' }}>
          Financial Goals (Select all that apply)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {financialGoals.map((goal) => (
            <label
              key={goal}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backgroundColor: formData.financialGoals.includes(goal) ? '#eff6ff' : 'white'
              }}
            >
              <input
                type="checkbox"
                checked={formData.financialGoals.includes(goal)}
                onChange={() => handleGoalToggle(goal)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{goal}</span>
            </label>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentStep(2)}
          style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Previous
        </button>
        <button
          onClick={generatePrediction}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate AI Prediction'}
        </button>
      </div>
    </div>
  );

  const Step4 = () => {
    if (!predictionResult) return null;

    return (
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          AI Investment Recommendation
        </h2>
        
        {/* Hero Card */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                AI Investment Recommendation
              </h3>
              <p style={{ color: '#6b7280' }}>
                Based on your profile, here's your personalized investment strategy
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                +{predictionResult.expectedReturn.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Return</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              {predictionResult.marketTrend}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Market Trend</div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              {predictionResult.confidence.toFixed(0)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Confidence</div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              {predictionResult.riskScore}/10
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Risk Score</div>
          </div>
        </div>

        {/* Recommendations Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Investment Recommendations
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Symbol</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Action</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Allocation</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Confidence</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Reasoning</th>
                </tr>
              </thead>
              <tbody>
                {predictionResult.recommendations.map((rec: any, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500', color: '#111827' }}>{rec.symbol}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: rec.action === 'BUY' ? '#dcfce7' : rec.action === 'SELL' ? '#fef2f2' : '#fef3c7',
                        color: rec.action === 'BUY' ? '#166534' : rec.action === 'SELL' ? '#991b1b' : '#92400e'
                      }}>
                        {rec.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{rec.allocation}%</td>
                    <td style={{ padding: '0.75rem' }}>{rec.confidence}%</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{rec.reasoning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentStep(1)}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          AI Investment Predictions
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Get personalized investment recommendations powered by advanced AI analysis
        </p>
      </div>

      <StepIndicator />

      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        {currentStep === 1 && <Step1 />}
        {currentStep === 2 && <Step2 />}
        {currentStep === 3 && <Step3 />}
        {currentStep === 4 && <Step4 />}
      </div>
    </div>
  );
};

export default Predictions;