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
            <img src="/arukin-logo.webp" className="h-8 w-8 object-contain rounded-md shadow-sm" alt="ArukinSec Logo" />
            <span className="font-bold text-lg tracking-wide text-slate-900">ArukinSec</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">Home</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">How it works</Link>
            <Link to="/use-cases" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Use Cases</Link>
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Pricing</Link>
            <a href="https://github.com/arukinSec" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors ml-2" title="Star on GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            </a>
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
              <span>Google Account Oversight</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
              Look After Someone's <span className="text-emerald-600">Digital Life</span>
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
              A simple dashboard for managing the Google accounts of children, elderly parents, or less tech-savvy family members and a powerful oversight tool for public figures, and executives whose online presence needs monitoring.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-600/10 border border-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-600">
                  <Landmark size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">No Passwords Shared</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Connect their accounts using a simple 6-digit code. Their login credentials remain completely private.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-teal-600/10 border border-teal-500/10 flex items-center justify-center shrink-0 text-teal-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Peace of Mind</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Review their inbox for scams, check Drive for suspicious files, and keep their account healthy — all from one place.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login / Action Portal */}
          <div className="lg:col-span-5 flex flex-col gap-4 animate-fade-in order-1 lg:order-2">
            
            {/* Manager Card (Dark Contrast Card) */}
            <div className="bg-slate-900 shadow-sm border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute -inset-px bg-gradient-to-tr from-emerald-500/0 via-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
              <h2 className="text-lg font-bold text-white mb-1">Manager Dashboard</h2>
              <p className="text-slate-400 text-xs mb-4">Sign in to manage and oversee the Google accounts connected to your care.</p>

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
                  to="/manager"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/25 text-center relative z-10 block"
                >
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </Link>
              )}

              <p className="text-center text-slate-500 text-[9px] mt-3 leading-relaxed relative z-10">
                For caregivers and authorized managers. Standard non-sensitive profile scopes requested.
              </p>
            </div>

            {/* Client Card */}
            <div className="bg-white shadow-sm border border-emerald-500/10 rounded-2xl p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute -inset-px bg-gradient-to-tr from-emerald-500/0 via-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
              
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-1.5 relative z-10">
                <span>Member Connection</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </h2>
              <p className="text-slate-600 text-xs mb-4 relative z-10">Received a Connection ID from your manager? Link your account so they can help keep it safe.</p>

              <Link 
                to="/client"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20 text-center relative z-10"
              >
                <span>Connect Account</span>
                <ArrowRight size={14} />
              </Link>

              <p className="text-center text-slate-500 text-[9px] mt-3 leading-relaxed relative z-10">
                Requires advanced access scopes for Gmail and Google Drive. You can withdraw access at any time.
              </p>
            </div>

          </div>

        </div>

        {/* Features Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Everything You Need to Protect Them</h2>
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
              ArukinSec connects securely to Google's APIs through our zero-knowledge backend proxy, giving you a safe window into their digital life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Gmail Scanner</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Review their inbox for phishing scams, fake invoices, and suspicious attachments. Read, archive, or trash malicious threads instantly.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Drive Manager</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Check their Google Drive for publicly shared sensitive documents or suspicious files shared with them by scammers.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Contacts Monitor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Review their contact list to spot suspicious new connections, flagged incomplete profiles, or hidden scammer numbers.
              </p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-32 mb-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-teal-500/20 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Built on Enterprise-Grade Security</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              We never see your family's passwords. Our platform utilizes advanced Web Crypto AES-GCM encryption and a Server-Side API Proxy to ensure data never leaks.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-5 rounded-2xl">
                <h4 className="font-bold text-emerald-400 mb-2">Server-Side Proxy</h4>
                <p className="text-sm text-slate-400">Tokens never touch the browser. All requests are routed securely through edge functions.</p>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-5 rounded-2xl">
                <h4 className="font-bold text-teal-400 mb-2">AES-GCM Encryption</h4>
                <p className="text-sm text-slate-400">Cached data is encrypted at rest within IndexedDB, bound uniquely to your active session.</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
