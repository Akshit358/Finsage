import React from 'react';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Simple Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          FinSage Enterprise
        </h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <a href="/dashboard" style={{ color: '#6b7280', textDecoration: 'none' }}>Dashboard</a>
          <a href="/portfolio" style={{ color: '#6b7280', textDecoration: 'none' }}>Portfolio</a>
          <a href="/predictions" style={{ color: '#6b7280', textDecoration: 'none' }}>Predictions</a>
          <a href="/analytics" style={{ color: '#6b7280', textDecoration: 'none' }}>Analytics</a>
        </nav>
      </header>
      
      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;