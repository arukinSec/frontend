import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 mt-auto shrink-0 z-10 w-full relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Brand / Domain Info (Left) */}
        <div className="md:col-span-5 space-y-4 text-left">
          <div className="flex items-center gap-2">
            <img src="/arukin-logo.webp" className="h-6 w-6 object-contain rounded-md shadow-sm" alt="ArukinSec Logo" />
            <span className="font-bold text-sm tracking-wide text-slate-900">ArukinSec</span>
          </div>
          <p className="text-slate-600 text-xs leading-normal max-w-sm">
            Google account oversight for families, caregivers, and professionals. Operating securely under the deployment domain:
            <span className="block mt-1 font-mono text-[10px] text-emerald-600 font-bold select-all">arukinsec.web.app</span>
          </p>
          <a href="https://github.com/arukinSec" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors inline-flex mt-2" title="GitHub Repository">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
          </a>
        </div>

        {/* Platform Links (Center) */}
        <div className="md:col-span-3 space-y-3 text-left">
          <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Platform</h4>
          <div className="flex flex-col gap-2 text-xs">
            <Link to="/" className="text-slate-500 hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/about" className="text-slate-500 hover:text-emerald-600 transition-colors">About</Link>
            <Link to="/how-it-works" className="text-slate-500 hover:text-emerald-600 transition-colors">How It Works</Link>
            <Link to="/use-cases" className="text-slate-500 hover:text-emerald-600 transition-colors">Use Cases</Link>
            <Link to="/pricing" className="text-slate-500 hover:text-emerald-600 transition-colors">Pricing</Link>
            <Link to="/faq" className="text-slate-500 hover:text-emerald-600 transition-colors">FAQ</Link>
          </div>
        </div>

        {/* Legal Links (Right) */}
        <div className="md:col-span-4 space-y-3 text-left">
          <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Compliance & Privacy</h4>
          <div className="flex flex-col gap-2 text-xs">
            <Link to="/privacy" className="text-slate-500 hover:text-emerald-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-emerald-600 transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="text-slate-500 hover:text-emerald-600 transition-colors">Disclaimer Statement</Link>
            <Link to="/beta-notice" className="text-slate-500 hover:text-amber-600 transition-colors">Beta Notice</Link>
          </div>
          
          {/* Regulatory Badges */}
          <div className="flex gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">
              <ShieldCheck size={10} />
              DPDP ALIGNED
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-teal-600 bg-teal-500/5 border border-teal-500/10 px-2 py-0.5 rounded-md">
              <ShieldCheck size={10} />
              GDPR FRAMEWORK
            </span>
          </div>
        </div>

      </div>

      {/* Copyright Strip */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
        <p>&copy; {new Date().getFullYear()} ArukinSec Security Systems. All rights reserved.</p>
        <p>ArukinSec is not affiliated with Google LLC. Google Workspace, Gmail, and Google Drive are trademarks of Google LLC.</p>
      </div>
    </footer>
  );
}
