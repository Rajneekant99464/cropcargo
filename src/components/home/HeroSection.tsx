import React from 'react';
import { useApp } from '../../context/AppContext';
import { CargoSearchWidget } from './CargoSearchWidget';
import { Truck, Sprout, ArrowRight, ShieldCheck, Repeat, PlusCircle } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { lang, t, role, switchRole, setActiveTab } = useApp();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-emerald-50/60 via-white to-white">
      {/* Decorative subtle ambient pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#065f46 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & CTA Block */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline kicker without pill wrapping */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>Har Load Ka Safar, Har Safar Mein Load</span>
              <span className="text-neutral-400" aria-hidden="true">·</span>
              <span className="text-neutral-600 font-normal">North Maharashtra & Gujarat</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.15] text-balance font-display">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* 4 Main Action Buttons (Required by brief) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              {/* Button 1: Find a Vehicle */}
              <button
                onClick={() => {
                  if (role !== 'farmer') switchRole('farmer');
                  setActiveTab('farmer-dash');
                }}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Truck className="w-4 h-4 text-emerald-200" />
                <span>{t.findVehicle}</span>
              </button>

              {/* Button 2: Find Loads */}
              <button
                onClick={() => setActiveTab('loads')}
                className="px-4 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <span>{t.findLoads}</span>
              </button>

              {/* Button 3: Post a Load */}
              <button
                onClick={() => {
                  if (role !== 'farmer') switchRole('farmer');
                  setActiveTab('farmer-dash');
                }}
                className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                <span>{t.postLoadBtn}</span>
              </button>

              {/* Button 4: Find Return Loads (Core Innovation) */}
              <button
                onClick={() => setActiveTab('return-loads')}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <Repeat className="w-4 h-4 text-amber-900" />
                <span>{t.findReturnLoads}</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {lang === 'hi' ? 'सत्यापित वाहन व आरटीओ कागदपत्रे' : 'Verified RTO & DL Records'}
              </span>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <span>{lang === 'hi' ? 'सीधे किसान-चालक बातचीत' : 'Zero Middleman Commissions'}</span>
              <span className="text-neutral-300" aria-hidden="true">·</span>
              <span>{lang === 'hi' ? 'पारदर्शी भाव' : 'Transparent Rural Mandi Rates'}</span>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200/80 bg-neutral-900 aspect-16/10">
              <img
                src="/src/assets/images/hero_rural_transport_1791032844537.jpg"
                alt="Agricultural cargo truck on rural highway near Dhule"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              {/* Gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="text-xs font-semibold text-emerald-300">
                  Dhule - Surat - Nashik Corridor
                </div>
                <div className="text-sm font-bold mt-0.5">
                  Over 400+ commercial pickups & LCVs moving daily produce
                </div>
                <div className="text-[11px] text-neutral-300 mt-1">
                  Connecting APMC mandis to metropolitan consumption clusters
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cargo Search Widget below hero text */}
        <div className="mt-8 lg:mt-12">
          <CargoSearchWidget />
        </div>
      </div>
    </section>
  );
};
