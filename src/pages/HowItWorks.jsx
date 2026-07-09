import React from 'react';
import { ArrowRight, CheckCircle2, LogIn, Key, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import MarketingNavbar from '../components/MarketingNavbar';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-cream text-emerald-deep flex flex-col">
      <MarketingNavbar />

      {/* Hero */}
      <section className="border-b border-emerald-deep/10">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="brand-eyebrow mb-5 mx-auto"><span>Four Simple Steps</span></div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-emerald-deep tracking-tight leading-[1.1]">
            How ArukinSec <span className="text-emerald-brand italic">works</span>
          </h1>
          <p className="text-emerald-deep/70 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Look after someone's Google account in minutes — with their consent, without their password, and with full transparency.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-24 md:space-y-32">

          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <StepBadge n={1} />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep tracking-tight mb-3">Register as a Manager</h2>
              <p className="text-emerald-deep/75 leading-relaxed mb-6">
                Head to the homepage and click <strong>Sign in with Google</strong> on the Manager Dashboard card. That's it — you're now registered. No credit card, no setup fees.
              </p>
              <Link to="/" className="brand-btn-primary">
                <LogIn size={16} /> Go to Homepage <ArrowRight size={16} />
              </Link>
            </div>
            <StepImage src="/step-1-illustration.webp" alt="Sign in with Google" order={1} />
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <StepImage src="/step-2-illustration.webp" alt="Connection ID" order={1} />
            <div className="order-2">
              <StepBadge n={2} />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep tracking-tight mb-3">Get your Connection ID</h2>
              <p className="text-emerald-deep/75 leading-relaxed mb-6">
                Once signed in, you'll see your unique 6-digit <strong>Connection ID</strong>. Copy it, or click the link icon to share a magic link — no typing required.
              </p>
              <div className="flex items-center gap-3 p-4 bg-emerald-deep rounded-xl shadow-md w-fit">
                <Key size={18} className="text-gold shrink-0" />
                <span className="font-mono text-lg font-bold text-cream tracking-widest">123-456</span>
                <div className="h-8 w-8 rounded-lg bg-cream/10 hover:bg-cream/20 flex items-center justify-center text-cream transition-colors">
                  <Link2 size={14} />
                </div>
              </div>
              <p className="text-xs text-emerald-deep/50 mt-2">Your ID with the copy-link button</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <StepBadge n={3} />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep tracking-tight mb-3">Member authenticates</h2>
              <p className="text-emerald-deep/75 leading-relaxed mb-6">
                Send them the link or ID. They visit the Member Portal, sign in with their own Google account, and grant permission. <strong>No password sharing</strong> — Google handles authentication.
              </p>
              <ul className="space-y-3">
                {[
                  'They keep full control — revoke access anytime',
                  'Google sends them an instant security alert',
                  'Limited access by default — they approve what to share',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-deep/80">
                    <CheckCircle2 size={16} className="text-emerald-brand mt-0.5 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <StepImage src="/step-3-illustration.webp" alt="Member authenticates" order={2} />
          </div>

          {/* Deep-Dive: Security & Consent Safeguards */}
          <div className="border-y border-emerald-deep/10 py-16 text-left max-w-4xl mx-auto">
            <div className="brand-eyebrow mb-4"><span>Safe by Design</span></div>
            <h2 className="font-display text-3xl font-bold text-emerald-deep tracking-tight mb-6">Our Consent & Security Safeguards</h2>
            <p className="text-emerald-deep/75 leading-relaxed mb-8">
              ArukinSec was built specifically to prevent misuse or surveillance. Unlike standard background spyware, our platform operates entirely on official API authorization channels and mandates open consent.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/60 border border-emerald-deep/10 rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-emerald-deep mb-2 flex items-center gap-2">
                  <span className="text-emerald-brand">✔</span> Opt-In Transparency
                </h3>
                <p className="text-xs text-emerald-deep/75 leading-relaxed">
                  Google will send the paired member an automated email confirmation detailing the access granted. They can click "Revoke Access" from their Google settings panel at any time.
                </p>
              </div>

              <div className="bg-white/60 border border-emerald-deep/10 rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-emerald-deep mb-2 flex items-center gap-2">
                  <span className="text-emerald-brand">✔</span> Cryptographic Protection
                </h3>
                <p className="text-xs text-emerald-deep/75 leading-relaxed">
                  Pairing configurations and active scan sessions are encrypted client-side using browser AES-GCM algorithms, preventing unauthorized read access.
                </p>
              </div>

              <div className="bg-white/60 border border-emerald-deep/10 rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-emerald-deep mb-2 flex items-center gap-2">
                  <span className="text-emerald-brand">✔</span> Audited Read Scopes
                </h3>
                <p className="text-xs text-emerald-deep/75 leading-relaxed">
                  We only look at headers, connected apps, and document configuration settings. We do not index key logs, read private message contents, or track device locations.
                </p>
              </div>

              <div className="bg-white/60 border border-emerald-deep/10 rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg text-emerald-deep mb-2 flex items-center gap-2">
                  <span className="text-emerald-brand">✔</span> Google Edge Proxy
                </h3>
                <p className="text-xs text-emerald-deep/75 leading-relaxed">
                  All requests route through serverless edge functions. Your active access tokens are never exposed directly to browser queries.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="text-center max-w-2xl mx-auto">
            <StepBadge n={4} large />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-emerald-deep tracking-tight mb-3">Start managing</h2>
            <p className="text-emerald-deep/75 leading-relaxed mb-8">
              They appear on your dashboard. Monitor their inbox, review Drive files, and check connected apps — all from one place. Log in anytime to check in.
            </p>
            <Link to="/" className="brand-btn-primary">Go to Homepage <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-deep text-cream border-t border-emerald-deep/10">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gold/20 blur-3xl rounded-full"></div>
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-cream/70 mb-8 max-w-lg mx-auto">
              Sign up for free and start looking after someone's digital safety in under a minute.
            </p>
            <Link to="/manager" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold hover:bg-gold-soft text-emerald-deep font-semibold rounded-xl transition-all shadow-lg">
              Start Looking After Them <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StepBadge({ n, large = false }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-emerald-brand text-cream font-display font-bold mb-4 shadow-lg shadow-emerald-brand/25 ${large ? 'h-14 w-14 text-lg' : 'h-10 w-10 text-sm'}`}>
      {n}
    </div>
  );
}
function StepImage({ src, alt, order }) {
  return (
    <div className={`order-${order} flex justify-center`}>
      <div className="relative">
        <div className="absolute -inset-4 bg-gold/10 rounded-[2rem] blur-2xl"></div>
        <img src={src} alt={alt} className="relative w-full max-w-sm rounded-3xl border border-emerald-deep/10 shadow-xl" />
      </div>
    </div>
  );
}
