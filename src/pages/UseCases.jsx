import React from 'react';
import { ShieldAlert, Heart, ShieldCheck, ArrowRight, Landmark, Users } from 'lucide-react';
import Footer from '../components/Footer';
import MarketingNavbar from '../components/MarketingNavbar';

const cases = [
  {
    icon: Heart,
    title: 'For Children & Teenagers',
    body: "Kids today grow up with Google accounts — school emails, shared Drives, YouTube. They're not equipped to spot a sophisticated phishing attack or understand why a random file in Drive is dangerous.",
    bullets: [
      'Review their inbox for scam emails without needing their password or prying into private conversations.',
      'Check their Drive for suspicious shared files or inappropriate content they may have been sent.',
      "Spot if they've signed up for services or platforms they shouldn't have access to.",
    ],
  },
  {
    icon: Users,
    title: 'For Elderly Parents & Relatives',
    body: "Older family members are frequent targets of phone scams, phishing emails, and account takeovers. They may not recognize the warning signs, and often don't know how to check if their account has been compromised.",
    bullets: [
      'Quietly oversee their account for unusual activity without bothering them with technical questions.',
      'Detect phishing emails impersonating banks, government agencies, or familiar services.',
      'Help them manage contacts and spot suspicious entries they may have accidentally added.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'For Public Figures & Executives',
    body: 'Politicians, celebrities, and high-profile executives are prime targets for spear-phishing and targeted hacking. A compromised account can leak sensitive communications or destroy a career.',
    bullets: [
      'A manager, assistant, or accountant can oversee the account without ever knowing the password.',
      'Detect unauthorized financial accounts, crypto exchange sign-ups, or password reset attempts.',
      'Scan Drive for sensitive documents shared publicly or with the wrong people.',
    ],
  },
  {
    icon: ShieldAlert,
    title: 'For Anyone Less Tech-Savvy',
    body: "Not everyone grew up with the internet. Many people have Google accounts set up for them by someone else and have no idea how to manage privacy settings, spot phishing, or check what's in their Drive.",
    bullets: [
      'Set it up once with a simple 6-digit code — no password sharing required.',
      'Monitor their account health from your own dashboard without needing to access their device.',
      'Intervene early if something looks wrong — before it becomes a real problem.',
    ],
  },
];

export default function UseCases() {
  return (
    <div className="min-h-screen bg-cream text-emerald-deep flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-20 animate-fade-rise">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="brand-eyebrow mb-5 mx-auto"><span>Use Cases</span></div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-emerald-deep tracking-tight mb-6 leading-[1.1]">
            Caring for someone's<br/><span className="text-emerald-brand italic">digital life</span>
          </h1>
          <p className="text-emerald-deep/70 text-lg leading-relaxed">
            Oversee someone else's Google account — keeping their email, files, and personal data safe. Whether you're helping a family member, managing a public figure's presence, or looking after someone new to technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cases.map(({ icon: Icon, title, body, bullets }, i) => (
            <div key={i} className="bg-white/80 border border-emerald-deep/10 rounded-3xl p-8 md:p-10 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-emerald-brand/10 text-emerald-brand flex items-center justify-center mb-6 group-hover:bg-emerald-brand group-hover:text-cream transition-colors">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-2xl font-bold text-emerald-deep mb-3">{title}</h3>
              <p className="text-emerald-deep/70 leading-relaxed mb-6">{body}</p>
              <ul className="space-y-3">
                {bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-emerald-deep/80">
                    <ArrowRight size={16} className="text-gold shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Highlight */}
          <div className="bg-emerald-deep border border-emerald-deep rounded-3xl p-8 md:p-10 text-cream md:col-span-2 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-gold/15 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-6">
                <Landmark size={22} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Account Takeover Monitoring</h3>
              <p className="text-cream/75 leading-relaxed mb-6 max-w-3xl">
                Total account loss happens quickly. The moment a hacker gains partial access, their first move is to lock you out of other connected services. Early detection is everything.
              </p>
              <ul className="grid md:grid-cols-3 gap-4">
                {[
                  ['Reset Detection', 'Instantly detect if a password reset has been triggered for a critical service.'],
                  ['Early Intervention', 'Step in before a compromised account leads to data loss or identity theft.'],
                  ['Connected Accounts Scan', 'See what third-party services have access to their Google account.'],
                ].map(([t, b], i) => (
                  <li key={i} className="bg-cream/5 border border-cream/10 rounded-2xl p-4">
                    <div className="font-display font-bold text-gold text-sm mb-1">{t}</div>
                    <p className="text-cream/70 text-sm leading-relaxed">{b}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
