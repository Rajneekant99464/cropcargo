import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CargoLoad, VehicleCategory } from '../../types';
import { 
  Truck, 
  IndianRupee, 
  Repeat, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Weight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Upload, 
  Eye, 
  Phone,
  Power,
  TrendingUp,
  Fuel,
  Info
} from 'lucide-react';
import { VEHICLE_TYPES, REGIONAL_CITIES } from '../../data/mockData';

export const DriverDashboard: React.FC = () => {
  const { 
    lang, 
    currentUser, 
    loads, 
    bookings, 
    toggleDriverAvailability, 
    submitKycDocument, 
    acceptLoadDirectly, 
    submitBid, 
    advanceBookingStage, 
    setActiveTrackingId, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'available_loads' | 'my_trips' | 'return_matches' | 'earnings' | 'kyc_docs'>('available_loads');

  // Load search filters for driver
  const [pickupFilter, setPickupFilter] = useState('');
  const [dropFilter, setDropFilter] = useState('');

  // KYC upload mock form
  const [docType, setDocType] = useState<'driving_license' | 'rc_book' | 'aadhaar' | 'fitness_certificate'>('driving_license');
  const [docNumber, setDocNumber] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Driver vehicle specs
  const details = currentUser.driverDetails || {
    vehicleName: 'Mahindra Bolero Maxi Truck',
    vehicleNumber: 'MH-18-BZ-4921',
    vehicleType: 'pickup' as VehicleCategory,
    capacityKg: 1500,
    isAvailable: true,
    currentCity: 'Dhule',
    experienceYears: 8,
    rating: 4.8,
    tripsCompleted: 142,
    licenseNumber: 'MH18 20170014291',
    rcNumber: 'MH18BZ4921',
    aadhaarNumber: 'XXXX-XXXX-6712',
    kycStatus: 'verified' as const,
    demoEarnings: {
      totalGross: 248500,
      thisMonth: 38400,
      returnLoadsBonus: 64200,
    }
  };

  // Driver trips
  const driverBookings = bookings.filter(b => b.driverId === currentUser.id || b.driverPhone === currentUser.phone);
  const activeTrip = driverBookings.find(b => b.currentStage < 4);

  // Return load suggestions based on active or upcoming trip destination
  const activeDropCity = activeTrip ? activeTrip.dropCity : 'Surat';
  const returnLoads = loads.filter(l => 
    (l.status === 'open' || l.status === 'bidding') && 
    l.pickupCity.toLowerCase().includes(activeDropCity.toLowerCase())
  );

  // Filtered available loads
  const availableLoads = loads.filter(l => {
    if (l.status !== 'open' && l.status !== 'bidding') return false;
    if (pickupFilter && !l.pickupCity.toLowerCase().includes(pickupFilter.toLowerCase())) return false;
    if (dropFilter && !l.destinationCity.toLowerCase().includes(dropFilter.toLowerCase())) return false;
    return true;
  });

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) {
      addToast({ type: 'warning', title: 'Missing Number', message: 'Enter document registration number.' });
      return;
    }

    submitKycDocument({
      userId: currentUser.id,
      driverName: currentUser.name,
      phone: currentUser.phone,
      vehicleNumber: details.vehicleNumber,
      vehicleType: details.vehicleType,
      documentType: docType,
      documentNumber: docNumber,
      mockDocumentUrl: 'https://example.com/mock-kyc-doc.png',
    });

    setUploadSuccess(true);
    setDocNumber('');
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Profile & Vehicle Info Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center text-xl font-bold shrink-0">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-sky-800 uppercase tracking-wide">
                  Commercial Vehicle Partner
                </span>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                {details.kycStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    KYC Verified Partner
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Verification In Review
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-extrabold text-neutral-900 font-display">
                {currentUser.name}
              </h1>

              <div className="text-xs text-neutral-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Vehicle: <strong className="text-neutral-800">{details.vehicleName}</strong></span>
                <span>RTO: <strong className="text-neutral-900 font-mono">{details.vehicleNumber}</strong></span>
                <span>Safe Payload: <strong className="text-emerald-700 font-mono">{details.capacityKg} kg</strong></span>
              </div>
            </div>
          </div>

          {/* Right Action: Availability Toggle */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center gap-3">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Broadcast Status</span>
                <span className={`text-xs font-bold ${details.isAvailable ? 'text-emerald-700' : 'text-neutral-500'}`}>
                  {details.isAvailable ? '🟢 Available for Loads' : '⚪ Busy / On Trip'}
                </span>
              </div>
              <button
                onClick={toggleDriverAvailability}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  details.isAvailable ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
                title="Toggle Online/Offline"
              >
                <Power className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-right min-w-[120px]">
              <span className="text-[10px] text-neutral-500 uppercase block">This Month (Demo)</span>
              <span className="text-base font-extrabold text-emerald-800 font-mono">
                ₹{details.demoEarnings.thisMonth.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Trip Alert if any */}
      {activeTrip && (
        <div className="mb-8 p-5 bg-gradient-to-r from-emerald-900 to-neutral-900 text-white rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wide mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Active Trip in Progress · Booking #{activeTrip.id}</span>
            </div>
            <h3 className="text-base font-bold text-white">
              {activeTrip.cargoTitle} ({activeTrip.weightKg} kg)
            </h3>
            <div className="text-xs text-neutral-300 mt-1 flex items-center gap-2">
              <span>{activeTrip.pickupCity} ➔ {activeTrip.dropCity}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-medium">Stage {activeTrip.currentStage} of 4: {activeTrip.statusText}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => advanceBookingStage(activeTrip.id)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Advance Tracking Stage (Demo)
            </button>
            <button
              onClick={() => {
                setActiveTrackingId(activeTrip.id);
                setActiveTab('tracking');
              }}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Route</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex border-b border-neutral-200 mb-6 space-x-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTabLocal('available_loads')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'available_loads'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Available Cargo Loads ({availableLoads.length})
        </button>
        <button
          onClick={() => setActiveTabLocal('my_trips')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'my_trips'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          My Jobs & Trips ({driverBookings.length})
        </button>
        <button
          onClick={() => setActiveTabLocal('return_matches')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'return_matches'
              ? 'border-amber-500 text-amber-800'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Return Loads from {activeDropCity} ({returnLoads.length})
        </button>
        <button
          onClick={() => setActiveTabLocal('earnings')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'earnings'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Earnings & Fuel Summary
        </button>
        <button
          onClick={() => setActiveTabLocal('kyc_docs')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'kyc_docs'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          KYC Documents ({details.kycStatus.toUpperCase()})
        </button>
      </div>

      {/* Tab 1: Available Loads with Capacity Guard */}
      {activeTab === 'available_loads' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-neutral-700">Filter Pickup:</span>
              <input
                type="text"
                list="driver-pickups"
                value={pickupFilter}
                onChange={(e) => setPickupFilter(e.target.value)}
                placeholder="e.g. Shirpur or Dhule"
                className="px-2.5 py-1.5 border border-neutral-300 rounded-lg bg-neutral-50"
              />
              <datalist id="driver-pickups">
                {REGIONAL_CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div className="text-[11px] text-neutral-500">
              Capacity Guard: Showing payload match against <strong>{details.capacityKg} kg</strong> vehicle limit.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableLoads.map((load) => {
              const isOverCapacity = load.weightKg > details.capacityKg;

              return (
                <div
                  key={load.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between ${
                    isOverCapacity ? 'border-red-200 bg-red-50/10' : 'border-neutral-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono text-neutral-400 font-semibold">#{load.id}</span>
                      {isOverCapacity ? (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          Exceeds Capacity ({load.weightKg}kg &gt; {details.capacityKg}kg)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Payload Safe
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 mb-2">
                      {load.title}
                    </h3>

                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1.5 text-xs text-neutral-600 mb-3">
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <strong className="text-neutral-900">{load.pickupCity} ➔ {load.destinationCity} ({load.distanceKm} km)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <strong className="text-neutral-900 font-mono">{load.weightKg} kg ({load.quantityUnits})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Farmer:</span>
                        <span>{load.postedBy.name} ({load.postedBy.village})</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-neutral-100">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase block">Offered Pay</span>
                        <span className="text-lg font-extrabold text-emerald-800 font-mono">
                          ₹{load.offeredPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-neutral-500">
                        Pickup: <strong className="text-neutral-800">{load.pickupDate}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center gap-2 mt-3">
                    <button
                      disabled={isOverCapacity}
                      onClick={() => acceptLoadDirectly(load.id, currentUser)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isOverCapacity
                          ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                      }`}
                    >
                      {isOverCapacity ? 'Blocked (Over Capacity)' : `Accept Load (₹${load.offeredPrice.toLocaleString('en-IN')})`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: My Jobs & Trips */}
      {activeTab === 'my_trips' && (
        <div className="space-y-4">
          {driverBookings.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200">
              <Truck className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-neutral-800">No active or past trips recorded</div>
              <div className="text-xs text-neutral-500 mt-1 mb-4">Accept an available cargo load to generate your first consignment.</div>
              <button
                onClick={() => setActiveTabLocal('available_loads')}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl"
              >
                Browse Available Loads
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {driverBookings.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-neutral-700">Trip #{b.id}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        b.currentStage === 4 ? 'bg-neutral-100 text-neutral-700' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        Stage {b.currentStage} of 4: {b.statusText}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900">{b.cargoTitle}</h3>
                    <div className="text-xs text-neutral-500 mt-1">
                      {b.pickupCity} ➔ {b.dropCity} ({b.distanceKm} km) · Farmer: <strong>{b.farmerName}</strong> ({b.farmerPhone})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-neutral-900 font-mono">
                        ₹{b.agreedPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-neutral-400">Rate: ₹{Math.round(b.agreedPrice / (b.distanceKm || 1))}/km</div>
                    </div>

                    {b.currentStage < 4 && (
                      <button
                        onClick={() => advanceBookingStage(b.id)}
                        className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs"
                      >
                        Advance Stage
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTrackingId(b.id);
                        setActiveTab('tracking');
                      }}
                      className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tracking</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Return Load Matches */}
      {activeTab === 'return_matches' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <Repeat className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Next-Leg Return Opportunities: </span>
              Showing freight available from <strong>{activeDropCity}</strong> back toward North Maharashtra (Dhule, Shirpur, Jalgaon).
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {returnLoads.map((load) => (
              <div key={load.id} className="bg-white rounded-2xl border-2 border-amber-400/40 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-neutral-400 font-semibold">#{load.id}</span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Job 2 Backhaul
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 mb-2">{load.title}</h3>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Pickup:</span>
                      <strong className="text-neutral-900">{load.pickupLandmark}, {load.pickupCity}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Destination:</span>
                      <strong className="text-neutral-900">{load.destinationCity}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Weight:</span>
                      <span className="font-mono font-bold text-neutral-800">{load.weightKg} kg</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-2 border-t border-neutral-100">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase block">Extra Profit</span>
                      <span className="text-lg font-extrabold text-emerald-800 font-mono">
                        +₹{load.offeredPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-medium">Zero deadhead miles</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 mt-3">
                  <button
                    onClick={() => acceptLoadDirectly(load.id, currentUser)}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Lock Return Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Earnings Summary */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>All figures represent operational demo ledger data for presentation testing.</span>
            </div>
            <span className="font-bold text-emerald-800 text-[10px] uppercase">Prototype Ledger</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 bg-white rounded-2xl border border-neutral-200">
              <span className="text-xs text-neutral-500 uppercase block font-semibold">Total Gross Earnings</span>
              <div className="text-2xl font-extrabold text-neutral-900 font-mono mt-1">
                ₹{details.demoEarnings.totalGross.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-neutral-400 mt-1">Cumulative across 142 trips</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-neutral-200">
              <span className="text-xs text-neutral-500 uppercase block font-semibold">Current Month Freight</span>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
                ₹{details.demoEarnings.thisMonth.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-emerald-600 mt-1">On track for +18% vs last month</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-amber-200 bg-amber-50/20">
              <span className="text-xs text-amber-900 uppercase block font-semibold">Return Load Value Added</span>
              <div className="text-2xl font-extrabold text-amber-800 font-mono mt-1">
                ₹{details.demoEarnings.returnLoadsBonus.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-amber-700 mt-1">Freight captured from backhaul legs</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: KYC Documents */}
      {activeTab === 'kyc_docs' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-2xl mx-auto shadow-xs">
          <div className="mb-6 pb-4 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900 font-display">
                Driver & Vehicle KYC Verification
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Official RTO and transport compliance documentation.
              </p>
            </div>
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 uppercase">
              {details.kycStatus}
            </span>
          </div>

          {uploadSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Document successfully uploaded to Admin review queue!</span>
            </div>
          )}

          <div className="space-y-4 mb-6 text-xs">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 block">Driving License (Commercial HMV/LMV)</span>
                <span className="text-neutral-500 font-mono text-[11px]">{details.licenseNumber}</span>
              </div>
              <span className="text-emerald-700 font-bold text-[11px]">Verified ✓</span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-neutral-900 block">Vehicle RC Book (Commercial Goods Permit)</span>
                <span className="text-neutral-500 font-mono text-[11px]">{details.rcNumber}</span>
              </div>
              <span className="text-emerald-700 font-bold text-[11px]">Verified ✓</span>
            </div>
          </div>

          <form onSubmit={handleKycSubmit} className="space-y-4 pt-4 border-t border-neutral-200 text-xs">
            <div className="font-bold text-neutral-800 text-xs uppercase tracking-wide">
              Submit Additional or Renewal Certificate
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                >
                  <option value="driving_license">Driving License</option>
                  <option value="rc_book">Vehicle RC Certificate</option>
                  <option value="fitness_certificate">Vehicle Fitness Certificate</option>
                  <option value="aadhaar">Aadhaar Card (National ID)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Document Number / Code *
                </label>
                <input
                  type="text"
                  required
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. MH18-2026-XXXX"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono uppercase"
                />
              </div>
            </div>

            <div className="p-4 border-2 border-dashed border-neutral-300 rounded-xl text-center bg-neutral-50/50">
              <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
              <div className="text-xs font-semibold text-neutral-700">Attach Document Scan (Demo)</div>
              <div className="text-[10px] text-neutral-400 mt-0.5">JPEG, PNG or PDF up to 5MB</div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              Submit for Admin Verification
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
