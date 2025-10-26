import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface OptionContract {
  id: string;
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiration: string;
  premium: number;
  quantity: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  impliedVolatility: number;
  intrinsicValue: number;
  timeValue: number;
  openInterest: number;
  volume: number;
  bid: number;
  ask: number;
  lastPrice: number;
}

interface OptionStrategy {
  id: string;
  name: string;
  description: string;
  contracts: OptionContract[];
  maxProfit: number;
  maxLoss: number;
  breakeven: number[];
  riskLevel: 'low' | 'medium' | 'high';
  capitalRequired: number;
  profitProbability: number;
}

interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

const OptionsTrading: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [currentPrice, setCurrentPrice] = useState(175.00);
  const [optionContracts, setOptionContracts] = useState<OptionContract[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('long_call');
  const [portfolio, setPortfolio] = useState<OptionContract[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioGreeks, setPortfolioGreeks] = useState<Greeks>({
    delta: 0,
    gamma: 0,
    theta: 0,
    vega: 0,
    rho: 0
  });

  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'NFLX', 'SPY', 'QQQ'];

  const strategies = [
    {
      id: 'long_call',
      name: 'Long Call',
      description: 'Buy a call option to profit from upward price movement',
      riskLevel: 'medium' as const,
      maxLoss: 'Premium paid',
      maxProfit: 'Unlimited'
    },
    {
      id: 'long_put',
      name: 'Long Put',
      description: 'Buy a put option to profit from downward price movement',
      riskLevel: 'medium' as const,
      maxLoss: 'Premium paid',
      maxProfit: 'Strike price - premium'
    },
    {
      id: 'covered_call',
      name: 'Covered Call',
      description: 'Sell a call option against owned stock',
      riskLevel: 'low' as const,
      maxLoss: 'Stock price - strike + premium',
      maxProfit: 'Premium received'
    },
    {
      id: 'protective_put',
      name: 'Protective Put',
      description: 'Buy a put option to protect stock position',
      riskLevel: 'low' as const,
      maxLoss: 'Stock price - strike + premium',
      maxProfit: 'Unlimited'
    },
    {
      id: 'straddle',
      name: 'Straddle',
      description: 'Buy both call and put at same strike',
      riskLevel: 'high' as const,
      maxLoss: 'Total premium paid',
      maxProfit: 'Unlimited'
    },
    {
      id: 'strangle',
      name: 'Strangle',
      description: 'Buy call and put at different strikes',
      riskLevel: 'high' as const,
      maxLoss: 'Total premium paid',
      maxProfit: 'Unlimited'
    },
    {
      id: 'iron_condor',
      name: 'Iron Condor',
      description: 'Sell call spread and put spread',
      riskLevel: 'medium' as const,
      maxLoss: 'Difference between strikes - net credit',
      maxProfit: 'Net credit received'
    },
    {
      id: 'butterfly',
      name: 'Butterfly',
      description: 'Buy call spread and sell call spread',
      riskLevel: 'medium' as const,
      maxLoss: 'Net premium paid',
      maxProfit: 'Difference between strikes - net premium'
    }
  ];

  // Generate mock option contracts
  const generateOptionContracts = (symbol: string, currentPrice: number): OptionContract[] => {
    const contracts: OptionContract[] = [];
    const strikes = [
      currentPrice * 0.9,
      currentPrice * 0.95,
      currentPrice,
      currentPrice * 1.05,
      currentPrice * 1.1
    ];
    
    const expirations = [
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 month
      new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 months
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]  // 3 months
    ];

    strikes.forEach(strike => {
      expirations.forEach(expiration => {
        // Call options
        const callPremium = Math.max(0.01, (currentPrice - strike) * 0.1 + Math.random() * 5);
        const callDelta = Math.max(0, Math.min(1, (currentPrice - strike) / currentPrice + Math.random() * 0.2));
        const callGamma = Math.random() * 0.01;
        const callTheta = -Math.random() * 0.5;
        const callVega = Math.random() * 0.1;
        const callRho = Math.random() * 0.01;
        const callIV = 0.2 + Math.random() * 0.3;
        const callIntrinsic = Math.max(0, currentPrice - strike);
        const callTimeValue = callPremium - callIntrinsic;

        contracts.push({
          id: `${symbol}_C_${strike}_${expiration}`,
          symbol,
          type: 'call',
          strike: Math.round(strike * 100) / 100,
          expiration,
          premium: Math.round(callPremium * 100) / 100,
          quantity: 0,
          delta: Math.round(callDelta * 100) / 100,
          gamma: Math.round(callGamma * 100) / 100,
          theta: Math.round(callTheta * 100) / 100,
          vega: Math.round(callVega * 100) / 100,
          rho: Math.round(callRho * 100) / 100,
          impliedVolatility: Math.round(callIV * 100) / 100,
          intrinsicValue: Math.round(callIntrinsic * 100) / 100,
          timeValue: Math.round(callTimeValue * 100) / 100,
          openInterest: Math.floor(Math.random() * 10000),
          volume: Math.floor(Math.random() * 5000),
          bid: Math.round((callPremium - 0.1) * 100) / 100,
          ask: Math.round((callPremium + 0.1) * 100) / 100,
          lastPrice: Math.round(callPremium * 100) / 100
        });

        // Put options
        const putPremium = Math.max(0.01, (strike - currentPrice) * 0.1 + Math.random() * 5);
        const putDelta = Math.max(-1, Math.min(0, (currentPrice - strike) / currentPrice - Math.random() * 0.2));
        const putGamma = Math.random() * 0.01;
        const putTheta = -Math.random() * 0.5;
        const putVega = Math.random() * 0.1;
        const putRho = -Math.random() * 0.01;
        const putIV = 0.2 + Math.random() * 0.3;
        const putIntrinsic = Math.max(0, strike - currentPrice);
        const putTimeValue = putPremium - putIntrinsic;

        contracts.push({
          id: `${symbol}_P_${strike}_${expiration}`,
          symbol,
          type: 'put',
          strike: Math.round(strike * 100) / 100,
          expiration,
          premium: Math.round(putPremium * 100) / 100,
          quantity: 0,
          delta: Math.round(putDelta * 100) / 100,
          gamma: Math.round(putGamma * 100) / 100,
          theta: Math.round(putTheta * 100) / 100,
          vega: Math.round(putVega * 100) / 100,
          rho: Math.round(putRho * 100) / 100,
          impliedVolatility: Math.round(putIV * 100) / 100,
          intrinsicValue: Math.round(putIntrinsic * 100) / 100,
          timeValue: Math.round(putTimeValue * 100) / 100,
          openInterest: Math.floor(Math.random() * 10000),
          volume: Math.floor(Math.random() * 5000),
          bid: Math.round((putPremium - 0.1) * 100) / 100,
          ask: Math.round((putPremium + 0.1) * 100) / 100,
          lastPrice: Math.round(putPremium * 100) / 100
        });
      });
    });

    return contracts;
  };

  // Update option contracts when symbol or price changes
  useEffect(() => {
    const contracts = generateOptionContracts(selectedSymbol, currentPrice);
    setOptionContracts(contracts);
  }, [selectedSymbol, currentPrice]);

  // Calculate portfolio value and Greeks
  useEffect(() => {
    let totalValue = 0;
    let totalDelta = 0;
    let totalGamma = 0;
    let totalTheta = 0;
    let totalVega = 0;
    let totalRho = 0;

    portfolio.forEach(contract => {
      const contractValue = contract.premium * contract.quantity * 100; // Options are per 100 shares
      totalValue += contractValue;
      totalDelta += contract.delta * contract.quantity * 100;
      totalGamma += contract.gamma * contract.quantity * 100;
      totalTheta += contract.theta * contract.quantity * 100;
      totalVega += contract.vega * contract.quantity * 100;
      totalRho += contract.rho * contract.quantity * 100;
    });

    setPortfolioValue(totalValue);
    setPortfolioGreeks({
      delta: Math.round(totalDelta * 100) / 100,
      gamma: Math.round(totalGamma * 100) / 100,
      theta: Math.round(totalTheta * 100) / 100,
      vega: Math.round(totalVega * 100) / 100,
      rho: Math.round(totalRho * 100) / 100
    });
  }, [portfolio]);

  const addToPortfolio = (contract: OptionContract, quantity: number) => {
    const existingContract = portfolio.find(c => c.id === contract.id);
    
    if (existingContract) {
      setPortfolio(prev => prev.map(c => 
        c.id === contract.id 
          ? { ...c, quantity: c.quantity + quantity }
          : c
      ));
    } else {
      setPortfolio(prev => [...prev, { ...contract, quantity }]);
    }
  };

  const removeFromPortfolio = (contractId: string) => {
    setPortfolio(prev => prev.filter(c => c.id !== contractId));
  };

  const getGreeksColor = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value > 0 ? '#10b981' : '#ef4444';
    } else {
      return Math.abs(value) < 0.1 ? '#10b981' : Math.abs(value) < 0.5 ? '#f59e0b' : '#ef4444';
    }
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
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
        background: 'radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
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
          📊 Options Trading Simulator
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Advanced options trading with real-time Greeks and strategy analysis
        </p>
      </div>

      {/* Symbol Selection */}
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
            📈 Symbol Selection
          </h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Symbol
              </label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  width: '150px'
                }}
              >
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol} style={{ background: '#1f2937', color: 'white' }}>
                    {symbol}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Current Price ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  width: '150px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <Button
                onClick={() => setCurrentPrice(prev => prev * 1.01)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#22c55e',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                +1%
              </Button>
              <Button
                onClick={() => setCurrentPrice(prev => prev * 0.99)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                -1%
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Overview */}
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
            💼 Portfolio Overview
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {formatCurrency(portfolioValue)}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Portfolio Value</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: getGreeksColor(portfolioGreeks.delta),
                marginBottom: '0.25rem'
              }}>
                {portfolioGreeks.delta}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Delta</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: getGreeksColor(portfolioGreeks.gamma),
                marginBottom: '0.25rem'
              }}>
                {portfolioGreeks.gamma}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Gamma</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏰</div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: getGreeksColor(portfolioGreeks.theta, false),
                marginBottom: '0.25rem'
              }}>
                {portfolioGreeks.theta}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Theta</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: getGreeksColor(portfolioGreeks.vega),
                marginBottom: '0.25rem'
              }}>
                {portfolioGreeks.vega}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Vega</div>
            </div>
          </div>

          {/* Portfolio Positions */}
          {portfolio.length > 0 ? (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                📋 Open Positions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {portfolio.map((contract) => (
                  <div key={contract.id} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '1rem',
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>
                        {contract.symbol} {contract.type.toUpperCase()} ${contract.strike} {contract.expiration}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        Qty: {contract.quantity} | Premium: {formatCurrency(contract.premium)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', color: 'white', fontWeight: '600' }}>
                          {formatCurrency(contract.premium * contract.quantity * 100)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                          Total Value
                        </div>
                      </div>
                      <Button
                        onClick={() => removeFromPortfolio(contract.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              No positions in portfolio
            </div>
          )}
        </div>
      </div>

      {/* Options Chain */}
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
            📊 Options Chain - {selectedSymbol}
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Type</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Strike</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Expiration</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Bid</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Ask</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Last</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Delta</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Gamma</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Theta</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Vega</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>IV</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {optionContracts.slice(0, 20).map((contract) => (
                  <tr key={contract.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.75rem', color: 'white', fontSize: '0.875rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        background: contract.type === 'call' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: contract.type === 'call' ? '#22c55e' : '#ef4444',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {contract.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'white', fontSize: '0.875rem' }}>${contract.strike}</td>
                    <td style={{ padding: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>{contract.expiration}</td>
                    <td style={{ padding: '0.75rem', color: 'white', fontSize: '0.875rem' }}>{formatCurrency(contract.bid)}</td>
                    <td style={{ padding: '0.75rem', color: 'white', fontSize: '0.875rem' }}>{formatCurrency(contract.ask)}</td>
                    <td style={{ padding: '0.75rem', color: 'white', fontSize: '0.875rem' }}>{formatCurrency(contract.lastPrice)}</td>
                    <td style={{ padding: '0.75rem', color: getGreeksColor(contract.delta), fontSize: '0.875rem' }}>{contract.delta}</td>
                    <td style={{ padding: '0.75rem', color: getGreeksColor(contract.gamma), fontSize: '0.875rem' }}>{contract.gamma}</td>
                    <td style={{ padding: '0.75rem', color: getGreeksColor(contract.theta, false), fontSize: '0.875rem' }}>{contract.theta}</td>
                    <td style={{ padding: '0.75rem', color: getGreeksColor(contract.vega), fontSize: '0.875rem' }}>{contract.vega}</td>
                    <td style={{ padding: '0.75rem', color: 'white', fontSize: '0.875rem' }}>{formatPercentage(contract.impliedVolatility)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <Button
                        onClick={() => addToPortfolio(contract, 1)}
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.5rem',
                          background: 'rgba(34, 197, 94, 0.2)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          color: '#22c55e',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Buy
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default OptionsTrading;
