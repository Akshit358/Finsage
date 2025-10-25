import React, { useState, useEffect } from 'react';

const RoboAdvisor: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    age: 30,
    annualIncome: 75000,
    employmentStatus: 'employed',
    dependents: 0,
    
    // Financial Situation
    totalAssets: 100000,
    totalDebt: 25000,
    monthlyExpenses: 4000,
    emergencyFund: 10000,
    
    // Investment Experience
    experience: 'beginner',
    riskTolerance: 'moderate',
    investmentAmount: 10000,
    timeHorizon: '5-10',
    
    // Goals
    primaryGoal: 'retirement',
    secondaryGoals: [],
    targetAmount: 1000000,
    targetDate: '2035',
    
    // Preferences
    investmentStyle: 'balanced',
    rebalancingFrequency: 'quarterly',
    taxConsideration: true,
    esgInvesting: false
  });
  
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic information about yourself' },
    { number: 2, title: 'Financial Situation', description: 'Your current financial status' },
    { number: 3, title: 'Investment Profile', description: 'Your investment experience and preferences' },
    { number: 4, title: 'Goals & Timeline', description: 'What you want to achieve' },
    { number: 5, title: 'Preferences', description: 'Investment style and preferences' },
    { number: 6, title: 'Recommendations', description: 'Your personalized investment plan' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateRecommendations = () => {
    setLoading(true);
    
    setTimeout(() => {
      // Calculate risk score based on inputs
      let riskScore = 5; // Base moderate risk
      
      // Age factor
      if (formData.age < 30) riskScore += 2;
      else if (formData.age > 50) riskScore -= 2;
      
      // Experience factor
      if (formData.experience === 'expert') riskScore += 2;
      else if (formData.experience === 'beginner') riskScore -= 1;
      
      // Time horizon factor
      if (formData.timeHorizon === '10+') riskScore += 2;
      else if (formData.timeHorizon === '1-3') riskScore -= 2;
      
      // Income stability
      if (formData.employmentStatus === 'self-employed') riskScore -= 1;
      
      riskScore = Math.max(1, Math.min(10, riskScore));
      
      // Generate portfolio based on risk score
      const portfolios = {
        conservative: {
          stocks: 30,
          bonds: 50,
          cash: 15,
          alternatives: 5,
          expectedReturn: 6.5,
          volatility: 8.2
        },
        moderate: {
          stocks: 60,
          bonds: 30,
          cash: 5,
          alternatives: 5,
          expectedReturn: 8.5,
          volatility: 12.1
        },
        aggressive: {
          stocks: 80,
          bonds: 15,
          cash: 0,
          alternatives: 5,
          expectedReturn: 10.2,
          volatility: 18.7
        }
      };
      
      let portfolioType = 'moderate';
      if (riskScore <= 3) portfolioType = 'conservative';
      else if (riskScore >= 7) portfolioType = 'aggressive';
      
      const portfolio = portfolios[portfolioType as keyof typeof portfolios];
      
      // Generate specific recommendations
      const stockRecommendations = [
        { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', allocation: portfolio.stocks * 0.4, reasoning: 'Broad market exposure' },
        { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', allocation: portfolio.stocks * 0.3, reasoning: 'International diversification' },
        { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', allocation: portfolio.stocks * 0.2, reasoning: 'Emerging market growth' },
        { symbol: 'VUG', name: 'Vanguard Growth ETF', allocation: portfolio.stocks * 0.1, reasoning: 'Growth potential' }
      ];
      
      const bondRecommendations = [
        { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', allocation: portfolio.bonds * 0.6, reasoning: 'Core bond exposure' },
        { symbol: 'VGLT', name: 'Vanguard Long-Term Treasury ETF', allocation: portfolio.bonds * 0.4, reasoning: 'Interest rate protection' }
      ];
      
      const cashRecommendations = [
        { symbol: 'VMMXX', name: 'Vanguard Prime Money Market Fund', allocation: portfolio.cash, reasoning: 'Liquidity and safety' }
      ];
      
      setRecommendations({
        riskScore,
        portfolioType,
        portfolio,
        allocations: [...stockRecommendations, ...bondRecommendations, ...cashRecommendations],
        monthlyContribution: Math.max(100, Math.floor(formData.investmentAmount / 12)),
        rebalancingFrequency: formData.rebalancingFrequency,
        expectedValue: {
          '1year': formData.investmentAmount * (1 + portfolio.expectedReturn / 100),
          '5year': formData.investmentAmount * Math.pow(1 + portfolio.expectedReturn / 100, 5),
          '10year': formData.investmentAmount * Math.pow(1 + portfolio.expectedReturn / 100, 10)
        },
        nextSteps: [
          'Open a brokerage account if you don\'t have one',
          'Set up automatic monthly contributions',
          'Implement the recommended asset allocation',
          'Schedule quarterly portfolio reviews',
          'Consider tax-advantaged accounts (401k, IRA)'
        ]
      });
      
      setCurrentStep(6);
      setLoading(false);
    }, 2000);
  };

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
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Employment Status
          </label>
          <select
            value={formData.employmentStatus}
            onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Number of Dependents
          </label>
          <input
            type="number"
            value={formData.dependents}
            onChange={(e) => handleInputChange('dependents', parseInt(e.target.value))}
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
            Total Assets
          </label>
          <input
            type="number"
            value={formData.totalAssets}
            onChange={(e) => handleInputChange('totalAssets', parseInt(e.target.value))}
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
            Total Debt
          </label>
          <input
            type="number"
            value={formData.totalDebt}
            onChange={(e) => handleInputChange('totalDebt', parseInt(e.target.value))}
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
            Monthly Expenses
          </label>
          <input
            type="number"
            value={formData.monthlyExpenses}
            onChange={(e) => handleInputChange('monthlyExpenses', parseInt(e.target.value))}
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
            Emergency Fund
          </label>
          <input
            type="number"
            value={formData.emergencyFund}
            onChange={(e) => handleInputChange('emergencyFund', parseInt(e.target.value))}
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
        Investment Profile
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Investment Experience
          </label>
          <select
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="beginner">Beginner (0-2 years)</option>
            <option value="intermediate">Intermediate (2-5 years)</option>
            <option value="advanced">Advanced (5-10 years)</option>
            <option value="expert">Expert (10+ years)</option>
          </select>
        </div>
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
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
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
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Time Horizon
          </label>
          <select
            value={formData.timeHorizon}
            onChange={(e) => handleInputChange('timeHorizon', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
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
          onClick={() => setCurrentStep(4)}
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

  const Step4 = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
        Goals & Timeline
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Primary Goal
          </label>
          <select
            value={formData.primaryGoal}
            onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="retirement">Retirement</option>
            <option value="home">Home Purchase</option>
            <option value="education">Education</option>
            <option value="wealth">Wealth Building</option>
            <option value="emergency">Emergency Fund</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Target Amount
          </label>
          <input
            type="number"
            value={formData.targetAmount}
            onChange={(e) => handleInputChange('targetAmount', parseInt(e.target.value))}
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
            Target Date
          </label>
          <input
            type="number"
            value={formData.targetDate}
            onChange={(e) => handleInputChange('targetDate', e.target.value)}
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
      
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '1rem' }}>
          Secondary Goals (Select all that apply)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {['Travel', 'Car Purchase', 'Wedding', 'Business Investment', 'Charity', 'Legacy Planning'].map((goal) => (
            <label
              key={goal}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backgroundColor: formData.secondaryGoals.includes(goal) ? '#eff6ff' : 'white'
              }}
            >
              <input
                type="checkbox"
                checked={formData.secondaryGoals.includes(goal)}
                onChange={() => handleMultiSelect('secondaryGoals', goal)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{goal}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentStep(3)}
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
          onClick={() => setCurrentStep(5)}
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

  const Step5 = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
        Investment Preferences
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Investment Style
          </label>
          <select
            value={formData.investmentStyle}
            onChange={(e) => handleInputChange('investmentStyle', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="passive">Passive (Index Funds)</option>
            <option value="balanced">Balanced (Mix)</option>
            <option value="active">Active (Individual Stocks)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Rebalancing Frequency
          </label>
          <select
            value={formData.rebalancingFrequency}
            onChange={(e) => handleInputChange('rebalancingFrequency', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
            <option value="as-needed">As Needed</option>
          </select>
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Additional Preferences
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.taxConsideration}
              onChange={(e) => handleInputChange('taxConsideration', e.target.checked)}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Consider tax implications in recommendations
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.esgInvesting}
              onChange={(e) => handleInputChange('esgInvesting', e.target.checked)}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Prefer ESG (Environmental, Social, Governance) investments
            </span>
          </label>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentStep(4)}
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
          onClick={generateRecommendations}
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
          {loading ? 'Generating...' : 'Get Recommendations'}
        </button>
      </div>
    </div>
  );

  const Step6 = () => {
    if (!recommendations) return null;

    return (
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Your Personalized Investment Plan
        </h2>
        
        {/* Risk Assessment */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Risk Assessment
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>
                Risk Score: {recommendations.riskScore}/10
              </div>
              <div style={{ fontSize: '1rem', color: '#6b7280' }}>
                Recommended Portfolio: {recommendations.portfolioType.charAt(0).toUpperCase() + recommendations.portfolioType.slice(1)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                {recommendations.portfolio.expectedReturn}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Return</div>
            </div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            Recommended Asset Allocation
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {recommendations.portfolio.stocks}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Stocks</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {recommendations.portfolio.bonds}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bonds</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {recommendations.portfolio.cash}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Cash</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                {recommendations.portfolio.alternatives}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Alternatives</div>
            </div>
          </div>
        </div>

        {/* Specific Recommendations */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            Specific Investment Recommendations
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Symbol</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Allocation</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Reasoning</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.allocations.map((allocation: any, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem', fontWeight: '500', color: '#111827' }}>{allocation.symbol}</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{allocation.name}</td>
                    <td style={{ padding: '0.75rem', fontWeight: '500', color: '#111827' }}>{allocation.allocation.toFixed(1)}%</td>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{allocation.reasoning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Projected Returns */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            Projected Portfolio Value
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                ${recommendations.expectedValue['1year'].toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>1 Year</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                ${recommendations.expectedValue['5year'].toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>5 Years</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                ${recommendations.expectedValue['10year'].toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>10 Years</div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            Next Steps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recommendations.nextSteps.map((step: string, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {index + 1}
                </div>
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>{step}</span>
              </div>
            ))}
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
          <button
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
            Save Plan
          </button>
          <button
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Implement Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          AI Robo-Advisor
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Get personalized investment recommendations based on your financial profile
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
        {currentStep === 5 && <Step5 />}
        {currentStep === 6 && <Step6 />}
      </div>
    </div>
  );
};

export default RoboAdvisor;