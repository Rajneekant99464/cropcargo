import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  Language, 
  CargoLoad, 
  Booking, 
  KycRequest, 
  LoadBid,
  DeliveryStage
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_LOADS, 
  INITIAL_BOOKINGS, 
  INITIAL_KYC_REQUESTS,
  VEHICLE_TYPES
} from '../data/mockData';
import { translations, getTranslation } from '../data/translations';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  loads: CargoLoad[];
  bookings: Booking[];
  users: UserProfile[];
  kycRequests: KycRequest[];
  
  // Search state passed between pages
  searchFilters: {
    pickup: string;
    destination: string;
    category: string;
    date: string;
  };
  setSearchFilters: React.Dispatch<React.SetStateAction<{
    pickup: string;
    destination: string;
    category: string;
    date: string;
  }>>;
  
  // Return load search state
  returnSearchQuery: {
    fromCity: string;
    returnToCity: string;
    date: string;
    vehicleType?: string;
  };
  setReturnSearchQuery: React.Dispatch<React.SetStateAction<{
    fromCity: string;
    returnToCity: string;
    date: string;
    vehicleType?: string;
  }>>;
  
  activeTrackingId: string;
  setActiveTrackingId: (id: string) => void;
  
  // Actions
  postNewLoad: (load: Partial<CargoLoad>) => CargoLoad;
  cancelLoad: (loadId: string) => void;
  deleteLoad: (loadId: string) => void;
  submitBid: (loadId: string, bid: Omit<LoadBid, 'id' | 'loadId' | 'createdAt' | 'status'>) => void;
  acceptBid: (loadId: string, bidId: string) => Booking | undefined;
  acceptLoadDirectly: (loadId: string, driver: UserProfile) => Booking | undefined;
  advanceBookingStage: (bookingId: string) => void;
  submitKycDocument: (doc: Omit<KycRequest, 'id' | 'submittedAt' | 'status'>) => void;
  updateKycStatus: (kycId: string, status: 'verified' | 'rejected', reason?: string) => void;
  toggleDriverAvailability: () => void;
  resetAllData: () => void;
  
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const t = getTranslation(lang);

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('cropcargo_users_v1');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    return users.find(u => u.role === 'farmer') || INITIAL_USERS[0];
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeTrackingId, setActiveTrackingId] = useState<string>('CC-2026-8941');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const [loads, setLoads] = useState<CargoLoad[]>(() => {
    const saved = localStorage.getItem('cropcargo_loads_v1');
    return saved ? JSON.parse(saved) : INITIAL_LOADS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cropcargo_bookings_v1');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [kycRequests, setKycRequests] = useState<KycRequest[]>(() => {
    const saved = localStorage.getItem('cropcargo_kyc_v1');
    return saved ? JSON.parse(saved) : INITIAL_KYC_REQUESTS;
  });

  const [searchFilters, setSearchFilters] = useState({
    pickup: '',
    destination: '',
    category: 'all',
    date: '',
  });

  const [returnSearchQuery, setReturnSearchQuery] = useState<{
    fromCity: string;
    returnToCity: string;
    date: string;
    vehicleType?: string;
  }>({
    fromCity: 'Surat',
    returnToCity: 'Dhule',
    date: '2026-10-05',
    vehicleType: 'pickup',
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cropcargo_loads_v1', JSON.stringify(loads));
  }, [loads]);

  useEffect(() => {
    localStorage.setItem('cropcargo_bookings_v1', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('cropcargo_users_v1', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cropcargo_kyc_v1', JSON.stringify(kycRequests));
  }, [kycRequests]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchRole = (newRole: UserRole) => {
    const found = users.find(u => u.role === newRole);
    if (found) {
      setCurrentUser(found);
    } else {
      const defaultUser = INITIAL_USERS.find(u => u.role === newRole) || INITIAL_USERS[0];
      setCurrentUser(defaultUser);
    }
    
    // Auto route to appropriate tab
    if (newRole === 'farmer') setActiveTab('farmer-dash');
    else if (newRole === 'driver') setActiveTab('driver-dash');
    else if (newRole === 'admin') setActiveTab('admin-dash');

    addToast({
      type: 'info',
      title: lang === 'hi' ? 'भूमिका बदली गई' : 'Switched Profile',
      message: `${lang === 'hi' ? 'वर्तमान में सक्रिय: ' : 'Now active as: '} ${newRole.toUpperCase()} mode.`,
    });
  };

  const postNewLoad = (data: Partial<CargoLoad>): CargoLoad => {
    const newId = `CC-LOAD-${Math.floor(100 + Math.random() * 900)}`;
    const recommended = (data.distanceKm || 150) * 32;
    
    // Check if this matches a known return route
    const isReturn = (data.pickupCity?.toLowerCase().includes('surat') && 
                      (data.destinationCity?.toLowerCase().includes('dhule') || data.destinationCity?.toLowerCase().includes('shirpur'))) ||
                     (data.pickupCity?.toLowerCase().includes('nashik') && data.destinationCity?.toLowerCase().includes('jalgaon'));

    const newLoad: CargoLoad = {
      id: newId,
      title: data.title || 'Agricultural Cargo Consignment',
      hindiTitle: data.hindiTitle,
      category: data.category || 'vegetables',
      cropName: data.cropName || 'Farm Goods',
      weightKg: Number(data.weightKg) || 1000,
      quantityUnits: data.quantityUnits || 'Bags / Crates',
      pickupCity: data.pickupCity || 'Dhule',
      pickupDistrict: data.pickupDistrict || 'Dhule',
      pickupLandmark: data.pickupLandmark || 'Near APMC Market',
      pickupDate: data.pickupDate || new Date().toISOString().split('T')[0],
      destinationCity: data.destinationCity || 'Surat',
      destinationDistrict: data.destinationDistrict || 'Surat',
      destinationMandi: data.destinationMandi || 'Wholesale APMC Market',
      distanceKm: Number(data.distanceKm) || 180,
      preferredVehicle: data.preferredVehicle || 'pickup',
      offeredPrice: Number(data.offeredPrice) || recommended,
      recommendedPrice: recommended,
      loadingAssistance: data.loadingAssistance ?? true,
      tarpaulinCoverRequired: data.tarpaulinCoverRequired ?? true,
      notes: data.notes || '',
      status: 'open',
      postedBy: {
        id: currentUser.id,
        name: currentUser.name,
        phone: currentUser.phone,
        village: currentUser.city,
        isVerified: currentUser.isKycVerified,
      },
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      bids: [],
      isReturnLoadOpportunity: isReturn,
      returnRouteMatchCity: isReturn ? `${data.pickupCity} -> ${data.destinationCity}` : undefined,
    };

    setLoads(prev => [newLoad, ...prev]);
    addToast({
      type: 'success',
      title: lang === 'hi' ? 'लोड सफलतापूर्वक पोस्ट हुआ' : 'Load Successfully Posted',
      message: `Consignment ID #${newId} is now live and broadcasted to local drivers.`,
    });
    return newLoad;
  };

  const cancelLoad = (loadId: string) => {
    setLoads(prev => prev.map(l => l.id === loadId ? { ...l, status: 'cancelled' } : l));
    addToast({
      type: 'info',
      title: 'Load Cancelled',
      message: `Load ${loadId} marked as cancelled.`,
    });
  };

  const deleteLoad = (loadId: string) => {
    setLoads(prev => prev.filter(l => l.id !== loadId));
    addToast({
      type: 'warning',
      title: 'Load Removed',
      message: `Load record ${loadId} deleted.`,
    });
  };

  const submitBid = (loadId: string, bidData: Omit<LoadBid, 'id' | 'loadId' | 'createdAt' | 'status'>) => {
    const newBid: LoadBid = {
      id: `bid-${Math.random().toString(36).substring(2, 7)}`,
      loadId,
      ...bidData,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setLoads(prev => prev.map(load => {
      if (load.id === loadId) {
        return {
          ...load,
          status: 'bidding',
          bids: [newBid, ...load.bids],
        };
      }
      return load;
    }));

    addToast({
      type: 'success',
      title: lang === 'hi' ? 'बोली भेजी गई' : 'Offer Submitted',
      message: `Your bid of ₹${bidData.bidAmount.toLocaleString('en-IN')} has been sent to the cargo owner.`,
    });
  };

  const acceptBid = (loadId: string, bidId: string): Booking | undefined => {
    const load = loads.find(l => l.id === loadId);
    if (!load) return undefined;
    const bid = load.bids.find(b => b.id === bidId);
    if (!bid) return undefined;

    const newBookingId = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: newBookingId,
      loadId: load.id,
      cargoTitle: load.title,
      category: load.category,
      weightKg: load.weightKg,
      quantityDesc: load.quantityUnits,
      pickupCity: load.pickupCity,
      pickupDistrict: load.pickupDistrict,
      dropCity: load.destinationCity,
      dropDistrict: load.destinationDistrict,
      distanceKm: load.distanceKm,
      driverId: bid.driverId,
      driverName: bid.driverName,
      driverPhone: bid.driverPhone,
      vehicleName: bid.vehicleName,
      vehicleNumber: bid.vehicleNumber,
      vehicleType: bid.vehicleType,
      farmerId: load.postedBy.id,
      farmerName: load.postedBy.name,
      farmerPhone: load.postedBy.phone,
      agreedPrice: bid.bidAmount,
      currentStage: 1,
      statusText: 'Driver Confirmed. Preparing for Pickup.',
      estimatedArrival: 'Tomorrow, 10:00 AM',
      bookingDate: new Date().toISOString().split('T')[0],
      isReturnTrip: Boolean(load.isReturnLoadOpportunity),
      checkpoints: [
        {
          stage: 1,
          title: 'Booking Confirmed & Driver Assigned',
          location: `${load.pickupCity} Agro Dispatch Point`,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          description: `Price locked at ₹${bid.bidAmount.toLocaleString('en-IN')}. Driver assigned.`,
        },
        {
          stage: 2,
          title: 'Pickup & Loading at Farm/Warehouse',
          location: `${load.pickupLandmark}, ${load.pickupCity}`,
          time: 'Upcoming',
          completed: false,
          description: `Driver ${bid.driverName} arriving for inspection and loading.`,
        },
        {
          stage: 3,
          title: 'Vehicle In Transit on Highway',
          location: `En route to ${load.destinationCity}`,
          time: 'Upcoming',
          completed: false,
          description: `Transit telemetry demo active.`,
        },
        {
          stage: 4,
          title: 'Delivery & Consignee Sign-off',
          location: `${load.destinationMandi}, ${load.destinationCity}`,
          time: 'Upcoming',
          completed: false,
          description: `Consignment handover and payment settlement.`,
        }
      ]
    };

    // Update loads state
    setLoads(prev => prev.map(l => {
      if (l.id === loadId) {
        return {
          ...l,
          status: 'assigned',
          assignedDriverId: bid.driverId,
          bookingId: newBookingId,
          bids: l.bids.map(b => b.id === bidId ? { ...b, status: 'accepted' } : { ...b, status: 'rejected' }),
        };
      }
      return l;
    }));

    setBookings(prev => [newBooking, ...prev]);
    setActiveTrackingId(newBookingId);

    addToast({
      type: 'success',
      title: lang === 'hi' ? 'बोली स्वीकार की गई' : 'Offer Accepted & Booked',
      message: `Booking #${newBookingId} generated for Driver ${bid.driverName}.`,
    });

    return newBooking;
  };

  const acceptLoadDirectly = (loadId: string, driver: UserProfile): Booking | undefined => {
    const load = loads.find(l => l.id === loadId);
    if (!load) return undefined;

    const details = driver.driverDetails || {
      vehicleName: 'Mahindra Bolero Maxi Truck',
      vehicleNumber: 'MH-18-BZ-4921',
      vehicleType: 'pickup' as const,
    };

    const newBookingId = `CC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: newBookingId,
      loadId: load.id,
      cargoTitle: load.title,
      category: load.category,
      weightKg: load.weightKg,
      quantityDesc: load.quantityUnits,
      pickupCity: load.pickupCity,
      pickupDistrict: load.pickupDistrict,
      dropCity: load.destinationCity,
      dropDistrict: load.destinationDistrict,
      distanceKm: load.distanceKm,
      driverId: driver.id,
      driverName: driver.name,
      driverPhone: driver.phone,
      vehicleName: details.vehicleName,
      vehicleNumber: details.vehicleNumber,
      vehicleType: details.vehicleType,
      farmerId: load.postedBy.id,
      farmerName: load.postedBy.name,
      farmerPhone: load.postedBy.phone,
      agreedPrice: load.offeredPrice,
      currentStage: 1,
      statusText: 'Driver Accepted Load. Scheduled for Pickup.',
      estimatedArrival: 'Tomorrow, 08:30 AM',
      bookingDate: new Date().toISOString().split('T')[0],
      isReturnTrip: Boolean(load.isReturnLoadOpportunity),
      checkpoints: [
        {
          stage: 1,
          title: 'Booking Confirmed by Driver',
          location: `${load.pickupCity} Hub`,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          description: `Driver ${driver.name} accepted load at offered rate ₹${load.offeredPrice.toLocaleString('en-IN')}.`,
        },
        {
          stage: 2,
          title: 'Pickup & Loading at Farm/Warehouse',
          location: `${load.pickupLandmark}, ${load.pickupCity}`,
          time: 'Upcoming',
          completed: false,
          description: `Inspection & tare weight check.`,
        },
        {
          stage: 3,
          title: 'In Transit on Highway',
          location: `Highway corridor to ${load.destinationCity}`,
          time: 'Upcoming',
          completed: false,
          description: `Fast-tag tolls and waypoint checkpoints.`,
        },
        {
          stage: 4,
          title: 'Delivery & Consignee Sign-off',
          location: `${load.destinationMandi}, ${load.destinationCity}`,
          time: 'Upcoming',
          completed: false,
          description: `Handover at target market.`,
        }
      ]
    };

    setLoads(prev => prev.map(l => l.id === loadId ? { ...l, status: 'assigned', assignedDriverId: driver.id, bookingId: newBookingId } : l));
    setBookings(prev => [newBooking, ...prev]);
    setActiveTrackingId(newBookingId);

    addToast({
      type: 'success',
      title: lang === 'hi' ? 'लोड स्वीकार कर लिया गया' : 'Load Accepted Directly',
      message: `Booking #${newBookingId} created for ${load.title}.`,
    });

    return newBooking;
  };

  const advanceBookingStage = (bookingId: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        const nextStage = (booking.currentStage < 4 ? (booking.currentStage + 1) : 4) as DeliveryStage;
        
        let statusText = booking.statusText;
        if (nextStage === 2) statusText = 'Goods Loaded at Farm/Mandi. Tarpaulin Secured.';
        else if (nextStage === 3) statusText = 'Vehicle In Transit on Highway. Speed ~60 km/h.';
        else if (nextStage === 4) statusText = 'Delivered & Consigned. Trip Completed.';

        const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        
        const updatedCheckpoints = booking.checkpoints.map(cp => {
          if (cp.stage <= nextStage) {
            return {
              ...cp,
              completed: true,
              time: cp.time === 'Upcoming' ? `${nowTime}, Today` : cp.time,
            };
          }
          return cp;
        });

        // Also update corresponding load status
        setLoads(prevLoads => prevLoads.map(l => {
          if (l.id === booking.loadId) {
            if (nextStage === 3) return { ...l, status: 'in_transit' };
            if (nextStage === 4) return { ...l, status: 'completed' };
          }
          return l;
        }));

        return {
          ...booking,
          currentStage: nextStage,
          statusText,
          checkpoints: updatedCheckpoints,
        };
      }
      return booking;
    }));

    addToast({
      type: 'info',
      title: 'Demo Tracking Updated',
      message: `Booking #${bookingId} transitioned to next stage.`,
    });
  };

  const submitKycDocument = (doc: Omit<KycRequest, 'id' | 'submittedAt' | 'status'>) => {
    const newKyc: KycRequest = {
      id: `KYC-2026-${Math.floor(100 + Math.random() * 900)}`,
      ...doc,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };

    setKycRequests(prev => [newKyc, ...prev]);
    addToast({
      type: 'success',
      title: 'KYC Document Uploaded',
      message: 'Document submitted for Admin verification queue.',
    });
  };

  const updateKycStatus = (kycId: string, status: 'verified' | 'rejected', reason?: string) => {
    setKycRequests(prev => prev.map(k => k.id === kycId ? { ...k, status, rejectionReason: reason } : k));
    
    // Also update driver's user profile if matched
    const req = kycRequests.find(k => k.id === kycId);
    if (req) {
      setUsers(prev => prev.map(u => {
        if (u.id === req.userId && u.driverDetails) {
          return {
            ...u,
            isKycVerified: status === 'verified',
            driverDetails: {
              ...u.driverDetails,
              kycStatus: status,
            }
          };
        }
        return u;
      }));

      if (currentUser.id === req.userId && currentUser.driverDetails) {
        setCurrentUser(prev => ({
          ...prev,
          isKycVerified: status === 'verified',
          driverDetails: prev.driverDetails ? {
            ...prev.driverDetails,
            kycStatus: status,
          } : undefined
        }));
      }
    }

    addToast({
      type: status === 'verified' ? 'success' : 'warning',
      title: `KYC ${status === 'verified' ? 'Approved' : 'Rejected'}`,
      message: `Status updated for ${req?.driverName || 'driver'}.`,
    });
  };

  const toggleDriverAvailability = () => {
    if (!currentUser.driverDetails) return;
    const newStatus = !currentUser.driverDetails.isAvailable;
    
    setCurrentUser(prev => ({
      ...prev,
      driverDetails: prev.driverDetails ? {
        ...prev.driverDetails,
        isAvailable: newStatus,
      } : undefined
    }));

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id && u.driverDetails) {
        return {
          ...u,
          driverDetails: {
            ...u.driverDetails,
            isAvailable: newStatus,
          }
        };
      }
      return u;
    }));

    addToast({
      type: 'info',
      title: newStatus ? 'Vehicle Status: Available' : 'Vehicle Status: Busy / On Trip',
      message: newStatus ? 'You are now visible to nearby farmers looking for trucks.' : 'You will not receive new load broadcasts while offline.',
    });
  };

  const resetAllData = () => {
    localStorage.removeItem('cropcargo_loads_v1');
    localStorage.removeItem('cropcargo_bookings_v1');
    localStorage.removeItem('cropcargo_users_v1');
    localStorage.removeItem('cropcargo_kyc_v1');
    
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setLoads(INITIAL_LOADS);
    setBookings(INITIAL_BOOKINGS);
    setKycRequests(INITIAL_KYC_REQUESTS);
    setActiveTrackingId('CC-2026-8941');

    addToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'Restored original sample loads, drivers, and bookings.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentUser,
        setCurrentUser,
        role: currentUser.role,
        switchRole,
        activeTab,
        setActiveTab,
        loads,
        bookings,
        users,
        kycRequests,
        searchFilters,
        setSearchFilters,
        returnSearchQuery,
        setReturnSearchQuery,
        activeTrackingId,
        setActiveTrackingId,
        postNewLoad,
        cancelLoad,
        deleteLoad,
        submitBid,
        acceptBid,
        acceptLoadDirectly,
        advanceBookingStage,
        submitKycDocument,
        updateKycStatus,
        toggleDriverAvailability,
        resetAllData,
        toasts,
        addToast,
        removeToast,
        authModalOpen,
        setAuthModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
