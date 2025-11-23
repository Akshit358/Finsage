import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface RiskMetrics {
  portfolioValue: number;
  var95: number;
  var99: number;
  cvar95: number;
  cvar99: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  beta: number;
  alpha: number;
  volatility: number;
  skewness: number;
  kurtosis: number;
  tailRisk: number;
  concentrationRisk: number;
  liquidityRisk: number;
  creditRisk: number;
  marketRisk: number;
  operationalRisk: number;
}

interface RiskScenario {
  name: string;
  probability: number;
  impact: number;
  riskScore: number;
  description: string;
  mitigation: string[];
  monitoring: string[];
}

interface StressTest {
  scenario: string;
  portfolioImpact: number;
  varImpact: number;
  liquidityImpact: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const RiskManagement: React.FC = () => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [riskScenarios, setRiskScenarios] = useState<RiskScenario[]>([]);
  const [stressTests, setStressTests] = useState<StressTest[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y');
  const [isCalculating, setIsCalculating] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  // Generate mock risk metrics
  const generateRiskMetrics = (): RiskMetrics => {
    const baseValue = 1000000;
    const volatility = 0.15 + Math.random() * 0.1;
    
    return {
      portfolioValue: baseValue + (Math.random() - 0.5) * 100000,
      var95: baseValue * (0.02 + Math.random() * 0.03),
      var99: baseValue * (0.03 + Math.random() * 0.04),
      cvar95: baseValue * (0.025 + Math.random() * 0.035),
      cvar99: baseValue * (0.035 + Math.random() * 0.045),
      maxDrawdown: 0.05 + Math.random() * 0.15,
      sharpeRatio: 0.5 + Math.random() * 1.5,
      sortinoRatio: 0.6 + Math.random() * 1.8,
      calmarRatio: 0.3 + Math.random() * 1.2,
      beta: 0.8 + Math.random() * 0.6,
      alpha: -0.02 + Math.random() * 0.08,
      volatility: volatility,
      skewness: -0.5 + Math.random() * 1.0,
      kurtosis: 2.5 + Math.random() * 2.0,
      tailRisk: 0.01 + Math.random() * 0.03,
      concentrationRisk: 0.1 + Math.random() * 0.3,
      liquidityRisk: 0.05 + Math.random() * 0.15,
      creditRisk: 0.02 + Math.random() * 0.08,
      marketRisk: 0.1 + Math.random() * 0.2,
      operationalRisk: 0.01 + Math.random() * 0.05
    };
  };

  // Generate risk scenarios
  const generateRiskScenarios = (): RiskScenario[] => {
    return [
      {
        name: 'Market Crash (2008-style)',
        probability: 0.05,
        impact: 0.4,
        riskScore: 0.02,
        description: 'Severe market downturn with 40% portfolio decline',
        mitigation: [
          'Diversify across asset classes',
          'Maintain cash reserves',
          'Use hedging strategies',
          'Regular portfolio rebalancing'
        ],
        monitoring: [
          'Monitor VIX levels',
          'Track market volatility',
          'Watch for correlation breakdowns',
          'Assess liquidity conditions'
        ]
      },
      {
        name: 'Interest Rate Shock',
        probability: 0.15,
        impact: 0.15,
        riskScore: 0.0225,
        description: 'Rapid interest rate increase affecting bond and equity values',
        mitigation: [
          'Duration hedging',
          'Floating rate instruments',
          'Interest rate derivatives',
          'Asset-liability matching'
        ],
        monitoring: [
          'Federal Reserve communications',
          'Yield curve movements',
          'Inflation expectations',
          'Central bank policy changes'
        ]
      },
      {
        name: 'Credit Crisis',
        probability: 0.08,
        impact: 0.25,
        riskScore: 0.02,
        description: 'Widespread credit defaults affecting corporate bonds and loans',
        mitigation: [
          'Credit quality diversification',
          'Credit default swaps',
          'High-quality issuers focus',
          'Regular credit analysis'
        ],
        monitoring: [
          'Credit spreads',
          'Default rates',
          'Credit rating changes',
          'Economic indicators'
        ]
      },
      {
        name: 'Liquidity Crisis',
        probability: 0.12,
        impact: 0.2,
        riskScore: 0.024,
        description: 'Market liquidity dries up, making it difficult to sell assets',
        mitigation: [
          'Liquid asset allocation',
          'Staggered maturities',
          'Credit facilities',
          'Diversified funding sources'
        ],
        monitoring: [
          'Bid-ask spreads',
          'Trading volumes',
          'Market depth',
          'Funding costs'
        ]
      },
      {
        name: 'Geopolitical Crisis',
        probability: 0.1,
        impact: 0.18,
        riskScore: 0.018,
        description: 'Major geopolitical event affecting global markets',
        mitigation: [
          'Geographic diversification',
          'Defensive positioning',
          'Alternative investments',
          'Scenario planning'
        ],
        monitoring: [
          'Political developments',
          'Geopolitical risk indices',
          'Currency movements',
          'Commodity prices'
        ]
      },
      {
        name: 'Technology Disruption',
        probability: 0.2,
        impact: 0.12,
        riskScore: 0.024,
        description: 'Rapid technological change disrupting traditional business models',
        mitigation: [
          'Technology sector exposure',
          'Innovation-focused investments',
          'Adaptive strategies',
          'Continuous learning'
        ],
        monitoring: [
          'Technology trends',
          'Innovation metrics',
          'Sector performance',
          'Disruption indicators'
        ]
      }
    ];
  };

  // Generate stress tests
  const generateStressTests = (): StressTest[] => {
    return [
      {
        scenario: '2008 Financial Crisis',
        portfolioImpact: -0.37,
        varImpact: 0.15,
        liquidityImpact: 0.25,
        description: 'Simulation of the 2008 financial crisis impact',
        severity: 'critical'
      },
      {
        scenario: 'COVID-19 Market Crash',
        portfolioImpact: -0.23,
        varImpact: 0.08,
        liquidityImpact: 0.12,
        description: 'Simulation of March 2020 market crash',
        severity: 'high'
      },
      {
        scenario: 'Dot-com Bubble Burst',
        portfolioImpact: -0.31,
        varImpact: 0.12,
        liquidityImpact: 0.18,
        description: 'Simulation of 2000-2002 tech crash',
        severity: 'high'
      },
      {
        scenario: 'Interest Rate Shock (+3%)',
        portfolioImpact: -0.15,
        varImpact: 0.05,
        liquidityImpact: 0.08,
        description: 'Simulation of rapid interest rate increase',
        severity: 'medium'
      },
      {
        scenario: 'Inflation Spike (+5%)',
        portfolioImpact: -0.12,
        varImpact: 0.04,
        liquidityImpact: 0.06,
        description: 'Simulation of high inflation environment',
        severity: 'medium'
      },
      {
        scenario: 'Currency Crisis',
        portfolioImpact: -0.18,
        varImpact: 0.07,
        liquidityImpact: 0.10,
        description: 'Simulation of major currency devaluation',
        severity: 'high'
      }
    ];
  };

  // Calculate risk metrics
  const calculateRiskMetrics = async () => {
    setIsCalculating(true);
    
    // Simulate calculation time
    setTimeout(() => {
      setRiskMetrics(generateRiskMetrics());
      setRiskScenarios(generateRiskScenarios());
      setStressTests(generateStressTests());
      setIsCalculating(false);
    }, 2000);
  };

  useEffect(() => {
    calculateRiskMetrics();
  }, [selectedTimeframe, riskTolerance]);

  const getRiskColor = (value: number, thresholds: { low: number; medium: number; high: number }) => {
    if (value <= thresholds.low) return '#10b981'; // Green
    if (value <= thresholds.medium) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 25% 25%, rgba(239, 68, 68, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
        animation: 'pulse 8s ease-in-out infinite'
      }} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '0.5rem',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          ⚠️ Risk Management Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Comprehensive risk analysis, stress testing, and scenario planning
        </p>
      </div>

      {/* Risk Metrics Overview */}
      {riskMetrics && (
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
              📊 Risk Metrics Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                  {formatCurrency(riskMetrics.portfolioValue)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Portfolio Value</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📉</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: getRiskColor(riskMetrics.var95 / riskMetrics.portfolioValue, { low: 0.02, medium: 0.05, high: 0.08 }),
                  marginBottom: '0.25rem'
                }}>
                  {formatCurrency(riskMetrics.var95)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>VaR (95%)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: getRiskColor(riskMetrics.maxDrawdown, { low: 0.05, medium: 0.15, high: 0.25 }),
                  marginBottom: '0.25rem'
                }}>
                  {formatPercentage(riskMetrics.maxDrawdown)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Max Drawdown</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: getRiskColor(riskMetrics.sharpeRatio, { low: 1.0, medium: 0.5, high: 0.0 }),
                  marginBottom: '0.25rem'
                }}>
                  {riskMetrics.sharpeRatio.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Sharpe Ratio</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: getRiskColor(riskMetrics.volatility, { low: 0.1, medium: 0.2, high: 0.3 }),
                  marginBottom: '0.25rem'
                }}>
                  {formatPercentage(riskMetrics.volatility)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Volatility</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Scenarios */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            🎯 Risk Scenarios
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {riskScenarios.map((scenario, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0 }}>
                    {scenario.name}
                  </h3>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    background: `rgba(${getRiskColor(scenario.riskScore, { low: 0.01, medium: 0.02, high: 0.03 }).slice(1)}, 0.2)`,
                    color: getRiskColor(scenario.riskScore, { low: 0.01, medium: 0.02, high: 0.03 }),
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Risk: {formatPercentage(scenario.riskScore)}
                  </div>
                </div>
                
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1rem' }}>
                  {scenario.description}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Probability: </span>
                    <span style={{ color: 'white', fontWeight: '600' }}>{formatPercentage(scenario.probability)}</span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Impact: </span>
                    <span style={{ color: 'white', fontWeight: '600' }}>{formatPercentage(scenario.impact)}</span>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                    Mitigation Strategies:
                  </h4>
                  <ul style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1rem' }}>
                    {scenario.mitigation.map((strategy, i) => (
                      <li key={i} style={{ marginBottom: '0.25rem' }}>{strategy}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                    Monitoring:
                  </h4>
                  <ul style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1rem' }}>
                    {scenario.monitoring.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stress Tests */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '1.5rem' }}>
            🧪 Stress Tests
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stressTests.map((test, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: 0 }}>
                      {test.scenario}
                    </h3>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      background: `rgba(${getSeverityColor(test.severity).slice(1)}, 0.2)`,
                      color: getSeverityColor(test.severity),
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {test.severity.toUpperCase()}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                    {test.description}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                      Portfolio Impact
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      color: '#ef4444',
                      marginBottom: '0.25rem'
                    }}>
                      {formatPercentage(test.portfolioImpact)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                      VaR Impact
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      color: '#f59e0b',
                      marginBottom: '0.25rem'
                    }}>
                      {formatPercentage(test.varImpact)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.25rem' }}>
                      Liquidity Impact
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 'bold', 
                      color: '#8b5cf6',
                      marginBottom: '0.25rem'
                    }}>
                      {formatPercentage(test.liquidityImpact)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default RiskManagement;
