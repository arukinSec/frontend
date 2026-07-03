import React, { useState, useEffect } from 'react';
import { X, Lock, Search, AlertTriangle, CreditCard, Clock, Activity } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function DeepDiveModal({ platform, query, memberId, isPro, serverUsage, onClose, onNavigateToInbox }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanCount, setScanCount] = useState(0);
  const navigate = useNavigate();
  
  const maxScans = isPro ? 5 : 1;
  const cacheKey = `insight_${memberId}_${platform.id}`;

  useEffect(() => {
    let initialCount = 0;
    if (serverUsage) {
      initialCount = serverUsage.filter(l => l.scan_type === 'insight_scan' && l.platform === platform.id).length;
    }
    setScanCount(initialCount);
    
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        setData(JSON.parse(cachedData));
        setLoading(false);
      } catch (e) {
        fetchDeepScan();
      }
    } else {
      fetchDeepScan();
    }
  }, [platform, query, memberId]);

  const fetchDeepScan = async () => {
    setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const res = await fetch(`${supabase.supabaseUrl}/functions/v1/intel-gateway`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ scanType: 'social', query, memberId, deepScan: true, platformId: platform.id })
        });
        
        if (res.ok) {
          const result = await res.json();
          setData(result);
          localStorage.setItem(cacheKey, JSON.stringify(result));
          
          setScanCount(prev => prev + 1);
        } else {
          console.error("Deep scan failed");
          if (res.status === 429) {
             const errJson = await res.json();
             setData({ error: errJson.error });
          } else {
             setData({ error: "Failed to load deep scan data." });
          }
        }
      } catch (err) {
        console.error(err);
        setData({ error: "Network error." });
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <img src={platform.icon} alt={platform.name} className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{platform.name} Footprint</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1 font-medium">
                <Activity size={14} className="text-emerald-500" /> Confirmed active connection
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 animate-pulse font-medium">Running deep forensic analysis...</p>
            </div>
          ) : data?.error ? (
            <div className="text-rose-600 bg-rose-50 border border-rose-100 p-4 rounded-xl text-center font-medium">
              {data.error}
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Always visible: Volume */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-slate-800 font-bold mb-1">Total Artifacts Detected</h3>
                  <p className="text-sm text-slate-500 font-medium">Lifetime volume of emails found</p>
                </div>
                <div className="text-3xl font-bold text-slate-700">
                  {data.volume.toLocaleString()}
                </div>
              </div>

              {/* Locked/Unlocked Section */}
              <div className="relative">
                {data.locked && (
                  <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-6 text-center border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100">
                      <Lock size={24} className="text-indigo-500" />
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg mb-2">Deep Intelligence Locked</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-sm font-medium">
                      Upgrade to PRO to instantly decrypt the latest communication contexts, exact timestamps, and high-risk security alerts.
                    </p>
                    <button 
                      onClick={() => navigate('/pricing')}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95"
                    >
                      Upgrade to PRO
                    </button>
                  </div>
                )}

                <div className={`space-y-4 ${data.locked ? 'opacity-30 pointer-events-none select-none blur-sm' : ''}`}>
                  
                  {/* Latest Activity */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={16} className="text-indigo-500" />
                      <h3 className="text-slate-800 font-bold">Latest Communication Context</h3>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-slate-700 text-sm truncate font-medium" title={data.latestSubject || "Security Alert: New sign-in from Mac"}>
                        {data.latestSubject || "Security Alert: New sign-in from Mac"}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 font-mono bg-white inline-block px-2 py-1 rounded border border-slate-200">
                        {data.lastActive || "Oct 24, 2023, 14:32 PM"}
                      </p>
                    </div>
                  </div>

                  {/* Security Flags */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={16} className="text-rose-500" />
                      <h3 className="text-slate-800 font-bold">Security & Account Risks</h3>
                    </div>
                    {data.securityFlags && data.securityFlags.length > 0 ? (
                      <ul className="space-y-2">
                        {data.securityFlags.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                            <span className="text-rose-500 mt-0.5 font-bold">•</span> {flag}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 italic font-medium">No recent password resets, unrecognized logins, or billing alerts detected.</p>
                    )}
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
              {scanCount}/{maxScans} Dives Used
            </span>
            <button 
              onClick={fetchDeepScan}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all border shadow-sm ${
                loading ? 'bg-slate-200 text-slate-500 cursor-not-allowed border-transparent' : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:shadow'
              }`}
            >
              <Activity size={16} className={loading ? "animate-spin text-slate-400" : "text-emerald-500"} />
              {loading ? 'Scanning...' : 'Rescan Insight'}
            </button>
          </div>

          <button 
            onClick={() => {
              if (isPro) {
                onNavigateToInbox(query);
                onClose();
              } else {
                navigate('/pricing');
              }
            }}
            className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-lg transition-all border border-slate-200 shadow-sm hover:shadow"
          >
            <Search size={16} className={isPro ? "text-indigo-500" : "text-slate-400"} />
            {isPro ? "Inbox" : "PRO Feature: Inbox"}
          </button>
        </div>

      </div>
    </div>
  );
}
