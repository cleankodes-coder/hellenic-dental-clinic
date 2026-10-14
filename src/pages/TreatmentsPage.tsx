import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Clock, ShieldCheck, CheckCircle, ChevronRight, Search } from 'lucide-react';
import { ServiceCategory } from '../types/index.ts';

export const TreatmentsPage: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredCategories = categories.filter(cat => {
    if (activeTab !== 'all' && cat.id !== activeTab) return false;
    return true;
  });

  const allServices = categories.flatMap(cat => 
    cat.services.map(s => ({ ...s, categoryName: cat.name, categoryId: cat.id }))
  ).filter(s => {
    if (activeTab !== 'all' && s.categoryId !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Editorial Header */}
      <div className="bg-[#14294A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">
            COMPREHENSIVE DENTAL CARE
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Treatment Spectrum &amp; Clinical Services
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            From bespoke porcelain veneers and clear aligners to surgical dental implants and gentle pediatric care. Engineered with Swiss precision and Greek warmth.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#1762B2] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Treatments
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveTab(c.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === c.id
                    ? 'bg-[#1762B2] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatments..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                    {service.categoryName}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{service.durationMinutes} mins</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] group-hover:text-blue-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Suitable For Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recommended For:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.suitableFor.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/treatments/${service.slug}`}
                  className="text-xs font-bold text-slate-900 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <span>Detailed Overview</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  to={`/book?service=${service.id}`}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1762B2] text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Book Demo
                </Link>
              </div>
            </div>
          ))}
        </div>

        {allServices.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No treatments match your current filter or search criteria.</p>
            <button
              onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
              className="mt-3 text-xs font-bold text-blue-700 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
