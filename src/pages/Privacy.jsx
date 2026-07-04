import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, ShieldAlert, Menu, X } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 font-sans flex flex-col">
      
      {/* Header / Navigation Bar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/arukin-logo.webp" className="h-8 w-8 object-contain rounded-md shadow-sm" alt="ArukinSec Logo" />
            <Link to="/" className="font-bold text-lg tracking-wide text-white hover:text-indigo-400 transition-colors">
              ArukinSec <span className="text-indigo-400 font-medium">Compliance Portal</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Go Back</span>
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0E0E12] border-t border-white/10 px-6 py-4 space-y-3 animate-fade-in">
            <Link to="/" className="block text-sm font-semibold text-slate-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/privacy" className="block text-sm font-semibold text-indigo-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Privacy Policy</Link>
            <Link to="/terms" className="block text-sm font-semibold text-slate-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Terms of Service</Link>
            <Link to="/beta-notice" className="block text-sm font-semibold text-amber-400/70 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Beta Notice</Link>
            <Link to="/disclaimer" className="block text-sm font-semibold text-slate-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Disclaimer Statement</Link>
            <button 
              onClick={() => { navigate(-1); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Go Back</span>
            </button>
          </div>
        )}
      </nav>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 md:py-16 w-full relative overflow-hidden">
        {/* Background ambient glowing gradient */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Header */}
        <header className="mb-12 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Compliance Guidelines</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight mb-3">Privacy Policy</h1>
          <p className="text-slate-500 text-xs">Last Updated: July 1, 2026</p>
        </header>

        {/* Content sections */}
        <div className="space-y-10 text-sm leading-relaxed">
          
          {/* Beta Release Notice - ref to dedicated page */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <p className="text-slate-400 text-xs leading-relaxed">
              ArukinSec is currently in beta. See our <Link to="/beta-notice" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">Beta Release Notice</Link> for details on development status, account limits, and security measures.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Eye size={18} className="text-indigo-400" />
              <span>1. ArukinSec's Privacy Policy</span>
            </h2>
            <p className="text-slate-400">
              ArukinSec is built on the principle of complete data minimization. Under both <strong>India's Digital Personal Data Protection Act, 2023 (DPDP)</strong> and the <strong>EU GDPR</strong>, we process data strictly to provide security telemetry. 
            </p>
            <p className="text-slate-400 mt-2">
              <strong>Our Commitment:</strong> We never copy, cache, or store the contents of your emails, files, calendar entries, or contacts in our databases. All reads occur ephemerally in memory via our edge functions and are discarded once the session terminates. Data fetched to your dashboard is cached locally on your device using Web Crypto AES-GCM encryption.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Lock size={18} className="text-indigo-400" />
              <span>2. Manager Guidelines & Responsibilities</span>
            </h2>
            <p className="text-slate-400">
              Managers logging into the ArukinSec console must comply with the following privacy boundaries:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 mt-2">
              <li><strong>Prior Consent Required:</strong> Managers must obtain explicit consent from the member before requesting an account connection.</li>
              <li><strong>Purpose Limitation:</strong> Reviewed email subjects, file catalogs, and contact lists must be reviewed strictly for threat detection and compliance. No personal communication details should be copied or utilized elsewhere.</li>
              <li><strong>Secure Console Practices:</strong> Managers must log out of active sessions on shared devices to prevent credential leakage.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <FileText size={18} className="text-indigo-400" />
              <span>3. Client & Member Protections</span>
            </h2>
            <p className="text-slate-400">
              Members who authorize connection requests are protected by the following structural gates:
            </p>
            <ul className="list-disc pl-5 space-y-2.5 text-slate-400 mt-2">
              <li><strong>Instant Revocation:</strong> You can disconnect and sever active tokens instantly. Once disconnected, your connection metadata is permanently deleted.</li>
              <li><strong>Immutable Performer Tracking:</strong> Every Manager view action (e.g. previewing a file or trashing a mail thread) is logged with the Manager's performer ID, ensuring you can review exactly how they monitored your account.</li>
              <li><strong>Sandboxed API Relays:</strong> The console operations process metadata securely to prevent unauthorized background modifications while granting explicit, user-triggered management over threats.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-indigo-400" />
              <span>4. Revoking Authorization</span>
            </h2>
            <p className="text-slate-400">
              You retain absolute control over your data. You can revoke ArukinSec's access permissions at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 mt-2">
              <li>By selecting the "Disconnect" option in your client portal.</li>
              <li>By removing ArukinSec's app permissions in your Google Account Security Dashboard by visiting <a href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">https://myaccount.google.com/connections</a>.</li>
            </ul>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600 shrink-0 mt-12 bg-black/20">
        <p>© 2026 ArukinSec Platform. Built for Google account oversight and digital caregiving.</p>
      </footer>

    </div>
  );
}
