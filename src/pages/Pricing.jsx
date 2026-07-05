import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, Server, Mail, Menu, X as XIcon, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Footer from '../components/Footer';

export default function Pricing() {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [proPricing, setProPricing] = useState(null);
  const navigate = useNavigate();
  const managerId = localStorage.getItem('manager_id');
  const managerEmail = localStorage.getItem('manager_email');

  useEffect(() => {
    async function fetchPricing() {
      const { data } = await supabase.from('tiers').select('slot_price_weekly, slot_price_yearly').eq('id', 'PRO').single();
      if (data) setProPricing(data);
    }
    fetchPricing();
  }, []);

  const handleCheckout = async (action) => {
    if (!managerId) {
      localStorage.setItem('arukin_trigger_upgrade_on_login', 'true');
      navigate('/manager');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      window.showToast('Initializing secure checkout...', 'info');

      // 1. Create order via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: { manager_id: managerId, action: action }
      });

      if (error || !data?.id) {
        throw new Error(error?.message || 'Failed to create checkout session');
      }

      // 2. Load Razorpay SDK
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // 3. Open Checkout
      const isWeekly = action === 'weekly-license';
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: data.id,
        name: 'ArukinSec Security',
        description: isWeekly ? '1-Week PRO License' : 'Annual PRO License',
        prefill: { email: managerEmail || '' },
        theme: { color: '#10b981' }, // Emerald
        handler: async function (response) {
          window.showToast('Payment verified! Activating local license...', 'info');
          try {
            const durationDays = isWeekly ? 7 : 365;
            const proExpiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
            
            const { error: updateErr } = await supabase
              .from('managers')
              .update({ 
                tier: 'PRO', 
                billing_cycle: isWeekly ? 'weekly' : 'yearly',
                razorpay_order_id: response.razorpay_order_id || null,
                pro_expires_at: proExpiresAt
              })
              .eq('id', managerId);
              
            if (updateErr) throw updateErr;
            localStorage.setItem('manager_tier', 'PRO');
            window.showToast('Thank you for your purchase! PRO license activated.', 'success');
          } catch (e) {
            console.error("Local activation error:", e);
            window.showToast('Payment success, but local profile sync failed.', 'warning');
          }
          setTimeout(() => {
            navigate('/dashboard'); // Redirect to dashboard
          }, 2000);
        },
        modal: {
          ondismiss: function () {
            window.showToast('Payment cancelled.', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      window.showToast(err.message || 'Checkout failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative">
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
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">Pricing</Link>
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
              {isMobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-50 border-b border-slate-200 px-6 py-4 space-y-4 shadow-2xl animate-fade-in">
            <Link to="/" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/how-it-works" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
            <Link to="/use-cases" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Use Cases</Link>
            <Link to="/about" className="block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-16 animate-fade-in flex flex-col items-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 mb-3 animate-pulse">
          ⚡ Public Beta - Early Bird Access
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 text-center font-sans">Flexible Compliance Plans</h1>
        <p className="text-slate-600 text-sm max-w-lg text-center mb-16">
          Start with free oversight of one account, or unlock full management features for multiple family members, clients, or high-profile individuals.
        </p>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-16 items-stretch">
          
          {/* Card 1: Free Tier */}
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-800 transition-colors">
            <div>
              <span className="text-xs font-semibold text-slate-600 tracking-wider uppercase bg-slate-100 px-2.5 py-1 rounded-full">Basic Audit</span>
              <div className="flex items-baseline gap-1 mt-4 mb-6">
                <span className="text-4xl font-bold text-slate-900">₹0</span>
                <span className="text-xs text-slate-500">Free forever</span>
              </div>
              
              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Read-only Inbox & Drive list</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Contact names only (numbers hidden)</li>
                <li className="flex items-center gap-2 text-slate-500"><X size={16} className="text-red-400/50" /> Drive & Gmail strictly non-interactive</li>
                <li className="flex items-center gap-2 text-slate-500"><X size={16} className="text-red-400/50" /> Social & Financial audit labels locked</li>
              </ul>
            </div>

            <div>
              <Link to="/dashboard" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">
                {managerId ? 'Go to Dashboard' : 'Start Free Scan'}
              </Link>
              <span className="block text-center text-[10px] text-slate-500 mt-3">* Limit: 1 connected member. Terms apply.</span>
            </div>
          </div>

          {/* Card 2: 7-Day Pass */}
          <div className="bg-white shadow-sm border border-emerald-500/30 rounded-2xl p-8 flex flex-col justify-between hover:border-emerald-500 transition-colors relative">
            <div>
              <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-2.5 py-1 rounded-full">Weekly Pass</span>
              <div className="flex items-baseline gap-1 mt-4 mb-6">
                <span className="text-4xl font-bold text-slate-900">
                  ₹{proPricing ? proPricing.slot_price_weekly.toLocaleString('en-IN') : '***'}
                </span>
                <span className="text-xs text-slate-500">one-time</span>
              </div>
              
              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Full PRO features for 7 days</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Connect up to 3 members</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Active operations & Previews</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Social & Financial monitors unlocked</li>
              </ul>
            </div>

            <div>
              <button 
                onClick={() => handleCheckout('weekly-license')}
                disabled={isProcessing}
                className="w-full mt-8 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium py-3 rounded-lg text-center text-sm transition-colors block cursor-pointer disabled:opacity-50"
              >
                {managerId ? 'Unlock 7-Day Pass' : 'Sign in to Buy'}
              </button>
              <span className="block text-center text-[10px] text-slate-500 mt-3">Non-recurring. Expires exactly 168 hours from purchase.</span>
            </div>
          </div>

          {/* Card 3: Hosted Pro Annual (Dark Contrast Card) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-emerald-500/50 transition-colors relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-bl-lg uppercase">
              Best Value
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Annual Pro</span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-bold text-white">
                  ₹{proPricing ? proPricing.slot_price_yearly.toLocaleString('en-IN') : '***'}
                </span>
                <span className="text-xs text-slate-400">/year</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1 mb-6">One-time payment for 1-year access. No auto-renewal, no commitment.</p>
              
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Active operations (Delete, Compose)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Secure file previews (PDFs downloadable)</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> Unlock social feed monitors</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> View full Contact details</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> We host the compliance backend</li>
              </ul>
            </div>

            <div>
              <button 
                onClick={() => handleCheckout('upgrade')}
                disabled={isProcessing}
                className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg text-center text-sm transition-colors shadow-lg shadow-emerald-500/25 block cursor-pointer disabled:opacity-50"
              >
                {managerId ? 'Unlock Annual Plan' : 'Sign in to Buy'}
              </button>
              <span className="block text-center text-[10px] text-slate-600 mt-3">* Includes 3 members. Additional slots: +₹1,200/year per member.</span>
            </div>
          </div>

        </div>

        {/* Scan Limits Disclosure */}
        <div className="w-full max-w-6xl bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-amber-800 font-semibold">
            Monthly Scan Limits: Free accounts get 1 insight scan + 2 footprint scans per month per member. 
            PRO accounts get 5 insight scans + 10 footprint scans per month per member.
          </p>
        </div>

        {/* Feature Disclaimer & Payment Support */}
        <div className="w-full max-w-6xl bg-slate-100 border border-slate-200 rounded-xl p-4 mb-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-700">Feature Availability:</strong> Not all features listed may work as expected for every Google account due to API restrictions, regional availability, or account configuration. ArukinSec is in active development — some capabilities may be limited or temporarily unavailable during beta.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed mt-2">
            <strong className="text-slate-700">Payment Issues:</strong> If your payment fails, you are charged but access is not granted, or you experience any other billing problem, please email me at <a href="mailto:dmuolhoi@gmail.com" className="text-emerald-700 hover:text-emerald-600 underline underline-offset-2 font-semibold select-all">dmuolhoi@gmail.com</a> and we will resolve it promptly.
          </p>
        </div>

        {/* Self-Hosted / Open Source Callout Section */}
        <div className="w-full max-w-6xl bg-white shadow-sm border border-slate-200 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 w-full">
            <div className="hidden md:flex h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 items-center justify-center text-teal-600 shrink-0 mt-1">
              <Server size={22} />
            </div>
            <div className="w-full">
              <span className="inline-block text-[10px] bg-teal-500/15 text-teal-700 border border-teal-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider mb-2">100% Open Source</span>
              <h3 className="text-lg font-bold text-slate-900 mb-2 md:mb-1">Self-host for free, or let us build it for you.</h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-xl">
                ArukinSec is fully open-source. You can deploy it on your own infrastructure completely for <strong>free</strong> for absolute database isolation. 
                <br/><br/>
                If you prefer a white-glove experience, you can request the <strong>Enterprise Setup Service (₹28,600 one-time)</strong>, and our team will configure your custom private cloud instance for you.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <a 
              href="https://github.com/arukinSec" 
              target="_blank" 
              rel="noreferrer"
              className="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
              View on GitHub
            </a>
            <button 
              onClick={() => setShowInquiryModal(true)}
              className="w-full md:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-center"
            >
              Request Setup Service
            </button>
          </div>
        </div>
      </main>

      {/* Inquiry Form Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Self-Hosted Setup Request</h3>
                <p className="text-slate-600 text-xs mt-1">Send us an email and we'll get back to you within 24 hours.</p>
              </div>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="text-slate-600 hover:text-slate-900 transition-colors font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-slate-700 text-sm leading-relaxed">
                Email me at <strong className="text-slate-900 select-all">dmuolhoi@gmail.com</strong> and include the following:
              </p>
              <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                <li>Your contact email</li>
                <li>Preferred hosting environment (AWS, GCP, VPS, etc.)</li>
                <li>Scope &amp; purpose of your deployment</li>
              </ul>
              <a
                href="mailto:dmuolhoi@gmail.com?subject=Self-Hosted%20Setup%20Request&body=Hi%2C%0A%0AI%20am%20interested%20in%20the%20ArukinSec%20Self-Hosted%20Enterprise%20Pass.%0A%0AHosting%20environment%3A%20%0APurpose%3A%20"
                className="w-full py-3 bg-emerald-600 hover:bg-indigo-500 text-slate-900 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <Mail size={16} /> Open Email Client
              </a>
              <p className="text-center text-[10px] text-slate-600">Opens your default email app with a pre-filled template.</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
