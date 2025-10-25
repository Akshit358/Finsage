import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import Portfolio from './pages/Portfolio';
import Analytics from './pages/Analytics';
import RoboAdvisor from './pages/RoboAdvisor';
import Sentiment from './pages/Sentiment';
import Blockchain from './pages/Blockchain';
import Settings from './pages/Settings';
import ChartDemo from './pages/ChartDemo';
import AIAgent from './pages/AIAgent';
import ModernAIAgent from './pages/ModernAIAgent';
import MLAnalytics from './pages/MLAnalytics';
import AIDemo from './pages/AIDemo';
import './index.css';

// Simple test component to debug
const TestPage = () => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif'
  }}>
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: '1rem'
      }}>
        🎉 FinSage Enterprise
      </h1>
      <p style={{
        fontSize: '1.5rem',
        color: '#6b7280',
        marginBottom: '2rem'
      }}>
        Financial Intelligence Platform
      </p>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#111827'
        }}>
          ✅ Application Status
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: '#059669',
          marginBottom: '1rem'
        }}>
          React + TypeScript + Vite is working perfectly!
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '2rem'
        }}>
          <a href="/dashboard" style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Go to Dashboard
          </a>
          <a href="/predictions" style={{
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            AI Predictions
          </a>
          <a href="/portfolio" style={{
            backgroundColor: 'transparent',
            color: '#2563eb',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #2563eb',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Portfolio
          </a>
          <a href="/charts" style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            📊 Dynamic Charts
          </a>
              <a href="/ai-agent" style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                🤖 AI Agent
              </a>
              <a href="/modern-ai-agent" style={{
                backgroundColor: '#ec4899',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                ✨ Modern AI Agent
              </a>
          <a href="/ml-analytics" style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            🧠 ML Analytics
          </a>
          <a href="/ai-demo" style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            🤖 AI Demo
          </a>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          <Routes>
            <Route path="/" element={<TestPage />} />
            <Route path="/app" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="predictions" element={<Predictions />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="robo-advisor" element={<RoboAdvisor />} />
              <Route path="sentiment" element={<Sentiment />} />
              <Route path="blockchain" element={<Blockchain />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/predictions" element={<Layout><Predictions /></Layout>} />
            <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
            <Route path="/robo-advisor" element={<Layout><RoboAdvisor /></Layout>} />
            <Route path="/sentiment" element={<Layout><Sentiment /></Layout>} />
            <Route path="/blockchain" element={<Layout><Blockchain /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="/charts" element={<Layout><ChartDemo /></Layout>} />
                <Route path="/ai-agent" element={<Layout><AIAgent /></Layout>} />
                <Route path="/modern-ai-agent" element={<ModernAIAgent />} />
            <Route path="/ml-analytics" element={<Layout><MLAnalytics /></Layout>} />
            <Route path="/ai-demo" element={<Layout><AIDemo /></Layout>} />
          </Routes>
      </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;