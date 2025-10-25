import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    loadInitialData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      if (isLive) {
        updateMarketData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLive]);

  const loadInitialData = () => {
    setLoading(true);
    setTimeout(() => {
      setPortfolioData({
        totalValue: 125000,
        totalGain: 15000,
        totalGainPercent: 13.64,
        positions: [
          { symbol: 'AAPL', name: 'Apple Inc.', value: 8750, gain: 1250, gainPercent: 16.67 },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 3500, gain: 500, gainPercent: 16.67 },
          { symbol: 'MSFT', name: 'Microsoft Corporation', value: 10500, gain: 1500, gainPercent: 16.67 }
        ]
      });
      
      setMarketData({
        sp500: { value: 4850.43, change: 1.25, changePercent: 0.03 },
        nasdaq: { value: 15235.71, change: -0.45, changePercent: -0.003 },
        dow: { value: 37856.52, change: 0.89, changePercent: 0.002 },
        vix: { value: 18.45, change: -0.32, changePercent: -0.017 },
        sentiment: 65.5,
        lastUpdated: new Date().toISOString()
      });

      // Generate initial notifications
      setNotifications([
        {
          id: 1,
          type: 'success',
          title: 'Portfolio Update',
          message: 'Your portfolio has gained 2.3% today',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          read: false
        },
        {
          id: 2,
          type: 'info',
          title: 'Market Alert',
          message: 'S&P 500 reached new all-time high',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false
        },
        {
          id: 3,
          type: 'warning',
          title: 'Price Alert',
          message: 'AAPL crossed your target price of $175',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: true
        }
      ]);
      
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const updateMarketData = () => {
    // Simulate real-time market data updates
    setMarketData(prev => ({
      ...prev,
      sp500: {
        ...prev.sp500,
        value: prev.sp500.value + (Math.random() - 0.5) * 10,
        change: prev.sp500.change + (Math.random() - 0.5) * 2,
        changePercent: ((prev.sp500.value + (Math.random() - 0.5) * 10) - 4850.43) / 4850.43 * 100
      },
      nasdaq: {
        ...prev.nasdaq,
        value: prev.nasdaq.value + (Math.random() - 0.5) * 20,
        change: prev.nasdaq.change + (Math.random() - 0.5) * 3,
        changePercent: ((prev.nasdaq.value + (Math.random() - 0.5) * 20) - 15235.71) / 15235.71 * 100
      },
      dow: {
        ...prev.dow,
        value: prev.dow.value + (Math.random() - 0.5) * 15,
        change: prev.dow.change + (Math.random() - 0.5) * 2,
        changePercent: ((prev.dow.value + (Math.random() - 0.5) * 15) - 37856.52) / 37856.52 * 100
      },
      vix: {
        ...prev.vix,
        value: Math.max(10, prev.vix.value + (Math.random() - 0.5) * 2),
        change: prev.vix.change + (Math.random() - 0.5) * 0.5,
        changePercent: ((Math.max(10, prev.vix.value + (Math.random() - 0.5) * 2)) - 18.45) / 18.45 * 100
      },
      sentiment: Math.max(0, Math.min(100, prev.sentiment + (Math.random() - 0.5) * 5)),
      lastUpdated: new Date().toISOString()
    }));

    setLastUpdated(new Date());

    // Occasionally add new notifications
    if (Math.random() < 0.3) {
      const newNotification = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'success' : 'info',
        title: Math.random() > 0.5 ? 'Market Update' : 'Portfolio Alert',
        message: Math.random() > 0.5 
          ? 'Market showing positive momentum' 
          : 'One of your positions moved significantly',
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }
  };

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

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
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isLive ? '#059669' : '#ef4444',
                animation: isLive ? 'pulse 2s infinite' : 'none'
              }}></div>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {isLive ? 'Live' : 'Paused'}
              </span>
            </div>
            <button
              onClick={toggleLiveUpdates}
              style={{
                backgroundColor: isLive ? '#ef4444' : '#059669',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {isLive ? '⏸️ Pause' : '▶️ Live'}
            </button>
            <button
              onClick={updateMarketData}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Welcome to your financial intelligence platform
          {lastUpdated && (
            <span style={{ fontSize: '0.875rem', marginLeft: '1rem' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
              Notifications ({notifications.filter(n => !n.read).length})
            </h2>
            <button
              onClick={clearAllNotifications}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.25rem',
                border: 'none',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                onClick={() => markNotificationAsRead(notification.id)}
                style={{
                  padding: '0.75rem',
                  backgroundColor: notification.read ? '#f8fafc' : '#eff6ff',
                  borderRadius: '0.5rem',
                  border: '1px solid',
                  borderColor: notification.read ? '#e5e7eb' : '#bfdbfe',
                  cursor: 'pointer',
                  opacity: notification.read ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem' }}>
                        {notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#2563eb'
                        }}></div>
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                      {notification.message}
                    </p>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '1rem' }}>
                    {notification.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Overview */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Portfolio Overview
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
              ${portfolioData?.totalValue?.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Value</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
              +${portfolioData?.totalGain?.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Gain</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
              +{portfolioData?.totalGainPercent?.toFixed(2)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Return</div>
          </div>
        </div>
      </div>

      {/* Market Data */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Market Indicators
          {isLive && (
            <span style={{
              marginLeft: '0.5rem',
              fontSize: '0.75rem',
              color: '#059669',
              fontWeight: '500'
            }}>
              LIVE
            </span>
          )}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              S&P 500: {marketData?.sp500?.value?.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: marketData?.sp500?.changePercent > 0 ? '#059669' : '#ef4444' }}>
              {marketData?.sp500?.changePercent > 0 ? '+' : ''}{marketData?.sp500?.changePercent?.toFixed(3)}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              NASDAQ: {marketData?.nasdaq?.value?.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: marketData?.nasdaq?.changePercent > 0 ? '#059669' : '#ef4444' }}>
              {marketData?.nasdaq?.changePercent > 0 ? '+' : ''}{marketData?.nasdaq?.changePercent?.toFixed(3)}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              DOW: {marketData?.dow?.value?.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: marketData?.dow?.changePercent > 0 ? '#059669' : '#ef4444' }}>
              {marketData?.dow?.changePercent > 0 ? '+' : ''}{marketData?.dow?.changePercent?.toFixed(3)}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              VIX: {marketData?.vix?.value?.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: marketData?.vix?.changePercent > 0 ? '#ef4444' : '#059669' }}>
              {marketData?.vix?.changePercent > 0 ? '+' : ''}{marketData?.vix?.changePercent?.toFixed(3)}%
            </div>
          </div>
        </div>
      </div>

      {/* Market Sentiment */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Market Sentiment
        </h2>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            position: 'relative'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `conic-gradient(#2563eb ${marketData?.sentiment * 3.6}deg, #f3f4f6 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827'
              }}>
                {marketData?.sentiment?.toFixed(1)}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
            {marketData?.sentiment > 60 ? 'Bullish' : marketData?.sentiment > 40 ? 'Neutral' : 'Bearish'}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/predictions" style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Generate AI Prediction
          </a>
          <a href="/portfolio" style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            View Portfolio
          </a>
          <a href="/analytics" style={{
            backgroundColor: 'transparent',
            color: '#2563eb',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #2563eb',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Advanced Analytics
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;