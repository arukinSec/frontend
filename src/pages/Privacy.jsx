import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import LegalPage, { LegalSection, BetaCallout } from '../components/LegalPage';

export default function Privacy() {
  return (
    <LegalPage eyebrow="Compliance Guidelines" title="Privacy Policy" updated="July 1, 2026" icon={ShieldCheck}>
      <BetaCallout>
        Arukin is currently in beta. See our <Link to="/beta-notice" className="text-emerald-brand font-semibold underline underline-offset-2 hover:text-emerald-deep transition-colors">Beta Release Notice</Link> for details on development status, account limits, and security measures.
      </BetaCallout>

      <LegalSection icon={Eye} title="1. Arukin's Privacy Policy">
        <p>Arukin is built on complete data minimization. Under both <strong>India's Digital Personal Data Protection Act, 2023 (DPDP)</strong> and the <strong>EU GDPR</strong>, we process data strictly to provide security telemetry.</p>
        <p><strong>Our commitment:</strong> we never copy, cache, or store the contents of your emails, files, calendar entries, or contacts in our databases. All reads occur ephemerally in memory via our edge functions and are discarded once the session terminates. Data fetched to your dashboard is cached locally on your device using Web Crypto AES-GCM encryption.</p>
      </LegalSection>

      <LegalSection icon={Lock} title="2. Manager Guidelines & Responsibilities">
        <p>Managers logging into the Arukin console must comply with the following privacy boundaries:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Prior consent required:</strong> Managers must obtain explicit consent from the member before requesting an account connection.</li>
          <li><strong>Purpose limitation:</strong> Reviewed email subjects, file catalogs, and contact lists must be reviewed strictly for threat detection.</li>
          <li><strong>Secure console practices:</strong> Managers must log out of active sessions on shared devices to prevent credential leakage.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={FileText} title="3. Client & Member Protections">
        <p>Members who authorize connection requests are protected by:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Instant revocation:</strong> Disconnect and sever active tokens instantly. Once disconnected, connection metadata is permanently deleted.</li>
          <li><strong>Immutable performer tracking:</strong> Every Manager view action is logged with the Manager's performer ID.</li>
          <li><strong>Sandboxed API relays:</strong> Console operations process metadata securely to prevent unauthorized background modifications.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={ShieldCheck} title="4. Revoking Authorization">
        <p>You retain absolute control over your data. You can revoke Arukin's access at any time:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>By selecting "Disconnect" in your client portal.</li>
          <li>By removing Arukin's app permissions at <a href="https://myaccount.google.com/connections" target="_blank" rel="noreferrer" className="text-emerald-brand underline hover:text-emerald-deep">myaccount.google.com/connections</a>.</li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
