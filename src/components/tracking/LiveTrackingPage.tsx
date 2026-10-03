import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  ShieldCheck, 
  Navigation, 
  Repeat,
  ChevronRight,
  Info
} from 'lucide-react';

export const LiveTrackingPage: React.FC = () => {
  const { 
    lang, 
    bookings, 
    activeTrackingId, 
    setActiveTrackingId, 
    advanceBookingStage 
  } = useApp();

  const [inputBookingId, setInputBookingId] = useState(activeTrackingId || 'CC-2026-8941');

  // Find booking or default to first booking
  const currentBooking = bookings.find(b => b.id.toLowerCase() === inputBookingId.trim().toLowerCase()) 
    || bookings.find(b => b.id === activeTrackingId) 
    || bookings[0];

  const handleSearchBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const found = bookings.find(b => b.id.toLowerCase() === inputBookingId.trim().toLowerCase());
    if (found) {
      setActiveTrackingId(found.id);
    }
  };

  if (!currentBooking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-neutral-900">No Booking Found</h2>
      </div>
    );
  }

  const stages = [
    { num: 1, title: 'Booking Confirmed', sub: 'Assigned to Driver' },
    { num: 2, title: 'Loaded at Farm', sub: 'Inspection & Tarpaulin' },
    { num: 3, title: 'In Transit', sub: 'Highway Corridor' },
    { num: 4, title: 'Delivered', sub: 'Mandi Sign-off' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner with Mandatory Demo Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider border border-amber-300">
              DEMO TRACKING
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              Simulated Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display mt-1">
            {lang === 'hi' ? 'लाइव्ह कन्साइनमेंट ट्रॅकिंग' : 'Consignment Route & Journey Status'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time simulated waypoints for rural cargo dispatch across state highways.
          </p>
        </div>

        {/* Quick Booking ID Search Selector */}
        <form onSubmit={handleSearchBooking} className="flex items-center gap-2">
          <input
            type="text"
            value={inputBookingId}
            onChange={(e) => setInputBookingId(e.target.value)}
            placeholder="e.g. CC-2026-8941"
            className="text-xs px-3 py-2 border border-neutral-300 rounded-xl font-mono uppercase bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {/* Booking Quick Selector Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 text-xs text-neutral-600">
        <span className="font-semibold text-neutral-800 shrink-0">Sample Active Bookings:</span>
        {bookings.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setInputBookingId(b.id);
              setActiveTrackingId(b.id);
            }}
            className={`px-3 py-1 rounded-lg border font-mono shrink-0 cursor-pointer transition-colors ${
              currentBooking.id === b.id
                ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                : 'bg-white hover:bg-neutral-100 border-neutral-300'
            }`}
          >
            #{b.id} ({b.pickupCity} ➔ {b.dropCity})
          </button>
        ))}
      </div>

      {/* Main Tracking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Map Simulation & 4-Stage Stepper */}
        <div className="lg:col-span-8 space-y-6">
          {/* Simulated Route Visualization Canvas */}
          <div className="bg-neutral-900 rounded-3xl p-6 text-white relative overflow-hidden border border-neutral-800 shadow-xl">
            {/* Ambient Highway Map Grid */}
            <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-neutral-200">
                  {currentBooking.pickupCity} ➔ {currentBooking.dropCity} Corridor (NH-53)
                </span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400">
                Speed: ~{currentBooking.currentStage === 3 ? '58 km/h' : currentBooking.currentStage === 4 ? '0 km/h (Delivered)' : 'Stationary'}
              </div>
            </div>

            {/* SVG Interactive Route Path */}
            <div className="relative py-8 px-2">
              <svg viewBox="0 0 700 140" className="w-full h-auto overflow-visible">
                {/* Background highway line */}
                <path
                  d="M 50 70 Q 200 20, 350 70 T 650 70"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Traveled highway line */}
                <path
                  d="M 50 70 Q 200 20, 350 70 T 650 70"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="700"
                  strokeDashoffset={
                    currentBooking.currentStage === 1 ? '550' :
                    currentBooking.currentStage === 2 ? '400' :
                    currentBooking.currentStage === 3 ? '180' : '0'
                  }
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Waypoint 1: Pickup */}
                <g transform="translate(50, 70)">
                  <circle r="14" fill="#047857" stroke="#ffffff" strokeWidth="3" />
                  <text y="-22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                    {currentBooking.pickupCity} (Start)
                  </text>
                  <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">
                    Mandi Gate
                  </text>
                </g>

                {/* Waypoint 2: Border / Mid checkpoint */}
                <g transform="translate(350, 70)">
                  <circle 
                    r="12" 
                    fill={currentBooking.currentStage >= 3 ? '#047857' : '#1e293b'} 
                    stroke={currentBooking.currentStage >= 3 ? '#ffffff' : '#64748b'} 
                    strokeWidth="2.5" 
                  />
                  <text y="-22" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">
                    Navapur / Songadh Border
                  </text>
                  <text y="28" textAnchor="middle" fill="#94a3b8" fontSize="10">
                    MH-GJ Toll
                  </text>
                </g>

                {/* Waypoint 3: Delivery */}
                <g transform="translate(650, 70)">
                  <circle 
                    r="14" 
                    fill={currentBooking.currentStage === 4 ? '#047857' : '#1e293b'} 
                    stroke={currentBooking.currentStage === 4 ? '#ffffff' : '#64748b'} 
                    strokeWidth="3" 
                  />
                  <text y="-22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                    {currentBooking.dropCity} (Drop)
                  </text>
                  <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">
                    Target Mandi
                  </text>
                </g>

                {/* Live Animated Truck Icon Position */}
                {currentBooking.currentStage < 4 && (
                  <g 
                    transform={
                      currentBooking.currentStage === 1 ? 'translate(65, 55)' :
                      currentBooking.currentStage === 2 ? 'translate(190, 30)' :
                      'translate(460, 55)'
                    }
                    className="transition-transform duration-700 ease-out"
                  >
                    <rect x="-18" y="-14" width="36" height="28" rx="8" fill="#fbbf24" stroke="#000" strokeWidth="1.5" />
                    <circle cx="-8" cy="14" r="4" fill="#000" />
                    <circle cx="8" cy="14" r="4" fill="#000" />
                    <text x="0" y="4" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="bold">
                      TRK
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom Telemetry Status bar */}
            <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-300">
              <div>
                <span className="text-neutral-500">Current Status: </span>
                <span className="font-bold text-white">{currentBooking.statusText}</span>
              </div>
              <div>
                <span className="text-neutral-500">Estimated Arrival: </span>
                <span className="font-mono text-emerald-400 font-bold">{currentBooking.estimatedArrival}</span>
              </div>
            </div>
          </div>

          {/* 4 Delivery Stages Stepper */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900 font-display">
                Delivery Progression (4 Stages)
              </h3>
              <button
                onClick={() => advanceBookingStage(currentBooking.id)}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Advance Stage (Demo Simulator)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {stages.map((st) => {
                const isPassed = currentBooking.currentStage >= st.num;
                const isCurrent = currentBooking.currentStage === st.num;

                return (
                  <div
                    key={st.num}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : isPassed
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-neutral-200 bg-neutral-50/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isPassed ? 'bg-emerald-700 text-white' : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {st.num}
                      </span>
                      {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="text-xs font-bold text-neutral-900">{st.title}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{st.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timestamped Checkpoints Timeline */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 font-display mb-4">
              Detailed Journey Log & Waypoint Timestamps
            </h3>

            <div className="space-y-4">
              {currentBooking.checkpoints.map((cp, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      cp.completed ? 'bg-emerald-600 text-white' : 'bg-neutral-300'
                    }`}>
                      {cp.completed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div className="flex-1 pb-3 border-b border-neutral-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-neutral-900">{cp.title}</span>
                      <span className="font-mono text-neutral-500 font-semibold">{cp.time}</span>
                    </div>
                    <div className="text-[11px] text-neutral-600 mt-0.5 font-medium">{cp.location}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{cp.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Driver, Consignment & Return Opportunity Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Driver & Vehicle Information */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-4 pb-2 border-b border-neutral-100">
              Assigned Transport Partner
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                {currentBooking.driverName[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-neutral-900">{currentBooking.driverName}</div>
                <div className="text-xs text-neutral-500 font-mono">{currentBooking.driverPhone}</div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified RTO License
                </div>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-neutral-500">Vehicle:</span>
                <span className="font-semibold text-neutral-800">{currentBooking.vehicleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Registration:</span>
                <span className="font-mono text-neutral-900 font-bold">{currentBooking.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Freight Agreed:</span>
                <span className="font-mono text-emerald-800 font-bold">₹{currentBooking.agreedPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Direct calling driver ${currentBooking.driverName} at ${currentBooking.driverPhone}`);
              }}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Commercial Driver</span>
            </button>
          </div>

          {/* Consignment Details */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs text-xs space-y-3">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider pb-2 border-b border-neutral-100">
              Consignment Specifics
            </h3>

            <div className="flex justify-between pb-1 border-b border-neutral-100">
              <span className="text-neutral-500">Cargo Title:</span>
              <span className="font-bold text-neutral-900 text-right">{currentBooking.cargoTitle}</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-neutral-100">
              <span className="text-neutral-500">Weight & Quantity:</span>
              <span className="font-mono font-bold text-neutral-900">{currentBooking.weightKg} kg ({currentBooking.quantityDesc})</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-neutral-100">
              <span className="text-neutral-500">Consignor / Farmer:</span>
              <span className="font-semibold text-neutral-800">{currentBooking.farmerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Distance:</span>
              <span className="font-mono font-bold text-neutral-800">{currentBooking.distanceKm} km</span>
            </div>
          </div>

          {/* Return Load Opportunity callout */}
          <div className="bg-amber-50 rounded-2xl border border-amber-300 p-5 text-xs text-amber-950">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Repeat className="w-4 h-4 text-amber-700" />
              <span>Job 1 + Job 2 Corridor Optimization</span>
            </div>
            <p className="leading-relaxed text-[11px] mb-3">
              After delivery in <strong>{currentBooking.dropCity}</strong>, this vehicle can immediately pick up a return load heading back toward <strong>{currentBooking.pickupCity}</strong>.
            </p>
            <div className="text-[11px] font-semibold text-amber-900">
              Zero deadheading · Up to 40% fuel cost savings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
