import React, { useState, useEffect } from 'react';
import { MonitorPlay, ThumbsUp, PlayCircle, Clock, AlertTriangle, RefreshCw, Eye, EyeOff, Search } from 'lucide-react';
import { supabase } from '../supabaseClient';
import localforage from 'localforage';
import { hasProAccess } from '../utils/access';

export default function YouTubeScanner({ member }) {
  const isPro = hasProAccess(member);
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions', 'liked', 'analysis'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ subscriptions: [], likedVideos: [] });

  useEffect(() => {
    const fetchCachedData = async () => {
      const cached = await localforage.getItem(`youtube_data_${member.id}`);
      if (cached) {
        setData(cached);
      }
    };
    if (member) fetchCachedData();
  }, [member]);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    try {
      // Stub for the backend call we will build next
      /*
      const { data: result, error: fetchErr } = await supabase.functions.invoke('audit-gateway', {
        body: {
          action: 'fetch-youtube',
          googleToken: member.access_token,
          plan: isPro ? 'pro' : 'free'
        }
      });
      if (fetchErr || result?.error) throw new Error(fetchErr?.message || result?.error || 'Failed to fetch YouTube data');
      */
      
      // Artificial delay to simulate backend loading for the UI demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock Data for UI demonstration until backend is wired
      const mockData = {
        subscriptions: [
          { id: '1', title: 'Crypto Daily', thumbnail: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', category: 'Finance' },
          { id: '2', title: 'BetterHelp Therapy', thumbnail: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', category: 'Mental Health' },
          { id: '3', title: 'Las Vegas Vlogs', thumbnail: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', category: 'Travel/Gambling' }
        ],
        likedVideos: [
          { id: 'v1', title: 'How to hide assets during a divorce', channel: 'Legal Eagle', date: '2 days ago' },
          { id: 'v2', title: '100x Altcoin Gems for 2026', channel: 'Crypto Daily', date: '1 week ago' },
          { id: 'v3', title: 'Dealing with severe anxiety', channel: 'Therapy in a Nutshell', date: '2 weeks ago' }
        ]
      };

      const finalData = mockData;
      setData(finalData);
      await localforage.setItem(`youtube_data_${member.id}`, finalData);
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MonitorPlay className="text-red-500" size={24} />
            YouTube OSINT Scanner
          </h2>
          <p className="text-sm text-slate-400 mt-1">Extract subscriptions, liked videos, and psychological profiles.</p>
        </div>
        <button
          onClick={handleScan}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? 'Extracting Intel...' : 'Scan YouTube Account'}
        </button>
      </div>

      {error && (
        <div className="m-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center border-b border-white/5 px-6 pt-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'subscriptions', label: 'Subscriptions', icon: PlayCircle },
          { id: 'liked', label: 'Liked Videos', icon: ThumbsUp },
          { id: 'analysis', label: 'Psychological Profile', icon: Eye }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'border-red-500 text-red-400' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.id === 'subscriptions' && data.subscriptions.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-white/5 text-[10px]">{data.subscriptions.length}</span>
            )}
            {tab.id === 'liked' && data.likedVideos.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-white/5 text-[10px]">{data.likedVideos.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6 bg-black/20 min-h-[400px]">
        
        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.subscriptions.length === 0 && !loading && (
              <div className="col-span-full py-12 text-center text-slate-500">
                <PlayCircle size={32} className="mx-auto mb-3 opacity-20" />
                <p>No subscriptions extracted yet. Click Scan.</p>
              </div>
            )}
            {data.subscriptions.map((sub, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-white/10">
                  <img src={sub.thumbnail} alt={sub.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-medium text-sm truncate">{sub.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{sub.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Liked Videos Tab */}
        {activeTab === 'liked' && (
          <div className="space-y-3">
            {data.likedVideos.length === 0 && !loading && (
              <div className="py-12 text-center text-slate-500 border border-dashed border-white/10 rounded-xl">
                <ThumbsUp size={32} className="mx-auto mb-3 opacity-20" />
                <p>No liked videos extracted yet. Click Scan.</p>
              </div>
            )}
            {data.likedVideos.map((video, i) => {
              // Basic heuristic flag
              const titleLower = video.title.toLowerCase();
              const isFlagged = titleLower.includes('crypto') || titleLower.includes('divorce') || titleLower.includes('therapy') || titleLower.includes('casino');
              
              return (
                <div key={i} className={`flex items-start justify-between p-4 rounded-xl border transition-colors ${
                  isFlagged ? 'bg-red-500/[0.03] border-red-500/20 hover:bg-red-500/[0.05]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                }`}>
                  <div className="flex gap-4">
                    <div className="w-24 h-16 bg-slate-800 rounded-lg shrink-0 flex items-center justify-center border border-white/10 overflow-hidden relative group">
                      <PlayCircle size={20} className="text-white/30" />
                    </div>
                    <div>
                      <h4 className={`font-medium text-sm mb-1 ${isFlagged ? 'text-red-100' : 'text-white'}`}>{video.title}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-3">
                        <span>{video.channel}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {video.date}</span>
                      </p>
                      {isFlagged && (
                        <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                          High Interest Target
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Psychological Profile Tab */}
        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Search className="text-indigo-400" size={18} />
                Heuristic Profiler
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Arukin analyzes the target's recent YouTube watch history, likes, and subscriptions to build an automated psychological profile based on categorized interests.
              </p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Financial & Crypto</span>
                    <span className="text-emerald-400 font-bold">45%</span>
                  </div>
                  <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Mental Health</span>
                    <span className="text-red-400 font-bold">30%</span>
                  </div>
                  <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Travel & Leisure</span>
                    <span className="text-indigo-400 font-bold">25%</span>
                  </div>
                  <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-start gap-4">
                 <AlertTriangle size={24} className="text-red-400 shrink-0 mt-1" />
                 <div>
                   <h4 className="text-red-100 font-bold text-sm mb-1">Vulnerability Detected</h4>
                   <p className="text-xs text-red-200/70 leading-relaxed">
                     Target is exhibiting high engagement with financial recovery and mental health content simultaneously, indicating potential real-world distress.
                   </p>
                 </div>
               </div>
               <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex items-start gap-4">
                 <EyeOff size={24} className="text-slate-400 shrink-0 mt-1" />
                 <div>
                   <h4 className="text-white font-bold text-sm mb-1">Ghost Actions (PRO)</h4>
                   <p className="text-xs text-slate-500 leading-relaxed">
                     Silently manipulate the target's YouTube algorithm by injecting specific subscriptions and un-liking videos.
                   </p>
                   <button className="mt-3 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 rounded-lg transition-colors border border-white/10 cursor-pointer">
                     Inject Algorithm Pattern
                   </button>
                 </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
