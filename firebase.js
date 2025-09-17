// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyD-c_6VdQWf5rHWg4cJt-iZG7mpL-bGyGc",
  authDomain: "clotherental.firebaseapp.com",
  projectId: "clotherental",
  storageBucket: "clotherental.firebasestorage.app",
  messagingSenderId: "846383262940",
  appId: "1:846383262940:web:d53576b563f5d8038e1819",
  measurementId: "G-WJ15GY4D7R"
};

// Initialize Firebase
try {
  var  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}
// const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };