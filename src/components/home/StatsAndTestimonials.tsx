import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Truck, Users, Repeat, Star, CheckCircle, Info } from 'lucide-react';

export const StatsAndTestimonials: React.FC = () => {
  const { lang } = useApp();

  const demoStats = [
    {
      label: lang === 'hi' ? 'पूर्ण झालेल्या ट्रिप्स (डेमो)' : 'Demo Trips Completed',
      value: '1,420+',
      detail: 'Across Dhule, Surat & Nashik Mandis',
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
    },
    {
      label: lang === 'hi' ? 'चालकांची एकूण कमाई (डेमो)' : 'Driver Freight Generated',
      value: '₹48.2 Lakh',
      detail: 'Direct cash flow to rural vehicle owners',
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
    },
    {
      label: lang === 'hi' ? 'नोंदणीकृत व्यावसायिक वाहने' : 'Commercial Vehicles Listed',
      value: '380+',
      detail: 'Pickups, Tata Ace & 14-ft LCVs',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
    },
    {
      label: lang === 'hi' ? 'रिटर्न लोड यशस्वी प्रमाण' : 'Return Load Match Rate',
      value: '84.6%',
      detail: 'On Dhule ↔ Surat active corridor',
      icon: <Repeat className="w-5 h-5 text-amber-500" />,
    },
  ];

  const testimonials = [
    {
      quote:
        'Earlier, I used to wait half a day at Shirpur APMC to find a vehicle for Surat mandi, and agents took hefty cuts. On CropCargo, I posted 35 bags of onions at 8 PM, and Sunil bhau with his Bolero accepted it in 20 minutes.',
      name: 'Ramesh Patil (रमेश पाटील)',
      role: 'Farmer & Onion Cultivator',
      location: 'Waghadi Village, Shirpur, Dhule',
      crop: 'Red Onion / 1.4T',
    },
    {
      quote:
        'The Job 1 + Job 2 feature changed my monthly profit completely. I take fresh vegetables from Dhule to Surat for ₹7,800. Through the Return Finder, I pick up textile bundles back to Dhule for another ₹6,900. No more empty highway runs.',
      name: 'Sunil Pawar (सुनील पवार)',
      role: 'Commercial Pickup Owner (MH-18)',
      location: 'Dhule City',
      crop: 'Bolero Maxi Truck Operator',
    },
    {
      quote:
        'We operate agro-plastic processing in Surat. Sending drip pipes and mulching sheets back to North Maharashtra farmers used to require large transport brokers. With CropCargo, returning agricultural trucks give us prompt next-day delivery.',
      name: 'Bhavin Patel (भावीन पटेल)',
      role: 'Agro Supply Manufacturer',
      location: 'GIDC Sachin, Surat',
      crop: 'Drip Pipes & Farm Plastics',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prototype Banner above stats */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-8">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Info className="w-4 h-4 text-emerald-700" />
            <span>
              {lang === 'hi' 
                ? 'खालील सर्व आकडेवारी बीसीए प्रोजेक्ट सादरीकरणासाठी तयार केलेले काल्पनिक डेमो डेटा आहे.' 
                : 'Performance metrics below represent simulated demo scenario for academic evaluation.'}
            </span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Simulated Demo Data
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {demoStats.map((st, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-neutral-600 font-medium">
                  {st.label}
                </span>
                {st.icon}
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums tracking-tight">
                  {st.value}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  {st.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Header */}
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
            {lang === 'hi' ? 'शेतकरी व चालकांचे अनुभव' : 'Corridor Feedback'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-display">
            {lang === 'hi' ? 'खान्देश आणि दक्षिण गुजरातचा विश्वास' : 'Real Impact Across the Khandesh Belt'}
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Illustrative user case studies representing genuine transport pain points.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-[11px] font-bold text-neutral-700 ml-1.5 font-mono">5.0</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200/80">
                <div className="text-xs font-bold text-neutral-900">
                  {t.name}
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  {t.role}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  {t.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
