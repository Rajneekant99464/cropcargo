import React from 'react';
import { useApp } from '../../context/AppContext';
import { VEHICLE_TYPES } from '../../data/mockData';
import { Weight, IndianRupee, Check, ArrowRight } from 'lucide-react';

export const VehicleFleet: React.FC = () => {
  const { lang, switchRole, setActiveTab } = useApp();

  return (
    <section className="py-16 bg-neutral-50/50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
              {lang === 'hi' ? 'वाहन फ्लीट पर्याय' : 'Supported Commercial Vehicles'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-display">
              {lang === 'hi' ? 'प्रत्येक शेतमालासाठी योग्य वाहन' : 'Vehicles Built for Rural Mandi Logistics'}
            </h2>
            <p className="mt-2 text-sm text-neutral-600 max-w-xl">
              Capacity Guard automatically verifies your load weight against vehicle specifications before booking.
            </p>
          </div>

          <button
            onClick={() => {
              switchRole('driver');
              setActiveTab('driver-dash');
            }}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span>{lang === 'hi' ? 'आपले वाहन नोंदणी करा' : 'Register Your Vehicle as Partner'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VEHICLE_TYPES.map((v) => {
            let imageSrc = '/src/assets/images/vehicle_bolero_pickup_1791032861729.jpg';
            if (v.type === 'mini_truck') {
              imageSrc = '/src/assets/images/vehicle_tata_ace_1791032879222.jpg';
            } else if (v.type === 'lcv') {
              imageSrc = '/src/assets/images/return_load_concept_1791032893301.jpg';
            } else if (v.type === 'heavy') {
              imageSrc = '/src/assets/images/hero_rural_transport_1791032844537.jpg';
            }

            return (
              <div
                key={v.type}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={v.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded font-semibold">
                      {v.capacityDesc}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-sm font-bold text-neutral-900">
                      {v.name}
                    </h3>
                    <div className="text-[11px] text-emerald-800 font-medium mb-3">
                      {v.hindiName}
                    </div>

                    <div className="space-y-2 text-xs text-neutral-600 mb-4">
                      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                        <span className="text-neutral-500">Max Payload:</span>
                        <span className="font-semibold text-neutral-900 font-mono">
                          {v.capacityKg.toLocaleString('en-IN')} kg
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                        <span className="text-neutral-500">Benchmark Rate:</span>
                        <span className="font-semibold text-emerald-700 font-mono">
                          ₹{v.avgRatePerKm}/km (approx)
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-500 leading-relaxed">
                      <span className="font-semibold text-neutral-700">Best for: </span>
                      {v.idealFor}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      switchRole('farmer');
                      setActiveTab('farmer-dash');
                    }}
                    className="w-full py-2 text-center text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
                  >
                    {lang === 'hi' ? 'या वाहनासाठी लोड बुक करा' : `Book a ${v.name.split(' ')[0]}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
