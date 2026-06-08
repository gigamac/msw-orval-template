import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Or 'react-query' depending on version
import Dashboard from './components/Dashboard';
import './App.css';

// Create a stable client instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Dashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;