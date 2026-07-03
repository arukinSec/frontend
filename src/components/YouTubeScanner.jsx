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

  const [activeTab, setActiveTab] = useState('analytics');

  const fetchYouTubeData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!member.access_token) {
        throw new Error('No access token available for this member.');
      }

      const headers = {
        Authorization: `Bearer ${member.access_token}`,
        Accept: 'application/json'
      };

      // 1. Fetch Channel Info
      const channelRes = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true', { headers });
      const channelData = await channelRes.json();
      
      if (!channelRes.ok) throw new Error(channelData.error?.message || 'Failed to fetch channel data');

      // 2. Fetch Subscriptions (Who they subscribe to)
      const subsRes = await fetch('https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50', { headers });
      const subsData = await subsRes.json();

      // 3. Fetch Playlists (Public and Private)
      const playlistsRes = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet,status&mine=true&maxResults=50', { headers });
      const playlistsData = await playlistsRes.json();

      const channelItem = channelData.items?.[0];
      let formattedChannel = null;
      let uploadsPlaylistId = null;

      if (channelItem) {
        uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;
        formattedChannel = {
          id: channelItem.id,
          title: channelItem.snippet.title,
          subscribers: Number(channelItem.statistics.subscriberCount || 0).toLocaleString(),
          videos: Number(channelItem.statistics.videoCount || 0).toLocaleString(),
          views: Number(channelItem.statistics.viewCount || 0).toLocaleString(),
          thumbnail: channelItem.snippet.thumbnails?.high?.url || channelItem.snippet.thumbnails?.default?.url || member.avatar_url,
          description: channelItem.snippet.description || 'No description provided.',
          joined: new Date(channelItem.snippet.publishedAt).toLocaleDateString()
        };
      } else {
        formattedChannel = {
          id: 'unknown',
          title: member.name || 'YouTube User',
          subscribers: '0',
          videos: '0',
          views: '0',
          thumbnail: member.avatar_url || 'https://lh3.googleusercontent.com/a/default-user=s120',
          description: 'This user does not have a public YouTube channel.',
          joined: 'Unknown'
        };
      }

      const formattedSubs = (subsData.items || []).map(item => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.default?.url || item.snippet.thumbnails?.high?.url,
        category: 'Subscription'
      }));

      const formattedPlaylists = (playlistsData.items || []).map(item => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        status: item.status?.privacyStatus || 'public'
      }));

      // Mocking complex endpoints for the UI structure while we wire them up
      const mockAnalytics = { watchTime: '1,245 hrs', revenue: '$340.50', impressions: '45,200' };
      const mockVideos = [
        { id: '1', title: 'My First Vlog', views: '1,200', likes: '45', comments: '12', date: '2025-01-15' },
        { id: '2', title: 'React Tutorial', views: '5,400', likes: '320', comments: '54', date: '2025-02-22' }
      ];
      const mockSubscribers = [
        { id: 's1', title: 'John Doe', thumbnail: 'https://lh3.googleusercontent.com/a/default-user=s120' },
        { id: 's2', title: 'Jane Smith', thumbnail: 'https://lh3.googleusercontent.com/a/default-user=s120' }
      ];

      const finalData = {
        channel: formattedChannel,
        subscriptions: formattedSubs,
        playlists: formattedPlaylists,
        analytics: mockAnalytics,
        videos: mockVideos,
        subscribers: mockSubscribers
      };

      setData(finalData);
      await localforage.setItem(`youtube_data_${member.id}`, finalData);
      
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

  const tabs = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'subscribers', label: 'Subscribers' },
    { id: 'videos', label: 'Videos' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'comments', label: 'Comments' }
  ];

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
                <div className="w-24 h-24 rounded-full border-4 border-white/10 overflow-hidden shrink-0 shadow-xl">
                  <img src={data.channel.thumbnail} alt="Channel Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/a/default-user=s120'; }} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-white mb-2">{data.channel.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 max-w-3xl">{data.channel.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-white/5 px-6 pt-2 overflow-x-auto hide-scrollbar bg-black/40">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'border-red-500 text-red-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 bg-black/20 flex-1">
            
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Channel Analytics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total Subscribers</p>
                    <p className="text-2xl font-bold text-white">{data.channel?.subscribers || '0'}</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total Views</p>
                    <p className="text-2xl font-bold text-white">{data.channel?.views || '0'}</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Est. Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">{data.analytics?.revenue || '$0.00'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Channels They Subscribe To ({data.subscriptions?.length || 0})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {data.subscriptions?.map((sub, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                      <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0">
                        <img src={sub.thumbnail} alt={sub.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/a/default-user=s120'; }} />
                      </div>
                      <h4 className="text-white font-medium text-sm truncate" title={sub.title}>{sub.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playlists Tab */}
            {activeTab === 'playlists' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Playlists ({data.playlists?.length || 0})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {data.playlists?.map((pl, i) => (
                    <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                      <div className="w-full h-32 bg-slate-800 rounded-lg overflow-hidden shrink-0 relative">
                        <img src={pl.thumbnail} alt={pl.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/a/default-user=s120'; }} />
                        <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${pl.status === 'public' ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                          {pl.status}
                        </span>
                      </div>
                      <h4 className="text-white font-medium text-sm truncate" title={pl.title}>{pl.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Tab (Mocked UI) */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Uploaded Videos</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="text-xs uppercase bg-white/5 text-slate-300">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Video Title</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Views</th>
                        <th className="px-4 py-3">Likes</th>
                        <th className="px-4 py-3 rounded-r-lg">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.videos?.map((video, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-4 py-4 font-medium text-white">{video.title}</td>
                          <td className="px-4 py-4">{video.date}</td>
                          <td className="px-4 py-4">{video.views}</td>
                          <td className="px-4 py-4">{video.likes}</td>
                          <td className="px-4 py-4">{video.comments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Subscribers Tab (Mocked UI) */}
            {activeTab === 'subscribers' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Subscribers List</h4>
                <p className="text-sm text-slate-400">This pulls a list of users subscribed to this target.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {data.subscribers?.map((sub, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                      <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0">
                        <img src={sub.thumbnail} alt={sub.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <h4 className="text-white font-medium text-sm truncate" title={sub.title}>{sub.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Tab (Mocked UI) */}
            {activeTab === 'comments' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Recent Comments</h4>
                <p className="text-sm text-slate-400">Comments posted on this target's videos or by this target.</p>
                <div className="p-12 text-center text-slate-500 border border-dashed border-white/10 rounded-2xl">
                  <p>Comments API integration pending.</p>
                </div>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}
