// firestoreService.js
import {createUserWithEmailAndPassword,sendPasswordResetEmail,signInWithEmailAndPassword,signOut} from "firebase/auth";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, query, where} from 'firebase/firestore';
import { auth, db } from '../../firebase'; 

//--------------------------------
// 🔹 Firestore Services
//--------------------------------

// ✅ Add data
export const addData = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
// ✅ Get all data
export const getAllData = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (e) {
        console.error("Error getting documents: ", e);
    }
};

// ✅ Get single document
export const getDataById = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (e) {
        console.error("Error getting docouments: ", e);
    }
};

// ✅ Update document
export const updateData = async (collectionName, id, newData) => {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, newData);
        console.log("Document updated successfully");
    } catch (e) {
        console.error("Error updating document: ", e);
    }
};

// ✅ Delete document
export const deleteData = async (collectionName, id) => {
    try {
        await deleteDoc(doc(db, collectionName, id));
        console.log("Document deleted successfully");
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
};

//--------------------------------
// 🔹 Firebase Auth Services
//--------------------------------

// Generate seller id
const generateSellerId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SLR-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Sign Up
export const handleSignUp = async (email, password, extraData = {}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Generate shorter seller ID for sellers
        const sellerId = extraData.role === "Seller" ? generateSellerId() : user.uid;

        const userData = {
            uid: user.uid,
            sellerId: sellerId,
            email: user.email,
            createdAt: new Date().toISOString(),
            ...extraData,
        };

        await setDoc(doc(db, "users", user.uid), userData);
        return userData;
    } catch (error) {
        console.error("Error signing up:", error.message);
        throw error;
    }
};

// ✅ Login
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
            return { uid: firebaseUser.uid, ...userDoc.data() };
        } else {
            throw new Error("User data not found in database");
        }
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};

// ✅ Forgot Password
export const forgotPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent!");
    } catch (error) {
        console.error("Error sending reset email:", error.message);
        throw error;
    }
};

// ✅ Logout
export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully");
    } catch (error) {
        console.error("Error logging out:", error.message);
        throw error;
    }
};

// ✅ Delete Account
export const deleteAccount = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No user is currently logged in");
        }

        // Delete user data from Firestore
        await deleteDoc(doc(db, "users", user.uid));
        console.log("User data deleted from Firestore");

        // Delete user from Firebase Auth
        await user.delete();
        console.log("User account deleted successfully");
    } catch (error) {
        console.error("Error deleting account:", error.message);
        throw error;
    }
};

//--------------------------------
// 🔹 Notification Services
//--------------------------------

// ✅ Add a new notification
export const addNotification = async (sellerId, type, message) => {
    try {
        const docRef = await addDoc(collection(db, "notifications"), {
            sellerId,
            type,           // "order", "payment", "customer"
            message,        // notification text
            read: false,    // default unread
            timestamp: Date.now(),
        });
        console.log("Notification added with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding notification:", error.message);
        throw error;
    }
};

// ✅ Get all notifications for a seller
export const getNotificationsBySeller = async (sellerId) => {
    try {
        const q = query(collection(db, "notifications"), where("sellerId", "==", sellerId));
        const querySnapshot = await getDocs(q);
        const notifications = [];
        querySnapshot.forEach((doc) => {
            notifications.push({ id: doc.id, ...doc.data() });
        });
        return notifications;
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        throw error;
    }
};

// ✅ Mark a notification as read
export const markNotificationAsRead = async (id) => {
    try {
        const docRef = doc(db, "notifications", id);
        await updateDoc(docRef, { read: true });
        console.log("Notification marked as read:", id);
    } catch (error) {
        console.error("Error marking notification as read:", error.message);
        throw error;
    }
};

// ✅ Delete a notification
export const deleteNotification = async (id) => {
    try {
        const docRef = doc(db, "notifications", id);
        await deleteDoc(docRef);
        console.log("Notification deleted:", id);
    } catch (error) {
        console.error("Error deleting notification:", error.message);
        throw error;
    }
};
//Cloudinary Upload
export const uploadImageToCloudinary = async (imageUri) => {
    const CLOUD_NAME = "dquqfgjjv";
    const UPLOAD_PRESET = "react_native_uploads";


    try {
       

        let data = new FormData();
        data.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: "upload.jpg",
        });
        data.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
           `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const result = await res.json();

        alert(result.secure_url)

        return result.secure_url; // 🔥 Cloudinary hosted URL
    } catch (err) {
        console.error("Cloudinary upload failed", err);
        throw err;
    }
};