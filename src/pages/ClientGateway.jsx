import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Shield, ArrowRight, ArrowLeft, CheckCircle2, UserCheck, Home, ShieldCheck, Database, Info } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const STANDARD_SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://mail.google.com/'
].join(' ');

export default function ClientGateway() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [authCode, setAuthCode] = useState(['', '', '', '', '', '']);
  const inputRefs = React.useRef([]);
  const [authError, setAuthError] = useState('');
  const [consentError, setConsentError] = useState('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Clear any active manager variables from local storage immediately when client gateway loads
  // UNLESS this is an active Self-Audit flow, in which case we MUST preserve them.
  useEffect(() => {
    const isSelfAudit = localStorage.getItem('arukin_self_audit') === 'true';
    if (!isSelfAudit) {
      localStorage.removeItem('admin_session');
      localStorage.removeItem('manager_id');
      localStorage.removeItem('manager_tier');
      localStorage.removeItem('manager_auth_id');
      localStorage.removeItem('manager_email');
      localStorage.removeItem('manager_onboarded');
      localStorage.removeItem('manager_role');
    }
  }, []);

  // Auto-load authId if provided in query string e.g. ?authId=123456 or ?authId=123-456
  useEffect(() => {
    const queryId = searchParams.get('authId');
    if (queryId) {
      const numbers = queryId.replace(/\D/g, '').slice(0, 6);
      if (numbers.length > 0) {
        const newCode = ['', '', '', '', '', ''];
        for (let i = 0; i < numbers.length; i++) {
          newCode[i] = numbers[i];
        }
        setAuthCode(newCode);
      }
    }
  }, [searchParams]);

  const checkConsentStatus = async (email) => {
    if (!email) return 1;
    try {
      const { data, error } = await supabase
        .from('members')
        .select('connection_status')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error || !data) return 1;
      return data.connection_status === 'CONNECTED' ? 2 : 1;
    } catch (err) {
      console.error('Consent check error:', err);
      return 1;
    }
  };

  const isHandlingAuth = React.useRef(false);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          const supabaseUser = session.user;
          const flow = localStorage.getItem('arukin_pending_flow');

          if (supabaseUser && flow === 'standard') {
            if (isHandlingAuth.current) return;
            isHandlingAuth.current = true;
            localStorage.removeItem('arukin_pending_flow');
            await handleConsentSaved(session, supabaseUser);
          } else if (supabaseUser) {
            setUser(supabaseUser);
            const step = await checkConsentStatus(supabaseUser.email);
            setCurrentStep(step);
          }
        } else {
          setCurrentStep(1);
        }
      } catch (err) {
        console.error('Session recovery failed:', err);
      }
    };
    handleAuthRedirect();
  }, []);

  const handleConsentSaved = async (session, supabaseUser) => {
    setLoading(true);
    setLoadingText('Saving audit consent...');
    try {
      const userEmail = supabaseUser.email;
      const userName = supabaseUser.user_metadata?.full_name || userEmail.split('@')[0];
      const userAvatar = supabaseUser.user_metadata?.avatar_url || '';
      // Removed client-side tokeninfo fetch to prevent token leakage in network history and JS heap.
      // Scopes are implicitly verified when the backend edge functions attempt their first API calls.
      const managerId = localStorage.getItem('arukin_manager_id');
      const inputtedAuthId = localStorage.getItem('arukin_inputted_auth_id') || null;

      const parsedManagerId = !managerId ? null : managerId;

      // ---- ENFORCE MAX CONNECTION LIMITS BEFORE UPSERT ----
      if (parsedManagerId) {
        // Fetch manager tier and additional slots
        const { data: managerData } = await supabase
          .from('managers')
          .select('tier, additional_slots')
          .eq('id', parsedManagerId)
          .single();

        if (managerData) {
          const { count } = await supabase
            .from('members')
            .select('*', { count: 'exact', head: true })
            .eq('manager_id', parsedManagerId);

          let absoluteMax = 3;
          if (managerData.tier === 'TRIAL') absoluteMax = 4;
          if (managerData.tier === 'PRO') absoluteMax = 5 + (managerData.additional_slots || 0);

          // We only block if they are adding a NEW account, not reconnecting an existing one
          const { data: existingMember } = await supabase
            .from('members')
            .select('id')
            .eq('provider_id', supabaseUser.id)
            .maybeSingle();

          if (!existingMember && count >= absoluteMax) {
            await supabase.auth.signOut();
            setConsentError(`Connection rejected: The Manager console has reached its maximum capacity of ${absoluteMax} connected accounts for its current tier.`);
            setCurrentStep(1);
            setLoading(false);
            return;
          }
        }
      }
      // -----------------------------------------------------

      const { error } = await supabase.from('members').upsert({
        email: userEmail.toLowerCase(),
        name: userName,
        avatar_url: userAvatar,
        provider_id: supabaseUser.id,
        consent_granted_at: new Date().toISOString(),
        status: 'Access Granted',
        connection_status: 'CONNECTED',
        manager_id: parsedManagerId,
        inputted_auth_id: inputtedAuthId
      }, { onConflict: 'provider_id' });

      if (error) throw error;
      
      const isSelfAudit = localStorage.getItem('arukin_self_audit') === 'true';
      
      let validSelfAudit = false;
      if (isSelfAudit && parsedManagerId) {
        const { data: audData } = await supabase
          .from('managers')
          .select('email')
          .eq('id', parsedManagerId)
          .single();
          
        if (audData && audData.email.toLowerCase() === userEmail.toLowerCase()) {
          validSelfAudit = true;
        } else {
          window.showToast("Self-Audit cancelled: Mismatched Google account. Registered as a standard target.", "warning");
        }
      }

      // Upgrade tier for valid self audit
      if (validSelfAudit && parsedManagerId) {
        await supabase.from('managers')
          .update({ tier: 'TRIAL' })
          .eq('id', parsedManagerId)
          .eq('tier', 'FREE');
          
        if (localStorage.getItem('manager_tier') === 'FREE') {
          localStorage.setItem('manager_tier', 'TRIAL');
          window.dispatchEvent(new Event('storage')); // Trigger any listeners
        }
      }
      
      localStorage.removeItem('arukin_pending_flow');
      localStorage.removeItem('arukin_manager_id');
      localStorage.removeItem('arukin_inputted_auth_id');
      localStorage.removeItem('arukin_self_audit');
      localStorage.removeItem('arukin_manager_email');
      
      if (validSelfAudit) {
        navigate('/dashboard');
        return;
      } else {
        // CRITICAL: Immediately log out of Supabase to prevent the member 
        // session from leaking into the manager administration dashboard!
        await supabase.auth.signOut();
      }
      setUser(supabaseUser);
      setCurrentStep(2);
    } catch (err) {
      setConsentError('Something went wrong while saving your connection. Please try again.');
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '').slice(-1);
    const newCode = [...authCode];
    newCode[index] = cleanValue;
    setAuthCode(newCode);
    setAuthError('');
    
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !authCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newCode = [...authCode];
      for (let i = 0; i < pasted.length; i++) {
        newCode[i] = pasted[i];
      }
      setAuthCode(newCode);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const initiateGoogleAuth = async () => {
    const sanitizedAuthId = authCode.join('');
    
    if (sanitizedAuthId.length !== 6) {
      setAuthError('Please enter the complete 6-digit Manager Auth ID.');
      return;
    }

    setLoading(true);
    setLoadingText('Verifying Manager ID...');
    setAuthError('');

    try {
      const { data, error } = await supabase.rpc('verify_manager_capacity', { auth_code: sanitizedAuthId });

      if (error) {
        setLoading(false);
        setAuthError('Database lookup failed. Please try again.');
        return;
      }

      if (!data.valid) {
        setLoading(false);
        setAuthError(data.error || 'Invalid Manager Auth ID. Please check the code and try again.');
        return;
      }

      localStorage.setItem('arukin_manager_id', data.manager_id);
      localStorage.removeItem('arukin_inputted_auth_id');
      localStorage.setItem('arukin_pending_flow', 'standard');

      setLoading(false);
      setDisclaimerAccepted(false); // Reset on new flow
      setShowDisclaimer(true);
    } catch (err) {
      setLoading(false);
      setAuthError('Failed to verify Manager Auth ID. Please try again.');
    }
  };

  const proceedToGoogleAuth = async () => {
    setLoading(true);
    setShowDisclaimer(false);
    setLoadingText('Redirecting to Google Consent...');
    
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/client',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          scopes: STANDARD_SCOPES
        }
      });

      if (oauthError) throw oauthError;
    } catch (err) {
      setLoading(false);
      setAuthError('Failed to start login flow. Please try again.');
    }
  };

  const handleConnectAnother = async () => {
    localStorage.removeItem('arukin_manager_id');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn(err);
    }
    setCurrentStep(1);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Return Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold z-20 cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Return Home</span>
      </button>

      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-4 text-white font-bold text-lg">
            A
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">ArukinSec</h1>
          <p className="text-slate-400 text-xs mt-1">Secure Account Gateway</p>
        </div>

        {/* Loading Screen Overlay */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm">{loadingText}</p>
          </div>
        ) : (
          <>
            {/* View Step 1: Login */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <p className="text-slate-400 text-sm text-center">
                  Link your account to authorize audit and threat monitoring protection.
                </p>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                    Manager Auth ID
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3 py-2" onPaste={handlePaste}>
                    {authCode.map((digit, idx) => (
                      <React.Fragment key={idx}>
                        <input
                          type="text"
                          maxLength={1}
                          inputMode="numeric"
                          value={digit}
                          ref={(el) => (inputRefs.current[idx] = el)}
                          onChange={(e) => handleCodeChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className="w-10 h-12 sm:w-12 sm:h-14 bg-black/40 border border-white/10 rounded-xl text-center text-lg sm:text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                        />
                        {idx === 2 && (
                          <div className="flex items-center text-slate-500 font-bold">-</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  {authError && (
                    <p className="text-red-400 text-xs text-center">{authError}</p>
                  )}
                  {consentError && (
                    <p className="text-red-400 text-xs">{consentError}</p>
                  )}
                </div>

                <button 
                  onClick={initiateGoogleAuth}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  <span>Log in with Google</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* View Step 2: Welcome */}
            {currentStep === 2 && (
              <div className="text-center py-6 flex flex-col items-center">
                <CheckCircle2 size={48} className="text-emerald-500 mb-6 animate-pulse" />
                <h2 className="text-xl font-bold text-white">Secure Connection Established</h2>
                <p className="text-slate-400 text-sm mt-2">Your account is now linked and monitored for digital safety threats.</p>
                <div className="flex flex-col gap-2 mt-8 w-full items-center">
                  <button 
                    onClick={handleConnectAnother}
                    className="w-full bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <UserCheck size={14} />
                    Connect Another Account
                  </button>
                  
                  <button 
                    onClick={async () => {
                      localStorage.removeItem('arukin_manager_id');
                      try { await supabase.auth.signOut(); } catch(e) {}
                      window.location.href = '/';
                    }}
                    className="w-full bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 px-4 py-2.5 rounded-xl text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Home size={14} />
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Target Connection Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0A0A0B]/80 backdrop-blur-sm"
            onClick={() => setShowDisclaimer(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Shield size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Security Authorization</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Before you connect your account, please carefully review the following privacy and security details.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-sm font-semibold text-emerald-300 mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} /> Data Privacy & Storage
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    ArukinSec <strong>does not</strong> store your personal emails, files, or contacts on our central servers. We solely store the secure access tokens required to fetch this data. Any data retrieved by the platform is cached locally and temporarily on your Manager's specific browser/device, adhering to strict privacy protocols.
                  </p>
                </div>
                
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-sm font-semibold text-amber-300 mb-2 flex items-center gap-2">
                    <UserCheck size={16} /> Authority & Ownership
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By proceeding, you explicitly confirm that you are the rightful owner of this Google account and possess the legal authority to grant access to its contents to your designated Manager.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                    <Info size={16} /> Agreement Terms
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By proceeding, you grant read and write access to your account to your designated Manager. You can revoke this access at any time through your Google Security settings. Read our <a href="/privacy" target="_blank" className="text-indigo-400 hover:underline">Privacy Policy</a> and <a href="/terms" target="_blank" className="text-indigo-400 hover:underline">Terms of Service</a>.
                  </p>
                </div>
              </div>
              
              {/* Explicit Checkbox Requirement */}
              <div className="flex items-start gap-3 mt-4 mb-2 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    id="accept-terms"
                    checked={disclaimerAccepted}
                    onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                    className="peer appearance-none w-4 h-4 rounded border border-slate-600 checked:bg-indigo-500 checked:border-indigo-500 cursor-pointer transition-all"
                  />
                  <CheckCircle2 size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <label htmlFor="accept-terms" className="text-xs text-slate-400 cursor-pointer select-none leading-relaxed">
                  I have read and agree to the Data Privacy, Authority & Ownership, and Agreement Terms stated above.
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-[#0A0A0B]/50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setShowDisclaimer(false)}
                className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={proceedToGoogleAuth}
                disabled={!disclaimerAccepted}
                className={`px-6 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                  disclaimerAccepted 
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 cursor-pointer' 
                    : 'bg-indigo-600/50 cursor-not-allowed opacity-50'
                }`}
              >
                I Understand & Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Links Footer */}
      <div className="mt-8 flex justify-center gap-4 text-[10px] text-slate-500 font-semibold z-10">
        <button onClick={() => navigate('/privacy')} className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</button>
        <span>•</span>
        <button onClick={() => navigate('/terms')} className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Service</button>
        <span>•</span>
        <button onClick={() => navigate('/disclaimer')} className="hover:text-slate-300 transition-colors cursor-pointer">Disclaimer</button>
      </div>
    </div>
  );
}
