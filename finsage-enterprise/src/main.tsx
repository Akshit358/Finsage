import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log('Starting React app...');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    console.log('Creating React root...');
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('React app rendered successfully!');
  } catch (error) {
    console.error('Error rendering React app:', error);
  }
} else {
  console.error('Root element not found!');
}