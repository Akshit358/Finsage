import React, { useState, useEffect } from 'react';

const Portfolio: React.FC = () => {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockPortfolios = [
        {
          id: '1',
          name: 'Growth Portfolio',
          description: 'Aggressive growth focused portfolio',
          totalValue: 125000,
          totalGain: 15000,
          totalGainPercent: 13.64,
          positions: [
            { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, currentPrice: 175.00, value: 8750, gain: 1250, gainPercent: 16.67, allocation: 7.0 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 25, currentPrice: 140.00, value: 3500, gain: 500, gainPercent: 16.67, allocation: 2.8 },
            { symbol: 'MSFT', name: 'Microsoft Corporation', shares: 30, currentPrice: 350.00, value: 10500, gain: 1500, gainPercent: 16.67, allocation: 8.4 }
          ]
        },
        {
          id: '2',
          name: 'Conservative Portfolio',
          description: 'Low-risk income focused portfolio',
          totalValue: 75000,
          totalGain: 2500,
          totalGainPercent: 3.45,
          positions: [
            { symbol: 'JNJ', name: 'Johnson & Johnson', shares: 100, currentPrice: 155.00, value: 15500, gain: 500, gainPercent: 3.33, allocation: 20.67 },
            { symbol: 'PG', name: 'Procter & Gamble', shares: 80, currentPrice: 145.00, value: 11600, gain: 400, gainPercent: 3.57, allocation: 15.47 }
          ]
        }
      ];
      
      setPortfolios(mockPortfolios);
      setSelectedPortfolio(mockPortfolios[0]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading portfolios...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Portfolio Management
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Track and manage your investment portfolios
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Portfolio List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Your Portfolios
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                onClick={() => setSelectedPortfolio(portfolio)}
                style={{
                  padding: '1rem',
                  border: selectedPortfolio?.id === portfolio.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: selectedPortfolio?.id === portfolio.id ? '#eff6ff' : 'white'
                }}
              >
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                  {portfolio.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {portfolio.positions.length} positions
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                    ${portfolio.totalValue.toLocaleString()}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: portfolio.totalGainPercent > 0 ? '#059669' : '#dc2626' 
                  }}>
                    {portfolio.totalGainPercent > 0 ? '+' : ''}{portfolio.totalGainPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Details */}
        <div>
          {selectedPortfolio ? (
            <div>
              {/* Portfolio Header */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                  {selectedPortfolio.name}
                </h2>
                <p style={{ fontSize: '1rem', color: '#6b7280' }}>
                  {selectedPortfolio.description}
                </p>
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
                  <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
                    ${selectedPortfolio.totalValue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Value</div>
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#059669' }}>
                    +${selectedPortfolio.totalGain.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Gain</div>
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#059669' }}>
                    +{selectedPortfolio.totalGainPercent.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Return %</div>
                </div>
              </div>

              {/* Holdings Table */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                  Holdings
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Symbol</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Shares</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Price</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Value</th>
                        <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPortfolio.positions.map((position: any, index: number) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.75rem', fontWeight: '500', color: '#111827' }}>{position.symbol}</td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{position.name}</td>
                          <td style={{ padding: '0.75rem' }}>{position.shares}</td>
                          <td style={{ padding: '0.75rem' }}>${position.currentPrice.toFixed(2)}</td>
                          <td style={{ padding: '0.75rem', fontWeight: '500' }}>${position.value.toLocaleString()}</td>
                          <td style={{ 
                            padding: '0.75rem', 
                            fontWeight: '500', 
                            color: position.gainPercent > 0 ? '#059669' : '#dc2626' 
                          }}>
                            {position.gainPercent > 0 ? '+' : ''}{position.gainPercent.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                Select a Portfolio
              </h3>
              <p style={{ color: '#6b7280' }}>Choose a portfolio from the list to view its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;