import React, { useState } from 'react';
import { ShieldAlert, Zap, Heart, Trash2, Mailbox, ShieldCheck, Menu, X, ArrowRight, Key, Landmark, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function UseCases() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Public Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/arukin-logo.webp" className="h-8 w-8 object-contain rounded-md shadow-sm" alt="ArukinSec Logo" />
            <span className="font-bold text-lg tracking-wide text-slate-900">ArukinSec</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">How it works</Link>
            <Link to="/use-cases" className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">Use Cases</Link>
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Pricing</Link>
            <a href="https://github.com/arukinSec" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors ml-2" title="Star on GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-50 border-b border-slate-200 px-6 py-4 space-y-4 shadow-2xl animate-fade-in">
            <Link to="/" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/how-it-works" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
            <Link to="/use-cases" className="block text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Use Cases</Link>
            <Link to="/about" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

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
