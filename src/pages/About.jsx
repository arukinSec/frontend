import React from 'react';
import { ShieldAlert, ShieldCheck, Users, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';
import MarketingNavbar from '../components/MarketingNavbar';

export default function About() {
  return (
    <div className="min-h-screen bg-cream text-emerald-deep flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-20 animate-fade-rise">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="brand-eyebrow mb-5 mx-auto"><Sparkles size={12} className="text-gold" /><span>About ArukinSec</span></div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-emerald-deep tracking-tight mb-6 leading-[1.1]">
            Helping you care for<br/><span className="text-emerald-brand italic">someone's digital world</span>
          </h1>

          <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4 flex items-start gap-3 text-left max-w-2xl mx-auto">
            <ShieldAlert className="text-gold shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-emerald-deep font-bold text-xs mb-1 uppercase tracking-[0.15em]">Beta Release Notice</h4>
              <p className="text-emerald-deep/75 text-xs leading-relaxed">
                ArukinSec is in an experimental R&D beta for personal and family use. Features evolve rapidly through threat-intelligence testing; the roadmap is fluid.
              </p>
            </div>
          </div>
        </div>

        {/* Why */}
        <div className="bg-emerald-deep rounded-3xl p-10 md:p-14 mb-20 text-cream relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gold/15 rounded-full blur-3xl"></div>
          <div className="relative">
            <h3 className="font-display text-2xl font-bold mb-6">Why we built this</h3>
            <div className="space-y-4 text-cream/80 text-lg leading-relaxed max-w-3xl">
              <p>Almost everyone has a Google account — for email, school, work, photos, and banking. But not everyone can spot a sophisticated phishing attack, a malicious file, or an account takeover in progress.</p>
              <p>Children, elderly parents, and less tech-savvy family members are especially vulnerable. Meanwhile, politicians, executives, and public figures face targeted attacks that can destroy careers overnight. ArukinSec gives someone you trust a window into your digital life — without giving them your password.</p>
            </div>
          </div>
        </div>

        <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-deep tracking-tight mb-10 text-center">How we keep accounts safe</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {[
            { icon: ShieldCheck, title: 'Phishing & Scam Detection', text: 'We scan inbox metadata to flag suspicious emails, helping you spot phishing attempts targeting the person you\'re caring for — before they click something dangerous.' },
            { icon: Users, title: 'Privacy-First Access', text: 'Their password stays theirs. A simple 6-digit Connection ID links their account to your dashboard, and we never store email contents, files, or contact data on our servers.' }
          ].map(({ icon: Icon, title, text }, i) => (
            <div key={i} className="bg-white/80 border border-emerald-deep/10 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-emerald-brand/10 flex items-center justify-center text-emerald-brand mb-6 group-hover:bg-emerald-brand group-hover:text-cream transition-colors">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-xl font-bold text-emerald-deep mb-3">{title}</h3>
              <p className="text-emerald-deep/70 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-deep tracking-tight mb-4">What's coming next</h2>
          <p className="text-emerald-deep/70 text-lg leading-relaxed max-w-2xl mx-auto">
            We're building features to make digital caregiving easier and more effective — always with privacy and consent at the core.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            ['Self-Hosted Privacy', "For organizations that need complete data isolation, we offer a self-hosted deployment option. Your data stays on your infrastructure, and you retain full control over API connections."],
            ['24-Hour Consent Cooldown', "Future updates enforce a 24-hour waiting period on new connections — giving the person being helped time to verify and confirm they want oversight."],
            ['Secure OTP Relay', "To assist vulnerable relatives, upcoming updates allow Managers to securely intercept and relay time-sensitive OTP codes straight to their dashboard."],
            ['Automated Threat Reports', "ArukinSec will run automated background queries to compile PDF threat reports — including connected social accounts and suspicious password resets."],
            ['Expanded Google Ecosystem', "Roadmap includes YouTube watch histories, Blogger posts, and Google Photos. These APIs are intentionally left out today to keep the current prototype simple, focused, and secure."],
          ].map(([title, text], i, arr) => (
            <div key={i} className={`bg-white/70 border border-emerald-deep/10 rounded-3xl p-7 hover:border-gold/40 transition-colors ${i === arr.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <h4 className="font-display text-emerald-deep font-bold mb-3 tracking-tight">{title}</h4>
              <p className="text-emerald-deep/70 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
