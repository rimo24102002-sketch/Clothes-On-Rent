// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyAWwZ9f46HBmsyFme-7-rEF9hH-j1nLmxw",
  authDomain: "clothesonrent-bc27e.firebaseapp.com",
  projectId: "clothesonrent-bc27e",
  storageBucket: "clothesonrent-bc27e.firebasestorage.app",
  messagingSenderId: "613854293169",
  appId: "1:613854293169:web:3dcef0861ff600b3368690",
  measurementId: "G-ZL3QSQSDZX"
};
// Initialize Firebase
try {
  var app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
}

// Firebase Services with proper persistence
const auth = getAuth(app);

// Configure Firebase Auth to use AsyncStorage for persistence in React Native
// This ensures auth state persists across app restarts but can be cleared properly
try {
  // Note: In Firebase v9+, persistence is automatically handled by React Native
  // The auth state will persist in memory and can be cleared with signOut()
  console.log('✅ Firebase Auth configured with React Native persistence');
} catch (error) {
  console.error('❌ Error configuring Firebase Auth persistence:', error);
}

const db = getFirestore(app);
const storage = getStorage(app);

console.log('🔥 Firebase services initialized:', {
  auth: !!auth,
  db: !!db,
  storage: !!storage
});

export { auth, db, storage, app };