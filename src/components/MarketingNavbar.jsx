import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function MarketingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const managerId = localStorage.getItem('manager_id');

  const getLinkClass = (path, isMobile = false) => {
    let isActive = location.pathname === path;
    if (path === '/privacy') {
      isActive = ['/privacy', '/terms', '/disclaimer', '/beta-notice'].includes(location.pathname);
    }
    if (isMobile) {
      return isActive 
        ? "block text-xs font-bold text-emerald-600" 
        : "block text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors";
    }
    return isActive 
      ? "text-sm font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20" 
      : "text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors";
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="/arukin-logo.webp" className="h-8 w-8 object-contain rounded-md shadow-sm" alt="ArukinSec Logo" />
            <span className="font-bold text-base tracking-wide text-slate-900 hover:text-emerald-600 transition-colors">
              ArukinSec
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/how-it-works" className={getLinkClass('/how-it-works')}>How it works</Link>
          <Link to="/use-cases" className={getLinkClass('/use-cases')}>Use Cases</Link>
          <Link to="/about" className={getLinkClass('/about')}>About</Link>
          <Link to="/pricing" className={getLinkClass('/pricing')}>Pricing</Link>
          <Link to="/privacy" className={getLinkClass('/privacy')}>Legal</Link>
          
          {/* Main Divider */}
          <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
          
          <Link to="/client" className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-full transition-colors shadow-sm">
            Connect Account
          </Link>

          {/* Action Divider */}
          <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
          
          {managerId ? (
            <Link to="/dashboard" className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-full transition-colors shadow-sm shadow-emerald-600/10">
              Dashboard
            </Link>
          ) : (
            <Link to="/manager" className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-full transition-colors shadow-sm shadow-emerald-600/10">
              Manager Portal
            </Link>
          )}

          <a href="https://github.com/arukinSec" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors ml-1" title="Star on GitHub">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-50 border-t border-slate-200 px-6 py-4 space-y-3 animate-fade-in">
          <Link to="/" className={getLinkClass('/', true)} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/how-it-works" className={getLinkClass('/how-it-works', true)} onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
          <Link to="/use-cases" className={getLinkClass('/use-cases', true)} onClick={() => setIsMobileMenuOpen(false)}>Use Cases</Link>
          <Link to="/about" className={getLinkClass('/about', true)} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/pricing" className={getLinkClass('/pricing', true)} onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          <Link to="/privacy" className={getLinkClass('/privacy', true)} onClick={() => setIsMobileMenuOpen(false)}>Legal</Link>
          
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <Link to="/client" className="block w-full text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 py-2 rounded-lg transition-colors shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>
              Connect Account
            </Link>
            {managerId ? (
              <Link to="/dashboard" className="block w-full text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg transition-colors shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </Link>
            ) : (
              <Link to="/manager" className="block w-full text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg transition-colors shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>
                Manager Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
