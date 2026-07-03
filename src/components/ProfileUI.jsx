import React, { useState, useEffect } from 'react';
import { hasProAccess } from '../utils/access';
import { Mail, Phone, Building2, MapPin, Cake, Link2, RefreshCw, User, Info, Shield, CheckCircle2, Search, CheckCircle, XCircle, Activity, ShieldAlert, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../supabaseClient';
import localforage from 'localforage';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import SocialScanner from './SocialScanner';
import FinancialScanner from './FinancialScanner';

// ── Helpers ───────────────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const InfoRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 text-slate-400 shrink-0">{icon}</div>
      <div>
        {label && <p className="text-xs text-slate-400 mb-0.5">{label}</p>}
        <p className="text-sm text-slate-700 font-medium">{value}</p>
      </div>
    </div>
  );
};

const StatChip = ({ label, value, color = 'slate' }) => (
  <div className={`flex flex-col items-center justify-center rounded-xl border border-${color}-100 bg-${color}-50 px-5 py-4 min-w-[100px]`}>
    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    <p className="text-xs text-slate-500 mt-1 text-center">{label}</p>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProfileUI({ member, footprintData, setFootprintData, onNavigateToInbox }) {
  const isPro = hasProAccess(member);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Auth fetch wrapper ──────────────────────────────────────────────────────
  const fetchWithAuth = async (url, options = {}) => {
    let res = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${member.access_token}` }
    });
    if (res.status === 401 || res.status === 403) {
      try {
        const { data, err } = await supabase.functions.invoke('refresh-google-token', {
          body: { member_id: member.id }
        });
        if (err) throw err;
        if (data?.access_token) {
          member.access_token = data.access_token;
          res = await fetch(url, {
            ...options,
            headers: { ...options.headers, Authorization: `Bearer ${member.access_token}` }
          });
        }
      } catch (e) { console.error('Token refresh failed:', e); }
    }
    return res;
  };

  const [storage, setStorage] = useState(null);
  const [contactsCount, setContactsCount] = useState(0);
  const [gmailStats, setGmailStats] = useState({ inboxTotal: 0, spamTotal: 0 });

  // ── Fetch profile ───────────────────────────────────────────────────────────
  const fetchProfile = async (forceRefresh = false) => {
    if (!member?.access_token) {
      setError('No access token available.');
      setLoading(false);
      return;
    }

    if (!forceRefresh) {
      const cached = await localforage.getItem(`profile_data_${member.id}`);
      if (cached) {
        try {
          setProfile(cached.profile);
          setContactsCount(cached.contactsCount);
          setStorage(cached.storage);
          setGmailStats(cached.gmailStats);
          setLoading(false);
          return;
        } catch (e) {
          console.error("Failed to parse cached profile data", e);
        }
      }
    }

    setLoading(true);
    setError(null);
    try {
      const fields = [
        'names', 'emailAddresses', 'phoneNumbers', 'organizations',
        'photos', 'addresses', 'birthdays', 'urls', 'biographies',
        'relations', 'nicknames', 'locales', 'genders'
      ].join(',');

      // 1. Fetch Google People Profile
      const profileRes = await fetchWithAuth(
        `https://people.googleapis.com/v1/people/me?personFields=${fields}`
      );
      let profileData = null;
      if (profileRes.ok) {
        profileData = await profileRes.json();
        setProfile(profileData);
      }

      // 2. Fetch Google People connections total count
      const contactsRes = await fetchWithAuth(
        `https://people.googleapis.com/v1/people/me/connections?pageSize=1&personFields=names`
      );
      let newContactsCount = 0;
      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        newContactsCount = contactsData.totalItems || 0;
        setContactsCount(newContactsCount);
      }

      // 3. Fetch Google Drive Storage details
      const driveAboutRes = await fetchWithAuth(
        `https://www.googleapis.com/drive/v3/about?fields=storageQuota`
      );
      let newStorage = null;
      if (driveAboutRes.ok) {
        const driveAboutData = await driveAboutRes.json();
        newStorage = driveAboutData.storageQuota || null;
        setStorage(newStorage);
      }

      // 4. Fetch Gmail Inbox Total and Spam Total counts
      const [inboxRes, spamRes] = await Promise.all([
        fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/labels/INBOX`),
        fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/labels/SPAM`)
      ]);

      let inboxTotal = 0;
      let spamTotal = 0;

      if (inboxRes.ok) {
        const inboxData = await inboxRes.json();
        inboxTotal = inboxData.messagesTotal || 0;
      }
      if (spamRes.ok) {
        const spamData = await spamRes.json();
        spamTotal = spamData.messagesTotal || 0;
      }

      const newGmailStats = { inboxTotal, spamTotal };
      setGmailStats(newGmailStats);

      // Cache all results
      await localforage.setItem(`profile_data_${member.id}`, {
        profile: profileData,
        contactsCount: newContactsCount,
        storage: newStorage,
        gmailStats: newGmailStats
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [member]);

  // ── Parse helpers ───────────────────────────────────────────────────────────
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatBirthday = (b) => {
    if (!b?.date) return null;
    const { year, month, day } = b.date;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[(month || 1) - 1]} ${day}${year ? `, ${year}` : ''}`;
  };

  const formatAddress = (a) => {
    if (!a) return null;
    return [a.streetAddress, a.city, a.region, a.country].filter(Boolean).join(', ');
  };

  const consentDate = member.consent_granted_at
    ? new Date(member.consent_granted_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  // ── Derived from profile ────────────────────────────────────────────────────
  const emails = profile?.emailAddresses || [];
  const phones = profile?.phoneNumbers || [];
  const orgs = profile?.organizations || [];
  const addresses = profile?.addresses || [];
  const birthday = profile?.birthdays?.[0];
  const urls = profile?.urls || [];
  const bio = profile?.biographies?.[0]?.value;
  const nickname = profile?.nicknames?.[0]?.value;
  const relations = profile?.relations || [];

  const displayName = profile?.names?.[0]?.displayName || member.name;
  const primaryEmail = emails[0]?.value || member.email;
  const primaryOrg = orgs[0];
  const photoUrl = profile?.photos?.[0]?.url || member.avatar_url ||
    `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y`;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="h-full bg-white text-slate-800 flex flex-col font-sans overflow-hidden rounded-lg shadow-2xl border border-slate-200">

      {/* Header strip */}
      <div className="h-14 border-b border-slate-200 flex items-center px-5 justify-between bg-slate-50 shrink-0">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <User size={20} className="text-indigo-500" />
          Audit Report
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button 
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-7 text-xs font-bold rounded flex items-center justify-center transition-colors ${currentPage === 1 ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            1
          </button>
          <button 
            onClick={() => setCurrentPage(2)}
            className={`w-8 h-7 text-xs font-bold rounded flex items-center justify-center transition-colors ${currentPage === 2 ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            2
          </button>
          <button 
            onClick={() => setCurrentPage(3)}
            className={`w-8 h-7 text-xs font-bold rounded flex items-center justify-center transition-colors ${currentPage === 3 ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            3
          </button>
        </div>

        <button onClick={() => fetchProfile(true)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors" title="Refresh">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-red-500 gap-2 p-8">
          <Info size={32} className="opacity-40" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      ) : loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw size={24} className="animate-spin opacity-40" />
          <p className="text-sm">Loading profile...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50">

          {currentPage === 1 && (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Hero card */}
              <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border-b border-slate-200 px-6 py-5 flex items-center gap-6 shrink-0">
                <div className="relative shrink-0">
                  <img
                    src={photoUrl}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-slate-100"
                    onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/a/default-user=s120'; }}
                  />
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" title="Account connected" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-slate-800 leading-tight">{displayName}</h1>
                  {nickname && <p className="text-sm text-slate-400 mt-0.5">"{nickname}"</p>}
                  {primaryOrg && (
                    <p className="text-sm text-slate-500 mt-1">
                      {primaryOrg.title && <span>{primaryOrg.title}</span>}
                      {primaryOrg.title && primaryOrg.name && <span> · </span>}
                      {primaryOrg.name && <span className="font-medium">{primaryOrg.name}</span>}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Mail size={13} className="text-slate-400" />
                    <span className="text-sm text-slate-600">{primaryEmail}</span>
                  </div>
                  {/* Consent badge */}
                  {consentDate && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">Access granted {consentDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-0 divide-x divide-slate-100 flex-1 overflow-hidden">
                {/* Left column */}
            <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">
              
              {/* Storage Analysis (Pie Chart & Space Detail) */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Google Account Storage</h3>
                {storage ? (() => {
                  const limit = parseInt(storage.limit || 16106127360);
                  const usage = parseInt(storage.usage || 0);
                  const remaining = Math.max(0, limit - usage);
                  
                  const pct = Math.min(100, (usage / limit) * 100);
                  const storageData = [
                    { name: 'Used Space', value: usage },
                    { name: 'Free Space', value: remaining }
                  ];

                  return (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-24 h-24 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={storageData}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={45}
                              paddingAngle={2}
                              dataKey="value"
                              stroke="none"
                            >
                              <Cell key="cell-0" fill="#6366f1" />
                              <Cell key="cell-1" fill="#e2e8f0" />
                            </Pie>
                            <RechartsTooltip 
                              formatter={(value) => formatBytes(value)}
                              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '4px 8px', fontSize: '12px' }}
                              itemStyle={{ color: '#334155' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                          <span className="text-sm font-bold text-slate-800">{Math.round(pct)}%</span>
                        </div>
                      </div>

                      {/* Storage Text Info */}
                      <div className="space-y-1.5 flex-1 min-w-0 w-full">
                        <div className="flex justify-between text-xs pb-1 border-b border-slate-150">
                          <span className="text-slate-500 font-medium">Total Limit:</span>
                          <span className="font-bold text-slate-800">{formatBytes(limit)}</span>
                        </div>
                        <div className="flex justify-between text-xs pb-1 border-b border-slate-150">
                          <span className="text-slate-500 font-medium">Space Used:</span>
                          <span className="font-bold text-slate-800">{formatBytes(usage)}</span>
                        </div>
                        <div className="flex justify-between text-xs pb-1 border-b border-slate-150">
                          <span className="text-slate-500 font-medium">Remaining:</span>
                          <span className="font-bold text-slate-800">{formatBytes(remaining)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <p className="text-sm text-slate-400">Loading storage info...</p>
                )}
              </div>

              {/* Connected Contact Details */}
              {(phones.length > 0 || addresses.length > 0 || birthday) && (
                <div className="border-t border-slate-100 pt-6">
                  {phones.length > 0 && (
                    <Section title="Phone numbers">
                      {phones.map((p, i) => (
                        <InfoRow key={i} icon={<Phone size={15} />} label={p.type || p.formattedType} value={p.value} />
                      ))}
                    </Section>
                  )}

                  {addresses.length > 0 && (
                    <Section title="Addresses">
                      {addresses.map((a, i) => (
                        <InfoRow key={i} icon={<MapPin size={15} />} label={a.type || a.formattedType} value={formatAddress(a)} />
                      ))}
                    </Section>
                  )}

                  {birthday && (
                    <Section title="Birthday">
                      <InfoRow icon={<Cake size={15} />} value={formatBirthday(birthday)} />
                    </Section>
                  )}
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">

              {/* Data Metrics Summary Cards */}
              <div className="mb-4 grid grid-cols-1 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                   <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Email Distribution</h3>
                   <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-24 shrink-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Inbox', value: gmailStats.inboxTotal },
                                { name: 'Spam', value: gmailStats.spamTotal }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={45}
                              paddingAngle={2}
                              dataKey="value"
                              stroke="none"
                            >
                              <Cell key="cell-0" fill="#6366f1" />
                              <Cell key="cell-1" fill="#ef4444" />
                            </Pie>
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '4px 8px', fontSize: '12px' }}
                              itemStyle={{ color: '#334155' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                          <span className="text-sm font-bold text-slate-800">{gmailStats.inboxTotal + gmailStats.spamTotal > 9999 ? '10k+' : gmailStats.inboxTotal + gmailStats.spamTotal}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0 w-full">
                        <div className="flex justify-between text-xs pb-1 border-b border-slate-150">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            <span className="text-slate-500 font-medium">Primary</span>
                          </div>
                          <span className="font-bold text-slate-800">{gmailStats.inboxTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs pb-1 border-b border-slate-150">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            <span className="text-slate-500 font-medium">Spam</span>
                          </div>
                          <span className="font-bold text-slate-800">{gmailStats.spamTotal.toLocaleString()}</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Contacts</span>
                      <p className="text-xl font-bold text-indigo-600 mt-0.5">{contactsCount.toLocaleString()}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <User size={14} className="text-indigo-500" />
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Identity</span>
                      <p className="text-xl font-bold text-emerald-600 mt-0.5">{phones.length + addresses.length + urls.length}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Shield size={14} className="text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              {orgs.length > 0 && (
                <Section title="Organizations">
                  {orgs.map((o, i) => (
                    <InfoRow
                      key={i}
                      icon={<Building2 size={15} />}
                      label={[o.title, o.department].filter(Boolean).join(' · ') || 'Organization'}
                      value={o.name}
                    />
                  ))}
                </Section>
              )}

              {urls.length > 0 && (
                <Section title="Websites & Social">
                  {urls.map((u, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                      <Link2 size={15} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        {u.type && <p className="text-xs text-slate-400 mb-0.5">{u.type}</p>}
                        <a
                          href={u.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline font-medium break-all"
                        >
                          {u.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </Section>
              )}

              {relations.length > 0 && (
                <Section title="Relations">
                  {relations.map((r, i) => (
                    <InfoRow key={i} icon={<User size={15} />} label={r.type || r.formattedType} value={r.person} />
                  ))}
                </Section>
              )}

              {bio && (
                <Section title="Bio">
                  <div className="flex items-start gap-3">
                    <Info size={15} className="text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-600 leading-relaxed">{bio}</p>
                  </div>
                </Section>
              )}
            </div>
              </div>
            </div>
            )}
            {currentPage === 2 && (
              <SocialScanner member={member} footprintData={footprintData} setFootprintData={setFootprintData} fetchWithAuth={fetchWithAuth} onNavigateToInbox={onNavigateToInbox} isPro={isPro} />
            )}
            {currentPage === 3 && (
              <FinancialScanner member={member} fetchWithAuth={fetchWithAuth} onNavigateToInbox={onNavigateToInbox} isPro={isPro} />
            )}
        </div>
      )}
    </div>
  );
}
