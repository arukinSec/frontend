import React, { useState } from 'react';
import { Shield, Copy, Check, ArrowRight, Share2, Sparkles, User, Users, Lock, Eye } from 'lucide-react';

export default function ManagerOnboarding({ managerAuthId, onClose }) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const totalSteps = 7;

  // Format code to display nicely (e.g., "123 456")
  const formattedId = managerAuthId && managerAuthId.length === 6 
    ? `${managerAuthId.substring(0, 3)} ${managerAuthId.substring(3)}` 
    : managerAuthId;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteMessage = `Hello! I am setting up our family safety workspace on Arukin. Please open this link: ${window.location.origin}/client and enter my Manager Auth ID: ${formattedId} to link your account so I can check for security alerts.`;

  const handleShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[16px] p-4 select-none">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-brand/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Onboarding Container - Wide horizontal layout with strict no-scroll constraints */}
      <div className="w-full max-w-3xl bg-[#0a0a0c] border border-white/10 rounded-3xl p-4 md:p-10 shadow-2xl relative z-10 overflow-hidden flex flex-col justify-between min-h-[300px] md:min-h-[360px] max-h-[85vh]">
        
        {/* Top Indicators */}
        <div className="flex items-center justify-between shrink-0 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
              <Shield size={12} />
            </div>
            <span className="text-[10px] font-bold text-cream/50 uppercase tracking-widest">Get Started</span>
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 === step ? 'w-6 bg-emerald-brand' : 'w-1.5 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Slides - Structured horizontally using grid layouts */}
        <div className="flex-1 flex flex-col justify-start overflow-y-auto min-h-0">
          
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-slide-up">
              <div className="md:col-span-3 flex justify-center">
                <div className="h-20 w-20 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
                  <Sparkles size={36} />
                </div>
              </div>
              <div className="md:col-span-9 space-y-2">
                <h2 className="font-display text-xl font-bold text-white tracking-tight leading-tight">Welcome to Arukin</h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Thank you for signing up. This security console helps you protect your family members and loved ones from online scams, phishing, and account takeover attempts.
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Let's take a quick look at how the service works so you can get set up in minutes.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: What the service offers */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-slide-up">
              <div className="md:col-span-3 flex justify-center">
                <div className="h-20 w-20 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
                  <Shield size={36} />
                </div>
              </div>
              <div className="md:col-span-9 space-y-2">
                <h2 className="font-display text-xl font-bold text-white tracking-tight leading-tight">What Arukin Does</h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Arukin acts as a remote view-and-cleanup link to help you verify security and directory settings on your member's Google account:
                </p>
                <div className="grid grid-cols-3 gap-2.5 mt-2">
                  <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-white block">Email Review</span>
                    <p className="text-[9px] text-slate-500 mt-0.5">Read safety warning notifications.</p>
                  </div>
                  <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-white block">Drive Directory</span>
                    <p className="text-[9px] text-slate-500 mt-0.5">Index stored files and folders.</p>
                  </div>
                  <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-white block">Active Cleanup</span>
                    <p className="text-[9px] text-slate-500 mt-0.5">Trash malicious threats directly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Clarifying the roles */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-slide-up">
              <div className="md:col-span-3 flex justify-center">
                <div className="h-20 w-20 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
                  <Users size={36} />
                </div>
              </div>
              <div className="md:col-span-9 space-y-2">
                <h2 className="font-display text-xl font-bold text-white tracking-tight leading-tight">Understanding Roles</h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  To isolate privileges, Arukin keeps roles separated:
                </p>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex gap-2 items-center">
                    <User size={14} className="text-gold shrink-0" />
                    <div>
                      <h4 className="font-semibold text-xs text-white">Manager (You)</h4>
                      <p className="text-[9px] text-slate-500">Reviews console feeds.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex gap-2 items-center">
                    <Users size={14} className="text-emerald-brand shrink-0" />
                    <div>
                      <h4 className="font-semibold text-xs text-white">Member (Loved One)</h4>
                      <p className="text-[9px] text-slate-500">Grants target scopes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Control levels - Gmail & Drive */}
          {step === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-slide-up">
              <div className="md:col-span-3 flex justify-center">
                <div className="h-20 w-20 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
                  <Lock size={36} />
                </div>
              </div>
              <div className="md:col-span-9 space-y-2">
                <h2 className="font-display text-xl font-bold text-white tracking-tight leading-tight">Gmail & Drive Protection</h2>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="font-semibold text-xs text-white block mb-0.5">Gmail & Drive Cleanup</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">View alerts, index folders, and actively trash threat files or emails (requires Pro).</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="font-semibold text-xs text-white block mb-0.5">Neutralize Hijackers</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Scammers use Drive folders to host phishing scripts. Spot and delete those files instantly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Control levels - Contacts */}
          {step === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-slide-up">
              <div className="md:col-span-3 flex justify-center">
                <div className="h-20 w-20 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
                  <Eye size={36} />
                </div>
              </div>
              <div className="md:col-span-9 space-y-2">
                <h2 className="font-display text-xl font-bold text-white tracking-tight leading-tight">Contacts Auditing</h2>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="font-semibold text-xs text-white block mb-0.5">Read-Only Contacts</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Check contact sheets to find unrecognized or suspicious emails. Contacts cannot be edited.</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="font-semibold text-xs text-white block mb-0.5">Privacy Guard</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">We only query basic metadata to index client names. No permanent detail harvesting is done.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: How to authenticate members */}
          {step === 6 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-slide-up">
              <div className="md:col-span-3 flex justify-center">
                <div className="h-20 w-20 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
                  <Eye size={36} />
                </div>
              </div>
              <div className="md:col-span-9 space-y-2">
                <h2 className="font-display text-xl font-bold text-white tracking-tight leading-tight">How to Connect a Member</h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Link your family member or client in three quick steps:
                </p>
                <div className="grid grid-cols-3 gap-2.5 mt-2">
                  <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[10px] text-gold font-bold block">1. Share ID</span>
                    <p className="text-[9px] text-slate-500 mt-0.5">Send them your Manager ID key.</p>
                  </div>
                  <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[10px] text-gold font-bold block">2. Input Token</span>
                    <p className="text-[9px] text-slate-500 mt-0.5">They enter it on the gateway.</p>
                  </div>
                  <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
                    <span className="text-[10px] text-gold font-bold block">3. Grant Auth</span>
                    <p className="text-[9px] text-slate-500 mt-0.5">They connect their Google account.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Token Sharing */}
          {step === 7 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center animate-slide-up">
              <div className="md:col-span-3 flex justify-center">
                <div className="h-20 w-20 rounded-2xl bg-emerald-brand/10 border border-emerald-brand/20 flex items-center justify-center text-emerald-brand">
                  <Share2 size={36} />
                </div>
              </div>
              <div className="md:col-span-9 space-y-2 text-left">
                <h2 className="font-display text-xl font-bold text-white tracking-tight leading-tight">Your Manager Auth ID</h2>
                
                {/* Security ID Badge */}
                <div className="p-4 bg-white/[0.02] border border-emerald-brand/20 rounded-2xl flex items-center justify-between gap-4 mt-2">
                  <div>
                    <span className="text-[9px] font-bold text-gold uppercase tracking-wider block mb-0.5">Your Manager ID</span>
                    <span className="text-lg font-mono font-bold text-white tracking-wider">{formattedId}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copied ? <Check size={12} className="text-emerald-brand" /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button 
                      onClick={handleShare}
                      className="bg-gold hover:bg-gold-soft text-emerald-deep px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-md"
                    >
                      <Share2 size={12} />
                      <span>Invite</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              disabled={step === 1}
              onClick={() => setStep(prev => prev - 1)}
              className="text-xs font-semibold text-slate-500 hover:text-white disabled:opacity-0 disabled:cursor-default transition-colors cursor-pointer"
            >
              Back
            </button>
            
            {step < totalSteps && (
              <button 
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                Skip Onboarding
              </button>
            )}
          </div>
          
          {step < totalSteps ? (
            <button 
              onClick={() => setStep(prev => prev + 1)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="bg-gold hover:bg-gold-soft text-emerald-deep text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-black/10 cursor-pointer"
            >
              Enter Console
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
