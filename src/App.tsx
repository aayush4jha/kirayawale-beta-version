import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Hero from './components/Hero';
import RentalListings from './components/RentalListings';
import RequirementForm from './components/RequirementForm';
import About from './components/About';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthModal from './components/auth/AuthModal';
import UserDashboard from './components/dashboard/UserDashboard';
import CreateListingModal from './components/listings/CreateListingModal';

function App() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateListingModal, setShowCreateListingModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleCreateListingClick = () => {
    if (user) {
      setShowCreateListingModal(true);
    } else {
      openAuthModal('signup');
    }
  };

  const handleAuthSuccess = () => {
    // If user was trying to create a listing, open the modal after successful auth
    if (authMode === 'signup') {
      setTimeout(() => {
        setShowCreateListingModal(true);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/WhatsApp Image 2025-06-27 at 12.04.33_bf8c5835.jpg" 
              alt="KirayaWale Logo" 
              className="h-12 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">Kiraya</span>
                <span className="text-orange-500">Wale</span>
              </h1>
            </div>
          </div>
          <p className="text-gray-600 text-lg">Loading peer-to-peer rental platform...</p>
        </div>
      </div>
    );
  }

  // If user is logged in and wants dashboard, show it
  if (user && currentView === 'dashboard') {
    return <UserDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onAuthClick={openAuthModal}
        onDashboardClick={() => setCurrentView('dashboard')}
        onHomeClick={() => setCurrentView('home')}
        onCreateListingClick={handleCreateListingClick}
      />
      <main role="main">
        <Hero onAuthClick={openAuthModal} user={user} />
        <RentalListings />
        <About />
        <FAQ />
      </main>
      <Footer />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      <CreateListingModal
        isOpen={showCreateListingModal}
        onClose={() => setShowCreateListingModal(false)}
      />
    </div>
  );
}

export default App;