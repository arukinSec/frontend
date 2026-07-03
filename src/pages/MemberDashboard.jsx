import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProfileUI from '../components/ProfileUI';
import GmailUI from '../components/GmailUI';
import DriveUI from '../components/DriveUI';
import ContactsUI from '../components/ContactsUI';
import YouTubeUI from '../components/YouTubeUI';
import ErrorBoundary from '../components/ErrorBoundary';
import { get, set, del } from 'idb-keyval';
import { ArrowLeft, Mail, HardDrive, Shield, Users, UserCircle, Search, Wrench } from 'lucide-react';

export default function MemberDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [initialGmailLabel, setInitialGmailLabel] = useState(null);

  const handleNavigateToInbox = (labelId) => {
    setInitialGmailLabel(labelId);
    setActiveTab('gmail');
  };

  // Load cached footprint data if available
  const [footprintData, setFootprintData] = useState(null);

  useEffect(() => {
    if (id) {
      get(`footprint_scan_${id}`).then(cached => {
        if (cached) setFootprintData(cached);
      });
    }
  }, [id]);

  // Save footprint data to cache when updated
  useEffect(() => {
    if (footprintData) {
      set(`footprint_scan_${id}`, footprintData).catch(console.error);
    } else {
      del(`footprint_scan_${id}`).catch(console.error);
    }
  }, [footprintData, id]);

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    setLoading(true);
    setFetchError(null);
    const auditorId = localStorage.getItem('auditor_id');

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .eq('auditor_id', auditorId)  // ownership check — auditor can only see their own members
        .single();

      if (error) throw error;
      setMember(data);
    } catch (err) {
      setFetchError(err.message || 'Failed to load member.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-slate-500">
        Loading connection...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-slate-500 gap-3">
        <p className="text-red-400 font-semibold">Error loading member</p>
        <p className="text-xs text-slate-600 max-w-xs text-center">{fetchError}</p>
        <button onClick={fetchMemberDetails} className="mt-2 text-indigo-400 text-sm hover:text-indigo-300 transition-colors">Retry</button>
        <button onClick={() => navigate('/dashboard')} className="text-slate-500 text-xs hover:text-slate-400 transition-colors">Return to Dashboard</button>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-slate-500">
        <p className="text-slate-400 font-semibold">Member not found.</p>
        <p className="text-xs text-slate-600 mt-1">This connection may not belong to your account.</p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-indigo-400 text-sm hover:text-indigo-300 transition-colors">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0B] text-slate-200 font-sans overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* App Switcher (Horizontal on mobile, Vertical on md+) */}
        <div className="w-full md:w-20 border-b md:border-r border-white/10 bg-black/20 flex flex-row md:flex-col items-center justify-center md:justify-start py-4 md:py-6 gap-4 md:gap-6 shrink-0 overflow-x-auto">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all md:mb-4"
            title="Back to Dashboard"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/10'
                : 'hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
            title="Profile"
          >
            <div className="h-6 w-6 rounded-full border border-white/20 overflow-hidden shrink-0">
              <img 
                src={member.avatar_url || 'https://lh3.googleusercontent.com/a/default-user=s120'} 
                alt={member.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/a/default-user=s120'; }}
              />
            </div>
          </button>

          <button
            onClick={() => {
              setInitialGmailLabel('TARGET_INBOX');
              setActiveTab('gmail');
            }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'gmail'
                ? 'bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/10'
                : 'hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
            title="Gmail Gateway"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="none" />
              <path d="M22 5.5v13c0 .83-.67 1.5-1.5 1.5H17V9.5l-5 3.5-5-3.5V20H4.5C3.67 20 3 19.33 3 18.5v-13C3 4.12 4.5 3.25 5.75 4.13L12 8.5l6.25-4.37C19.5 3.25 22 4.12 22 5.5z" fill="#EA4335" />
              <path d="M3 5.5V18.5c0 .83.67 1.5 1.5 1.5H7V9.5l-4-3V5.5z" fill="#4285F4" />
              <path d="M21 5.5V18.5c0 .83-.67 1.5-1.5 1.5H17V9.5l4-3V5.5z" fill="#34A853" />
              <path d="M12 8.5L7 5v4.5l5 3.5 5-3.5V5l-5 3.5z" fill="#FBBC05" />
            </svg>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'drive'
                ? 'bg-blue-500/10 border border-blue-500/20 shadow-lg shadow-blue-500/10'
                : 'hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
            title="Drive Gateway"
          >
            <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'youtube'
                ? 'bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/10'
                : 'hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
            title="YouTube Gateway"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#FF0000">
              <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M9.996,15.005l0.005-6l5.207,3.005L9.996,15.005z"/>
            </svg>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              activeTab === 'contacts'
                ? 'bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/10'
                : 'hover:bg-white/5 opacity-70 hover:opacity-100'
            }`}
            title="Contacts Gateway"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#4285f4"/>
            </svg>
          </button>
        </div>

        {/* Viewport Container */}
        <div className="flex-1 p-6 bg-gradient-to-br from-[#0A0A0B] to-[#111118] overflow-hidden flex flex-col">
          <div className="flex-1 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
            <ErrorBoundary key={activeTab}>
              {activeTab === 'profile' && <ProfileUI member={member} footprintData={footprintData} setFootprintData={setFootprintData} onNavigateToInbox={handleNavigateToInbox} />}
              {activeTab === 'gmail' && <GmailUI member={member} initialLabel={initialGmailLabel} />}
              {activeTab === 'drive' && <DriveUI member={member} />}
              {activeTab === 'youtube' && <YouTubeUI member={member} />}
              {activeTab === 'contacts' && <ContactsUI member={member} />}
            </ErrorBoundary>
          </div>
        </div>

      </div>
    </div>
  );
}
