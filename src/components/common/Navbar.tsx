import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, Sprout, Menu, X, Globe, UserCheck, ShieldAlert, ChevronDown } from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { lang, setLang, t, role, switchRole, activeTab, setActiveTab, currentUser, setAuthModalOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'loads', label: t.navFindLoads },
    { id: 'return-loads', label: lang === 'hi' ? 'जॉब 1+2 रिटर्न लोड' : 'Return Loads (Job 1+2)' },
    { id: 'tracking', label: t.navTracking },
    { 
      id: role === 'farmer' ? 'farmer-dash' : role === 'driver' ? 'driver-dash' : 'admin-dash', 
      label: role === 'farmer' ? (lang === 'hi' ? 'किसान डैशबोर्ड' : 'Farmer Desk') :
             role === 'driver' ? (lang === 'hi' ? 'चालक डैशबोर्ड' : 'Driver Desk') :
             (lang === 'hi' ? 'एडमिन कंसोल' : 'Admin Console'),
      isDashboard: true
    },
  ];

  const handleRoleSelect = (newRole: UserRole) => {
    switchRole(newRole);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10">
      {/* Prototype Disclaimer Bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs px-4 py-1 flex items-center justify-between text-center overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-2 mx-auto">
          <span className="font-semibold text-white tracking-wide uppercase text-[11px] bg-emerald-800 px-1.5 py-0.5 rounded">
            Prototype Demo
          </span>
          <span className="text-emerald-100">
            {lang === 'hi' 
              ? 'ग्रामीण भारत के लिए कृषि माल ढुलाई व रिटर्न लोड समाधान | बीसीए प्रोजेक्ट' 
              : 'Rural Cargo & Return Load Matching for Maharashtra & Gujarat | BCA Project'}
          </span>
        </div>
      </div>

      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (4-6 Nav links) — Zone 3 (1-2 Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Wordmark with Cargo Leaf Motif */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus-visible:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-200">
            <div className="relative">
              <Truck className="w-5 h-5 text-white" />
              <Sprout className="w-3.5 h-3.5 text-lime-300 absolute -top-1.5 -right-2" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-neutral-900 font-display">
                CropCargo
              </span>
            </div>
          </div>
        </button>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-700">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors cursor-pointer py-1 text-sm ${
                  isActive 
                    ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600' 
                    : 'text-neutral-600 hover:text-emerald-800'
                } ${link.isDashboard ? 'bg-emerald-50 px-2.5 py-1 rounded-md text-emerald-800 border border-emerald-200 font-semibold' : ''}`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Language Toggle, Role Switcher / Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hindi/English Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
            title="Toggle Hindi / English"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Role Dropdown / Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg border border-neutral-300 transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="capitalize font-semibold text-neutral-900 hidden sm:inline">
                {role === 'farmer' ? (lang === 'hi' ? 'किसान' : 'Farmer') :
                 role === 'driver' ? (lang === 'hi' ? 'चालक' : 'Driver') : 
                 (lang === 'hi' ? 'एडमिन' : 'Admin')}
              </span>
              <span className="sm:hidden text-[11px] font-semibold">{role[0].toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-neutral-500" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-neutral-100">
                  <div className="text-[11px] text-neutral-500 font-medium">Logged in as:</div>
                  <div className="text-xs font-semibold text-neutral-900 truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-emerald-700 font-mono truncate">{currentUser.phone}</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleRoleSelect('farmer')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 ${role === 'farmer' ? 'font-bold text-emerald-800 bg-emerald-50/50' : 'text-neutral-700'}`}
                  >
                    <span>🌾 {lang === 'hi' ? 'किसान / माल मालिक' : 'Farmer / Load Owner'}</span>
                    {role === 'farmer' && <span className="text-[10px] text-emerald-600">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('driver')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 ${role === 'driver' ? 'font-bold text-emerald-800 bg-emerald-50/50' : 'text-neutral-700'}`}
                  >
                    <span>🚛 {lang === 'hi' ? 'चालक / वाहन मालिक' : 'Driver / Transporter'}</span>
                    {role === 'driver' && <span className="text-[10px] text-emerald-600">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 ${role === 'admin' ? 'font-bold text-emerald-800 bg-emerald-50/50' : 'text-neutral-700'}`}
                  >
                    <span>⚙️ {lang === 'hi' ? 'एडमिन कंसोल' : 'Admin Console'}</span>
                    {role === 'admin' && <span className="text-[10px] text-emerald-600">Active</span>}
                  </button>
                </div>

                <div className="border-t border-neutral-100 pt-1 mt-1 px-2">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="w-full text-center px-2 py-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                  >
                    {lang === 'hi' ? 'खाता बदलें / नया बनाएं' : 'Switch Account / Register'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA: Post a Load */}
          <button
            onClick={() => {
              if (role !== 'farmer') switchRole('farmer');
              setActiveTab('farmer-dash');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm shadow-emerald-800/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>+</span>
            <span>{t.postLoadBtn}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                  activeTab === link.id
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => {
                if (role !== 'farmer') switchRole('farmer');
                setActiveTab('farmer-dash');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-emerald-700 rounded-lg shadow-sm"
            >
              + {t.postLoadBtn}
            </button>
            <button
              onClick={() => {
                setAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 text-center text-xs font-medium text-neutral-700 bg-neutral-100 rounded-lg"
            >
              {lang === 'hi' ? 'खाता व भूमिका चयन' : 'Switch User / Demo Accounts'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
