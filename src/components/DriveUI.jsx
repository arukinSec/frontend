import React, { useState, useEffect } from 'react';
import { File, FileText, Image, RefreshCw, Download, Trash2, X, Eye, ChevronRight, Film, Music, Shield } from 'lucide-react';
import { supabase } from '../supabaseClient';

// ── Real Google Drive SVG logo ─────────────────────────────────────────────────
const DriveIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z" fill="#00ac47"/>
    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 11.5z" fill="#ea4335"/>
    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
  </svg>
);

// ── Confirm Modal ──────────────────────────────────────────────────────────────
function ConfirmModal({ isOpen, icon, title, message, confirmLabel, danger, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-slate-200">
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${danger ? 'bg-red-50' : 'bg-blue-50'}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── File Viewer Modal ──────────────────────────────────────────────────────────
function FileViewerModal({ viewer, onClose, onDownload }) {
  if (!viewer.open) return null;
  const { file, loading, blobUrl, textContent, previewUrl } = viewer;
  const isImage = file?.mimeType?.startsWith('image/');
  const isPdf = file?.mimeType?.includes('pdf');
  const isText = file?.mimeType?.startsWith('text/') || ['json','csv','xml'].some(t => file?.mimeType?.includes(t));
  const isGoogle = file?.mimeType?.startsWith('application/vnd.google-apps.');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0 bg-slate-50">
          <div className="flex items-center gap-2.5 min-w-0">
            <Eye size={14} className="text-slate-400 shrink-0" />
            <span className="text-sm font-medium text-slate-700 truncate">{file?.name}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            <button onClick={onDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
              <Download size={12} /> Download
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><X size={15} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
              <RefreshCw size={18} className="animate-spin" />
              <span className="text-sm">Loading preview…</span>
            </div>
          ) : isGoogle && previewUrl ? (
            <iframe src={previewUrl} className="w-full h-full" style={{ minHeight: 480, border: 'none' }} title={file.name} />
          ) : isImage && blobUrl ? (
            <div className="flex items-center justify-center bg-[#f8f9fa] p-6" style={{ minHeight: 300, maxHeight: '70vh' }}>
              <img src={blobUrl} alt={file.name} style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain' }} className="rounded-lg shadow" />
            </div>
          ) : isPdf && blobUrl ? (
            <embed src={blobUrl} type="application/pdf" className="w-full" style={{ height: '65vh' }} />
          ) : isText && textContent ? (
            <div className="overflow-auto bg-[#f8f9fa] p-5" style={{ maxHeight: '65vh' }}>
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">{textContent}</pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400 py-16">
              <File size={44} className="opacity-20" />
              <p className="text-sm">No preview available for this file type.</p>
              <button onClick={onDownload} className="text-blue-500 text-sm hover:underline">Download to view locally</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── File type helpers ──────────────────────────────────────────────────────────
const getMimeColor = (mimeType) => {
  if (!mimeType) return 'text-slate-400';
  if (mimeType === 'application/vnd.google-apps.folder') return 'text-[#5f6368]';
  if (mimeType.startsWith('image/')) return 'text-pink-500';
  if (mimeType.startsWith('video/')) return 'text-purple-500';
  if (mimeType.startsWith('audio/')) return 'text-orange-400';
  if (mimeType.includes('pdf')) return 'text-red-500';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'text-emerald-500';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'text-blue-500';
  if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('csv')) return 'text-cyan-500';
  return 'text-slate-400';
};

const FileIcon = ({ mimeType, size = 20 }) => {
  const cls = `${getMimeColor(mimeType)} shrink-0`;
  if (!mimeType) return <File size={size} className={cls} />;
  if (mimeType === 'application/vnd.google-apps.folder') return <FolderIcon size={size} />;
  if (mimeType.startsWith('image/')) return <Image size={size} className={cls} />;
  if (mimeType.startsWith('video/')) return <Film size={size} className={cls} />;
  if (mimeType.startsWith('audio/')) return <Music size={size} className={cls} />;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word')) return <FileText size={size} className={cls} />;
  if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('csv')) return <FileText size={size} className={cls} />;
  return <File size={size} className={cls} />;
};

// Google Drive style folder (two-tone slate gray)
const FolderIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z" fill="#747775"/>
    <path d="M20 6H12L10.59 7.41C10.21 7.79 9.7 8 9.17 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z" fill="#8e918f"/>
  </svg>
);

const formatSize = (bytes) => {
  if (!bytes) return '—';
  const n = parseInt(bytes, 10);
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1073741824) return (n / 1048576).toFixed(1) + ' MB';
  return (n / 1073741824).toFixed(2) + ' GB';
};

const formatDate = (d) => {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date) ? '—' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatStorageBytes = (b) => {
  if (!b) return '0 B';
  const n = parseInt(b, 10);
  if (n < 1073741824) return (n / 1048576).toFixed(0) + ' MB';
  if (n < 1099511627776) return (n / 1073741824).toFixed(2) + ' GB';
  return (n / 1099511627776).toFixed(2) + ' TB';
};

const isPreviewable = (mimeType) => {
  if (!mimeType) return false;
  if (mimeType.startsWith('image/')) return true;
  if (mimeType.includes('pdf')) return true;
  if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('csv') || mimeType.includes('xml')) return true;
  if (mimeType.startsWith('application/vnd.google-apps.') && !mimeType.includes('folder')) return true;
  return false;
};

// ── Main DriveUI ───────────────────────────────────────────────────────────────
export default function DriveUI({ member }) {
  const isPro = (localStorage.getItem('auditor_tier') || 'FREE') === 'PRO';

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storageQuota, setStorageQuota] = useState(null);
  const [currentView, setCurrentView] = useState('my-drive');
  const [folderStack, setFolderStack] = useState([{ id: 'root', name: 'My Drive' }]);
  const [confirm, setConfirm] = useState({ open: false });
  const [viewer, setViewer] = useState({ open: false, file: null, blobUrl: null, textContent: null, previewUrl: null, loading: false });

  const showConfirm = (opts) => setConfirm({ open: true, ...opts });
  const hideConfirm = () => setConfirm({ open: false });
  const closeViewer = () => {
    if (viewer.blobUrl) URL.revokeObjectURL(viewer.blobUrl);
    setViewer({ open: false, file: null, blobUrl: null, textContent: null, previewUrl: null, loading: false });
  };

  // ── Auth fetch wrapper ────────────────────────────────────────────────────────
  const fetchWithAuth = async (url, options = {}) => {
    let res = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${member.access_token}` } });
    if (res.status === 401 || res.status === 403) {
      try {
        const { data, err } = await supabase.functions.invoke('refresh-google-token', { body: { member_id: member.id } });
        if (err) throw err;
        if (data?.access_token) {
          member.access_token = data.access_token;
          res = await fetch(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${member.access_token}` } });
        }
      } catch (e) { console.error('Token refresh failed:', e); }
    }
    return res;
  };

  // ── Fetch files ───────────────────────────────────────────────────────────────
  const fetchDriveFiles = async (folderId = 'root') => {
    if (!member?.access_token) { setError('No access token.'); setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      let q;
      if (folderId === 'images') q = encodeURIComponent(`mimeType contains 'image/' and trashed=false and 'me' in owners`);
      else if (folderId === 'videos') q = encodeURIComponent(`mimeType contains 'video/' and trashed=false and 'me' in owners`);
      else if (folderId === 'shared') q = encodeURIComponent('sharedWithMe=true and trashed=false');
      else q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);

      const [filesRes, aboutRes] = await Promise.all([
        fetchWithAuth(`https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,size,modifiedTime)&pageSize=100&q=${q}`),
        fetchWithAuth('https://www.googleapis.com/drive/v3/about?fields=storageQuota')
      ]);
      if (!filesRes.ok) throw new Error('Failed to fetch Drive files.');
      const filesData = await filesRes.json();
      setFiles(filesData.files || []);
      if (aboutRes.ok) { const d = await aboutRes.json(); setStorageQuota(d.storageQuota || null); }
    } catch (err) { console.error(err); setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDriveFiles('root'); }, [member]);

  // ── Navigation ────────────────────────────────────────────────────────────────
  const switchView = (view) => {
    setCurrentView(view);
    const labels = { 'my-drive': { id: 'root', name: 'My Drive' }, shared: { id: 'shared', name: 'Shared with me' }, images: { id: 'images', name: 'Images' }, videos: { id: 'videos', name: 'Videos' } };
    setFolderStack([labels[view]]);
    fetchDriveFiles(labels[view].id);
  };

  const openFolder = (folder) => {
    const newStack = [...folderStack, { id: folder.id, name: folder.name }];
    setFolderStack(newStack);
    fetchDriveFiles(folder.id);
  };

  const navigateTo = (index) => {
    const newStack = folderStack.slice(0, index + 1);
    setFolderStack(newStack);
    fetchDriveFiles(newStack[newStack.length - 1].id);
  };

  const handleUpgrade = async () => {
    try {
      window.showToast('Initializing secure checkout...', 'info');

      const auditorId = localStorage.getItem('auditor_id') || member.auditor_id;
      if (!auditorId) throw new Error('Auditor profile ID missing');

      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          auditor_id: auditorId,
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
        name: 'Arukin Security',
        description: 'Yearly Premium Security Audit Console',
        prefill: {
          email: localStorage.getItem('auditor_email') || '',
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

  // ── Preview ───────────────────────────────────────────────────────────────────
  const openViewer = async (file) => {
    if (!isPro) {
      showConfirm({
        icon: <Shield size={18} className="text-indigo-500 animate-pulse" />,
        title: 'Upgrade to PRO?',
        message: `Previewing file details is restricted under the free trial plan to mitigate data extraction risks. Upgrade to PRO to unlock full file access.`,
        confirmLabel: 'Upgrade Now', danger: false,
        onConfirm: () => { hideConfirm(); handleUpgrade(); }
      });
      return;
    }
    const isGoogle = file.mimeType?.startsWith('application/vnd.google-apps.');
    const isText = file.mimeType?.startsWith('text/') || ['json','csv','xml'].some(t => file.mimeType?.includes(t));
    const needsBlob = file.mimeType?.startsWith('image/') || file.mimeType?.includes('pdf');
    setViewer({ open: true, file, blobUrl: null, textContent: null, previewUrl: null, loading: true });
    try {
      if (isGoogle) {
        setViewer(v => ({ ...v, previewUrl: `https://drive.google.com/file/d/${file.id}/preview`, loading: false }));
      } else if (isText) {
        const res = await fetchWithAuth(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`);
        const textContent = await res.text();
        setViewer(v => ({ ...v, textContent, loading: false }));
      } else if (needsBlob) {
        const res = await fetchWithAuth(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        setViewer(v => ({ ...v, blobUrl, loading: false }));
      } else {
        setViewer(v => ({ ...v, loading: false }));
      }
    } catch (e) { console.error('Preview error:', e); setViewer(v => ({ ...v, loading: false })); }
  };

  // ── Download ──────────────────────────────────────────────────────────────────
  const handleDownload = (file, e) => {
    if (e) e.stopPropagation();
    if (!isPro) {
      showConfirm({
        icon: <Shield size={18} className="text-indigo-500 animate-pulse" />,
        title: 'Upgrade to PRO?',
        message: `Direct exporting and downloading is restricted under the free trial plan to mitigate data extraction risks. Upgrade to PRO to unlock downloading.`,
        confirmLabel: 'Upgrade Now', danger: false,
        onConfirm: () => { hideConfirm(); handleUpgrade(); }
      });
      return;
    }
    showConfirm({
      icon: <Download size={18} className="text-blue-500" />,
      title: 'Download file?',
      message: `"${file.name}" will be downloaded to your device.`,
      confirmLabel: 'Download', danger: false,
      onConfirm: () => { hideConfirm(); executeDownload(file); }
    });
  };

  const executeDownload = async (file) => {
    try {
      window.showToast(`Starting download for "${file.name}"...`, 'info');

      const isGws = file.mimeType?.startsWith('application/vnd.google-apps.');
      
      if (isGws) {
        // Workspace files lack CORS on export endpoint. Use synchronous popup with URL token.
        const url = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=application/pdf&access_token=${member.access_token}`;
        const win = window.open(url, '_blank');
        if (!win) {
          // Fallback if strict popup blocker
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        window.showToast(`"${file.name}" opened for export.`, 'success');
      } else {
        // Normal files support CORS. Fetch blob to force true download (preventing inline iframe rendering)
        const url = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
        const response = await fetchWithAuth(url);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Download failed:', err);
      window.showToast('Download failed. Ensure the connection is valid.', 'error');
    }
  };



  // ── Derived data ──────────────────────────────────────────────────────────────
  const folders = files.filter(f => f.mimeType === 'application/vnd.google-apps.folder');
  const regularFiles = files.filter(f => f.mimeType !== 'application/vnd.google-apps.folder');
  const storageUsed = storageQuota ? parseInt(storageQuota.usage || 0) : 0;
  const storageLimit = storageQuota ? parseInt(storageQuota.limit || 1) : 1;
  const storagePercent = Math.min(100, Math.round((storageUsed / storageLimit) * 100));

  const navItems = [
    { id: 'my-drive', label: 'My Drive', icon: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 14H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V6h12v2z"/></svg> },
    { id: 'shared', label: 'Shared with me', icon: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
    { id: 'images', label: 'Images', icon: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg> },
    { id: 'videos', label: 'Videos', icon: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg> },
  ];

  return (
    <>
      <ConfirmModal {...confirm} onCancel={hideConfirm} />
      <FileViewerModal viewer={viewer} onClose={closeViewer} onDownload={() => { closeViewer(); handleDownload(viewer.file); }} />

      {/* Root container — matches GmailUI structure but styled like modern GDrive */}
      <div className="h-full bg-[#f8f9fa] text-slate-800 flex flex-col font-sans relative overflow-hidden rounded-lg shadow-2xl border border-slate-200">

        {/* ── Header ── */}
        <div className="h-14 border-b border-slate-200/80 flex items-center px-5 justify-between bg-[#f8f9fa] shrink-0">
          <div className="flex items-center gap-2.5">
            <DriveIcon size={22} />
            <span className="text-base font-medium text-slate-700">Drive</span>
          </div>
          <button
            onClick={() => fetchDriveFiles(folderStack[folderStack.length - 1].id)}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* ── Body: sidebar + content ── */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* Sidebar */}
          <div className="w-full md:w-52 border-b md:border-b-0 border-slate-200 bg-[#f8f9fa] flex flex-col shrink-0 overflow-y-auto max-h-40 md:max-h-none">
            <nav className="py-2 px-1.5 space-y-0.5">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => switchView(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm transition-colors text-left ${
                    currentView === id
                      ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                      : 'text-slate-600 hover:bg-[#eaeef3] font-normal'
                  }`}
                >
                  <span className={currentView === id ? 'text-[#001d35]' : 'text-slate-500'}>
                    <Icon />
                  </span>
                  {label}
                </button>
              ))}
            </nav>

            {/* Promo banner for Free tier */}
            {!isPro && (
              <div className="mx-2 mt-2 p-3.5 bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl text-left space-y-2.5 shadow-sm shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-extrabold text-white bg-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-wider">PRO Feature Locked</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-800">Direct downloading is not available on the free plan</h5>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Upgrade to PRO to download and preview files.
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

            {/* Storage section */}
            <div className="mt-6 mx-2 px-3 py-4 rounded-2xl border border-slate-200/80 bg-white">
              <p className="text-[11px] font-semibold text-slate-500 mb-2.5 uppercase tracking-wide">Storage</p>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${storagePercent > 85 ? 'bg-red-500' : storagePercent > 60 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
              {storageQuota ? (
                <p className="text-[11px] text-slate-500 leading-snug">
                  {formatStorageBytes(storageQuota.usage)} of {formatStorageBytes(storageQuota.limit)} used
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">Loading…</p>
              )}
            </div>
          </div>

          {/* Main content - Wrapped in modern rounded canvas */}
          <div className="flex-1 flex flex-col overflow-hidden p-3 pl-0 bg-[#f8f9fa]">
            <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">

              {/* Breadcrumb */}
              <div className="flex items-center gap-1 px-5 py-3 border-b border-slate-100 shrink-0 bg-white">
                {folderStack.map((crumb, i) => (
                  <React.Fragment key={crumb.id}>
                    {i > 0 && <ChevronRight size={13} className="text-slate-400 mx-0.5 shrink-0" />}
                    <button
                      onClick={() => i < folderStack.length - 1 ? navigateTo(i) : undefined}
                      className={`text-sm px-2 py-0.5 rounded-lg transition-colors max-w-[180px] truncate ${
                        i === folderStack.length - 1
                          ? 'text-slate-800 font-semibold cursor-default bg-slate-100'
                          : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
                      }`}
                    >
                      {crumb.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* File grid/list */}
              <div className="flex-1 overflow-y-auto bg-white">
                {loading ? (
                  <div className="flex items-center justify-center h-full gap-3 text-slate-400">
                    <RefreshCw size={20} className="animate-spin" />
                    <span className="text-sm">Loading files…</span>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                    <p className="text-sm text-red-400">{error}</p>
                    <button onClick={() => fetchDriveFiles(folderStack[folderStack.length - 1].id)} className="text-xs text-blue-500 hover:underline">Try again</button>
                  </div>
                ) : files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-300">
                    <FolderIcon size={64} />
                    <p className="text-sm text-slate-400">This folder is empty.</p>
                  </div>
                ) : (
                  <div className="p-5 space-y-6">

                    {/* Folders grid */}
                    {folders.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Folders</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                          {folders.map(folder => (
                            <div
                              key={folder.id}
                              className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#f0f4f9] hover:bg-[#e1e9f5] cursor-pointer transition-all border border-transparent hover:shadow-sm"
                              onClick={() => openFolder(folder)}
                            >
                              <FolderIcon size={24} />
                              <span className="text-sm text-slate-700 font-medium truncate flex-1">{folder.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Files list */}
                    {regularFiles.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Files</p>
                        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                          {/* Table header */}
                          <div className="grid bg-slate-50/80 border-b border-slate-100 px-4 py-2.5" style={{ gridTemplateColumns: '40px 1fr 150px 120px' }}>
                            <div />
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Name</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Last Modified</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">File Size</p>
                          </div>
                          {regularFiles.map((file, idx) => (
                            <div
                              key={file.id}
                              className={`group grid items-center px-4 py-3 hover:bg-[#f0f4f9]/50 transition-colors cursor-pointer ${idx < regularFiles.length - 1 ? 'border-b border-slate-100' : ''}`}
                              style={{ gridTemplateColumns: '40px 1fr 150px 120px' }}
                              onClick={() => isPreviewable(file.mimeType) ? openViewer(file) : handleDownload(file)}
                            >
                              <FileIcon mimeType={file.mimeType} size={18} />

                              <div className="min-w-0 pr-4">
                                <p className="text-sm text-slate-700 truncate group-hover:text-blue-700 font-medium transition-colors">{file.name}</p>
                              </div>

                              <p className="text-xs text-slate-400">{formatDate(file.modifiedTime)}</p>

                              {/* Size and Action triggers */}
                              <div className="flex items-center justify-between min-w-0">
                                <p className="text-xs text-slate-400 group-hover:hidden transition-all">{formatSize(file.size)}</p>
                                
                                {/* Row actions on Hover */}
                                <div className="hidden group-hover:flex items-center gap-1 transition-all" onClick={e => e.stopPropagation()}>
                                  {isPreviewable(file.mimeType) && (
                                    <button onClick={() => openViewer(file)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 hover:text-blue-600 transition-colors" title="Preview">
                                      <Eye size={13} />
                                    </button>
                                  )}
                                  <button onClick={(e) => handleDownload(file, e)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 hover:text-blue-600 transition-colors" title="Download">
                                    <Download size={13} />
                                  </button>
                                </div>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}