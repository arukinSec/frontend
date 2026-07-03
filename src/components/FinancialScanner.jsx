import React, { useState, useEffect } from 'react';
import { ShieldAlert, RefreshCw, Search, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { get, set } from 'idb-keyval';

const FINANCIAL_CATEGORIES = {
  banking: [
    { id: 'sbi', name: 'SBI', icon: 'https://cdn.simpleicons.org/statebankofindia', query: 'from:sbi.co.in OR from:onlinesbi.com' },
    { id: 'hdfc', name: 'HDFC Bank', icon: 'https://cdn.simpleicons.org/hdfcbank', query: 'from:hdfcbank.net OR from:hdfcbank.com OR from:hdfcbank.bank.in' },
    { id: 'icici', name: 'ICICI Bank', icon: 'https://cdn.simpleicons.org/icicibank', query: 'from:icicibank.com OR from:icici.bank.in' },
    { id: 'axis', name: 'Axis Bank', icon: 'https://cdn.simpleicons.org/axisbank', query: 'from:axisbank.com OR from:axis.bank.in' },
    { id: 'kotak', name: 'Kotak Bank', icon: 'https://cdn.simpleicons.org/kotakmahindrabank', query: 'from:kotak.com' },
    { id: 'pnb', name: 'PNB', icon: 'https://cdn.simpleicons.org/punjabnationalbank', query: 'from:pnb.co.in' },
    { id: 'boi', name: 'BOI', icon: 'https://cdn.simpleicons.org/bankofindia', query: 'from:bankofindia.co.in' },
    { id: 'ubi', name: 'Union Bank', icon: 'https://cdn.simpleicons.org/unionbankofindia', query: 'from:unionbankofindia.bank' },
    { id: 'chase', name: 'Chase', icon: 'https://cdn.simpleicons.org/chase', query: 'from:chase.com' },
    { id: 'bofa', name: 'Bank of America', icon: 'https://cdn.simpleicons.org/bankofamerica', query: 'from:bankofamerica.com' },
    { id: 'barclays', name: 'Barclays', icon: 'https://cdn.simpleicons.org/barclays', query: 'from:barclays.com OR from:barclays.co.uk' },
    { id: 'citi', name: 'Citi', icon: 'https://cdn.simpleicons.org/citi', query: 'from:citi.com' }
  ],
  wallets: [
    { id: 'paytm', name: 'Paytm', icon: 'https://cdn.simpleicons.org/paytm', query: 'from:paytm.com OR from:one97.com' },
    { id: 'phonepe', name: 'PhonePe', icon: 'https://cdn.simpleicons.org/phonepe', query: 'from:phonepe.com' },
    { id: 'cred', name: 'CRED', icon: 'https://cdn.simpleicons.org/cred', query: 'from:cred.club' },
    { id: 'mobikwik', name: 'MobiKwik', icon: 'https://cdn.simpleicons.org/mobikwik', query: 'from:mobikwik.com' },
    { id: 'freecharge', name: 'Freecharge', icon: 'https://cdn.simpleicons.org/freecharge', query: 'from:freecharge.in' },
    { id: 'fampay', name: 'FamPay', icon: 'https://cdn.simpleicons.org/wechat', query: 'from:fampay.in OR from:famapp.in' },
    { id: 'paypal', name: 'PayPal', icon: 'https://cdn.simpleicons.org/paypal', query: 'from:paypal.com' },
    { id: 'cashapp', name: 'Cash App', icon: 'https://cdn.simpleicons.org/cashapp', query: 'from:cash.app OR from:square.com' },
    { id: 'venmo', name: 'Venmo', icon: 'https://cdn.simpleicons.org/venmo', query: 'from:venmo.com' },
    { id: 'zelle', name: 'Zelle', icon: 'https://cdn.simpleicons.org/zelle', query: 'from:zellepay.com' },
    { id: 'revolut', name: 'Revolut', icon: 'https://cdn.simpleicons.org/revolut', query: 'from:revolut.com' },
    { id: 'wise', name: 'Wise', icon: 'https://cdn.simpleicons.org/wise', query: 'from:wise.com' }
  ],
  exchanges: [
    { id: 'zerodha', name: 'Zerodha', icon: 'https://cdn.simpleicons.org/zerodha', query: 'from:zerodha.com OR from:zerodha.net' },
    { id: 'groww', name: 'Groww', icon: 'https://cdn.simpleicons.org/groww', query: 'from:groww.in' },
    { id: 'upstox', name: 'Upstox', icon: 'https://cdn.simpleicons.org/upstox', query: 'from:upstox.com' },
    { id: 'angelone', name: 'Angel One', icon: 'https://cdn.simpleicons.org/wechat', query: 'from:angelone.in OR from:angelbroking.com' },
    { id: 'wazirx', name: 'WazirX', icon: 'https://cdn.simpleicons.org/wazirx', query: 'from:wazirx.com' },
    { id: 'coindcx', name: 'CoinDCX', icon: 'https://cdn.simpleicons.org/wechat', query: 'from:coindcx.com' },
    { id: 'binance', name: 'Binance', icon: 'https://cdn.simpleicons.org/binance', query: 'from:binance.com' },
    { id: 'coinbase', name: 'Coinbase', icon: 'https://cdn.simpleicons.org/coinbase', query: 'from:coinbase.com' },
    { id: 'kraken', name: 'Kraken', icon: 'https://cdn.simpleicons.org/kraken', query: 'from:kraken.com' },
    { id: 'cryptocom', name: 'Crypto.com', icon: 'https://cdn.simpleicons.org/crypto.com', query: 'from:crypto.com' }
  ]
};

export default function FinancialScanner({ member, fetchWithAuth, onNavigateToInbox, isPro }) {
  const [activeTab, setActiveTab] = useState('banking');
  const [scanStatus, setScanStatus] = useState('idle');
  const [finData, setFinData] = useState({});

  useEffect(() => {
    if (member?.id) {
      get(`fin_scan_${member.id}`).then(cached => {
        if (cached) setFinData(cached);
      });
    }
  }, [member]);

  const handleScan = async () => {
    if (!member) return;
    setScanStatus('scanning');
    
    try {
      const platformsToScan = FINANCIAL_CATEGORIES[activeTab];
      const newResults = {};
      
      const promises = platformsToScan.map(async (platform) => {
        const query = platform.query;
        
        const { data, error } = await supabase.functions.invoke('intel-gateway', {
          body: { scanType: 'financial', query, memberId: member.id }
        });
        
        if (!error && data && !data.error) {
          newResults[platform.id] = {
            status: data.detected ? 'connected' : 'not_found',
            details: data.details
          };
        } else {
          console.error(`Financial scan failed for ${platform.id}:`, error || data?.error);
          newResults[platform.id] = { status: 'not_found', details: error?.message || data?.error || 'Scan failed' };
        }
      });
      
      await Promise.all(promises);
      
      const currentResults = finData?.results || finData;
      const updatedResults = { ...currentResults, ...newResults };
      const currentScans = finData?.lastScans || {};
      const newFinData = { 
        results: updatedResults, 
        lastScans: { ...currentScans, [activeTab]: new Date().toISOString() } 
      };
      
      setFinData(newFinData);
      if (member?.id) {
        set(`fin_scan_${member.id}`, newFinData).catch(console.error);
      }
      
      setScanStatus('complete');
    } catch (err) {
      console.error(err);
      window.showToast("Scan failed.", "error");
      setScanStatus('idle');
    }
  };

  const scanResults = finData?.results || finData;
  const currentPlatforms = FINANCIAL_CATEGORIES[activeTab];
  const needsScan = currentPlatforms.some(p => !scanResults[p.id]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
      <div className="bg-white border-b border-slate-200 p-6 shrink-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert className="text-red-500" />
                Financial Diagnostics
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                Last scanned: {finData?.lastScans?.[activeTab] ? new Date(finData.lastScans[activeTab]).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Never'}
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl">
              Scan for footprints linked to highly-targeted global and Indian financial institutions.
            </p>
          </div>

          <button 
            onClick={handleScan}
            disabled={scanStatus === 'scanning'}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
              scanStatus === 'scanning'
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            {scanStatus === 'scanning' ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
            Scan {activeTab === 'banking' ? 'Banks' : activeTab === 'wallets' ? 'Wallets' : 'Exchanges'}
          </button>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg w-fit mt-6">
          <button 
            onClick={() => { setActiveTab('banking'); setScanStatus(needsScan ? 'idle' : 'complete'); }}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === 'banking' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Banking
          </button>
          <button 
            onClick={() => { setActiveTab('wallets'); setScanStatus(needsScan ? 'idle' : 'complete'); }}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === 'wallets' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            P2P & Wallets
          </button>
          <button 
            onClick={() => { setActiveTab('exchanges'); setScanStatus(needsScan ? 'idle' : 'complete'); }}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === 'exchanges' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Exchanges
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentPlatforms.map((platform) => {
            const result = scanResults[platform.id];
            return (
              <div 
                key={platform.id} 
                onClick={() => {
                  if (isPro) {
                    if (onNavigateToInbox) onNavigateToInbox(platform.id.toUpperCase());
                  } else {
                    window.showToast('PRO Feature: Upgrade to view target emails', 'error');
                  }
                }}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <img src={platform.icon} alt={platform.name} className="w-5 h-5 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{platform.name}</p>
                  <p className={`text-[10px] uppercase font-bold tracking-wider ${
                    scanStatus === 'scanning' ? 'text-indigo-500' :
                    result?.status === 'connected' ? 'text-emerald-600' :
                    result?.status === 'not_found' ? 'text-slate-400' :
                    'text-slate-400'
                  }`}>
                    {scanStatus === 'scanning' ? 'Scanning...' :
                     result?.status === 'connected' ? 'Email Detected' : 
                     result?.status === 'not_found' ? 'Unlikely' : 'Pending Scan'}
                  </p>
                </div>
                {result?.status === 'connected' && (
                  <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                )}
                {result?.status === 'not_found' && (
                  <XCircle size={18} className="text-slate-300 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
