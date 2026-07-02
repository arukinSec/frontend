import React from 'react';
import { ShieldAlert, ArrowRight, ShieldCheck, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans flex flex-col">
      {/* Public Navbar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldAlert size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide text-white">Arukin <span className="text-indigo-400 font-medium">Security Console</span></span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">How it works</Link>
            <Link to="/about" className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Pricing</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-16 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Our Mission</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-12">
          Legitimate security auditing tools are usually designed exclusively for enterprises with large IT budgets. Meanwhile, scammers exploit these same cloud APIs to target vulnerable family members. Arukin bridges this gap by providing consumers with standard-grade tools to safeguard their families.
        </p>

        <div className="space-y-12">
          {/* Core Philosophy 1 */}
          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Neutralizing Digital Phishing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We analyze key metadata alerts and system logs to identify scam signatures, helping guardians inspect inbox anomalies before they escalate.
              </p>
            </div>
          </div>

          {/* Core Philosophy 2 */}
          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Dual Identity & Data Privacy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We believe in absolute role separation. Auditors logging into Arukin Admin only provide basic identity scopes. Sensitive tokens are isolated inside separate client connections. This keeps data protected, compliant, and easy to manage without overlapping permissions.
              </p>
            </div>
          </div>

          {/* Core Philosophy 3 */}
          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Heart size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">A Safe Haven for Families</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Arukin is built as a personal safety suite. Whether you are assisting an elderly relative, auditing corporate client footprints, or reviewing your own accounts, our read-only layers and actionable tools keep security accessible.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
