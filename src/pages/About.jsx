import React from 'react';
import { ShieldAlert, ArrowRight, ShieldCheck, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import MarketingNavbar from '../components/MarketingNavbar';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <MarketingNavbar />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-20 animate-fade-in">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">Helping You Care for<br/>Someone's Digital World</h1>
          
          {/* Prototype Banner */}
          <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3 text-left inline-flex">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-amber-800 font-bold text-xs mb-1 uppercase tracking-wider">Beta Release Notice</h4>
              <p className="text-amber-700/80 text-xs leading-relaxed max-w-xl">
                ArukinSec is currently in a highly experimental R&D beta phase for personal/family use. Features are rapidly evolving based on threat-intelligence testing. Our roadmap is fluid and subject to major architectural pivots.
              </p>
            </div>
          </div>
        </div>

        {/* Why Section */}
        <div className="bg-slate-900 shadow-xl border border-slate-800 rounded-3xl p-8 md:p-12 mb-20 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">Why We Built This</h3>
          <div className="space-y-4 text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto">
            <p>
              Almost everyone today has a Google account — for email, school, work, photos, and banking. But not everyone has the digital literacy to spot a sophisticated phishing attack, a malicious file, or an account takeover in progress.
            </p>
            <p>
              Children, elderly parents, and less tech-savvy family members are especially vulnerable. Meanwhile, politicians, celebrities, and executives face targeted attacks that can destroy careers overnight. We built ArukinSec to give someone you trust a window into your digital life — without giving them your password.
            </p>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-10 text-center">How We Keep Accounts Safe</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {/* Core Philosophy 1 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Phishing & Scam Detection</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We scan inbox metadata to flag suspicious emails, helping you spot phishing attempts targeting the person you're caring for — before they click something dangerous.
            </p>
          </div>

          {/* Core Philosophy 2 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Privacy-First Access</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Their password stays theirs. A simple 6-digit Connection ID links their account to your dashboard, and we never store email contents, files, or contact data on our servers.
            </p>
          </div>
        </div>

        {/* The Manifesto / Roadmap */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">What's Coming Next</h2>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            We're building features to make digital caregiving easier and more effective — always with privacy and consent at the core.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Roadmap 1 */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8">
            <h4 className="text-slate-900 font-bold mb-3 tracking-tight">Self-Hosted Privacy</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              For organizations that need complete data isolation, we offer a self-hosted deployment option. Your data stays on your infrastructure, and you retain full control over API connections.
            </p>
          </div>

          {/* Roadmap 2 */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8">
            <h4 className="text-slate-900 font-bold mb-3 tracking-tight">24-Hour Consent Cooldown</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Future updates will enforce a <strong>24-hour waiting period</strong> on new connections — giving the person being helped time to verify and confirm they want oversight.
            </p>
          </div>

          {/* Roadmap 3 */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8">
            <h4 className="text-slate-900 font-bold mb-3 tracking-tight">Secure OTP Relay</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              To assist vulnerable relatives, upcoming updates will allow Managers to securely intercept and relay time-sensitive OTP codes straight to their dashboard, avoiding risky workflows.
            </p>
          </div>

          {/* Roadmap 4 */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8">
            <h4 className="text-slate-900 font-bold mb-3 tracking-tight">Automated Threat Reports</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              ArukinSec will run automated, background API queries to compile PDF threat reports. It will automatically sniff out connected social accounts and suspicious password resets.
            </p>
          </div>

          {/* Roadmap 5 */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-3xl p-8 md:col-span-2 lg:col-span-2">
            <h4 className="text-slate-900 font-bold mb-3 tracking-tight">Expanded Google Ecosystem</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Future roadmap includes integrations for auditing YouTube watch histories, Blogger posts, and Google Photos. These APIs have been intentionally left out of this current prototype to keep the system simple, focused, and secure while we test the core architecture.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
