import React from 'react';
import { supabase } from '../supabaseClient';
import { ShieldAlert, ArrowRight, ShieldCheck, Landmark, Mail, FileText, UserCheck, Bell, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import MarketingNavbar from '../components/MarketingNavbar';

export default function Home({ session }) {
  const navigate = useNavigate();

  // If a session is already present, immediately redirect to dashboard
  React.useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <MarketingNavbar />

      {/* Main Hero Container */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Column 1: Pitch (First on both mobile and desktop) */}
          <div className="lg:col-span-7 space-y-6 text-left order-1">
            {/* Mobile-Only Gateway Portals (appears at the absolute top of the page on mobile) */}
            <div className="block lg:hidden space-y-4 pb-2">
              {/* Client Card */}
              <div className="bg-white shadow-md border border-slate-200 rounded-2xl p-5 text-left relative overflow-hidden group">
                <span className="text-[9px] font-bold tracking-wider text-indigo-600 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"> Member Pairing </span>
                <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">Connect Account</h3>
                <p className="text-slate-500 text-xxs leading-relaxed mb-4">Link your Google account using the code from your manager to activate scans.</p>
                <Link to="/client" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-center">
                  <span>Link Google Account</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {/* Manager Card */}
              <div className="bg-slate-900 shadow-md border border-slate-800 rounded-2xl p-5 text-left relative overflow-hidden group text-white">
                <span className="text-[9px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"> Caregiver Portal </span>
                <h3 className="text-base font-bold text-white mt-2 mb-1">Manager Console</h3>
                <p className="text-slate-400 text-xxs leading-relaxed mb-4">Configure scans and view alert dashboards for devices under your oversight.</p>
                <Link to={session ? "/dashboard" : "/manager"} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-center">
                  <span>{session ? 'Go to Dashboard' : 'Sign in as Manager'}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

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

          {/* Column 2: Interactive Mockup Dashboard (Desktop only in Hero) */}
          <div className="hidden lg:block lg:col-span-5 order-2">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              {/* Background glows */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/10 blur-2xl rounded-full"></div>
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Security Scan</span>
                </div>
                <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <Bell size={12} />
                </div>
              </div>

              {/* Threat Overview Badge */}
              <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-emerald-400" size={24} />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">All Systems Protected</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 suspicious files isolated in the last 24h.</p>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl text-center">
                  <Mail size={16} className="text-indigo-400 mx-auto mb-1.5" />
                  <span className="block text-xs font-black text-white">1,489</span>
                  <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Emails</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl text-center">
                  <FileText size={16} className="text-amber-400 mx-auto mb-1.5" />
                  <span className="block text-xs font-black text-white">38</span>
                  <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Drive Files</span>
                </div>
                <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl text-center">
                  <UserCheck size={16} className="text-teal-400 mx-auto mb-1.5" />
                  <span className="block text-xs font-black text-white">89</span>
                  <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Contacts</span>
                </div>
              </div>

              {/* Scanned Alerts Feed */}
              <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Live Scanned Feeds</h5>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="text-rose-400 shrink-0" size={14} />
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-white leading-none">Suspicious Payment Link</p>
                      <p className="text-[8px] text-slate-400 mt-1">Gmail Scanner isolated threat thread</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-rose-400 uppercase bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Blocked</span>
                </div>

                <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <div className="flex items-center gap-2.5">
                    <FileText className="text-amber-400 shrink-0" size={14} />
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-white leading-none">Tax_Return_2026.pdf</p>
                      <p className="text-[8px] text-slate-400 mt-1">Drive folder shared publicly</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Restricted</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Portal Access Hub Section (Coherent Gateway Entry - Desktop Only below hero) */}
        <div className="hidden lg:block mt-28 py-16 border-t border-slate-200 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 mb-3">
              Access Portals
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Launch ArukinSec Gateway</h2>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              Choose the portal based on your action. Managers coordinate security, while family members pair their accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
            {/* Client Portal Entry Card */}
            <div className="bg-white shadow-xl border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover:border-indigo-500/30 transition-all text-left relative overflow-hidden group">
              <div className="absolute -inset-px bg-gradient-to-tr from-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20"> Member Pairing </span>
                <h3 className="text-xl font-bold text-slate-900 mt-4 mb-2">Connect Account</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">
                  Received a pairing code or invitation link from your manager? Connect your Google account here to activate real-time scanning.
                </p>
              </div>
              <Link 
                to="/client"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-900/20 text-center"
              >
                <span>Link Google Account</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Manager Portal Entry Card */}
            <div className="bg-slate-900 shadow-xl border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-emerald-500/30 transition-all text-left relative overflow-hidden group">
              <div className="absolute -inset-px bg-gradient-to-tr from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20"> Caregiver Portal </span>
                <h3 className="text-xl font-bold text-white mt-4 mb-2">Manager Console</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Log in to configure scans, view alert dashboards, and secure connected devices for family members under your oversight.
                </p>
              </div>
              <Link 
                to={session ? "/dashboard" : "/manager"}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/25 text-center"
              >
                <span>{session ? 'Go to Dashboard' : 'Sign in as Manager'}</span>
                <ArrowRight size={14} />
              </Link>
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
