import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Info, ArrowLeft, Menu, X, ShieldCheck, Bug, Users, ExternalLink } from 'lucide-react';

export default function BetaNotice() {
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
            <Link to="/beta-notice" className="block text-sm font-semibold text-amber-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Beta Notice</Link>
            <Link to="/privacy" className="block text-sm font-semibold text-slate-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Privacy Policy</Link>
            <Link to="/terms" className="block text-sm font-semibold text-slate-300 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Terms of Service</Link>
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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Header */}
        <header className="mb-12 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bug size={20} />
            </div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Development Status</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight mb-3">Beta Notice</h1>
          <p className="text-slate-500 text-xs">Last Updated: July 1, 2026</p>
        </header>

        {/* Content sections */}
        <div className="space-y-10 text-sm leading-relaxed">

          {/* Highlight Banner */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-white font-bold text-xs mb-1">CURRENT STATUS: BETA</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                ArukinSec is currently in beta. We recommend using it for personal and family oversight — not for highly sensitive corporate or enterprise accounts at this stage.
              </p>
            </div>
          </div>

          {/* Section 1: What Beta Means */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Info size={18} className="text-amber-400" />
              <span>1. What "Beta" Means For You</span>
            </h2>
            <p className="text-slate-400">
              ArukinSec is in active development. Features are provided for personal and family evaluation and are subject to change without notice. We do not support enterprise-level usage at this time.
            </p>
            <p className="text-slate-400 mt-2">
              During beta, you may encounter:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 mt-1">
              <li>Occasional UI or layout inconsistencies across devices and screen sizes.</li>
              <li>Rate-limiting delays when fetching data from Google APIs, especially during peak hours.</li>
              <li>Feature gaps between the free and PRO tiers as we finalize our pricing model.</li>
              <li>Changes to the dashboard layout, navigation, and terminology as we iterate on user feedback.</li>
            </ul>
          </section>

          {/* Section 2: Account Limits */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Users size={18} className="text-amber-400" />
              <span>2. Account & Connection Limits</span>
            </h2>
            <p className="text-slate-400">
              Because ArukinSec operates as a Google Developer Sandbox application, the following limits apply:
            </p>
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-3 mt-2">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Users size={14} />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs">100 Connected User Limit</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    Google enforces a hard cap of 100 sensitive-scope user connections for unverified applications. Once this limit is reached, no new members can connect their Google accounts until ArukinSec completes a CASA Tier 2 security assessment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <ShieldAlert size={14} />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-xs">No Uptime Guarantee</h4>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                    As a beta service, ArukinSec does not offer SLA-backed uptime. API changes, infrastructure updates, or security patches may cause temporary interruptions without prior notice.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Security Already In Place */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>3. Security Measures Already Active</span>
            </h2>
            <p className="text-slate-400">
              Even during beta, several security foundations are in place:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 mt-1">
              <li><strong>Zero-Knowledge Architecture:</strong> Email contents, file data, and contact details are never stored on our servers. All processing happens ephemerally in memory.</li>
              <li><strong>AES-GCM Local Encryption:</strong> Dashboard data cached on your device is encrypted using the Web Crypto API before being written to local storage.</li>
              <li><strong>Immutable Audit Logging:</strong> Every action taken by a Manager (previewing a file, trashing an email) is logged with their performer ID for accountability.</li>
              <li><strong>Instant Revocation:</strong> Members can disconnect their Google account at any time, immediately invalidating all access tokens.</li>
            </ul>
          </section>

          {/* Section 4: Roadmap to v1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ExternalLink size={18} className="text-indigo-400" />
              <span>4. Roadmap to General Availability</span>
            </h2>
            <p className="text-slate-400">
              The following milestones are targeted before the v1 stable release:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Phase 1</span>
                <h4 className="font-semibold text-xs text-white">CASA Tier 2 Audit</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Complete Google-mandated security assessment to remove the unverified app warning and 100-user cap.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Phase 2</span>
                <h4 className="font-semibold text-xs text-white">PRO Feature Set</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Finalize automated scanning, compose-and-send, and deep analytics for PRO subscribers.</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Phase 3</span>
                <h4 className="font-semibold text-xs text-white">Public Launch</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Open registration, remove sandbox restrictions, and publish SLA-backed service terms.</p>
              </div>
            </div>
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
