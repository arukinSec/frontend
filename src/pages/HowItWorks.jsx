import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, UserPlus, ShieldAlert as AlertIcon, Eye, CheckCircle2, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function HowItWorks() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Public Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/arukin-logo.jpg" className="h-8 w-8 object-contain rounded-md shadow-sm" alt="Arukin Logo" />
            <span className="font-bold text-lg tracking-wide text-slate-900">Arukin <span className="text-emerald-600 font-medium hidden sm:inline">Security Console</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">How it works</Link>
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
            <Link to="/" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/how-it-works" className="block text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
            <Link to="/use-cases" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Use Cases</Link>
            <Link to="/about" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 animate-fade-in">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-3">
            Step-by-step Setup
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">How Arukin Works</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
            A simple, transparent process to help you secure your family's accounts while always respecting their privacy and consent.
          </p>
        </div>

        {/* Timeline Workflow */}
        <div className="relative border-l border-slate-200 ml-6 pl-10 space-y-16">
          {/* Step 1 */}
          <div className="relative">
            <div className="absolute -left-[54px] top-0 h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 border-4 border-slate-50 flex items-center justify-center text-xs font-bold text-slate-900 shadow-lg">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <UserPlus size={18} className="text-emerald-600" />
              Your Setup
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
              Sign in with your Google account. You'll instantly get a 6-digit <strong>Connection ID</strong> (e.g. <code>123-456</code>) to share with your family.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="absolute -left-[54px] top-0 h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 border-4 border-slate-50 flex items-center justify-center text-xs font-bold text-slate-900 shadow-lg">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              They Connect Their Account
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
              Your family member goes to the Member Portal and enters your 6-digit <strong>Connection ID</strong> to safely link their account to your dashboard.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="absolute -left-[54px] top-0 h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 border-4 border-slate-50 flex items-center justify-center text-xs font-bold text-slate-900 shadow-lg">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Eye size={18} className="text-emerald-600" />
              Start Protecting Them
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
              That's it! They will appear on your dashboard. You can now easily check their inbox for phishing scams, review their contacts, and ensure their Drive is safe.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
