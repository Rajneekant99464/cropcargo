import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sprout, Truck, Repeat, ShieldCheck, ArrowRight, IndianRupee, MapPin } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const { lang, switchRole, setActiveTab } = useApp();

  const features = [
    {
      icon: <Sprout className="w-5 h-5 text-emerald-700" />,
      title: lang === 'hi' ? 'शेतकरी व माल मालकांसाठी' : 'For Farmers & Agro Traders',
      subtitle: 'Post cargo directly from farm gate or village APMC',
      points: [
        'Post loads in under 60 seconds with simple crop & bag details',
        'Direct connection with verified local pickup & truck drivers',
        'Pay fair mandi freight rates without middleman commission cuts',
      ],
      actionLabel: lang === 'hi' ? 'शेतकरी पोर्टल उघडा' : 'Explore Farmer Portal',
      onAction: () => {
        switchRole('farmer');
        setActiveTab('farmer-dash');
      },
      bgClass: 'bg-emerald-50/50 border-emerald-200/80',
    },
    {
      icon: <Truck className="w-5 h-5 text-emerald-800" />,
      title: lang === 'hi' ? 'वाहन चालक व ट्रान्सपोर्टर्ससाठी' : 'For Drivers & Transport Partners',
      subtitle: 'Higher daily earnings with zero idle days',
      points: [
        'Capacity Guard checks prevent taking loads exceeding vehicle limits',
        'Instant alerts for agricultural loads within a 30 km radius',
        'Direct price negotiation with consignors before committing fuel',
      ],
      actionLabel: lang === 'hi' ? 'चालक पोर्टल उघडा' : 'Open Driver Desk',
      onAction: () => {
        switchRole('driver');
        setActiveTab('driver-dash');
      },
      bgClass: 'bg-white border-neutral-200',
    },
    {
      icon: <Repeat className="w-5 h-5 text-amber-600" />,
      title: lang === 'hi' ? 'रिटर्न लोड मॅचिंग इंजिन' : 'Intelligent Return Load Matching',
      subtitle: 'Job 1 (Going) + Job 2 (Return) dual route optimizer',
      points: [
        'Finds backhaul cargo from delivery hubs (e.g. Surat, Nashik)',
        'Cuts fuel wastage and vehicle deadheading on rural highways',
        'Search return freight even if outward trip was not on CropCargo',
      ],
      actionLabel: lang === 'hi' ? 'रिटर्न लोड शोधक' : 'Launch Return Finder',
      onAction: () => {
        setActiveTab('return-loads');
      },
      bgClass: 'bg-amber-50/40 border-amber-200/80',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      title: lang === 'hi' ? 'केवाईसी व विश्वास प्रणाली' : 'Verified KYC & Digital Trust',
      subtitle: 'Transparent rural logistics ecosystem',
      points: [
        'RTO vehicle registration and driving license cross-verification',
        'Consignment handover checklists with tare-weight records',
        'Simulated route tracking timeline for consignors & receivers',
      ],
      actionLabel: lang === 'hi' ? 'ट्रॅकिंग डेमो पहा' : 'View Tracking Demo',
      onAction: () => {
        setActiveTab('tracking');
      },
      bgClass: 'bg-white border-neutral-200',
    },
  ];

  return (
    <section className="py-16 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
            {lang === 'hi' ? 'मंच वैशिष्ट्ये' : 'Platform Architecture'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-display">
            {lang === 'hi' ? 'ग्रामीण मालवाहतूक सुलभ आणि फायदेशीर' : 'Engineered for Rural Freight Realities'}
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Purpose-built to resolve fragmented transport logistics across smallholder farms and highway transport networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 border flex flex-col justify-between transition-all hover:shadow-md ${feat.bgClass}`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-neutral-200/60 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                  {feat.subtitle}
                </p>

                <ul className="space-y-2 mb-6">
                  {feat.points.map((pt, pIdx) => (
                    <li key={pIdx} className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold text-sm leading-none mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={feat.onAction}
                className="w-full pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer group"
              >
                <span>{feat.actionLabel}</span>
                <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
