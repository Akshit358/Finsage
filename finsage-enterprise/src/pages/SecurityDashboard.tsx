import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  affectedUsers: number;
}

interface ComplianceCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  lastChecked: string;
  nextCheck: string;
  category: 'data_protection' | 'authentication' | 'encryption' | 'audit' | 'access_control';
}

interface SecurityMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  resolvedAlerts: number;
  securityScore: number;
  lastScan: string;
  vulnerabilities: number;
  threatsBlocked: number;
  dataBreaches: number;
}

const SecurityDashboard: React.FC = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalAlerts: 47,
    criticalAlerts: 3,
    resolvedAlerts: 44,
    securityScore: 92,
    lastScan: new Date().toISOString(),
    vulnerabilities: 2,
    threatsBlocked: 1250,
    dataBreaches: 0
  });

  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Suspicious Login Attempts',
      description: 'Multiple failed login attempts detected from unusual IP addresses',
      source: 'Authentication Service',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: 'active',
      affectedUsers: 12
    },
    {
      id: '2',
      type: 'high',
      title: 'API Rate Limit Exceeded',
      description: 'Unusual API usage patterns detected, possible automated attack',
      source: 'API Gateway',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      status: 'investigating',
      affectedUsers: 5
    },
    {
      id: '3',
      type: 'medium',
      title: 'Outdated Dependencies',
      description: 'Several npm packages have known vulnerabilities',
      source: 'Dependency Scanner',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: 'active',
      affectedUsers: 0
    },
    {
      id: '4',
      type: 'low',
      title: 'Weak Password Policy',
      description: 'Some users have weak passwords that need updating',
      source: 'Password Policy Checker',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'resolved',
      affectedUsers: 8
    }
  ]);

  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([
    {
      name: 'GDPR Compliance',
      status: 'pass',
      description: 'Data protection and privacy controls are properly implemented',
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 86400000).toISOString(),
      category: 'data_protection'
    },
    {
      name: 'SOC 2 Type II',
      status: 'pass',
      description: 'Security controls meet SOC 2 requirements',
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 2592000000).toISOString(),
      category: 'audit'
    },
    {
      name: 'PCI DSS',
      status: 'warning',
      description: 'Payment card data handling needs review',
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 604800000).toISOString(),
      category: 'data_protection'
    },
    {
      name: 'Multi-Factor Authentication',
      status: 'pass',
      description: 'MFA is properly configured for all admin accounts',
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 604800000).toISOString(),
      category: 'authentication'
    },
    {
      name: 'Data Encryption',
      status: 'pass',
      description: 'All sensitive data is encrypted at rest and in transit',
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 604800000).toISOString(),
      category: 'encryption'
    },
    {
      name: 'Access Control',
      status: 'fail',
      description: 'Some users have excessive permissions',
      lastChecked: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 604800000).toISOString(),
      category: 'access_control'
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const runSecurityScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    const steps = [
      'Scanning dependencies...',
      'Checking authentication systems...',
      'Analyzing network traffic...',
      'Reviewing access controls...',
      'Validating encryption...',
      'Scan completed!'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanProgress(((i + 1) / steps.length) * 100);
    }

    setSecurityMetrics(prev => ({
      ...prev,
      lastScan: new Date().toISOString(),
      securityScore: Math.min(100, prev.securityScore + Math.random() * 5),
      vulnerabilities: Math.max(0, prev.vulnerabilities - Math.floor(Math.random() * 2))
    }));

    setIsScanning(false);
    setScanProgress(0);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' as const }
        : alert
    ));
    setSecurityMetrics(prev => ({
      ...prev,
      resolvedAlerts: prev.resolvedAlerts + 1,
      totalAlerts: prev.totalAlerts - 1
    }));
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'fail': return '#ef4444';
      case 'active': return '#ef4444';
      case 'investigating': return '#f59e0b';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅';
      case 'warning': return '⚠️';
      case 'fail': return '❌';
      case 'active': return '🔴';
      case 'investigating': return '🟡';
      case 'resolved': return '✅';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data_protection': return '🛡️';
      case 'authentication': return '🔐';
      case 'encryption': return '🔒';
      case 'audit': return '📋';
      case 'access_control': return '👥';
      default: return '📊';
    }
  };

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
          🔒 Security Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Comprehensive security monitoring and compliance management
        </p>
      </div>

      {/* Security Metrics */}
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
              📊 Security Metrics
            </h2>
            <Button
              onClick={runSecurityScan}
              disabled={isScanning}
              style={{
                padding: '1rem 2rem',
                borderRadius: '1.5rem',
                background: isScanning ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #059669, #047857)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isScanning ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isScanning ? 'none' : '0 4px 15px rgba(5, 150, 105, 0.3)'
              }}
            >
              {isScanning ? <LoadingSpinner size="sm" /> : '🔍 Run Security Scan'}
            </Button>
          </div>

          {isScanning && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Scanning...</span>
                <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: '600' }}>{scanProgress.toFixed(0)}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${scanProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(45deg, #059669, #047857)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚨</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {securityMetrics.totalAlerts}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Total Alerts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔴</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.25rem' }}>
                {securityMetrics.criticalAlerts}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Critical Alerts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>
                {securityMetrics.resolvedAlerts}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Resolved Alerts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.25rem' }}>
                {securityMetrics.securityScore}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Security Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.25rem' }}>
                {securityMetrics.vulnerabilities}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Vulnerabilities</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚫</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>
                {securityMetrics.threatsBlocked.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>Threats Blocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Alerts */}
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
            🚨 Security Alerts
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0 }}>
                        {alert.title}
                      </h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        background: `rgba(${getAlertColor(alert.type).slice(1)}, 0.2)`,
                        color: getAlertColor(alert.type),
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {alert.type.toUpperCase()}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        background: `rgba(${getStatusColor(alert.status).slice(1)}, 0.2)`,
                        color: getStatusColor(alert.status),
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {getStatusIcon(alert.status)} {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                      {alert.description}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Source: {alert.source} • Affected Users: {alert.affectedUsers} • 
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {alert.status !== 'resolved' && (
                    <Button
                      onClick={() => resolveAlert(alert.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.75rem',
                        background: 'rgba(34, 197, 94, 0.2)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#22c55e',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Checks */}
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
            📋 Compliance Checks
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {complianceChecks.map((check, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(check.category)}</span>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: 0 }}>
                      {check.name}
                    </h3>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    background: `rgba(${getStatusColor(check.status).slice(1)}, 0.2)`,
                    color: getStatusColor(check.status),
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {getStatusIcon(check.status)} {check.status.toUpperCase()}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1rem' }}>
                  {check.description}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  <div>
                    <div>Last Checked:</div>
                    <div style={{ color: 'white', fontWeight: '600' }}>
                      {new Date(check.lastChecked).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div>Next Check:</div>
                    <div style={{ color: 'white', fontWeight: '600' }}>
                      {new Date(check.nextCheck).toLocaleDateString()}
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

export default SecurityDashboard;
