import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { BackendToggle } from './components/BackendToggle';

const isDevelopment = process.env.NODE_ENV === 'development';
const useLiveServer = localStorage.getItem('USE_LIVE_SERVER') === 'true';

if (useLiveServer) {
  // ONLY Point Axios to the NestJS server if we are NOT using MSW
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
}

async function prepareApp() {
  if (isDevelopment && !useLiveServer) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

prepareApp().then(() => {
  root.render(
    <React.StrictMode>
      <BackendToggle />
      <App />
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
