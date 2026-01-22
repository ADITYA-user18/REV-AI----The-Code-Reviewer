import React from 'react';
import { FaGithub, FaRobot } from 'react-icons/fa';
import Particles from '../components/Particles';

const Login = () => {
  const handleLogin = () => {
    // 1. Get Client ID from Env
    const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
    
    // 2. Define where GitHub should send the user back
    const REDIRECT_URI = `${window.location.origin}/auth/callback`;

    // 3. Redirect to GitHub Auth Page
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,read:user&redirect_uri=${REDIRECT_URI}`;
  };

  return (
    <div className="relative min-h-screen bg-github-dark font-mono text-gray-300 overflow-hidden selection:bg-neon-purple selection:text-white flex items-center justify-center p-4">
      
      {/* --- 0. BACKGROUND PARTICLES LAYER --- */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Particles
          particleColors={['#8957e5', '#58a6ff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Glowing Orbs (Kept for extra depth behind the card) */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
            <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-neon-purple opacity-20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-50px] right-[-50px] w-96 h-96 bg-neon-blue opacity-10 blur-[100px] rounded-full"></div>
        </div>

        {/* Main Card */}
        <div className="relative z-10 bg-github-card/80 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full text-center backdrop-blur-md">
          
          {/* Logo / Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gray-900/50 rounded-full border border-neon-purple shadow-[0_0_15px_rgba(137,87,229,0.5)] backdrop-blur-sm">
              <FaRobot className="text-4xl text-neon-purple" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            AI Code <span className="text-neon-purple">Reviewer</span>
          </h1>
          <p className="text-gray-400 mb-8 text-sm">
            Your personal AI agent for automated code analysis and security checks.
          </p>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-500 hover:shadow-[0_0_20px_rgba(88,166,255,0.2)] group"
          >
            <FaGithub className="text-xl group-hover:scale-110 transition-transform" />
            <span>Sign in with GitHub</span>
          </button>

          {/* Footer */}
          <div className="mt-6 text-xs text-gray-500">
            By signing in, you agree to our <span className="underline cursor-pointer hover:text-neon-blue transition-colors">Terms of Service</span>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;