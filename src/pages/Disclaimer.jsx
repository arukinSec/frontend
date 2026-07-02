import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Info, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Disclaimer() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 font-sans flex flex-col">
      
      {/* Header / Navigation Bar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldAlert size={18} className="text-white" />
            </div>
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
              <Info size={20} />
            </div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Legal Notice</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight mb-3">Disclaimer</h1>
          <p className="text-slate-500 text-xs">Last Updated: July 1, 2026</p>
        </header>

        {/* Content sections */}
        <div className="space-y-10 text-sm leading-relaxed">
          
          {/* Prototype warning block */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-white font-bold text-xs mb-1">EVALUATION PROTOTYPE NOTICE</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Arukin is currently provided solely as an evaluation prototype. Under no circumstances should this platform be used to secure or transmit production data files or highly sensitive enterprise communication records.
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <AlertTriangle size={18} className="text-amber-500" />
              <span>1. Google "Unverified App" Warning Notice</span>
            </h2>
            <p className="text-slate-400">
              When linking a Google Account as a Member, users will see Google's default <strong>"Google hasn't verified this app"</strong> warning. This is standard behavior for custom integrations and developer sandboxes. 
            </p>
            <p className="text-slate-400 mt-2">
              <strong>CASA Tier 2 Audit Constraints:</strong> To remove this warning for apps requesting restricted API scopes (like Gmail and Google Drive reads), Google mandates annual verification through a Cloud Application Security Assessment (CASA) Tier 2 audit. This audit carries an annual cost of <strong>$10,000 to $75,000</strong>, which is currently prohibitive for an early-stage, bootstrap prototype.
            </p>
            <p className="text-slate-400 mt-2">
              Consequently, this project runs in <strong>Developer Sandbox mode</strong>, which imposes a strict hard limit of <strong>100 connected user accounts</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Info size={18} className="text-indigo-400" />
              <span>2. "As Is" Warranty Disclaimer</span>
            </h2>
            <p className="text-slate-400">
              All services, utilities, and components on Arukin are provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding system uptime, performance reliability, or the absolute prevention of digital security threats.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldAlert size={18} className="text-indigo-400" />
              <span>3. Google API & Third-Party Actions</span>
            </h2>
            <p className="text-slate-400">
              Arukin interacts dynamically with third-party service application interfaces (specifically Google APIs). We have no control over, and assume no liability for:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 mt-2">
              <li>API deprecation, rate-limiting, or service blackouts initiated by Google.</li>
              <li>Accidental file deletion, email label modifications, or contact adjustments occurring during console operations.</li>
              <li>Account suspension or security credential locks triggered on Google Accounts.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Info size={18} className="text-indigo-400" />
              <span>4. Limitation of Liability</span>
            </h2>
            <p className="text-slate-400">
              To the maximum extent permitted by applicable law, in no event shall Arukin, its developers, or affiliates be held liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the compliance gateways.
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
