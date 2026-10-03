import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CargoLoad, VehicleCategory } from '../../types';
import { 
  PlusCircle, 
  Truck, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar, 
  Weight, 
  IndianRupee, 
  AlertCircle,
  Eye,
  Check,
  X,
  Phone,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { REGIONAL_CITIES, VEHICLE_TYPES, CARGO_CATEGORIES } from '../../data/mockData';

export const FarmerDashboard: React.FC = () => {
  const { 
    lang, 
    currentUser, 
    loads, 
    bookings, 
    users, 
    postNewLoad, 
    cancelLoad, 
    deleteLoad, 
    acceptBid, 
    setActiveTrackingId, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'my_loads' | 'post_load' | 'drivers_directory' | 'bookings'>('my_loads');

  // Post load form state
  const [title, setTitle] = useState('');
  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState<any>('vegetables');
  const [weightKg, setWeightKg] = useState<number>(1200);
  const [quantityUnits, setQuantityUnits] = useState('30 Bags (40kg)');
  const [pickupCity, setPickupCity] = useState(currentUser.city || 'Shirpur');
  const [pickupDistrict, setPickupDistrict] = useState(currentUser.district || 'Dhule');
  const [pickupLandmark, setPickupLandmark] = useState('Near Village Panchayat / APMC Gate 2');
  const [pickupDate, setPickupDate] = useState('2026-10-04');
  const [destinationCity, setDestinationCity] = useState('Surat');
  const [destinationDistrict, setDestinationDistrict] = useState('Surat');
  const [destinationMandi, setDestinationMandi] = useState('Sardar Patel APMC Vegetable Market');
  const [distanceKm, setDistanceKm] = useState<number>(220);
  const [preferredVehicle, setPreferredVehicle] = useState<VehicleCategory>('pickup');
  const [offeredPrice, setOfferedPrice] = useState<number>(7500);
  const [loadingAssistance, setLoadingAssistance] = useState(true);
  const [tarpaulinCoverRequired, setTarpaulinCoverRequired] = useState(true);
  const [notes, setNotes] = useState('Morning 6 AM delivery gate arrival preferred.');

  // Drivers directory filter
  const [driverCityFilter, setDriverCityFilter] = useState('all');
  const [driverVehicleFilter, setDriverVehicleFilter] = useState('all');

  // Filter farmer's own loads or all demo loads posted
  const farmerLoads = loads;
  const farmerBookings = bookings;

  // Auto calculate recommended price based on km & vehicle
  const handleDistanceChange = (km: number) => {
    setDistanceKm(km);
    const vehicleRate = VEHICLE_TYPES.find(v => v.type === preferredVehicle)?.avgRatePerKm || 34;
    setOfferedPrice(Math.round(km * vehicleRate));
  };

  const handleVehicleChange = (vType: VehicleCategory) => {
    setPreferredVehicle(vType);
    const vehicleRate = VEHICLE_TYPES.find(v => v.type === vType)?.avgRatePerKm || 34;
    setOfferedPrice(Math.round(distanceKm * vehicleRate));
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !cropName.trim() || !pickupCity.trim() || !destinationCity.trim()) {
      addToast({
        type: 'warning',
        title: 'Incomplete Details',
        message: 'Please fill in cargo title, crop name, and route details.',
      });
      return;
    }

    postNewLoad({
      title,
      cropName,
      category,
      weightKg,
      quantityUnits,
      pickupCity,
      pickupDistrict,
      pickupLandmark,
      pickupDate,
      destinationCity,
      destinationDistrict,
      destinationMandi,
      distanceKm,
      preferredVehicle,
      offeredPrice,
      loadingAssistance,
      tarpaulinCoverRequired,
      notes,
    });

    // Reset and switch tab
    setTitle('');
    setActiveTabLocal('my_loads');
  };

  // Filtered drivers
  const driversList = users.filter(u => u.role === 'driver');
  const filteredDrivers = driversList.filter(d => {
    if (driverCityFilter !== 'all' && d.city.toLowerCase() !== driverCityFilter.toLowerCase()) return false;
    if (driverVehicleFilter !== 'all' && d.driverDetails?.vehicleType !== driverVehicleFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Profile Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span className="font-semibold text-emerald-800 uppercase tracking-wide">Farmer / Consignor Desk</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.city}, {currentUser.district}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-display">
            {currentUser.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Registered: {currentUser.farmerDetails?.farmType || 'Agricultural Producer'} · Contact: <span className="font-mono">{currentUser.phone}</span>
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center min-w-[90px]">
            <span className="text-[10px] text-neutral-500 uppercase block">Active Loads</span>
            <span className="text-base font-bold text-neutral-900 font-mono">
              {farmerLoads.filter(l => l.status === 'open' || l.status === 'bidding').length}
            </span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-center min-w-[90px]">
            <span className="text-[10px] text-neutral-500 uppercase block">In Transit</span>
            <span className="text-base font-bold text-emerald-700 font-mono">
              {farmerBookings.filter(b => b.currentStage === 3).length}
            </span>
          </div>
          <button
            onClick={() => setActiveTabLocal('post_load')}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Cargo Load</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-neutral-200 mb-6 space-x-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTabLocal('my_loads')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'my_loads'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          My Cargo Listings ({farmerLoads.length})
        </button>
        <button
          onClick={() => setActiveTabLocal('post_load')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'post_load'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          + Post New Load
        </button>
        <button
          onClick={() => setActiveTabLocal('drivers_directory')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'drivers_directory'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Available Verified Drivers ({filteredDrivers.length})
        </button>
        <button
          onClick={() => setActiveTabLocal('bookings')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === 'bookings'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Active Bookings & Deliveries ({farmerBookings.length})
        </button>
      </div>

      {/* Tab 1: My Loads */}
      {activeTab === 'my_loads' && (
        <div className="space-y-4">
          {farmerLoads.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200">
              <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-neutral-800">No active cargo listings yet</div>
              <div className="text-xs text-neutral-500 mt-1 mb-4">Post your first agricultural crop or produce load for local drivers.</div>
              <button
                onClick={() => setActiveTabLocal('post_load')}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl"
              >
                Post a Load Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {farmerLoads.map((load) => (
                <div key={load.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono text-neutral-400 font-semibold">#{load.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        load.status === 'open' ? 'bg-emerald-100 text-emerald-800' :
                        load.status === 'bidding' ? 'bg-amber-100 text-amber-800' :
                        load.status === 'assigned' ? 'bg-sky-100 text-sky-800' :
                        load.status === 'in_transit' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-neutral-100 text-neutral-600'
                      }`}>
                        {load.status.replace('_', ' ')}
                      </span>
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
                        <span>Offered Rate:</span>
                        <strong className="text-emerald-700 font-mono">₹{load.offeredPrice.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Pickup Date:</span>
                        <span className="font-mono text-neutral-700">{load.pickupDate}</span>
                      </div>
                    </div>

                    {/* Bids received section */}
                    {load.bids.length > 0 && (
                      <div className="mt-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
                        <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide mb-2 flex items-center justify-between">
                          <span>Driver Bids Received ({load.bids.length})</span>
                          <span className="text-[10px] text-emerald-700">Action Required</span>
                        </div>
                        <div className="space-y-2">
                          {load.bids.map((bid) => (
                            <div key={bid.id} className="p-2.5 bg-white rounded-lg border border-neutral-200 text-xs flex items-center justify-between gap-2">
                              <div>
                                <div className="font-bold text-neutral-900">{bid.driverName}</div>
                                <div className="text-[11px] text-neutral-500 font-mono">{bid.vehicleName} · {bid.driverPhone}</div>
                                {bid.note && <div className="text-[10px] text-neutral-600 italic mt-0.5">"{bid.note}"</div>}
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-extrabold text-emerald-800 font-mono text-sm">
                                  ₹{bid.bidAmount.toLocaleString('en-IN')}
                                </div>
                                {bid.status === 'pending' && load.status !== 'assigned' ? (
                                  <button
                                    onClick={() => acceptBid(load.id, bid.id)}
                                    className="mt-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                                  >
                                    Accept Bid
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-bold text-neutral-500 uppercase">{bid.status}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    {load.bookingId ? (
                      <button
                        onClick={() => {
                          setActiveTrackingId(load.bookingId!);
                          setActiveTab('tracking');
                        }}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Track Delivery #{load.bookingId}</span>
                      </button>
                    ) : (
                      <span className="text-neutral-400 text-[11px]">Awaiting assignment</span>
                    )}

                    {load.status === 'open' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => cancelLoad(load.id)}
                          className="text-neutral-500 hover:text-red-700 text-xs"
                        >
                          Cancel Listing
                        </button>
                        <button
                          onClick={() => deleteLoad(load.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Post a Load Form */}
      {activeTab === 'post_load' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 max-w-3xl mx-auto shadow-xs">
          <div className="mb-6 pb-4 border-b border-neutral-200">
            <h2 className="text-lg font-bold text-neutral-900 font-display">
              Post a New Cargo Consignment
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Broadcast your farm produce directly to verified commercial drivers across Dhule, Surat, and Nashik.
            </p>
          </div>

          <form onSubmit={handlePostSubmit} className="space-y-5 text-xs">
            {/* Cargo Title */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Cargo Title / Consignment Summary *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 40 Quintals Fresh Nashik/Dhule Red Onions"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-neutral-300 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Crop / Commodity Name *
                </label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g. Onion (कांदा), Cotton (कापूस), Wheat"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {CARGO_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Weight and quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Estimated Total Weight (kg) *
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  step={50}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-neutral-500 mt-0.5 block">
                  e.g. 1,400 kg (~1.4 Tonnes or 14 Quintals)
                </span>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Packaging / Bag Quantity Description
                </label>
                <input
                  type="text"
                  value={quantityUnits}
                  onChange={(e) => setQuantityUnits(e.target.value)}
                  placeholder="e.g. 35 Jute Bags (40kg each)"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Route specifics */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
              <div className="font-bold text-neutral-800 uppercase tracking-wide text-[11px]">
                Pickup & Delivery Locations
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Pickup Village / City *
                  </label>
                  <input
                    type="text"
                    required
                    list="post-cities"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Pickup Landmark / Farm Gate
                  </label>
                  <input
                    type="text"
                    value={pickupLandmark}
                    onChange={(e) => setPickupLandmark(e.target.value)}
                    placeholder="e.g. Near APMC Gate 2"
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Destination City / Mandi *
                  </label>
                  <input
                    type="text"
                    required
                    list="post-cities"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Target Wholesale Market / Yard
                  </label>
                  <input
                    type="text"
                    value={destinationMandi}
                    onChange={(e) => setDestinationMandi(e.target.value)}
                    placeholder="e.g. Sardar Patel APMC Sabji Mandi"
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <datalist id="post-cities">
                {REGIONAL_CITIES.map(c => <option key={c} value={c} />)}
              </datalist>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Estimated Transit Distance (km)
                  </label>
                  <input
                    type="number"
                    value={distanceKm}
                    onChange={(e) => handleDistanceChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle selection & pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Preferred Commercial Vehicle
                </label>
                <select
                  value={preferredVehicle}
                  onChange={(e) => handleVehicleChange(e.target.value as VehicleCategory)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white"
                >
                  {VEHICLE_TYPES.map(vt => (
                    <option key={vt.type} value={vt.type}>
                      {vt.name} (Payload {vt.capacityDesc})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Offered Freight Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={500}
                  step={100}
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono font-bold text-emerald-800"
                />
                <span className="text-[10px] text-neutral-500 mt-0.5 block">
                  Suggested for {distanceKm} km: ~₹{(distanceKm * 32).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Requirements & Instructions */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={loadingAssistance}
                  onChange={(e) => setLoadingAssistance(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-neutral-700">Farmer will assist in farm gate loading</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tarpaulinCoverRequired}
                  onChange={(e) => setTarpaulinCoverRequired(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-neutral-700">Waterproof Tarpaulin cover mandatory</span>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Special Handling Instructions / Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Perishable vegetables, require morning 6 AM gate arrival at Surat APMC."
                className="w-full p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Cargo Load & Broadcast to Drivers</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Drivers Directory */}
      {activeTab === 'drivers_directory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-neutral-700">Filter by City:</span>
              <select
                value={driverCityFilter}
                onChange={(e) => setDriverCityFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-neutral-300 rounded-lg bg-neutral-50"
              >
                <option value="all">All Cities</option>
                {REGIONAL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-neutral-700">Vehicle Type:</span>
              <select
                value={driverVehicleFilter}
                onChange={(e) => setDriverVehicleFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-neutral-300 rounded-lg bg-neutral-50"
              >
                <option value="all">All Types</option>
                {VEHICLE_TYPES.map(vt => <option key={vt.type} value={vt.type}>{vt.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDrivers.map((driver) => (
              <div key={driver.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {driver.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900">{driver.name}</div>
                        <div className="text-[11px] text-neutral-500">{driver.city}, {driver.district}</div>
                      </div>
                    </div>
                    {driver.isKycVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Partner
                      </span>
                    )}
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Vehicle:</span>
                      <span className="font-semibold text-neutral-800">{driver.driverDetails?.vehicleName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Reg. Plate:</span>
                      <span className="font-mono text-neutral-900 font-semibold">{driver.driverDetails?.vehicleNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Payload Capacity:</span>
                      <span className="font-mono text-emerald-700 font-bold">{driver.driverDetails?.capacityKg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Experience:</span>
                      <span>{driver.driverDetails?.experienceYears} Years ({driver.driverDetails?.tripsCompleted} Trips)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-600">{driver.phone}</span>
                  <button
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: 'Direct Call Simulated',
                        message: `Connecting directly to driver ${driver.name} at ${driver.phone}...`,
                      });
                    }}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Driver</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Active Bookings */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {farmerBookings.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-neutral-600">Booking #{b.id}</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Stage {b.currentStage} of 4: {b.statusText}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900">{b.cargoTitle}</h3>
                <div className="text-xs text-neutral-500 mt-1">
                  {b.pickupCity} ➔ {b.dropCity} · Driver: <strong>{b.driverName}</strong> ({b.vehicleName} - {b.vehicleNumber})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-neutral-900 font-mono">
                    ₹{b.agreedPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-neutral-400">{b.estimatedArrival}</div>
                </div>
                <button
                  onClick={() => {
                    setActiveTrackingId(b.id);
                    setActiveTab('tracking');
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Tracking</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
