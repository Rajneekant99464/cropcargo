import React from 'react';
import { useApp } from '../../context/AppContext';
import { Repeat, ArrowRight, CheckCircle2, TrendingUp, IndianRupee, Fuel } from 'lucide-react';

export const Job1Job2FeatureBanner: React.FC = () => {
  const { lang, setActiveTab, setReturnSearchQuery } = useApp();

  const handleTryDemoCorridor = () => {
    setReturnSearchQuery({
      fromCity: 'Surat',
      returnToCity: 'Dhule',
      date: '2026-10-05',
      vehicleType: 'pickup',
    });
    setActiveTab('return-loads');
  };

  return (
    <section className="py-12 bg-neutral-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <Repeat className="w-4 h-4 text-amber-400" />
            <span>{lang === 'hi' ? 'विशेष नवाचार' : 'Core Innovation: Dual-Leg Matching'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            {lang === 'hi'
              ? 'जॉब 1 + जॉब 2: शून्य खाली वापसी, दुप्पट कमाई'
              : 'The Job 1 + Job 2 Engine: Zero Empty Miles'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
            {lang === 'hi'
              ? 'आमतौर पर चालक सब्जियां लेकर शहर जाते हैं और 220 किमी खाली गाड़ी लेकर लौटते हैं। क्रॉपकार्गो रिटर्न लोड मैचिंग के साथ हर ट्रिप दोनों तरफ से लोड होती है।'
              : 'Traditionally, rural drivers deliver farm produce to cities and drive 200+ km back with an empty truck. CropCargo pre-matches a return cargo load before the driver even leaves home.'}
          </p>
        </div>

        {/* Visual Dual-Leg Diagram Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Job 1 Card */}
          <div className="lg:col-span-5 bg-neutral-800/90 rounded-2xl p-6 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-emerald-400 uppercase tracking-wide">
                  Leg 1: Going Load (जाणे)
                </span>
                <span className="font-mono text-neutral-400">228 KM</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Dhule / Shirpur ➔ Surat APMC
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                Fresh onions, pomegranate crates, or grain sacks loaded directly at the farm gate or village APMC yard.
              </p>
              
              <div className="space-y-2 text-xs text-neutral-400 bg-neutral-900/60 p-3 rounded-xl border border-neutral-700/50">
                <div className="flex justify-between">
                  <span>Cargo Type:</span>
                  <span className="text-white font-medium">35 Bags Red Onions (1.4T)</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Pay:</span>
                  <span className="text-emerald-400 font-bold font-mono">₹7,800</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel & Tolls:</span>
                  <span className="text-neutral-300 font-mono">~₹3,400</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-700 flex items-center justify-between text-xs text-neutral-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Produce Delivered at Mandi
              </span>
              <span className="font-mono text-neutral-400">05:00 AM Entry</span>
            </div>
          </div>

          {/* Plus Connector for Desktop */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-amber-500/20">
              +
            </div>
            <div className="text-center mt-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Automated Match
              </div>
              <div className="text-[11px] text-neutral-400">Backhaul corridor</div>
            </div>
          </div>

          {/* Job 2 Card */}
          <div className="lg:col-span-5 bg-neutral-800/90 rounded-2xl p-6 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-amber-400 uppercase tracking-wide">
                  Leg 2: Return Load (वापसी)
                </span>
                <span className="font-mono text-neutral-400">232 KM</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Surat Ring Road ➔ Dhule MIDC
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                Dry textile bundles, packaging boxes, irrigation drip pipes, or animal feed returned to North Maharashtra.
              </p>
              
              <div className="space-y-2 text-xs text-neutral-400 bg-neutral-900/60 p-3 rounded-xl border border-neutral-700/50">
                <div className="flex justify-between">
                  <span>Return Cargo:</span>
                  <span className="text-white font-medium">Textiles & Farm Equipment (1.1T)</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Pay:</span>
                  <span className="text-amber-400 font-bold font-mono">+₹6,900</span>
                </div>
                <div className="flex justify-between">
                  <span>Extra Diesel:</span>
                  <span className="text-neutral-300 font-mono">₹0 (Route already traveled)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-700 flex items-center justify-between text-xs text-neutral-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <TrendingUp className="w-4 h-4" /> Driver Net Profit: +92%
              </span>
              <span className="font-mono text-emerald-400 font-bold">Total: ₹14,700</span>
            </div>
          </div>
        </div>

        {/* Action Button & Disclaimer */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400 max-w-xl">
            <span className="font-semibold text-neutral-300">Transparency Note: </span>
            Return load availability depends on active consignor listings. CropCargo does not guarantee return availability on every single route, but broadcasts driver schedules to nearby traders.
          </div>

          <button
            onClick={handleTryDemoCorridor}
            className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <span>{lang === 'hi' ? 'सूरत-धुले रिटर्न लोड शोधक चालवा' : 'Launch Surat → Dhule Return Finder'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
