import React, { useState, useEffect, useRef } from 'react';
import { Mail, Inbox, Send, File, Archive, Trash2, Search, MoreVertical, RefreshCw, ChevronLeft, ChevronRight, ArrowLeft, X, Users, Camera, Globe } from 'lucide-react';
import { supabase } from '../supabaseClient';
import DOMPurify from 'dompurify';

export default function GmailUI({ member }) {
  const isPro = (localStorage.getItem('auditor_tier') || 'FREE') === 'PRO';
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Data State
  const [messageIds, setMessageIds] = useState([]); 
  const [emailDetails, setEmailDetails] = useState({}); 
  const [currentPage, setCurrentPage] = useState(0);
  const [listNextPageToken, setListNextPageToken] = useState(null);
  
  // Viewer state
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailBody, setEmailBody] = useState("");
  const [loadingBody, setLoadingBody] = useState(false);

  // Labels State
  const [activeLabel, setActiveLabel] = useState('INBOX');

  // Compose State
  const [isComposing, setIsComposing] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Checkbox Selections & Action Menu States
  const [selectedEmailIds, setSelectedEmailIds] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const PAGE_SIZE = 20;
  const FETCH_SIZE = 80;

  const messageIdsRef = useRef(messageIds);
  const emailDetailsRef = useRef(emailDetails);
  
  useEffect(() => {
    messageIdsRef.current = messageIds;
    emailDetailsRef.current = emailDetails;
  }, [messageIds, emailDetails]);

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

  const fetchWithAuth = async (url, options = {}) => {
    let res = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${member.access_token}` }
    });

    if (res.status === 401 || res.status === 403) {
      console.log("Token appears expired (401). Invoking Edge Function to refresh silently...");
      try {
        const { data, err } = await supabase.functions.invoke('refresh-google-token', {
          body: { member_id: member.id }
        });
        
        if (err) throw err;
        
        if (data?.access_token) {
          member.access_token = data.access_token;
          res = await fetch(url, {
            ...options,
            headers: { ...options.headers, Authorization: `Bearer ${member.access_token}` }
          });
        }
      } catch (err) {
        console.error("Silent token refresh failed:", err);
      }
    }
    return res;
  };

  const fetchMessageIds = async (token = null) => {
    const isLabelRestricted = ['FACEBOOK', 'INSTAGRAM', 'GOOGLE'].includes(activeLabel);
    if (isLabelRestricted && !isPro) {
      return [];
    }
    let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${FETCH_SIZE}`;
    
    // Determine base query for special social tabs
    let baseQuery = "";
    if (activeLabel === 'FACEBOOK') baseQuery = "from:facebookmail.com OR from:facebook.com";
    else if (activeLabel === 'INSTAGRAM') baseQuery = "from:instagram.com OR from:mail.instagram.com";
    else if (activeLabel === 'GOOGLE') baseQuery = "from:google.com";

    // Combine base query with user search query
    let finalQuery = [];
    if (baseQuery) finalQuery.push(`(${baseQuery})`);
    
    // Exclude high-value targets from the main Inbox to keep it clean and isolated
    if (activeLabel === 'INBOX') {
      finalQuery.push("-from:facebookmail.com -from:facebook.com -from:instagram.com -from:mail.instagram.com -from:google.com");
    }
    
    if (debouncedSearchQuery) finalQuery.push(debouncedSearchQuery);

    if (finalQuery.length > 0) {
      url += `&q=${encodeURIComponent(finalQuery.join(' '))}`;
    }
    
    // Standard folders use the labelIds parameter
    if (['INBOX', 'SENT', 'SPAM', 'TRASH'].includes(activeLabel)) {
      url += `&labelIds=${activeLabel}`;
    }

    if (token) url += `&pageToken=${token}`;

    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error('Failed to fetch messages. Both access and refresh tokens might be invalid.');
    
    const data = await res.json();
    setListNextPageToken(data.nextPageToken || null);
    
    if (data.messages) {
      const newIds = data.messages.map(m => m.id);
      setMessageIds(prev => [...prev, ...newIds]);
      return newIds;
    }
    return [];
  };

  const fetchDetailsForIds = async (idsToFetch) => {
    const promises = idsToFetch.map(async (id) => {
      const res = await fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date&metadataHeaders=To`);
      const detailData = await res.json();
      
      const getHeader = (name) => detailData.payload?.headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || 'Unknown';
      
      const dateStr = getHeader('Date');
      const dateObj = new Date(dateStr);
      const timeFormatted = isNaN(dateObj.getTime()) ? 'Unknown' : dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const fullDateFormatted = isNaN(dateObj.getTime()) ? 'Unknown' : dateObj.toLocaleString();

      let sender = getHeader('From');
      let senderName = sender;
      let senderEmail = sender;
      if (sender.includes('<')) {
        const parts = sender.split('<');
        senderName = parts[0].replace(/"/g, '').trim();
        senderEmail = '<' + parts[1];
      }

      return {
        id,
        senderName,
        senderEmail,
        to: getHeader('To'),
        subject: getHeader('Subject'),
        snippet: detailData.snippet,
        time: timeFormatted,
        fullDate: fullDateFormatted,
        unread: detailData.labelIds?.includes('UNREAD') || false,
        alert: getHeader('Subject').toLowerCase().includes('security')
      };
    });

    const results = await Promise.all(promises);
    const newDetailsMap = {};
    results.forEach(item => { newDetailsMap[item.id] = item; });
    
    setEmailDetails(prev => ({ ...prev, ...newDetailsMap }));
  };

  const ensurePageLoaded = async (pageIdx, tokenOverride = null) => {
    const startIndex = pageIdx * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    let currentIds = messageIdsRef.current;
    if (startIndex >= currentIds.length) {
      if (listNextPageToken || tokenOverride === 'initial') {
        const fetchedIds = await fetchMessageIds(tokenOverride === 'initial' ? null : listNextPageToken);
        currentIds = [...currentIds, ...fetchedIds];
      } else {
        return; 
      }
    }

    const pageIds = currentIds.slice(startIndex, endIndex);
    const missingIds = pageIds.filter(id => !emailDetailsRef.current[id]);

    if (missingIds.length > 0) {
      await fetchDetailsForIds(missingIds);
    }
  };

  const preloadNextPage = async (nextPageIdx) => {
    try {
      await ensurePageLoaded(nextPageIdx);
    } catch (err) {
      console.warn("Silent preload failed", err);
    }
  };

  const isSandbox = false;

  const logAuditAction = async (actionType, resourceId, extraMetadata = {}) => {
    try {
      const performerId = localStorage.getItem('auditor_id');
      if (!performerId || !member?.id) return;

      await supabase.from('audit_logs').insert({
        auditor_id: performerId, // Linked relationship field
        performer_id: performerId, // Track who did it
        member_id: member.id, // Target client
        action_type: actionType,
        resource_id: resourceId,
        metadata: {
          ...extraMetadata,
          client_email: member.email,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.warn("Failed to write compliance audit log:", err);
    }
  };

  const handleEmailClick = async (email) => {
    setSelectedEmail(email);
    setLoadingBody(true);
    setEmailBody("");

    try {
      const res = await fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${email.id}?format=full`);
      const data = await res.json();
      const extractedBody = extractBody(data.payload);
      setEmailBody(extractedBody);
      
      // Compliance logging
      logAuditAction('VIEW_EMAIL', email.id, { subject: email.subject });

      // If it's unread, automatically mark it as read when opened
      if (email.unread) {
        handleMarkAsRead(email.id);
      }
    } catch (err) {
      console.error(err);
      setEmailBody("<p>Error loading email body.</p>");
    } finally {
      setLoadingBody(false);
    }
  };

  const removeEmailFromUI = (id) => {
    setMessageIds(prev => prev.filter(mid => mid !== id));
    setEmailDetails(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
  };

  const executeTrash = async (id) => {
    try {
      const res = await fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addLabelIds: ['TRASH'],
          removeLabelIds: ['INBOX']
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API returned status ${res.status}: ${errorText}`);
      }

      // Compliance logging
      logAuditAction('TRASH_EMAIL', id);
      
      removeEmailFromUI(id);
    } catch (err) {
      console.error("Failed to trash email:", err);
      window.showToast("Failed to move email to trash. Check console for details.", "error");
    }
  };

  const executeArchive = async (id) => {
    try {
      const res = await fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removeLabelIds: ['INBOX'] })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API returned status ${res.status}: ${errorText}`);
      }

      // Compliance logging
      logAuditAction('ARCHIVE_EMAIL', id);

      removeEmailFromUI(id);
    } catch (err) {
      console.error("Failed to archive email:", err);
      window.showToast("Failed to archive email. Check console for details.", "error");
    }
  };

  const handleTrash = (id, e) => {
    if (e) e.stopPropagation();
    if (!isPro) {
      window.showToast("Pro Feature Required: Upgrade to modify or delete emails.", "error");
      return;
    }
    executeTrash(id);
  };

  const handleArchive = (id, e) => {
    if (e) e.stopPropagation();
    if (!isPro) {
      window.showToast("Pro Feature Required: Upgrade to modify or archive emails.", "error");
      return;
    }
    executeArchive(id);
  };

  useEffect(() => {
    if (!member?.access_token) {
      setError("No Google access token found for this member.");
      setLoading(false);
      return;
    }

    const init = async () => {
      setLoading(true);
      setError(null);
      
      // Reset state when label changes
      setMessageIds([]);
      setEmailDetails({});
      setCurrentPage(0);
      setListNextPageToken(null);
      messageIdsRef.current = [];
      emailDetailsRef.current = {};

      try {
        await ensurePageLoaded(0, 'initial');
        preloadNextPage(1); 
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [member, activeLabel, debouncedSearchQuery]);

  const handleNextPage = async () => {
    const nextPage = currentPage + 1;
    const hasMoreItems = (nextPage * PAGE_SIZE) < messageIds.length || listNextPageToken;
    if (!hasMoreItems) return;
    setLoading(true);
    try {
      await ensurePageLoaded(nextPage);
      setCurrentPage(nextPage);
      preloadNextPage(nextPage + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = async () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setLoading(true);
      try {
        await ensurePageLoaded(prevPage);
        setCurrentPage(prevPage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const decodeBase64Url = (base64UrlData) => {
    try {
      const base64 = base64UrlData.replace(/-/g, '+').replace(/_/g, '/');
      return decodeURIComponent(escape(window.atob(base64)));
    } catch (e) {
      return "Error decoding email content.";
    }
  };

  const extractBody = (payload) => {
    let body = "";
    if (payload.parts) {
      let htmlPart = payload.parts.find(part => part.mimeType === 'text/html');
      let textPart = payload.parts.find(part => part.mimeType === 'text/plain');
      if (htmlPart && htmlPart.body.data) {
        body = decodeBase64Url(htmlPart.body.data);
      } else if (textPart && textPart.body.data) {
        body = `<pre style="font-family: inherit; white-space: pre-wrap;">${decodeBase64Url(textPart.body.data)}</pre>`;
      } else {
        for (let part of payload.parts) {
          if (part.parts) {
            let extracted = extractBody(part);
            if (extracted) {
              body = extracted;
              break;
            }
          }
        }
      }
    } else if (payload.body && payload.body.data) {
      body = decodeBase64Url(payload.body.data);
      if (payload.mimeType === 'text/plain') {
        body = `<pre style="font-family: inherit; white-space: pre-wrap;">${body}</pre>`;
      }
    }
    return body || "<p>No readable content found in this email.</p>";
  };

  const handleMarkAsRead = async (id) => {
    if (isSandbox) return;
    try {
      await fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removeLabelIds: ['UNREAD'] })
      });
      setEmailDetails(prev => ({
        ...prev,
        [id]: { ...prev[id], unread: false }
      }));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleSendEmail = async () => {
    if (!composeTo || !composeSubject) {
      window.showToast("Please specify a recipient and subject.", "warning");
      return;
    }
    setIsSending(true);

    try {
      // Create RFC 2822 formatted email
      const rawEmail = [
        `To: ${composeTo}`,
        `Subject: ${composeSubject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/plain; charset="UTF-8"`,
        ``,
        composeBody
      ].join('\r\n');

      // Base64URL encode the string
      const encodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: encodedEmail })
      });

      if (!res.ok) throw new Error("Failed to send email");
      
      setIsComposing(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      window.showToast("Email sent successfully!", "success");
    } catch (err) {
      console.error(err);
      window.showToast("Failed to send email. Ensure you have proper permissions.", "error");
    } finally {
      setIsSending(false);
    }
  };

  // ── Selection & Menu Handlers ───────────────────────────────────────────────
  const handleToggleSelect = (id) => {
    setSelectedEmailIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (renderedEmails) => {
    const renderedIds = renderedEmails.map(e => e.id);
    const allSelectedOnPage = renderedIds.every(id => selectedEmailIds.includes(id));

    if (allSelectedOnPage) {
      // Deselect all on current page
      setSelectedEmailIds(prev => prev.filter(id => !renderedIds.includes(id)));
    } else {
      // Select all on current page
      setSelectedEmailIds(prev => {
        const uniqueNew = renderedIds.filter(id => !prev.includes(id));
        return [...prev, ...uniqueNew];
      });
    }
  };

  const handleBulkArchive = async () => {
    if (selectedEmailIds.length === 0) return;
    if (isSandbox) {
      selectedEmailIds.forEach(id => removeEmailFromUI(id));
      setSelectedEmailIds([]);
      window.showToast("Archive action completed! (Simulation Mode)", "info");
      return;
    }
    try {
      setLoading(true);
      await Promise.all(
        selectedEmailIds.map(id => 
          fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ removeLabelIds: ['INBOX'] })
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to archive message ${id}`);
          })
        )
      );
      
      const count = selectedEmailIds.length;
      selectedEmailIds.forEach(id => removeEmailFromUI(id));
      setSelectedEmailIds([]);
      window.showToast(`${count} emails archived successfully.`, "success");
    } catch (err) {
      window.showToast("Failed to archive: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmailIds.length === 0) return;
    if (isSandbox) {
      selectedEmailIds.forEach(id => removeEmailFromUI(id));
      setSelectedEmailIds([]);
      window.showToast("Delete action completed! (Simulation Mode)", "info");
      return;
    }
    try {
      setLoading(true);
      await Promise.all(
        selectedEmailIds.map(id => 
          fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              addLabelIds: ['TRASH'],
              removeLabelIds: ['INBOX']
            })
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to trash message ${id}`);
          })
        )
      );
      
      const count = selectedEmailIds.length;
      selectedEmailIds.forEach(id => removeEmailFromUI(id));
      setSelectedEmailIds([]);
      window.showToast(`${count} emails moved to trash.`, "success");
    } catch (err) {
      window.showToast("Failed to delete: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkMarkRead = async (unreadValue = false) => {
    if (selectedEmailIds.length === 0) return;
    if (isSandbox) {
      setEmailDetails(prev => {
        const copy = { ...prev };
        selectedEmailIds.forEach(id => {
          if (copy[id]) copy[id].unread = unreadValue;
        });
        return copy;
      });
      setSelectedEmailIds([]);
      window.showToast("Updated read status! (Simulation Mode)", "info");
      return;
    }
    try {
      setLoading(true);
      const actionBody = unreadValue 
        ? { addLabelIds: ['UNREAD'] }
        : { removeLabelIds: ['UNREAD'] };

      await Promise.all(
        selectedEmailIds.map(id => 
          fetchWithAuth(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actionBody)
          }).then(res => {
            if (!res.ok) throw new Error(`Failed to modify status for message ${id}`);
          })
        )
      );

      // Locally sync state
      setEmailDetails(prev => {
        const copy = { ...prev };
        selectedEmailIds.forEach(id => {
          if (copy[id]) {
            copy[id].unread = unreadValue;
          }
        });
        return copy;
      });

      const count = selectedEmailIds.length;
      setSelectedEmailIds([]);
      window.showToast(`Updated read status for ${count} emails.`, "success");
    } catch (err) {
      window.showToast("Failed to update status: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const currentRenderIds = messageIds.slice(currentPage * PAGE_SIZE, (currentPage * PAGE_SIZE) + PAGE_SIZE);
  const currentRenderEmails = currentRenderIds.map(id => emailDetails[id]).filter(Boolean);

  return (
    <div className="h-full bg-white text-slate-800 flex flex-col font-sans relative overflow-hidden rounded-lg shadow-2xl border border-slate-200">
      
      {/* Top Header */}
      <div className="h-16 border-b border-slate-200 flex items-center px-4 justify-between bg-slate-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-medium text-lg">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="url(#gmail_grad_a)" d="M146 44h38v110c0 6.627-5.373 12-12 12h-20a6 6 0 0 1-6-6z"/>
              <path fill="#fc413d" d="M46 44H8v110c0 6.627 5.373 12 12 12h20a6 6 0 0 0 6-6z"/>
              <path fill="url(#gmail_grad_b)" d="M39.226 30.456c-8.033-6.752-20.018-5.714-26.77 2.319-6.752 8.032-5.714 20.017 2.319 26.77l76.078 63.949a8 8 0 0 0 10.295 0l76.078-63.95c8.032-6.752 9.07-18.737 2.318-26.77-6.752-8.032-18.737-9.07-26.769-2.318L96 78.18z"/>
              <defs>
                <linearGradient id="gmail_grad_a" x1="165" x2="165" y1="44" y2="166" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60d673"/>
                  <stop offset=".17" stopColor="#42c868"/>
                  <stop offset=".39" stopColor="#0ebc5f"/>
                  <stop offset=".62" stopColor="#00a9bb"/>
                  <stop offset=".86" stopColor="#3c90ff"/>
                  <stop offset="1" stopColor="#3186ff"/>
                </linearGradient>
                <linearGradient id="gmail_grad_b" x1="8" x2="184" y1="46.13" y2="46.13" gradientUnits="userSpaceOnUse">
                  <stop offset=".08" stopColor="#ff63a0"/>
                  <stop offset=".3" stopColor="#fc413d"/>
                  <stop offset=".5" stopColor="#fc413d"/>
                  <stop offset=".65" stopColor="#fc413d"/>
                  <stop offset=".72" stopColor="#fc5c30"/>
                  <stop offset=".86" stopColor="#feb10c"/>
                  <stop offset=".91" stopColor="#fec700"/>
                  <stop offset=".96" stopColor="#ffdb0f"/>
                </linearGradient>
              </defs>
            </svg>
            Gmail
          </div>
          {!selectedEmail && (
            <div className="relative ml-8">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search mail"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-96 bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white transition-all shadow-inner"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col py-4 shrink-0">
          <button 
            onClick={() => { if (!isPro) { window.showToast('PRO Feature: Upgrade to compose and send emails.', 'error'); } else { setIsComposing(true); } }}
            className="mx-4 mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md transition-all rounded-2xl py-4 px-6 flex items-center justify-center gap-2 font-medium"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
            Compose
          </button>

          <nav className="flex-1 px-2 space-y-0.5">
            <button 
              onClick={() => { setActiveLabel('INBOX'); setSelectedEmail(null); }}
              className={`w-full flex items-center gap-4 px-4 py-2 rounded-r-full font-medium text-sm transition-colors ${
                activeLabel === 'INBOX' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Inbox size={18} /> Inbox
            </button>
            <button 
              onClick={() => { setActiveLabel('SENT'); setSelectedEmail(null); }}
              className={`w-full flex items-center gap-4 px-4 py-2 rounded-r-full font-medium text-sm transition-colors ${
                activeLabel === 'SENT' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Send size={18} /> Sent
            </button>
            <button 
              onClick={() => { setActiveLabel('SPAM'); setSelectedEmail(null); }}
              className={`w-full flex items-center gap-4 px-4 py-2 rounded-r-full font-medium text-sm transition-colors ${
                activeLabel === 'SPAM' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Archive size={18} /> Spam
            </button>
            <button 
              onClick={() => { setActiveLabel('TRASH'); setSelectedEmail(null); }}
              className={`w-full flex items-center gap-4 px-4 py-2 rounded-r-full font-medium text-sm transition-colors ${
                activeLabel === 'TRASH' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Trash2 size={18} /> Trash
            </button>

            {/* High Value Targets */}
            <div className="pt-6 pb-2 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Socials
            </div>
            <button 
              onClick={() => { setActiveLabel('FACEBOOK'); setSelectedEmail(null); }}
              className={`w-full flex items-center justify-between pr-4 py-2 rounded-r-full font-medium text-sm transition-colors ${
                activeLabel === 'FACEBOOK' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-4 pl-4">
                <Users size={18} /> Facebook
              </span>
              {!isPro && !isSandbox && <span className="text-[10px] bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded font-bold border border-purple-500/20 uppercase tracking-wide">Pro</span>}
            </button>
            <button 
              onClick={() => { setActiveLabel('INSTAGRAM'); setSelectedEmail(null); }}
              className={`w-full flex items-center justify-between pr-4 py-2 rounded-r-full font-medium text-sm transition-colors ${
                activeLabel === 'INSTAGRAM' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-4 pl-4">
                <Camera size={18} /> Instagram
              </span>
              {!isPro && !isSandbox && <span className="text-[10px] bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded font-bold border border-purple-500/20 uppercase tracking-wide">Pro</span>}
            </button>
            <button 
              onClick={() => { setActiveLabel('GOOGLE'); setSelectedEmail(null); }}
              className={`w-full flex items-center justify-between pr-4 py-2 rounded-r-full font-medium text-sm transition-colors ${
                activeLabel === 'GOOGLE' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-4 pl-4">
                <Globe size={18} /> Google
              </span>
              {!isPro && !isSandbox && <span className="text-[10px] bg-purple-500/10 text-purple-600 px-1.5 py-0.5 rounded font-bold border border-purple-500/20 uppercase tracking-wide">Pro</span>}
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          
          {['FACEBOOK', 'INSTAGRAM', 'GOOGLE'].includes(activeLabel) && !isPro ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 text-slate-600 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4 border border-purple-200 shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Social Feed Monitor is Locked</h2>
              <p className="text-sm max-w-sm mb-6 text-slate-500">
                Automated auditing of Facebook, Instagram, and Google labels is only available to PRO auditors. 
              </p>
              <div className="bg-white border border-slate-200 rounded-xl p-4 w-80 text-left mb-6 shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">PRO TIER UPGRADE INCLUDES:</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                  <li>Scan linked Facebook & Instagram emails</li>
                  <li>Perform security actions (Delete, Reply, Send)</li>
                  <li>Deep search and drive file previewing</li>
                  <li>No limit on member storage or accounts</li>
                </ul>
              </div>
              <button onClick={handleUpgrade} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20">
                Upgrade to PRO Auditor
              </button>
            </div>
          ) : selectedEmail ? (
            /* EMAIL VIEWER */
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="h-14 border-b border-slate-200 flex items-center px-4 gap-4 bg-white shrink-0">
                <button 
                  onClick={() => setSelectedEmail(null)} 
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                  title="Back to inbox"
                >
                  <ArrowLeft size={18} />
                </button>
                <button 
                  onClick={() => handleArchive(selectedEmail.id)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                  title="Archive"
                >
                  <Archive size={18} />
                </button>
                <button 
                  onClick={() => handleTrash(selectedEmail.id)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
                <MoreVertical size={18} className="text-slate-600 ml-2 cursor-pointer hover:bg-slate-100 rounded-full p-1" />
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <h1 className="text-2xl font-normal text-slate-900 mb-6 flex items-center gap-3">
                  {selectedEmail.subject}
                  {selectedEmail.alert && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md font-medium uppercase tracking-wide border border-red-200">Alert</span>}
                </h1>
                
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium shadow-sm shrink-0">
                      {selectedEmail.senderName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-bold text-slate-900">{selectedEmail.senderName}</span>
                        <span className="text-slate-500 ml-2 text-xs">{selectedEmail.senderEmail}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        to {selectedEmail.to}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                    {selectedEmail.fullDate}
                  </div>
                </div>

                <div className="prose prose-sm max-w-none prose-a:text-blue-600">
                  {loadingBody ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <RefreshCw size={16} className="animate-spin" /> Loading content...
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(emailBody, { USE_PROFILES: { html: true } }) }} />
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* EMAIL LIST */
            <>
              {/* Promo banner for Free tier */}
              {!isPro && (
                <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-indigo-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-extrabold text-white bg-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-wider">PRO Feature Locked</span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-800">Replying and deleting emails is not available on the free plan</h5>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Upgrade to PRO to unlock outbound audits and label feed controls.
                    </p>
                  </div>
                  <button 
                    onClick={handleUpgrade}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10 shrink-0 cursor-pointer"
                  >
                    Upgrade to PRO
                  </button>
                </div>
              )}

              <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 gap-4 text-slate-500 bg-white shrink-0">
                <div className="flex items-center gap-4 relative">
                  <input 
                    type="checkbox" 
                    checked={currentRenderEmails.length > 0 && currentRenderEmails.every(e => selectedEmailIds.includes(e.id))}
                    onChange={() => handleToggleSelectAll(currentRenderEmails)}
                    className="rounded text-blue-500 focus:ring-blue-500 cursor-pointer" 
                  />
                  <button onClick={() => { setMessageIds([]); setEmailDetails({}); setCurrentPage(0); ensurePageLoaded(0, 'initial'); preloadNextPage(1); }} className="hover:text-slate-800 transition-colors">
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowActionMenu(!showActionMenu)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors cursor-pointer"
                      title="Bulk Actions"
                    >
                      <MoreVertical size={16} className="hover:text-slate-800" />
                    </button>
                    {showActionMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(false)} />
                        <div className="absolute left-0 mt-1 top-full w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-left text-xs font-semibold">
                          <button 
                            onClick={() => { handleBulkMarkRead(false); setShowActionMenu(false); }}
                            disabled={selectedEmailIds.length === 0}
                            className="w-full px-4 py-2 hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors block text-left"
                          >
                            Mark as read ({selectedEmailIds.length})
                          </button>
                          <button 
                            onClick={() => { handleBulkMarkRead(true); setShowActionMenu(false); }}
                            disabled={selectedEmailIds.length === 0}
                            className="w-full px-4 py-2 hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors block text-left"
                          >
                            Mark as unread ({selectedEmailIds.length})
                          </button>
                          <button 
                            onClick={() => { handleBulkArchive(); setShowActionMenu(false); }}
                            disabled={selectedEmailIds.length === 0}
                            className="w-full px-4 py-2 hover:bg-slate-100 text-slate-700 disabled:opacity-40 transition-colors block text-left"
                          >
                            Archive selected ({selectedEmailIds.length})
                          </button>
                          <button 
                            onClick={() => { handleBulkDelete(); setShowActionMenu(false); }}
                            disabled={selectedEmailIds.length === 0}
                            className="w-full px-4 py-2 hover:bg-slate-100 text-red-600 disabled:opacity-40 transition-colors block text-left border-t border-slate-100"
                          >
                            Delete selected ({selectedEmailIds.length})
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs font-medium">
                  <span className="text-slate-400">
                    {messageIds.length > 0 ? `${currentPage * PAGE_SIZE + 1}-${Math.min((currentPage + 1) * PAGE_SIZE, messageIds.length)}` : ''}
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={handlePrevPage} 
                      disabled={currentPage === 0 || loading}
                      className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={handleNextPage} 
                      disabled={((currentPage + 1) * PAGE_SIZE >= messageIds.length && !listNextPageToken) || loading}
                      className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {error ? (
                  <div className="p-8 text-center text-red-500">
                    <p className="font-medium mb-2">Failed to load real data.</p>
                    <p className="text-sm opacity-80">{error}</p>
                  </div>
                ) : loading && currentRenderEmails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <RefreshCw size={24} className="animate-spin mb-2 opacity-50" />
                    <p>Syncing Gmail...</p>
                  </div>
                ) : currentRenderEmails.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No emails found.</div>
                ) : (
                  currentRenderEmails.map((email) => (
                    <div 
                      key={email.id} 
                      onClick={() => handleEmailClick(email)}
                      className={`flex items-center px-4 py-2.5 border-b border-slate-100 hover:shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] cursor-pointer group transition-shadow ${
                        email.unread ? 'bg-white font-bold text-slate-900' : 'bg-slate-50/50 font-medium text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-64 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedEmailIds.includes(email.id)}
                          onChange={() => handleToggleSelect(email.id)}
                          className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" 
                        />
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`opacity-20 group-hover:opacity-100 transition-opacity ${email.alert ? 'text-yellow-400 opacity-100 fill-current' : 'text-slate-400'}`}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span className={`truncate ${email.alert ? 'text-red-600' : ''}`}>{email.senderName}</span>
                      </div>
                      
                      <div className="flex-1 truncate mr-4">
                        <span className={`${email.unread ? 'text-slate-900' : 'text-slate-700'}`}>{email.subject}</span>
                        <span className="text-slate-500 font-normal mx-2">-</span>
                        <span className="text-slate-500 font-normal truncate inline-block align-bottom max-w-sm">{email.snippet}</span>
                      </div>
                      
                      <div className={`w-20 text-right text-xs flex items-center justify-end gap-2 shrink-0 ${email.unread ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'}`}>
                        {/* Hover Actions */}
                        <div className="hidden group-hover:flex items-center gap-1 -mr-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={(e) => handleArchive(email.id, e)} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Archive"><Archive size={16}/></button>
                          <button onClick={(e) => handleTrash(email.id, e)} className="p-1.5 hover:bg-slate-200 rounded text-slate-600" title="Delete"><Trash2 size={16}/></button>
                        </div>
                        <span className="group-hover:hidden">{email.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Compose Modal */}
          {isComposing && (
            <div className="absolute bottom-0 right-16 w-[500px] h-[500px] bg-white rounded-t-lg shadow-2xl border border-slate-300 flex flex-col z-50 overflow-hidden">
              <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between cursor-pointer">
                <span className="font-medium text-sm">New Message</span>
                <button onClick={() => setIsComposing(false)} className="hover:bg-slate-700 p-1 rounded transition-colors"><X size={16} /></button>
              </div>
              <div className="flex flex-col flex-1 px-4 py-2">
                <input 
                  type="email" 
                  placeholder="Recipients" 
                  value={composeTo}
                  onChange={e => setComposeTo(e.target.value)}
                  className="border-b border-slate-200 py-2 outline-none text-sm w-full"
                />
                <input 
                  type="text" 
                  placeholder="Subject" 
                  value={composeSubject}
                  onChange={e => setComposeSubject(e.target.value)}
                  className="border-b border-slate-200 py-2 outline-none text-sm w-full font-medium"
                />
                <textarea 
                  className="flex-1 w-full py-4 outline-none resize-none text-sm"
                  value={composeBody}
                  onChange={e => setComposeBody(e.target.value)}
                ></textarea>
              </div>
              <div className="border-t border-slate-200 p-3 bg-slate-50 flex items-center gap-3">
                <button 
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
                <button 
                  onClick={() => setIsComposing(false)}
                  className="hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
