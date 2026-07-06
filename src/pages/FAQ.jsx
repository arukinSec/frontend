import React from 'react';
import { ArrowRight, BookOpen, CreditCard, ShieldCheck, Zap, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { faqCategories } from '../data/faqData.jsx';
import MarketingNavbar from '../components/MarketingNavbar';

// Map icons to categories
const iconMap = {
  'general': <BookOpen className="text-emerald-600" size={24} />,
  'pricing': <CreditCard className="text-indigo-600" size={24} />,
  'features': <Zap className="text-amber-600" size={24} />,
  'security': <ShieldCheck className="text-teal-600" size={24} />,
  'troubleshooting': <Wrench className="text-rose-600" size={24} />
};

const bgMap = {
  'general': 'bg-emerald-50 border-emerald-100',
  'pricing': 'bg-indigo-50 border-indigo-100',
  'features': 'bg-amber-50 border-amber-100',
  'security': 'bg-teal-50 border-teal-100',
  'troubleshooting': 'bg-rose-50 border-rose-100'
};

export default function FAQ() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 animate-fade-in">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-3">
            Help Center
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">How can we help?</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Choose a category below to find detailed answers about ArukinSec's features, pricing, security, and open-source model.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqCategories.map((category) => (
            <Link 
              key={category.id} 
              to={`/faq/${category.id}`}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${bgMap[category.id] || 'bg-slate-50 border-slate-100'}`}>
                {iconMap[category.id] || <BookOpen size={24} className="text-slate-600" />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{category.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-6">
                {category.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 mt-auto group-hover:text-emerald-500 transition-colors">
                <span>View {category.questions.length} articles</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
