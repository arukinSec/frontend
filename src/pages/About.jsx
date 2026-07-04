import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, ShieldCheck, Heart, Users, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function About() {
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
            <Link to="/use-cases" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Use Cases</Link>
            <Link to="/about" className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">About</Link>
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
            <Link to="/use-cases" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Use Cases</Link>
            <Link to="/about" className="block text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

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
