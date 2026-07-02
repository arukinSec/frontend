import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md py-12 mt-auto shrink-0 z-10 w-full relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Brand / Domain Info (Left) */}
        <div className="md:col-span-5 space-y-4 text-left">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center">
              <ShieldAlert size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-wide text-white">Arukin Security Console</span>
          </div>
          <p className="text-slate-500 text-xs leading-normal max-w-sm">
            Digital guardian compliance and anti-fraud auditing. Operating securely under the deployment domain:
            <span className="block mt-1 font-mono text-[10px] text-indigo-400 font-bold select-all">arukin.pages.dev</span>
          </p>
        </div>

        {/* Platform Links (Center) */}
        <div className="md:col-span-3 space-y-3 text-left">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform</h4>
          <div className="flex flex-col gap-2 text-xs">
            <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors">Home</Link>
            <Link to="/about" className="text-slate-500 hover:text-slate-300 transition-colors">Mission & Team</Link>
            <Link to="/how-it-works" className="text-slate-500 hover:text-slate-300 transition-colors">How It Works</Link>
            <Link to="/pricing" className="text-slate-500 hover:text-slate-300 transition-colors">Pricing</Link>
          </div>
        </div>

        {/* Legal Links (Right) */}
        <div className="md:col-span-4 space-y-3 text-left">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance & Privacy</h4>
          <div className="flex flex-col gap-2 text-xs">
            <Link to="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="text-slate-500 hover:text-slate-300 transition-colors">Disclaimer Statement</Link>
          </div>
          
          {/* Regulatory Badges */}
          <div className="flex gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">
              <ShieldCheck size={10} />
              DPDP ALIGNED
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-400/80 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded-md">
              <ShieldCheck size={10} />
              GDPR FRAMEWORK
            </span>
          </div>
        </div>

      </div>

      {/* Copyright Strip */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-600">
        <p>© 2026 Arukin. All rights reserved.</p>
        <p className="font-medium text-slate-700">Prototype Phase Evaluation Version 1.0.0</p>
      </div>
    </footer>
  );
}
