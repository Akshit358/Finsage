import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { LoadingSpinner } from './ui/Skeleton';

interface Asset {
  symbol: string;
  name: string;
  currentPrice: number;
  allocation: number;
  expectedReturn: number;
  volatility: number;
  beta: number;
  sector: string;
  marketCap: number;
}

interface OptimizationResult {
  originalPortfolio: Asset[];
  optimizedPortfolio: Asset[];
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    var95: number;
    diversificationRatio: number;
  };
  recommendations: {
    action: 'buy' | 'sell' | 'hold';
    symbol: string;
    currentAllocation: number;
    recommendedAllocation: number;
    reasoning: string;
    confidence: number;
  }[];
  riskAnalysis: {
    level: 'low' | 'medium' | 'high';
    concentrationRisk: number;
    sectorRisk: number;
    liquidityRisk: number;
    marketRisk: number;
  };
}

interface OptimizationConstraints {
  maxWeight: number;
  minWeight: number;
  maxSectorWeight: number;
  maxSingleStockWeight: number;
  targetReturn?: number;
  maxVolatility?: number;
  rebalanceThreshold: number;
}

const AIPortfolioOptimizer: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [constraints] = useState<OptimizationConstraints>({
    maxWeight: 0.15,
    minWeight: 0.01,
    maxSectorWeight: 0.30,
    maxSingleStockWeight: 0.10,
    rebalanceThreshold: 0.05
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<'max_sharpe' | 'min_volatility' | 'target_return' | 'equal_weight'>('max_sharpe');
  const [targetReturn, setTargetReturn] = useState(0.12);
  const [maxVolatility] = useState(0.20);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const strategies = [
    { id: 'max_sharpe', name: 'Maximize Sharpe Ratio', description: 'Optimal risk-adjusted returns' },
    { id: 'min_volatility', name: 'Minimize Volatility', description: 'Lowest risk portfolio' },
    { id: 'target_return', name: 'Target Return', description: 'Achieve specific return target' },
    { id: 'equal_weight', name: 'Equal Weight', description: 'Equal allocation across assets' }
  ];

  useEffect(() => {
    loadInitialPortfolio();
  }, []);

  useEffect(() => {
    if (optimizationResult) {
      drawOptimizationChart();
    }
  }, [optimizationResult]);

  const loadInitialPortfolio = () => {
    const mockAssets: Asset[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        currentPrice: 175.00,
        allocation: 0.25,
        expectedReturn: 0.15,
        volatility: 0.25,
        beta: 1.2,
        sector: 'Technology',
        marketCap: 2800000000000
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        currentPrice: 140.00,
        allocation: 0.20,
        expectedReturn: 0.18,
        volatility: 0.30,
        beta: 1.1,
        sector: 'Technology',
        marketCap: 1800000000000
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        currentPrice: 350.00,
        allocation: 0.15,
        expectedReturn: 0.16,
        volatility: 0.22,
        beta: 0.9,
        sector: 'Technology',
        marketCap: 2600000000000
      },
      {
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        currentPrice: 155.00,
        allocation: 0.10,
        expectedReturn: 0.08,
        volatility: 0.15,
        beta: 0.6,
        sector: 'Healthcare',
        marketCap: 420000000000
      },
      {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        currentPrice: 180.00,
        allocation: 0.10,
        expectedReturn: 0.12,
        volatility: 0.28,
        beta: 1.3,
        sector: 'Financials',
        marketCap: 520000000000
      },
      {
        symbol: 'PG',
        name: 'Procter & Gamble',
        currentPrice: 145.00,
        allocation: 0.08,
        expectedReturn: 0.06,
        volatility: 0.12,
        beta: 0.4,
        sector: 'Consumer Staples',
        marketCap: 350000000000
      },
      {
        symbol: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        currentPrice: 250.00,
        allocation: 0.12,
        expectedReturn: 0.10,
        volatility: 0.18,
        beta: 1.0,
        sector: 'Diversified',
        marketCap: 300000000000
      }
    ];
    setAssets(mockAssets);
  };

  const optimizePortfolio = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization process
    setTimeout(() => {
      const optimizedAssets = assets.map(asset => {
        // AI optimization logic (simplified)
        let newAllocation = asset.allocation;
        
        switch (selectedStrategy) {
          case 'max_sharpe':
            // Optimize for Sharpe ratio
            if (asset.symbol === 'AAPL') newAllocation = 0.30;
            else if (asset.symbol === 'GOOGL') newAllocation = 0.25;
            else if (asset.symbol === 'MSFT') newAllocation = 0.20;
            else if (asset.symbol === 'JNJ') newAllocation = 0.08;
            else if (asset.symbol === 'JPM') newAllocation = 0.07;
            else if (asset.symbol === 'PG') newAllocation = 0.05;
            else if (asset.symbol === 'VTI') newAllocation = 0.05;
            break;
          case 'min_volatility':
            // Minimize volatility
            if (asset.symbol === 'PG') newAllocation = 0.25;
            else if (asset.symbol === 'JNJ') newAllocation = 0.20;
            else if (asset.symbol === 'VTI') newAllocation = 0.20;
            else if (asset.symbol === 'MSFT') newAllocation = 0.15;
            else if (asset.symbol === 'AAPL') newAllocation = 0.10;
            else if (asset.symbol === 'GOOGL') newAllocation = 0.05;
            else if (asset.symbol === 'JPM') newAllocation = 0.05;
            break;
          case 'target_return':
            // Target return optimization
            if (asset.symbol === 'GOOGL') newAllocation = 0.35;
            else if (asset.symbol === 'AAPL') newAllocation = 0.25;
            else if (asset.symbol === 'MSFT') newAllocation = 0.20;
            else if (asset.symbol === 'JPM') newAllocation = 0.10;
            else if (asset.symbol === 'JNJ') newAllocation = 0.05;
            else if (asset.symbol === 'PG') newAllocation = 0.03;
            else if (asset.symbol === 'VTI') newAllocation = 0.02;
            break;
          case 'equal_weight':
            // Equal weight
            newAllocation = 1 / assets.length;
            break;
        }
        
        return { ...asset, allocation: newAllocation };
      });

      // Calculate portfolio metrics
      const expectedReturn = optimizedAssets.reduce((sum, asset) => 
        sum + (asset.allocation * asset.expectedReturn), 0
      );
      
      const portfolioVariance = optimizedAssets.reduce((sum, asset) => 
        sum + (asset.allocation * asset.allocation * asset.volatility * asset.volatility), 0
      );
      
      const volatility = Math.sqrt(portfolioVariance);
      const sharpeRatio = expectedReturn / volatility;
      
      // Generate recommendations
      const recommendations = assets.map(asset => {
        const optimizedAsset = optimizedAssets.find(a => a.symbol === asset.symbol);
        const allocationChange = (optimizedAsset?.allocation || 0) - asset.allocation;
        
        let action: 'buy' | 'sell' | 'hold' = 'hold';
        if (allocationChange > 0.02) action = 'buy';
        else if (allocationChange < -0.02) action = 'sell';
        
        return {
          action,
          symbol: asset.symbol,
          currentAllocation: asset.allocation,
          recommendedAllocation: optimizedAsset?.allocation || 0,
          reasoning: generateReasoning(asset, optimizedAsset, action),
          confidence: 0.75 + Math.random() * 0.2
        };
      });

      const result: OptimizationResult = {
        originalPortfolio: assets,
        optimizedPortfolio: optimizedAssets,
        metrics: {
          expectedReturn,
          volatility,
          sharpeRatio,
          maxDrawdown: volatility * 1.5,
          var95: volatility * 1.65,
          diversificationRatio: 1.2 + Math.random() * 0.3
        },
        recommendations,
        riskAnalysis: {
          level: volatility > 0.25 ? 'high' : volatility > 0.15 ? 'medium' : 'low',
          concentrationRisk: Math.max(...optimizedAssets.map(a => a.allocation)),
          sectorRisk: calculateSectorRisk(optimizedAssets),
          liquidityRisk: 0.1 + Math.random() * 0.2,
          marketRisk: 0.6 + Math.random() * 0.3
        }
      };

      setOptimizationResult(result);
      setIsOptimizing(false);
    }, 3000);
  };

  const generateReasoning = (_original: Asset, optimized: Asset | undefined, action: string): string => {
    if (!optimized) return 'No change recommended';
    
    // const change = optimized.allocation - original.allocation;
    
    if (action === 'buy') {
      return `Increase allocation due to strong fundamentals and positive momentum. Expected return of ${(optimized.expectedReturn * 100).toFixed(1)}% with moderate risk.`;
    } else if (action === 'sell') {
      return `Reduce allocation to improve diversification and risk management. Current position is overweight relative to optimal allocation.`;
    } else {
      return `Maintain current allocation as it aligns with optimization goals and risk tolerance.`;
    }
  };

  const calculateSectorRisk = (assets: Asset[]): number => {
    const sectorWeights: { [key: string]: number } = {};
    assets.forEach(asset => {
      sectorWeights[asset.sector] = (sectorWeights[asset.sector] || 0) + asset.allocation;
    });
    return Math.max(...Object.values(sectorWeights));
  };

  const drawOptimizationChart = () => {
    const canvas = canvasRef.current;
    if (!canvas || !optimizationResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    const padding = 60;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pie chart for optimized portfolio
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(chartWidth, chartHeight) / 2 - 20;

    let currentAngle = 0;
    const colors = ['#2563eb', '#059669', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

    optimizationResult.optimizedPortfolio.forEach((asset, index) => {
      const sliceAngle = asset.allocation * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
      const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
      
      ctx.fillStyle = '#111827';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(asset.symbol, labelX, labelY);
      ctx.fillText(`${(asset.allocation * 100).toFixed(1)}%`, labelX, labelY + 15);
      
      currentAngle += sliceAngle;
    });

    // Draw title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Optimized Portfolio Allocation', centerX, 30);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#059669';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return '#059669';
      case 'sell': return '#ef4444';
      case 'hold': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          🤖 AI Portfolio Optimizer
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Advanced AI-powered portfolio optimization using machine learning algorithms
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Strategy Selection */}
        <Card style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Optimization Strategy
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id as any)}
                style={{
                  padding: '1rem',
                  border: '1px solid',
                  borderColor: selectedStrategy === strategy.id ? '#2563eb' : '#e5e7eb',
                  borderRadius: '0.5rem',
                  backgroundColor: selectedStrategy === strategy.id ? '#eff6ff' : 'white',
                  cursor: 'pointer'
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                  {strategy.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  {strategy.description}
                </p>
              </div>
            ))}
          </div>

          {selectedStrategy === 'target_return' && (
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Target Return (%)
              </label>
              <Input
                type="number"
                value={targetReturn * 100}
                onChange={(e) => setTargetReturn(parseFloat(e.target.value) / 100)}
                step="0.1"
                min="0"
                max="50"
              />
            </div>
          )}

          <Button 
            onClick={optimizePortfolio} 
            disabled={isOptimizing}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isOptimizing ? <LoadingSpinner size="sm" /> : '🚀 Optimize Portfolio'}
          </Button>
        </Card>

        {/* Current Portfolio */}
        <Card style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Current Portfolio
          </h2>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {assets.map((asset) => (
              <div key={asset.symbol} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
                backgroundColor: '#f8fafc'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                    {asset.symbol}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {asset.name}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                    {(asset.allocation * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    ${asset.currentPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Optimization Results */}
      {optimizationResult && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Portfolio Comparison */}
          <Card style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Optimization Results
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                  Portfolio Metrics
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Expected Return</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {(optimizationResult.metrics.expectedReturn * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Volatility</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {(optimizationResult.metrics.volatility * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sharpe Ratio</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {optimizationResult.metrics.sharpeRatio.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Max Drawdown</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {(optimizationResult.metrics.maxDrawdown * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                  Risk Analysis
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Risk Level</span>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: getRiskColor(optimizationResult.riskAnalysis.level)
                    }}>
                      {optimizationResult.riskAnalysis.level.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Concentration Risk</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {(optimizationResult.riskAnalysis.concentrationRisk * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sector Risk</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {(optimizationResult.riskAnalysis.sectorRisk * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Market Risk</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                      {(optimizationResult.riskAnalysis.marketRisk * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Portfolio Visualization */}
          <Card style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Optimized Portfolio Allocation
            </h2>
            <canvas ref={canvasRef} style={{ width: '100%', height: '400px', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
          </Card>

          {/* Recommendations */}
          <Card style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              AI Recommendations
            </h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {optimizationResult.recommendations.map((rec, index) => (
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
                    backgroundColor: getActionColor(rec.action),
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {rec.action.toUpperCase()}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                        {rec.symbol}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {(rec.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, lineHeight: '1.4' }}>
                      {rec.reasoning}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      Current: {(rec.currentAllocation * 100).toFixed(1)}% → Recommended: {(rec.recommendedAllocation * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIPortfolioOptimizer;
