import React, { useState, useEffect } from 'react';
import { MonitorPlay, ThumbsUp, PlayCircle, Clock, AlertTriangle, RefreshCw, Eye, EyeOff, Search, User } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../supabaseClient';
import localforage from 'localforage';
import { hasProAccess } from '../utils/access';

export default function YouTubeUI({ member }) {
  const isPro = hasProAccess(member);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ channel: null, subscriptions: [] });

  const [activeTab, setActiveTab] = useState('analytics');

  const mockViewData = [
    { name: 'Mon', views: 4200 },
    { name: 'Tue', views: 3800 },
    { name: 'Wed', views: 5600 },
    { name: 'Thu', views: 8900 },
    { name: 'Fri', views: 7200 },
    { name: 'Sat', views: 12400 },
    { name: 'Sun', views: 14200 },
  ];

  const mockTrafficData = [
    { name: 'Suggested', value: 45 },
    { name: 'Search', value: 30 },
    { name: 'Direct', value: 15 },
    { name: 'External', value: 10 },
  ];
  const PIE_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

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
    { id: 'info', label: 'Channel Info' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'subscribers', label: 'Subscribers' },
    { id: 'videos', label: 'Videos' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'comments', label: 'Comments' }
  ];

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col h-full">
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

          <div className="p-8 bg-black/20 flex-1 overflow-y-auto">
            
            {/* Info Tab */}
            {activeTab === 'info' && data.channel && (
              <div className="space-y-6">
                <div className="p-8 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden shrink-0 shadow-xl">
                      <img src={data.channel.thumbnail} alt="Channel Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/a/default-user=s120'; }} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold text-white mb-2">{data.channel.title}</h3>
                      <p className="text-sm text-slate-400 max-w-3xl mb-4">{data.channel.description}</p>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-slate-500 font-medium">
                         <span className="flex items-center gap-1"><User size={14} /> Joined {data.channel.joined}</span>
                         <span className="flex items-center gap-1"><Eye size={14} /> {data.channel.views} Views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Channel Analytics Overview (Last 7 Days)</h4>
                
                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total Subscribers</p>
                    <p className="text-2xl font-bold text-white">{data.channel?.subscribers || '0'}</p>
                    <p className="text-[10px] text-emerald-500 mt-1">+14% vs last week</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total Views</p>
                    <p className="text-2xl font-bold text-white">{data.channel?.views || '0'}</p>
                    <p className="text-[10px] text-emerald-500 mt-1">+5.2% vs last week</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Watch Time (Hours)</p>
                    <p className="text-2xl font-bold text-white">{data.analytics?.watchTime || '0'}</p>
                    <p className="text-[10px] text-red-500 mt-1">-2.1% vs last week</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><MonitorPlay size={48} /></div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Est. Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">{data.analytics?.revenue || '$0.00'}</p>
                    <p className="text-[10px] text-emerald-500 mt-1">RPM: $4.20</p>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Line Chart */}
                  <div className="lg:col-span-2 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h5 className="text-sm font-semibold text-white mb-6">Views Over Time</h5>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockViewData}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#111118', border: '1px solid #ffffff10', borderRadius: '8px' }}
                            itemStyle={{ color: '#ef4444' }}
                          />
                          <Area type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Traffic Sources Pie */}
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h5 className="text-sm font-semibold text-white mb-2">Traffic Sources</h5>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mockTrafficData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {mockTrafficData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: '#111118', border: '1px solid #ffffff10', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {mockTrafficData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}></div>
                            <span className="text-slate-400">{item.name}</span>
                          </div>
                          <span className="text-white font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Demographics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h5 className="text-sm font-semibold text-white mb-4">Top Geographies</h5>
                    <div className="space-y-4">
                      {[
                        { country: 'United States', pct: 42, flag: '🇺🇸' },
                        { country: 'United Kingdom', pct: 15, flag: '🇬🇧' },
                        { country: 'Canada', pct: 12, flag: '🇨🇦' },
                        { country: 'Australia', pct: 8, flag: '🇦🇺' },
                        { country: 'Germany', pct: 5, flag: '🇩🇪' },
                      ].map((loc, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300 font-medium">{loc.flag} {loc.country}</span>
                            <span className="text-slate-400">{loc.pct}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${loc.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-center">
                     <h5 className="text-sm font-semibold text-white mb-4">Audience Gender</h5>
                     <div className="flex items-center gap-4 mb-6">
                       <div className="flex-1">
                         <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-300 font-medium">Male</span>
                           <span className="text-slate-400">65%</span>
                         </div>
                         <div className="w-full bg-white/5 rounded-full h-2">
                           <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="flex-1">
                         <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-300 font-medium">Female</span>
                           <span className="text-slate-400">35%</span>
                         </div>
                         <div className="w-full bg-white/5 rounded-full h-2">
                           <div className="bg-pink-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                         </div>
                       </div>
                     </div>
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
