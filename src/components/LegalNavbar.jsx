import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function LegalNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getLinkClass = (path, isMobile = false) => {
    const isActive = location.pathname === path;
    if (isMobile) {
      return isActive
        ? "block text-sm font-semibold text-gold"
        : "block text-sm font-medium text-cream/70 hover:text-cream transition-colors";
    }
    return isActive
      ? "text-sm font-semibold text-gold px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20"
      : "text-sm font-medium text-cream/70 hover:text-cream px-3 py-1.5 rounded-full transition-colors";
  };

  return (
    <nav className="border-b border-cream/10 bg-emerald-deep/90 backdrop-blur-md sticky top-0 z-50 shrink-0">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/arukin-logo.webp" className="h-8 w-8 object-contain rounded-lg" alt="ArukinSec" />
          <span className="font-display font-bold text-base tracking-tight text-cream">
            ArukinSec
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/privacy" className={getLinkClass('/privacy')}>Privacy</Link>
          <Link to="/terms" className={getLinkClass('/terms')}>Terms</Link>
          <Link to="/beta-notice" className={getLinkClass('/beta-notice')}>Beta Notice</Link>
          <Link to="/disclaimer" className={getLinkClass('/disclaimer')}>Disclaimer</Link>
          
          <div className="h-5 w-px bg-cream/10 mx-2"></div>

          <a href="https://github.com/arukinSec" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 text-cream/60 hover:text-cream bg-cream/5 hover:bg-cream/10 rounded-full transition-colors ml-1" title="GitHub">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
          </a>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-cream">
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-emerald-deep px-6 py-4 space-y-3">
          <Link to="/" className={getLinkClass('/', true)} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/privacy" className={getLinkClass('/privacy', true)} onClick={() => setIsMobileMenuOpen(false)}>Privacy Policy</Link>
          <Link to="/terms" className={getLinkClass('/terms', true)} onClick={() => setIsMobileMenuOpen(false)}>Terms of Service</Link>
          <Link to="/beta-notice" className={getLinkClass('/beta-notice', true)} onClick={() => setIsMobileMenuOpen(false)}>Beta Notice</Link>
          <Link to="/disclaimer" className={getLinkClass('/disclaimer', true)} onClick={() => setIsMobileMenuOpen(false)}>Disclaimer</Link>
        </div>
      )}
    </nav>
  );
}
