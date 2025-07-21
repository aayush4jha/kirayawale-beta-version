import React from 'react';
import { Calendar, MapPin, User, Heart, Phone, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { Listing } from '../../lib/firebase';

interface ListingCardProps {
  listing: Listing;
  onContact?: (listing: Listing) => void;
  onAddToCart?: (listing: Listing) => void;
  onEdit?: (listing: Listing) => void;
  onDelete?: (listing: Listing) => void;
  showOwner?: boolean;
  showActions?: boolean;
  viewMode?: 'grid' | 'list';
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  onContact, 
  onAddToCart,
  onEdit,
  onDelete,
  showOwner = true,
  showActions = false,
  viewMode = 'grid'
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-48 h-48 md:h-32 flex-shrink-0">
            {listing.photos && listing.photos.length > 0 ? (
              <img 
                src={listing.photos[0]} 
                alt={listing.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-full h-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center ${listing.photos && listing.photos.length > 0 ? 'hidden' : ''}`}>
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-2">
              <div className="flex-1 mb-4 lg:mb-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {listing.category}
                  </span>
                  {listing.is_rented && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      Rented
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{listing.description}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>Available from {formatDate(listing.availability_start_date)}</span>
                  </div>
                  {showOwner && listing.user && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">By {listing.user.full_name}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center lg:text-right lg:ml-4 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start">
                <div className="lg:mb-3">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600">
                    {formatPrice(listing.price_per_day)}
                  </div>
                  <span className="text-sm text-gray-500 font-normal">/day</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {onAddToCart && (
                    <button
                      onClick={() => onAddToCart(listing)}
                      disabled={listing.is_rented}
                      className="bg-orange-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                  
                  {onContact && (
                    <button
                      onClick={() => onContact(listing)}
                      disabled={listing.is_rented}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{listing.is_rented ? 'Rented' : 'Contact'}</span>
                    </button>
                  )}
                  
                  {showActions && (
                    <>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(listing)}
                          className="bg-gray-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center space-x-1 text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                      )}
                      
                      {onDelete && (
                        <button
                          onClick={() => onDelete(listing)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-1 text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-200 group">
      <div className="relative overflow-hidden">
        {listing.photos && listing.photos.length > 0 ? (
          <img 
            src={listing.photos[0]} 
            alt={listing.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        <div className={`w-full h-48 bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center ${listing.photos && listing.photos.length > 0 ? 'hidden' : ''}`}>
          <span className="text-gray-500 text-lg">No Image</span>
        </div>
        
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs font-medium text-gray-700">{listing.category}</span>
        </div>
        
        {listing.is_rented && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Rented
          </div>
        )}
        
        <button className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{listing.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">{listing.description}</p>
        
        <div className="space-y-1 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-xs">Available from {listing.availability_start_date ? formatDate(listing.availability_start_date) : 'Now'}</span>
          </div>
          
          {showOwner && listing.users && (
            <div className="flex items-center text-gray-500 text-sm">
              <User className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate text-xs">By {listing.users.full_name}</span>
            </div>
          )}
          
          {showOwner && listing.user && (
            <div className="flex items-center text-gray-500 text-sm">
              <User className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate text-xs">By {listing.user.full_name}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg md:text-xl font-bold text-blue-600">
              {formatPrice(listing.price_per_day)}
            </span>
            <span className="text-gray-500 text-sm ml-1">/day</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(listing)}
              disabled={listing.is_rented}
              className="flex-1 bg-orange-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          )}
          
          {onContact && (
            <button
              onClick={() => onContact(listing)}
              disabled={listing.is_rented}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Phone className="h-4 w-4" />
              <span>{listing.is_rented ? 'Rented' : 'Contact'}</span>
            </button>
          )}
          
          {showActions && (
            <div className="flex items-center space-x-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(listing)}
                  className="bg-gray-600 text-white p-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => onDelete(listing)}
                  className="bg-red-600 text-white p-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;