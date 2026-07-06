import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, UserCheck, ShieldAlert, Key } from 'lucide-react';
import LegalNavbar from '../components/LegalNavbar';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 font-sans flex flex-col">
      <LegalNavbar />

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
          
          {/* Beta Release Notice - ref to dedicated page */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <p className="text-slate-400 text-xs leading-relaxed">
              ArukinSec is currently in beta. See our <Link to="/beta-notice" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">Beta Release Notice</Link> for details on development status, account limits, and security measures.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <UserCheck size={18} className="text-indigo-400" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p className="text-slate-400">
              By accessing the ArukinSec console or connecting a Google Account as a Member, you agree to comply with and be bound by these Terms of Service, all applicable laws, and regulations. If you do not agree with any of these terms, you are prohibited from using the platform's synchronization services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Key size={18} className="text-indigo-400" />
              <span>2. Authorized Consent Required</span>
            </h2>
            <p className="text-slate-400">
              Managers must obtain explicit consent from the member before mapping their Google Account to the ArukinSec portal. Connecting third-party accounts without their knowledge or authorization is strictly prohibited and constitutes a violation of these terms, resulting in immediate suspension of Manager credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldAlert size={18} className="text-indigo-400" />
              <span>3. Disclaimers & Limitations</span>
            </h2>
            <p className="text-slate-400">
              ArukinSec functions solely as a metadata transmission relay. We are not liable for:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 mt-2">
              <li>Data loss or modifications occurring on Google Services (Gmail, Drive, Contacts).</li>
              <li>Unauthorized access resulting from Manager credentials leakage.</li>
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
        <p>© 2026 ArukinSec Platform. Built for Google account oversight and digital caregiving.</p>
      </footer>

    </div>
  );
}
