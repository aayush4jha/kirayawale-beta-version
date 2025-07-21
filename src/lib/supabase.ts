import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

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
  users?: User;
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