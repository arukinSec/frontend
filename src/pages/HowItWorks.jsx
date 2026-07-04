import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, UserPlus, Eye, CheckCircle2, Menu, X, Link2, LogIn, Key, Share2 } from 'lucide-react';
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
            <span className="font-bold text-lg tracking-wide text-slate-900">Arukin</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">How it works</Link>
            <Link to="/use-cases" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Use Cases</Link>
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Pricing</Link>
            <a href="https://github.com/arukinSec" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors ml-2" title="Star on GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
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

      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-4">
            Four Simple Steps
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How Arukin Works
          </h1>
          <p className="text-slate-600 text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Look after someone's Google account in minutes — with their consent, 
            without their password, and with full transparency.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-20 md:space-y-32">
          {/* Step 1: Register as a Manager */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500 text-white text-sm font-bold mb-4 shadow-lg shadow-emerald-500/25">
                1
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                Register as a Manager
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Head to the homepage and click <strong>Sign in with Google</strong> on the 
                Manager Dashboard card. That's it — you're now registered as a 
                Manager. No credit card, no setup fees.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-500/25"
              >
                <LogIn size={16} />
                Go to Homepage
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <img
                src="/1.png"
                alt="Sign in with Google on Manager Dashboard"
                className="w-full max-w-sm rounded-3xl border border-slate-200 shadow-xl"
              />
            </div>
          </div>

          {/* Step 2: Get the ID */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-2">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500 text-white text-sm font-bold mb-4 shadow-lg shadow-emerald-500/25">
                2
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                Get Your Connection ID
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Once signed in, you'll see your unique 6-digit <strong>Connection ID</strong>. 
                Note it down or click the link icon next to it to copy a shareable 
                link — members won't have to type the number if you share the link.
              </p>
              <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-md w-fit">
                <Key size={18} className="text-emerald-400 shrink-0" />
                <span className="font-mono text-lg font-bold text-white tracking-widest">123-456</span>
                <div className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <Link2 size={14} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Your ID with the copy-link button</p>
            </div>
            <div className="order-1 md:order-1 flex justify-center">
              <img
                src="/2.png"
                alt="Connection ID with copy link option"
                className="w-full max-w-sm rounded-3xl border border-slate-200 shadow-xl"
              />
            </div>
          </div>

          {/* Step 3: Member Authenticates */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500 text-white text-sm font-bold mb-4 shadow-lg shadow-emerald-500/25">
                3
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                Member Authenticates
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Send them the link or the ID. They visit the Member Portal, sign in 
                with their own Google account, and grant permission. 
                <strong> No password sharing</strong> — Google handles authentication.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  They keep full control — revoke access anytime
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Google sends them an instant security alert
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  Limited access by default — they approve what to share
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <img
                src="/3.png"
                alt="Member authenticates with their Google account"
                className="w-full max-w-sm rounded-3xl border border-slate-200 shadow-xl"
              />
            </div>
          </div>

          {/* Step 4: Start Managing */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500 text-white text-lg font-bold mb-4 shadow-lg shadow-emerald-500/25">
              4
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Start Managing
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              They appear on your dashboard. Monitor their inbox, review Drive 
              files, check connected apps — all from one place. Login anytime 
              to check in.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md text-sm"
            >
              Go to Homepage
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto">
            Sign up for free and start looking after someone's digital safety in under a minute.
          </p>
          <Link
            to="/manager"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 text-sm"
          >
            Start Looking After Them
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
