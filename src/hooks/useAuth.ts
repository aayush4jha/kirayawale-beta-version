import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db, User } from '../lib/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.uid);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        setProfile(userDoc.data() as User);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (firebaseUser: FirebaseUser, additionalData?: {
    full_name?: string;
    phone_number?: string;
    city?: string;
  }) => {
    try {
      const email = firebaseUser.email || '';
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${firebaseUser.uid.slice(0, 8)}`;
      
      const fullName = additionalData?.full_name || 
                      firebaseUser.displayName || 
                      email.split('@')[0] || 
                      'User';

      const userData: User = {
        id: firebaseUser.uid,
        username: username,
        email: email,
        full_name: fullName,
        phone_number: additionalData?.phone_number || '',
        city: additionalData?.city || '',
        profile_picture_url: firebaseUser.photoURL || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      setProfile(userData);
      console.log('Profile created successfully for user:', firebaseUser.uid);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, userData: {
    full_name: string;
    phone_number?: string;
    city?: string;
  }) => {
    try {
      setLoading(true);
      
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(firebaseUser, {
        displayName: userData.full_name
      });

      // Create user profile in Firestore
      await createUserProfile(firebaseUser, userData);

      return { user: firebaseUser };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await createUserProfile(firebaseUser);
      }

      return { user: firebaseUser };
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Create a fresh provider instance
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      provider.addScope('profile');
      provider.addScope('email');
      
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError: any) {
        // Fallback for popup issues
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          throw new Error('Pop-up was blocked or closed. Please allow pop-ups and try again.');
        }
        throw popupError;
      }
      
      const firebaseUser = result.user;
      
      // Check if profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        await createUserProfile(firebaseUser);
      }

      return { user: firebaseUser };
    } catch (error: any) {
      console.error('Google signin error:', error);
      
      // Handle specific Google auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Another sign-in attempt is in progress.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithOTP = async (email: string) => {
    // Firebase doesn't have built-in OTP for email, but we can simulate it
    // For now, we'll throw an error to indicate it's not implemented
    throw new Error('OTP signin is not available with Firebase. Please use email/password or Google signin.');
  };

  const verifyOTP = async (email: string, token: string) => {
    // Firebase doesn't have built-in OTP for email
    throw new Error('OTP verification is not available with Firebase. Please use email/password or Google signin.');
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updated_at: serverTimestamp(),
      });
      
      // Refresh profile
      await fetchProfile(user.uid);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return {
    user,
    profile,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signInWithOTP,
    verifyOTP,
    signOut,
    updateProfile: updateUserProfile,
  };
};