// firestoreService.js
import { createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
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
            // Add status field for sellers - default is "pending"
            status: extraData.role === "Seller" ? "pending" : "active",
        };

        await setDoc(doc(db, "users", user.uid), userData);

        // If Seller, also create/merge a sellers/{sellerId} doc for settings/dashboard consistency
        if (extraData.role === "Seller") {
            await setDoc(doc(db, "sellers", sellerId), {
                uid: user.uid,
                sellerId,
                name: extraData.name || "",
                email: user.email,
                address: extraData.address || "",
                notificationsEnabled: true,
                status: "pending",
                role:"Seller",
                createdAt: new Date().toISOString(),
            }, { merge: true });
        }
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
            const userData = { uid: firebaseUser.uid, ...userDoc.data() };
            
            // If user is a seller, also fetch seller data for up-to-date status
            if (userData.role === "Seller" && userData.sellerId) {
                try {
                    console.log('Fetching seller data for sellerId:', userData.sellerId);
                    const sellerDoc = await getDoc(doc(db, "sellers", userData.sellerId));
                    if (sellerDoc.exists()) {
                        const sellerData = sellerDoc.data();
                        console.log('Fetched seller data:', sellerData);
                        
                        // Merge seller data with user data (prioritize seller data for status)
                        const mergedData = {
                            ...userData,
                            ...sellerData,
                            uid: userData.uid, // Keep original uid
                            status: sellerData.status || userData.status // Use seller status if available
                        };
                        console.log('=== Login Function Debug ===');
                        console.log('Original userData:', JSON.stringify(userData, null, 2));
                        console.log('Seller data:', JSON.stringify(sellerData, null, 2));
                        console.log('Merged data:', JSON.stringify(mergedData, null, 2));
                        console.log('Final status:', mergedData.status);
                        console.log('=== End Login Function Debug ===');
                        return mergedData;
                    }
                } catch (sellerError) {
                    console.error("Error fetching seller data:", sellerError);
                    // Return user data even if seller data fetch fails
                }
            }
            
            return userData;
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
        if (!email) {
            throw new Error("Email is required");
        }
        
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent to:", email);
        return true;
    } catch (error) {
        console.error("Error sending reset email:", error.code, error.message);
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

//--------------------------------
// 🔹 Products (Seller)
//--------------------------------

export const listProductsBySeller = async (sellerId) => {
    try {
        const q = query(collection(db, "products"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        return items;
    } catch (e) {
        console.error("Error listing products:", e);
        throw e;
    }
};

//--------------------------------
// 🔹 Product Categories
//--------------------------------

export const PRODUCT_CATEGORIES = [
    { 
        id: 'CAT-001', 
        name: 'Mehndi', 
        description: 'Traditional Mehndi ceremony outfits',
        color: '#E67E22' 
    },
    { 
        id: 'CAT-002', 
        name: 'Barat', 
        description: 'Wedding ceremony dresses',
        color: '#8E44AD' 
    },
    { 
        id: 'CAT-003', 
        name: 'Walima', 
        description: 'Reception party attire',
        color: '#3498DB' 
    },
    { 
        id: 'CAT-004', 
        name: 'Festival', 
        description: 'Festival and celebration wear',
        color: '#E74C3C' 
    }
];

export const getProductCategories = () => PRODUCT_CATEGORIES;

export const getCategoryById = (id) => PRODUCT_CATEGORIES.find(c => c.id === id);

export const getCategoryByName = (name) => PRODUCT_CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase());

export const addProduct = async (sellerId, product) => {
    try {
        const payload = { 
            ...product, 
            sizes: product?.sizes || ["S","M","L"],
            stock: product?.stock || {},
            securityFee: Number(product?.securityFee || 0),
            categoryId: product?.categoryId || '',
            categoryName: product?.categoryName || '',
            status: 'pending', // All products need admin approval
            sellerId, 
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        const ref = await addDoc(collection(db, "products"), payload);
        return ref.id;
    } catch (e) {
        console.error("Error adding product:", e);
        throw e;
    }
};

export const updateProduct = async (id, updates) => {
    try {
        const payload = { ...updates };
        if (payload.securityFee !== undefined) payload.securityFee = Number(payload.securityFee) || 0;
        await updateDoc(doc(db, "products", id), payload);
    } catch (e) {
        console.error("Error updating product:", e);
        throw e;
    }
};

export const deleteProduct = async (id) => {
    try {
        await deleteDoc(doc(db, "products", id));
    } catch (e) {
        console.error("Error deleting product:", e);
        throw e;
    }
};

//--------------------------------
// 🔹 Logistics: Pickups, Deliveries, Orders (Seller)
//--------------------------------

export const listPickupsBySeller = async (sellerId) => {
    try {
        const q = query(collection(db, "pickups"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        return items;
    } catch (e) {
        console.error("Error listing pickups:", e);
        throw e;
    }
};

export const createPickup = async (sellerId, payload) => {
    try {
        const data = { ...payload, sellerId, createdAt: Date.now(), status: payload?.status || 'Pending' };
        const ref = await addDoc(collection(db, "pickups"), data);
        return ref.id;
    } catch (e) {
        console.error("Error creating pickup:", e);
        throw e;
    }
};

export const updatePickup = async (id, updates) => {
    try {
        await updateDoc(doc(db, "pickups", id), updates);
    } catch (e) {
        console.error("Error updating pickup:", e);
        throw e;
    }
};

export const listDeliveriesBySeller = async (sellerId) => {
    try {
        const q = query(collection(db, "deliveries"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        return items;
    } catch (e) {
        console.error("Error listing deliveries:", e);
        throw e;
    }
};

export const updateDelivery = async (id, updates) => {
    try {
        await updateDoc(doc(db, "deliveries", id), updates);
    } catch (e) {
        console.error("Error updating delivery:", e);
        throw e;
    }
};

export const listOrdersBySeller = async (sellerId) => {
    try {
        const q = query(collection(db, "orders"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        return items;
    } catch (e) {
        console.error("Error listing orders:", e);
        throw e;
    }
};

export const updateOrder = async (id, updates) => {
    try {
        await updateDoc(doc(db, "orders", id), updates);
    } catch (e) {
        console.error("Error updating order:", e);
        throw e;
    }
};

//--------------------------------
// 🔹 Profile Services (Missing Functions)
//--------------------------------

// ✅ Get user profile by UID
export const getUserProfile = async (uid) => {
    try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            return { uid, ...snap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
};

// ✅ Update user profile (safe merge)
export const updateUserProfile = async (uid, data) => {
    try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, { ...data, updatedAt: Date.now() }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

//--------------------------------
// 🔹 Account Settings Services
//--------------------------------

// ✅ Change Password
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No user is currently logged in");
        }

        // Re-authenticate user with current password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);
        console.log("Password updated successfully");
        return true;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};

// ✅ Send Support Email
export const sendSupportEmail = async (supportData) => {
    try {
        const docRef = await addDoc(collection(db, "support_emails"), {
            ...supportData,
            timestamp: Date.now(),
            status: "pending",
            createdAt: new Date().toISOString(),
        });
        console.log("Support email sent with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error sending support email:", error);
        throw error;
    }
};

// ✅ Get seller reviews
export const getSellerReviews = async (sellerId) => {
    try {
        const q = query(collection(db, "reviews"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const reviews = [];
        snap.forEach(d => reviews.push({ id: d.id, ...d.data() }));
        return reviews;
    } catch (error) {
        console.error("Error getting seller reviews:", error);
        throw error;
    }
};

// ✅ Add response to review
export const addReviewResponse = async (reviewId, response) => {
    try {
        await updateDoc(doc(db, "reviews", reviewId), {
            sellerResponse: response,
            respondedAt: new Date().toISOString()
        });
        console.log("Review response added successfully");
    } catch (error) {
        console.error("Error adding review response:", error);
        throw error;
    }
};

// ✅ Get Seller Notification Settings
export const getSellerNotificationSettings = async (sellerId) => {
    try {
        const docRef = doc(db, "seller_notification_settings", sellerId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // Return default settings if none exist
            const defaultSettings = {
                orders: true,
                payments: true,
                reviews: true,
                reminders: true
            };
            
            // Create default settings in database
            await setDoc(docRef, {
                ...defaultSettings,
                sellerId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            return defaultSettings;
        }
    } catch (error) {
        console.error("Error getting notification settings:", error);
        throw error;
    }
};

// ✅ Update Seller Notification Settings
export const updateSellerNotificationSettings = async (sellerId, settings) => {
    try {
        const docRef = doc(db, "seller_notification_settings", sellerId);
        await updateDoc(docRef, {
            ...settings,
            updatedAt: new Date().toISOString()
        });
        console.log("Notification settings updated successfully");
    } catch (error) {
        console.error("Error updating notification settings:", error);
        throw error;
    }
};

// ✅ Get help center articles
export const getHelpArticles = async () => {
    try {
        const snap = await getDocs(collection(db, "help_articles"));
        const articles = [];
        snap.forEach(d => articles.push({ id: d.id, ...d.data() }));
        return articles.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error("Error getting help articles:", error);
        throw error;
    }
};

// ✅ Get privacy policy
export const getPrivacyPolicy = async () => {
    try {
        const docRef = doc(db, "legal_documents", "privacy_policy");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            return snap.data();
        }
        return null;
    } catch (error) {
        console.error("Error getting privacy policy:", error);
        throw error;
    }
};

// ✅ Get terms of service
export const getTermsOfService = async () => {
    try {
        const docRef = doc(db, "legal_documents", "terms_of_service");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            return snap.data();
        }
        return null;
    } catch (error) {
        console.error("Error getting terms of service:", error);
        throw error;
    }
};

//--------------------------------
// 🔹 Sample Data for Testing
//--------------------------------

// ✅ Add sample orders for testing
export const addSampleOrders = async (sellerId) => {
  try {
    const sampleOrders = [
      {
        id: "ORD-001",
        customer: "Ahmed Hassan",
        address: "Block A, Gulberg III, Lahore",
        items: ["Blue Formal Shirt", "Black Dress Pants"],
        payment: "Rs. 2,500 (COD)",
        status: "Pending",
        createdAt: Date.now() - 86400000, // 1 day ago
        sellerId: sellerId
      },
      {
        id: "ORD-002", 
        customer: "Fatima Khan",
        address: "DHA Phase 5, Karachi",
        items: ["Red Evening Dress", "Gold Jewelry Set"],
        payment: "Rs. 4,200 (COD)",
        status: "Delivered",
        createdAt: Date.now() - 172800000, // 2 days ago
        sellerId: sellerId
      },
      {
        id: "ORD-003",
        customer: "Ali Raza",
        address: "F-8 Markaz, Islamabad", 
        items: ["Wedding Sherwani", "Khussa Shoes"],
        payment: "Rs. 6,800 (COD)",
        status: "Pending",
        createdAt: Date.now() - 43200000, // 12 hours ago
        sellerId: sellerId
      },
      {
        id: "ORD-004",
        customer: "Ayesha Malik",
        address: "Cantt Area, Rawalpindi",
        items: ["Party Lehenga"],
        payment: "Rs. 3,500 (COD)",
        status: "Canceled",
        createdAt: Date.now() - 259200000, // 3 days ago
        sellerId: sellerId
      }
    ];

    for (const order of sampleOrders) {
      await addDoc(collection(db, "orders"), order);
    }
    
    console.log("Sample orders added successfully!");
    return true;
  } catch (error) {
    console.error("Error adding sample orders:", error);
    throw error;
  }
};

// ✅ Add sample deliveries for testing
export const addSampleDeliveries = async (sellerId) => {
  try {
    const sampleDeliveries = [
      {
        id: "DEL-001",
        orderId: "ORD-001",
        customer: "Ahmed Hassan",
        address: "Block A, Gulberg III, Lahore",
        items: ["Blue Formal Shirt", "Black Dress Pants"],
        status: "Scheduled",
        rider: "Muhammad Usman",
        riderPhone: "+92 300 1234567",
        scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        createdAt: Date.now() - 86400000,
        sellerId: sellerId
      },
      {
        id: "DEL-002",
        orderId: "ORD-002", 
        customer: "Fatima Khan",
        address: "DHA Phase 5, Karachi",
        items: ["Red Evening Dress", "Gold Jewelry Set"],
        status: "Delivered",
        rider: "Hassan Ali",
        riderPhone: "+92 301 9876543",
        scheduledDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        deliveredAt: Date.now() - 43200000, // 12 hours ago
        createdAt: Date.now() - 172800000,
        sellerId: sellerId
      },
      {
        id: "DEL-003",
        orderId: "ORD-003",
        customer: "Ali Raza", 
        address: "F-8 Markaz, Islamabad",
        items: ["Wedding Sherwani", "Khussa Shoes"],
        status: "In Transit",
        rider: "Tariq Mahmood",
        riderPhone: "+92 302 5555555",
        scheduledDate: new Date().toISOString(), // Today
        createdAt: Date.now() - 43200000,
        sellerId: sellerId
      },
      {
        id: "DEL-004",
        orderId: "ORD-005",
        customer: "Sara Ahmed",
        address: "Model Town, Lahore",
        items: ["Bridal Dress", "Matching Dupatta"],
        status: "Failed",
        rider: "Imran Sheikh",
        riderPhone: "+92 303 7777777",
        scheduledDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        failureReason: "Customer not available",
        createdAt: Date.now() - 259200000,
        sellerId: sellerId
      }
    ];

    for (const delivery of sampleDeliveries) {
      await addDoc(collection(db, "deliveries"), delivery);
    }
    
    console.log("Sample deliveries added successfully!");
    return true;
  } catch (error) {
    console.error("Error adding sample deliveries:", error);
    throw error;
  }
};

//--------------------------------
// 🔹 Seller Status Management
//--------------------------------

// ✅ Get seller status by sellerId from sellers collection
export const getSellerStatus = async (sellerId) => {
    try {
        const sellerDoc = await getDoc(doc(db, "sellers", sellerId));
        if (sellerDoc.exists()) {
            return sellerDoc.data().status || "pending";
        }
        return "pending";
    } catch (error) {
        console.error("Error getting seller status:", error);
        throw error;
    }
};

// ✅ Get seller data by sellerId from sellers collection
export const getSellerData = async (sellerId) => {
    try {
        const sellerDoc = await getDoc(doc(db, "sellers", sellerId));
        if (sellerDoc.exists()) {
            return { sellerId, ...sellerDoc.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting seller data:", error);
        throw error;
    }
};

// ✅ Update seller status (approve/reject/pending)
export const updateSellerStatus = async (sellerId, status, adminNotes = "") => {
    try {
        const sellerRef = doc(db, "sellers", sellerId);
        const updateData = {
            status: status, // "approved", "rejected", "pending"
            statusUpdatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (adminNotes) {
            updateData.adminNotes = adminNotes;
        }

        await updateDoc(sellerRef, updateData);

        // Also update the users collection to maintain consistency
        const sellerData = await getSellerData(sellerId);
        if (sellerData && sellerData.uid) {
            const userRef = doc(db, "users", sellerData.uid);
            await updateDoc(userRef, {
                status: status,
                statusUpdatedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        console.log(`Seller ${sellerId} status updated to: ${status}`);
        return true;
    } catch (error) {
        console.error("Error updating seller status:", error);
        throw error;
    }
};

// ✅ Approve seller account
export const approveSeller = async (sellerId, adminNotes = "Account approved by admin") => {
    try {
        await updateSellerStatus(sellerId, "approved", adminNotes);
        
        // Add notification for seller
        await addNotification(sellerId, "account", "🎉 Your seller account has been approved! You can now access all features.");
        
        console.log(`Seller ${sellerId} approved successfully`);
        return true;
    } catch (error) {
        console.error("Error approving seller:", error);
        throw error;
    }
};

// ✅ Reject seller account
export const rejectSeller = async (sellerId, adminNotes = "Account rejected by admin") => {
    try {
        await updateSellerStatus(sellerId, "rejected", adminNotes);
        
        // Add notification for seller
        await addNotification(sellerId, "account", "❌ Your seller account application has been rejected. Please contact support for more information.");
        
        console.log(`Seller ${sellerId} rejected`);
        return true;
    } catch (error) {
        console.error("Error rejecting seller:", error);
        throw error;
    }
};

// ✅ Get all sellers with specific status
export const getSellersByStatus = async (status = "all") => {
    try {
        let q;
        if (status === "all") {
            q = collection(db, "sellers");
        } else {
            q = query(collection(db, "sellers"), where("status", "==", status));
        }
        
        const querySnapshot = await getDocs(q);
        const sellers = [];
        querySnapshot.forEach((doc) => {
            sellers.push({ sellerId: doc.id, ...doc.data() });
        });
        
        // Sort by creation date (newest first)
        return sellers.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error getting sellers by status:", error);
        throw error;
    }
};

// ✅ Get all approved sellers for display
export const getApprovedSellers = async () => {
    try {
        return await getSellersByStatus("approved");
    } catch (error) {
        console.error("Error getting approved sellers:", error);
        throw error;
    }
};

// ✅ Get all pending sellers for admin review
export const getPendingSellers = async () => {
    try {
        return await getSellersByStatus("pending");
    } catch (error) {
        console.error("Error getting pending sellers:", error);
        throw error;
    }
};

// ✅ Get seller statistics
export const getSellerStats = async () => {
    try {
        const allSellers = await getSellersByStatus("all");
        const approved = allSellers.filter(s => s.status === "approved").length;
        const pending = allSellers.filter(s => s.status === "pending").length;
        const rejected = allSellers.filter(s => s.status === "rejected").length;
        
        return {
            total: allSellers.length,
            approved,
            pending,
            rejected
        };
    } catch (error) {
        console.error("Error getting seller stats:", error);
        throw error;
    }
}

//--------------------------------
// 🔹 Stock Management Services
//--------------------------------

// Automatically manage available sizes based on stock levels
export const getAvailableSizes = (stock) => {
    const allSizes = ['S', 'M', 'L', 'XL'];
    return allSizes.filter(size => {
        const qty = Number(stock?.[size] || 0);
        return qty > 0; // Only show sizes that have stock
    });
};

// Update stock and automatically adjust available sizes
export const updateProductStock = async (productId, newStock) => {
    try {
        const availableSizes = getAvailableSizes(newStock);
        
        const updateData = {
            stock: newStock,
            sizes: availableSizes, // Automatically update available sizes
            lastStockUpdate: new Date().toISOString()
        };
        
        await updateProduct(productId, updateData);
        return { success: true, availableSizes };
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
};

// Reduce stock when item is rented (for future use)
export const reduceStock = async (productId, size, quantity = 1) => {
    try {
        const productDoc = await getDoc(doc(db, 'products', productId));
        if (!productDoc.exists()) {
            throw new Error('Product not found');
        }
        
        const product = productDoc.data();
        const currentStock = product.stock || {};
        const currentQty = Number(currentStock[size] || 0);
        
        if (currentQty < quantity) {
            throw new Error(`Insufficient stock for size ${size}`);
        }
        
        const newStock = {
            ...currentStock,
            [size]: Math.max(0, currentQty - quantity)
        };
        
        return await updateProductStock(productId, newStock);
    } catch (error) {
        console.error('Error reducing stock:', error);
        throw error;
    }
};

//--------------------------------
// 🔹 Image Upload Services
//--------------------------------

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (imageUri) => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'profile.jpg',
        });
        formData.append('upload_preset', 'react_native_uploads');

        const response = await fetch('https://api.cloudinary.com/v1_1/drrr99dz9/image/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const data = await response.json();
        
        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};