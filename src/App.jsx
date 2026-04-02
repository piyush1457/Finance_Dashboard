import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './components/ui/Button';

class SimpleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-6 text-center">
          <div className="max-w-md w-full p-8 bg-[var(--surface-color)] rounded-3xl border border-rose-500/20 shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Something went wrong</h1>
            <p className="text-[var(--text-muted)] mb-8">
              We encountered an unexpected error while rendering this page.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full btn-primary-glow gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Reload Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <SimpleErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </SimpleErrorBoundary>
  );
}

export default App;
