import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Or 'react-query' depending on version
import Dashboard from './components/Dashboard';
import { ScenarioBar } from './components/ScenarioBar';
import './App.css';

// Create a stable client instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <ScenarioBar />
        <Dashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;