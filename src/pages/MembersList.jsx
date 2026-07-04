import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, RefreshCw, CheckCircle2, ShieldAlert, LogOut, ShieldCheck, MoreVertical, Settings, AlertTriangle, Link as LinkIcon, Lock, Trash2, Zap, Info
} from 'lucide-react';
import ManagerOnboarding from '../components/ManagerOnboarding';
import { getEncryptedItem, setEncryptedItem, removeEncryptedItem } from '../utils/cache';
import { useManager } from '../utils/useManager';

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUpgradeLockModal, setShowUpgradeLockModal] = useState({ open: false, title: '', message: '', action: null });
  const [showConfirmModal, setShowConfirmModal] = useState({ open: false, title: '', message: '', requireInput: false, action: null });
  const [showSelfAuditModal, setShowSelfAuditModal] = useState(false);
  const [selfAuditAccepted, setSelfAuditAccepted] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [showDangerZone, setShowDangerZone] = useState(false);
  const navigate = useNavigate();

  const { manager, loading: managerLoading } = useManager();
  const [managerAuthId, setManagerAuthId] = useState(localStorage.getItem('manager_auth_id') || 'Unknown');
  const [managerTier, setManagerTier] = useState(null);
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [additionalSlots, setAdditionalSlots] = useState(0);
  const managerEmail = localStorage.getItem('manager_email') || '';
  const managerAvatarUrl = localStorage.getItem('manager_avatar_url') || '';

  // Format 6-digit code with a dash in the middle (e.g., "123-456")
  const formattedAuthId = managerAuthId && managerAuthId.length === 6
    ? `${managerAuthId.substring(0, 3)}-${managerAuthId.substring(3)}`
    : managerAuthId;

  useEffect(() => {
    if (manager) {
      setManagerTier(manager.tier);
      setAdditionalSlots(manager.additional_slots || 0);
      setBillingCycle(manager.billing_cycle || 'yearly');
      setManagerAuthId(manager.auth_id || localStorage.getItem('manager_auth_id') || 'Unknown');
      localStorage.setItem('manager_onboarded', String(manager.onboarded));
      localStorage.setItem('manager_role', manager.role || 'manager');

      const triggerUpgrade = localStorage.getItem('arukin_trigger_upgrade_on_login') === 'true';
      if (triggerUpgrade && manager.tier === 'FREE') {
        localStorage.removeItem('arukin_trigger_upgrade_on_login');
        setTimeout(() => { handleUpgrade(); }, 800);
      } else if (manager.tier === 'PRO') {
        localStorage.removeItem('arukin_trigger_upgrade_on_login');
      }
    }

    const dbOnboarded = localStorage.getItem('manager_onboarded') === 'true';
    if (!dbOnboarded) {
      setShowOnboarding(true);
    }
    fetchMembers();
  }, [manager]);

  const handleCloseOnboarding = async () => {
    const managerId = localStorage.getItem('manager_id');
    if (managerId) {
      // Update database profile directly
      const { error } = await supabase
        .from('managers')
        .update({ onboarded: true })
        .eq('id', managerId);
      
      if (!error) {
        localStorage.setItem('manager_onboarded', 'true');
      }
    }
    setShowOnboarding(false);
  };

  const fetchMembers = async () => {
    setLoading(true);
    const managerId = localStorage.getItem('manager_id');
    
    if (!managerId) {
      setLoading(false);
      return;
    }

    // Fetch active connected members assigned to this manager
    const { data, error } = await supabase
      .from('members')
      .select('id, name, email, avatar_url, connection_status, created_at, manager_id, provider_id, tier')
      .eq('manager_id', managerId)
      .eq('connection_status', 'CONNECTED')
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    } else {
      setMembers(data || []);
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const handleUnlockTrialClick = () => {
    setSelfAuditAccepted(false);
    setShowSelfAuditModal(true);
  };

  const handleSelfAuditAccept = async () => {
    setShowSelfAuditModal(false);
    const managerId = localStorage.getItem('manager_id');
    if (!managerId) return;

    localStorage.setItem('arukin_manager_id', managerId);
    localStorage.setItem('arukin_pending_flow', 'standard');
    localStorage.setItem('arukin_self_audit', 'true');
    localStorage.setItem('arukin_manager_email', localStorage.getItem('manager_email') || '');

    const STANDARD_SCOPES = [
      'openid',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/contacts',
      'https://www.googleapis.com/auth/drive.readonly',
      'https://mail.google.com/'
    ].join(' ');

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/client',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          login_hint: localStorage.getItem('manager_email') || ''
        },
        scopes: STANDARD_SCOPES
      }
    });

    if (oauthError) {
      window.showToast("Failed to start self-audit flow", "error");
    }
  };

  const handleAddonSlot = async () => {
    try {
      window.showToast('Initializing slot checkout...', 'info');

      // 1. Create order via Supabase Edge Function with action 'add-slot'
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          manager_id: localStorage.getItem('manager_id'),
          action: 'add-slot'
        }
      });

      if (error || !data?.id) {
        throw new Error(error?.message || 'Failed to create slot order');
      }

      // 2. Load Razorpay script
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
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: data.id,
        name: 'Arukin Security',
        description: 'Purchase Additional Manager Connection Slot',
        prefill: {
          email: localStorage.getItem('manager_email') || '',
        },
        theme: {
          color: '#6366f1'
        },
        handler: function (response) {
          window.showToast('Slot purchased successfully! Syncing console...', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 3500);
        },
        modal: {
          ondismiss: function () {
            window.showToast('Checkout cancelled.', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Slot purchase error:', err);
      window.showToast(err.message || 'Slot checkout failed.', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn(err);
    }
    localStorage.removeItem('admin_session');
    localStorage.removeItem('manager_id');
    localStorage.removeItem('manager_tier');
    localStorage.removeItem('manager_auth_id');
    localStorage.removeItem('manager_email');
    localStorage.removeItem('manager_role');
    localStorage.removeItem('arukin_onboarded_completed');
    window.location.reload();
  };

  const handleClearCache = async (memberId) => {
    try {
      window.showToast('Local OSINT cache cleared for this member.', 'success');
    } catch (e) {
      console.error(e);
      window.showToast('Failed to clear cache.', 'error');
    }
  };

  const filteredMembers = members.filter(member => 
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Onboarding Wizard Overlay */}
      {showOnboarding && (
        <ManagerOnboarding 
          managerAuthId={managerAuthId} 
          onClose={handleCloseOnboarding} 
        />
      )}
      {/* Console Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[16px] p-4">
          <div className="w-full max-w-md bg-[#0E0E12] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden animate-slide-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings size={18} className="text-indigo-400" />
                <span>Console Settings</span>
              </h3>
              <button 
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowDangerZone(false);
                }}
                className="text-slate-500 hover:text-white transition-colors text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* General Settings Stats */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-xl text-xs">
                <span className="text-slate-400">Account Owner</span>
                <span className="text-slate-200 font-medium">{managerEmail}</span>
              </div>
              <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-xl text-xs">
                <span className="text-slate-400">Security Scope</span>
                <span className="text-slate-200 font-medium">Standard Compliance Gateways</span>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-500/20 rounded-2xl bg-red-500/[0.02] p-4">
              <button 
                onClick={() => setShowDangerZone(!showDangerZone)}
                className="flex items-center justify-between w-full text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-400" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Danger Zone</span>
                </div>
                <span className="text-[10px] text-slate-500 hover:text-white transition-colors">
                  {showDangerZone ? 'Hide' : 'Show'}
                </span>
              </button>

              {showDangerZone && (
                <div className="mt-4 pt-4 border-t border-red-500/10 space-y-3 animate-fade-in">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Permanently delete your Manager console profile. All connected member connections will be immediately wiped from the database.
                  </p>
                  
                  <button 
                    onClick={async () => {
                      const managerId = localStorage.getItem('manager_id');
                      if (managerId) {
                        setShowConfirmModal({
                          open: true,
                          title: 'Permanently Delete Account',
                          message: 'All connected members will be immediately removed. This action cannot be undone.',
                          requireInput: true,
                          action: async () => {
                            // 1. Wipe connected members
                            const { error: memberErr } = await supabase
                              .from('members')
                              .delete()
                              .eq('manager_id', managerId);

                            if (memberErr) {
                              console.warn("Failed to delete connected members:", memberErr);
                            }

                            // 2. Wipe manager profile
                            const { error: managerErr } = await supabase
                              .from('managers')
                              .delete()
                              .eq('id', managerId);

                            if (managerErr) {
                              window.showToast('Failed to delete account.', 'error');
                            } else {
                              handleLogout();
                              window.showToast('Account deleted permanently.', 'success');
                            }
                          }
                        });
                      }
                    }}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold py-2.5 rounded-xl transition-all block text-center cursor-pointer"
                  >
                    Delete Manager Profile
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 shrink-0">
            <img src="/arukin-logo.jpg" className="h-8 w-8 object-contain rounded-md shadow-sm" alt="Arukin Logo" />
            <span className="hidden md:block font-bold text-lg tracking-wide text-white">Arukin</span>
          </div>

          <div className="flex items-center gap-3 md:gap-6 shrink-0 mr-2 md:mr-6">
            {/* Display formatted Manager ID and Copy Link */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="flex items-center gap-1 md:gap-2 bg-white/[0.02] border border-white/10 px-2.5 md:px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider">
                <span className="hidden md:inline text-slate-500">ID:</span>
                <strong className="text-white">{formattedAuthId}</strong>
              </div>
              <button
                onClick={() => {
                   const shareUrl = `${window.location.origin}/client?authId=${managerAuthId}`;
                   navigator.clipboard.writeText(shareUrl);
                   window.showToast("Share Link Copied! Send this link to members to connect them instantly.", "success");
                 }}
                className="p-1.5 md:p-2 hover:bg-indigo-500/10 hover:text-indigo-400 border border-white/10 rounded-full transition-all text-slate-400 cursor-pointer"
                title="Copy Client Share Link"
              >
                <LinkIcon size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4 relative">
              <button onClick={fetchMembers} className="p-1.5 md:p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white" title="Refresh">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>

              {/* Profile Avatar Trigger Button */}
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="h-8 w-8 rounded-full border border-white/10 bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase select-none hover:ring-2 ring-indigo-500/30 transition-all cursor-pointer overflow-hidden"
              >
                {managerAvatarUrl ? (
                  <img 
                    src={managerAvatarUrl} 
                    alt="Manager Avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      // Force letter rendering fallback
                      const textSpan = document.createElement('span');
                      textSpan.innerText = managerEmail ? managerEmail.charAt(0).toUpperCase() : 'A';
                      e.target.parentElement.appendChild(textSpan);
                    }}
                  />
                ) : (
                  managerEmail ? managerEmail.charAt(0).toUpperCase() : 'A'
                )}
              </button>

              {/* Profile Dropdown Menu Card */}
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 mt-2 top-8 w-60 bg-[#0E0E12] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-slide-up text-left">
                    <div className="mb-3.5 pb-3 border-b border-white/5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Manager Account</p>
                      <p className="text-xs text-white truncate font-medium">{managerEmail}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 bg-white/[0.02] border border-white/5 p-2 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400">Security Tier:</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${
                        managerTier === 'PRO' 
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {managerTier ?? '—'}
                      </span>
                    </div>

                    {/* Dropdown Options */}
                    <div className="py-2">
                      {managerTier === 'FREE' && (
                        <button 
                          onClick={handleUnlockTrialClick}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2"><Zap size={14} /> Unlock Trial</span>
                        </button>
                      )}
                      {!managerLoading && managerTier !== 'PRO' && (
                        <button 
                          onClick={handleUpgrade}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2"><ShieldCheck size={14} /> Upgrade to PRO</span>
                        </button>
                      )}
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="w-full text-slate-400 hover:text-white flex items-center gap-2 text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer mb-1.5"
                    >
                      <LogOut size={14} /> 
                      <span>Sign Out</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowSettingsModal(true);
                      }}
                      className="w-full text-slate-400 hover:text-white flex items-center gap-2 text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Settings size={14} /> 
                      <span>Console Settings</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-1 md:mb-2">Connected Members</h1>
            <p className="text-slate-400 text-xs md:text-sm">Select an authenticated member to view their interactive dashboard.</p>
          </div>
          <div className="relative group w-full md:w-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all w-full md:w-64 placeholder:text-slate-600"
            />
          </div>
        </header>

        {/* Self Audit Banner for FREE tier */}
        {managerTier === 'FREE' && (
          <div className="mb-6 md:mb-8 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={15} className="text-indigo-400 shrink-0" />
                <h3 className="text-indigo-300 font-semibold text-sm">Experience PRO Features</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect your own Google account to run a self-audit and instantly upgrade to the <strong>Trial Tier</strong>. Unlock Target Monitor, Drive Forensics, and Financial Scanners.
              </p>
            </div>
            <button
              onClick={handleUnlockTrialClick}
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all shrink-0 cursor-pointer"
            >
              Unlock Trial
            </button>
          </div>
        )}

        {/* Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && members.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white/[0.02] border border-white/10 rounded-2xl">
              <RefreshCw size={24} className="animate-spin mx-auto mb-3 opacity-50" />
              Loading member roster...
            </div>
          ) : members.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white/[0.02] border border-white/10 rounded-2xl">
              <Users size={24} className="mx-auto mb-3 opacity-20" />
              <div>
                <p className="font-semibold text-slate-400">No members connected yet.</p>
                <p className="text-xs text-slate-600 mt-1">Provide your Auth ID (<strong>{managerAuthId}</strong>) to your clients to connect their account.</p>
              </div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white/[0.02] border border-white/10 rounded-2xl">
              <Search size={24} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold text-slate-400">No members match your search.</p>
            </div>
          ) : (
            filteredMembers.map((member, idx) => {
              let maxAllowed = 3;
              if (managerTier === 'PRO') maxAllowed = 4 + additionalSlots;
              else if (managerTier === 'TRIAL') maxAllowed = 3;
              
              const isLocked = idx >= maxAllowed;

              const handleMemberClick = () => {
                if (isLocked) {
                  if (managerTier === 'FREE') {
                    setShowUpgradeLockModal({
                      open: true,
                      title: 'Upgrade to PRO',
                      message: `Free accounts are limited to 1 active slot. Upgrade to PRO to unlock up to 4 active slots (1 Self + 3 Targets) plus additional purchased slots.`,
                      action: handleUpgrade
                    });
                  } else if (managerTier === 'TRIAL') {
                    setShowUpgradeLockModal({
                      open: true,
                      title: 'Upgrade to PRO',
                      message: `Trial accounts are limited to 2 active slots (Yourself + 1 Target). Upgrade to PRO to unlock up to 4 active slots plus additional purchased slots.`,
                      action: handleUpgrade
                    });
                  } else {
                    if (billingCycle === 'weekly') {
                      setShowUpgradeLockModal({
                        open: true,
                        title: 'Member Limit Reached',
                        message: `Your 1-Week PRO License is limited to 4 active slots. Upgrade to the Annual PRO License to purchase unlimited additional slots.`,
                        action: null // No action button
                      });
                    } else {
                      setShowUpgradeLockModal({
                        open: true,
                        title: 'Member Limit Reached',
                        message: `Your PRO plan is currently limited to ${4 + additionalSlots} active slots. Purchase an additional active slot for ₹1,200/year to connect this client.`,
                        action: handleAddonSlot
                      });
                    }
                  }
                } else {
                  navigate(`/member/${member.id}`);
                }
              };

              return (
                <div 
                  key={member.id} 
                  className={`border rounded-2xl p-6 backdrop-blur-sm shadow-xl transition-all group relative cursor-pointer ${
                    isLocked 
                      ? 'bg-black/60 border-white/5 opacity-40 hover:opacity-60 select-none' 
                      : 'bg-black/40 border-white/10 hover:bg-white/[0.03] hover:border-indigo-500/30'
                  }`}
                  onClick={handleMemberClick}
                >
                  {/* 3-Dot Options Dropdown Menu */}
                  <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(`dropdown-${member.id}`);
                        if (element) {
                          element.classList.toggle('hidden');
                        }
                      }}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Options"
                    >
                      <MoreVertical size={14} />
                    </button>
                    <div 
                      id={`dropdown-${member.id}`} 
                      className="hidden absolute right-0 mt-1.5 w-32 bg-[#0E0E12] border border-white/10 rounded-xl shadow-2xl py-1 text-xs text-left"
                    >
                      {managerTier === 'PRO' && billingCycle === 'yearly' && (
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            const element = document.getElementById(`dropdown-${member.id}`);
                            if (element) element.classList.add('hidden');
                            handleAddonSlot();
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-indigo-400 font-medium transition-colors"
                        >
                          Purchase Slot
                        </button>
                      )}
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          const element = document.getElementById(`dropdown-${member.id}`);
                          if (element) element.classList.add('hidden');
                          
                          setShowConfirmModal({
                            open: true,
                            title: 'Disconnect Member',
                            message: `Are you sure you want to disconnect ${member.name}? They will lose access.`,
                            requireInput: false,
                            action: async () => {
                              const managerId = localStorage.getItem('manager_id');
                            
                              // 1. Actively revoke the token with Google directly
                              const tokenToRevoke = member.google_refresh_token || member.access_token;
                              if (tokenToRevoke) {
                                try {
                                  await fetch('https://oauth2.googleapis.com/revoke', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                    body: `token=${tokenToRevoke}`
                                  });
                                  console.log(`Actively revoked Google OAuth grant for ${member.email}`);
                                } catch (revokeErr) {
                                  console.warn('Failed to contact Google revoke endpoint:', revokeErr);
                                }
                              }

                              // 2. Scrub database
                              const { error } = await supabase
                                .from('members')
                                .update({ 
                                  connection_status: 'DISCONNECTED',
                                  access_token: null,
                                  google_refresh_token: null
                                })
                                .eq('id', member.id);
                               
                               if (error) {
                                 window.showToast('Failed to disconnect member: ' + error.message, 'error');
                               } else {
                                 window.showToast('Member connection disconnected & tokens scrubbed.', 'info');
                                 
                                 // Immediately scrub local storage cache for zero-knowledge compliance
                                 try {
                                   const cacheKey = `cache_${member.email}`;
                                   await removeEncryptedItem(cacheKey);
                                   console.log(`Scrubbed local cache for ${member.email}`);
                                 } catch (cacheErr) {
                                   console.warn("Failed to clear member cache:", cacheErr);
                                 }
                                 
                                 // Check if they disconnected their own self-audit account
                                 console.log("Checking self audit disconnect:", { managerTier, memberEmail: member.email, managerEmail });
                                 if (managerTier === 'TRIAL' && member.email.toLowerCase() === managerEmail.toLowerCase()) {
                                   const { error: tierErr } = await supabase.from('managers').update({ tier: 'FREE' }).eq('id', managerId);
                                   if (tierErr) {
                                     console.error("Failed to revert tier:", tierErr);
                                     window.showToast("Failed to revert Manager Tier: " + tierErr.message, "error");
                                   } else {
                                     localStorage.setItem('manager_tier', 'FREE');
                                     window.showToast('Self-Audit removed. You have been reverted to the Free tier. Refreshing...', 'warning');
                                     setTimeout(() => {
                                       window.location.reload();
                                     }, 1500);
                                   }
                                 } else {
                                   console.log("Self-audit condition failed.");
                                 }
                                 
                                 fetchMembers();
                               }
                            }
                          });
                        }}
                        className="w-full px-3.5 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold transition-colors block text-left"
                      >
                        Disconnect
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(`dropdown-${member.id}`);
                          if (element) element.classList.add('hidden');
                          
                          setShowConfirmModal({
                            open: true,
                            title: 'Clear Local Intel Cache',
                            message: `Are you sure you want to wipe all locally cached OSINT data for ${member.name}? This will force fresh scans on the next visit.`,
                            requireInput: false,
                            action: () => handleClearCache(member.id)
                          });
                        }}
                        className="w-full px-3.5 py-2 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 font-semibold transition-colors block text-left border-t border-white/5 mt-1 pt-2"
                      >
                        Clear Cache
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start justify-between mb-4 pr-10">
                    <img 
                      src={member.avatar_url || 'https://lh3.googleusercontent.com/a/default-user=s120'} 
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border border-white/10 bg-slate-900 group-hover:ring-2 ring-indigo-500/50 transition-all object-cover"
                      onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/a/default-user=s120'; }}
                    />
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${
                      isLocked
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : member.status === 'Simulation' 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {isLocked ? <Lock size={10} /> : <CheckCircle2 size={10} />}
                      {isLocked ? 'Slot Locked' : (member.status || 'Active')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 truncate">
                    {member.email}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/5">
                    <span>Connected: {new Date(member.consent_granted_at || member.created_at).toLocaleDateString()}</span>
                    <span className="text-indigo-400 font-medium group-hover:translate-x-1 transition-transform flex items-center">
                      {isLocked ? 'Unlock Member →' : 'View Dashboard →'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Upgrade Lock Modal */}
      {showUpgradeLockModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[16px] p-4">
          <div className="w-full max-w-sm bg-[#0E0E12] border border-white/10 rounded-3xl p-6 shadow-2xl relative text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
              <Lock size={22} className="animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{showUpgradeLockModal.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">{showUpgradeLockModal.message}</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowUpgradeLockModal({ open: false })} 
                className="px-4 py-2 text-xs font-semibold text-slate-400 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
              {showUpgradeLockModal.action && (
                <button 
                  onClick={() => {
                    showUpgradeLockModal.action();
                    setShowUpgradeLockModal({ open: false });
                  }} 
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Self-Audit Disclaimer Modal */}
      {showSelfAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0A0A0B]/80 backdrop-blur-sm"
            onClick={() => setShowSelfAuditModal(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Unlock Trial via Self-Audit</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Before proceeding, please carefully review what a Self-Audit entails and the terms of accessing the Trial Tier.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                    <Info size={16} /> What is a Self-Audit?
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A Self-Audit involves connecting your <strong>own Google account</strong> to the Arukin console. This allows you to experience the platform from a target's perspective and instantly unlocks Trial Tier features (Target Monitor, Drive Forensics, Financial Scanners). 
                  </p>
                </div>
                
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-sm font-semibold text-rose-300 mb-2 flex items-center gap-2">
                    <AlertTriangle size={16} /> Important Notice
                  </h4>
                  <ul className="text-xs text-slate-400 leading-relaxed list-disc pl-4 space-y-2">
                    <li>You must authenticate using your exact Manager email (<span className="text-white font-medium">{managerEmail}</span>). Mismatched accounts will be treated as standard targets and will not unlock Trial features.</li>
                    <li>By proceeding, you grant Arukin read-only access to your connected account's metadata as outlined in our <a href="/privacy" target="_blank" className="text-indigo-400 hover:underline">Privacy Policy</a>.</li>
                    <li>You agree to our <a href="/terms" target="_blank" className="text-indigo-400 hover:underline">Terms and Conditions</a> regarding authorized data access and acceptable use.</li>
                  </ul>
                </div>
              </div>
              
              {/* Explicit Checkbox Requirement */}
              <div className="flex items-start gap-3 mt-4 mb-2 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    id="accept-self-audit"
                    checked={selfAuditAccepted}
                    onChange={(e) => setSelfAuditAccepted(e.target.checked)}
                    className="peer appearance-none w-4 h-4 rounded border border-slate-600 checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer transition-all"
                  />
                  <CheckCircle2 size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <label htmlFor="accept-self-audit" className="text-xs text-slate-400 cursor-pointer select-none leading-relaxed">
                  I have read and agree to the Important Notice and authorize Arukin to connect my account.
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 bg-[#0A0A0B]/50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setShowSelfAuditModal(false)}
                className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSelfAuditAccept}
                disabled={!selfAuditAccepted}
                className={`px-6 py-2.5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                  selfAuditAccepted 
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 cursor-pointer' 
                    : 'bg-emerald-600/50 cursor-not-allowed opacity-50'
                }`}
              >
                I Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Member Confirm Modal */}
      {showConfirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[16px] p-4">
          <div className="w-full max-w-sm bg-[#0E0E12] border border-red-500/20 rounded-3xl p-6 shadow-2xl relative text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-400">
              <AlertTriangle size={22} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{showConfirmModal.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">{showConfirmModal.message}</p>
            
            {showConfirmModal.requireInput && (
              <div className="mb-6 text-left">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
                  Type <strong className="text-red-400">DELETE</strong> to confirm
                </label>
                <input 
                  type="text" 
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center text-sm text-white focus:outline-none focus:border-red-500/50"
                />
              </div>
            )}

            <div className="flex gap-3 justify-center mt-4">
              <button 
                onClick={() => { setShowConfirmModal({ open: false }); setConfirmInput(''); }} 
                className="px-4 py-2 text-xs font-semibold text-slate-400 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (showConfirmModal.requireInput && confirmInput !== 'DELETE') return;
                  showConfirmModal.action();
                  setShowConfirmModal({ open: false });
                  setConfirmInput('');
                }} 
                disabled={showConfirmModal.requireInput && confirmInput !== 'DELETE'}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/20"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
