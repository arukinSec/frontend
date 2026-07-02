import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 font-sans flex flex-col">
      
      {/* Header / Navigation Bar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/arukin-logo.jpg" className="h-8 w-8 object-contain rounded-md shadow-sm" alt="Arukin Logo" />
            <Link to="/" className="font-bold text-lg tracking-wide text-white hover:text-indigo-400 transition-colors">
              Arukin <span className="text-indigo-400 font-medium">Compliance Portal</span>
            </Link>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>
        </div>
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
          
          {/* Prototype Disclosure warning */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-white font-bold text-xs mb-1">PROTOTYPE COMPLIANCE WARNING</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                This portal is currently operating as a prototype. While we design all database boundaries and token exchanges to comply with strict data safety models, temporary technical shortfalls may exist. Do not connect critical production accounts.
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Eye size={18} className="text-indigo-400" />
              <span>1. Company Privacy Policy (The Ideal Path)</span>
            </h2>
            <p className="text-slate-400">
              Arukin is built on the principle of complete data minimization. Under both **India's Digital Personal Data Protection Act, 2023 (DPDP)** and the **EU GDPR**, we process data strictly to provide security telemetry. 
            </p>
            <p className="text-slate-400 mt-2">
              <strong>Our Commitment:</strong> We never copy, cache, or store the contents of your emails, files, calendar entries, or contacts in our databases. All reads occur ephemerally in memory and are discarded once the session terminates. Because this is a prototype, some security modules (such as KMS token rotation) are simulated; we recommend testing with non-critical accounts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Lock size={18} className="text-indigo-400" />
              <span>2. Auditor Guidelines & Responsibilities</span>
            </h2>
            <p className="text-slate-400">
              Auditors logging into the Arukin console must comply with the following privacy boundaries:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 mt-2">
              <li><strong>Prior Consent Required:</strong> Auditors must obtain explicit consent from the member before requesting an account connection.</li>
              <li><strong>Purpose Limitation:</strong> Audited email subjects, file catalogs, and contact lists must be reviewed strictly for threat detection and compliance. No personal communication details should be copied or utilized elsewhere.</li>
              <li><strong>Secure Console Practices:</strong> Auditors must log out of active sessions on shared devices to prevent credential leakage.</li>
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
              <li><strong>Immutable Performer Tracking:</strong> Every auditor view action (e.g. previewing a file or trashing a mail thread) is logged with the auditor's performer ID, ensuring you can review exactly how they monitored your account.</li>
              <li><strong>Sandboxed API Relays:</strong> The console operations process metadata securely to prevent unauthorized background modifications while granting explicit, user-triggered management over threats.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-indigo-400" />
              <span>4. Revoking Authorization</span>
            </h2>
            <p className="text-slate-400">
              You retain absolute control over your data. You can revoke Arukin's access permissions at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 mt-2">
              <li>By selecting the "Disconnect" option in your client portal.</li>
              <li>By removing Arukin's app permissions in your Google Account Security Dashboard under <a href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Google Connections</a>.</li>
            </ul>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600 shrink-0 mt-12 bg-black/20">
        <p>© 2026 Arukin Platform. Built for digital guardian compliance and anti-fraud operations.</p>
      </footer>

    </div>
  );
}
