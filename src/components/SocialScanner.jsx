import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { supabase } from '../supabaseClient';
import DeepDiveModal from './DeepDiveModal';
import { getEncryptedItem, setEncryptedItem, removeEncryptedItem } from '../utils/cache';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: 'https://cdn.simpleicons.org/facebook' },
  { id: 'instagram', name: 'Instagram', icon: 'https://cdn.simpleicons.org/instagram' },
  { id: 'twitter', name: 'X (Twitter)', icon: 'https://cdn.simpleicons.org/x' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'https://cdn.simpleicons.org/linkedin' },
  { id: 'tiktok', name: 'TikTok', icon: 'https://cdn.simpleicons.org/tiktok' },
  { id: 'reddit', name: 'Reddit', icon: 'https://cdn.simpleicons.org/reddit' },
  { id: 'discord', name: 'Discord', icon: 'https://cdn.simpleicons.org/discord' },
  { id: 'twitch', name: 'Twitch', icon: 'https://cdn.simpleicons.org/twitch' },
];

export default function SocialScanner({ member, footprintData, setFootprintData, fetchWithAuth, onNavigateToInbox, isPro }) {
  const [scanStatus, setScanStatus] = useState(footprintData ? 'complete' : 'idle');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [serverUsage, setServerUsage] = useState([]);
  
  const maxScans = isPro ? 10 : 2;

  useEffect(() => {
    async function fetchUsage() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${supabase.supabaseUrl}/functions/v1/intel-gateway`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ action: 'get_usage', memberId: member.id })
        });
        if (res.ok) {
          const { usage } = await res.json();
          setServerUsage(usage);
          
          const socialLogs = usage.filter(l => l.scan_type === 'social');
          const platformCounts = {};
          socialLogs.forEach(l => {
            platformCounts[l.platform] = (platformCounts[l.platform] || 0) + 1;
          });
          const maxScansUsed = Object.values(platformCounts).length > 0 ? Math.max(...Object.values(platformCounts)) : 0;
          setScanCount(maxScansUsed);
        }
      } catch (err) {
        console.error("Failed to fetch usage logs", err);
      }
    }
    if (member) fetchUsage();
  }, [member]);

  useEffect(() => {
    const checkCache = async () => {
      if (member && !footprintData) {
        const cached = await getEncryptedItem(`footprints_${member.id}`);
        if (cached) {
          setFootprintData(cached);
          setScanStatus('complete');
        }
      }
    };
    checkCache();
  }, [member, footprintData, setFootprintData]);

  const PLATFORM_QUERIES = {
    facebook: 'from:facebookmail.com OR from:facebook.com',
    instagram: 'from:instagram.com OR from:mail.instagram.com',
    twitter: 'from:twitter.com OR from:x.com',
    linkedin: 'from:linkedin.com',
    tiktok: 'from:tiktok.com',
    reddit: 'from:reddit.com OR from:redditmail.com',
    discord: 'from:discord.com',
    twitch: 'from:twitch.tv OR from:twitchmail.com'
  };

  const handleScanFootprint = async () => {
    if (!member) return;
    setScanStatus('scanning');
    
    try {
      const results = {};
      
      const promises = PLATFORMS.map(async (platform) => {
        const query = PLATFORM_QUERIES[platform.id] || `from:${platform.name.toLowerCase()}.com`;
        
        const { data: { session } } = await supabase.auth.getSession();
        
        const res = await fetch(`${supabase.supabaseUrl}/functions/v1/intel-gateway`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({ scanType: 'social', query, memberId: member.id, platformId: platform.id })
        });
        
        if (res.ok) {
          const data = await res.json();
          results[platform.id] = { 
            status: data.detected ? 'connected' : 'not_found', 
            details: data.details 
          };
        } else {
          const errorText = await res.text();
          console.error(`Scan failed for ${platform.id}: Status ${res.status}, Error: ${errorText}`);
          if (res.status === 429) {
            try {
              const errData = JSON.parse(errorText);
              results[platform.id] = { status: 'rate_limited', details: errData.error };
            } catch (e) {
              results[platform.id] = { status: 'rate_limited', details: 'Rate limit reached' };
            }
          } else {
            results[platform.id] = { status: 'not_found', details: 'Scan failed' };
          }
        }
      });
      
      await Promise.all(promises);
      
      const newData = {
        lastScan: new Date().toISOString(),
        results
      };
      setFootprintData(newData);
      await setEncryptedItem(`footprints_${member.id}`, newData);
      
      setScanCount(prev => prev + 1);
      
      setScanStatus('complete');
    } catch (err) {
      console.error("Footprint scan failed:", err);
      setScanStatus('idle');
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-full flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Digital Footprint Scanner */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-800">Digital Footprint Scanner</h2>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  Last scanned: {footprintData?.lastScan ? new Date(footprintData.lastScan).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Never'}
                </span>
              </div>
              <p className="text-sm text-slate-500 max-w-2xl">
                Scans the user's inbox to detect which social media platforms and external services are actively linked to this email address. 
              </p>
            </div>
            
            <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
              {scanCount}/{maxScans} Scans Used
            </span>
            <button
              onClick={() => {
                if (scanCount >= maxScans) {
                  // If they click when out of scans, let them see the rate limit errors or upsell
                  handleScanFootprint();
                } else {
                  handleScanFootprint();
                }
              }}
              disabled={scanStatus === 'scanning'}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                scanStatus === 'scanning'
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
            >
              {scanStatus === 'scanning' ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
              {scanStatus === 'scanning' ? 'Scanning...' : scanStatus === 'complete' ? 'Rescan' : 'Run Scan'}
            </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 mt-2">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                 {PLATFORMS.map((platform) => {
                   const actualResults = footprintData?.results || footprintData;
                   const result = actualResults?.[platform.id];

                    return (
                      <div 
                        key={platform.id} 
                        onClick={() => {
                          if (result?.status === 'connected') {
                            setSelectedPlatform(platform);
                          }
                        }}
                        className={`flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm transition-shadow ${result?.status === 'connected' ? 'cursor-pointer hover:shadow-md hover:border-indigo-300 ring-1 ring-transparent hover:ring-indigo-100' : ''}`}
                      >
                         <div className="flex items-center gap-4">
                          {scanStatus === 'idle' && <Clock size={18} className="text-slate-300 shrink-0" />}
                          {scanStatus === 'scanning' && <RefreshCw size={18} className="text-indigo-400 animate-spin shrink-0" />}
                          {scanStatus === 'complete' && result?.status === 'connected' && <CheckCircle size={18} className="text-emerald-500 shrink-0" />}
                          {scanStatus === 'complete' && (result?.status === 'not_found' || result?.status === 'rate_limited') && <XCircle size={18} className="text-rose-500 shrink-0" />}
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                              <img src={platform.icon} alt={platform.name} className="w-5 h-5 object-contain" />
                            </div>
                           <div>
                             <p className="text-sm font-bold text-slate-800">{platform.name}</p>
                             <p className={`text-[10px] uppercase font-bold tracking-wider ${
                               scanStatus === 'idle' ? 'text-slate-400' :
                               scanStatus === 'scanning' ? 'text-indigo-500' :
                               result?.status === 'connected' ? 'text-emerald-600' :
                               'text-slate-400'
                             }`}>
                               {scanStatus === 'idle' ? 'Ready to Scan' :
                                scanStatus === 'scanning' ? 'Scanning...' :
                                result?.status === 'connected' ? 'Email Detected' : 'Unlikely'}
                              </p>
                            </div>
                          </div>
                        </div>
                        {scanStatus === 'complete' && result?.status === 'rate_limited' && result?.details && (
                          <span className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                            {result.details}
                          </span>
                        )}
                        {scanStatus === 'complete' && result?.status === 'connected' && (
                          <Search size={16} className="text-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                   );
                 })}
               </div>
          </div>
        </div>
      </div>
      
      {selectedPlatform && (
        <DeepDiveModal 
            platform={selectedPlatform} 
            query={PLATFORM_QUERIES[selectedPlatform.id]}
            memberId={member.id}
            isPro={isPro}
            serverUsage={serverUsage}
            onClose={() => setSelectedPlatform(null)}
            onNavigateToInbox={() => onNavigateToInbox(selectedPlatform.id.toUpperCase())}
          />
      )}
    </div>
  );
}
