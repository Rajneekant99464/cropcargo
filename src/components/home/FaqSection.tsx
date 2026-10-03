import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { lang } = useApp();

  const faqs = [
    {
      q: lang === 'hi' ? 'क्रॉपकार्गो काय आहे आणि हे कसे कार्य करते?' : 'What is CropCargo and how does it work?',
      a: lang === 'hi'
        ? 'क्रॉपकार्गो हे ग्रामीण महाराष्ट्रातील शेतकरी, व्यापारी आणि व्यावसायिक मालवाहू वाहन चालकांना जोडणारे डिजिटल मंच आहे. शेतकरी थेट शेतावरून पिकअपसाठी माल पोस्ट करतात आणि स्थानिक चालक रास्त भावात तो स्वीकारतात.'
        : 'CropCargo is a rural logistics marketplace connecting farmers, grain traders, and commercial cargo vehicle operators (Tata Ace, Bolero Pickup, LCVs). It eliminates commission middlemen and ensures fair freight pricing.',
    },
    {
      q: lang === 'hi' ? 'जॉब 1 + जॉब 2 (रिटर्न लोड) म्हणजे काय?' : 'What is the Job 1 + Job 2 Return Load feature?',
      a: lang === 'hi'
        ? 'जॉब 1 म्हणजे शेतावरून शहराच्या मंडईत माल घेऊन जाणे (उदा. धुळे ते सूरत). जॉब 2 म्हणजे तेथून परत येताना रिकाम्या गाडीऐवजी परतीचा माल (उदा. कापड, ठिबक पाईप, खते) घेऊन येणे. यामुळे चालकाची कमाई दुप्पट होते आणि शेतकऱ्यांना 30-35% स्वस्त दर मिळतात.'
        : 'Job 1 is the outbound leg carrying farm produce (e.g. Dhule to Surat). Job 2 is the return leg carrying manufactured goods, packaging materials, or fertilizers back to the home district. This prevents empty return journeys (deadheading), doubles driver take-home earnings, and reduces backhaul rates.',
    },
    {
      q: lang === 'hi' ? 'कॅपेसिटी गार्ड (Capacity Guard) कसे कार्य करते?' : 'How does the Capacity Guard feature protect vehicles?',
      a: lang === 'hi'
        ? 'आमचे सिस्टीम वाहनाच्या आरटीओ नोंदणीकृत क्षमतेपेक्षा जास्त वजनाचे लोड स्वीकारण्यास प्रतिबंध करते. उदाहरणार्थ, बोलेरो पिकअप (१,५०० किलो) असल्यास ४,००० किलोचा लोड स्वीकारता येत नाही.'
        : 'The Capacity Guard automatically checks consignment weights against the driver’s registered vehicle payload limit. For instance, a 1,500 kg pickup truck is prevented from accepting a 4,200 kg heavy load to prevent axle damage and traffic violations.',
    },
    {
      q: lang === 'hi' ? 'ड्रायव्हरची कागदपत्रे व केवायसी कशी तपासली जाते?' : 'How are driver documents and KYC verified?',
      a: lang === 'hi'
        ? 'चालक त्यांचे ड्रायव्हिंग लायसन्स, आरसी बुक आणि आधार कार्ड अपलोड करतात. क्रॉपकार्गो ॲडमिन पथक आरटीओ पोर्टलद्वारे तपासणी करून "केवायसी सत्यापित" बॅज जारी करते.'
        : 'Drivers upload copies of their Commercial Driving License, RTO Registration Certificate (RC), and fitness certificates. CropCargo operations verifies these credentials before granting the Verified Partner badge.',
    },
    {
      q: lang === 'hi' ? 'ट्रॅकिंग कसे कार्य करते?' : 'How does consignment tracking work?',
      a: lang === 'hi'
        ? 'प्रत्येक बुकिंगला एक युनिक आयडी (उदा. CC-2026-8941) मिळतो. यामध्ये बुकिंग, लोडिंग, महामार्ग प्रवास आणि डिलिव्हरी असे ४ टप्पे टाइमस्टॅम्पसह नोंदवले जातात.'
        : 'Each consignment is assigned a unique Tracking ID with 4 milestone stages: Booking Confirmed, Loaded at Farm, In Transit on Highway, and Delivered at Mandi. In this prototype, simulated GPS telemetry demonstrates the workflow.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'hi' ? 'नेहमी विचारले जाणारे प्रश्न' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 font-display">
            {lang === 'hi' ? 'सर्व शंकांचे निरसन' : 'Clear Guidance for Rural Transport'}
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Learn how CropCargo transforms daily rural freight and backhaul matching.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-neutral-900">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
