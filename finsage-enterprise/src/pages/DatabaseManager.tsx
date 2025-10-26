import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';

interface DatabaseConfig {
  url: string;
  anonKey: string;
  connected: boolean;
  tables: string[];
  lastSync: string;
}

interface TableSchema {
  name: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    defaultValue?: any;
  }[];
  rowCount: number;
  lastUpdated: string;
}

interface QueryResult {
  data: any[];
  count: number;
  executionTime: number;
  error?: string;
}

const DatabaseManager: React.FC = () => {
  const [config, setConfig] = useState<DatabaseConfig>({
    url: '',
    anonKey: '',
    connected: false,
    tables: [],
    lastSync: ''
  });

  const [schemas, setSchemas] = useState<TableSchema[]>([]);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock database tables for FinSage
  const mockTables: TableSchema[] = [
    {
      name: 'users',
      columns: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'email', type: 'varchar', nullable: false },
        { name: 'name', type: 'varchar', nullable: false },
        { name: 'role', type: 'varchar', nullable: false },
        { name: 'created_at', type: 'timestamp', nullable: false },
        { name: 'last_login', type: 'timestamp', nullable: true },
        { name: 'preferences', type: 'jsonb', nullable: true }
      ],
      rowCount: 1250,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'portfolios',
      columns: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'user_id', type: 'uuid', nullable: false },
        { name: 'name', type: 'varchar', nullable: false },
        { name: 'total_value', type: 'decimal', nullable: false },
        { name: 'created_at', type: 'timestamp', nullable: false },
        { name: 'updated_at', type: 'timestamp', nullable: false }
      ],
      rowCount: 2100,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'positions',
      columns: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'portfolio_id', type: 'uuid', nullable: false },
        { name: 'symbol', type: 'varchar', nullable: false },
        { name: 'quantity', type: 'decimal', nullable: false },
        { name: 'avg_price', type: 'decimal', nullable: false },
        { name: 'current_price', type: 'decimal', nullable: false },
        { name: 'created_at', type: 'timestamp', nullable: false }
      ],
      rowCount: 15600,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'trades',
      columns: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'user_id', type: 'uuid', nullable: false },
        { name: 'symbol', type: 'varchar', nullable: false },
        { name: 'type', type: 'varchar', nullable: false },
        { name: 'quantity', type: 'decimal', nullable: false },
        { name: 'price', type: 'decimal', nullable: false },
        { name: 'timestamp', type: 'timestamp', nullable: false },
        { name: 'status', type: 'varchar', nullable: false }
      ],
      rowCount: 45000,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'market_data',
      columns: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'symbol', type: 'varchar', nullable: false },
        { name: 'price', type: 'decimal', nullable: false },
        { name: 'volume', type: 'bigint', nullable: false },
        { name: 'timestamp', type: 'timestamp', nullable: false },
        { name: 'metadata', type: 'jsonb', nullable: true }
      ],
      rowCount: 2500000,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'ai_predictions',
      columns: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'user_id', type: 'uuid', nullable: false },
        { name: 'symbol', type: 'varchar', nullable: false },
        { name: 'prediction', type: 'jsonb', nullable: false },
        { name: 'confidence', type: 'decimal', nullable: false },
        { name: 'created_at', type: 'timestamp', nullable: false },
        { name: 'expires_at', type: 'timestamp', nullable: false }
      ],
      rowCount: 8500,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'risk_assessments',
      columns: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'portfolio_id', type: 'uuid', nullable: false },
        { name: 'var_95', type: 'decimal', nullable: false },
        { name: 'var_99', type: 'decimal', nullable: false },
        { name: 'max_drawdown', type: 'decimal', nullable: false },
        { name: 'sharpe_ratio', type: 'decimal', nullable: false },
        { name: 'calculated_at', type: 'timestamp', nullable: false }
      ],
      rowCount: 3200,
      lastUpdated: new Date().toISOString()
    },
    {
      name: 'notifications',
      columns: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'user_id', type: 'uuid', nullable: false },
        { name: 'type', type: 'varchar', nullable: false },
        { name: 'title', type: 'varchar', nullable: false },
        { name: 'message', type: 'text', nullable: false },
        { name: 'read', type: 'boolean', nullable: false },
        { name: 'created_at', type: 'timestamp', nullable: false }
      ],
      rowCount: 18000,
      lastUpdated: new Date().toISOString()
    }
  ];

  // Initialize with mock data
  useEffect(() => {
    setSchemas(mockTables);
    setConfig(prev => ({
      ...prev,
      tables: mockTables.map(t => t.name),
      lastSync: new Date().toISOString()
    }));
  }, []);

  const connectToDatabase = async () => {
    if (!config.url || !config.anonKey) {
      setError('Please provide both URL and API key');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate connection
    setTimeout(() => {
      setConfig(prev => ({
        ...prev,
        connected: true,
        lastSync: new Date().toISOString()
      }));
      setSuccess('Successfully connected to database!');
      setIsLoading(false);
    }, 2000);
  };

  const disconnectFromDatabase = () => {
    setConfig(prev => ({
      ...prev,
      connected: false,
      url: '',
      anonKey: '',
      tables: [],
      lastSync: ''
    }));
    setSuccess('Disconnected from database');
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate query execution
    setTimeout(() => {
      const mockResult: QueryResult = {
        data: [
          { id: 1, name: 'Sample User', email: 'user@example.com', created_at: '2024-01-01' },
          { id: 2, name: 'Demo User', email: 'demo@example.com', created_at: '2024-01-02' },
          { id: 3, name: 'Test User', email: 'test@example.com', created_at: '2024-01-03' }
        ],
        count: 3,
        executionTime: Math.random() * 100 + 50
      };

      setQueryResult(mockResult);
      setIsLoading(false);
    }, 1500);
  };

  const syncData = async () => {
    setIsLoading(true);
    setError(null);

    // Simulate data sync
    setTimeout(() => {
      setConfig(prev => ({
        ...prev,
        lastSync: new Date().toISOString()
      }));
      setSuccess('Data synchronized successfully!');
      setIsLoading(false);
    }, 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'uuid': return '#8b5cf6';
      case 'varchar': return '#3b82f6';
      case 'decimal': return '#10b981';
      case 'timestamp': return '#f59e0b';
      case 'jsonb': return '#ef4444';
      case 'boolean': return '#06b6d4';
      case 'bigint': return '#84cc16';
      default: return '#6b7280';
    }
  };

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
        background: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
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
          🗄️ Database Manager
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Manage your Supabase database and data operations
        </p>
      </div>

      {/* Connection Status */}
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
            🔌 Database Connection
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                Supabase URL
              </label>
              <Input
                type="url"
                value={config.url}
                onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://your-project.supabase.co"
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
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                API Key
              </label>
              <Input
                type="password"
                value={config.anonKey}
                onChange={(e) => setConfig(prev => ({ ...prev, anonKey: e.target.value }))}
                placeholder="Your Supabase anon key"
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
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button
              onClick={connectToDatabase}
              disabled={isLoading || config.connected}
              style={{
                padding: '1rem 2rem',
                borderRadius: '1.5rem',
                background: config.connected ? 'rgba(34, 197, 94, 0.2)' : 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: config.connected ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: config.connected ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : config.connected ? '✅ Connected' : 'Connect'}
            </Button>
            
            {config.connected && (
              <Button
                onClick={disconnectFromDatabase}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '1.5rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Disconnect
              </Button>
            )}

            {config.connected && (
              <Button
                onClick={syncData}
                disabled={isLoading}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '1.5rem',
                  background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                }}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : '🔄 Sync Data'}
              </Button>
            )}
          </div>

          {config.connected && (
            <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Last sync: {new Date(config.lastSync).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginBottom: '2rem',
          padding: '1rem',
          borderRadius: '1rem',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginBottom: '2rem',
          padding: '1rem',
          borderRadius: '1rem',
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          color: '#22c55e',
          fontSize: '0.875rem'
        }}>
          {success}
        </div>
      )}

      {/* Database Schema */}
      {config.connected && (
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
              📊 Database Schema
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {schemas.map((schema) => (
                <div key={schema.name} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0 }}>
                      {schema.name}
                    </h3>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#22c55e',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {schema.rowCount.toLocaleString()} rows
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {schema.columns.map((column, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
                            {column.name}
                          </span>
                          {!column.nullable && (
                            <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>*</span>
                          )}
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          color: getTypeColor(column.type),
                          fontWeight: '600',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.5rem',
                          background: `${getTypeColor(column.type)}20`
                        }}>
                          {column.type}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                    Last updated: {new Date(schema.lastUpdated).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Query Interface */}
      {config.connected && (
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
              🔍 Query Interface
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                SQL Query
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SELECT * FROM users LIMIT 10;"
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '1rem',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.875rem',
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <Button
              onClick={executeQuery}
              disabled={isLoading}
              style={{
                padding: '1rem 2rem',
                borderRadius: '1.5rem',
                background: isLoading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #059669, #047857)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(5, 150, 105, 0.3)',
                marginBottom: '2rem'
              }}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Execute Query'}
            </Button>

            {/* Query Results */}
            {queryResult && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                  Query Results
                </h3>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '1rem',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                      {queryResult.count} rows returned
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Execution time: {queryResult.executionTime.toFixed(2)}ms
                    </div>
                  </div>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          {Object.keys(queryResult.data[0] || {}).map((key) => (
                            <th key={key} style={{ padding: '0.75rem', textAlign: 'left', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.data.slice(0, 10).map((row, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} style={{ padding: '0.75rem', color: 'white', fontSize: '0.875rem' }}>
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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

export default DatabaseManager;
