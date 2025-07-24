import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db, Listing, ListingCategory, User } from '../lib/firebase';

interface UseListingsOptions {
  category?: ListingCategory;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  limitCount?: number;
}

export const useListings = (options: UseListingsOptions = {}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Starting to fetch listings...');

      // Simple query to get all listings
      const listingsRef = collection(db, 'listings');
      const querySnapshot = await getDocs(listingsRef);
      
      console.log(`📊 Found ${querySnapshot.size} total documents in listings collection`);

      if (querySnapshot.empty) {
        console.log('📭 No listings found in database');
        setListings([]);
        return;
      }

      const allListings: Listing[] = [];
      
      // Process each listing document
      for (const docSnapshot of querySnapshot.docs) {
        try {
          const data = docSnapshot.data();
          console.log(`📄 Processing document ${docSnapshot.id}:`, data);
          
          // Create listing object with safe defaults
          const listing: Listing = {
            id: docSnapshot.id,
            user_id: data.user_id || '',
            title: data.title || 'Untitled',
            category: data.category || 'Other',
            description: data.description || '',
            price_per_day: typeof data.price_per_day === 'number' ? data.price_per_day : 0,
            availability_start_date: data.availability_start_date || new Date().toISOString(),
            availability_end_date: data.availability_end_date || null,
            location: data.location || '',
            photos: Array.isArray(data.photos) ? data.photos : [],
            is_rented: data.is_rented === true,
            is_active: data.is_active !== false, // Default to true if not specified
            created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
            updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          };

          // Fetch user data if user_id exists
          if (listing.user_id) {
            try {
              const userDoc = await getDoc(doc(db, 'users', listing.user_id));
              if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                listing.user = userData;
              }
            } catch (userError) {
              console.warn(`⚠️ Could not fetch user data for ${listing.user_id}:`, userError);
            }
          }
          
          allListings.push(listing);
          console.log(`✅ Successfully processed listing: ${listing.title}`);
        } catch (docError) {
          console.error(`❌ Error processing document ${docSnapshot.id}:`, docError);
        }
      }

      console.log(`✅ Successfully processed ${allListings.length} listings`);
      
      // Filter for active listings only
      const activeListings = allListings.filter(listing => {
        const isActive = listing.is_active && !listing.is_rented;
        console.log(`🔍 Listing "${listing.title}": active=${listing.is_active}, rented=${listing.is_rented}, showing=${isActive}`);
        return isActive;
      });

      console.log(`🎯 Filtered to ${activeListings.length} active listings`);

      // Sort by created_at (newest first)
      activeListings.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      setListings(activeListings);
      console.log('🎉 Listings successfully set in state');

    } catch (err: any) {
      console.error('❌ Error fetching listings:', err);
      
      let errorMessage = 'Failed to load listings. ';
      
      if (err.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please check your connection and try again.';
      } else if (err.code === 'unavailable') {
        errorMessage += 'Service temporarily unavailable. Please try again in a moment.';
      } else if (err.message?.includes('index')) {
        errorMessage += 'Database is being optimized. Please try again in a few minutes.';
      } else {
        errorMessage += err.message || 'Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dtuz2ewtb/image/upload';
const UPLOAD_PRESET = 'xxxxxx';

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await res.json();
  return data.secure_url;
};

const createListing = async (
  listingData: Omit<Listing, 'id' | 'created_at' | 'updated_at'>
) => {
  try {
    console.log('🔄 Creating new listing:', listingData);
    console.log('🔐 Current auth state:', auth.currentUser?.uid);

    if (!auth.currentUser) {
      throw new Error('You must be signed in to create a listing. Please sign in and try again.');
    }

    // Validation
    if (!listingData.user_id || listingData.user_id !== auth.currentUser.uid) {
      throw new Error('User ID mismatch or missing. Please sign in again.');
    }
    if (!listingData.title?.trim()) throw new Error('Title is required');
    if (!listingData.category) throw new Error('Category is required');
    if (!listingData.description?.trim()) throw new Error('Description is required');
    if (!listingData.price_per_day || listingData.price_per_day <= 0)
      throw new Error('Valid price per day is required');
    if (!listingData.location?.trim()) throw new Error('Location is required');

    // Upload images to Cloudinary
    const photoUrls: string[] = [];

    if (Array.isArray(listingData.photos)) {
      for (const photo of listingData.photos) {
        if (photo instanceof File) {
          const url = await uploadToCloudinary(photo);
          photoUrls.push(url);
        } else if (typeof photo === 'string') {
          // Already uploaded image URL (optional support)
          photoUrls.push(photo);
        }
      }
    }

    const firestoreData = {
      user_id: listingData.user_id,
      title: listingData.title.trim(),
      category: listingData.category,
      description: listingData.description.trim(),
      price_per_day: Number(listingData.price_per_day),
      availability_start_date: listingData.availability_start_date,
      availability_end_date: listingData.availability_end_date || null,
      location: listingData.location.trim(),
      photos: photoUrls,
      is_active: true,
      is_rented: false,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'listings'), firestoreData);
    console.log('✅ Listing created with ID:', docRef.id);

    setTimeout(() => {
      fetchListings();
    }, 1000);

    return docRef.id;
  } catch (err: any) {
    console.error('❌ Error creating listing:', err);
    let errorMessage = 'Failed to create listing. ';

    if (err.code === 'permission-denied' || err.code === 'insufficient-permissions') {
      errorMessage = 'Permission denied. Please sign out, sign back in, and try again.';
    } else if (err.code === 'unauthenticated') {
      errorMessage = 'You must be signed in to create a listing.';
    } else if (err.message) {
      errorMessage = err.message;
    }

    throw new Error(errorMessage);
  }
};


  const refetch = () => {
    console.log('🔄 Refetching listings...');
    fetchListings();
  };

  const updateListing = async (listingId: string, updates: Partial<Listing>) => {
    try {
      console.log('🔄 Updating listing:', listingId, updates);
      
      await updateDoc(doc(db, 'listings', listingId), {
        ...updates,
        updated_at: serverTimestamp(),
      });
      
      console.log('✅ Listing updated successfully');
      
      // Refresh listings after update
      setTimeout(() => {
        fetchListings();
      }, 500);
      
    } catch (err: any) {
      console.error('❌ Error updating listing:', err);
      throw new Error(err.message || 'Failed to update listing');
    }
  };

  const deleteListing = async (listingId: string) => {
    try {
      console.log('🗑️ Deleting listing:', listingId);
      
      await deleteDoc(doc(db, 'listings', listingId));
      
      console.log('✅ Listing deleted successfully');
      
      // Refresh listings after deletion
      setTimeout(() => {
        fetchListings();
      }, 500);
      
    } catch (err: any) {
      console.error('❌ Error deleting listing:', err);
      throw new Error(err.message || 'Failed to delete listing');
    }
  };
  useEffect(() => {
    fetchListings();
  }, []);

  return {
    listings,
    loading,
    error,
    createListing,
    updateListing,
    deleteListing,
    refetch
  };
};

// Hook for user's own listings
export const useUserListings = (userId?: string) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setListings([]);
      setLoading(false);
      return;
    }

    const fetchUserListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching listings for user:', userId);
        
        // Get all listings first, then filter by user
        const listingsRef = collection(db, 'listings');
        const querySnapshot = await getDocs(listingsRef);
        
        const userListings: Listing[] = [];
        
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          
          // Only include listings for this user
          if (data.user_id === userId) {
            const listing: Listing = {
              id: docSnapshot.id,
              user_id: data.user_id,
              title: data.title || 'Untitled',
              category: data.category || 'Other',
              description: data.description || '',
              price_per_day: typeof data.price_per_day === 'number' ? data.price_per_day : 0,
              availability_start_date: data.availability_start_date || new Date().toISOString(),
              availability_end_date: data.availability_end_date || null,
              location: data.location || '',
              photos: Array.isArray(data.photos) ? data.photos : [],
              is_rented: data.is_rented === true,
              is_active: data.is_active !== false,
              created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
              updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
            };
            
            userListings.push(listing);
          }
        });

        // Sort by created_at (newest first)
        userListings.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });

        setListings(userListings);
        console.log(`✅ Found ${userListings.length} listings for user`);
        
      } catch (err: any) {
        console.error('❌ Error fetching user listings:', err);
        setError(err.message || 'Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [userId]);

  return { listings, loading, error };
};