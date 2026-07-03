import React, { useState, useEffect } from 'react';
import { MonitorPlay, ThumbsUp, PlayCircle, Clock, AlertTriangle, RefreshCw, Eye, EyeOff, Search, User, Info } from 'lucide-react';
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
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('7d');
  const [subscriptionsPage, setSubscriptionsPage] = useState(1);
  const [subscribersPage, setSubscribersPage] = useState(1);

  const getPaginationRange = (currentPage, totalPages) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

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
      if (!member.id) {
        throw new Error('No member context available.');
      }

      const res = await supabase.functions.invoke('audit-gateway', {
        body: {
          action: 'fetch-youtube',
          memberId: member.id,
          plan: isPro ? 'pro' : 'free'
        }
      });

      if (res.error) throw new Error(res.error.message || 'Failed to fetch YouTube data');
      if (res.data.error) throw new Error(res.data.error);

      const ed = res.data;
      const channelItem = ed.channel;

      let formattedChannel = null;
      if (channelItem) {
        formattedChannel = {
          id: channelItem.id,
          title: channelItem.snippet?.title || 'YouTube User',
          subscribers: Number(channelItem.statistics?.subscriberCount || 0).toLocaleString(),
          videos: Number(channelItem.statistics?.videoCount || 0).toLocaleString(),
          views: Number(channelItem.statistics?.viewCount || 0).toLocaleString(),
          thumbnail: channelItem.snippet?.thumbnails?.high?.url || channelItem.snippet?.thumbnails?.default?.url || member.avatar_url,
          banner: channelItem.brandingSettings?.image?.bannerExternalUrl || null,
          customUrl: channelItem.snippet?.customUrl || '',
          country: channelItem.snippet?.country || 'Unknown',
          description: channelItem.snippet?.description || 'No description provided.',
          joined: new Date(channelItem.snippet?.publishedAt || Date.now()).toLocaleDateString()
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

      // The backend has already filtered to the Top 100 most influential active subscribers
      const formattedSubscribers = (ed.subscribers || []).map(sub => {
        return {
          id: sub.channelId,
          title: sub.title,
          thumbnail: sub.thumbnail,
          subs: Number(sub.subscribers).toLocaleString(),
          videos: Number(sub.videos || 0).toLocaleString(),
          joined: sub.joined ? new Date(sub.joined).toLocaleDateString() : 'Unknown'
        };
      });

      const realAnalyticsMap = {};
      if (ed.analytics) {
         Object.keys(ed.analytics).forEach(tf => {
           const tfData = ed.analytics[tf];
           if (tfData && tfData.basicStats && tfData.basicStats.rows && tfData.basicStats.rows.length > 0) {
             const bs = tfData.basicStats.rows[0];
             realAnalyticsMap[tf] = {
               views: Number(bs[0]).toLocaleString(),
               watchTime: (Number(bs[1]) / 60).toFixed(1) + ' hrs',
               revenue: '$' + Number(bs[2] || 0).toFixed(2),
               rawViewsData: tfData.viewsOverTime?.rows || [],
               rawTrafficData: tfData.trafficSources?.rows || [],
               rawGeoData: tfData.geographies?.rows || [],
               rawGenderData: tfData.gender?.rows || []
             };
           } else {
             realAnalyticsMap[tf] = { watchTime: '0 hrs', revenue: '$0.00', views: '0', rawViewsData: [], rawTrafficData: [], rawGeoData: [], rawGenderData: [] };
           }
         });
      }

      const mockVideos = [
        { id: '1', title: 'My First Vlog', views: '1,200', likes: '45', comments: '12', date: '2025-01-15' },
        { id: '2', title: 'React Tutorial', views: '5,400', likes: '320', comments: '54', date: '2025-02-22' }
      ];

      const finalData = {
        channel: formattedChannel,
        subscriptions: ed.subscriptions || [],
        playlists: ed.playlists || [],
        analytics: realAnalyticsMap,
        videos: mockVideos,
        subscribers: formattedSubscribers
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member.id]);

  const handleRefresh = async () => {
    await localforage.removeItem(`youtube_data_${member.id}`);
    await fetchYouTubeData();
  };

  const tabs = [
    { id: 'info', label: 'Channel Info' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'subscribers', label: 'Subscribers' },
    { id: 'videos', label: 'Videos' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'comments', label: 'Comments' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4 text-red-500" size={32} />
        <p>Loading YouTube intel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-400 max-w-md mx-auto text-center">
        <Youtube size={48} className="mb-4 opacity-50" />
        <h3 className="text-xl font-bold mb-2">Access Revoked</h3>
        <p className="text-sm text-red-400/80 mb-6">{error}</p>
        <button 
          onClick={fetchYouTubeData}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data.channel) {
    return null;
  }

  const currentAnalytics = data?.analytics?.[analyticsTimeframe] || { watchTime: '0 hrs', revenue: '$0.00', views: '0', rawViewsData: [], rawTrafficData: [], rawGeoData: [], rawGenderData: [] };

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col h-full">
        <>
          {error && (
            <div className="m-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-white/5 px-6 pt-2 bg-black/40">
            <div className="flex items-center overflow-x-auto hide-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? 'border-red-500 text-white bg-white/[0.02]' 
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="ml-4 mb-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors disabled:opacity-50 shrink-0"
              title="Force Refresh Data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-red-400" : ""} />
            </button>
          </div>

          <div className="p-8 bg-black/20 flex-1 overflow-y-auto">
            
            {/* Info Tab */}
            {activeTab === 'info' && data.channel && (
              <div className="space-y-6">
                <div className="border border-white/5 bg-black/40 rounded-2xl overflow-hidden shadow-xl">
                  {/* Banner Area */}
                  <div className="h-48 w-full bg-slate-900 relative">
                    {data.channel.banner ? (
                      <img src={data.channel.banner} alt="Channel Banner" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-slate-900 to-indigo-900 opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  
                  {/* Profile Info */}
                  <div className="p-8 relative -mt-16 flex flex-col md:flex-row items-center md:items-end gap-6">
                    <div className="w-32 h-32 rounded-full border-4 border-[#0A0A0B] overflow-hidden shrink-0 shadow-2xl bg-slate-800">
                      <img src={data.channel.thumbnail} alt="Channel Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/a/default-user=s120'; }} />
                    </div>
                    <div className="flex-1 text-center md:text-left pt-16 md:pt-0">
                      <h3 className="text-3xl font-bold text-white mb-1">{data.channel.title}</h3>
                      <p className="text-sm text-indigo-400 font-medium mb-4">{data.channel.customUrl}</p>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
                         <span className="flex items-center gap-1.5"><User size={14} className="text-slate-500" /> Joined {data.channel.joined}</span>
                         <span className="flex items-center gap-1.5"><Eye size={14} className="text-slate-500" /> {data.channel.views} Views</span>
                         <span className="flex items-center gap-1.5 text-slate-300">📍 {data.channel.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio Area */}
                  <div className="px-8 pb-8">
                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                      <h4 className="text-sm font-semibold text-white mb-3">About Channel</h4>
                      <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {data.channel.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h4 className="text-lg font-bold text-white">Channel Analytics Overview</h4>
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                    {[
                      { id: '7d', label: '7 Days' },
                      { id: '30d', label: '30 Days' },
                      { id: '1y', label: '1 Year' },
                      { id: 'lifetime', label: 'Lifetime' }
                    ].map(tf => (
                      <button
                        key={tf.id}
                        onClick={() => setAnalyticsTimeframe(tf.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                          analyticsTimeframe === tf.id
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div 
                    onClick={() => setActiveTab('subscribers')}
                    className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.05] hover:border-red-500/30 transition-all group"
                  >
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 group-hover:text-red-400 transition-colors">Total Subscribers</p>
                    <p className="text-2xl font-bold text-white">{data.channel?.subscribers || '0'}</p>
                    <p className="text-[10px] text-emerald-500 mt-1">+14% vs last week</p>
                  </div>
                  <div 
                    onClick={() => setActiveTab('videos')}
                    className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.05] hover:border-red-500/30 transition-all group"
                  >
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 group-hover:text-red-400 transition-colors">Total Views</p>
                    <p className="text-2xl font-bold text-white">{data.channel?.views || '0'}</p>
                    <p className="text-[10px] text-emerald-500 mt-1">+5.2% vs last week</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total Videos</p>
                    <p className="text-2xl font-bold text-white">{data.channel?.videos || '0'}</p>
                    <p className="text-[10px] text-emerald-500 mt-1">+2 this month</p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Views</p>
                    <p className="text-2xl font-bold text-white">{currentAnalytics.views}</p>
                    <p className="text-[10px] text-emerald-500 mt-1">+12.5% vs last week</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Watch Time (Hours)</p>
                    <p className="text-2xl font-bold text-white">{currentAnalytics.watchTime}</p>
                    <p className="text-[10px] text-red-500 mt-1">-2.1% vs last week</p>
                  </div>
                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><MonitorPlay size={48} /></div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Est. Revenue</p>
                    <p className="text-2xl font-bold text-emerald-400">{currentAnalytics.revenue}</p>
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
                        <AreaChart data={(currentAnalytics.rawViewsData || []).map(row => ({ name: row[0].split('-').slice(1).join('/'), views: row[1] }))}>
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
                      {currentAnalytics.rawTrafficData?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={currentAnalytics.rawTrafficData.map(row => ({ name: row[0].replace('EXT_URL', 'External').replace('YT_SEARCH', 'Search').replace('RELATED_VIDEO', 'Suggested'), value: row[1] }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {currentAnalytics.rawTrafficData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#111118', border: '1px solid #ffffff10', borderRadius: '8px' }}
                              itemStyle={{ color: '#fff' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 text-sm">No data available</div>
                      )}
                    </div>
                    <div className="space-y-2 mt-4">
                      {(currentAnalytics.rawTrafficData || []).map((row, i) => {
                         const total = currentAnalytics.rawTrafficData.reduce((acc, curr) => acc + curr[1], 0);
                         const pct = total > 0 ? Math.round((row[1] / total) * 100) : 0;
                         return (
                           <div key={i} className="flex items-center justify-between text-xs">
                             <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                               <span className="text-slate-400">{row[0].replace('EXT_URL', 'External').replace('YT_SEARCH', 'Search').replace('RELATED_VIDEO', 'Suggested')}</span>
                             </div>
                             <span className="text-white font-medium">{pct}%</span>
                           </div>
                         );
                      })}
                    </div>
                  </div>
                </div>

                {/* Demographics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <h5 className="text-sm font-semibold text-white mb-4">Top Geographies</h5>
                    <div className="space-y-4">
                      {currentAnalytics.rawGeoData?.length > 0 ? currentAnalytics.rawGeoData.map((row, i) => {
                        const total = currentAnalytics.rawGeoData.reduce((acc, curr) => acc + curr[1], 0);
                        const pct = total > 0 ? Math.round((row[1] / total) * 100) : 0;
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-300 font-medium">{row[0]}</span>
                              <span className="text-slate-400">{pct}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5">
                              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      }) : <div className="text-slate-500 text-sm">No data available</div>}
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-center">
                     <h5 className="text-sm font-semibold text-white mb-4">Audience Gender</h5>
                     {currentAnalytics.rawGenderData?.length > 0 ? currentAnalytics.rawGenderData.map((row, i) => (
                       <div key={i} className="flex items-center gap-4 mb-4">
                         <div className="flex-1">
                           <div className="flex justify-between text-xs mb-1">
                             <span className="text-slate-300 font-medium capitalize">{row[0]}</span>
                             <span className="text-slate-400">{Math.round(row[1])}%</span>
                           </div>
                           <div className="w-full bg-white/5 rounded-full h-2">
                             <div className={row[0] === 'male' ? "bg-indigo-500 h-2 rounded-full" : row[0] === 'female' ? "bg-pink-500 h-2 rounded-full" : "bg-emerald-500 h-2 rounded-full"} style={{ width: `${row[1]}%` }}></div>
                           </div>
                         </div>
                       </div>
                     )) : <div className="text-slate-500 text-sm">No data available</div>}
                  </div>
                </div>

              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Channels They Subscribe To ({data.subscriptions?.length || 0})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {data.subscriptions?.slice((subscriptionsPage - 1) * 25, subscriptionsPage * 25).map((sub, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                      <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0">
                        <img src={sub.thumbnail} alt={sub.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.src = 'https://lh3.googleusercontent.com/a/default-user=s120'; }} />
                      </div>
                      <h4 className="text-white font-medium text-sm truncate" title={sub.title}>{sub.title}</h4>
                    </div>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {data.subscriptions?.length > 25 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button 
                      onClick={() => setSubscriptionsPage(p => Math.max(1, p - 1))}
                      disabled={subscriptionsPage === 1}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-xs rounded-lg transition-colors border border-white/10"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1 mx-2">
                      {getPaginationRange(subscriptionsPage, Math.ceil(data.subscriptions.length / 25)).map((item, idx) => {
                        if (item === '...') {
                          return <span key={`ellipsis-${idx}`} className="px-1 text-slate-500 text-xs tracking-widest">...</span>;
                        }
                        return (
                          <button
                            key={`page-${item}`}
                            onClick={() => setSubscriptionsPage(item)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors border ${
                              subscriptionsPage === item 
                                ? 'bg-red-500 text-white border-red-500/50' 
                                : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => setSubscriptionsPage(p => Math.min(Math.ceil(data.subscriptions.length / 25), p + 1))}
                      disabled={subscriptionsPage === Math.ceil(data.subscriptions.length / 25)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-xs rounded-lg transition-colors border border-white/10"
                    >
                      Next
                    </button>
                  </div>
                )}
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

            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-white">Recent Subscribers</h4>
                      <div className="relative group flex items-center justify-center">
                        <Info size={16} className="text-slate-500 cursor-help hover:text-white transition-colors" />
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-3 bg-slate-800 text-xs text-slate-300 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                          Google's API permanently limits subscriber queries to the most recent 1,000 accounts. This list ranks influence exclusively within that latest cohort.
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400">Analysis of the newest subscribers.</p>
                  </div>
                </div>
                
                <div className="overflow-hidden border border-white/5 rounded-2xl bg-white/[0.02]">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="text-xs uppercase bg-black/40 text-slate-300 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4">Subscriber</th>
                        <th className="px-6 py-4">Their Subs</th>
                        <th className="px-6 py-4">Total Videos</th>
                        <th className="px-6 py-4">Subscribed On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.subscribers?.slice((subscribersPage - 1) * 10, subscribersPage * 10).map((sub, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-800">
                                <img src={sub.thumbnail} alt={sub.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="font-medium text-white">{sub.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-300">{sub.subs}</td>
                          <td className="px-6 py-4">{sub.videos}</td>
                          <td className="px-6 py-4">{sub.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {data.subscribers?.length > 10 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button 
                      onClick={() => setSubscribersPage(p => Math.max(1, p - 1))}
                      disabled={subscribersPage === 1}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-xs rounded-lg transition-colors border border-white/10"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1 mx-2">
                      {getPaginationRange(subscribersPage, Math.ceil(data.subscribers.length / 10)).map((item, idx) => {
                        if (item === '...') {
                          return <span key={`ellipsis-${idx}`} className="px-1 text-slate-500 text-xs tracking-widest">...</span>;
                        }
                        return (
                          <button
                            key={`page-${item}`}
                            onClick={() => setSubscribersPage(item)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors border ${
                              subscribersPage === item 
                                ? 'bg-red-500 text-white border-red-500/50' 
                                : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => setSubscribersPage(p => Math.min(Math.ceil(data.subscribers.length / 10), p + 1))}
                      disabled={subscribersPage === Math.ceil(data.subscribers?.length / 10)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-xs rounded-lg transition-colors border border-white/10"
                    >
                      Next
                    </button>
                  </div>
                )}
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
    </div>
  );
}
