import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CargoLoad, VehicleCategory } from '../../types';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Tag, 
  Truck, 
  Weight, 
  IndianRupee, 
  ArrowRight, 
  Repeat, 
  ShieldCheck, 
  AlertTriangle,
  Send,
  X,
  PlusCircle,
  Filter
} from 'lucide-react';
import { REGIONAL_CITIES, CARGO_CATEGORIES, VEHICLE_TYPES } from '../../data/mockData';

export const FindLoadsPage: React.FC = () => {
  const { 
    lang, 
    t, 
    loads, 
    currentUser, 
    role, 
    switchRole, 
    searchFilters, 
    setSearchFilters, 
    submitBid, 
    acceptLoadDirectly, 
    setActiveTrackingId, 
    setActiveTab, 
    addToast 
  } = useApp();

  // Local filter states initialized with global search
  const [pickup, setPickup] = useState(searchFilters.pickup || '');
  const [destination, setDestination] = useState(searchFilters.destination || '');
  const [category, setCategory] = useState(searchFilters.category || 'all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [onlyReturnLoads, setOnlyReturnLoads] = useState<boolean>(false);

  // Modal states
  const [selectedLoad, setSelectedLoad] = useState<CargoLoad | null>(null);
  const [bidModalLoad, setBidModalLoad] = useState<CargoLoad | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidNote, setBidNote] = useState<string>('');

  // Driver vehicle capacity
  const driverCapacity = currentUser.driverDetails?.capacityKg || 1500;
  const driverVehicleName = currentUser.driverDetails?.vehicleName || 'Mahindra Bolero Maxi Truck';
  const driverVehicleType = currentUser.driverDetails?.vehicleType || 'pickup';

  // Filtered loads
  const filteredLoads = useMemo(() => {
    return loads.filter((load) => {
      // Check status: only show open or bidding
      if (load.status !== 'open' && load.status !== 'bidding') return false;

      if (pickup && !load.pickupCity.toLowerCase().includes(pickup.toLowerCase())) {
        return false;
      }
      if (destination && !load.destinationCity.toLowerCase().includes(destination.toLowerCase())) {
        return false;
      }
      if (category !== 'all' && load.category !== category) {
        return false;
      }
      if (vehicleFilter !== 'all' && load.preferredVehicle !== vehicleFilter) {
        return false;
      }
      if (onlyReturnLoads && !load.isReturnLoadOpportunity) {
        return false;
      }
      return true;
    });
  }, [loads, pickup, destination, category, vehicleFilter, onlyReturnLoads]);

  const handleOpenBid = (load: CargoLoad) => {
    if (role !== 'driver') {
      switchRole('driver');
    }
    setBidModalLoad(load);
    setBidAmount(load.offeredPrice);
    setBidNote('Can load on scheduled time. Vehicle sanitized with waterproof tarpaulin.');
  };

  const handleSendBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidModalLoad) return;

    if (bidAmount <= 0) {
      addToast({ type: 'warning', title: 'Invalid Bid', message: 'Bid amount must be greater than zero.' });
      return;
    }

    submitBid(bidModalLoad.id, {
      driverId: currentUser.id,
      driverName: currentUser.name,
      driverPhone: currentUser.phone,
      vehicleName: driverVehicleName,
      vehicleNumber: currentUser.driverDetails?.vehicleNumber || 'MH-18-BZ-4921',
      vehicleType: driverVehicleType,
      bidAmount,
      note: bidNote,
    });

    setBidModalLoad(null);
  };

  const handleDirectAccept = (load: CargoLoad) => {
    if (role !== 'driver') {
      switchRole('driver');
    }

    // Capacity Guard Check
    if (load.weightKg > driverCapacity) {
      addToast({
        type: 'error',
        title: 'Capacity Overload Alert',
        message: `This consignment (${load.weightKg} kg) exceeds your vehicle's registered payload capacity (${driverCapacity} kg). Acceptance blocked for safety.`,
      });
      return;
    }

    const booking = acceptLoadDirectly(load.id, currentUser);
    if (booking) {
      setActiveTrackingId(booking.id);
      setActiveTab('tracking');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">
            <span>{lang === 'hi' ? 'थेट बाजार लोड सूची' : 'Real-time Cargo Exchange'}</span>
            <span className="text-neutral-400" aria-hidden="true">·</span>
            <span className="text-neutral-500 font-mono">{filteredLoads.length} Active Listings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display mt-1">
            {lang === 'hi' ? 'उपलब्ध शेतमाल व कार्गो लोड' : 'Available Cargo & Produce Loads'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {lang === 'hi' 
              ? 'महाराष्ट्र व गुजरात कॉरिडॉरमधील शेतकऱ्यांचे थेट माल लोड शोधा आणि योग्य दर मिळवा.' 
              : 'Direct consignment listings from farmers and agro businesses across North Maharashtra & Gujarat.'}
          </p>
        </div>

        <button
          onClick={() => {
            if (role !== 'farmer') switchRole('farmer');
            setActiveTab('farmer-dash');
          }}
          className="self-start sm:self-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'hi' ? 'नवीन लोड पोस्ट करा' : 'Post New Load as Farmer'}</span>
        </button>
      </div>

      {/* Driver Capacity Guard Banner */}
      {role === 'driver' && (
        <div className="my-5 p-3.5 bg-sky-50 border border-sky-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-sky-700 shrink-0" />
            <div>
              <span className="font-bold text-sky-950">Active Vehicle Profile: </span>
              <span className="text-sky-900">{driverVehicleName} ({currentUser.driverDetails?.vehicleNumber})</span>
              <span className="text-sky-600 ml-1">· Max Safe Payload: <strong className="font-mono">{driverCapacity} kg</strong></span>
            </div>
          </div>
          <div className="text-[11px] text-sky-800 font-medium">
            🛡️ Capacity Guard active: overload consignments are flagged.
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 my-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Pickup Filter */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Pickup Village / City
            </label>
            <div className="relative">
              <input
                type="text"
                list="loads-city-filter-pickup"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="All Pickups (e.g. Shirpur)"
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <datalist id="loads-city-filter-pickup">
                {REGIONAL_CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {/* Destination Filter */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Destination / Mandi
            </label>
            <div className="relative">
              <input
                type="text"
                list="loads-city-filter-dest"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="All Drops (e.g. Surat)"
                className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <datalist id="loads-city-filter-dest">
                {REGIONAL_CITIES.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Crop / Goods Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {CARGO_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Vehicle Type
            </label>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Vehicles / सर्व वाहने</option>
              {VEHICLE_TYPES.map(vt => (
                <option key={vt.type} value={vt.type}>{vt.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick segmented toggles */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
            <input
              type="checkbox"
              checked={onlyReturnLoads}
              onChange={(e) => setOnlyReturnLoads(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
            />
            <span className="flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'hi' ? 'फक्त रिटर्न लोड दाखवा (Job 2)' : 'Show Only Return Loads (Job 2 Backhaul)'}</span>
            </span>
          </label>

          {(pickup || destination || category !== 'all' || vehicleFilter !== 'all' || onlyReturnLoads) && (
            <button
              onClick={() => {
                setPickup('');
                setDestination('');
                setCategory('all');
                setVehicleFilter('all');
                setOnlyReturnLoads(false);
                setSearchFilters({ pickup: '', destination: '', category: 'all', date: '' });
              }}
              className="text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Load Listings Grid */}
      {filteredLoads.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-200">
          <Truck className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-900">
            {t.emptyStateLoads}
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-6">
            Try adjusting your pickup/destination filters, or post a new cargo requirement to broadcast to drivers.
          </p>
          <button
            onClick={() => {
              setPickup('');
              setDestination('');
              setCategory('all');
              setOnlyReturnLoads(false);
            }}
            className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
          >
            Clear All Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLoads.map((load) => {
            const isOverCapacity = role === 'driver' && load.weightKg > driverCapacity;
            const isAssigned = load.status === 'assigned';

            return (
              <div
                key={load.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between hover:shadow-md ${
                  load.isReturnLoadOpportunity 
                    ? 'border-amber-300/80 ring-1 ring-amber-400/20' 
                    : 'border-neutral-200'
                }`}
              >
                <div className="p-5">
                  {/* Header Row: ID, Return Tag, Category */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-neutral-500 text-[11px] font-semibold">
                      #{load.id}
                    </span>
                    <div className="flex items-center gap-2">
                      {load.isReturnLoadOpportunity && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Repeat className="w-3 h-3 text-amber-700" />
                          Return Load (Job 2)
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-500 capitalize">
                        {load.category}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2 mb-3">
                    {lang === 'hi' && load.hindiTitle ? load.hindiTitle : load.title}
                  </h3>

                  {/* Corridor Route Block */}
                  <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 mb-4 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-neutral-900">
                          {load.pickupCity}, {load.pickupDistrict}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[220px]">
                          {load.pickupLandmark}
                        </div>
                      </div>
                    </div>

                    <div className="border-l-2 border-dashed border-neutral-300 ml-1 h-3" />

                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-neutral-900">
                          {load.destinationCity}, {load.destinationDistrict}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate max-w-[220px]">
                          {load.destinationMandi}
                        </div>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Est. Distance: <strong className="text-neutral-700 font-mono">{load.distanceKm} km</strong></span>
                      <span>Pickup: <strong className="text-neutral-700 font-mono">{load.pickupDate}</strong></span>
                    </div>
                  </div>

                  {/* Weight & Vehicle details */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                      <span className="text-[10px] text-neutral-500 block uppercase">Weight / Qty</span>
                      <span className="font-bold text-neutral-900 font-mono">
                        {load.weightKg.toLocaleString('en-IN')} kg
                      </span>
                      <span className="text-[10px] text-neutral-500 block truncate">{load.quantityUnits}</span>
                    </div>

                    <div className="p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                      <span className="text-[10px] text-neutral-500 block uppercase">Required Vehicle</span>
                      <span className="font-semibold text-neutral-800 capitalize truncate block">
                        {load.preferredVehicle.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">
                        {load.tarpaulinCoverRequired ? 'Tarpaulin Cover' : 'Open Bed'}
                      </span>
                    </div>
                  </div>

                  {/* Overcapacity Warning */}
                  {isOverCapacity && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-800 flex items-center gap-1.5 mb-3">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Exceeds your {driverCapacity} kg vehicle payload.</span>
                    </div>
                  )}

                  {/* Pricing Block */}
                  <div className="flex items-end justify-between pt-2 border-t border-neutral-100">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase block">Offered Freight</span>
                      <div className="text-lg font-extrabold text-emerald-800 font-mono tabular-nums">
                        ₹{load.offeredPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-neutral-400">
                      <span>Bids: </span>
                      <span className="font-bold text-neutral-700 font-mono">{load.bids.length}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-neutral-50/70 border-t border-neutral-100 rounded-b-2xl flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLoad(load)}
                    className="flex-1 py-2 text-center text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-white hover:bg-neutral-100 rounded-xl border border-neutral-300 transition-colors cursor-pointer"
                  >
                    {t.viewDetails}
                  </button>

                  <button
                    onClick={() => handleOpenBid(load)}
                    className="flex-1 py-2 text-center text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300 transition-colors cursor-pointer"
                  >
                    {t.sendOffer}
                  </button>

                  <button
                    disabled={isOverCapacity || isAssigned}
                    onClick={() => handleDirectAccept(load)}
                    className={`px-3 py-2 text-center text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      isOverCapacity || isAssigned
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                    title={isOverCapacity ? 'Over capacity' : 'Accept at offered rate'}
                  >
                    {lang === 'hi' ? 'स्वीकारा' : 'Accept'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load Details Modal */}
      {selectedLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-neutral-500 font-semibold">#{selectedLoad.id}</span>
                <h3 className="text-base font-bold text-neutral-900 font-display">
                  {selectedLoad.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLoad(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[11px]">Commodity / Crop:</span>
                  <span className="font-bold text-neutral-900 text-sm">{selectedLoad.cropName}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <span className="text-neutral-500 block text-[11px]">Total Net Weight:</span>
                  <span className="font-bold text-neutral-900 text-sm font-mono">{selectedLoad.weightKg} kg</span>
                  <span className="text-[11px] text-neutral-500 block">({selectedLoad.quantityUnits})</span>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wide">
                  Transit Itinerary
                </div>
                <div className="flex justify-between pb-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Pickup Address:</span>
                  <span className="font-semibold text-neutral-900 text-right">{selectedLoad.pickupLandmark}, {selectedLoad.pickupCity}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Destination Mandi:</span>
                  <span className="font-semibold text-neutral-900 text-right">{selectedLoad.destinationMandi}, {selectedLoad.destinationCity}</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-neutral-200/60">
                  <span className="text-neutral-500">Scheduled Date:</span>
                  <span className="font-mono font-semibold text-neutral-900">{selectedLoad.pickupDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Distance & Highway:</span>
                  <span className="font-mono font-semibold text-neutral-900">{selectedLoad.distanceKm} km (Via NH-53 / NH-52)</span>
                </div>
              </div>

              {selectedLoad.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="font-semibold text-amber-900 text-[11px] mb-1">
                    Special Instructions from Farmer:
                  </div>
                  <div className="text-amber-950 leading-relaxed">
                    {selectedLoad.notes}
                  </div>
                </div>
              )}

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 text-[11px] block">Offered Freight</span>
                  <span className="text-xl font-bold text-emerald-900 font-mono">
                    ₹{selectedLoad.offeredPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 text-[11px] block">Benchmark Mandi Rate:</span>
                  <span className="font-mono text-neutral-700">₹{selectedLoad.recommendedPrice}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    const l = selectedLoad;
                    setSelectedLoad(null);
                    handleOpenBid(l);
                  }}
                  className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-xl border border-emerald-300 transition-colors"
                >
                  Send Counter Bid
                </button>
                <button
                  onClick={() => {
                    const l = selectedLoad;
                    setSelectedLoad(null);
                    handleDirectAccept(l);
                  }}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Accept at ₹{selectedLoad.offeredPrice.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bid / Price Offer Modal */}
      {bidModalLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-neutral-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 font-display">
                  {lang === 'hi' ? 'भाव / काउंटर बोली पाठवा' : 'Submit Commercial Freight Bid'}
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Consignment #{bidModalLoad.id} · {bidModalLoad.pickupCity} ➔ {bidModalLoad.destinationCity}
                </p>
              </div>
              <button
                onClick={() => setBidModalLoad(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBidSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex justify-between text-neutral-600 mb-1">
                  <span>Farmer's Offered Budget:</span>
                  <span className="font-bold text-neutral-900 font-mono">
                    ₹{bidModalLoad.offeredPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Total Distance:</span>
                  <span className="font-mono">{bidModalLoad.distanceKm} km</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Your Proposed Freight Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-bold font-mono">₹</span>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={100}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm font-mono font-bold border border-neutral-300 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Includes loading inspection and highway tolls.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Driver Note / Availability
                </label>
                <textarea
                  rows={3}
                  value={bidNote}
                  onChange={(e) => setBidNote(e.target.value)}
                  placeholder="e.g. Can load at 7 PM today with tarpaulin and ropes."
                  className="w-full p-2.5 border border-neutral-300 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setBidModalLoad(null)}
                  className="w-1/3 py-2.5 text-neutral-700 font-semibold bg-neutral-100 hover:bg-neutral-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 text-white font-semibold bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Offer to Farmer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
