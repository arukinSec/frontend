import React from 'react';
import LegalNavbar from './LegalNavbar';

export default function LegalPage({ eyebrow, title, updated, icon: Icon, children }) {
  return (
    <div className="min-h-screen bg-navy text-slate-100 flex flex-col">
      <LegalNavbar />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 md:py-20 w-full relative">
        <header className="mb-12 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center text-gold">
              {Icon ? <Icon size={20} /> : null}
            </div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.25em]">{eyebrow}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-3">
            {title}
          </h1>
          {updated && <p className="text-slate-400 text-xs">Last Updated: {updated}</p>}
        </header>

        <div className="space-y-10 text-[15px] leading-relaxed prose-legal">
          {children}
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-slate-400 mt-12">
        <p>© {new Date().getFullYear()} ArukinSec. Built for Google account oversight and digital caregiving.</p>
      </footer>
    </div>
  );
}

export function LegalSection({ icon: Icon, title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-bold text-slate-200 flex items-center gap-2.5">
        {Icon ? <Icon size={18} className="text-emerald-brand" /> : null}
        <span>{title}</span>
      </h2>
      <div className="text-slate-300 space-y-3">{children}</div>
    </section>
  );
}

export function BetaCallout({ children }) {
  return (
    <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4 flex items-start gap-3">
      <div className="mt-0.5 text-gold">⚠</div>
      <p className="text-slate-300 text-xs leading-relaxed">{children}</p>
    </div>
  );
}
