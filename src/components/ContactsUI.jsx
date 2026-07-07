import React, { useState, useEffect } from 'react';
import { hasProAccess } from '../utils/access';
import { Search, Users, RefreshCw, Mail, Phone, Building2, BarChart2, AlertTriangle, ChevronDown, ChevronRight, X, Menu } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { googleProxyFetch } from '../utils/googleProxy';
import { getEncryptedItem, setEncryptedItem, removeEncryptedItem } from '../utils/cache';

export default function ContactsUI({ member }) {
  const isPro = hasProAccess(member);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' | 'companies' | 'stats'
  const [expandedOrgs, setExpandedOrgs] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleUpgrade = async () => {
    try {
      window.showToast('Initializing secure checkout...', 'info');

      const managerId = localStorage.getItem('manager_id') || member.manager_id;
      if (!managerId) throw new Error('Manager profile ID missing');

      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          manager_id: managerId,
          plan_id: import.meta.env.VITE_RAZORPAY_PLAN_ID
        }
      });

      if (error || !data?.id) {
        throw new Error(error?.message || 'Failed to create subscription session');
      }

      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: data.id,
        name: 'ArukinSec Security',
        description: 'Yearly Premium Security Audit Console',
        prefill: {
          email: localStorage.getItem('manager_email') || '',
        },
        theme: {
          color: '#6366f1'
        },
        handler: function (response) {
          window.showToast('Payment successful! Processing activation...', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 3500);
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
      console.error('Subscription error:', err);
      window.showToast(err.message || 'Upgrade initialization failed.', 'error');
    }
  };

  // ── Auth fetch wrapper ──────────────────────────────────────────────────────
  const fetchWithAuth = async (url, options = {}) => {
    try {
      const data = await googleProxyFetch(member.id, url, options);
      return {
        ok: true, status: 200,
        json: async () => data,
        text: async () => typeof data === 'string' ? data : JSON.stringify(data),
        blob: async () => data instanceof Blob ? data : new Blob([data], { type: options.headers?.['Content-Type'] || 'application/octet-stream' }),
        headers: new Headers({ 'content-type': 'application/json' }),
      };
    } catch (err) {
      console.error('Proxy fetch failed:', err);
      return {
        ok: false, status: err.status || 500,
        json: async () => ({ error: err.message }),
        text: async () => err.message,
        blob: async () => new Blob([]),
        headers: new Headers(),
      };
    }
  };

  // ── Fetch contacts ──────────────────────────────────────────────────────────
  const fetchContacts = async () => {

    if (!member?.id) {
      setError('No Google access token found for this member.');
      setLoading(false);
      return;
    }
    const cacheKey = `contacts_cache_${member.id}`;
    let hasCache = false;
    
    try {
      const cached = await getEncryptedItem(cacheKey);
      if (cached) {
        setContacts(cached);
        hasCache = true;
        setLoading(false); // Instant render
      }
    } catch (e) {
      console.error('Contacts cache read error:', e);
    }

    if (!hasCache) setLoading(true);
    setError(null);
    try {
      const url = 'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations,photos&pageSize=500';
      const res = await fetchWithAuth(url);

      if (!res.ok) throw new Error('Failed to fetch contacts. Token may be invalid or the People API is not enabled.');

      const data = await res.json();

      const parsed = (data.connections || []).map(person => {
        const rawEmail = person.emailAddresses?.[0]?.value || '';
        const rawPhone = person.phoneNumbers?.[0]?.value || '';
        return {
          id: person.resourceName,
          name: person.names?.[0]?.displayName || '',
          email: isPro ? rawEmail : (rawEmail ? '••••••••@••••.com' : ''),
          phone: isPro ? rawPhone : (rawPhone ? '•••••••-•••' : ''),
          company: person.organizations?.[0]?.name || '',
          jobTitle: person.organizations?.[0]?.title || '',
          photoUrl: person.photos?.[0]?.url || '',
          isMasked: !isPro
        };
      });

      setContacts(parsed);
      
      // Update cache in background
      await setEncryptedItem(cacheKey, parsed);
    } catch (err) {
      console.error(err);
      if (!hasCache) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, [member]);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const total = contacts.length;
  const withEmail = contacts.filter(c => c.email).length;
  const withPhone = contacts.filter(c => c.phone).length;
  const withCompany = contacts.filter(c => c.company).length;
  const incomplete = contacts.filter(c => !c.name).length;

  // ── Company grouping ────────────────────────────────────────────────────────
  const companyGroups = Object.entries(
    contacts.reduce((acc, c) => {
      const key = c.company || '__none__';
      if (!acc[key]) acc[key] = [];
      acc[key].push(c);
      return acc;
    }, {})
  )
    .sort((a, b) => b[1].length - a[1].length);

  const toggleOrg = (key) => setExpandedOrgs(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Filtered list ───────────────────────────────────────────────────────────
  const filtered = contacts.filter(c =>
    (c.name || c.email).toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const avatar = (c) => {
    const label = c.name ? c.name.charAt(0).toUpperCase() : '?';
    return <span className="font-semibold text-sm text-slate-500">{label}</span>;
  };

  const navBtn = (tab, icon, label, count) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-r-full text-sm transition-colors ${
        activeTab === tab ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {React.cloneElement(icon, { size: 18, className: activeTab === tab ? 'text-blue-600' : 'text-slate-400' })}
      {label}
      {count != null && <span className="ml-auto text-xs font-semibold text-slate-400">{count || ''}</span>}
    </button>
  );

  return (
    <div className="h-full bg-white text-slate-800 flex flex-col font-sans relative overflow-hidden rounded-lg shadow-2xl border border-slate-200">

      {/* Top Header */}
      <div className="h-14 border-b border-slate-200 flex items-center px-4 justify-between bg-slate-50 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors -ml-1 mr-1"
            title="Toggle Menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-slate-700 font-medium text-lg">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#1A73E8"/>
            </svg>
            Contacts
          </div>
          {activeTab === 'contacts' && (
            <div className="relative ml-2 md:ml-8 flex-1 max-w-[10rem] md:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              />
            </div>
          )}
        </div>
        <button onClick={fetchContacts} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors" title="Refresh">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Mobile full-screen sidebar overlay */}
      {isSidebarOpen && (
        <div className="md:hidden absolute inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200 bg-slate-50 shrink-0">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#1A73E8"/></svg>
              Contacts Menu
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <nav className="px-2 space-y-0.5 mb-6">
              {[['contacts', <Users />, 'Contacts', total], ['companies', <Building2 />, 'Companies', withCompany > 0 ? companyGroups.filter(([k]) => k !== '__none__').length : undefined], ['stats', <BarChart2 />, 'Stats', undefined]].map(([tab, icon, label, count]) => (
                <button key={tab} onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-full text-sm transition-colors ${activeTab === tab ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {React.cloneElement(icon, { size: 18, className: activeTab === tab ? 'text-blue-600' : 'text-slate-400' })}
                  {label}
                  {count != null && <span className="ml-auto text-xs font-semibold text-slate-400">{count || ''}</span>}
                </button>
              ))}
            </nav>
            {!isPro && (
              <div className="mx-3 p-3.5 bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl text-left space-y-2.5 shadow-sm">
                <div>
                  <span className="text-[9px] font-extrabold text-white bg-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-wider">PRO Feature Locked</span>
                  <h5 className="font-bold text-xs text-slate-800 mt-2">Viewing emails and phone numbers is not available on the free plan</h5>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">Upgrade to PRO to unmask contact details.</p>
                </div>
                <button onClick={handleUpgrade} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-2 rounded-lg transition-all">Upgrade to PRO</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Desktop sidebar - always visible on md+ */}
        <div className="hidden md:flex w-56 border-r border-slate-200 bg-slate-50 flex-col py-4 pb-6 shrink-0 overflow-y-auto">
          <nav className="px-2 space-y-0.5 mb-6">
            {navBtn('contacts', <Users />, 'Contacts', total)}
            {navBtn('companies', <Building2 />, 'Companies', withCompany > 0 ? companyGroups.filter(([k]) => k !== '__none__').length : undefined)}
            {navBtn('stats', <BarChart2 />, 'Stats')}
          </nav>

          {/* Marketing upgrade banner for free tier */}
          {!isPro && (
            <div className="mx-3 mt-2 p-3.5 bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl text-left space-y-2.5 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-extrabold text-white bg-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-wider">PRO Feature Locked</span>
                </div>
                <h5 className="font-bold text-xs text-slate-800">Viewing emails and phone numbers is not available on the free plan</h5>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  Upgrade to PRO to unmask contact details.
                </p>
              </div>
              <button 
                onClick={handleUpgrade}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-2 rounded-lg transition-all shadow-md shadow-indigo-600/10 cursor-pointer text-center"
              >
                Upgrade to PRO
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">

          {/* ── Contacts Tab ─────────────────────────────────────────── */}
          {activeTab === 'contacts' && (
            <>
              {error ? (
                <div className="p-8 text-center text-red-500">
                  <p className="font-medium mb-1">Failed to load contacts.</p>
                  <p className="text-sm opacity-75">{error}</p>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                  <RefreshCw size={24} className="animate-spin opacity-50" />
                  <p className="text-sm">Syncing contacts...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No contacts found in this Google account.</div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No contacts match your search.</div>
              ) : (
                <div className="w-full text-sm">
                  <div className="hidden md:grid bg-slate-50 border-b border-slate-200 sticky top-0 z-10 px-5 py-3 grid-cols-4 gap-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Company</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {filtered.map(contact => {
                      const isIncomplete = !contact.name;
                      return (
                        <div key={contact.id} className={`hover:bg-slate-50 group transition-colors flex flex-col md:grid md:grid-cols-4 md:gap-4 px-5 py-3 md:items-center ${isIncomplete ? 'bg-amber-50/50' : ''}`}>
                          <div className="mb-1 md:mb-0">
                            <span className={`font-medium ${isIncomplete ? 'text-amber-700 italic' : 'text-slate-700'}`}>
                              {contact.name || 'No name'}
                            </span>
                            {isIncomplete && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <AlertTriangle size={11} className="text-amber-500" />
                                <span className="text-xs text-amber-500">Incomplete</span>
                              </div>
                            )}
                          </div>
                          <div className="mb-1 md:mb-0 text-xs md:text-sm">
                            {contact.email ? (
                              <div className="flex items-center gap-2 text-slate-600">
                                <Mail size={13} className="text-slate-400 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                <span className="truncate max-w-[200px] md:max-w-xs">{contact.email}</span>
                              </div>
                            ) : <span className="text-slate-300 hidden md:inline">—</span>}
                          </div>
                          <div className="mb-1 md:mb-0 text-xs md:text-sm">
                            {contact.phone ? (
                              <div className="flex items-center gap-2 text-slate-600">
                                <Phone size={13} className="text-slate-400 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                <span>{contact.phone}</span>
                              </div>
                            ) : <span className="text-slate-300 hidden md:inline">—</span>}
                          </div>
                          <div className="text-xs md:text-sm">
                            {contact.company ? (
                              <div className="flex items-center gap-2 text-slate-600">
                                <Building2 size={13} className="text-slate-400 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                <span className="truncate">{contact.jobTitle ? `${contact.jobTitle}, ` : ''}{contact.company}</span>
                              </div>
                            ) : <span className="text-slate-300 hidden md:inline">—</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Companies Tab ───────────────────────────────────────── */}
          {activeTab === 'companies' && (
            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                  <RefreshCw size={24} className="animate-spin opacity-50" />
                  <p className="text-sm">Loading...</p>
                </div>
              ) : companyGroups.filter(([k]) => k !== '__none__').length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No company information found in contacts.</div>
              ) : (
                <div className="space-y-2">
                  {companyGroups
                    .filter(([key]) => key !== '__none__')
                    .map(([company, members]) => (
                      <div key={company} className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleOrg(company)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {expandedOrgs[company]
                              ? <ChevronDown size={15} className="text-slate-400" />
                              : <ChevronRight size={15} className="text-slate-400" />}
                            <Building2 size={16} className="text-blue-400" />
                            <span className="font-medium text-sm text-slate-700">{company}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-400 bg-slate-200 rounded-full px-2 py-0.5">
                            {members.length} {members.length === 1 ? 'contact' : 'contacts'}
                          </span>
                        </button>
                        {expandedOrgs[company] && (
                          <div className="divide-y divide-slate-100">
                            {members.map(c => (
                              <div key={c.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors">
                                <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-100 border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                                  {c.photoUrl && !c.photoUrl.includes('default-user')
                                    ? <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                                    : <span className="text-xs font-medium">{c.name ? c.name.charAt(0).toUpperCase() : '?'}</span>}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-700 truncate">{c.name || <span className="italic text-amber-600">No name</span>}</p>
                                  {c.jobTitle && <p className="text-xs text-slate-400 truncate">{c.jobTitle}</p>}
                                </div>
                                {c.email && (
                                  <span className="ml-auto text-xs text-slate-400 truncate max-w-[180px]">{c.email}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ── Stats Tab ────────────────────────────────────────────── */}
          {activeTab === 'stats' && (
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                  <RefreshCw size={24} className="animate-spin opacity-50" />
                  <p className="text-sm">Loading stats...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-base font-semibold text-slate-700 mb-1">Contact Overview</h2>
                  <p className="text-xs text-slate-400 mb-6">
                    Only reflects contacts saved in Google Contacts. Contacts from other apps (Apple, Outlook, WhatsApp, etc.) are not visible here.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {[
                      { label: 'Total contacts', value: total, color: 'blue' },
                      { label: 'Have email address', value: withEmail, color: 'emerald' },
                      { label: 'Have phone number', value: withPhone, color: 'violet' },
                      { label: 'Have company / org', value: withCompany, color: 'orange' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className={`rounded-xl border border-${color}-100 bg-${color}-50 p-4`}>
                        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
                        <p className="text-sm text-slate-500 mt-1">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Incomplete contacts section */}
                  <div className={`rounded-xl border p-4 ${incomplete > 0 ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={16} className={incomplete > 0 ? 'text-amber-500' : 'text-slate-400'} />
                      <span className={`font-semibold text-sm ${incomplete > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                        {incomplete} incomplete {incomplete === 1 ? 'contact' : 'contacts'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {incomplete > 0
                        ? `${incomplete} ${incomplete === 1 ? 'contact has' : 'contacts have'} no name — saved only by email or phone. These are highlighted in the Contacts tab.`
                        : 'All contacts have names — no incomplete records found.'
                      }
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
