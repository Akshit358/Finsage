import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-01',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    profileImage: null
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
      portfolioUpdates: true,
      marketAlerts: true,
      newsDigest: true,
      securityAlerts: true
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true,
      marketing: false
    },
    trading: {
      defaultOrderType: 'market',
      confirmOrders: true,
      stopLoss: true,
      takeProfit: false,
      riskManagement: true
    }
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    biometricLogin: false,
    sessionTimeout: 30,
    loginNotifications: true,
    deviceManagement: true
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load user settings from localStorage or API
    const savedProfile = localStorage.getItem('userProfile');
    const savedPreferences = localStorage.getItem('userPreferences');
    const savedSecurity = localStorage.getItem('securitySettings');

    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    if (savedPreferences) setPreferences(JSON.parse(savedPreferences));
    if (savedSecurity) setSecurity(JSON.parse(savedSecurity));
  }, []);

  const saveSettings = () => {
    setLoading(true);
    setSaved(false);
    
    // Simulate saving to backend
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      localStorage.setItem('securitySettings', JSON.stringify(security));
      
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleProfileChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUserProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setUserProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePreferenceChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setPreferences(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSecurityChange = (field: string, value: any) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🛡️' },
    { id: 'billing', name: 'Billing', icon: '💳' }
  ];

  const ProfileTab = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
        Personal Information
      </h2>
      
      {/* Profile Image */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Profile Picture
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            👤
          </div>
          <button style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Change Photo
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            First Name
          </label>
          <input
            type="text"
            value={userProfile.firstName}
            onChange={(e) => handleProfileChange('firstName', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Last Name
          </label>
          <input
            type="text"
            value={userProfile.lastName}
            onChange={(e) => handleProfileChange('lastName', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Email
          </label>
          <input
            type="email"
            value={userProfile.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Phone
          </label>
          <input
            type="tel"
            value={userProfile.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Date of Birth
          </label>
          <input
            type="date"
            value={userProfile.dateOfBirth}
            onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      {/* Address */}
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
        Address
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Street Address
          </label>
          <input
            type="text"
            value={userProfile.address.street}
            onChange={(e) => handleProfileChange('address.street', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            City
          </label>
          <input
            type="text"
            value={userProfile.address.city}
            onChange={(e) => handleProfileChange('address.city', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            State
          </label>
          <input
            type="text"
            value={userProfile.address.state}
            onChange={(e) => handleProfileChange('address.state', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            ZIP Code
          </label>
          <input
            type="text"
            value={userProfile.address.zipCode}
            onChange={(e) => handleProfileChange('address.zipCode', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Country
          </label>
          <select
            value={userProfile.address.country}
            onChange={(e) => handleProfileChange('address.country', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
          </select>
        </div>
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
        Application Preferences
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Theme
          </label>
          <select
            value={preferences.theme}
            onChange={(e) => handlePreferenceChange('theme', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Currency
          </label>
          <select
            value={preferences.currency}
            onChange={(e) => handlePreferenceChange('currency', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Timezone
          </label>
          <select
            value={preferences.timezone}
            onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => handlePreferenceChange('language', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
      </div>

      {/* Trading Preferences */}
      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
        Trading Preferences
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Default Order Type
          </label>
          <select
            value={preferences.trading.defaultOrderType}
            onChange={(e) => handlePreferenceChange('trading.defaultOrderType', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
            <option value="stop">Stop Order</option>
            <option value="stop-limit">Stop-Limit Order</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={preferences.trading.confirmOrders}
            onChange={(e) => handlePreferenceChange('trading.confirmOrders', e.target.checked)}
            style={{ marginRight: '0.75rem' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
            Require confirmation for all orders
          </span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={preferences.trading.stopLoss}
            onChange={(e) => handlePreferenceChange('trading.stopLoss', e.target.checked)}
            style={{ marginRight: '0.75rem' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
            Enable stop-loss by default
          </span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={preferences.trading.takeProfit}
            onChange={(e) => handlePreferenceChange('trading.takeProfit', e.target.checked)}
            style={{ marginRight: '0.75rem' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
            Enable take-profit by default
          </span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={preferences.trading.riskManagement}
            onChange={(e) => handlePreferenceChange('trading.riskManagement', e.target.checked)}
            style={{ marginRight: '0.75rem' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
            Enable automatic risk management
          </span>
        </label>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
        Security Settings
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
              Two-Factor Authentication
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={security.twoFactorEnabled}
                onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Add an extra layer of security to your account
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
              Biometric Login
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={security.biometricLogin}
                onChange={(e) => handleSecurityChange('biometricLogin', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                {security.biometricLogin ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Use fingerprint or face recognition to log in
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          backgroundColor: '#f8fafc'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
            Session Timeout
          </h3>
          <select
            value={security.sessionTimeout}
            onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={0}>Never</option>
          </select>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Automatically log out after inactivity
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={security.loginNotifications}
            onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
            style={{ marginRight: '0.75rem' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
            Get notified of new login attempts
          </span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={security.deviceManagement}
            onChange={(e) => handleSecurityChange('deviceManagement', e.target.checked)}
            style={{ marginRight: '0.75rem' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
            Enable device management
          </span>
        </label>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
        Notification Preferences
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Notification Channels
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) => handlePreferenceChange('notifications.email', e.target.checked)}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Email notifications
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={(e) => handlePreferenceChange('notifications.push', e.target.checked)}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Push notifications
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.sms}
                onChange={(e) => handlePreferenceChange('notifications.sms', e.target.checked)}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                SMS notifications
              </span>
            </label>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
            Notification Types
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.portfolioUpdates}
                onChange={(e) => handlePreferenceChange('notifications.portfolioUpdates', e.target.checked)}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Portfolio updates
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.marketAlerts}
                onChange={(e) => handlePreferenceChange('notifications.marketAlerts', e.target.checked)}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Market alerts
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.newsDigest}
                onChange={(e) => handlePreferenceChange('notifications.newsDigest', e.target.checked)}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Daily news digest
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications.securityAlerts}
                onChange={(e) => handlePreferenceChange('notifications.securityAlerts', e.target.checked)}
                style={{ marginRight: '0.75rem' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Security alerts
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
        Privacy Settings
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Profile Visibility
          </label>
          <select
            value={preferences.privacy.profileVisibility}
            onChange={(e) => handlePreferenceChange('privacy.profileVisibility', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
          >
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={preferences.privacy.dataSharing}
              onChange={(e) => handlePreferenceChange('privacy.dataSharing', e.target.checked)}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Allow data sharing for research purposes
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={preferences.privacy.analytics}
              onChange={(e) => handlePreferenceChange('privacy.analytics', e.target.checked)}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Enable usage analytics
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={preferences.privacy.marketing}
              onChange={(e) => handlePreferenceChange('privacy.marketing', e.target.checked)}
              style={{ marginRight: '0.75rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Receive marketing communications
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const BillingTab = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
        Billing & Subscription
      </h2>
      
      <div style={{
        backgroundColor: '#f8fafc',
        borderRadius: '0.5rem',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
          Billing Management
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Manage your subscription and payment methods
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            View Billing History
          </button>
          <button style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Update Payment Method
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          Current Plan
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
              FinSage Pro
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              $29.99/month
            </div>
          </div>
          <button style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Settings
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: 'fit-content'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#eff6ff' : 'transparent',
                  color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textAlign: 'left'
                }}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem'
          }}>
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'preferences' && <PreferencesTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'privacy' && <PrivacyTab />}
            {activeTab === 'billing' && <BillingTab />}
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {saved && (
                <span style={{ color: '#059669', fontSize: '0.875rem', fontWeight: '500' }}>
                  ✅ Settings saved successfully
                </span>
              )}
            </div>
            <button
              onClick={saveSettings}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #f3f3f3',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;