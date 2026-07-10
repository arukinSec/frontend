import React from 'react';
import { ArrowRight, ShieldCheck, Bell, Mail, FileText, UserCheck, AlertCircle, Sparkles, Lock, Landmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import MarketingNavbar from '../components/MarketingNavbar';

export default function Home({ session }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (session) navigate('/dashboard');
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-cream text-emerald-deep flex flex-col">
      <MarketingNavbar />

      {/* Hero */}
      <section className="max-w-7xl w-full mx-auto px-6 py-8 md:py-24 lg:py-28">
        {/* Mobile Quick Portals (Visible only on screens showing hamburger menu, hidden on desktop) */}
        <div className="block md:hidden grid grid-cols-1 gap-4 mb-8">
          {/* Member Card */}
          <div className="bg-white border border-emerald-deep/10 rounded-2xl p-5 shadow-sm">
            <span className="text-[9px] font-bold tracking-wider text-emerald-brand uppercase bg-emerald-brand/10 px-2 py-0.5 rounded border border-emerald-brand/20">
              Member Pairing
            </span>
            <h3 className="text-base font-bold text-emerald-deep mt-2 mb-1">Connect Account</h3>
            <p className="text-emerald-deep/75 text-xs leading-relaxed mb-4">
              Enter pairing code from your manager to link Google scanning.
            </p>
            <Link to="/client" className="w-full bg-emerald-deep hover:bg-emerald-brand text-cream text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <span>Link Google Account</span> <ArrowRight size={12} />
            </Link>
          </div>

          {/* Manager Card */}
          <div className="bg-emerald-deep border border-emerald-deep rounded-2xl p-5 shadow-md text-cream">
            <span className="text-[9px] font-bold tracking-wider text-gold uppercase bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
              Caregiver Portal
            </span>
            <h3 className="text-base font-bold text-cream mt-2 mb-1">Manager Console</h3>
            <p className="text-cream/70 text-xs leading-relaxed mb-4">
              Access family oversight dashboards and configuration controls.
            </p>
            <Link to={session ? "/dashboard" : "/manager"} className="w-full bg-gold hover:bg-gold-soft text-emerald-deep text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <span>{session ? 'Go to Dashboard' : 'Sign in as Manager'}</span> <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Copy */}
          <div className="space-y-8 animate-fade-rise">
            <div className="brand-eyebrow">
              <div className="w-2 h-2 rounded-full bg-gold"></div>
              <span>Family Security Reimagined</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-emerald-deep">
              Oversight for the{' '}
              <span className="text-emerald-brand italic">modern family.</span>
            </h1>

            <p className="text-lg text-emerald-deep/75 leading-relaxed max-w-xl">
              Arukin provides intelligent Google account protection and oversight,
              ensuring your loved ones explore the digital world safely — while keeping
              their privacy intact.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/how-it-works" className="brand-btn-primary">
                Protect Your Family <ArrowRight size={16} />
              </Link>
              <Link to="/use-cases" className="brand-btn-secondary">
                See if it's for you
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-emerald-deep/10">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-cream bg-emerald-brand/30"></div>
                <div className="w-10 h-10 rounded-full border-2 border-cream bg-emerald-brand/60"></div>
                <div className="w-10 h-10 rounded-full border-2 border-cream bg-gold/70"></div>
              </div>
              <p className="text-sm text-emerald-deep/60">
                Trusted by <span className="font-bold text-emerald-deep">2,400+</span> households globally
              </p>
            </div>
          </div>

          {/* Visual: Dashboard preview */}
          <div className="relative animate-fade-rise">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-brand/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden">
              {/* Toolbar */}
              <div className="p-5 border-b border-emerald-deep/5 flex justify-between items-center bg-white/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-300"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gold/60"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-brand/60"></div>
                </div>
                <div className="text-[10px] font-bold text-emerald-deep/50 tracking-[0.2em] uppercase">Arukin Dashboard</div>
                <Bell size={14} className="text-emerald-deep/40" />
              </div>

              <div className="p-6 grid grid-cols-2 gap-4">
                {/* Security score */}
                <div className="col-span-2 bg-emerald-deep p-5 rounded-2xl text-cream shadow-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] opacity-60 uppercase tracking-[0.2em] mb-1">Account Security Health</div>
                    <div className="font-display text-3xl font-bold">98.4%</div>
                  </div>
                  <div className="w-14 h-14 rounded-full border-4 border-gold border-t-transparent flex items-center justify-center relative">
                    <ShieldCheck size={20} className="text-gold" />
                  </div>
                </div>

                {/* Active devices */}
                <div className="bg-white p-4 rounded-2xl border border-emerald-deep/5 shadow-sm">
                  <div className="text-[9px] text-emerald-deep/50 uppercase tracking-widest mb-3 font-bold">Active Devices</div>
                  <div className="space-y-3">
                    {[['S', 'w-3/4', 'bg-emerald-brand'], ['L', 'w-1/2', 'bg-tertiary']].map(([l, w, c], i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-xs font-bold text-emerald-brand">{l}</div>
                        <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
                          <div className={`${w} h-full ${c}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent activity */}
                <div className="bg-white p-4 rounded-2xl border border-emerald-deep/5 shadow-sm">
                  <div className="text-[9px] text-emerald-deep/50 uppercase tracking-widest mb-3 font-bold">Recent Activity</div>
                  <div className="space-y-2">
                    <div className="p-2 bg-emerald-brand/5 rounded-lg border border-emerald-brand/15 flex items-center gap-2">
                      <ShieldCheck size={12} className="text-emerald-brand shrink-0" />
                      <div className="flex-1 h-1.5 bg-emerald-brand/20 rounded-full"></div>
                    </div>
                    <div className="p-2 bg-tertiary/5 rounded-lg border border-tertiary/15 flex items-center gap-2">
                      <AlertCircle size={12} className="text-tertiary shrink-0" />
                      <div className="w-2/3 h-1.5 bg-tertiary/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-emerald-deep/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-white shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-deep">Google Shield Active</div>
                <div className="text-[10px] text-emerald-deep/60">Real-time monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal gateway */}
      <section className="max-w-7xl w-full mx-auto px-6 py-16 border-t border-emerald-deep/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="brand-eyebrow mb-4"><span>Access Portals</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-deep tracking-tight">Launch the Arukin Gateway</h2>
          <p className="text-emerald-deep/70 mt-4 leading-relaxed">
            Choose the portal that matches your role. Managers coordinate security while family members pair their accounts in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client */}
          <div className="bg-white/80 border border-emerald-deep/10 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
            <span className="brand-eyebrow self-start">Member Pairing</span>
            <h3 className="font-display text-2xl font-bold text-emerald-deep mt-4 mb-2">Connect Account</h3>
            <p className="text-emerald-deep/70 text-sm leading-relaxed mb-8 flex-1">
              Received a pairing code or invitation link from your manager? Connect your Google account here to activate real-time scanning.
            </p>
            <Link to="/client" className="inline-flex items-center justify-center gap-2 w-full bg-emerald-deep hover:bg-emerald-brand text-cream text-sm font-semibold py-3 rounded-xl transition-colors">
              Link Google Account <ArrowRight size={14} />
            </Link>
          </div>

          {/* Manager */}
          <div className="bg-emerald-deep border border-emerald-deep rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col text-cream relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gold/15 rounded-full blur-2xl"></div>
            <span className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/25 text-[10px] uppercase tracking-[0.2em] font-semibold text-gold">
              Caregiver Portal
            </span>
            <h3 className="font-display text-2xl font-bold text-cream mt-4 mb-2 relative">Manager Console</h3>
            <p className="text-cream/70 text-sm leading-relaxed mb-8 flex-1 relative">
              Configure scans, view alert dashboards, and secure connected devices for family members under your oversight.
            </p>
            <Link to={session ? "/dashboard" : "/manager"} className="relative inline-flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-soft text-emerald-deep text-sm font-semibold py-3 rounded-xl transition-colors">
              {session ? 'Go to Dashboard' : 'Sign in as Manager'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl w-full mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="brand-eyebrow mb-4 mx-auto"><span>What You Get</span></div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-deep tracking-tight">Everything you need to protect them</h2>
          <p className="text-emerald-deep/70 mt-4 max-w-2xl mx-auto leading-relaxed">
            Arukin connects securely to Google's APIs through a zero-knowledge backend proxy — a safe, single window into their digital life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Mail, tint: 'bg-emerald-brand/10 text-emerald-brand', title: 'Gmail Scanner', text: 'Review their inbox for phishing scams, fake invoices, and suspicious attachments. Read, archive, or trash malicious threads instantly.' },
            { icon: FileText, tint: 'bg-gold/15 text-gold', title: 'Drive Manager', text: 'Spot Google Drive files shared publicly or with scammers, and lock down anything sensitive before it spreads.' },
            { icon: UserCheck, tint: 'bg-emerald-deep/10 text-emerald-deep', title: 'Contacts Monitor', text: 'Review their contact list to catch suspicious new connections, flagged profiles, and hidden scammer numbers.' },
          ].map(({ icon: Icon, tint, title, text }, i) => (
            <div key={i} className="bg-white/80 border border-emerald-deep/10 rounded-2xl p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className={`h-12 w-12 rounded-xl ${tint} flex items-center justify-center mb-5`}>
                <Icon size={22} />
              </div>
              <h3 className="font-display text-xl font-bold text-emerald-deep mb-2">{title}</h3>
              <p className="text-emerald-deep/70 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security section */}
      <section className="max-w-7xl w-full mx-auto px-6 pb-24">
        <div className="bg-emerald-deep rounded-3xl p-10 md:p-14 text-cream relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-cream-accent/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-emerald-brand/25 blur-3xl rounded-full"></div>
 
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-accent/10 border border-cream-accent/25 text-[10px] uppercase tracking-[0.2em] font-semibold text-cream-accent mb-6">
              <Sparkles size={12} /> Enterprise Grade
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Built on serious security foundations</h2>
            <p className="text-cream/70 text-lg leading-relaxed mb-10">
              We never see your family's passwords. Arukin uses Web Crypto AES-GCM encryption and a server-side API proxy so tokens never touch the browser.
            </p>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
              <div className="bg-cream/5 backdrop-blur-sm border border-cream/10 p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={16} className="text-cream-accent" />
                  <h4 className="font-display font-bold text-cream-accent">Server-Side Proxy</h4>
                </div>
                <p className="text-sm text-cream/70">Tokens never touch the browser. Requests are routed securely through edge functions.</p>
              </div>
              <div className="bg-cream/5 backdrop-blur-sm border border-cream/10 p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Landmark size={16} className="text-cream-accent" />
                  <h4 className="font-display font-bold text-cream-accent">AES-GCM Encryption</h4>
                </div>
                <p className="text-sm text-cream/70">Cached data is encrypted at rest within IndexedDB, bound uniquely to your active session.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
