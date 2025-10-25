import React, { useState, useEffect } from 'react';

interface PortfolioOptimizerProps {
  currentPortfolio: any[];
  onOptimize: (optimizedPortfolio: any[]) => void;
}

const PortfolioOptimizer: React.FC<PortfolioOptimizerProps> = ({ currentPortfolio, onOptimize }) => {
  const [optimizationSettings, setOptimizationSettings] = useState({
    riskTolerance: 'moderate',
    timeHorizon: '5-10',
    rebalancingFrequency: 'quarterly',
    maxWeight: 20,
    minWeight: 1,
    includeESG: false,
    taxOptimization: true
  });

  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const riskTolerances = [
    { value: 'conservative', label: 'Conservative', description: 'Lower risk, stable returns' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced risk and return' },
    { value: 'aggressive', label: 'Aggressive', description: 'Higher risk, potential for higher returns' }
  ];

  const timeHorizons = [
    { value: '1-3', label: '1-3 Years', description: 'Short-term goals' },
    { value: '3-5', label: '3-5 Years', description: 'Medium-term goals' },
    { value: '5-10', label: '5-10 Years', description: 'Long-term growth' },
    { value: '10+', label: '10+ Years', description: 'Retirement planning' }
  ];

  const rebalancingFrequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semi-annually', label: 'Semi-Annually' },
    { value: 'annually', label: 'Annually' },
    { value: 'threshold', label: 'Threshold-based' }
  ];

  const optimizePortfolio = () => {
    setLoading(true);
    
    // Simulate portfolio optimization
    setTimeout(() => {
      const optimized = currentPortfolio.map(asset => {
        const baseWeight = asset.allocation || 0;
        const riskMultiplier = optimizationSettings.riskTolerance === 'aggressive' ? 1.2 : 
                              optimizationSettings.riskTolerance === 'conservative' ? 0.8 : 1.0;
        
        const optimizedWeight = Math.max(
          optimizationSettings.minWeight,
          Math.min(optimizationSettings.maxWeight, baseWeight * riskMultiplier + (Math.random() - 0.5) * 5)
        );
        
        return {
          ...asset,
          currentWeight: baseWeight,
          optimizedWeight: optimizedWeight,
          weightChange: optimizedWeight - baseWeight,
          expectedReturn: 8 + Math.random() * 8,
          riskScore: 3 + Math.random() * 4,
          sharpeRatio: 0.5 + Math.random() * 1.0
        };
      });

      const totalOptimizedWeight = optimized.reduce((sum, asset) => sum + asset.optimizedWeight, 0);
      
      // Normalize weights to 100%
      const normalizedOptimized = optimized.map(asset => ({
        ...asset,
        optimizedWeight: (asset.optimizedWeight / totalOptimizedWeight) * 100
      }));

      setOptimizationResults({
        optimizedPortfolio: normalizedOptimized,
        metrics: {
          expectedReturn: 8.5 + Math.random() * 4,
          expectedVolatility: 12 + Math.random() * 6,
          sharpeRatio: 0.7 + Math.random() * 0.5,
          maxDrawdown: -8 + Math.random() * -4,
          diversificationRatio: 0.6 + Math.random() * 0.3,
          concentrationRisk: 15 + Math.random() * 10
        },
        rebalancing: {
          frequency: optimizationSettings.rebalancingFrequency,
          nextRebalance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          estimatedCost: Math.random() * 50 + 10,
          taxImpact: Math.random() * 200 + 50
        },
        recommendations: [
          'Consider increasing international exposure for better diversification',
          'Reduce concentration in technology sector',
          'Add bond allocation for risk management',
          'Consider ESG funds for sustainable investing'
        ]
      });
      
      setLoading(false);
    }, 2000);
  };

  const applyOptimization = () => {
    if (optimizationResults) {
      onOptimize(optimizationResults.optimizedPortfolio);
    }
  };

  const handleSettingChange = (field: string, value: any) => {
    setOptimizationSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
        Portfolio Optimization
      </h2>

      {/* Optimization Settings */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Optimization Parameters
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Risk Tolerance
            </label>
            <select
              value={optimizationSettings.riskTolerance}
              onChange={(e) => handleSettingChange('riskTolerance', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            >
              {riskTolerances.map((risk) => (
                <option key={risk.value} value={risk.value}>
                  {risk.label} - {risk.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Time Horizon
            </label>
            <select
              value={optimizationSettings.timeHorizon}
              onChange={(e) => handleSettingChange('timeHorizon', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            >
              {timeHorizons.map((horizon) => (
                <option key={horizon.value} value={horizon.value}>
                  {horizon.label} - {horizon.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Rebalancing Frequency
            </label>
            <select
              value={optimizationSettings.rebalancingFrequency}
              onChange={(e) => handleSettingChange('rebalancingFrequency', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            >
              {rebalancingFrequencies.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Settings */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            {showAdvanced ? '▼' : '▶'} Advanced Settings
          </button>

          {showAdvanced && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Max Weight per Asset (%)
                </label>
                <input
                  type="number"
                  value={optimizationSettings.maxWeight}
                  onChange={(e) => handleSettingChange('maxWeight', parseInt(e.target.value))}
                  min="1"
                  max="50"
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
                  Min Weight per Asset (%)
                </label>
                <input
                  type="number"
                  value={optimizationSettings.minWeight}
                  onChange={(e) => handleSettingChange('minWeight', parseInt(e.target.value))}
                  min="0"
                  max="10"
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
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={optimizationSettings.includeESG}
                onChange={(e) => handleSettingChange('includeESG', e.target.checked)}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Include ESG (Environmental, Social, Governance) criteria
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={optimizationSettings.taxOptimization}
                onChange={(e) => handleSettingChange('taxOptimization', e.target.checked)}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Optimize for tax efficiency
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={optimizePortfolio}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {loading && (
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          )}
          {loading ? 'Optimizing...' : '🚀 Optimize Portfolio'}
        </button>
      </div>

      {/* Optimization Results */}
      {optimizationResults && (
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Optimization Results
          </h3>

          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                {optimizationResults.metrics.expectedReturn.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Return</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {optimizationResults.metrics.expectedVolatility.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Volatility</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                {optimizationResults.metrics.sharpeRatio.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sharpe Ratio</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                {optimizationResults.metrics.maxDrawdown.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Max Drawdown</div>
            </div>
          </div>

          {/* Portfolio Comparison */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Portfolio Allocation Changes
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Asset</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Current</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Optimized</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Change</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {optimizationResults.optimizedPortfolio.map((asset: any, index: number) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '500', color: '#111827' }}>{asset.symbol}</td>
                      <td style={{ padding: '0.75rem' }}>{asset.currentWeight.toFixed(1)}%</td>
                      <td style={{ padding: '0.75rem', fontWeight: '500' }}>{asset.optimizedWeight.toFixed(1)}%</td>
                      <td style={{ 
                        padding: '0.75rem', 
                        fontWeight: '500',
                        color: asset.weightChange > 0 ? '#059669' : asset.weightChange < 0 ? '#ef4444' : '#6b7280'
                      }}>
                        {asset.weightChange > 0 ? '+' : ''}{asset.weightChange.toFixed(1)}%
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: asset.weightChange > 0 ? '#dcfce7' : asset.weightChange < 0 ? '#fef2f2' : '#f3f4f6',
                          color: asset.weightChange > 0 ? '#166534' : asset.weightChange < 0 ? '#991b1b' : '#6b7280'
                        }}>
                          {asset.weightChange > 0 ? 'Increase' : asset.weightChange < 0 ? 'Decrease' : 'Hold'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rebalancing Info */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Rebalancing Schedule
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Frequency</div>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
                  {optimizationResults.rebalancing.frequency}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Next Rebalance</div>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
                  {optimizationResults.rebalancing.nextRebalance.toLocaleDateString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Estimated Cost</div>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
                  ${optimizationResults.rebalancing.estimatedCost.toFixed(2)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tax Impact</div>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: '#111827' }}>
                  ${optimizationResults.rebalancing.taxImpact.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Recommendations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {optimizationResults.recommendations.map((rec: string, index: number) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: '#eff6ff',
                  borderRadius: '0.5rem',
                  border: '1px solid #bfdbfe'
                }}>
                  <span style={{ fontSize: '0.875rem', marginTop: '0.125rem' }}>💡</span>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={applyOptimization}
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
              ✅ Apply Optimization
            </button>
            <button
              onClick={() => setOptimizationResults(null)}
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
              🔄 Re-optimize
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioOptimizer;
