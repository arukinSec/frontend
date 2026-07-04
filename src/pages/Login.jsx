import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldAlert, ArrowRight, Mail, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReviewerLogin, setShowReviewerLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (err) {
      console.error(err);
      setError('Failed to initiate Google sign-in: ' + err.message);
      setLoading(false);
    }
  };

  const handleReviewerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // If successful, redirect to dashboard manually since we aren't using OAuth redirect
      if (data.session) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid reviewer credentials: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 font-sans relative">
      
      {/* Top Header Toggle for Reviewers */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={() => setShowReviewerLogin(!showReviewerLogin)}
          className="text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors"
        >
          {showReviewerLogin ? 'Return to Standard Login' : 'Reviewer Login'}
        </button>
      </div>

      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img src="/arukin-logo.webp" className="h-8 w-8 object-contain rounded-md shadow-sm" alt="ArukinSec Logo" />
          <h1 className="text-2xl font-bold text-white tracking-wide">ArukinSec <span className="text-slate-500 font-medium">Admin Portal</span></h1>
          <p className="text-slate-400 text-sm mt-2">Restricted Access. Authorized Managers only.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="space-y-6">
            
            <div className="text-center">
              <p className="text-slate-300 text-sm">
                {showReviewerLogin 
                  ? 'Access the portal using your authorized reviewer credentials.'
                  : 'Log in to access your dashboard, monitor connected members, and manage credentials.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {showReviewerLogin ? (
              <form onSubmit={handleReviewerLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Reviewer Email" 
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password" 
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 mt-2 cursor-pointer"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign in as Reviewer'}</span>
                </button>
              </form>
            ) : (
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 cursor-pointer"
              >
                <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
                {!loading && <ArrowRight size={18} />}
              </button>
            )}

          </div>
        </div>
        
        <p className="text-center text-slate-600 text-xs mt-8">
          This system monitors and manages highly sensitive data endpoints.<br/>
          All login attempts are logged and audited.
        </p>

      </div>
    </div>
  );
}
