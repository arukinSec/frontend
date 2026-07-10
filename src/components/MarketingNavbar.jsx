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
        ? "block text-sm font-semibold text-emerald-brand"
        : "block text-sm font-medium text-emerald-deep/70 hover:text-emerald-deep transition-colors";
    }
    return isActive
      ? "text-sm font-semibold text-emerald-brand px-3 py-1.5 rounded-full bg-emerald-brand/10 border border-emerald-brand/20"
      : "text-sm font-medium text-emerald-deep/70 hover:text-emerald-deep px-3 py-1.5 rounded-full transition-colors";
  };

  return (
    <nav className="border-b border-emerald-deep/10 bg-cream/80 backdrop-blur-xl sticky top-0 z-50 shrink-0">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/arukin-logo.webp" className="h-8 w-8 object-contain rounded-lg" alt="Arukin" />
          <span className="font-display font-bold text-base tracking-tight text-emerald-deep">
            Arukin
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {/* Desktop & Tablet Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className={getLinkClass('/')}>Home</Link>
            <Link to="/how-it-works" className={`${getLinkClass('/how-it-works')} hidden xl:block`}>How it works</Link>
            <Link to="/use-cases" className={`${getLinkClass('/use-cases')} hidden xl:block`}>Use Cases</Link>
            <Link to="/about" className={`${getLinkClass('/about')} hidden xl:block`}>About</Link>
            <Link to="/pricing" className={getLinkClass('/pricing')}>Pricing</Link>
            <Link to="/privacy" className={getLinkClass('/privacy')}>Legal</Link>

            <div className="h-5 w-px bg-emerald-deep/10 mx-2"></div>

            <Link to="/client" className="text-xs font-semibold text-emerald-deep border-2 border-tertiary/60 hover:bg-tertiary/10 px-3.5 py-1.5 rounded-full transition-colors">
              Connect Account
            </Link>

            {managerId ? (
              <Link to="/dashboard" className="text-xs font-semibold text-cream bg-emerald-brand hover:bg-emerald-deep px-3.5 py-1.5 rounded-full transition-colors shadow-sm shadow-emerald-brand/20">
                Dashboard
              </Link>
            ) : (
              <Link to="/manager" className="text-xs font-semibold text-cream bg-emerald-brand hover:bg-emerald-deep px-3.5 py-1.5 rounded-full transition-colors shadow-sm shadow-emerald-brand/20">
                Manager Portal
              </Link>
            )}

            <a href="https://github.com/arukinSec" target="_blank" rel="noreferrer" className="hidden xl:flex items-center justify-center w-8 h-8 text-emerald-deep/60 hover:text-emerald-deep bg-emerald-deep/5 hover:bg-emerald-deep/10 rounded-full transition-colors ml-1" title="GitHub">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            </a>
          </div>

          <div className="xl:hidden flex items-center md:ml-4">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-emerald-deep hover:text-emerald-brand transition-colors p-1" aria-label="Toggle menu">
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="xl:hidden bg-cream border-t border-emerald-deep/10 px-6 py-4 space-y-3">
          <Link to="/" className={`${getLinkClass('/', true)} md:hidden`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/how-it-works" className={getLinkClass('/how-it-works', true)} onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
          <Link to="/use-cases" className={getLinkClass('/use-cases', true)} onClick={() => setIsMobileMenuOpen(false)}>Use Cases</Link>
          <Link to="/about" className={getLinkClass('/about', true)} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/pricing" className={`${getLinkClass('/pricing', true)} md:hidden`} onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          <Link to="/privacy" className={`${getLinkClass('/privacy', true)} md:hidden`} onClick={() => setIsMobileMenuOpen(false)}>Legal</Link>
          <div className="pt-3 border-t border-emerald-deep/10 space-y-2 md:hidden">
            <Link to="/client" className="block w-full text-center text-xs font-semibold text-emerald-deep border-2 border-tertiary/60 py-2 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Connect Account</Link>
            <Link to={managerId ? "/dashboard" : "/manager"} className="block w-full text-center text-xs font-semibold text-cream bg-emerald-brand py-2 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              {managerId ? 'Dashboard' : 'Manager Portal'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
