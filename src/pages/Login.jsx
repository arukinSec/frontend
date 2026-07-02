import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-4">
            <ShieldAlert size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Arukin <span className="text-slate-500 font-medium">Admin Portal</span></h1>
          <p className="text-slate-400 text-sm mt-2">Restricted Access. Authorized Auditors only.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-slate-300 text-sm">
                Log in to access your dashboard, monitor connected members, and manage credentials.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              <span>{loading ? 'Connecting...' : 'Sign in with Google'}</span>
              {!loading && <ArrowRight size={18} />}
            </button>
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
