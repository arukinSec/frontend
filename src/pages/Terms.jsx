import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, UserCheck, ShieldAlert, Key, ArrowLeft } from 'lucide-react';

export default function Terms() {
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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Top Header */}
        <header className="mb-12 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <BookOpen size={20} />
            </div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Platform Policy</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight mb-3">Terms of Service</h1>
          <p className="text-slate-500 text-xs">Last Updated: July 1, 2026</p>
        </header>

        {/* Content sections */}
        <div className="space-y-10 text-sm leading-relaxed">
          
          {/* Prototype Disclosure warning */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-white font-bold text-xs mb-1">PROTOTYPE SERVICE TERMS</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Arukin is in active development. By accessing the platform, you acknowledge that features are provided for evaluation and feedback, and are subject to change without notice. We recommend testing with development-only accounts.
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <UserCheck size={18} className="text-indigo-400" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p className="text-slate-400">
              By accessing the Arukin console or connecting a Google Account as a Member, you agree to comply with and be bound by these Terms of Service, all applicable laws, and regulations. If you do not agree with any of these terms, you are prohibited from using the platform's synchronization services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Key size={18} className="text-indigo-400" />
              <span>2. Authorized Consent Required</span>
            </h2>
            <p className="text-slate-400">
              Auditors must obtain explicit consent from the member before mapping their Google Account to the Arukin portal. Connecting third-party accounts without their knowledge or authorization is strictly prohibited and constitutes a violation of these terms, resulting in immediate suspension of auditor credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldAlert size={18} className="text-indigo-400" />
              <span>3. Disclaimers & Limitations</span>
            </h2>
            <p className="text-slate-400">
              Arukin functions solely as a metadata transmission relay. We are not liable for:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 mt-2">
              <li>Data loss or modifications occurring on Google Services (Gmail, Drive, Contacts).</li>
              <li>Unauthorized access resulting from auditor credentials leakage.</li>
              <li>Service disruptions caused by API changes or deprecation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <BookOpen size={18} className="text-indigo-400" />
              <span>4. Changes & Revisions</span>
            </h2>
            <p className="text-slate-400">
              We reserve the right to revise these Terms of Service at any time. Revisions will be published directly on this page with an updated "Last Updated" timestamp. Continual use of the platform after modifications constitutes acceptance of the updated terms.
            </p>
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
