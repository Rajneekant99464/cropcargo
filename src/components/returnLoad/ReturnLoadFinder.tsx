import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CargoLoad } from '../../types';
import { 
  Repeat, 
  MapPin, 
  Calendar, 
  Truck, 
  ArrowRight, 
  ShieldCheck, 
  IndianRupee, 
  Sparkles, 
  Info, 
  AlertCircle,
  CheckCircle2,
  Send,
  Plus
} from 'lucide-react';
import { REGIONAL_CITIES, VEHICLE_TYPES } from '../../data/mockData';

export const ReturnLoadFinder: React.FC = () => {
  const { 
    lang, 
    t, 
    loads, 
    currentUser, 
    role, 
    switchRole, 
    returnSearchQuery, 
    setReturnSearchQuery, 
    acceptLoadDirectly, 
    submitBid,
    setActiveTrackingId, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [fromCity, setFromCity] = useState(returnSearchQuery.fromCity || 'Surat');
  const [returnToCity, setReturnToCity] = useState(returnSearchQuery.returnToCity || 'Dhule');
  const [date, setDate] = useState(returnSearchQuery.date || '2026-10-05');
  const [vehicleType, setVehicleType] = useState<string>(returnSearchQuery.vehicleType || 'pickup');
  const [emptyVehiclePosted, setEmptyVehiclePosted] = useState(false);

  // Driver details
  const driverCapacity = currentUser.driverDetails?.capacityKg || 1500;
  const driverVehicleName = currentUser.driverDetails?.vehicleName || 'Mahindra Bolero Maxi Truck';

  // Matching return loads
  const returnMatches = useMemo(() => {
    return loads.filter(load => {
      // Must be open or bidding
      if (load.status !== 'open' && load.status !== 'bidding') return false;

      // Pickup must be in delivery city
      const matchPickup = load.pickupCity.toLowerCase().includes(fromCity.toLowerCase());
      // Destination must be in return/home city
      const matchDrop = load.destinationCity.toLowerCase().includes(returnToCity.toLowerCase());

      return matchPickup && matchDrop;
    });
  }, [loads, fromCity, returnToCity]);

  // Handle direct return load acceptance
  const handleAcceptReturn = (load: CargoLoad) => {
    if (role !== 'driver') {
      switchRole('driver');
    }

    if (load.weightKg > driverCapacity) {
      addToast({
        type: 'error',
        title: 'Safety Exceeded',
        message: `Cargo weight (${load.weightKg} kg) exceeds your vehicle's safe payload (${driverCapacity} kg).`,
      });
      return;
    }

    const booking = acceptLoadDirectly(load.id, currentUser);
    if (booking) {
      setActiveTrackingId(booking.id);
      setActiveTab('tracking');
    }
  };

  const handlePostEmptyReturnAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setEmptyVehiclePosted(true);
    addToast({
      type: 'success',
      title: 'Empty Vehicle Schedule Broadcasted',
      message: `Your return trip from ${fromCity} to ${returnToCity} on ${date} has been broadcasted to all registered agro traders in ${fromCity}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Core Mission Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Repeat className="w-3.5 h-3.5" />
            <span>Job 1 + Job 2 Return Load Matching Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            {lang === 'hi' 
              ? 'वापसीचा रिटर्न लोड शोधा (जॉब 2)' 
              : 'Find Return Cargo: Zero Deadheading'}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {lang === 'hi'
              ? 'सूरत किंवा नाशिकला शेतमाल खाली केल्यानंतर रिकाम्या गाडीने परत येऊ नका. आपल्या घराच्या दिशेने जाणारा औद्योगिक, पॅकेजिंग किंवा कृषी साहित्य लोड मिळवा.'
              : 'Delivered agricultural produce to Surat, Nashik or Mumbai? Never drive your commercial vehicle home empty. Match backhaul consignments directly heading back to your home district.'}
          </p>

          <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Works for outside trips too
            </span>
            <span aria-hidden="true">·</span>
            <span>No upfront broker cuts</span>
            <span aria-hidden="true">·</span>
            <span>Direct consignor phone connect</span>
          </div>
        </div>
      </div>

      {/* Search Console */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-xs mb-8">
        <h2 className="text-sm font-bold text-neutral-900 mb-4 font-display flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'hi' ? 'रिटर्न लोड शोध मापदंड' : 'Specify Your Return Corridor'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Current / Delivery Location (Drop of Job 1) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Current / Delivery City (Where truck empties) *
            </label>
            <input
              type="text"
              list="return-city-from"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              placeholder="e.g. Surat or Nashik"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            />
            <datalist id="return-city-from">
              {REGIONAL_CITIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          {/* Return Destination (Home base of driver) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Return Destination / Home Base *
            </label>
            <input
              type="text"
              list="return-city-to"
              value={returnToCity}
              onChange={(e) => setReturnToCity(e.target.value)}
              placeholder="e.g. Dhule or Shirpur"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            />
            <datalist id="return-city-to">
              {REGIONAL_CITIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          {/* Pickup Date */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Return Pickup Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium font-mono"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Your Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              {VEHICLE_TYPES.map(vt => (
                <option key={vt.type} value={vt.type}>{vt.name} ({vt.capacityDesc})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Corridor Buttons */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 font-semibold">Popular Return Lanes:</span>
          <button
            onClick={() => {
              setFromCity('Surat');
              setReturnToCity('Dhule');
            }}
            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-800 transition-colors font-medium"
          >
            Surat ➔ Dhule (Textile / Agro Plastics)
          </button>
          <button
            onClick={() => {
              setFromCity('Surat');
              setReturnToCity('Shirpur');
            }}
            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-800 transition-colors font-medium"
          >
            Surat ➔ Shirpur (Drip Pipes / Equipment)
          </button>
          <button
            onClick={() => {
              setFromCity('Nashik');
              setReturnToCity('Jalgaon');
            }}
            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-800 transition-colors font-medium"
          >
            Nashik ➔ Jalgaon (Fertilizer Bags)
          </button>
        </div>
      </div>

      {/* Mandatory Availability Disclaimer as per prompt */}
      <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Operational Notice: </span>
          Return load availability depends on active consignor listings submitted in that region. CropCargo does not guarantee return availability for every scheduled trip, but actively broadcasts your return availability to registered agro and industrial consignors.
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-6">
        <div>
          <h2 className="text-base font-bold text-neutral-900 font-display">
            Available Return Loads on {fromCity} ➔ {returnToCity}
          </h2>
          <div className="text-xs text-neutral-500">
            Route Compatibility: <span className="text-emerald-700 font-bold font-mono">98% Direct Corridor</span> · Zero Detour
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-lg">
          {returnMatches.length} Matches Found
        </span>
      </div>

      {/* Matches Grid */}
      {returnMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {returnMatches.map((load) => (
            <div
              key={load.id}
              className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-neutral-500 text-[11px] font-semibold">
                    #{load.id}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                    Direct Return Backhaul
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  {load.title}
                </h3>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Pickup Yard:</span>
                    <span className="font-semibold text-neutral-900">{load.pickupLandmark}, {load.pickupCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Destination:</span>
                    <span className="font-semibold text-neutral-900">{load.destinationMandi}, {load.destinationCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Weight & Volume:</span>
                    <span className="font-bold text-neutral-900 font-mono">{load.weightKg} kg ({load.quantityUnits})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Consignor / Contact:</span>
                    <span className="text-neutral-800">{load.postedBy.name} ({load.postedBy.phone})</span>
                  </div>
                </div>

                {load.notes && (
                  <p className="text-xs text-neutral-600 mb-4 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                    <strong className="text-amber-900">Consignor Note: </strong>
                    {load.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 mb-4">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Offered Backhaul Pay</span>
                    <span className="text-xl font-extrabold text-emerald-800 font-mono">
                      ₹{load.offeredPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-emerald-700 font-semibold block">92% Net Margin</span>
                    <span className="text-[11px] text-neutral-400">Zero extra deadhead diesel</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                <button
                  onClick={() => handleAcceptReturn(load)}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Return Load (₹{load.offeredPrice.toLocaleString('en-IN')})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State with Fallback Form as requested */
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <Repeat className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1 font-display">
            {t.emptyStateReturn}
          </h3>
          <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
            There are currently no active cargo listings from {fromCity} back to {returnToCity} on {date}. Don't worry! You can broadcast an <strong>"Empty Return Vehicle Alert"</strong> so local traders in {fromCity} can book your truck immediately.
          </p>

          {!emptyVehiclePosted ? (
            <form onSubmit={handlePostEmptyReturnAlert} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left space-y-3">
              <div className="text-xs font-bold text-neutral-800">
                Post Return Availability Alert for {fromCity}:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-neutral-500 block mb-1">Driver Name & Phone</label>
                  <input
                    type="text"
                    disabled
                    value={`${currentUser.name} (${currentUser.phone})`}
                    className="w-full p-2 bg-neutral-200/60 rounded-lg text-neutral-700 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 block mb-1">Available Payload Space</label>
                  <input
                    type="text"
                    disabled
                    value={`${driverCapacity} kg payload · ${driverVehicleName}`}
                    className="w-full p-2 bg-neutral-200/60 rounded-lg text-neutral-700 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Broadcast Return Vehicle Alert to {fromCity} Consignors</span>
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="font-bold">Return Alert Active!</div>
              <div className="text-[11px] mt-0.5">Traders in {fromCity} will contact you at {currentUser.phone}.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
