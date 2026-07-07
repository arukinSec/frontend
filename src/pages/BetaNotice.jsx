import React from 'react';
import { ShieldAlert, Info, ShieldCheck, Bug, Users, ExternalLink } from 'lucide-react';
import LegalPage, { LegalSection } from '../components/LegalPage';

export default function BetaNotice() {
  return (
    <LegalPage eyebrow="Development Status" title="Beta Notice" updated="July 1, 2026" icon={Bug}>
      <LegalSection icon={Info} title='1. What "beta" means for you'>
        <p>ArukinSec is in active development. Features are provided for personal and family evaluation and are subject to change without notice.</p>
        <p>During beta, you may encounter:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Occasional UI or layout inconsistencies across devices.</li>
          <li>Rate-limiting delays when fetching data from Google APIs during peak hours.</li>
          <li>Feature gaps between free and PRO tiers as we finalize pricing.</li>
          <li>Changes to dashboard layout and terminology as we iterate on feedback.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={Users} title="2. Account & Connection Limits">
        <p>Because ArukinSec operates as a Google Developer Sandbox application:</p>
        
        {/* Beta Status & Account Limits Callout Card */}
        <div className="bg-emerald-deep text-cream border border-emerald-deep/20 rounded-3xl p-6 shadow-lg space-y-4 mt-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
            <ShieldAlert className="text-gold shrink-0" size={22} />
            <h3 className="font-display text-lg font-bold text-white">Developer Sandbox Limits</h3>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-cream/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                  <Users size={16} className="text-gold" /> 100 Connection Cap
                </h4>
                <p className="text-cream/70 text-xxs leading-relaxed">
                  Google enforces a hard cap of 100 sensitive-scope user connections for sandbox testing applications, until ArukinSec completes a formal CASA Tier 2 assessment.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="font-display font-bold text-white text-sm mb-1 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-gold" /> No Uptime SLA
                </h4>
                <p className="text-cream/70 text-xxs leading-relaxed">
                  As a beta sandbox service, ArukinSec does not provide uptime SLA agreements. API updates or infrastructure checks may cause temporary scans delay.
                </p>
              </div>
            </div>
          </div>
        </div>
      </LegalSection>

      <LegalSection icon={ShieldCheck} title="3. Security Measures Already Active">
        <p>Even during beta, several foundations are in place:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Zero-knowledge architecture:</strong> email, file, and contact contents are never stored on our servers.</li>
          <li><strong>AES-GCM local encryption:</strong> dashboard cache is encrypted via Web Crypto before writing to local storage.</li>
          <li><strong>Immutable audit logging:</strong> every Manager action is logged with their performer ID.</li>
          <li><strong>Instant revocation:</strong> members can disconnect at any time, invalidating all access tokens.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={ExternalLink} title="4. Roadmap to General Availability">
        <p>Milestones targeted before the v1 stable release:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {[
            ['Phase 1', 'CASA Tier 2 Audit', 'Complete Google-mandated security assessment to remove the unverified-app warning and the 100-user cap.'],
            ['Phase 2', 'PRO Feature Set', 'Finalize automated scanning, compose-and-send, and deep analytics for PRO subscribers.'],
            ['Phase 3', 'Public Launch', 'Open registration, remove sandbox restrictions, and publish SLA-backed service terms.'],
          ].map(([phase, title, text], i) => (
            <div key={i} className="bg-emerald-deep border border-white/10 rounded-xl p-4 text-center text-cream shadow-md">
              <span className="text-[10px] font-bold text-gold uppercase tracking-widest block mb-1">{phase}</span>
              <h4 className="font-display font-bold text-xs text-white">{title}</h4>
              <p className="text-[11px] text-cream/70 mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </LegalSection>
    </LegalPage>
  );
}
