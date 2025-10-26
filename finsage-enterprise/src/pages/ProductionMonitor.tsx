import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';

interface DeploymentStatus {
  environment: string;
  status: 'deployed' | 'deploying' | 'failed' | 'pending';
  version: string;
  lastDeployment: string;
  uptime: number;
  healthScore: number;
  errors: number;
  requests: number;
  responseTime: number;
}

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastCheck: string;
}

interface PerformanceMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
}

const ProductionMonitor: React.FC = () => {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    environment: 'production',
    status: 'deployed',
    version: 'v1.2.3',
    lastDeployment: new Date().toISOString(),
    uptime: 99.9,
    healthScore: 98,
    errors: 12,
    requests: 1250000,
    responseTime: 245
  });

  const [services, setServices] = useState<ServiceHealth[]>([
    {
      name: 'Frontend (React)',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 120,
      errorRate: 0.1,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Backend API (FastAPI)',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 180,
      errorRate: 0.2,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Database (Supabase)',
      status: 'healthy',
      uptime: 99.95,
      responseTime: 45,
      errorRate: 0.05,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'AI Service (OpenAI)',
      status: 'warning',
      uptime: 98.5,
      responseTime: 1200,
      errorRate: 1.2,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'Market Data API',
      status: 'healthy',
      uptime: 99.7,
      responseTime: 300,
      errorRate: 0.3,
      lastCheck: new Date().toISOString()
    },
    {
      name: 'CDN (CloudFront)',
      status: 'healthy',
      uptime: 99.99,
      responseTime: 80,
      errorRate: 0.01,
      lastCheck: new Date().toISOString()
    }
  ]);

  const [performance, setPerformance] = useState<PerformanceMetrics>({
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 78,
    requestsPerSecond: 1250,
    averageResponseTime: 245,
    errorRate: 0.15
  });

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update performance metrics
      setPerformance(prev => ({
        ...prev,
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 5)),
        requestsPerSecond: Math.max(500, prev.requestsPerSecond + (Math.random() - 0.5) * 200),
        averageResponseTime: Math.max(100, prev.averageResponseTime + (Math.random() - 0.5) * 50)
      }));

      // Update service health
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: Math.max(10, service.responseTime + (Math.random() - 0.5) * 20),
        errorRate: Math.max(0, service.errorRate + (Math.random() - 0.5) * 0.5),
        lastCheck: new Date().toISOString()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const deployToProduction = async () => {
    setIsDeploying(true);
    setDeploymentLogs([]);

    const steps = [
      'Initializing deployment...',
      'Building application...',
      'Running tests...',
      'Pushing to AWS ECR...',
      'Updating ECS service...',
      'Health check in progress...',
      'Deployment completed successfully!'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDeploymentLogs(prev => [...prev, steps[i]]);
    }

    setDeploymentStatus(prev => ({
      ...prev,
      status: 'deployed',
      version: `v1.2.${Math.floor(Math.random() * 10) + 1}`,
      lastDeployment: new Date().toISOString()
    }));

    setIsDeploying(false);
  };

  const rollbackDeployment = async () => {
    setIsDeploying(true);
    setDeploymentLogs(['Rolling back to previous version...', 'Rollback completed successfully!']);
    
    setTimeout(() => {
      setDeploymentStatus(prev => ({
        ...prev,
        status: 'deployed',
        version: 'v1.2.2',
        lastDeployment: new Date().toISOString()
      }));
      setIsDeploying(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'deployed': return '#10b981';
      case 'deploying': return '#3b82f6';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '❌';
      case 'deployed': return '🚀';
      case 'deploying': return '⏳';
      case 'failed': return '💥';
      default: return '⚪';
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
          🚀 Production Monitor
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Real-time monitoring and deployment management
        </p>
      </div>

      {/* Deployment Status */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>
              📊 Deployment Status
            </h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                onClick={deployToProduction}
                disabled={isDeploying}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '1.5rem',
                  background: isDeploying ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #059669, #047857)',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isDeploying ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isDeploying ? 'none' : '0 4px 15px rgba(5, 150, 105, 0.3)'
                }}
              >
                {isDeploying ? <LoadingSpinner size="sm" /> : '🚀 Deploy'}
              </Button>
              <Button
                onClick={rollbackDeployment}
                disabled={isDeploying}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '1.5rem',
                  background: isDeploying ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isDeploying ? 'not-allowed' : 'pointer'
                }}
              >
                🔄 Rollback
              </Button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏷️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {deploymentStatus.version}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Version</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {deploymentStatus.uptime}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Uptime</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❤️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {deploymentStatus.healthScore}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Health Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {deploymentStatus.requests.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Total Requests</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {deploymentStatus.responseTime}ms
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Avg Response</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>❌</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {deploymentStatus.errors}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Errors (24h)</div>
            </div>
          </div>

          {/* Deployment Logs */}
          {isDeploying && deploymentLogs.length > 0 && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '1rem',
              padding: '1rem',
              marginTop: '1rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                Deployment Logs
              </h3>
              <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                {deploymentLogs.map((log, index) => (
                  <div key={index} style={{ marginBottom: '0.25rem' }}>
                    [{new Date().toLocaleTimeString()}] {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Health */}
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
            🔍 Service Health
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {services.map((service, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: 0 }}>
                    {service.name}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    background: `rgba(${getStatusColor(service.status).slice(1)}, 0.2)`,
                    color: getStatusColor(service.status),
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {getStatusIcon(service.status)} {service.status.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Uptime</div>
                    <div style={{ color: 'white', fontWeight: '600' }}>{service.uptime}%</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Response Time</div>
                    <div style={{ color: 'white', fontWeight: '600' }}>{service.responseTime}ms</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Error Rate</div>
                    <div style={{ color: 'white', fontWeight: '600' }}>{service.errorRate}%</div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Last Check</div>
                    <div style={{ color: 'white', fontWeight: '600' }}>
                      {new Date(service.lastCheck).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
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
            📈 Performance Metrics
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖥️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {performance.cpu.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>CPU Usage</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💾</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {performance.memory.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Memory Usage</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💿</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {performance.disk.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Disk Usage</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌐</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {performance.network.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Network Usage</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {performance.requestsPerSecond.toFixed(0)}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Requests/sec</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {performance.averageResponseTime.toFixed(0)}ms
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Avg Response</div>
            </div>
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

export default ProductionMonitor;
