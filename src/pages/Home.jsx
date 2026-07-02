import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldAlert, ArrowRight, ShieldCheck, Landmark, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Home({ session }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If a session is already present, immediately redirect to dashboard
  React.useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Public Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldAlert size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide text-slate-900">Arukin <span className="text-emerald-600 font-medium hidden sm:inline">Security Console</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">Home</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">How it works</Link>
            <Link to="/use-cases" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Use Cases</Link>
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Pricing</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-50 border-b border-slate-200 px-6 py-4 space-y-4 shadow-2xl animate-fade-in">
            <Link to="/" className="block text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/how-it-works" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
            <Link to="/use-cases" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Use Cases</Link>
            <Link to="/about" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

      {/* Main Hero Container */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Pitch */}
          <div className="lg:col-span-7 space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Digital Safety Auditing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
              Verify Digital Trust & <span className="text-emerald-600">Neutralize Phishing</span>
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
              Auditable safety dashboards built for compliance. Scan emails for malware, inspect folder directory changes, and secure critical communications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-600/10 border border-indigo-500/10 flex items-center justify-center shrink-0 text-emerald-600">
                  <Landmark size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Strict Role Obfuscation</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Auditors check permissions using public 6-digit access tokens, isolating credentials completely.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-teal-600/10 border border-purple-500/10 flex items-center justify-center shrink-0 text-teal-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Auditable Data Vault</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Review file directories, logs, and account settings safely through secure API relays.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login / Action Portal */}
          <div className="lg:col-span-5 flex flex-col gap-4 animate-fade-in order-1 lg:order-2">
            
            {/* Auditor Card (Dark Contrast Card) */}
            <div className="bg-slate-900 shadow-sm border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute -inset-px bg-gradient-to-tr from-emerald-500/0 via-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
              <h2 className="text-lg font-bold text-white mb-1">Auditor Access</h2>
              <p className="text-slate-400 text-xs mb-4">Sign in using your Google account to manage your connected members.</p>

               {session ? (
                <Link 
                  to="/dashboard"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 text-center relative z-10"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <Link 
                  to="/auditor"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/25 text-center relative z-10 block"
                >
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </Link>
              )}

              <p className="text-center text-slate-500 text-[9px] mt-3 leading-relaxed relative z-10">
                Authorized auditors only. Standard non-sensitive profile scopes requested.
              </p>
            </div>

            {/* Client Card */}
            <div className="bg-white shadow-sm border border-emerald-500/10 rounded-2xl p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute -inset-px bg-gradient-to-tr from-emerald-500/0 via-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
              
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span>Member Connection</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </h2>
              <p className="text-slate-600 text-xs mb-4">Received an Auditor Auth ID? Link your account to authorize threat protection.</p>

              <Link 
                to="/client"
                className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all border border-emerald-500/20 text-center"
              >
                <span>Connect Account</span>
                <ArrowRight size={14} />
              </Link>

              <p className="text-center text-slate-500 text-[9px] mt-3 leading-relaxed">
                Requires advanced access scopes for Gmail and Google Drive. You can withdraw access at any time.
              </p>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
