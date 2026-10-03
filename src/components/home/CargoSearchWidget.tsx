import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Calendar, Tag, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { REGIONAL_CITIES, CARGO_CATEGORIES } from '../../data/mockData';

export const CargoSearchWidget: React.FC = () => {
  const { lang, t, searchFilters, setSearchFilters, setActiveTab } = useApp();
  
  const [pickup, setPickup] = useState(searchFilters.pickup || '');
  const [destination, setDestination] = useState(searchFilters.destination || '');
  const [category, setCategory] = useState(searchFilters.category || 'all');
  const [date, setDate] = useState(searchFilters.date || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters({
      pickup,
      destination,
      category,
      date,
    });
    setActiveTab('loads');
  };

  const handleSwap = () => {
    const temp = pickup;
    setPickup(destination);
    setDestination(temp);
  };

  const popularLanes = [
    { from: 'Dhule', to: 'Surat', label: 'Dhule → Surat (Vegetable Lane)' },
    { from: 'Shirpur', to: 'Nashik', label: 'Shirpur → Nashik (Banana/Onion)' },
    { from: 'Surat', to: 'Dhule', label: 'Surat → Dhule (Textile Return)' },
    { from: 'Jalgaon', to: 'Surat', label: 'Jalgaon → Surat (Cotton Bales)' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-emerald-950/5 border border-emerald-900/10 p-4 sm:p-6 lg:p-7">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
          {/* Pickup City */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.pickupLocation}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                list="regional-cities-pickup"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. धुले, शिरपूर' : 'e.g. Dhule, Shirpur'}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
              <datalist id="regional-cities-pickup">
                {REGIONAL_CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {/* Swap icon for desktop */}
          <div className="hidden md:flex md:col-span-1 items-center justify-center pb-2">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-emerald-700 border border-neutral-200 transition-colors"
              title="Swap Locations"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.destinationLocation}</span>
            </label>
            <div className="relative">
              <input
                type="text"
                list="regional-cities-drop"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. सूरत, नाशिक' : 'e.g. Surat, Nashik'}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
              <datalist id="regional-cities-drop">
                {REGIONAL_CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {/* Commodity Category */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.cargoType}</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all cursor-pointer"
            >
              {CARGO_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Action */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>{lang === 'hi' ? 'लोड शोधा' : 'Find Loads'}</span>
            </button>
          </div>
        </div>

        {/* Popular Freight Corridors (Zero-pill text links as per design skill) */}
        <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-y-1.5 gap-x-2 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700">
            {lang === 'hi' ? 'लोकप्रिय मार्ग:' : 'High-volume corridors:'}
          </span>
          {popularLanes.map((lane, idx) => (
            <React.Fragment key={lane.label}>
              <button
                type="button"
                onClick={() => {
                  setPickup(lane.from);
                  setDestination(lane.to);
                  setSearchFilters(prev => ({ ...prev, pickup: lane.from, destination: lane.to }));
                  setActiveTab('loads');
                }}
                className="text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer transition-colors"
              >
                {lane.label}
              </button>
              {idx < popularLanes.length - 1 && <span className="text-neutral-300" aria-hidden="true">·</span>}
            </React.Fragment>
          ))}
        </div>
      </form>
    </div>
  );
};
