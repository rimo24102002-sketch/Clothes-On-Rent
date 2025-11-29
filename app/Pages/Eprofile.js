import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Dimensions } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from "react-native-vector-icons/Ionicons";
import { getCustomerProfile, getUserProfile } from '../Helper/firebaseHelper';
import { logout } from '../Helper/firebaseHelper';
import { setRole, setUser } from '../_redux/Slices/HomeDataSlice';

const { width } = Dimensions.get('window');

const Eprofile = () => {
    const user = useSelector((state) => state.home.user);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Profile state
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        profileImageUrl: null
    });

    // UI state
    const [loading, setLoading] = useState(true);
    const [switchingRole, setSwitchingRole] = useState(false);

    // Load profile data on component mount
    useEffect(() => {
        // Only load profile if user is authenticated
        if (user && user.uid) {
            loadProfileData();
        } else {
            console.log('Eprofile - User not authenticated, skipping profile load');
            setLoading(false);
        }
    }, [user]);

    const loadProfileData = async () => {
        try {
            setLoading(true);

            // Debug logging
            console.log('Eprofile - Current user state:', user);
            console.log('Eprofile - User UID:', user?.uid);
            console.log('Eprofile - User email:', user?.email);

            if (user?.uid) {
                console.log('Eprofile - Loading profile for UID:', user.uid);
                const profile = await getCustomerProfile(user.uid);
                if (profile) {
                    console.log('Eprofile - Profile loaded successfully:', profile);
                    setProfileData({
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        email: profile.email || user?.email || '',
                        profileImageUrl: profile.profileImageUrl || null
                    });
                } else {
                    console.log('Eprofile - No profile found, using defaults');
                    setProfileData({
                        firstName: '',
                        lastName: '',
                        email: user?.email || '',
                        profileImageUrl: null
                    });
                }
            } else {
                console.warn('Eprofile - No user UID available for profile loading');
                console.warn('Eprofile - User object:', user);
                setProfileData({
                    firstName: '',
                    lastName: '',
                    email: user?.email || '',
                    profileImageUrl: null
                });
            }
        } catch (error) {
            console.error('Eprofile - Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
            setProfileData({
                firstName: '',
                lastName: '',
                email: user?.email || '',
                profileImageUrl: null
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();
                            // Show success popup then navigate
                            Alert.alert(
                                'Success',
                                'You have been logged out successfully from your Customer account.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            // Redux will handle clearing user data; navigate to Login
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Login' }]
                                            });
                                        }
                                    }
                                ]
                            );
                        } catch (error) {
                            console.error('Error logging out:', error);
                            Alert.alert('Error', 'Failed to logout');
                        }
                    }
                }
            ]
        );
    };

    const handleSwitchToSeller = async () => {
        // Check if user has seller role
        if (user?.role !== 'Seller') {
            Alert.alert(
                'Not a Seller',
                'You need to have a seller account to access seller features. Would you like to create a seller account?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Create Seller Account',
                        onPress: () => {
                            Alert.alert(
                                'Contact Support',
                                'Please contact support to upgrade your account to a seller account.',
                                [{ text: 'OK' }]
                            );
                        }
                    }
                ]
            );
            return;
        }

        Alert.alert(
            "Switch to Seller View",
            "You will be switched to seller mode to manage your products and orders.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Switch",
                    onPress: async () => {
                        setSwitchingRole(true);
                        try {
                            console.log('🔄 Switching from Customer to Seller...');
                            
                            // Fetch fresh user data from Firebase
                            const userData = await getUserProfile(user.uid);
                            
                            if (userData) {
                                console.log('✅ User data fetched:', userData);
                                
                                // Check seller status
                                if (userData.status === 'pending') {
                                    // Seller is pending approval
                                    dispatch(setRole('pending'));
                                    dispatch(setUser({
                                        ...userData,
                                        currentView: 'Seller'
                                    }));
                                    
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'PendingApproval' }],
                                    });
                                    
                                    Alert.alert(
                                        'Pending Approval',
                                        'Your seller account is awaiting admin approval. You will be notified once approved.'
                                    );
                                } else {
                                    // Seller is approved
                                    dispatch(setRole('Seller'));
                                    dispatch(setUser({
                                        ...userData,
                                        currentView: 'Seller'
                                    }));
                                    
                                    console.log('✅ Redux updated with Seller role');
                                    
                                    // Navigate to Seller bottom tabs
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'BottomTabSeller' }],
                                    });
                                    
                                    console.log('✅ Navigated to Seller view');
                                    
                                    // Show success message
                                    setTimeout(() => {
                                        Alert.alert(
                                            'Switched Successfully',
                                            'You are now in Seller mode. Manage your products and orders!'
                                        );
                                    }, 500);
                                }
                            } else {
                                throw new Error('Failed to fetch user data');
                            }
                        } catch (error) {
                            console.error('❌ Error switching role:', error);
                            Alert.alert(
                                'Switch Failed',
                                'Failed to switch to seller view. Please try again.'
                            );
                        } finally {
                            setSwitchingRole(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1DCD1' }}>
                <ActivityIndicator size="large" color="#8E6652" />
                <Text style={{ marginTop: 10, color: '#8E6652' }}>Loading profile...</Text>
            </View>
        );
    }

    // Check if user is authenticated
    if (!user || !user.uid) {
        console.log('Eprofile - Authentication check failed:', {
            userExists: !!user,
            userUid: user?.uid,
            userEmail: user?.email
        });
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1DCD1' }}>
                <Ionicons name="person-outline" size={64} color="#8E6652" />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#8E6652', marginTop: 20 }}>
                    Not Logged In
                </Text>
                <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10, paddingHorizontal: 40 }}>
                    Please log in to view your profile
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: '#F1DCD1', flex: 1 }}>
            {/* Professional Header */}
            <View style={{
                backgroundColor: '#8E6652',
                paddingVertical: 30,
                paddingHorizontal: 20,
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                marginBottom: 25,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            }}>
                <TouchableOpacity
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('BottomTab');
                        }
                    }}
                    style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profiles')}>
                        <View style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            elevation: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            borderWidth: 3,
                            borderColor: '#F1DCD1'
                        }}>
                            {profileData.profileImageUrl ? (
                                <Image
                                    source={{ uri: profileData.profileImageUrl }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Ionicons name="person" size={50} color="#8E6652" />
                            )}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profiles')}
                        style={{
                            marginTop: 10,
                            paddingHorizontal: 15,
                            paddingVertical: 5,
                            backgroundColor: 'rgba(142, 102, 82, 0.1)',
                            borderRadius: 15
                        }}
                    >
                        <Text style={{
                            fontSize: 12,
                            color: '#8E6652',
                            fontWeight: '600'
                        }}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>

                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: '#fff',
                        marginTop: 15,
                        textAlign: 'center'
                    }}>
                        {profileData?.firstName && profileData?.lastName
                            ? `${profileData.firstName} ${profileData.lastName}`
                            : 'Customer Profile'
                        }
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: '#F1DCD1',
                        marginTop: 5,
                        opacity: 0.9
                    }}>
                        {profileData?.email || 'No email available'}
                    </Text>
                </View>
            </View>

            {/* Menu Options */}
            <View style={{ paddingHorizontal: 20 }}>
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    marginBottom: 20,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    overflow: 'hidden'
                }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}
                        onPress={() => navigation.navigate('Profiles')}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#8E6652',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="create-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#8E6652"
                            }}>
                                Edit Profile
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                Update your personal information
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#8E6652" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}
                        onPress={() => navigation.navigate('MyOrders')}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#8E6652',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="receipt-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#8E6652"
                            }}>
                                My Orders
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                View and track your orders
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#8E6652" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#8E6652',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="basket-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#8E6652"
                            }}>
                                Shopping Cart
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                View items in your cart
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#8E6652" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#8E6652',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="shield-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#8E6652"
                            }}>
                                Privacy Policy
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                Read our privacy and data policy
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#8E6652" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}
                        onPress={() => navigation.navigate('TermsOfService')}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#8E6652',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="document-text-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#8E6652"
                            }}>
                                Terms of Service
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                Read our terms and conditions
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#8E6652" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}
                        onPress={() => navigation.navigate('Password')}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#8E6652',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="shield-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#8E6652"
                            }}>
                                Change Password
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                Update your account security
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#8E6652" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}
                        onPress={() => navigation.navigate('Delete')}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#E74C3C',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="trash-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#E74C3C"
                            }}>
                                Delete Account
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                Permanently remove your account
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#E74C3C" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}
                        onPress={() => navigation.navigate('CustomerComplaint')}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#F39C12',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="help-circle-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#F39C12"
                            }}>
                                Issue a Complaint
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                Report issues or provide feedback
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#F39C12" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: '#f0f0f0'
                        }}
                        onPress={() => navigation.navigate('CustomerComplaintsList')}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#8E6652',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="chatbubbles-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#8E6652"
                            }}>
                                View My Complaints
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                View and manage your complaints
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#8E6652" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20
                        }}
                        onPress={handleLogout}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#95A5A6',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            <Ionicons name="log-out-outline" size={22} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: "#95A5A6"
                            }}>
                                Logout
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#999",
                                marginTop: 2
                            }}>
                                Sign out from your account
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Switch to Seller Section */}
                <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    overflow: 'hidden',
                    marginBottom: 30
                }}>
                    <TouchableOpacity
                        onPress={handleSwitchToSeller}
                        disabled={switchingRole}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 20,
                            backgroundColor: switchingRole ? '#A07B6B' : '#8E6652',
                            opacity: switchingRole ? 0.7 : 1
                        }}
                    >
                        <View style={{
                            width: 45,
                            height: 45,
                            borderRadius: 22.5,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 15
                        }}>
                            {switchingRole ? (
                                <ActivityIndicator size="small" color="#8E6652" />
                            ) : (
                                <Ionicons name="swap-horizontal" size={22} color="#8E6652" />
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: "#fff"
                            }}>
                                {switchingRole ? 'Switching...' : 'Switch to Seller View'}
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                color: "#F1DCD1",
                                marginTop: 2
                            }}>
                                Access seller management features
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Eprofile;
