import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Package, 
  Truck, 
  Repeat, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Trash2, 
  Eye, 
  FileText, 
  TrendingUp,
  BarChart3,
  RefreshCw,
  Info
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    lang, 
    loads, 
    bookings, 
    users, 
    kycRequests, 
    deleteLoad, 
    advanceBookingStage, 
    updateKycStatus, 
    resetAllData, 
    setActiveTrackingId, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'loads_mgmt' | 'users_mgmt' | 'kyc_queue' | 'bookings_ops' | 'reports'>('overview');
  const [loadSearch, setLoadSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Sample suspicious reports
  const [suspiciousReports, setSuspiciousReports] = useState([
    {
      id: 'REP-01',
      targetType: 'Load',
      targetId: 'CC-LOAD-105',
      title: 'Unusually low rate quoted for heavy cotton bales',
      reportedBy: 'Driver Sunil Pawar',
      status: 'under_review',
      date: '2026-10-02',
    },
    {
      id: 'REP-02',
      targetType: 'Driver',
      targetId: 'MH-19-AK-5501',
      title: 'RC document blurry during mandi checkpoint check',
      reportedBy: 'Admin Dispatch Bot',
      status: 'pending_resubmission',
      date: '2026-10-01',
    }
  ]);

  const totalTransactedDemo = bookings.reduce((sum, b) => sum + b.agreedPrice, 0) + 185000;
  const returnLoadMatchesCount = loads.filter(l => l.isReturnLoadOpportunity).length + bookings.filter(b => b.isReturnTrip).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner with Prototype Notice */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30">
              Admin & Operations Console
            </span>
            <span className="text-xs text-neutral-400 font-mono">Prototype Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            CropCargo Regional Central Command
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Overseeing North Maharashtra & South Gujarat agricultural logistics corridor operations.
          </p>
        </div>

        <button
          onClick={resetAllData}
          className="self-start md:self-auto px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reset Demo Database</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="p-4 bg-white rounded-2xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 font-medium block">Total Users</span>
          <div className="text-xl font-extrabold text-neutral-900 font-mono mt-0.5">{users.length + 24}</div>
          <span className="text-[10px] text-emerald-700 font-medium">18 Farmers · 9 Drivers</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 font-medium block">Active Loads</span>
          <div className="text-xl font-extrabold text-neutral-900 font-mono mt-0.5">{loads.length}</div>
          <span className="text-[10px] text-neutral-500">Across 6 Mandis</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 font-medium block">Booked Trips</span>
          <div className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5">{bookings.length + 142}</div>
          <span className="text-[10px] text-emerald-600">98.2% on-time</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200 bg-amber-50/20">
          <span className="text-[11px] text-amber-900 font-medium block">Return Matches</span>
          <div className="text-xl font-extrabold text-amber-800 font-mono mt-0.5">{returnLoadMatchesCount}</div>
          <span className="text-[10px] text-amber-700">Job 1 + 2 Pairs</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 font-medium block">KYC Queue</span>
          <div className="text-xl font-extrabold text-purple-700 font-mono mt-0.5">
            {kycRequests.filter(k => k.status === 'pending').length}
          </div>
          <span className="text-[10px] text-neutral-500">Pending Review</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-neutral-200">
          <span className="text-[11px] text-neutral-500 font-medium block">Transacted Freight</span>
          <div className="text-xl font-extrabold text-neutral-900 font-mono mt-0.5">
            ₹{(totalTransactedDemo / 100000).toFixed(1)}L
          </div>
          <span className="text-[10px] text-neutral-400">Demo GMV</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-neutral-200 mb-6 space-x-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setAdminTab('overview')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            adminTab === 'overview' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Analytics & Overview
        </button>
        <button
          onClick={() => setAdminTab('loads_mgmt')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            adminTab === 'loads_mgmt' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Cargo Listings Moderation ({loads.length})
        </button>
        <button
          onClick={() => setAdminTab('kyc_queue')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            adminTab === 'kyc_queue' ? 'border-purple-600 text-purple-800' : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          KYC Review Queue ({kycRequests.filter(k => k.status === 'pending').length} Pending)
        </button>
        <button
          onClick={() => setAdminTab('bookings_ops')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            adminTab === 'bookings_ops' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Trips & Bookings Operations ({bookings.length})
        </button>
        <button
          onClick={() => setAdminTab('reports')}
          className={`pb-3 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
            adminTab === 'reports' ? 'border-red-600 text-red-800' : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Flagged / Suspicious Reports ({suspiciousReports.length})
        </button>
      </div>

      {/* Tab 1: Overview & Analytics Charts */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SVG Chart: Cargo by Commodity Category */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-display">
                    Cargo Volume by Commodity (Quintals)
                  </h3>
                  <div className="text-[11px] text-neutral-500">Dhule - Surat - Nashik Corridor Distribution</div>
                </div>
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              </div>

              {/* Bar visualization */}
              <div className="space-y-3 pt-2 text-xs">
                {[
                  { name: 'Red Onions (नाशिक/धुळे कांदा)', count: 480, pct: '85%' },
                  { name: 'Bananas & Fruits (जळगाव केळी)', count: 340, pct: '62%' },
                  { name: 'Raw Cotton Bales (कापूस)', count: 290, pct: '52%' },
                  { name: 'Grains & Pulses (गहू व डाळी)', count: 210, pct: '38%' },
                  { name: 'Return Textiles & Equipment (Job 2)', count: 390, pct: '70%' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-neutral-700">{item.name}</span>
                      <span className="font-mono text-neutral-500">{item.count} Quintals</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${idx === 4 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                        style={{ width: item.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SVG Chart: Return Load Savings Impact */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 font-display">
                      Return Load Efficiency Impact
                    </h3>
                    <div className="text-[11px] text-neutral-500">Comparing Traditional Single-Leg vs CropCargo Dual-Leg</div>
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs mb-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                    <span className="text-neutral-600">Traditional Return Mileage (Empty Deadheading):</span>
                    <span className="font-mono text-red-600 font-bold">52% Deadhead Miles</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                    <span className="text-neutral-600">CropCargo Return Utilization:</span>
                    <span className="font-mono text-emerald-700 font-bold">84.6% Matched Return Cargo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Average Farmer Freight Cost Reduction:</span>
                    <span className="font-mono text-emerald-700 font-bold">-28% to -35%</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Simulated academic calculation for BCA project evaluation.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cargo Listings Management */}
      {adminTab === 'loads_mgmt' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center justify-between">
            <div className="text-xs font-semibold text-neutral-700">
              Moderating all active cargo listings ({loads.length} items)
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Load ID</th>
                    <th className="p-3">Cargo Title</th>
                    <th className="p-3">Corridor</th>
                    <th className="p-3">Weight</th>
                    <th className="p-3">Offered Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {loads.map((load) => (
                    <tr key={load.id} className="hover:bg-neutral-50/50">
                      <td className="p-3 font-mono font-semibold text-neutral-600">{load.id}</td>
                      <td className="p-3 font-semibold text-neutral-900 max-w-xs truncate">
                        {load.title}
                        {load.isReturnLoadOpportunity && (
                          <span className="ml-1 text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            Return
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-neutral-600">{load.pickupCity} ➔ {load.destinationCity}</td>
                      <td className="p-3 font-mono">{load.weightKg} kg</td>
                      <td className="p-3 font-mono font-bold text-emerald-700">₹{load.offeredPrice.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                          {load.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteLoad(load.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: KYC Review Queue */}
      {adminTab === 'kyc_queue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {kycRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono text-neutral-400 font-semibold">{req.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      req.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 mb-1">{req.driverName}</h3>
                  <div className="text-xs text-neutral-500 font-mono mb-3">{req.phone}</div>

                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1.5 text-xs text-neutral-600 mb-4">
                    <div className="flex justify-between">
                      <span>Doc Type:</span>
                      <strong className="text-neutral-900 capitalize">{req.documentType.replace('_', ' ')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Doc Number:</span>
                      <strong className="text-neutral-900 font-mono">{req.documentNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehicle Number:</span>
                      <span className="font-mono">{req.vehicleNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submitted:</span>
                      <span>{req.submittedAt}</span>
                    </div>
                  </div>
                </div>

                {req.status === 'pending' ? (
                  <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                    <button
                      onClick={() => updateKycStatus(req.id, 'verified')}
                      className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve KYC</span>
                    </button>
                    <button
                      onClick={() => updateKycStatus(req.id, 'rejected', 'Document scan unreadable / blurry')}
                      className="flex-1 py-2 bg-neutral-100 hover:bg-red-50 hover:text-red-700 text-neutral-700 font-semibold text-xs rounded-xl border border-neutral-300 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-100">
                    Decision logged on {req.submittedAt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Bookings Operations */}
      {adminTab === 'bookings_ops' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-800">Operational Consignments ({bookings.length})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/50">
                    <td className="p-3 font-mono font-bold text-neutral-700">#{b.id}</td>
                    <td className="p-3 text-neutral-900 font-medium">{b.pickupCity} ➔ {b.dropCity}</td>
                    <td className="p-3">{b.driverName} ({b.vehicleNumber})</td>
                    <td className="p-3">{b.farmerName}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700">₹{b.agreedPrice.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        Stage {b.currentStage}/4
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {b.currentStage < 4 && (
                        <button
                          onClick={() => advanceBookingStage(b.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded border border-emerald-300"
                        >
                          Advance
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActiveTrackingId(b.id);
                          setActiveTab('tracking');
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded border border-neutral-300"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Flagged Reports */}
      {adminTab === 'reports' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Demonstration incident moderation log for anomalous freight rates or document discrepancies.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suspiciousReports.map((rep) => (
              <div key={rep.id} className="p-5 bg-white rounded-2xl border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-neutral-400 font-bold">{rep.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">
                    {rep.status}
                  </span>
                </div>
                <h4 className="font-bold text-neutral-900 text-sm">{rep.title}</h4>
                <div className="text-neutral-500">
                  Target: <strong>{rep.targetType} #{rep.targetId}</strong> · Reported by: {rep.reportedBy} ({rep.date})
                </div>
                <div className="pt-3 border-t border-neutral-100 flex gap-2">
                  <button
                    onClick={() => {
                      addToast({ type: 'info', title: 'Action Recorded', message: `Report ${rep.id} resolved.` });
                      setSuspiciousReports(prev => prev.filter(r => r.id !== rep.id));
                    }}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold text-xs"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
