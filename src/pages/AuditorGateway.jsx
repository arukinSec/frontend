import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuditorGateway() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Flag this as an explicit auditor admin login flow 
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

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Return Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
      >
        <ArrowLeft size={16} />
        <span>Return Home</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
        
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-4">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight leading-tight">Auditor Access</h2>
          <p className="text-slate-400 text-xs mt-2">Sign in using your Google account to manage your connected members.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-2.5 rounded-xl flex items-start gap-2 mb-6 animate-shake">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 cursor-pointer"
        >
          <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
          {!loading && <ArrowRight size={16} />}
        </button>

        <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
          <div className="flex gap-3 text-left">
            <span className="text-slate-500 text-xs font-semibold shrink-0">01.</span>
            <p className="text-[11px] text-slate-400 leading-normal">
              Access requests only require standard non-sensitive profile permissions.
            </p>
          </div>
          <div className="flex gap-3 text-left">
            <span className="text-slate-500 text-xs font-semibold shrink-0">02.</span>
            <p className="text-[11px] text-slate-400 leading-normal">
              Manage threat vectors, logs, and files safely from your compliance roster.
            </p>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] mt-8">
          Arukin Security Portal • Authorized auditors only
        </p>
      </div>
    </div>
  );
}
