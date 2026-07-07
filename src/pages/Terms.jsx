import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, UserCheck, ShieldAlert, Key } from 'lucide-react';
import LegalPage, { LegalSection, BetaCallout } from '../components/LegalPage';

export default function Terms() {
  return (
    <LegalPage eyebrow="Platform Policy" title="Terms of Service" updated="July 1, 2026" icon={BookOpen}>
      <BetaCallout>
        ArukinSec is currently in beta. See our <Link to="/beta-notice" className="text-emerald-brand font-semibold underline underline-offset-2 hover:text-emerald-deep transition-colors">Beta Release Notice</Link> for details on development status, account limits, and security measures.
      </BetaCallout>

      <LegalSection icon={UserCheck} title="1. Agreement to Terms">
        <p>By accessing the ArukinSec console or connecting a Google Account as a Member, you agree to comply with and be bound by these Terms of Service, all applicable laws, and regulations. If you do not agree, you are prohibited from using the platform.</p>
      </LegalSection>

      <LegalSection icon={Key} title="2. Authorized Consent Required">
        <p>Managers must obtain explicit consent from the member before mapping their Google Account to the ArukinSec portal. Connecting accounts without authorization is strictly prohibited and results in immediate suspension of Manager credentials.</p>
      </LegalSection>

      <LegalSection icon={ShieldAlert} title="3. Disclaimers & Limitations">
        <p>ArukinSec functions solely as a metadata transmission relay. We are not liable for:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Data loss or modifications occurring on Google Services (Gmail, Drive, Contacts).</li>
          <li>Unauthorized access resulting from Manager credential leakage.</li>
          <li>Service disruptions caused by API changes or deprecation.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={BookOpen} title="4. Changes & Revisions">
        <p>We reserve the right to revise these Terms at any time. Revisions will be published on this page with an updated timestamp. Continued use after modifications constitutes acceptance.</p>
      </LegalSection>
    </LegalPage>
  );
}
