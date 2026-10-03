import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, VehicleCategory, UserProfile } from '../../types';
import { X, User, Truck, Shield, Check, AlertCircle } from 'lucide-react';
import { VEHICLE_TYPES } from '../../data/mockData';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    lang, 
    currentUser, 
    setCurrentUser, 
    switchRole, 
    users, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'demo_login' | 'register'>('demo_login');
  
  // Registration form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('Dhule');
  
  // Driver specific
  const [vehicleType, setVehicleType] = useState<VehicleCategory>('pickup');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleName, setVehicleName] = useState('Mahindra Bolero Maxi Truck');
  const [licenseNumber, setLicenseNumber] = useState('');

  if (!authModalOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim()) {
      addToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please provide full name, mobile number and city/village.',
      });
      return;
    }

    const newUserId = `user_${selectedRole}_${Date.now()}`;
    const newUser: UserProfile = {
      id: newUserId,
      name,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: email || undefined,
      role: selectedRole,
      city,
      district,
      state: 'Maharashtra',
      isKycVerified: false,
      registeredDate: new Date().toISOString().split('T')[0],
      driverDetails: selectedRole === 'driver' ? {
        vehicleType,
        vehicleName,
        vehicleNumber: vehicleNumber.toUpperCase() || 'MH-18-NEW-01',
        capacityKg: VEHICLE_TYPES.find(v => v.type === vehicleType)?.capacityKg || 1500,
        isAvailable: true,
        currentCity: city,
        experienceYears: 3,
        rating: 5.0,
        tripsCompleted: 0,
        licenseNumber: licenseNumber || 'MH18-PENDING',
        rcNumber: 'RC-SUBMITTED-PROTOTYPE',
        aadhaarNumber: 'XXXX-XXXX-DEMO',
        kycStatus: 'pending',
        demoEarnings: { totalGross: 0, thisMonth: 0, returnLoadsBonus: 0 }
      } : undefined,
      farmerDetails: selectedRole === 'farmer' ? {
        farmType: 'Agricultural Produce',
        farmSizeAcres: 5,
        primaryCrops: ['Vegetables', 'Grains'],
        mandiPreference: `${city} APMC`,
      } : undefined,
    };

    setCurrentUser(newUser);
    switchRole(selectedRole);
    setAuthModalOpen(false);

    addToast({
      type: 'success',
      title: 'Registration Successful',
      message: `Welcome, ${name}! Your demo account has been activated as ${selectedRole}.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70 rounded-t-2xl">
          <div>
            <h3 className="text-base font-bold text-neutral-900 font-display">
              {lang === 'hi' ? 'क्रॉपकार्गो उपयोगकर्ता प्रमाणीकरण' : 'CropCargo User Access & Roles'}
            </h3>
            <p className="text-xs text-neutral-500">
              {lang === 'hi' ? 'डेमो मोड: तत्काल टेस्ट लॉगिन या कस्टम पंजीकरण' : 'Demo Mode: Instant role switch or custom profile'}
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="p-3 mx-5 mt-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-semibold">BCA Field Prototype Notice: </span>
            This prototype uses simulated local authentication. Real SMS OTP and identity verification gateways are not active in this development environment.
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 px-5 mt-4">
          <button
            onClick={() => setActiveTab('demo_login')}
            className={`pb-2.5 text-xs font-semibold cursor-pointer border-b-2 px-3 transition-colors ${
              activeTab === 'demo_login'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {lang === 'hi' ? '1-क्लिक टेस्ट प्रोफाइल (सुझावित)' : '1-Click Quick Demo Profiles'}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`pb-2.5 text-xs font-semibold cursor-pointer border-b-2 px-3 transition-colors ${
              activeTab === 'register'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {lang === 'hi' ? 'नया खाता पंजीकृत करें' : 'Register Custom Profile'}
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === 'demo_login' ? (
            <div className="space-y-3">
              <p className="text-xs text-neutral-600">
                Select any pre-configured persona with active sample data:
              </p>

              {/* Persona 1: Farmer */}
              <button
                onClick={() => {
                  switchRole('farmer');
                  setAuthModalOpen(false);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  currentUser.role === 'farmer'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Ramesh Patil (रमेश पाटील)</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Farmer Role
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">
                    Shirpur APMC Corridor, Dhule · Onion & Cotton Cultivator
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">+91 98234 11092</div>
                </div>
              </button>

              {/* Persona 2: Driver */}
              <button
                onClick={() => {
                  switchRole('driver');
                  setAuthModalOpen(false);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  currentUser.role === 'driver'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Sunil Pawar (सुनील पवार)</span>
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                      Driver Role
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">
                    Mahindra Bolero Maxi Truck (MH-18-BZ-4921) · Capacity 1,500 kg
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    Surat - Dhule Return Route Specialist
                  </div>
                </div>
              </button>

              {/* Persona 3: Admin */}
              <button
                onClick={() => {
                  switchRole('admin');
                  setAuthModalOpen(false);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  currentUser.role === 'admin'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-neutral-200 hover:border-emerald-300 hover:bg-neutral-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">CropCargo Operations Desk</span>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                      Admin Role
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-600 mt-0.5">
                    Master Console · KYC Document Queue · Listing Moderation · Metrics
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Select User Type / भूमिका निवडा
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('farmer')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedRole === 'farmer'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                        : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    🌾 Farmer / Load Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('driver')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                      selectedRole === 'driver'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                        : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    🚛 Driver / Transporter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anand Koli"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Mobile Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98234 56789"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Village / Town / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Shirpur or Nardana"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    District
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Dhule">Dhule (धुळे)</option>
                    <option value="Jalgaon">Jalgaon (जळगाव)</option>
                    <option value="Nashik">Nashik (नाशिक)</option>
                    <option value="Surat">Surat (सूरत)</option>
                    <option value="Nandurbar">Nandurbar (नंदुरबार)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {selectedRole === 'driver' && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                  <div className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
                    Driver & Vehicle Specifications
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Vehicle Type
                      </label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value as VehicleCategory)}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                      >
                        {VEHICLE_TYPES.map(vt => (
                          <option key={vt.type} value={vt.type}>
                            {vt.name} ({vt.capacityDesc})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                        Vehicle Number (RTO)
                      </label>
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        placeholder="MH-18-XX-XXXX"
                        className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Driving License Number
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="MH18 2020XXXXXXX"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Complete Registration & Open Dashboard
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
