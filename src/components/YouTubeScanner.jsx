import React, { useState, useEffect } from 'react';
import { MonitorPlay, ThumbsUp, PlayCircle, Clock, AlertTriangle, RefreshCw, Eye, EyeOff, Search, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import localforage from 'localforage';
import { hasProAccess } from '../utils/access';

export default function YouTubeScanner({ member }) {
  const isPro = hasProAccess(member);
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
    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col h-full overflow-y-auto">
      {loading && !data.channel ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
          <RefreshCw size={32} className="animate-spin mb-4 text-red-500/50" />
          <p>Fetching YouTube Data...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="m-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {data.channel && (
            <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden shrink-0 shadow-xl">
                  <img src={data.channel.thumbnail} alt="Channel Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-white mb-2">{data.channel.title}</h3>
                  <p className="text-sm text-slate-400 max-w-2xl">{data.channel.description || 'No description provided.'}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 mt-6">
                    <div className="text-center md:text-left">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Subscribers</p>
                      <p className="text-xl font-bold text-white">{data.channel.subscribers}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                    <div className="text-center md:text-left">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Videos</p>
                      <p className="text-xl font-bold text-white">{data.channel.videos}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                    <div className="text-center md:text-left">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total Views</p>
                      <p className="text-xl font-bold text-white">{data.channel.views}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-8 bg-black/20 flex-1">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <PlayCircle className="text-red-500" size={20} />
              Subscriptions
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-white/5 text-xs text-slate-400 font-medium">
                {data.subscriptions.length}
              </span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.subscriptions.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 bg-white/[0.01] rounded-2xl border border-white/5 dashed">
                  <p>No subscriptions found.</p>
                </div>
              ) : (
                data.subscriptions.map((sub, i) => (
                  <div key={i} className="flex flex-col gap-3 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-white/10 shadow-md group-hover:scale-105 transition-transform">
                        <img src={sub.thumbnail} alt={sub.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-white font-medium text-sm truncate" title={sub.title}>{sub.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">{sub.category}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
