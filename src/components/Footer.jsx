import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-deep/10 bg-cream mt-auto shrink-0 z-10 w-full relative">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">

        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <img src="/arukin-logo.webp" className="h-7 w-7 object-contain rounded-md" alt="Arukin" />
            <span className="font-display font-bold text-base tracking-tight text-emerald-deep">Arukin</span>
          </div>
          <p className="text-emerald-deep/70 text-sm leading-relaxed max-w-sm">
            A calm layer of Google account oversight for families, caregivers, and professionals.
          </p>
          <div className="font-mono text-[11px] text-emerald-brand font-semibold select-all bg-emerald-brand/5 border border-emerald-brand/15 rounded-md px-2 py-1 inline-block">
            arukin.pages.dev
          </div>
          <div>
            <a href="https://github.com/arukinSec" target="_blank" rel="noreferrer" className="text-emerald-deep/50 hover:text-emerald-deep transition-colors inline-flex" title="GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            </a>
          </div>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h4 className="text-[10px] font-bold text-emerald-deep/50 uppercase tracking-[0.2em]">Platform</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="text-emerald-deep/70 hover:text-emerald-brand transition-colors">Home</Link>
            <Link to="/about" className="text-emerald-deep/70 hover:text-emerald-brand transition-colors">About</Link>
            <Link to="/how-it-works" className="text-emerald-deep/70 hover:text-emerald-brand transition-colors">How It Works</Link>
            <Link to="/use-cases" className="text-emerald-deep/70 hover:text-emerald-brand transition-colors">Use Cases</Link>
            <Link to="/pricing" className="text-emerald-deep/70 hover:text-emerald-brand transition-colors">Pricing</Link>
            <Link to="/faq" className="text-emerald-deep/70 hover:text-emerald-brand transition-colors">FAQ</Link>
          </div>
        </div>

        <div className="md:col-span-4 space-y-3">
          <h4 className="text-[10px] font-bold text-emerald-deep/50 uppercase tracking-[0.2em]">Compliance & Privacy</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/privacy" className="text-emerald-deep/70 hover:text-emerald-brand transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-emerald-deep/70 hover:text-emerald-brand transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="text-emerald-deep/70 hover:text-emerald-brand transition-colors">Disclaimer</Link>
            <Link to="/beta-notice" className="text-emerald-deep/70 hover:text-gold transition-colors">Beta Notice</Link>
          </div>

          <div className="flex gap-2 pt-3">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-brand bg-emerald-brand/5 border border-emerald-brand/20 px-2 py-0.5 rounded-md">
              <ShieldCheck size={10} /> DPDP ALIGNED
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
              <ShieldCheck size={10} /> GDPR FRAMEWORK
            </span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8 pt-6 border-t border-emerald-deep/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-emerald-deep/50">
        <p>&copy; {new Date().getFullYear()} Arukin. All rights reserved.</p>
        <p>Not affiliated with Google LLC. Gmail, Drive, and Workspace are trademarks of Google LLC.</p>
      </div>
    </footer>
  );
}
