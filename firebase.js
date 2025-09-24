// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
 apiKey: "AIzaSyAWwZ9f46HBmsyFme-7-rEF9hH-j1nLmxw",
  authDomain: "clothesonrent-bc27e.firebaseapp.com",
  projectId: "clothesonrent-bc27e",
  storageBucket: "clothesonrent-bc27e.firebasestorage.app",
  messagingSenderId: "613854293169",
  appId: "1:613854293169:web:7bfa1c84ef3be4a1368690",
  measurementId: "G-CWQ6HPSNSY"
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