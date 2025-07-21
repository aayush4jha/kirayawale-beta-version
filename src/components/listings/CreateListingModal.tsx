import React, { useState } from 'react';
import { X, Upload, Plus, Minus, Camera, MapPin, Calendar, DollarSign, FileText, Tag, Image, CheckCircle } from 'lucide-react';
import { useListings } from '../../hooks/useListings';
import { LISTING_CATEGORIES, ListingCategory } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { createListing } = useListings();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '' as ListingCategory,
    description: '',
    price_per_day: '',
    availability_start_date: new Date().toISOString().split('T')[0],
    availability_end_date: '',
    location: '',
    photos: [] as string[],
  });

  const [photoUrl, setPhotoUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a listing');
      return;
    }

    console.log('🔐 Current user UID:', user.uid);
    console.log('🔐 User email:', user.email);
    console.log('🔐 Auth token exists:', !!user.accessToken);
    
    // Validate all required fields
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.price_per_day || parseFloat(formData.price_per_day) <= 0) {
      setError('Valid price per day is required');
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Submitting listing with data:', formData);
      console.log('🔐 User authentication verified');
      
      const listingData = {
        user_id: user.uid,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price_per_day: parseFloat(formData.price_per_day),
        availability_start_date: formData.availability_start_date,
        availability_end_date: formData.availability_end_date || undefined,
        location: formData.location.trim(),
        photos: formData.photos,
        is_rented: false,
        is_active: true,
      };
      
      console.log('📝 Final listing data:', listingData);
      
      await createListing(listingData);
      
      console.log('🎉 Listing created successfully!');
      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (err: any) {
      console.error('❌ Error creating listing:', err);
      
      // Handle specific error messages
      let errorMessage = err.message || 'Failed to create listing. Please try again.';
      
      if (errorMessage.includes('permission-denied') || errorMessage.includes('insufficient permissions')) {
        errorMessage = 'Permission denied. Please sign out and sign back in, then try again.';
      } else if (errorMessage.includes('unauthenticated')) {
        errorMessage = 'Authentication required. Please sign in again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '' as ListingCategory,
      description: '',
      price_per_day: '',
      availability_start_date: new Date().toISOString().split('T')[0],
      availability_end_date: '',
      location: '',
      photos: [],
    });
    setPhotoUrl('');
    setCurrentStep(1);
    setError(null);
    setSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addPhoto = () => {
    if (photoUrl.trim() && !formData.photos.includes(photoUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrl.trim()]
      }));
      setPhotoUrl('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      
      // For demo purposes, we'll use the object URL
      // In production, you'd upload to a cloud storage service
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, imageUrl]
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.category && formData.description.trim();
      case 2:
        return formData.price_per_day && parseFloat(formData.price_per_day) > 0 && formData.location.trim();
      case 3:
        return true; // Photos are optional
      default:
        return false;
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Listing Created!</h2>
          <p className="text-gray-600 mb-4">Your item has been successfully listed for rent and is now visible to other users.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>What's next?</strong><br/>
              • Your listing is now live on KirayaWale<br/>
              • Users can contact you via WhatsApp to rent<br/>
              • You can manage your listings from your dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Post Your Item</h2>
              <p className="text-gray-600">Step {currentStep} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Basic Info</span>
              <span>Details</span>
              <span>Photos</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="inline h-4 w-4 mr-1" />
                    What are you renting out? *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Professional DSLR Camera with Lens"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {LISTING_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Describe your item in detail. Include condition, features, and any special instructions..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                </div>
              </div>
            )}

            {/* Step 2: Pricing and Availability */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="price_per_day" className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Rental Price per Day (₹) *
                  </label>
                  <input
                    type="number"
                    id="price_per_day"
                    name="price_per_day"
                    value={formData.price_per_day}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="100000"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set a competitive price (₹1 - ₹100,000 per day)
                  </p>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.location.length}/100 characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="availability_start_date" className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Available From *
                    </label>
                    <input
                      type="date"
                      id="availability_start_date"
                      name="availability_start_date"
                      value={formData.availability_start_date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="availability_end_date" className="block text-sm font-medium text-gray-700 mb-2">
                      Available Until (Optional)
                    </label>
                    <input
                      type="date"
                      id="availability_end_date"
                      name="availability_end_date"
                      value={formData.availability_end_date}
                      onChange={handleInputChange}
                      min={formData.availability_start_date}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Camera className="inline h-4 w-4 mr-1" />
                    Add Photos (Optional)
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Add photos to make your listing more attractive. Items with photos get 3x more responses!
                  </p>
                  
                  {/* Upload from Device */}
                  <div className="mb-4">
                    <label className="block w-full">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                        <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Choose from Device/Gallery</p>
                        <p className="text-sm text-gray-400">Click to upload photos from your device</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                  </div>

                  {/* URL Input */}
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Or enter photo URL"
                    />
                    <button
                      type="button"
                      onClick={addPhoto}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.photos.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No photos added yet</p>
                      <p className="text-sm text-gray-400">Add some photos to make your listing stand out!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={currentStep === 1 ? onClose : prevStep}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {currentStep === 1 ? 'Cancel' : 'Previous'}
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-orange-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Post My Item'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListingModal;