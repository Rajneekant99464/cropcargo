import React from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, Sprout, ShieldCheck, MapPin, Phone, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, setActiveTab, resetAllData } = useApp();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">CropCargo</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              "Har Load Ka Safar, Har Safar Mein Load."
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {lang === 'hi' 
                ? 'ग्रामीण भारत के लिए पहला डिजिटल कृषि माल ढुलाई व रिटर्न लोड मंच। किसानों के परिवहन खर्च में बचत, चालकों की आय में वृद्धि।'
                : 'Pioneering rural logistics and return load matching platform for Maharashtra & Gujarat agricultural belts.'}
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                BCA Field Project Presentation Edition
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-100">
              {lang === 'hi' ? 'मुख्य नेविगेशन' : 'Platform Portals'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('loads')} className="hover:text-emerald-400 transition-colors">
                  {lang === 'hi' ? 'उपलब्ध लोड खोजें' : 'Search Available Cargo'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('return-loads')} className="hover:text-emerald-400 transition-colors">
                  {lang === 'hi' ? 'जॉब 1 + 2 रिटर्न लोड' : 'Return Load Matching Engine'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tracking')} className="hover:text-emerald-400 transition-colors">
                  {lang === 'hi' ? 'लाइव ट्रैकिंग डेमो' : 'Simulated GPS Tracking'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('farmer-dash')} className="hover:text-emerald-400 transition-colors">
                  {lang === 'hi' ? 'किसान डैशबोर्ड' : 'Farmer / Consignor Desk'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('driver-dash')} className="hover:text-emerald-400 transition-colors">
                  {lang === 'hi' ? 'चालक / वाहन मालिक' : 'Commercial Driver Desk'}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin-dash')} className="hover:text-emerald-400 transition-colors">
                  {lang === 'hi' ? 'एडमिन संचालन' : 'Admin & KYC Management'}
                </button>
              </li>
            </ul>
          </div>

          {/* Logistics Corridor */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-100">
              {lang === 'hi' ? 'सक्रिय परिचालन गलियारा' : 'Active Rural Hubs'}
            </h4>
            <div className="text-xs text-neutral-400 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span>Dhule - Shirpur APMC Market Hub (MH)</span>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span>Nardana MIDC & Agro Processing Park</span>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span>Surat APMC & Textile Corridor (GJ)</span>
              </div>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span>Nashik & Jalgaon Banana/Onion Belts</span>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                Connected via NH-52 (Indore-Dhule) & NH-53 (Surat-Dhule-Nagpur).
              </p>
            </div>
          </div>

          {/* Prototype Controls & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-100">
              {lang === 'hi' ? 'परीक्षण व सहायता' : 'Prototype Controls'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {lang === 'hi'
                ? 'यह प्रोटोटाइप ब्राउज़र सत्र में स्थानीय डेटा का उपयोग करता है। वास्तविक डेटाबेस और गेटवे अगले चरण में जोड़े जाएंगे।'
                : 'All listings, drivers, and phone numbers are fictional demo data for prototype evaluation.'}
            </p>
            
            <button
              onClick={resetAllData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-neutral-800 hover:bg-neutral-700/80 rounded-lg border border-neutral-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{lang === 'hi' ? 'डेमो डेटा रीसेट करें' : 'Reset Sample Records'}</span>
            </button>

            <div className="pt-2 text-[11px] text-neutral-500">
              Support Desk: <span className="text-neutral-400 font-mono">+91 94227 88921 (Demo)</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div>
            © 2026 CropCargo Logistics. All demo rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-neutral-400 cursor-pointer">About Project</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-neutral-400 cursor-pointer">BCA Field Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
