import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldAlert, ArrowRight, ArrowLeft, Mail, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ManagerGateway() {
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
      // Flag this as an explicit manager admin login flow 
      localStorage.setItem('admin_session', 'true');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });

      if (error) throw error;
    } catch (err) {
      localStorage.removeItem('admin_session');
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
      localStorage.setItem('admin_session', 'true');
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
      localStorage.removeItem('admin_session');
      console.error(err);
      setError('Invalid reviewer credentials: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Return Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center justify-center border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 p-2.5 rounded-full text-slate-300 hover:text-white transition-all z-20 shadow-sm"
        title="Return Home"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Top Header Toggle for Reviewers */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={() => setShowReviewerLogin(!showReviewerLogin)}
          className="group flex items-center justify-center gap-0 hover:gap-2 border border-gold/20 hover:border-gold/45 bg-gold/5 hover:bg-gold/10 h-10 px-3 rounded-full text-gold hover:text-white transition-all duration-300 ease-in-out shadow-sm max-w-[40px] hover:max-w-[160px] overflow-hidden cursor-pointer"
          title={showReviewerLogin ? 'Standard Login' : 'Reviewer Portal'}
        >
          <Key size={16} className="shrink-0" />
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[120px]">
            {showReviewerLogin ? 'Standard Login' : 'Reviewer Portal'}
          </span>
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative z-10 text-slate-200 min-h-[475px] flex flex-col justify-between">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <img src="/arukin-logo.webp" className="h-8 w-8 object-contain rounded-md shadow-sm mx-auto" alt="ArukinSec Logo" />
          <h2 className="text-2xl font-black text-white tracking-tight leading-tight mt-4">Manager Access</h2>
          <p className="text-slate-400 text-xs mt-2">
            {showReviewerLogin 
              ? 'Access the portal using your authorized reviewer credentials.'
              : 'Sign in using your Google account to manage your connected members.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/35 text-red-300 text-xs px-3.5 py-2.5 rounded-xl flex items-start gap-2 mb-6 animate-shake">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {showReviewerLogin ? (
          <form onSubmit={handleReviewerLogin} className="space-y-4">
            {/* Restricted Banner */}
            <div className="bg-red-500/10 border border-red-500/25 text-red-300 rounded-xl p-3.5 text-xs flex items-start gap-2.5 mb-4 leading-relaxed">
              <ShieldAlert size={16} className="mt-0.5 shrink-0 text-red-400" />
              <div>
                <strong className="block text-red-400 font-bold mb-0.5">Restricted Access Path</strong>
                This path is strictly reserved for authorized security compliance auditors and third-party reviewers. Managers must authenticate via Google.
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Reviewer Email" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-soft placeholder-slate-500" 
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-soft placeholder-slate-500" 
                />
              </div>
            </div>
             <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#991b1b] hover:bg-[#7f181d] text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20 mt-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Authenticate Reviewer Session'}</span>
            </button>
          </form>
        ) : (
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-emerald-brand hover:bg-[#124238] text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/20 cursor-pointer"
          >
            <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        )}
        {!showReviewerLogin && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
            <div className="flex gap-3 text-left">
              <span className="text-gold font-semibold shrink-0 text-xs">01.</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Access requests only require standard non-sensitive profile permissions.
              </p>
            </div>
            <div className="flex gap-3 text-left">
              <span className="text-gold font-semibold shrink-0 text-xs">02.</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Manage threat vectors, logs, and files safely from your compliance roster.
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-slate-500 text-[10px] mt-8">
          ArukinSec Security Portal • Authorized Managers only
        </p>
      </div>
    </div>
  );
}
