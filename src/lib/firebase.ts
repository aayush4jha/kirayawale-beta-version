import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCWVMi1oj_HCHNGbhCLz4X4hLWuuv9T7N4",
  authDomain: "kirayawale01-dc681.firebaseapp.com",
  projectId: "kirayawale01-dc681",
  storageBucket: "kirayawale01-dc681.firebasestorage.app",
  messagingSenderId: "1064549538260",
  appId: "1:1064549538260:web:2d47c59fceaaafb68b9e41",
  measurementId: "G-2ZEDPW7V4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Configure auth settings
auth.useDeviceLanguage();

export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (optional, only in production)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

// Configure Google Auth Provider with proper scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline'
});

// Add required scopes for profile information
googleProvider.addScope('profile');
googleProvider.addScope('email');

export default app;

// Database types
export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone_number?: string;
  city?: string;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  price_per_day: number;
  availability_start_date: string;
  availability_end_date?: string;
  location: string;
  photos: string[];
  is_rented: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Message {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  listing_id: string;
  reporter_id: string;
  reason: string;
  description?: string;
  status: string;
  created_at: string;
}

export interface Rating {
  id: string;
  listing_id: string;
  rater_id: string;
  rated_user_id: string;
  rating: number;
  review?: string;
  created_at: string;
}

// Categories for listings
export const LISTING_CATEGORIES = [
  'Electronics',
  'Furniture',
  'Vehicles',
  'Tools',
  'Sports Equipment',
  'Musical Instruments',
  'Cameras',
  'Books',
  'Clothing',
  'Home Appliances',
  'Other'
] as const;

export type ListingCategory = typeof LISTING_CATEGORIES[number];