import React, { useState } from 'react';
import { Menu, X, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { faqCategories } from '../data/faqData.jsx';

export default function FAQCategory() {
  const { categoryId } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const category = faqCategories.find(c => c.id === categoryId);

  if (!category) {
    return <Navigate to="/faq" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Public Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/arukin-logo.webp" className="h-8 w-8 object-contain rounded-md shadow-sm" alt="ArukinSec Logo" />
            <span className="font-bold text-lg tracking-wide text-slate-900">ArukinSec</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">How it works</Link>
            <Link to="/use-cases" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Use Cases</Link>
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">About</Link>
            <Link to="/pricing" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">Pricing</Link>
            <a href="https://github.com/arukinSec" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors ml-2" title="Star on GitHub">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 focus:outline-none">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-50 border-b border-slate-200 px-6 py-4 space-y-4 shadow-2xl animate-fade-in">
            <Link to="/" className="block text-sm font-semibold text-slate-600">Home</Link>
            <Link to="/how-it-works" className="block text-sm font-semibold text-slate-600">How it works</Link>
            <Link to="/use-cases" className="block text-sm font-semibold text-slate-600">Use Cases</Link>
            <Link to="/about" className="block text-sm font-semibold text-slate-600">About</Link>
            <Link to="/pricing" className="block text-sm font-semibold text-slate-600">Pricing</Link>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 animate-fade-in">
        <div className="mb-8">
          <Link to="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            <ArrowLeft size={16} /> Back to Help Center
          </Link>
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{category.title}</h1>
        <p className="text-slate-600 mb-12 text-lg">{category.description}</p>
        
        <div className="space-y-4">
          {category.questions.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                {openFaq === index ? <ChevronUp size={20} className="text-emerald-600 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 whitespace-pre-wrap">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
