// firestoreService.js
import {createUserWithEmailAndPassword,sendPasswordResetEmail,signInWithEmailAndPassword,signOut,updatePassword,reauthenticateWithCredential,EmailAuthProvider} from "firebase/auth";
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

// ✅ Send Seller Complaint to Admin
export const sendSellerComplaint = async (complaintData) => {
    try {
        const docRef = await addDoc(collection(db, "seller_complaints"), {
            ...complaintData,
            timestamp: Date.now(),
            status: "pending", // pending, in_progress, resolved
            priority: complaintData.priority || "medium", // low, medium, high
            createdAt: new Date().toISOString(),
            adminResponse: null,
            respondedAt: null,
        });
        console.log("Seller complaint sent to admin with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error sending seller complaint:", error);
        throw error;
    }
};

// ✅ Get Seller's Complaint History
export const getSellerComplaints = async (sellerId) => {
    try {
        const q = query(
            collection(db, "seller_complaints"), 
            where("sellerId", "==", sellerId),
            where("timestamp", ">=", 0) // Add ordering
        );
        const snap = await getDocs(q);
        const complaints = [];
        snap.forEach(d => complaints.push({ id: d.id, ...d.data() }));
        return complaints.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (error) {
        console.error("Error getting seller complaints:", error);
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
// 🔹 Complaint Management (Seller)
//--------------------------------

// ✅ Get all complaints for a seller
export const listComplaintsBySeller = async (sellerId) => {
    try {
        const q = query(collection(db, "complaints"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        return items;
    } catch (e) {
        console.error("Error listing complaints:", e);
        throw e;
    }
};

// ✅ Create a new complaint (usually from customer, but seller can create too)
export const createComplaint = async (sellerId, complaint) => {
    try {
        const payload = {
            ...complaint,
            sellerId,
            status: complaint?.status || "Open",
            priority: complaint?.priority || "Medium",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const ref = await addDoc(collection(db, "complaints"), payload);
        return ref.id;
    } catch (e) {
        console.error("Error creating complaint:", e);
        throw e;
    }
};

// ✅ Update complaint (status, response, etc.)
export const updateComplaint = async (id, updates) => {
    try {
        const payload = { 
            ...updates, 
            updatedAt: Date.now() 
        };
        await updateDoc(doc(db, "complaints", id), payload);
        return true;
    } catch (e) {
        console.error("Error updating complaint:", e);
        throw e;
    }
};

// ✅ Delete complaint
export const deleteComplaint = async (id) => {
    try {
        await deleteDoc(doc(db, "complaints", id));
        return true;
    } catch (e) {
        console.error("Error deleting complaint:", e);
        throw e;
    }
};

// ✅ Add response to complaint
export const addComplaintResponse = async (id, response) => {
    try {
        await updateDoc(doc(db, "complaints", id), {
            response,
            status: "In Progress",
            respondedAt: Date.now(),
            updatedAt: Date.now(),
        });
        return true;
    } catch (e) {
        console.error("Error adding complaint response:", e);
        throw e;
    }
};

// ✅ Mark complaint as resolved
export const resolveComplaint = async (id, resolution = "") => {
    try {
        await updateDoc(doc(db, "complaints", id), {
            status: "Resolved",
            resolution,
            resolvedAt: Date.now(),
            updatedAt: Date.now(),
        });
        return true;
    } catch (e) {
        console.error("Error resolving complaint:", e);
        throw e;
    }
};

// ✅ Add sample complaints for testing (remove this in production)
export const addSampleComplaints = async (sellerId) => {
    try {
        console.log("addSampleComplaints called with sellerId:", sellerId);
        
        if (!sellerId) {
            throw new Error("Seller ID is required");
        }
        
        const sampleComplaints = [
            {
                orderId: "ORD-1001",
                customer: "John Doe",
                customerEmail: "john@example.com",
                type: "Product Quality",
                priority: "High",
                description: "Received item with a tear on the sleeve. Very disappointed with the quality.",
                status: "Open"
            },
            {
                orderId: "ORD-1002", 
                customer: "Sarah Wilson",
                customerEmail: "sarah@example.com",
                type: "Late Delivery",
                priority: "Medium",
                description: "Order was supposed to be delivered on August 23rd but arrived 3 days late.",
                status: "In Progress",
                response: "We apologize for the delay. We've contacted the delivery service and are investigating."
            },
            {
                orderId: "ORD-1003",
                customer: "Mike Brown", 
                customerEmail: "mike@example.com",
                type: "Wrong Size",
                priority: "Low",
                description: "Ordered size M but received size L. Need to exchange.",
                status: "Resolved",
                response: "Exchange processed successfully. New item shipped.",
                resolution: "Customer satisfied with exchange process."
            }
        ];

        console.log("Creating", sampleComplaints.length, "sample complaints...");
        
        for (let i = 0; i < sampleComplaints.length; i++) {
            const complaint = sampleComplaints[i];
            console.log(`Creating complaint ${i + 1}:`, complaint);
            const complaintId = await createComplaint(sellerId, complaint);
            console.log('Complaint ${i + 1} created with ID:', complaintId);
        }
        
        console.log("All sample complaints added successfully!");
        return true;
    } catch (error) {
        console.error("Error adding sample complaints:", error);
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
};