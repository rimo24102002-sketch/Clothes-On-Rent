// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
<<<<<<< HEAD
  apiKey: "AIzaSyAWwZ9f46HBmsyFme-7-rEF9hH-j1nLmxw",
  authDomain: "clothesonrent-bc27e.firebaseapp.com",
  projectId: "clothesonrent-bc27e",
  storageBucket: "clothesonrent-bc27e.firebasestorage.app",
  messagingSenderId: "613854293169",
  appId: "1:613854293169:web:7bfa1c84ef3be4a1368690",
  measurementId: "G-CWQ6HPSNSY"
=======
  apiKey: "AIzaSyD8C3QMfHaeIx9Y_OpQ2UlDY1Zqq9SNIWQ",
  authDomain: "clothesonrent-e1ea0.firebaseapp.com",
  projectId: "clothesonrent-e1ea0",
  storageBucket: "clothesonrent-e1ea0.firebasestorage.app",
  messagingSenderId: "835751712580",
  appId: "1:835751712580:web:f1dcf167faae49b5382911",
  measurementId: "G-S8ELWZ8EC7"
>>>>>>> 65106e78a021ac908355ed7aefcad582787e962f
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