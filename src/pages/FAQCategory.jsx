import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Link, useParams, Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import MarketingNavbar from '../components/MarketingNavbar';
import { faqCategories } from '../data/faqData.jsx';

export default function FAQCategory() {
  const { categoryId } = useParams();
  const [openFaq, setOpenFaq] = useState(null);

  const category = faqCategories.find(c => c.id === categoryId);
  if (!category) return <Navigate to="/faq" replace />;

  return (
    <div className="min-h-screen bg-cream text-emerald-deep flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 animate-fade-rise">
        <div className="mb-8">
          <Link to="/faq" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-brand hover:text-emerald-deep transition-colors">
            <ArrowLeft size={16} /> Back to Help Center
          </Link>
        </div>

        <h1 className="font-display text-4xl font-bold text-emerald-deep tracking-tight mb-4">{category.title}</h1>
        <p className="text-emerald-deep/70 mb-12 text-lg leading-relaxed">{category.description}</p>

        <div className="space-y-4">
          {category.questions.map((faq, index) => (
            <div key={index} className="bg-white/80 border border-emerald-deep/10 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="font-display font-bold text-emerald-deep pr-4">{faq.q}</span>
                {openFaq === index
                  ? <ChevronUp size={20} className="text-emerald-brand shrink-0" />
                  : <ChevronDown size={20} className="text-emerald-deep/40 shrink-0" />}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 text-emerald-deep/75 text-sm leading-relaxed border-t border-emerald-deep/10 pt-4 whitespace-pre-wrap">
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
