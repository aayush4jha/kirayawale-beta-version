import React, { useState } from 'react';
import { Menu, X, User, LogOut, Settings, Plus, Search, ShoppingCart } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import CartModal from './cart/CartModal';

interface HeaderProps {
  user: FirebaseUser | null;
  onAuthClick: (mode: 'signin' | 'signup') => void;
  onDashboardClick: () => void;
  onHomeClick: () => void;
  onCreateListingClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onAuthClick, 
  onDashboardClick, 
  onHomeClick,
  onCreateListingClick 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { profile, signOut } = useAuth();
  const { getTotalItems } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      onHomeClick();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreateListing = () => {
    if (user && onCreateListingClick) {
      onCreateListingClick();
    } else {
      onAuthClick('signup');
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Scroll to listings section and trigger search
      const element = document.getElementById('listings');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Dispatch custom event with search query
        window.dispatchEvent(new CustomEvent('heroSearch', { detail: searchQuery }));
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const totalCartItems = getTotalItems();

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4">
            <button onClick={onHomeClick} className="flex items-center space-x-3 flex-shrink-0">
              <img 
                src="/WhatsApp Image 2025-06-27 at 12.04.33_bf8c5835.jpg" 
                alt="KirayaWale Logo" 
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold">
                  <span className="text-blue-600">Kiraya</span>
                  <span className="text-orange-500">Wale</span>
                </h1>
              </div>
            </button>

            {/* Enhanced Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Find electronics, bikes, furniture, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-24 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-gray-50 hover:bg-white transition-all duration-200 text-sm"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Cart Button */}
              <button
                onClick={() => setShowCartModal(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalCartItems > 9 ? '9+' : totalCartItems}
                  </span>
                )}
              </button>

              {/* Post Ad Button - Always visible */}
              <button
                onClick={handleCreateListing}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-1 md:space-x-2 shadow-lg text-sm"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:block">List Item</span>
                <span className="sm:hidden">List</span>
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-2 py-2 md:px-3 md:py-2 rounded-lg transition-colors"
                  >
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-600" />
                    )}
                    <span className="hidden lg:block text-gray-700 text-sm max-w-24 truncate">
                      {profile?.full_name || user.displayName || 'User'}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          onDashboardClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>My Account</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onAuthClick('signin')}
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm px-2 py-1"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onAuthClick('signup')}
                    className="bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Search */}
          <div className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-20 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-gray-50"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => {
                    const element = document.getElementById('about');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-left py-2"
                >
                  About Us
                </button>
                <button 
                  onClick={() => {
                    const element = document.getElementById('about');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-left py-2"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => {
                    const element = document.getElementById('contact');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-left py-2"
                >
                  Help & Support
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </>
  );
};

export default Header;