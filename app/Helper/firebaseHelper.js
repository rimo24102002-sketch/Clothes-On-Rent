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

// ✅ Re-authenticate user before sensitive operations
export const reauthenticateUser = async (email, password) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No user is currently logged in");
        }

        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        console.log("User re-authenticated successfully");
    } catch (error) {
        console.error("Error re-authenticating user:", error.message);
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
// 🔹 Product Categories
//--------------------------------

// ✅ Predefined categories for the app
export const PRODUCT_CATEGORIES = [
    { id: 'CAT-001', name: 'Mehndi', description: 'Traditional Mehndi ceremony outfits', color: '#E67E22' },
    { id: 'CAT-002', name: 'Barat', description: 'Wedding ceremony dresses', color: '#8E44AD' },
    { id: 'CAT-003', name: 'Walima', description: 'Reception party attire', color: '#3498DB' },
    { id: 'CAT-004', name: 'Festival', description: 'Festival and celebration wear', color: '#E74C3C' }
];

// ✅ Get all categories
export const getProductCategories = () => {
    return PRODUCT_CATEGORIES;
};

// ✅ Get category by ID
export const getCategoryById = (categoryId) => {
    return PRODUCT_CATEGORIES.find(cat => cat.id === categoryId) || null;
};

// ✅ Get category by name
export const getCategoryByName = (categoryName) => {
    return PRODUCT_CATEGORIES.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase()) || null;
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

export const addProduct = async (sellerId, product) => {
    try {
        const payload = { 
            ...product, 
            sizes: product?.sizes || ["S","M","L"],
            securityFee: Number(product?.securityFee || 0),
            sellerId, 
            createdAt: Date.now() 
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


// ✅ Get seller reviews with product information
export const getSellerReviews = async (sellerId) => {
    try {
        const q = query(collection(db, "reviews"), where("sellerId", "==", sellerId));
        const snap = await getDocs(q);
        const reviews = [];
        
        // Fetch reviews with product details
        for (const docSnap of snap.docs) {
            const reviewData = { id: docSnap.id, ...docSnap.data() };
            
            // If review has productId, fetch product details
            if (reviewData.productId) {
                try {
                    const productDoc = await getDoc(doc(db, "products", reviewData.productId));
                    if (productDoc.exists()) {
                        const productData = productDoc.data();
                        reviewData.productName = productData.name;
                        reviewData.productImage = productData.imageUrl;
                        reviewData.productCategory = productData.category;
                        reviewData.productPrice = productData.price;
                    }
                } catch (productError) {
                    console.error("Error fetching product for review:", productError);
                    // Continue without product info if fetch fails
                }
            }
            
            reviews.push(reviewData);
        }
        
        return reviews.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
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
// 🔹 Order Tracking System
//--------------------------------

// ✅ Create order with tracking
export const createOrderWithTracking = async (orderData) => {
    try {
        const orderId = `ORD-${Date.now()}`;
        const trackingData = {
            orderId,
            status: "Order Placed",
            timeline: [
                {
                    status: "Order Placed",
                    timestamp: Date.now(),
                    description: "Order has been placed successfully",
                    location: "Online",
                    isCompleted: true
                },
                {
                    status: "Order Confirmed",
                    timestamp: null,
                    description: "Seller has confirmed your order",
                    location: "Seller Location",
                    isCompleted: false
                },
                {
                    status: "Preparing",
                    timestamp: null,
                    description: "Order is being prepared for pickup/delivery",
                    location: "Seller Location",
                    isCompleted: false
                },
                {
                    status: "Ready for Pickup/Delivery",
                    timestamp: null,
                    description: "Order is ready for pickup or delivery",
                    location: "Seller Location",
                    isCompleted: false
                },
                {
                    status: "Out for Delivery",
                    timestamp: null,
                    description: "Order is out for delivery",
                    location: "In Transit",
                    isCompleted: false
                },
                {
                    status: "Delivered",
                    timestamp: null,
                    description: "Order has been delivered successfully",
                    location: "Customer Location",
                    isCompleted: false
                }
            ],
            estimatedDelivery: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 days from now
            deliveryType: orderData.deliveryType || "Standard",
            trackingNumber: `TRK-${Date.now()}`,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // Create order
        const orderRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            orderId,
            trackingNumber: trackingData.trackingNumber,
            status: "Order Placed",
            createdAt: Date.now()
        });

        // Create tracking record
        await setDoc(doc(db, "order_tracking", orderId), trackingData);

        return { orderId, trackingNumber: trackingData.trackingNumber, orderDocId: orderRef.id };
    } catch (error) {
        console.error("Error creating order with tracking:", error);
        throw error;
    }
};

// ✅ Update order tracking status
export const updateOrderTracking = async (orderId, newStatus, location = "", description = "") => {
    try {
        const trackingRef = doc(db, "order_tracking", orderId);
        const trackingDoc = await getDoc(trackingRef);
        
        if (!trackingDoc.exists()) {
            throw new Error("Tracking record not found");
        }

        const trackingData = trackingDoc.data();
        const timeline = [...trackingData.timeline];
        
        // Find and update the current status
        const currentIndex = timeline.findIndex(item => item.status === newStatus);
        if (currentIndex !== -1) {
            timeline[currentIndex] = {
                ...timeline[currentIndex],
                timestamp: Date.now(),
                description: description || timeline[currentIndex].description,
                location: location || timeline[currentIndex].location,
                isCompleted: true
            };

            // Mark previous statuses as completed
            for (let i = 0; i < currentIndex; i++) {
                timeline[i].isCompleted = true;
                if (!timeline[i].timestamp) {
                    timeline[i].timestamp = Date.now() - (currentIndex - i) * 60000; // Stagger timestamps
                }
            }
        }

        await updateDoc(trackingRef, {
            status: newStatus,
            timeline,
            updatedAt: Date.now()
        });

        // Also update the main order status
        const orderQuery = query(collection(db, "orders"), where("orderId", "==", orderId));
        const orderSnapshot = await getDocs(orderQuery);
        
        if (!orderSnapshot.empty) {
            const orderDoc = orderSnapshot.docs[0];
            await updateDoc(doc(db, "orders", orderDoc.id), {
                status: newStatus,
                updatedAt: Date.now()
            });
        }

        console.log(`Order ${orderId} tracking updated to: ${newStatus}`);
        return true;
    } catch (error) {
        console.error("Error updating order tracking:", error);
        throw error;
    }
};

// ✅ Get order tracking by order ID
export const getOrderTracking = async (orderId) => {
    try {
        const trackingRef = doc(db, "order_tracking", orderId);
        const trackingDoc = await getDoc(trackingRef);
        
        if (trackingDoc.exists()) {
            return { id: trackingDoc.id, ...trackingDoc.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting order tracking:", error);
        throw error;
    }
};

// ✅ Get all orders with tracking for seller
export const getSellerOrdersWithTracking = async (sellerId) => {
    try {
        const ordersQuery = query(collection(db, "orders"), where("sellerId", "==", sellerId));
        const ordersSnapshot = await getDocs(ordersQuery);
        
        const ordersWithTracking = [];
        
        for (const orderDoc of ordersSnapshot.docs) {
            const orderData = { id: orderDoc.id, ...orderDoc.data() };
            
            // Get tracking data if available
            if (orderData.orderId) {
                const trackingData = await getOrderTracking(orderData.orderId);
                orderData.tracking = trackingData;
            }
            
            ordersWithTracking.push(orderData);
        }
        
        return ordersWithTracking.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (error) {
        console.error("Error getting seller orders with tracking:", error);
        throw error;
    }
};

// ✅ Get customer orders with tracking
export const getCustomerOrdersWithTracking = async (customerId) => {
    try {
        const ordersQuery = query(collection(db, "orders"), where("customerId", "==", customerId));
        const ordersSnapshot = await getDocs(ordersQuery);
        
        const ordersWithTracking = [];
        
        for (const orderDoc of ordersSnapshot.docs) {
            const orderData = { id: orderDoc.id, ...orderDoc.data() };
            
            // Get tracking data if available
            if (orderData.orderId) {
                const trackingData = await getOrderTracking(orderData.orderId);
                orderData.tracking = trackingData;
            }
            
            ordersWithTracking.push(orderData);
        }
        
        return ordersWithTracking.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (error) {
        console.error("Error getting customer orders with tracking:", error);
        throw error;
    }
};

// ✅ Create sample orders with tracking for testing
export const createSampleOrdersWithTracking = async (sellerId) => {
    try {
        const sampleOrders = [
            {
                sellerId,
                customerId: "CUST-001",
                customerName: "John Doe",
                customerEmail: "john@example.com",
                customerPhone: "+1234567890",
                items: [
                    {
                        productId: "prod123",
                        productName: "Red Evening Dress",
                        size: "M",
                        quantity: 1,
                        price: 120,
                        rentalDays: 3
                    }
                ],
                totalAmount: 120,
                deliveryAddress: "123 Main St, City, State 12345",
                deliveryType: "Standard",
                paymentMethod: "COD",
                paymentStatus: "Pending",
                rentalStartDate: Date.now() + (2 * 24 * 60 * 60 * 1000), // 2 days from now
                rentalEndDate: Date.now() + (5 * 24 * 60 * 60 * 1000), // 5 days from now
            },
            {
                sellerId,
                customerId: "CUST-002",
                customerName: "Sarah Smith",
                customerEmail: "sarah@example.com",
                customerPhone: "+1234567891",
                items: [
                    {
                        productId: "prod124",
                        productName: "Blue Wedding Gown",
                        size: "L",
                        quantity: 1,
                        price: 250,
                        rentalDays: 2
                    }
                ],
                totalAmount: 250,
                deliveryAddress: "456 Oak Ave, City, State 12345",
                deliveryType: "Express",
                paymentMethod: "Online",
                paymentStatus: "Paid",
                rentalStartDate: Date.now() + (1 * 24 * 60 * 60 * 1000), // 1 day from now
                rentalEndDate: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 days from now
            },
            {
                sellerId,
                customerId: "CUST-003",
                customerName: "Emma Wilson",
                customerEmail: "emma@example.com",
                customerPhone: "+1234567892",
                items: [
                    {
                        productId: "prod125",
                        productName: "Black Cocktail Dress",
                        size: "S",
                        quantity: 1,
                        price: 85,
                        rentalDays: 1
                    }
                ],
                totalAmount: 85,
                deliveryAddress: "789 Pine St, City, State 12345",
                deliveryType: "Standard",
                paymentMethod: "COD",
                paymentStatus: "Pending",
                rentalStartDate: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 days from now
                rentalEndDate: Date.now() + (4 * 24 * 60 * 60 * 1000), // 4 days from now
            }
        ];

        const createdOrders = [];
        
        for (const orderData of sampleOrders) {
            const result = await createOrderWithTracking(orderData);
            createdOrders.push(result);
        }

        // Update some orders to different statuses for demo
        if (createdOrders.length > 0) {
            // Update first order to "Order Confirmed"
            await updateOrderTracking(createdOrders[0].orderId, "Order Confirmed", "Seller Location", "Your order has been confirmed by the seller");
            
            // Update second order to "Preparing"
            if (createdOrders.length > 1) {
                await updateOrderTracking(createdOrders[1].orderId, "Order Confirmed", "Seller Location", "Order confirmed by seller");
                await updateOrderTracking(createdOrders[1].orderId, "Preparing", "Seller Location", "Order is being prepared for delivery");
            }
        }

        console.log(`Created ${createdOrders.length} sample orders with tracking for seller: ${sellerId}`);
        return createdOrders;
    } catch (error) {
        console.error("Error creating sample orders:", error);
        throw error;
    }
};

//--------------------------------
// 🔹 Seller Approval System
//--------------------------------

// ✅ Get seller approval status
export const getSellerApprovalStatus = async (sellerId) => {
    try {
        const docRef = doc(db, "seller_approvals", sellerId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            // If no approval record exists, create one with pending status
            const defaultStatus = {
                sellerId,
                status: "pending", // pending, approved, rejected
                submittedAt: Date.now(),
                reviewedAt: null,
                reviewedBy: null,
                comments: null
            };
            await setDoc(docRef, defaultStatus);
            return defaultStatus;
        }
    } catch (error) {
        console.error("Error getting seller approval status:", error);
        throw error;
    }
};

// ✅ Update seller approval status (for admin use)
export const updateSellerApprovalStatus = async (sellerId, status, comments = null, adminId = null) => {
    try {
        const docRef = doc(db, "seller_approvals", sellerId);
        const updateData = {
            status, // "approved" or "rejected"
            reviewedAt: Date.now(),
            reviewedBy: adminId,
            comments
        };
        
        await updateDoc(docRef, updateData);
        console.log(`Seller ${sellerId} status updated to: ${status}`);
        return true;
    } catch (error) {
        console.error("Error updating seller approval status:", error);
        throw error;
    }
};

// ✅ Submit seller for approval (when they complete profile)
export const submitSellerForApproval = async (sellerId, sellerData) => {
    try {
        const approvalData = {
            sellerId,
            status: "pending",
            sellerName: sellerData.name,
            shopName: sellerData.shopName,
            email: sellerData.email,
            submittedAt: Date.now(),
            reviewedAt: null,
            reviewedBy: null,
            comments: null
        };
        
        await setDoc(doc(db, "seller_approvals", sellerId), approvalData);
        console.log("Seller submitted for approval:", sellerId);
        return true;
    } catch (error) {
        console.error("Error submitting seller for approval:", error);
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
        
        if (!res.ok) {
            console.error('Cloudinary upload error:', result);
            throw new Error(result.error?.message || 'Upload failed');
        }
        
        console.log('Cloudinary upload success:', result.secure_url);
        return result.secure_url; // 🔥 Cloudinary hosted URL
    } catch (err) {
        console.error("Cloudinary upload failed", err);
        throw err;
    }
};

// ✅ Create dummy notifications for testing
export const createDummyNotifications = async (sellerId) => {
    try {
        const dummyNotifications = [
            {
                sellerId: sellerId,
                type: 'order',
                message: 'New order received for Red Evening Dress',
                details: 'Customer John Doe has placed an order for your Red Evening Dress. Order value: $120. Rental period: 3 days.',
                orderId: 'ORD-001',
                productId: 'prod123',
                productName: 'Red Evening Dress',
                customerName: 'John Doe',
                read: false,
                timestamp: Date.now(),
                createdAt: new Date().toISOString()
            },
            {
                sellerId: sellerId,
                type: 'payment',
                message: 'Payment confirmed for order #ORD-002',
                details: 'Payment of $85 has been confirmed for Blue Wedding Gown rental. COD payment received successfully.',
                orderId: 'ORD-002',
                productId: 'prod124',
                productName: 'Blue Wedding Gown',
                customerName: 'Sarah Smith',
                read: false,
                timestamp: Date.now() - 3600000, // 1 hour ago
                createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                sellerId: sellerId,
                type: 'review',
                message: 'New 5-star review received',
                details: 'Customer Emma Wilson left a 5-star review: "Amazing dress! Perfect fit and beautiful design. Highly recommended!"',
                orderId: 'ORD-003',
                productId: 'prod125',
                productName: 'Black Cocktail Dress',
                customerName: 'Emma Wilson',
                rating: 5,
                reviewText: 'Amazing dress! Perfect fit and beautiful design. Highly recommended!',
                read: true,
                timestamp: Date.now() - 7200000, // 2 hours ago
                createdAt: new Date(Date.now() - 7200000).toISOString()
            },
            {
                sellerId: sellerId,
                type: 'customer',
                message: 'Customer inquiry about availability',
                details: 'Customer Mike Johnson is asking about availability of Green Party Dress for next weekend.',
                productId: 'prod126',
                productName: 'Green Party Dress',
                customerName: 'Mike Johnson',
                read: false,
                timestamp: Date.now() - 10800000, // 3 hours ago
                createdAt: new Date(Date.now() - 10800000).toISOString()
            },
            {
                sellerId: sellerId,
                type: 'order',
                message: 'Order return reminder',
                details: 'Reminder: Order #ORD-004 for Pink Formal Dress is due for return tomorrow. Please coordinate with customer.',
                orderId: 'ORD-004',
                productId: 'prod127',
                productName: 'Pink Formal Dress',
                customerName: 'Lisa Brown',
                read: false,
                timestamp: Date.now() - 14400000, // 4 hours ago
                createdAt: new Date(Date.now() - 14400000).toISOString()
            },
            {
                sellerId: sellerId,
                type: 'payment',
                message: 'Payment pending for order #ORD-005',
                details: 'COD payment of $95 is pending for White Bridal Gown. Customer will pay upon delivery.',
                orderId: 'ORD-005',
                productId: 'prod128',
                productName: 'White Bridal Gown',
                customerName: 'Anna Davis',
                read: true,
                timestamp: Date.now() - 18000000, // 5 hours ago
                createdAt: new Date(Date.now() - 18000000).toISOString()
            }
        ];

        // Add each notification to Firebase
        const promises = dummyNotifications.map(notification => 
            addDoc(collection(db, "notifications"), notification)
        );
        
        await Promise.all(promises);
        console.log(`${dummyNotifications.length} dummy notifications created for seller: ${sellerId}`);
        return dummyNotifications.length;
        
    } catch (error) {
        console.error("Error creating dummy notifications:", error);
        throw error;
    }
};