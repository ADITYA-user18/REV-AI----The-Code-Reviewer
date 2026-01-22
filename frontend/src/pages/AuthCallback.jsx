import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const code = searchParams.get('code');

  // Load API URL from environment
  const API_URL = import.meta.env.VITE_API_URL; 

  useEffect(() => {
    const authenticate = async () => {
      if (!code) return navigate('/');

      try {
        // Use the variable instead of hardcoded string
        const res = await axios.post(`${API_URL}/api/auth/github`, { code });
        
        login(res.data);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login Failed', error);
        navigate('/');
      }
    };

    authenticate();
  }, [code, navigate, login, API_URL]);

  return (
    <div className="min-h-screen bg-github-dark flex flex-col items-center justify-center text-white">
      <FaSpinner className="text-4xl text-neon-purple animate-spin mb-4" />
      <h2 className="text-xl">Authenticating...</h2>
    </div>
  );
};

export default AuthCallback;