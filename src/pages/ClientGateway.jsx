import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Shield, ArrowRight, CheckCircle2, UserCheck, Home } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const STANDARD_SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/drive',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtubepartner',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtubepartner-channel-audit',
  'https://www.googleapis.com/auth/youtube.channel-memberships.creator',
  'https://www.googleapis.com/auth/youtube.third-party-link.creator',
  'https://www.googleapis.com/auth/youtube.download',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
  'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
  'https://www.googleapis.com/auth/tasks'
].join(' ');

export default function ClientGateway() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [authId, setAuthId] = useState('');
  const [authError, setAuthError] = useState('');
  const [consentError, setConsentError] = useState('');

  // Clear any active auditor variables from local storage immediately when client gateway loads
  useEffect(() => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('auditor_id');
    localStorage.removeItem('auditor_tier');
    localStorage.removeItem('auditor_auth_id');
    localStorage.removeItem('auditor_email');
    localStorage.removeItem('auditor_onboarded');
    localStorage.removeItem('auditor_role');
  }, []);

  // Auto-load authId if provided in query string e.g. ?authId=123456 or ?authId=123-456
  useEffect(() => {
    const queryId = searchParams.get('authId');
    if (queryId) {
      // Re-format slightly to make it user friendly: e.g. "123 456"
      const numbers = queryId.replace(/\D/g, '');
      if (numbers.length === 6) {
        setAuthId(numbers.slice(0, 3) + ' ' + numbers.slice(3));
      } else {
        setAuthId(queryId);
      }
    }
  }, [searchParams]);

  const checkConsentStatus = async (email) => {
    if (!email) return 1;
    try {
      const { data, error } = await supabase
        .from('members')
        .select('access_token')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (error || !data) return 1;
      return data.access_token ? 2 : 1;
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
      
      const providerToken = session.provider_token;
      const providerRefreshToken = session.provider_refresh_token;
      const auditorId = localStorage.getItem('arukin_auditor_id');
      const inputtedAuthId = localStorage.getItem('arukin_inputted_auth_id') || null;

      const parsedAuditorId = !auditorId ? null : auditorId;

      const { error } = await supabase.from('members').upsert({
        email: userEmail.toLowerCase(),
        name: userName,
        avatar_url: userAvatar,
        provider_id: supabaseUser.id,
        access_token: providerToken,
        google_refresh_token: providerRefreshToken,
        consent_granted_at: new Date().toISOString(),
        status: 'Access Granted',
        connection_status: 'CONNECTED',
        auditor_id: parsedAuditorId,
        inputted_auth_id: inputtedAuthId
      }, { onConflict: 'provider_id' });

      if (error) throw error;
      
      const isSelfAudit = localStorage.getItem('arukin_self_audit') === 'true';
      const expectedEmail = localStorage.getItem('arukin_auditor_email')?.toLowerCase() || '';
      
      let validSelfAudit = false;
      if (isSelfAudit) {
        if (userEmail.toLowerCase() === expectedEmail) {
          validSelfAudit = true;
        } else {
          window.showToast("Self-Audit cancelled: Mismatched Google account. Registered as a standard target.", "warning");
        }
      }

      // Upgrade tier for valid self audit
      if (validSelfAudit && parsedAuditorId) {
        await supabase.from('auditors')
          .update({ tier: 'TRIAL' })
          .eq('id', parsedAuditorId)
          .eq('tier', 'FREE');
        
        localStorage.setItem('auditor_tier', 'TRIAL'); // Sync immediately for dashboard
      }
      
      localStorage.removeItem('arukin_pending_flow');
      localStorage.removeItem('arukin_auditor_id');
      localStorage.removeItem('arukin_inputted_auth_id');
      localStorage.removeItem('arukin_self_audit');
      localStorage.removeItem('arukin_auditor_email');
      
      if (validSelfAudit) {
        window.location.href = '/dashboard';
        return;
      } else {
        // CRITICAL: Immediately log out of Supabase to prevent the member 
        // session from leaking into the auditor administration dashboard!
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

  const initiateGoogleAuth = async () => {
    if (!authId.trim()) {
      setAuthError('Auditor Auth ID is required to connect.');
      return;
    }

    setLoading(true);
    setLoadingText('Verifying Auditor ID...');
    setAuthError('');

    // Sanitize user entry by stripping spaces and dashes (e.g., "123 456" or "123-456" -> "123456")
    const sanitizedAuthId = authId.trim().replace(/[\s-]/g, '');

    if (!sanitizedAuthId) {
      setLoading(false);
      setAuthError('Auditor Auth ID is required to connect.');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('verify_auditor_capacity', { auth_code: sanitizedAuthId });

      if (error) {
        setLoading(false);
        setAuthError('Database lookup failed. Please try again.');
        return;
      }

      if (!data.valid) {
        setLoading(false);
        setAuthError(data.error || 'Invalid Auditor Auth ID. Please check the code and try again.');
        return;
      }

      localStorage.setItem('arukin_auditor_id', data.auditor_id);
      localStorage.removeItem('arukin_inputted_auth_id');

      localStorage.setItem('arukin_pending_flow', 'standard');

      setLoadingText('Redirecting to Google Consent...');
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
    localStorage.removeItem('arukin_auditor_id');
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

      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-4 text-white font-bold text-lg">
            A
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Arukin</h1>
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
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Auditor Auth ID
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter Auditor's unique ID"
                    value={authId}
                    onChange={(e) => { setAuthId(e.target.value); setAuthError(''); }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  />
                  {authError && (
                    <p className="text-red-400 text-xs">{authError}</p>
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
                      localStorage.removeItem('arukin_auditor_id');
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
