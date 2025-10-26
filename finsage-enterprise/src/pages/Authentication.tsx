import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Skeleton';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'premium' | 'admin';
  createdAt: string;
  lastLogin: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    timezone: string;
  };
  subscription: {
    plan: 'free' | 'premium' | 'enterprise';
    status: 'active' | 'expired' | 'cancelled';
    expiresAt?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const Authentication: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    riskTolerance: 'moderate' as 'conservative' | 'moderate' | 'aggressive',
    acceptTerms: false
  });

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile'>('login');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock user data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'demo@finsage.com',
      name: 'Demo User',
      role: 'premium',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        notifications: true,
        riskTolerance: 'moderate',
        timezone: 'UTC'
      },
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: '2025-01-01T00:00:00Z'
      }
    }
  ];

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('finsage_token');
    const userData = localStorage.getItem('finsage_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        localStorage.removeItem('finsage_token');
        localStorage.removeItem('finsage_user');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === loginForm.email);
      
      if (user && loginForm.password === 'demo123') {
        const token = 'mock_jwt_token_' + Date.now();
        
        localStorage.setItem('finsage_token', token);
        localStorage.setItem('finsage_user', JSON.stringify(user));
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        });
        
        setSuccess('Login successful!');
        setActiveTab('profile');
      } else {
        setError('Invalid email or password');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!registerForm.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        email: registerForm.email,
        name: registerForm.name,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          notifications: true,
          riskTolerance: registerForm.riskTolerance,
          timezone: 'UTC'
        },
        subscription: {
          plan: 'free',
          status: 'active'
        }
      };

      const token = 'mock_jwt_token_' + Date.now();
      
      localStorage.setItem('finsage_token', token);
      localStorage.setItem('finsage_user', JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        token,
        isAuthenticated: true,
        isLoading: false
      });
      
      setSuccess('Registration successful! Welcome to FinSage!');
      setActiveTab('profile');
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('finsage_token');
    localStorage.removeItem('finsage_user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
    setActiveTab('login');
    setSuccess('Logged out successfully');
  };

  const updateProfile = (updates: Partial<User['preferences']>) => {
    if (!authState.user) return;

    const updatedUser = {
      ...authState.user,
      preferences: {
        ...authState.user.preferences,
        ...updates
      }
    };

    localStorage.setItem('finsage_user', JSON.stringify(updatedUser));
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
    setSuccess('Profile updated successfully!');
  };

  if (authState.isAuthenticated && authState.user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
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
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />

        {/* Profile Dashboard */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  color: 'white', 
                  marginBottom: '0.5rem'
                }}>
                  👤 User Profile
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Manage your account settings and preferences
                </p>
              </div>
              <Button
                onClick={handleLogout}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '1rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Logout
              </Button>
            </div>

            {/* User Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                  Account Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Name</div>
                    <div style={{ fontSize: '1rem', color: 'white', fontWeight: '500' }}>{authState.user.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Email</div>
                    <div style={{ fontSize: '1rem', color: 'white', fontWeight: '500' }}>{authState.user.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Role</div>
                    <div style={{ 
                      fontSize: '1rem', 
                      color: authState.user.role === 'premium' ? '#f59e0b' : '#10b981',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {authState.user.role}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Member Since</div>
                    <div style={{ fontSize: '1rem', color: 'white', fontWeight: '500' }}>
                      {new Date(authState.user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                  Subscription
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Plan</div>
                    <div style={{ 
                      fontSize: '1rem', 
                      color: authState.user.subscription.plan === 'premium' ? '#f59e0b' : '#10b981',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {authState.user.subscription.plan}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Status</div>
                    <div style={{ 
                      fontSize: '1rem', 
                      color: authState.user.subscription.status === 'active' ? '#10b981' : '#ef4444',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {authState.user.subscription.status}
                    </div>
                  </div>
                  {authState.user.subscription.expiresAt && (
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>Expires</div>
                      <div style={{ fontSize: '1rem', color: 'white', fontWeight: '500' }}>
                        {new Date(authState.user.subscription.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem' }}>
                Preferences
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                    Risk Tolerance
                  </label>
                  <select
                    value={authState.user.preferences.riskTolerance}
                    onChange={(e) => updateProfile({ riskTolerance: e.target.value as any })}
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
                    <option value="conservative" style={{ background: '#1f2937', color: 'white' }}>Conservative</option>
                    <option value="moderate" style={{ background: '#1f2937', color: 'white' }}>Moderate</option>
                    <option value="aggressive" style={{ background: '#1f2937', color: 'white' }}>Aggressive</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                    Theme
                  </label>
                  <select
                    value={authState.user.preferences.theme}
                    onChange={(e) => updateProfile({ theme: e.target.value as any })}
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
                    <option value="light" style={{ background: '#1f2937', color: 'white' }}>Light</option>
                    <option value="dark" style={{ background: '#1f2937', color: 'white' }}>Dark</option>
                    <option value="auto" style={{ background: '#1f2937', color: 'white' }}>Auto</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    checked={authState.user.preferences.notifications}
                    onChange={(e) => updateProfile({ notifications: e.target.checked })}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <label style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    Enable Notifications
                  </label>
                </div>
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
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />

      {/* Auth Form */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '500px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '0.5rem'
            }}>
              🔐 FinSage
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              Advanced Financial Intelligence Platform
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', marginBottom: '2rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem', padding: '0.25rem' }}>
            <button
              onClick={() => setActiveTab('login')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                background: activeTab === 'login' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                background: activeTab === 'register' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Register
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div style={{
              padding: '1rem',
              borderRadius: '1rem',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '1rem',
              borderRadius: '1rem',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22c55e',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {success}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                    Email
                  </label>
                  <Input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="demo@finsage.com"
                    required
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
                    Password
                  </label>
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="demo123"
                    required
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
                <Button
                  type="submit"
                  disabled={authState.isLoading}
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '1.5rem',
                    background: authState.isLoading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: authState.isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: authState.isLoading ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.3)',
                    width: '100%'
                  }}
                >
                  {authState.isLoading ? <LoadingSpinner size="sm" /> : 'Login'}
                </Button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.5rem' }}>
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    required
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
                    Email
                  </label>
                  <Input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    required
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
                    Password
                  </label>
                  <Input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    required
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
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
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
                    Risk Tolerance
                  </label>
                  <select
                    value={registerForm.riskTolerance}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, riskTolerance: e.target.value as any }))}
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
                    <option value="conservative" style={{ background: '#1f2937', color: 'white' }}>Conservative</option>
                    <option value="moderate" style={{ background: '#1f2937', color: 'white' }}>Moderate</option>
                    <option value="aggressive" style={{ background: '#1f2937', color: 'white' }}>Aggressive</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={registerForm.acceptTerms}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <label style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                    I accept the terms and conditions
                  </label>
                </div>
                <Button
                  type="submit"
                  disabled={authState.isLoading}
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '1.5rem',
                    background: authState.isLoading ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: authState.isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: authState.isLoading ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.3)',
                    width: '100%'
                  }}
                >
                  {authState.isLoading ? <LoadingSpinner size="sm" /> : 'Register'}
                </Button>
              </div>
            </form>
          )}

          {/* Demo Credentials */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            borderRadius: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
              Demo Credentials
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              <div>Email: demo@finsage.com</div>
              <div>Password: demo123</div>
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

export default Authentication;
