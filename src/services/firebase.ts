/**
 * Firebase Configuration & Initialization
 * Sets up Firebase app, Firestore, and Authentication
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate config
const requiredFields = ['apiKey', 'authDomain', 'projectId'];
const missingFields = requiredFields.filter(
  (field) => !firebaseConfig[field as keyof typeof firebaseConfig]
);

if (missingFields.length > 0) {
  console.error(
    'Firebase configuration incomplete. Missing:',
    missingFields.join(', ')
  );
  console.error('Please set environment variables in .env.local');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Use Firebase emulator if enabled
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  console.log('Using Firebase emulator');
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (err) {
    // Already connected or error - ignore
    console.log('Emulator connection info:', err);
  }
}

/**
 * Initialize Anonymous Authentication
 * Called once on app startup
 */
export async function initializeAuth(): Promise<string> {
  try {
    // If already authenticated, return existing user ID
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }

    // Sign in anonymously
    const result = await signInAnonymously(auth);
    console.log('Anonymous auth initialized:', result.user.uid);
    return result.user.uid;
  } catch (error) {
    console.error('Failed to initialize authentication:', error);
    throw error;
  }
}

/**
 * Get current user ID (must call initializeAuth first)
 */
export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid || null;
}

export { db, auth, app };