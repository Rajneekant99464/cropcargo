import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';

// Home Views
import { HeroSection } from './components/home/HeroSection';
import { Job1Job2FeatureBanner } from './components/home/Job1Job2FeatureBanner';
import { FeatureCards } from './components/home/FeatureCards';
import { HowItWorks } from './components/home/HowItWorks';
import { VehicleFleet } from './components/home/VehicleFleet';
import { StatsAndTestimonials } from './components/home/StatsAndTestimonials';
import { FaqSection } from './components/home/FaqSection';

// Feature Views
import { FindLoadsPage } from './components/loads/FindLoadsPage';
import { ReturnLoadFinder } from './components/returnLoad/ReturnLoadFinder';
import { LiveTrackingPage } from './components/tracking/LiveTrackingPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <Job1Job2FeatureBanner />
            <FeatureCards />
            <HowItWorks />
            <VehicleFleet />
            <StatsAndTestimonials />
            <FaqSection />
          </>
        )}

        {activeTab === 'loads' && <FindLoadsPage />}
        {activeTab === 'return-loads' && <ReturnLoadFinder />}
        {activeTab === 'tracking' && <LiveTrackingPage />}
        {activeTab === 'farmer-dash' && <FarmerDashboard />}
        {activeTab === 'driver-dash' && <DriverDashboard />}
        {activeTab === 'admin-dash' && <AdminDashboard />}
      </div>

      <Footer />
      <AuthModal />
      <ToastContainer />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans">
        <Navbar />
        <MainContent />
      </div>
    </AppProvider>
  );
}
