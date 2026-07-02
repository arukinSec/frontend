import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, UserPlus, ShieldAlert as AlertIcon, Eye, CheckCircle2, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function HowItWorks() {
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
            <Link to="/how-it-works" className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">How it works</Link>
            <Link to="/use-cases" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Use Cases</Link>
            <Link to="/about" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">About</Link>
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
            <Link to="/how-it-works" className="block text-sm font-semibold text-white hover:text-indigo-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
            <Link to="/use-cases" className="block text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Use Cases</Link>
            <Link to="/about" className="block text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-slate-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 animate-fade-in">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            Step-by-step Setup
          </span>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">How Arukin Works</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            A secure compliance workflow designed to protect users while guaranteeing role separation and absolute privacy consent.
          </p>
        </div>

        {/* Timeline Workflow */}
        <div className="relative border-l border-white/10 ml-6 pl-10 space-y-16">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-[54px] top-0 h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-4 border-[#0A0A0B] flex items-center justify-center text-xs font-bold text-white shadow-lg">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <UserPlus size={18} className="text-indigo-400" />
              Auditor Sign-Up
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Register instantly using your standard Google account. Once logged in, your profile generates a public <strong>Auditor Auth ID</strong> (e.g. <code>123-456</code>). This key acts as your secure invite token.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-[54px] top-0 h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-4 border-[#0A0A0B] flex items-center justify-center text-xs font-bold text-white shadow-lg">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-indigo-400" />
              Member Links Account
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Share your <strong>Auditor Auth ID</strong> with your family members or corporate clients. During their onboarding on the Arukin Client, they input your Auth ID to designate you as their remote auditor.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-[54px] top-0 h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-4 border-[#0A0A0B] flex items-center justify-center text-xs font-bold text-white shadow-lg">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Eye size={18} className="text-indigo-400" />
              Start Audit & Protection
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
              Once consent is granted, the member populates on your <strong>Auditor Dashboard</strong>. You can now scan folders, read Gmail alerts, audit contacts, and manage threats.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
