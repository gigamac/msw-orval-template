// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

async function prepareApp() {
  // Only start mocks during local development
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./mocks/browser');
    
    // Start the worker and wait until it is active
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about assets or styles
    });
  }
}

prepareApp().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});