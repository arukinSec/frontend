import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, Server, Mail, Menu, X as XIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';

export default function Pricing() {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [proCount, setProCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProCount = async () => {
      const { count, error } = await supabase
        .from('auditors')
        .select('*', { count: 'exact', head: true })
        .eq('tier', 'PRO');
      if (!error && count !== null) {
        setProCount(count);
      }
    };
    fetchProCount();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans flex flex-col relative">
      {/* Public Navbar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldAlert size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide text-white">Arukin <span className="text-indigo-400 font-medium hidden sm:inline">Security Console</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">How it works</Link>
            <Link to="/about" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">Pricing</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0A0A0B] border-b border-white/10 px-6 py-4 space-y-4 shadow-2xl animate-fade-in">
            <Link to="/" className="block text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/how-it-works" className="block text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
            <Link to="/about" className="block text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-white hover:text-indigo-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-16 animate-fade-in flex flex-col items-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3 animate-pulse">
          ⚡ Public Beta - Early Bird Access
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 text-center font-sans">Flexible Compliance Plans</h1>
        <p className="text-slate-400 text-sm max-w-lg text-center mb-16">
          Access read-only scans for free, or lock in discounted early bird pricing on our hosted cloud and self-hosted versions during beta.
        </p>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16 items-stretch">
          
          {/* Card 1: Free Tier */}
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-800 transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase bg-white/5 px-2.5 py-1 rounded-full">Basic Audit</span>
              <div className="flex items-baseline gap-1 mt-4 mb-6">
                <span className="text-4xl font-bold text-white">₹0</span>
                <span className="text-xs text-slate-500">Free forever</span>
              </div>
              
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Read-only Inbox & Sent</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> View Drive files list</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> View Contact names</li>
                <li className="flex items-center gap-2 text-slate-500"><X size={16} className="text-red-400/50" /> No active actions (Delete/Compose)</li>
                <li className="flex items-center gap-2 text-slate-500"><X size={16} className="text-red-400/50" /> No file previews or downloads</li>
              </ul>
            </div>

            <div>
              <Link to="/auditor" className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-lg text-center text-sm transition-colors border border-white/5 block">
                Start Free Scan
              </Link>
              <span className="block text-center text-[10px] text-slate-500 mt-3">* Limit: 1 connected member. Terms apply.</span>
            </div>
          </div>

          {/* Card 2: Hosted Pro Annual */}
          <div className="bg-gradient-to-b from-indigo-500/5 to-purple-500/5 border border-indigo-500/30 rounded-2xl p-8 flex flex-col justify-between hover:border-indigo-500/50 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-bl-lg uppercase">
              Best Value
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">Annual Pro</span>
                <span className="text-[9px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Domain Drive</span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-bold text-white">₹{proCount < 10 ? '1,280' : '7,890'}</span>
                <span className="text-xs text-slate-500">/year</span>
                {proCount < 10 && <span className="text-xs line-through text-slate-600 font-bold ml-1">₹7,890</span>}
              </div>
              <p className="text-[10px] text-indigo-400 font-semibold mt-1">One-time payment for 1-year access. No auto-renewal, no commitment.</p>

              {/* Progress bar */}
              <div className="mt-4 mb-6 bg-white/[0.03] border border-white/5 p-3 rounded-xl">
                <div className="flex justify-between text-[10px] font-semibold mb-1.5">
                  <span className="text-indigo-400">Launch Promo (First 10 Seats)</span>
                  <span className="text-slate-300">{Math.min(10, proCount)} / 10 seats claimed</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 h-1.5 rounded-full" style={{ width: `${Math.min(100, (proCount / 10) * 100)}%` }}></div>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 leading-relaxed">Price reverts to standard ₹7,890/year once slots fill.</p>
              </div>
              
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-2"><Check size={16} className="text-purple-400" /> Active operations (Delete, Compose)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-purple-400" /> File previews & downloads</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-purple-400" /> Unlock social feed monitors</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-purple-400" /> View full Contact details</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-purple-400" /> We host the compliance backend</li>
              </ul>
            </div>

            <div>
              <Link 
                to="/auditor" 
                onClick={() => localStorage.setItem('arukin_trigger_upgrade_on_login', 'true')}
                className="w-full mt-8 bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-lg text-center text-sm transition-colors shadow-lg shadow-purple-500/25 block"
              >
                Unlock Annual Plan
              </Link>
              <span className="block text-center text-[10px] text-slate-400 mt-3">* Includes 3 members. Additional slots: +₹1,200/year per member.</span>
            </div>
          </div>

        </div>

        {/* Self-Hosted Callout Section (Below the grid) */}
        <div className="w-full max-w-6xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-1">
              <Server size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">Need absolute database isolation?</h3>
                <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Beta Onboarding</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                <strong>Self-Hosted Enterprise Pass (₹28,600 one-time):</strong> Run the platform on your own cloud database. Includes a lifetime usage license and setup assistance. <strong>Only 5 setup slots remaining</strong> for early bird onboarding. Google sandbox unverified app limits (max 100 member accounts) apply.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowInquiryModal(true)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-semibold transition-colors shrink-0 cursor-pointer"
          >
            Request Self-Hosted Setup
          </button>
        </div>
      </main>

      {/* Inquiry Form Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0E0E10] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Self-Hosted Setup Request</h3>
                <p className="text-slate-400 text-xs mt-1">Send us an email and we'll get back to you within 24 hours.</p>
              </div>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="text-slate-400 hover:text-white transition-colors font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                Include the following in your email:
              </p>
              <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside">
                <li>Your contact email</li>
                <li>Preferred hosting environment (AWS, GCP, VPS, etc.)</li>
                <li>Scope &amp; purpose of your deployment</li>
              </ul>
              <a
                href="mailto:support@arukin.app?subject=Self-Hosted%20Setup%20Request&body=Hi%2C%0A%0AI%20am%20interested%20in%20the%20Arukin%20Self-Hosted%20Enterprise%20Pass.%0A%0AHosting%20environment%3A%20%0APurpose%3A%20"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <Mail size={16} /> Open Email Client
              </a>
              <p className="text-center text-[10px] text-slate-600">Opens your default email app with a pre-filled template.</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
