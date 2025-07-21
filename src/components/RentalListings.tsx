import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, AlertCircle, ArrowDown, ShoppingCart, Plus } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import { LISTING_CATEGORIES, ListingCategory } from '../lib/firebase';
import ListingCard from './listings/ListingCard';
import { useCart } from '../hooks/useCart';

const RentalListings = () => {
  const [filters, setFilters] = useState({
    category: '' as ListingCategory | '',
    location: '',
    minPrice: '',
    maxPrice: '',
    searchQuery: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { listings, loading, error, refetch } = useListings();

  const { addToCart } = useCart();

  // Listen for search from Hero component
  useEffect(() => {
    const handleHeroSearch = (event: CustomEvent) => {
      setFilters(prev => ({
        ...prev,
        searchQuery: event.detail
      }));
    };

    window.addEventListener('heroSearch', handleHeroSearch as EventListener);
    return () => window.removeEventListener('heroSearch', handleHeroSearch as EventListener);
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      searchQuery: '',
    });
  };


  const handleContactListing = (listing: any) => {
    const message = `Hi! I'm interested in renting "${listing.title}" from KirayaWale. Could you please provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/916207797744?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
  };

  const handleAddToCart = (listing: any) => {
    addToCart(listing);
    
    // Show success feedback
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓ Added!';
      button.style.backgroundColor = '#10b981';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
      }, 1500);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  // Filter listings based on search criteria
  const filteredListings = listings.filter(listing => {
    const matchesCategory = !filters.category || listing.category === filters.category;
    const matchesLocation = !filters.location || listing.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesMinPrice = !filters.minPrice || listing.price_per_day >= parseFloat(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || listing.price_per_day <= parseFloat(filters.maxPrice);
    const matchesSearch = !filters.searchQuery || 
      listing.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesCategory && matchesLocation && matchesMinPrice && matchesMaxPrice && matchesSearch;
  });

  return (
    <section id="listings" className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Browse <span className="text-blue-600">Rental Items</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover items available for rent from our community
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Error Loading Listings
                  </h3>
                  <p className="text-red-700 mb-4 text-sm md:text-base">
                    {error}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleRetry}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Enhanced Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm md:text-base"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 md:px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm md:text-base"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </button>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">All Categories</option>
                      {LISTING_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city..."
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <button
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                  >
                    Clear All Filters
                  </button>
                  <span className="text-sm text-gray-500">
                    {filteredListings.length} items found
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Listings */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading rental items...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest listings</p>
            </div>
          ) : filteredListings.length === 0 && !error ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No items found</h3>
              <p className="text-gray-600 mb-6">
                {listings.length === 0 
                  ? "No items have been listed yet on KirayaWale. Be the first to create a listing!" 
                  : "No items match your search criteria. Try adjusting your filters."
                }
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    <strong>Debug Info:</strong><br/>
                    Total listings in database: {listings.length}<br/>
                    Filtered listings: {filteredListings.length}
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {listings.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Clear Filters
                  </button>
                )}
                {listings.length === 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-orange-50 border-2 border-blue-200 rounded-xl p-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-gray-900 mb-2">Want to list your item?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Sign up and create your first listing to start earning from items you don't use daily!
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      Click "List Item" in the header to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onContact={handleContactListing}
                  onAddToCart={handleAddToCart}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Call to Action */}
        </div>
      </div>
    </section>
  );
};

export default RentalListings;