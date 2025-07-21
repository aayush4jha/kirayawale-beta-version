# Firebase Setup Instructions

## Critical Steps to Fix All Errors

### 1. Deploy Firestore Security Rules

The updated `firestore.rules` file needs to be deployed to your Firebase project:

#### Option A: Using Firebase CLI (Recommended)
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

#### Option B: Using Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `kirayawale01-dc681`
3. Navigate to "Firestore Database" → "Rules"
4. Copy the contents of `firestore.rules` and paste into the editor
5. Click "Publish"

### 2. Fix Authentication Domain Issues

Add your domain to authorized domains:

1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Add these domains:
   - `localhost` (for local development)
   - `127.0.0.1` (for local development)
   - `kirayawale.com` (for production)
   - Any other domains you're using

### 3. Enable Authentication Methods

Ensure these are enabled in Firebase Console → Authentication → Sign-in method:

1. **Email/Password**: Enable this provider
2. **Google**: Enable and configure with your OAuth credentials

### 4. Check Firestore Database

Ensure your Firestore database is created:

1. Go to Firebase Console → Firestore Database
2. If not created, click "Create database"
3. Choose "Start in test mode" or use the security rules provided

### 5. Verify Project Configuration

Double-check your Firebase config in `src/lib/firebase.ts`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCWVMi1oj_HCHNGbhCLz4X4hLWuuv9T7N4",
  authDomain: "kirayawale01-dc681.firebaseapp.com",
  projectId: "kirayawale01-dc681",
  storageBucket: "kirayawale01-dc681.firebasestorage.app",
  messagingSenderId: "1064549538260",
  appId: "1:1064549538260:web:2d47c59fceaaafb68b9e41",
  measurementId: "G-2ZEDPW7V4Z"
};
```

### 6. Test the Application

After completing the above steps:

1. **Clear browser cache** and reload the application
2. **Sign up with email/password** to test authentication
3. **Try creating a listing** to test Firestore permissions
4. **Check browser console** for any remaining errors

### Common Issues and Solutions

- **"Missing or insufficient permissions"**: Deploy the Firestore rules
- **"auth/unauthorized-domain"**: Add your domain to authorized domains
- **"auth/invalid-credential"**: Check if Email/Password auth is enabled
- **Pop-up blocked errors**: Allow pop-ups in your browser for Google sign-in

### Verification Checklist

- [ ] Firestore security rules deployed
- [ ] Authentication domains added
- [ ] Email/Password authentication enabled
- [ ] Google authentication enabled (if using)
- [ ] Firestore database created
- [ ] Browser cache cleared
- [ ] Application tested with sign-up and listing creation