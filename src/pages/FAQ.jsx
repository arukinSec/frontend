import React from 'react';
import { ArrowRight, BookOpen, CreditCard, ShieldCheck, Zap, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { faqCategories } from '../data/faqData.jsx';
import MarketingNavbar from '../components/MarketingNavbar';

const iconMap = {
  general: BookOpen,
  pricing: CreditCard,
  features: Zap,
  security: ShieldCheck,
  troubleshooting: Wrench,
};

const tintMap = {
  general: 'bg-emerald-brand/10 text-emerald-brand',
  pricing: 'bg-gold/15 text-gold',
  features: 'bg-emerald-deep/10 text-emerald-deep',
  security: 'bg-emerald-brand/10 text-emerald-brand',
  troubleshooting: 'bg-rose-500/10 text-rose-600',
};

export default function FAQ() {
  return (
    <div className="min-h-screen bg-cream text-emerald-deep flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 animate-fade-rise">
        <div className="text-center mb-16">
          <div className="brand-eyebrow mb-5 mx-auto"><span>Help Center</span></div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-emerald-deep tracking-tight mb-4">How can we help?</h1>
          <p className="text-emerald-deep/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Choose a category to find detailed answers about Arukin's features, pricing, security, and open-source model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqCategories.map((category) => {
            const Icon = iconMap[category.id] || BookOpen;
            return (
              <Link
                key={category.id}
                to={`/faq/${category.id}`}
                className="bg-white/80 border border-emerald-deep/10 rounded-3xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${tintMap[category.id] || 'bg-emerald-deep/10 text-emerald-deep'}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-xl font-bold text-emerald-deep mb-2">{category.title}</h3>
                <p className="text-emerald-deep/70 text-sm leading-relaxed flex-1 mb-6">{category.description}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-brand mt-auto group-hover:gap-3 transition-all">
                  <span>View {category.questions.length} articles</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
