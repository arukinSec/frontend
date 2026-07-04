import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import HowItWorks from './pages/HowItWorks';
import UseCases from './pages/UseCases';
import MembersList from './pages/MembersList';
import MemberDashboard from './pages/MemberDashboard';
import ClientGateway from './pages/ClientGateway';
import AuditorGateway from './pages/AuditorGateway';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import FAQ from './pages/FAQ';
import FAQCategory from './pages/FAQCategory';
import BetaNotice from './pages/BetaNotice';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthProcessing = React.useRef(false);

  useEffect(() => {
    const handleAuthChange = async () => {
      if (isAuthProcessing.current) return;
      isAuthProcessing.current = true;
      
      try {
        const { data: { session: activeSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (activeSession && activeSession.user) {
          const isAdminSession = localStorage.getItem('admin_session') === 'true';
          if (!isAdminSession) {
            setSession(false);
            setLoading(false);
            isAuthProcessing.current = false;
            return;
          }

          const userEmail = activeSession.user.email;

          let { data: auditorData, error: fetchErr } = await supabase
            .from('managers')
            .select('*')
            .eq('email', userEmail.toLowerCase())
            .maybeSingle();

          if (fetchErr) throw fetchErr;

          if (!auditorData) {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            const proposedAuthId = String(100000 + (array[0] % 900000));
            const { data: inserted, error: insertErr } = await supabase
              .from('managers')
              .insert({
                email: userEmail.toLowerCase(),
                auth_id: proposedAuthId,
                tier: 'FREE'
              })
              .select()
              .single();

            if (insertErr) {
              // If race condition caused duplicate insert, fetch again
              if (insertErr.code === '23505' || insertErr.message.includes('duplicate')) {
                const { data: retryData } = await supabase
                  .from('managers')
                  .select('*')
                  .eq('email', userEmail.toLowerCase())
                  .single();
                auditorData = retryData;
              } else {
                throw insertErr;
              }
            } else {
              auditorData = inserted;
            }
          }

          const auditorAvatarUrl = activeSession.user.user_metadata?.avatar_url || '';

          // Self-healing: If on TRIAL, verify self-audit account is actually connected
          if (auditorData.tier === 'TRIAL') {
            const { count, error: countErr } = await supabase
              .from('members')
              .select('*', { count: 'exact', head: true })
              .eq('manager_id', auditorData.id)
              .eq('connection_status', 'CONNECTED')
              .ilike('email', auditorData.email);
              
            if (!countErr && count === 0) {
              await supabase.from('managers').update({ tier: 'FREE' }).eq('id', auditorData.id);
              auditorData.tier = 'FREE';
            }
          }

          localStorage.setItem('admin_session', 'true');
          localStorage.setItem('auditor_id', auditorData.id);
          localStorage.setItem('auditor_tier', auditorData.tier);
          localStorage.setItem('auditor_auth_id', auditorData.auth_id);
          localStorage.setItem('auditor_email', auditorData.email);
          localStorage.setItem('auditor_avatar_url', auditorAvatarUrl);
          localStorage.setItem('auditor_onboarded', String(auditorData.onboarded));
          localStorage.setItem('auditor_role', auditorData.role || 'auditor');

          setSession(true);
        } else {
          localStorage.removeItem('admin_session');
          localStorage.removeItem('auditor_id');
          localStorage.removeItem('auditor_tier');
          localStorage.removeItem('auditor_auth_id');
          localStorage.removeItem('auditor_email');
          localStorage.removeItem('auditor_onboarded');
          localStorage.removeItem('auditor_role');
          setSession(false);
        }
      } catch (err) {
        console.error("Auditor auth sync failed:", err);
        setSession(false);
      } finally {
        setLoading(false);
        isAuthProcessing.current = false;
      }
    };

    handleAuthChange();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Only re-run if it's a substantive change to avoid redundant overlapping fetches
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        handleAuthChange();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-slate-400 font-sans relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Initializing Console...</span>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Routes>
      <Route 
        path="/" 
        element={<Home session={session} />} 
      />
      <Route 
        path="/about" 
        element={<About />} 
      />
      <Route 
        path="/how-it-works" 
        element={<HowItWorks />} 
      />
      <Route 
        path="/pricing" 
        element={<Pricing />} 
      />
      <Route 
        path="/use-cases" 
        element={<UseCases />} 
      />
      <Route 
        path="/faq" 
        element={<FAQ />} 
      />
      <Route 
        path="/faq/:categoryId" 
        element={<FAQCategory />} 
      />
      <Route 
        path="/dashboard" 
        element={session ? <MembersList /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/member/:id" 
        element={session ? <MemberDashboard /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/client" 
        element={<ClientGateway />} 
      />
      <Route 
        path="/auditor" 
        element={session ? <Navigate to="/dashboard" replace /> : <AuditorGateway />} 
      />
      <Route 
        path="/privacy" 
        element={<Privacy />} 
      />
      <Route 
        path="/terms" 
        element={<Terms />} 
      />
      <Route 
        path="/disclaimer" 
        element={<Disclaimer />} 
      />
      <Route 
        path="/beta-notice" 
        element={<BetaNotice />} 
      />
     </Routes>
    </>
  );
}

// ── Global Toast System ───────────────────────────────────────────────────────
export function ToastContainer() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const { type, message } = e.detail;
      setToast({ type, message });
      
      // Auto-clear toast after 4 seconds
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('arukin-toast', handleToastEvent);
    return () => window.removeEventListener('arukin-toast', handleToastEvent);
  }, []);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';
  const isInfo = toast.type === 'info';

  let icon = (
    <svg className="w-5 h-5 text-emerald-500 fill-current" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.707l-4.5 4.5a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L8.5 11.086l3.793-3.793a1 1 0 111.414 1.414z"/></svg>
  );
  if (isError) {
    icon = (
      <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>
    );
  } else if (isWarning || isInfo) {
    icon = (
      <svg className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9V9h2v4zm0-6H9V5h2v2z"/></svg>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-9999 animate-slide-up select-none">
      <div className="bg-[#12121A]/95 border border-white/10 rounded-2xl shadow-2xl p-4 flex items-start gap-3 w-80 backdrop-blur-md">
        <div className="shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            {isError ? 'Action Failed' : isWarning ? 'Warning' : isInfo ? 'System Info' : 'Success'}
          </h4>
          <p className="text-xs text-white font-medium leading-relaxed">{toast.message}</p>
        </div>
        <button 
          onClick={() => setToast(null)}
          className="text-slate-500 hover:text-white transition-colors p-0.5 hover:bg-white/5 rounded"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
        </button>
      </div>
    </div>
  );
}

// Global helper for simple alert displacement
window.showToast = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent('arukin-toast', { detail: { type, message } }));
};
