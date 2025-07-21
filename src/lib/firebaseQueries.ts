import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  QueryConstraint,
  startAfter,
  DocumentSnapshot,
  or,
  and
} from 'firebase/firestore';
import { db, Listing, User, Message, Rating, Report, ListingCategory } from './firebase';

// ==================== USER QUERIES ====================

export const userQueries = {
  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, 'users'),
        where('email', '==', email),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  // Search users by name or username
  async searchUsers(searchTerm: string, limitCount: number = 10): Promise<User[]> {
    try {
      const searchLower = searchTerm.toLowerCase();
      
      const q = query(
        collection(db, 'users'),
        orderBy('full_name'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      // Client-side filtering for partial matches
      return users.filter(user => 
        user.full_name.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
};

// ==================== LISTING QUERIES ====================

export const listingQueries = {
  // Get all active listings with pagination
  async getActiveListings(limitCount: number = 20, lastDoc?: DocumentSnapshot): Promise<{
    listings: Listing[];
    lastDoc: DocumentSnapshot | null;
    hasMore: boolean;
  }> {
    try {
      const constraints: QueryConstraint[] = [
        where('is_active', '==', true),
        where('is_rented', '==', false),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      ];

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, 'listings'), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const listings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Listing[];

      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const hasMore = querySnapshot.docs.length === limitCount;

      return { listings, lastDoc: newLastDoc, hasMore };
    } catch (error) {
      console.error('Error fetching active listings:', error);
      throw error;
    }
  },

  // Get listings by category
  async getListingsByCategory(category: ListingCategory, limitCount: number = 20): Promise<Listing[]> {
    try {
      const q = query(
        collection(db, 'listings'),
        where('category', '==', category),
        where('is_active', '==', true),
        where('is_rented', '==', false),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Listing[];
    } catch (error) {
      console.error('Error fetching listings by category:', error);
      throw error;
    }
  },

  // Get listings by location
  async getListingsByLocation(location: string, limitCount: number = 20): Promise<Listing[]> {
    try {
      const q = query(
        collection(db, 'listings'),
        where('is_active', '==', true),
        where('is_rented', '==', false),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const listings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Listing[];

      // Client-side filtering for location (since Firestore doesn't support case-insensitive queries)
      return listings.filter(listing => 
        listing.location.toLowerCase().includes(location.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching listings by location:', error);
      throw error;
    }
  },

  // Get listings by price range
  async getListingsByPriceRange(minPrice: number, maxPrice: number, limitCount: number = 20): Promise<Listing[]> {
    try {
      const q = query(
        collection(db, 'listings'),
        where('is_active', '==', true),
        where('is_rented', '==', false),
        where('price_per_day', '>=', minPrice),
        where('price_per_day', '<=', maxPrice),
        orderBy('price_per_day', 'asc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Listing[];
    } catch (error) {
      console.error('Error fetching listings by price range:', error);
      throw error;
    }
  },

  // Get user's listings
  async getUserListings(userId: string): Promise<Listing[]> {
    try {
      const q = query(
        collection(db, 'listings'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Listing[];
    } catch (error) {
      console.error('Error fetching user listings:', error);
      throw error;
    }
  },

  // Search listings by title and description
  async searchListings(searchTerm: string, limitCount: number = 20): Promise<Listing[]> {
    try {
      // Get all active listings first (Firestore doesn't support full-text search)
      const q = query(
        collection(db, 'listings'),
        where('is_active', '==', true),
        where('is_rented', '==', false),
        orderBy('created_at', 'desc'),
        limit(100) // Get more docs for better search results
      );

      const querySnapshot = await getDocs(q);
      const listings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Listing[];

      // Client-side search
      const searchLower = searchTerm.toLowerCase();
      const filteredListings = listings.filter(listing => 
        listing.title.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.category.toLowerCase().includes(searchLower)
      );

      return filteredListings.slice(0, limitCount);
    } catch (error) {
      console.error('Error searching listings:', error);
      throw error;
    }
  },

  // Get featured/popular listings
  async getFeaturedListings(limitCount: number = 10): Promise<Listing[]> {
    try {
      const q = query(
        collection(db, 'listings'),
        where('is_active', '==', true),
        where('is_rented', '==', false),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Listing[];
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      throw error;
    }
  }
};

// ==================== MESSAGE QUERIES ====================

export const messageQueries = {
  // Get messages for a listing
  async getListingMessages(listingId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('listing_id', '==', listingId),
        orderBy('created_at', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Message[];
    } catch (error) {
      console.error('Error fetching listing messages:', error);
      throw error;
    }
  },

  // Get conversation between two users
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        or(
          and(
            where('sender_id', '==', userId1),
            where('receiver_id', '==', userId2)
          ),
          and(
            where('sender_id', '==', userId2),
            where('receiver_id', '==', userId1)
          )
        ),
        orderBy('created_at', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Message[];
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  // Get user's unread messages
  async getUnreadMessages(userId: string): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        where('receiver_id', '==', userId),
        where('is_read', '==', false),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Message[];
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      throw error;
    }
  }
};

// ==================== RATING QUERIES ====================

export const ratingQueries = {
  // Get ratings for a user
  async getUserRatings(userId: string): Promise<Rating[]> {
    try {
      const q = query(
        collection(db, 'ratings'),
        where('rated_user_id', '==', userId),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Rating[];
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      throw error;
    }
  },

  // Get average rating for a user
  async getUserAverageRating(userId: string): Promise<{ average: number; count: number }> {
    try {
      const ratings = await this.getUserRatings(userId);
      
      if (ratings.length === 0) {
        return { average: 0, count: 0 };
      }

      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const average = sum / ratings.length;

      return { average: Math.round(average * 10) / 10, count: ratings.length };
    } catch (error) {
      console.error('Error calculating average rating:', error);
      throw error;
    }
  },

  // Get ratings for a listing
  async getListingRatings(listingId: string): Promise<Rating[]> {
    try {
      const q = query(
        collection(db, 'ratings'),
        where('listing_id', '==', listingId),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Rating[];
    } catch (error) {
      console.error('Error fetching listing ratings:', error);
      throw error;
    }
  }
};

// ==================== REPORT QUERIES ====================

export const reportQueries = {
  // Get reports for a listing
  async getListingReports(listingId: string): Promise<Report[]> {
    try {
      const q = query(
        collection(db, 'reports'),
        where('listing_id', '==', listingId),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Report[];
    } catch (error) {
      console.error('Error fetching listing reports:', error);
      throw error;
    }
  },

  // Get all pending reports (for admin)
  async getPendingReports(): Promise<Report[]> {
    try {
      const q = query(
        collection(db, 'reports'),
        where('status', '==', 'pending'),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      })) as Report[];
    } catch (error) {
      console.error('Error fetching pending reports:', error);
      throw error;
    }
  }
};

// ==================== ANALYTICS QUERIES ====================

export const analyticsQueries = {
  // Get listing statistics
  async getListingStats(): Promise<{
    totalListings: number;
    activeListings: number;
    rentedListings: number;
    categoryCounts: Record<string, number>;
  }> {
    try {
      // Get all listings
      const allListingsQuery = query(collection(db, 'listings'));
      const allListingsSnapshot = await getDocs(allListingsQuery);
      
      const listings = allListingsSnapshot.docs.map(doc => doc.data()) as Listing[];
      
      const totalListings = listings.length;
      const activeListings = listings.filter(l => l.is_active && !l.is_rented).length;
      const rentedListings = listings.filter(l => l.is_rented).length;
      
      // Count by category
      const categoryCounts: Record<string, number> = {};
      listings.forEach(listing => {
        categoryCounts[listing.category] = (categoryCounts[listing.category] || 0) + 1;
      });

      return {
        totalListings,
        activeListings,
        rentedListings,
        categoryCounts
      };
    } catch (error) {
      console.error('Error fetching listing stats:', error);
      throw error;
    }
  },

  // Get user statistics
  async getUserStats(): Promise<{
    totalUsers: number;
    usersWithListings: number;
    usersWithRentals: number;
  }> {
    try {
      // Get all users
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;

      // Get users with listings
      const listingsQuery = query(collection(db, 'listings'));
      const listingsSnapshot = await getDocs(listingsQuery);
      const userIdsWithListings = new Set(
        listingsSnapshot.docs.map(doc => doc.data().user_id)
      );

      // Get users with rentals (assuming rented listings)
      const rentedListingsQuery = query(
        collection(db, 'listings'),
        where('is_rented', '==', true)
      );
      const rentedListingsSnapshot = await getDocs(rentedListingsQuery);
      const userIdsWithRentals = new Set(
        rentedListingsSnapshot.docs.map(doc => doc.data().user_id)
      );

      return {
        totalUsers,
        usersWithListings: userIdsWithListings.size,
        usersWithRentals: userIdsWithRentals.size
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }
};

// ==================== CRUD OPERATIONS ====================

export const crudOperations = {
  // Create a new listing
  async createListing(listingData: Omit<Listing, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'listings'), {
        ...listingData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  // Update a listing
  async updateListing(listingId: string, updates: Partial<Listing>): Promise<void> {
    try {
      await updateDoc(doc(db, 'listings', listingId), {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  // Delete a listing
  async deleteListing(listingId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'listings', listingId));
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  },

  // Send a message
  async sendMessage(messageData: Omit<Message, 'id' | 'created_at'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...messageData,
        created_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        is_read: true,
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  },

  // Create a rating
  async createRating(ratingData: Omit<Rating, 'id' | 'created_at'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'ratings'), {
        ...ratingData,
        created_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating rating:', error);
      throw error;
    }
  },

  // Create a report
  async createReport(reportData: Omit<Report, 'id' | 'created_at'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'reports'), {
        ...reportData,
        created_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }
};

// Export all query functions
export {
  userQueries,
  listingQueries,
  messageQueries,
  ratingQueries,
  reportQueries,
  analyticsQueries,
  crudOperations
};