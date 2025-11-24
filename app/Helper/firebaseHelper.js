// firestoreService.js
import { createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';

//--------------------------------
// 🔹 Firestore Services
//--------------------------------

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
        if (!collectionName) {
            console.error("getAllData: collectionName is required");
            return [];
        }
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (e) {
        console.error("Error getting documents from", collectionName, ":", e);
        return []; // Return empty array instead of undefined
    }
};

// ✅ Get single document
export const getDataById = async (collectionName, id) => {
    try {
        if (!collectionName || !id) {
            console.error("getDataById: collectionName and id are required");
            return null;
        }
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document in", collectionName, "with id:", id);
            return null;
        }
    } catch (e) {
        console.error("Error getting document from", collectionName, "with id", id, ":", e);
        return null; // Return null instead of undefined on error
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

// ✅ Re-authenticate User (required before sensitive operations)
export const reauthenticateUser = async (email, password) => {
    try {
        console.log('🔐 [REAUTH] Starting re-authentication for:', email);
        
        const user = auth.currentUser;
        if (!user) {
            console.error('🔐 [REAUTH] ERROR: No user is currently logged in');
            throw new Error("No user is currently logged in");
        }

        console.log('🔐 [REAUTH] Creating credential for user:', user.email);
        const credential = EmailAuthProvider.credential(email, password);
        
        console.log('🔐 [REAUTH] Attempting to reauthenticate...');
        await reauthenticateWithCredential(user, credential);
        
        console.log('🔐 [REAUTH] ✅ Re-authentication successful');
        return true;
    } catch (error) {
        console.error('🔐 [REAUTH] ❌ Re-authentication failed:', error.code, error.message);
        throw error;
    }
};

// ✅ Delete User Account (with proper order of operations)
export const deleteUserAccount = async (uid) => {
    try {
        console.log('🗑️ [DELETE] Starting account deletion for UID:', uid);
        
        const user = auth.currentUser;
        if (!user) {
            console.error('🗑️ [DELETE] ERROR: No user is currently logged in');
            throw new Error("No user is currently logged in");
        }

        if (user.uid !== uid) {
            console.error('🗑️ [DELETE] ERROR: UID mismatch - Current:', user.uid, 'Requested:', uid);
            throw new Error("User ID mismatch");
        }

        // Step 1: Get user data to check if seller
        console.log('🗑️ [DELETE] Step 1: Fetching user data...');
        const userDoc = await getDoc(doc(db, "users", uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        console.log('🗑️ [DELETE] User role:', userData?.role);

        // Step 2: Delete user data from Firestore FIRST
        console.log('🗑️ [DELETE] Step 2: Deleting user document from Firestore...');
        await deleteDoc(doc(db, "users", uid));
        console.log('🗑️ [DELETE] ✅ User document deleted from Firestore');

        // Step 3: If seller, also delete from sellers collection
        if (userData?.role === "Seller" && userData?.sellerId) {
            console.log('🗑️ [DELETE] Step 3: Deleting seller document for sellerId:', userData.sellerId);
            try {
                await deleteDoc(doc(db, "sellers", userData.sellerId));
                console.log('🗑️ [DELETE] ✅ Seller document deleted from Firestore');
            } catch (sellerError) {
                console.warn('🗑️ [DELETE] ⚠️ Seller document not found or already deleted');
            }
        } else {
            console.log('🗑️ [DELETE] Step 3: Skipped (not a seller account)');
        }

        // Step 4: Delete user from Firebase Auth LAST
        console.log('🗑️ [DELETE] Step 4: Deleting user from Firebase Auth...');
        await user.delete();
        console.log('🗑️ [DELETE] ✅ User deleted from Firebase Auth');

        console.log('🗑️ [DELETE] ✅ Account deletion completed successfully');
        return true;
    } catch (error) {
        console.error('🗑️ [DELETE] ❌ Account deletion failed:', error.code, error.message);
        throw error;
    }
};

// ✅ Delete Account (Legacy - kept for backward compatibility)
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
        if (!sellerId) {
            console.warn("getNotificationsBySeller: sellerId is required");
            return [];
        }
        const q = query(collection(db, "notifications"), where("sellerId", "==", sellerId));
        const querySnapshot = await getDocs(q);
        const notifications = [];
        querySnapshot.forEach((doc) => {
            notifications.push({ id: doc.id, ...doc.data() });
        });
        return notifications;
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        return []; // Return empty array on error
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
        if (!sellerId) {
            console.warn("listProductsBySeller: sellerId is required");
            return [];
        }
        const q = query(collection(db, "products"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        return items;
    } catch (e) {
        console.error("Error listing products by seller:", e);
        return [];
    }
};

// ✅ Add a new product
export const addProduct = async (productData) => {
    try {
        const product = {
            ...productData,
            status: 'pending', // Default status - pending admin approval
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        
        const docRef = await addDoc(collection(db, "products"), product);
        console.log("Product added with ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding product:", e);
        throw e;
    }
};

//--------------------------------
// 🔹 Categories Services
//--------------------------------

// ✅ Get all categories
export const getCategories = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ cid: doc.id, ...doc.data() });
        });
        return categories;
    } catch (error) {
        console.error('Error getting categories:', error);
        throw error;
    }
};

// ✅ Get product categories (synchronous) - Returns predefined categories
export const getProductCategories = () => {
    return [
        { id: 'formal', name: 'Formal' },
        { id: 'casual', name: 'Casual' },
        { id: 'traditional', name: 'Traditional' },
        { id: 'party', name: 'Party Wear' },
        { id: 'wedding', name: 'Wedding' },
        { id: 'sports', name: 'Sports' },
        { id: 'ethnic', name: 'Ethnic' },
        { id: 'seasonal', name: 'Seasonal' }
    ];
};

// ✅ Get category by CID
export const getCategoryByCid = async (cid) => {
    try {
        const docRef = doc(db, 'categories', cid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { cid: docSnap.id, ...docSnap.data() };
        } else {
            console.log('No such category!');
            return null;
        }
    } catch (error) {
        console.error('Error getting category:', error);
        throw error;
    }
};

// ✅ Get category by ID (alias for getCategoryByCid)
export const getCategoryById = async (id) => {
    return getCategoryByCid(id);
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
        if (!sellerId) {
            console.warn("listOrdersBySeller: sellerId is required");
            return [];
        }
        const q = query(collection(db, "orders"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(d => items.push({ id: d.id, ...d.data() }));
        return items;
    } catch (e) {
        console.error("Error listing orders:", e);
        return [];
    }
};

// Alias for backward compatibility
export const getOrdersBySeller = listOrdersBySeller;

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
            const userData = { uid, ...snap.data() };
            
            // If user is a seller, also fetch seller data for up-to-date status
            if (userData.role === "Seller" && userData.sellerId) {
                try {
                    console.log('getUserProfile: Fetching seller data for sellerId:', userData.sellerId);
                    const sellerDoc = await getDoc(doc(db, "sellers", userData.sellerId));
                    if (sellerDoc.exists()) {
                        const sellerData = sellerDoc.data();
                        console.log('getUserProfile: Fetched seller data:', sellerData);
                        
                        // Merge seller data with user data (prioritize seller data for status)
                        const mergedData = {
                            ...userData,
                            ...sellerData,
                            uid: userData.uid, // Keep original uid
                            status: sellerData.status || userData.status // Use seller status if available
                        };
                        console.log('getUserProfile: Merged data with status:', mergedData.status);
                        return mergedData;
                    }
                } catch (sellerError) {
                    console.error("getUserProfile: Error fetching seller data:", sellerError);
                    // Return user data even if seller data fetch fails
                }
            }
            
            return userData;
        }
        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null; // Return null instead of throwing error
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

// ✅ Update terms of service (admin only)
export const updateTermsOfService = async (termsData) => {
    try {
        const docRef = doc(db, "legal_documents", "terms_of_service");
        await setDoc(docRef, {
            ...termsData,
            updatedAt: new Date().toISOString(),
            updatedBy: "admin"
        }, { merge: true });
        console.log("Terms of service updated successfully");
        return true;
    } catch (error) {
        console.error("Error updating terms of service:", error);
        throw error;
    }
};

// ✅ Submit customer complaint
export const submitCustomerComplaint = async (complaintData) => {
    try {
        const docRef = await addDoc(collection(db, "customer_complaints"), {
            ...complaintData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log("Customer complaint submitted with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error submitting customer complaint:", error);
        throw error;
    }
};

// ✅ Submit seller complaint
export const submitSellerComplaint = async (complaintData) => {
    try {
        const docRef = await addDoc(collection(db, "seller_complaints"), {
            ...complaintData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log("Seller complaint submitted with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error submitting seller complaint:", error);
        throw error;
    }
};

export const getSellerComplaints = async (sellerId) => {
    try {
        const q = query(collection(db, "seller_complaints"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const complaints = [];
        snap.forEach(d => complaints.push({ id: d.id, ...d.data() }));
        return complaints;
    } catch (error) {
        console.error("Error getting seller complaints:", error);
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
// 🔹 Customer Profile Management Services
//--------------------------------

// ✅ Get customer profile data
export const getCustomerProfile = async (userId) => {
    try {
        if (!userId) {
            console.warn('getCustomerProfile: No userId provided');
            return null;
        }

        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            // Ensure all fields are properly typed
            return {
                uid: data.uid || userId,
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                profileImageUrl: data.profileImageUrl || null,
                ...data
            };
        }
        console.warn(`getCustomerProfile: No document found for userId: ${userId}`);
        return null;
    } catch (error) {
        console.error('Error getting customer profile:', error);
        throw error;
    }
};

// ✅ Update customer profile data
export const updateCustomerProfile = async (userId, profileData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...profileData,
            updatedAt: new Date().toISOString()
        });
        console.log('Customer profile updated successfully');
        return true;
    } catch (error) {
        console.error('Error updating customer profile:', error);
        throw error;
    }
};

// ✅ Upload customer profile image to Firebase Storage
export const uploadCustomerProfileImage = async (userId, imageUri) => {
    try {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const imageRef = ref(storage, `customer_profiles/${userId}/profile_image`);
        await uploadBytes(imageRef, blob);

        const downloadURL = await getDownloadURL(imageRef);
        console.log('Customer profile image uploaded successfully');

        // Update user document with image URL
        await updateCustomerProfile(userId, { profileImageUrl: downloadURL });

        return downloadURL;
    } catch (error) {
        console.error('Error uploading customer profile image:', error);
        throw error;
    }
};

// ✅ Delete customer profile image from Firebase Storage
export const deleteCustomerProfileImage = async (userId) => {
    try {
        const imageRef = ref(storage, `customer_profiles/${userId}/profile_image`);
        await deleteObject(imageRef);
        console.log('Customer profile image deleted successfully');

        // Update user document to remove image URL
        await updateCustomerProfile(userId, { profileImageUrl: null });

        return true;
    } catch (error) {
        console.error('Error deleting customer profile image:', error);
        throw error;
    }
};

// ✅ Save cart to Firebase
export const saveCartToFirebase = async (userId, cartItems) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            cart: cartItems,
            cartUpdatedAt: new Date().toISOString()
        });
        console.log('Cart saved to Firebase');
        return true;
    } catch (error) {
        console.error('Error saving cart to Firebase:', error);
        throw error;
    }
};

// ✅ Load cart from Firebase
export const loadCartFromFirebase = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.cart || [];
        }
        return [];
    } catch (error) {
        console.error('Error loading cart from Firebase:', error);
        return [];
    }
};

// ✅ Clear cart from Firebase
export const clearCartFromFirebase = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            cart: [],
            cartUpdatedAt: new Date().toISOString()
        });
        console.log('Cart cleared from Firebase');
        return true;
    } catch (error) {
        console.error('Error clearing cart from Firebase:', error);
        throw error;
    }
};

// ✅ Create order with pending status (requires seller approval)
export const createOrder = async (orderData) => {
    try {
        const order = {
            ...orderData,
            status: 'pending', // Default status - pending seller approval
            orderDate: new Date().toISOString(),
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        const docRef = await addDoc(collection(db, 'orders'), order);
        console.log('Order created with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// ✅ Get orders by customer ID (for customer order management)
export const getOrdersByCustomer = async (customerId) => {
    try {
        const q = query(collection(db, 'orders'), where('customerId', '==', customerId));
        const querySnapshot = await getDocs(q);
        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        return orders.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
        console.error('Error getting orders by customer:', error);
        throw error;
    }
};

// ✅ Update order status (for seller approval)
export const updateOrderStatus = async (orderId, status, sellerNotes = '') => {
    try {
        const updateData = {
            status: status,
            updatedAt: Date.now()
        };

        if (sellerNotes) {
            updateData.sellerNotes = sellerNotes;
        }

        if (status === 'approved') {
            updateData.approvedAt = new Date().toISOString();
        } else if (status === 'rejected') {
            updateData.rejectedAt = new Date().toISOString();
        }

        await updateDoc(doc(db, 'orders', orderId), updateData);
        console.log(`Order ${orderId} status updated to: ${status}`);
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

// ✅ Get all products (for admin/browsing)
export const getAllProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error('Error getting all products:', error);
        throw error;
    }
};

// ✅ Get products by category ID
export const getProductsByCategory = async (categoryId) => {
    try {
        const q = query(collection(db, 'products'), where('categoryId', '==', categoryId), where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error('Error getting products by category:', error);
        throw error;
    }
};

// ✅ Get products by category name
export const getProductsByCategoryName = async (categoryName) => {
    try {
        const q = query(collection(db, 'products'), where('categoryName', '==', categoryName), where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error('Error getting products by category name:', error);
        throw error;
    }
};

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (imageUri) => {
    try {
        const formData = new FormData();
        formData.append('file', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'profile.jpg',
        });
        // Unsigned upload preset configured in Cloudinary
        formData.append('upload_preset', 'react_native_uploads');
        // Optional: keep uploads organized
        formData.append('folder', 'my-app/profiles/customers');

        // IMPORTANT: Do NOT set Content-Type manually; let fetch set the correct multipart boundary
        const response = await fetch('https://api.cloudinary.com/v1_1/drrr99dz9/image/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            const message = data?.error?.message || JSON.stringify(data);
            throw new Error(`Cloudinary upload failed: ${message}`);
        }

        if (data?.secure_url) {
            return data.secure_url;
        }

        throw new Error('Cloudinary upload failed: missing secure_url in response');
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error?.message || error);
        throw error;
    }
};

//--------------------------------
// 🔹 Customer Review Services
//--------------------------------

// ✅ Submit customer review for a product
export const submitCustomerReview = async (reviewData) => {
    try {
        const docRef = await addDoc(collection(db, "customer_reviews"), {
            ...reviewData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active', // active, hidden, reported
        });
        console.log("Customer review submitted with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error submitting customer review:", error);
        throw error;
    }
};

// ✅ Get all reviews for a specific product
export const getProductReviews = async (productId) => {
    try {
        const q = query(collection(db, "customer_reviews"), where("productId", "==", productId));
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
        });

        // Sort by creation date (newest first)
        return reviews.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error getting product reviews:", error);
        throw error;
    }
};

// ✅ Get all reviews by a specific customer
export const getCustomerReviews = async (customerId) => {
    try {
        const q = query(collection(db, "customer_reviews"), where("customerId", "==", customerId));
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
        });

        // Sort by creation date (newest first)
        return reviews.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error getting customer reviews:", error);
        throw error;
    }
};

// ✅ Get all reviews (for admin/moderation)
export const getAllReviews = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "customer_reviews"));
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
        });

        // Sort by creation date (newest first)
        return reviews.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
    } catch (error) {
        console.error("Error getting all reviews:", error);
        throw error;
    }
};

// ✅ Update review (for editing)
export const updateCustomerReview = async (reviewId, updateData) => {
    try {
        const reviewRef = doc(db, "customer_reviews", reviewId);
        await updateDoc(reviewRef, {
            ...updateData,
            updatedAt: new Date().toISOString()
        });
        console.log("Customer review updated successfully");
        return true;
    } catch (error) {
        console.error("Error updating customer review:", error);
        throw error;
    }
};

// ✅ Delete customer review
export const deleteCustomerReview = async (reviewId) => {
    try {
        await deleteDoc(doc(db, "customer_reviews", reviewId));
        console.log("Customer review deleted successfully");
        return true;
    } catch (error) {
        console.error("Error deleting customer review:", error);
        throw error;
    }
};

// ✅ Report inappropriate review (for moderation)
export const reportReview = async (reviewId, reason, reportedBy) => {
    try {
        const reviewRef = doc(db, "customer_reviews", reviewId);
        await updateDoc(reviewRef, {
            status: 'reported',
            reportReason: reason,
            reportedBy: reportedBy,
            reportedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log("Review reported successfully");
        return true;
    } catch (error) {
        console.error("Error reporting review:", error);
        throw error;
    }
};

// ✅ Get review statistics for a product
export const getProductReviewStats = async (productId) => {
    try {
        const reviews = await getProductReviews(productId);

        if (reviews.length === 0) {
            return {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }

        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = totalRating / reviews.length;

        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviews.forEach(review => {
            const rating = Math.round(review.rating || 0);
            if (rating >= 1 && rating <= 5) {
                ratingDistribution[rating]++;
            }
        });

        return {
            totalReviews: reviews.length,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingDistribution
        };
    } catch (error) {
        console.error("Error getting product review stats:", error);
        throw error;
    }
};
