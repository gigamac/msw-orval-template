// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const isDevelopment = process.env.NODE_ENV === 'development';

async function prepareApp() {
  // Start mocks strictly during local development
  if (isDevelopment) {
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