export type UserRole = 'farmer' | 'driver' | 'admin';

export type Language = 'en' | 'hi';

export type VehicleCategory = 'mini_truck' | 'pickup' | 'lcv' | 'heavy';

export interface VehicleTypeInfo {
  type: VehicleCategory;
  name: string;
  hindiName: string;
  capacityKg: number;
  capacityDesc: string;
  idealFor: string;
  avgRatePerKm: number;
  imageKey: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  city: string;
  district: string;
  state: string;
  avatarUrl?: string;
  isKycVerified: boolean;
  registeredDate: string;
  // Driver specific
  driverDetails?: {
    vehicleType: VehicleCategory;
    vehicleName: string;
    vehicleNumber: string;
    capacityKg: number;
    isAvailable: boolean;
    currentCity: string;
    experienceYears: number;
    rating: number;
    tripsCompleted: number;
    licenseNumber: string;
    rcNumber: string;
    aadhaarNumber: string;
    kycStatus: 'pending' | 'verified' | 'rejected';
    demoEarnings: {
      totalGross: number;
      thisMonth: number;
      returnLoadsBonus: number;
    };
  };
  // Farmer specific
  farmerDetails?: {
    farmType: string;
    farmSizeAcres: number;
    primaryCrops: string[];
    mandiPreference: string;
  };
}

export type CargoCategory = 
  | 'vegetables' 
  | 'grains' 
  | 'fruits' 
  | 'cotton' 
  | 'fertilizer' 
  | 'machinery' 
  | 'general';

export interface CargoLoad {
  id: string;
  title: string;
  hindiTitle?: string;
  category: CargoCategory;
  cropName: string;
  weightKg: number;
  quantityUnits: string; // e.g. "80 Bags", "45 Crates", "12 Bales"
  pickupCity: string;
  pickupDistrict: string;
  pickupLandmark: string;
  pickupDate: string;
  destinationCity: string;
  destinationDistrict: string;
  destinationMandi: string;
  distanceKm: number;
  preferredVehicle: VehicleCategory;
  offeredPrice: number;
  recommendedPrice: number;
  loadingAssistance: boolean;
  tarpaulinCoverRequired: boolean;
  notes?: string;
  status: 'open' | 'bidding' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
  postedBy: {
    id: string;
    name: string;
    phone: string;
    village: string;
    isVerified: boolean;
  };
  createdAt: string;
  bids: LoadBid[];
  assignedDriverId?: string;
  bookingId?: string;
  isReturnLoadOpportunity?: boolean; // Matches outbound back-haul lanes
  returnRouteMatchCity?: string; // e.g., Surat -> Dhule
}

export interface LoadBid {
  id: string;
  loadId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: VehicleCategory;
  bidAmount: number;
  note?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export type DeliveryStage = 1 | 2 | 3 | 4;

export interface TrackingCheckpoint {
  stage: DeliveryStage;
  title: string;
  location: string;
  time: string;
  completed: boolean;
  description: string;
}

export interface Booking {
  id: string; // e.g. CC-2026-8941
  loadId: string;
  cargoTitle: string;
  category: CargoCategory;
  weightKg: number;
  quantityDesc: string;
  pickupCity: string;
  pickupDistrict: string;
  dropCity: string;
  dropDistrict: string;
  distanceKm: number;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: VehicleCategory;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  agreedPrice: number;
  currentStage: DeliveryStage; // 1: Confirmed, 2: Loaded, 3: In Transit, 4: Delivered
  statusText: string;
  estimatedArrival: string;
  bookingDate: string;
  isReturnTrip: boolean; // Job 2
  parentJob1Id?: string;
  checkpoints: TrackingCheckpoint[];
}

export interface KycRequest {
  id: string;
  userId: string;
  driverName: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: VehicleCategory;
  documentType: 'driving_license' | 'rc_book' | 'aadhaar' | 'fitness_certificate';
  documentNumber: string;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  mockDocumentUrl: string;
}
