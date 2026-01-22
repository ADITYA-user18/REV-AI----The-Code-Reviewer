import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import { useAuth, AuthProvider } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="bg-github-dark min-h-screen text-white font-mono">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#161b22',
              color: '#fff',
              border: '1px solid #30363d',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Private Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

// Wrap with Context in main.jsx, but export App here
export default App;