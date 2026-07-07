import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import LegalPage, { LegalSection, BetaCallout } from '../components/LegalPage';

export default function Disclaimer() {
  return (
    <LegalPage eyebrow="Legal Notice" title="Disclaimer" updated="July 1, 2026" icon={Info}>
      <BetaCallout>
        ArukinSec is currently in beta. See our <Link to="/beta-notice" className="text-emerald-brand font-semibold underline underline-offset-2 hover:text-emerald-deep transition-colors">Beta Release Notice</Link> for details on development status, account limits, and security measures.
      </BetaCallout>

      <LegalSection icon={AlertTriangle} title={'1. Google "Unverified App" Warning'}>
        <p>When linking a Google Account as a Member, users will see Google's default <strong>"Google hasn't verified this app"</strong> warning. This is standard behavior for custom integrations and developer sandboxes.</p>
        <p><strong>CASA Tier 2 audit constraints:</strong> To remove this warning for restricted-scope apps (like Gmail and Google Drive reads), Google mandates an annual Cloud Application Security Assessment (CASA) Tier 2 audit costing <strong>$15,000–$75,000</strong> per year, currently prohibitive for an early-stage independent project.</p>
        <p>Consequently, this project runs in <strong>Developer Sandbox mode</strong> with a hard cap of <strong>100 connected user accounts</strong>.</p>
      </LegalSection>

      <LegalSection icon={Info} title={'2. "As Is" Warranty Disclaimer'}>
        <p>All services, utilities, and components on ArukinSec are provided on an "as is" and "as available" basis. We make no warranties regarding system uptime, performance reliability, or the absolute prevention of digital security threats.</p>
      </LegalSection>

      <LegalSection icon={ShieldAlert} title="3. Google API & Third-Party Actions">
        <p>ArukinSec interacts with Google APIs. We have no control over, and assume no liability for:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>API deprecation, rate-limiting, or service blackouts initiated by Google.</li>
          <li>Accidental file deletion, label modifications, or contact adjustments during console operations.</li>
          <li>Account suspension or security credential locks triggered on Google Accounts.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={Info} title="4. Limitation of Liability">
        <p>To the maximum extent permitted by applicable law, in no event shall ArukinSec, its developers, or affiliates be held liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the compliance gateways.</p>
      </LegalSection>

      <LegalSection icon={ShieldAlert} title="5. Member Protection & Consent (Anti-Stalkerware)">
        <p>ArukinSec is designed strictly for parental oversight, caregiver assistance, or corporate safety monitoring. It must <strong>never</strong> be used to monitor adults without their active, continuous consent.</p>
        <p><strong>Current limitations:</strong> we don't yet have dedicated internal real-time warning systems for monitored members, relying entirely on Google's native authorization warnings during API pairing.</p>
        <p><strong>Planned mitigations:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>24-hour consent wait time:</strong> mandatory verification delay before members can authenticate.</li>
          <li><strong>SMS & email alerts:</strong> instant notifications to the member's phone and alternate email when monitoring begins.</li>
          <li><strong>Auto log-out:</strong> short session bounds forcing managers to re-authenticate periodically.</li>
          <li><strong>Member-side billing:</strong> transitioning subscription purchases to the member's portal.</li>
          <li><strong>Strict login OTP verification:</strong> member-authorized OTP challenge every time the manager signs in.</li>
        </ul>
        <p className="text-slate-400 text-xs italic pt-1">These roadmap measures aim to prevent ArukinSec from functioning as stalkerware. Their ultimate efficacy remains to be seen in production.</p>
      </LegalSection>
    </LegalPage>
  );
}
