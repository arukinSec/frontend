import React, { useState } from 'react';
import { ShieldAlert, Zap, Heart, Trash2, Mailbox, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function UseCases() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">How it works</Link>
            <Link to="/use-cases" className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">Use Cases</Link>
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
            <Link to="/" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/how-it-works" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
            <Link to="/use-cases" className="block text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Use Cases</Link>
            <Link to="/about" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 text-center">Who is Arukin For?</h1>
        <p className="text-slate-600 text-lg leading-relaxed mb-16 text-center max-w-2xl mx-auto">
          While Arukin was originally engineered as a compliance and security auditing engine, its powerful API integrations make it the ultimate power tool for a wide variety of users.
        </p>

        <div className="space-y-8">
          
          {/* Use Case 1: Power User */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-500/30">
              <Zap size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">The Power User: Unified Dashboard</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Tired of switching Google profiles in your browser just to check an inbox? Anyone with multiple Google accounts can use Arukin as a personal command center.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-emerald-600" /> Connect your personal, work, side-hustle, and spam accounts to a single dashboard.</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-emerald-600" /> Search emails, preview Drive files, and manage contacts across all profiles without ever logging in and out.</li>
              </ul>
            </div>
          </div>

          {/* Use Case 2: Privacy Advocate */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-500/30">
              <Trash2 size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">The Privacy Advocate: Inbox Zero & Cloud Cleanse</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Want to clean up your own digital life? Use Arukin’s bulk tools to get your accounts organized.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-emerald-600" /> Use the <strong>Batch Threat Cleaner</strong> to instantly delete or trash entire thousands of spam emails at once.</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-emerald-600" /> Clear out your entire email history in seconds.</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-emerald-600" /> Detect and revoke rogue third-party applications secretly accessing your data.</li>
              </ul>
            </div>
          </div>

          {/* Use Case 3: Guardian */}
          <div className="bg-gradient-to-r from-teal-500/10 to-transparent border border-teal-500/20 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-teal-600 shrink-0 border border-purple-500/30">
              <Heart size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">The Guardian: Family Protection</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Built to give you the tools you need to protect vulnerable or elderly relatives from online scams and financial fraud.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-teal-600" /> Find and remove scam emails before your family members accidentally click on them.</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-teal-600" /> Keep their passwords safe. You get access to help them, but you never need to ask for their login details.</li>
              </ul>
            </div>
          </div>

          {/* Use Case 4: Ops Manager (Roadmap) */}
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="h-14 w-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600 shrink-0 border border-amber-500/30">
              <Mailbox size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-2xl font-bold text-slate-900">The Operations Hub</h3>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-full">Roadmap</span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Arukin is evolving into an automated communications and relay hub, adding massive value for small teams and power users.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-600" /> <strong>Batch Email Sender:</strong> Dispatch scheduled newsletters, alerts, or RSVPs from any connected account.</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-600" /> <strong>OTP Interception & Relays:</strong> Forward time-sensitive 2FA verification codes to your dashboard instantly.</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-600" /> <strong>Email Forwarding:</strong> Automatically route important threads from connected members to a central address.</li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
