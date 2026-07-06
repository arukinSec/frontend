import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import LegalNavbar from '../components/LegalNavbar';

export default function Disclaimer() {
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
              <Info size={20} />
            </div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Legal Notice</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight mb-3">Disclaimer</h1>
          <p className="text-slate-500 text-xs">Last Updated: July 1, 2026</p>
        </header>

        {/* Content sections */}
        <div className="space-y-10 text-sm leading-relaxed">
          
          {/* Beta Release Notice - ref to dedicated page */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <p className="text-slate-400 text-xs leading-relaxed">
              ArukinSec is currently in beta. See our <Link to="/beta-notice" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">Beta Release Notice</Link> for details on development status, account limits, and security measures.
            </p>
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
              <strong>CASA Tier 2 Audit Constraints:</strong> To remove this warning for apps requesting restricted API scopes (like Gmail and Google Drive reads), Google mandates annual verification through a Cloud Application Security Assessment (CASA) Tier 2 audit. This audit carries an annual cost between <strong>$15,000 and $75,000</strong>, which is currently prohibitive for an early-stage, independent project.
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
              All services, utilities, and components on ArukinSec are provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding system uptime, performance reliability, or the absolute prevention of digital security threats.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldAlert size={18} className="text-indigo-400" />
              <span>3. Google API & Third-Party Actions</span>
            </h2>
            <p className="text-slate-400">
              ArukinSec interacts dynamically with third-party service application interfaces (specifically Google APIs). We have no control over, and assume no liability for:
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
              To the maximum extent permitted by applicable law, in no event shall ArukinSec, its developers, or affiliates be held liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the compliance gateways.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              <ShieldAlert size={18} className="text-rose-400" />
              <span>5. Member Protection & Consent Notice (Anti-Stalkerware)</span>
            </h2>
            <p className="text-slate-400">
              ArukinSec is designed strictly for parental oversight, caregiver assistance, or corporate safety monitoring. It must never be used to monitor adults without their active, continuous consent. 
            </p>
            <p className="text-slate-400">
              <strong>Current Limitations:</strong> We currently do not have dedicated internal warning or real-time security warning systems in place to notify monitored members, relying entirely on Google's native authorization warnings during Gmail/Drive API pairing.
            </p>
            <p className="text-slate-400">
              <strong>Planned Mitigations:</strong> We are planning to implement several security constraints to prevent silent installation:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 mt-2">
              <li><strong>24-Hour Consent Wait Time:</strong> Link requests will require a mandatory 24-hour verification delay. Members cannot authenticate or share data until this timer expires, after which the link request is rejected if not manually confirmed.</li>
              <li><strong>SMS & Email Alerts:</strong> Instant notifications sent directly to the member's personal phone number and alternative email address when monitoring activity begins.</li>
              <li><strong>Auto Log-Out:</strong> Short session bounds forcing managers to re-authenticate periodically to prevent unauthorized persistent dashboard monitoring.</li>
              <li><strong>Member-Side Billing:</strong> Transitioning subscription purchases exclusively to the member's portal so that a manager cannot unilaterally pay for and gain access to tracking features.</li>
              <li><strong>Strict Login OTP Verification:</strong> Requiring the member to authorize a One-Time Password (OTP) challenge sent directly to their device every single time the manager signs into the monitoring dashboard.</li>
            </ul>
            <p className="text-slate-500 text-xs mt-4 italic">
              While all of these roadmap security measures represent active development goals aimed at preventing ArukinSec from functioning as stalkerware, their ultimate efficacy remains to be seen in production environments.
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
