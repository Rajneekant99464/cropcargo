import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, PhoneCall, Truck, CheckCircle, Repeat } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { lang, setActiveTab, switchRole } = useApp();

  const steps = [
    {
      step: '01',
      title: lang === 'hi' ? 'शेतकरी माल पोस्ट करतो' : 'Farmer Posts Cargo',
      desc: lang === 'hi'
        ? 'पिकअप गाव (उदा. शिरपूर), गंतव्य मंडी (सूरत), पिकाचा प्रकार, पोत्यांची संख्या आणि भाव टाका.'
        : 'Specify pickup village (e.g., Shirpur), destination mandi (Surat), crop name, bag count, and offered price in ₹.',
      icon: <FileText className="w-5 h-5 text-emerald-700" />,
    },
    {
      step: '02',
      title: lang === 'hi' ? 'चालक भाव किंवा बोली देतो' : 'Nearby Drivers Bid or Accept',
      desc: lang === 'hi'
        ? 'स्थानिक मालवाहू चालकांना सूचना जाते. ते थेट लोड स्वीकारू शकतात किंवा प्रतिस्पर्धी दर पाठवू शकतात.'
        : 'Verified drivers within 30 km receive instant broadcast. They can accept at offered rate or quote counter-bids.',
      icon: <PhoneCall className="w-5 h-5 text-emerald-700" />,
    },
    {
      step: '03',
      title: lang === 'hi' ? 'लोडिंग व हायवे ट्रान्झिट' : 'Safe Loading & Live Journey',
      desc: lang === 'hi'
        ? 'ड्रायव्हर शेतावर पोहोचतो, माल लोड करून ताडपत्री बांधली जाते आणि थेट मंडीकडे निघतो.'
        : 'Driver arrives at farm gate, confirms tare bags, fastens tarpaulin, and updates transit milestones on the route.',
      icon: <Truck className="w-5 h-5 text-emerald-700" />,
    },
    {
      step: '04',
      title: lang === 'hi' ? 'वापसीचा रिटर्न लोड (जॉब 2)' : 'Return Load Matched (Job 2)',
      desc: lang === 'hi'
        ? 'सूरतमध्ये माल उतरवण्यापूर्वीच चालकाला धुळे-शिरपूरकडे जाणाऱ्या कापड, पाईप किंवा खतांचा रिटर्न लोड मिळतो.'
        : 'Before even unloading in Surat, the driver picks up backhaul freight (drip pipes, cartons, fertilizers) back home.',
      icon: <Repeat className="w-5 h-5 text-amber-600" />,
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5">
            {lang === 'hi' ? 'प्रक्रिया कशी कार्य करते' : 'Seamless End-to-End Workflow'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-display">
            {lang === 'hi' ? 'सोपी व पारदर्शक ४-टप्प्यांची पद्धत' : 'How CropCargo Operates'}
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            From rural farm dispatch to urban wholesale delivery and backhaul return freight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xl font-extrabold text-neutral-300 font-mono">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-200/60 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Zero Hidden Fees</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
