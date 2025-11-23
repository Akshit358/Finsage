import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface BacktestResult {
  strategy: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalValue: number;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  calmarRatio: number;
  sortinoRatio: number;
  trades: number;
  avgTradeReturn: number;
  bestTrade: number;
  worstTrade: number;
  monthlyReturns: number[];
  equityCurve: { date: string; value: number }[];
  drawdownCurve: { date: string; drawdown: number }[];
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters: { [key: string]: any };
  riskLevel: 'low' | 'medium' | 'high';
}

const BacktestingEngine: React.FC = () => {
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('momentum');
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [initialCapital, setInitialCapital] = useState(100000);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<BacktestResult | null>(null);

  const strategies: Strategy[] = [
    {
      id: 'momentum',
      name: 'Momentum Strategy',
      description: 'Buy stocks with strong price momentum, sell when momentum weakens',
      parameters: {
        lookbackPeriod: 20,
        threshold: 0.02,
        rebalanceFrequency: 'monthly'
      },
      riskLevel: 'medium'
    },
    {
      id: 'mean_reversion',
      name: 'Mean Reversion Strategy',
      description: 'Buy oversold stocks, sell overbought stocks based on RSI',
      parameters: {
        rsiPeriod: 14,
        oversoldThreshold: 30,
        overboughtThreshold: 70
      },
      riskLevel: 'high'
    },
    {
      id: 'value',
      name: 'Value Strategy',
      description: 'Buy undervalued stocks based on P/E and P/B ratios',
      parameters: {
        peThreshold: 15,
        pbThreshold: 1.5,
        minMarketCap: 1000000000
      },
      riskLevel: 'low'
    },
    {
      id: 'growth',
      name: 'Growth Strategy',
      description: 'Focus on high-growth companies with strong earnings growth',
      parameters: {
        minEarningsGrowth: 0.15,
        minRevenueGrowth: 0.10,
        maxPe: 30
      },
      riskLevel: 'high'
    },
    {
      id: 'dividend',
      name: 'Dividend Strategy',
      description: 'Invest in high-dividend yield stocks with consistent payouts',
      parameters: {
        minDividendYield: 0.03,
        minPayoutRatio: 0.2,
        maxPayoutRatio: 0.8
      },
      riskLevel: 'low'
    },
    {
      id: 'sector_rotation',
      name: 'Sector Rotation Strategy',
      description: 'Rotate between sectors based on economic cycles',
      parameters: {
        cycleLength: 12,
        rebalanceFrequency: 'quarterly',
        maxSectorWeight: 0.3
      },
      riskLevel: 'medium'
    }
  ];

  // Generate mock backtest results
  const generateBacktestResult = (strategy: Strategy): BacktestResult => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
    
    // Generate random but realistic performance metrics
    const totalReturn = (Math.random() - 0.3) * 2; // -60% to +140%
    const annualizedReturn = Math.pow(1 + totalReturn, 12 / months) - 1;
    const volatility = 0.1 + Math.random() * 0.3; // 10% to 40%
    const sharpeRatio = annualizedReturn / volatility;
    const maxDrawdown = Math.min(0.8, Math.random() * 0.6); // 0% to 60%
    const winRate = 0.4 + Math.random() * 0.4; // 40% to 80%
    const profitFactor = 0.5 + Math.random() * 1.5; // 0.5 to 2.0
    const calmarRatio = annualizedReturn / maxDrawdown;
    const sortinoRatio = annualizedReturn / (volatility * 0.7); // Assuming downside deviation is 70% of total volatility
    const trades = Math.floor(months * (0.5 + Math.random() * 1.5)); // 0.5 to 2 trades per month
    const avgTradeReturn = totalReturn / trades;
    const bestTrade = Math.random() * 0.3; // 0% to 30%
    const worstTrade = -Math.random() * 0.2; // 0% to -20%

    // Generate equity curve
    const equityCurve = [];
    const drawdownCurve = [];
    let currentValue = initialCapital;
    let peakValue = initialCapital;
    let maxDrawdownValue = 0;

    for (let i = 0; i <= months; i++) {
      const date = new Date(start);
      date.setMonth(date.getMonth() + i);
      
      // Add some random walk to the equity curve
      const monthlyReturn = (Math.random() - 0.5) * 0.1; // -5% to +5% monthly
      currentValue *= (1 + monthlyReturn);
      
      if (currentValue > peakValue) {
        peakValue = currentValue;
      }
      
      const drawdown = (peakValue - currentValue) / peakValue;
      if (drawdown > maxDrawdownValue) {
        maxDrawdownValue = drawdown;
      }
      
      equityCurve.push({
        date: date.toISOString().split('T')[0],
        value: currentValue
      });
      
      drawdownCurve.push({
        date: date.toISOString().split('T')[0],
        drawdown: drawdown
      });
    }

    // Generate monthly returns
    const monthlyReturns = [];
    for (let i = 1; i < equityCurve.length; i++) {
      const monthlyReturn = (equityCurve[i].value - equityCurve[i-1].value) / equityCurve[i-1].value;
      monthlyReturns.push(monthlyReturn);
    }

    return {
      strategy: strategy.name,
      startDate,
      endDate,
      initialCapital,
      finalValue: currentValue,
      totalReturn,
      annualizedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown: maxDrawdownValue,
      winRate,
      profitFactor,
      calmarRatio,
      sortinoRatio,
      trades,
      avgTradeReturn,
      bestTrade,
      worstTrade,
      monthlyReturns,
      equityCurve,
      drawdownCurve
    };
  };

  // Run backtest
  const runBacktest = async () => {
    setIsRunning(true);
    
    const strategy = strategies.find(s => s.id === selectedStrategy);
    if (!strategy) return;

    // Simulate backtest calculation time
    setTimeout(() => {
      const result = generateBacktestResult(strategy);
      setBacktestResults(prev => [result, ...prev]);
      setSelectedResult(result);
      setIsRunning(false);
    }, 3000);
  };

  // Run comparison backtest
  const runComparison = async () => {
    setIsRunning(true);
    
    // Simulate running all strategies
    setTimeout(() => {
      const results = strategies.map(strategy => generateBacktestResult(strategy));
      setBacktestResults(results);
      setIsRunning(false);
    }, 5000);
  };

  const getPerformanceColor = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value > 0 ? '#10b981' : '#ef4444';
    } else {
      return value < 0.1 ? '#10b981' : value < 0.2 ? '#f59e0b' : '#ef4444';
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(2)}%`;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
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
        background: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
        animation: 'pulse 10s ease-in-out infinite'
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
          🔬 Backtesting Engine
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Test and compare trading strategies with historical data
        </p>
      </div>

      {/* Strategy Selection */}
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
            ⚙️ Strategy Configuration
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Strategy
              </label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  width: '100%'
                }}
              >
                {strategies.map(strategy => (
                  <option key={strategy.id} value={strategy.id} style={{ background: '#1f2937', color: 'white' }}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Initial Capital ($)
              </label>
              <Input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              onClick={runBacktest}
              disabled={isRunning}
              style={{
                padding: '1rem 2rem',
                borderRadius: '1.5rem',
                background: isRunning ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isRunning ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
            >
              {isRunning ? '🔄 Running...' : '🚀 Run Backtest'}
            </Button>
            <Button
              onClick={runComparison}
              disabled={isRunning}
              style={{
                padding: '1rem 2rem',
                borderRadius: '1.5rem',
                background: isRunning ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isRunning ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              {isRunning ? '🔄 Running...' : '📊 Compare All Strategies'}
            </Button>
          </div>
        </div>
      </div>

      {/* Backtest Results */}
      {backtestResults.length > 0 && (
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
              📈 Backtest Results
            </h2>
            
            {backtestResults.length === 1 ? (
              // Single result detailed view
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                      {formatCurrency(backtestResults[0].finalValue)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Final Value</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: getPerformanceColor(backtestResults[0].totalReturn),
                      marginBottom: '0.25rem'
                    }}>
                      {formatPercentage(backtestResults[0].totalReturn)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Total Return</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: getPerformanceColor(backtestResults[0].annualizedReturn),
                      marginBottom: '0.25rem'
                    }}>
                      {formatPercentage(backtestResults[0].annualizedReturn)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Annualized Return</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: getPerformanceColor(backtestResults[0].sharpeRatio, false),
                      marginBottom: '0.25rem'
                    }}>
                      {backtestResults[0].sharpeRatio.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Sharpe Ratio</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📉</div>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: getPerformanceColor(-backtestResults[0].maxDrawdown),
                      marginBottom: '0.25rem'
                    }}>
                      {formatPercentage(backtestResults[0].maxDrawdown)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Max Drawdown</div>
                  </div>
                </div>
              </div>
            ) : (
              // Multiple results comparison
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {backtestResults.map((result, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedResult(result)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0 }}>
                        {result.strategy}
                      </h3>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        background: `rgba(${getPerformanceColor(result.totalReturn).slice(1)}, 0.2)`,
                        color: getPerformanceColor(result.totalReturn),
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {formatPercentage(result.totalReturn)}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Final Value</div>
                        <div style={{ color: 'white', fontWeight: '600' }}>{formatCurrency(result.finalValue)}</div>
                      </div>
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Annualized Return</div>
                        <div style={{ color: getPerformanceColor(result.annualizedReturn), fontWeight: '600' }}>
                          {formatPercentage(result.annualizedReturn)}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Sharpe Ratio</div>
                        <div style={{ color: getPerformanceColor(result.sharpeRatio, false), fontWeight: '600' }}>
                          {result.sharpeRatio.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Max Drawdown</div>
                        <div style={{ color: getPerformanceColor(-result.maxDrawdown), fontWeight: '600' }}>
                          {formatPercentage(result.maxDrawdown)}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Win Rate</div>
                        <div style={{ color: 'white', fontWeight: '600' }}>{formatPercentage(result.winRate)}</div>
                      </div>
                      <div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Trades</div>
                        <div style={{ color: 'white', fontWeight: '600' }}>{result.trades}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

export default BacktestingEngine;
