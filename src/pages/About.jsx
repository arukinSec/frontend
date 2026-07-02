import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, ShieldCheck, Heart, Users, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function About() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans flex flex-col">
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
            <Link to="/about" className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Pricing</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0A0A0B] border-b border-white/10 px-6 py-4 space-y-4 shadow-2xl animate-fade-in">
            <Link to="/" className="block text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/how-it-works" className="block text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
            <Link to="/about" className="block text-sm font-semibold text-white hover:text-indigo-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Our Mission</h1>
        
        {/* Prototype Banner */}
        <div className="mb-10 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
          <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-amber-400 font-bold text-xs mb-1 uppercase tracking-wider">Experimental Prototype Notice</h4>
            <p className="text-amber-500/80 text-xs leading-relaxed">
              Arukin is currently in a highly experimental R&D beta phase. None of the features listed on this platform are fixed. We are actively testing which features are used, requested, and which ones can be removed. Our roadmap is fluid and subject to major architectural pivots.
            </p>
          </div>
        </div>

        <p className="text-slate-400 text-lg leading-relaxed mb-12">
          Legitimate security auditing tools are usually designed exclusively for enterprises with large IT budgets. Meanwhile, scammers exploit these same cloud APIs to target vulnerable family members. Arukin bridges this gap by providing consumers with standard-grade tools to safeguard their families.
        </p>

        <div className="space-y-12">
          {/* Core Philosophy 1 */}
          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Neutralizing Digital Phishing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We analyze key metadata alerts and system logs to identify scam signatures, helping guardians inspect inbox anomalies before they escalate.
              </p>
            </div>
          </div>

          {/* Core Philosophy 2 */}
          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Dual Identity & Data Privacy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We believe in absolute role separation. Auditors logging into Arukin Admin only provide basic identity scopes. Sensitive tokens are isolated inside separate client connections. This keeps data protected, compliant, and easy to manage without overlapping permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 border-t border-white/10"></div>

        {/* The Manifesto / Roadmap */}
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">Trust & Safety Roadmap</h2>
        <p className="text-slate-400 text-base leading-relaxed mb-10">
          Arukin is built as a compliance engine. As we actively develop this platform, we are prioritizing rigorous security frameworks over rapid expansion. Below is our ongoing roadmap for ensuring ethical usage:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Roadmap 1: CASA & Decentralization */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-2">Decentralizing Data Audits</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              We refuse to centralize your family's data honeypot. To protect privacy without submitting to centralized third-party Google CASA audits, we rely on the <strong>Google Cloud 100-user Sandbox limit</strong>. By deploying custom Self-Hosted enterprise nodes, our users retain total ownership of their API connections and bypass the need for a corporate middleman.
            </p>
          </div>

          {/* Roadmap 2: 24h Cooldown */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-2">24-Hour Connection Cooldowns</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              We build tools to stop hackers, not empower them. Soon, Arukin will enforce a mandatory <strong>24-hour verification cooldown</strong> on all new Auditor pairings. Even if an Auth ID is accepted, data synchronization will be artificially delayed to ensure members have ample time to verify and consent to the connection.
            </p>
          </div>

          {/* Roadmap 3: OTP Interception */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-2">Secure OTP Relay</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              To assist vulnerable or elderly relatives who struggle with Two-Factor Authentication, our upcoming update will allow Auditors to instantly intercept and relay time-sensitive OTP codes (e.g., from bank alerts) straight to their dashboard, avoiding risky forwarding workflows.
            </p>
          </div>

          {/* Roadmap 4: Automated Audit Reports */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-2">Automated Threat Reports</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Rather than manually hunting for phishing, Arukin will soon run automated, background API queries to compile PDF threat reports. It will automatically sniff out connected social accounts, suspicious password resets, and unusual logins spanning the last 12 months.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
