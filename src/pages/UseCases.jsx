import React from 'react';
import { ShieldAlert, Zap, Heart, Trash2, Mailbox, ShieldCheck, ArrowRight, Key, Landmark, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import MarketingNavbar from '../components/MarketingNavbar';

export default function UseCases() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <MarketingNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-20 animate-fade-in">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">Caring for someone's<br/><span className="text-emerald-600">digital life</span></h1>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            ArukinSec lets you oversee someone else's Google account — helping you keep their email, files, and personal data safe. Whether you're helping a family member, managing a public figure's online presence, or looking after someone less familiar with technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Use Case 1: For Children & Teenagers */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Heart size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">For Children & Teenagers</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Kids today grow up with Google accounts — school emails, shared Drives, YouTube. They're not equipped to spot a sophisticated phishing attack or understand why a random file in Drive is dangerous.
            </p>
            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Review their inbox for scam emails without needing their password or prying into private conversations.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Check their Drive for suspicious shared files or inappropriate content they may have been sent.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Spot if they've signed up for services or platforms they shouldn't have access to.</span></li>
            </ul>
          </div>

          {/* Use Case 2: For Elderly Parents & Relatives */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">For Elderly Parents & Relatives</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Older family members are frequent targets of phone scams, phishing emails, and account takeovers. They may not recognize the warning signs, and they often don't know how to check if their account has been compromised.
            </p>
            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Quietly oversee their account for unusual activity without bothering them with technical questions.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Detect phishing emails impersonating banks, government agencies, or familiar services.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Help them manage their contacts and spot suspicious entries they may have accidentally added.</span></li>
            </ul>
          </div>

          {/* Use Case 3: For Public Figures & Executives */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">For Public Figures & Executives</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Politicians, celebrities, and high-profile executives are prime targets for spear-phishing, social engineering, and targeted hacking. A compromised account can leak sensitive communications or destroy a career.
            </p>
            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">A manager, assistant, or accountant can oversee the account without ever knowing the password.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Detect unauthorized financial accounts, crypto exchange sign-ups, or password reset attempts.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Scan Drive for sensitive documents that may have been shared publicly or with the wrong people.</span></li>
            </ul>
          </div>

          {/* Use Case 5: For the Less Tech-Savvy */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">For Anyone Less Tech-Savvy</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Not everyone grew up with the internet. Many people have Google accounts set up for them by someone else and have no idea how to manage privacy settings, spot phishing, or check what's in their Drive.
            </p>
            <ul className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Set it up once with a simple 6-digit code — no password sharing required.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Monitor their account health from your own dashboard without needing to access their device.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-600 shrink-0 mt-0.5" /> <span className="leading-relaxed">Intervene early if something looks wrong — before it becomes a real problem.</span></li>
            </ul>
          </div>

          {/* Use Case 6: Account Takeover Monitoring */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group md:col-span-2">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Landmark size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Account Takeover Monitoring</h3>
            <p className="text-slate-400 leading-relaxed mb-8">
              Total account loss happens quickly. The moment a hacker gains partial access, their first move is to lock you out of other connected services. Early detection is everything.
            </p>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="leading-relaxed"><strong>Reset Detection:</strong> Instantly detect if a password reset has been triggered for a critical service.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="leading-relaxed"><strong>Early Intervention:</strong> Step in before a compromised account leads to data loss or identity theft.</span></li>
              <li className="flex items-start gap-3"><ArrowRight size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span className="leading-relaxed"><strong>Connected Accounts Scan:</strong> See what third-party services have access to their Google account.</span></li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
