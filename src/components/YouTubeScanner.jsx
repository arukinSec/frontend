import React, { useState, useEffect } from 'react';
import { MonitorPlay, ThumbsUp, PlayCircle, Clock, AlertTriangle, RefreshCw, Eye, EyeOff, Search, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import localforage from 'localforage';
import { hasProAccess } from '../utils/access';

export default function YouTubeScanner({ member }) {
  const isPro = hasProAccess(member);
  const [activeTab, setActiveTab] = useState('channel'); // 'channel', 'subscriptions'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ channel: null, subscriptions: [] });

  const fetchYouTubeData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Artificial delay to simulate backend loading for the UI demo
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock Data for UI demonstration until backend is wired
      const mockData = {
        channel: {
          title: member?.name || 'User Channel',
          subscribers: '1.2K',
          videos: '15',
          views: '124,500',
          thumbnail: member?.avatar_url || 'https://lh3.googleusercontent.com/a/default-user=s120',
          description: 'Personal channel for vlogs and random clips.',
          joined: 'Oct 2018'
        },
        subscriptions: [
          { id: '1', title: 'Crypto Daily', thumbnail: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', category: 'Finance' },
          { id: '2', title: 'BetterHelp Therapy', thumbnail: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', category: 'Mental Health' },
          { id: '3', title: 'Las Vegas Vlogs', thumbnail: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', category: 'Travel/Gambling' }
        ]
      };

      setData(mockData);
      await localforage.setItem(`youtube_data_${member.id}`, mockData);
      
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const cached = await localforage.getItem(`youtube_data_${member.id}`);
      if (cached) {
        setData(cached);
      } else {
        await fetchYouTubeData();
      }
    };
    if (member) loadData();
  }, [member]);

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MonitorPlay className="text-red-500" size={24} />
            YouTube Data Gateway
          </h2>
          <p className="text-sm text-slate-400 mt-1">Live extraction of channel overview and subscriptions directly from the Google API.</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
            <RefreshCw size={16} className="animate-spin" />
            <span>Fetching Data...</span>
          </div>
        )}
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
          { id: 'channel', label: 'Channel Overview', icon: User },
          { id: 'subscriptions', label: 'Subscriptions', icon: PlayCircle }
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
            {tab.id === 'subscriptions' && data.subscriptions?.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-white/5 text-[10px]">{data.subscriptions.length}</span>
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

        {/* Channel Overview Tab */}
        {activeTab === 'channel' && (
          <div className="space-y-6">
            {!data.channel && !loading ? (
              <div className="py-12 text-center text-slate-500">
                <User size={32} className="mx-auto mb-3 opacity-20" />
                <p>No channel data fetched yet. Click Pull YouTube Data.</p>
              </div>
            ) : data.channel && (
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white/10 overflow-hidden shrink-0">
                  <img src={data.channel.thumbnail} alt="Channel Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                    {data.channel.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{data.channel.description || 'No description provided.'}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6">
                    <div className="text-center md:text-left">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Subscribers</p>
                      <p className="text-lg font-bold text-white">{data.channel.subscribers}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                    <div className="text-center md:text-left">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Videos</p>
                      <p className="text-lg font-bold text-white">{data.channel.videos}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                    <div className="text-center md:text-left">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Views</p>
                      <p className="text-lg font-bold text-white">{data.channel.views}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
