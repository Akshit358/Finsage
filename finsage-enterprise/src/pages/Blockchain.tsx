import React, { useState, useEffect } from 'react';

const Blockchain: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [defiPortfolio, setDefiPortfolio] = useState<any>(null);
  const [nftPortfolio, setNftPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('portfolio');

  useEffect(() => {
    // Simulate checking for existing wallet connection
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setWalletConnected(true);
      loadPortfolioData(savedWallet);
    }
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setWalletAddress(mockAddress);
      setWalletConnected(true);
      localStorage.setItem('walletAddress', mockAddress);
      loadPortfolioData(mockAddress);
      setLoading(false);
    }, 1500);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setDefiPortfolio(null);
    setNftPortfolio([]);
    localStorage.removeItem('walletAddress');
  };

  const loadPortfolioData = (address: string) => {
    setLoading(true);
    
    setTimeout(() => {
      // Simulate DeFi portfolio data
      setDefiPortfolio({
        totalValue: 125000,
        totalGain: 15000,
        totalGainPercent: 13.64,
        positions: [
          {
            protocol: 'Uniswap V3',
            token: 'ETH',
            amount: 2.5,
            value: 6250,
            gain: 1250,
            gainPercent: 25.0,
            apy: 8.5
          },
          {
            protocol: 'Compound',
            token: 'USDC',
            amount: 10000,
            value: 10000,
            gain: 500,
            gainPercent: 5.0,
            apy: 4.2
          },
          {
            protocol: 'Aave',
            token: 'WBTC',
            amount: 0.1,
            value: 3500,
            gain: 700,
            gainPercent: 25.0,
            apy: 12.3
          },
          {
            protocol: 'Yearn Finance',
            token: 'DAI',
            amount: 5000,
            value: 5000,
            gain: 250,
            gainPercent: 5.3,
            apy: 6.8
          }
        ],
        staking: {
          totalStaked: 50000,
          rewards: 2500,
          apy: 5.0
        },
        lending: {
          totalSupplied: 30000,
          totalBorrowed: 15000,
          utilizationRate: 50.0
        }
      });

      // Simulate NFT portfolio
      setNftPortfolio([
        {
          id: 1,
          name: 'CryptoPunk #1234',
          collection: 'CryptoPunks',
          image: 'https://via.placeholder.com/150',
          floorPrice: 25.5,
          lastSale: 30.0,
          value: 30.0,
          gain: 4.5,
          gainPercent: 17.6
        },
        {
          id: 2,
          name: 'Bored Ape #5678',
          collection: 'Bored Ape Yacht Club',
          image: 'https://via.placeholder.com/150',
          floorPrice: 15.2,
          lastSale: 18.0,
          value: 18.0,
          gain: 2.8,
          gainPercent: 18.4
        },
        {
          id: 3,
          name: 'Art Blocks #9999',
          collection: 'Art Blocks',
          image: 'https://via.placeholder.com/150',
          floorPrice: 2.1,
          lastSale: 2.5,
          value: 2.5,
          gain: 0.4,
          gainPercent: 19.0
        }
      ]);
      
      setLoading(false);
    }, 2000);
  };

  const refreshPortfolio = () => {
    if (walletConnected) {
      loadPortfolioData(walletAddress);
    }
  };

  const tabs = [
    { id: 'portfolio', name: 'DeFi Portfolio', icon: '💼' },
    { id: 'nfts', name: 'NFTs', icon: '🖼️' },
    { id: 'staking', name: 'Staking', icon: '🔒' },
    { id: 'lending', name: 'Lending', icon: '💰' },
    { id: 'transactions', name: 'Transactions', icon: '📊' }
  ];

  if (!walletConnected) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Blockchain & Web3
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Connect your wallet to access DeFi portfolio and Web3 features
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔗</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Connect Your Wallet
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
            Connect your Web3 wallet to view your DeFi portfolio, NFTs, and manage your crypto assets
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={connectWallet}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Connecting...
                </>
              ) : (
                <>
                  🔗 Connect Wallet
                </>
              )}
            </button>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
              Supported Wallets:
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Trust Wallet'].map((wallet) => (
                <span key={wallet} style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  backgroundColor: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem'
                }}>
                  {wallet}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Blockchain & Web3
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={refreshPortfolio}
              disabled={loading}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
            <button
              onClick={disconnectWallet}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '0.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: selectedTab === tab.id ? '#eff6ff' : 'transparent',
                color: selectedTab === tab.id ? '#2563eb' : '#6b7280',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* DeFi Portfolio Tab */}
      {selectedTab === 'portfolio' && defiPortfolio && (
        <div>
          {/* Portfolio Overview */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              DeFi Portfolio Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
                  ${defiPortfolio.totalValue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Value</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
                  +${defiPortfolio.totalGain.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Gain</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
                  +{defiPortfolio.totalGainPercent.toFixed(2)}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Return</div>
              </div>
            </div>
          </div>

          {/* DeFi Positions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              DeFi Positions
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Protocol</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Token</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Amount</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Value</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>APY</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Return</th>
                  </tr>
                </thead>
                <tbody>
                  {defiPortfolio.positions.map((position: any, index: number) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '500', color: '#111827' }}>{position.protocol}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '500', color: '#111827' }}>{position.token}</td>
                      <td style={{ padding: '0.75rem' }}>{position.amount}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '500' }}>${position.value.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', color: '#059669', fontWeight: '500' }}>{position.apy}%</td>
                      <td style={{ 
                        padding: '0.75rem', 
                        fontWeight: '500', 
                        color: position.gainPercent > 0 ? '#059669' : '#ef4444' 
                      }}>
                        {position.gainPercent > 0 ? '+' : ''}{position.gainPercent.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NFTs Tab */}
      {selectedTab === 'nfts' && (
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              NFT Portfolio
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {nftPortfolio.map((nft) => (
                <div key={nft.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                  }}>
                    🖼️
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                      {nft.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                      {nft.collection}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                          {nft.value} ETH
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Floor: {nft.floorPrice} ETH
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: nft.gainPercent > 0 ? '#059669' : '#ef4444'
                        }}>
                          {nft.gainPercent > 0 ? '+' : ''}{nft.gainPercent.toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Last Sale: {nft.lastSale} ETH
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Staking Tab */}
      {selectedTab === 'staking' && defiPortfolio && (
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              Staking Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
                  {defiPortfolio.staking.totalStaked.toLocaleString()} ETH
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Staked</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
                  {defiPortfolio.staking.rewards.toLocaleString()} ETH
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Rewards Earned</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                  {defiPortfolio.staking.apy}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>APY</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lending Tab */}
      {selectedTab === 'lending' && defiPortfolio && (
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              Lending Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
                  ${defiPortfolio.lending.totalSupplied.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Supplied</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
                  ${defiPortfolio.lending.totalBorrowed.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Borrowed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                  {defiPortfolio.lending.utilizationRate}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Utilization Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {selectedTab === 'transactions' && (
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              Recent Transactions
            </h2>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                Transaction History
              </h3>
              <p style={{ color: '#6b7280' }}>
                View your recent DeFi transactions and activity
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blockchain;