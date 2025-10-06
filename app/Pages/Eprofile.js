import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { getCustomerProfile, logout } from "../Helper/firebaseHelper";
import { clearUser } from "../redux/Slices/HomeDataSlice";
import StandardHeader from '../Components/StandardHeader';

const Profile = ({ navigation }) => {
    const user = useSelector((state) => state.home.user);
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        loadCustomerProfile();
    }, []);

    const loadCustomerProfile = async () => {
        try {
            if (!user?.uid) return;
            
            const customerProfile = await getCustomerProfile(user.uid);
            setProfile(customerProfile);
        } catch (error) {
            console.error("Error loading customer profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
                <StandardHeader 
                    title="Profile" 
                    navigation={navigation}
                    showBackButton={false}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#8E6652" />
                    <Text style={{ marginTop: 16, color: '#8E6652' }}>Loading profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const displayName = profile?.firstName && profile?.lastName 
        ? `${profile.firstName} ${profile.lastName}` 
        : user?.displayName || user?.name || 'Customer';
    const displayEmail = user?.email || 'customer@example.com';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
            <StandardHeader 
                title="Profile" 
                navigation={navigation}
                showBackButton={false}
            />
            <ScrollView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>

            {/* Profile Info */}
            <View style={{ flexDirection: "row", alignItems: "center", padding: 30 }}>
                <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#8E6652" }}>
                    {profile?.profileImageUrl ? (
                        <Image source={{ uri: profile.profileImageUrl }} style={{ width: 64, height: 64, borderRadius: 32 }} />
                    ) : (
                        <Ionicons name="person" size={35} color="#8E6652" />
                    )}
                </View>
                <View style={{ padding: 15, flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>{displayName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Ionicons name="mail-outline" size={14} color="#8E6652" style={{ marginRight: 6 }} />
                        <Text style={{ fontSize: 14, color: "#374151", fontWeight: '500' }}>{displayEmail}</Text>
                    </View>
                </View>
            </View>

            {/* Menu Options */}
            <View style={{ backgroundColor: "#fff", borderRadius: 15, marginHorizontal: 20, paddingVertical: 10 }}>
                
                {/* Edit Profile */}
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center", padding: 15 }}
                    onPress={() => navigation.navigate("Profiles")}
                >
                    <Ionicons name="create-outline" size={20} color="#8E6652" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000", flex: 1 }}>Edit Profile</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" />
                </TouchableOpacity>

                {/* My Orders */}
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center", padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
                    onPress={() => navigation.navigate("CPending")}
                >
                    <Ionicons name="receipt-outline" size={20} color="#8E6652" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000", flex: 1 }}>My Orders</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" />
                </TouchableOpacity>

                {/* Notification Settings */}
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center", padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
                    onPress={() => navigation.navigate("CustomerNotificationSettings")}
                >
                    <Ionicons name="notifications-outline" size={20} color="#8E6652" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000", flex: 1 }}>Notification Settings</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" />
                </TouchableOpacity>

                {/* Change Password */}
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center", padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
                    onPress={() => navigation.navigate("Password")}
                >
                    <Ionicons name="shield-outline" size={20} color="#8E6652" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000", flex: 1 }}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" />
                </TouchableOpacity>

                {/* Help & Support */}
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center", padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
                    onPress={() => navigation.navigate("CustomerHelpCenter")}
                >
                    <Ionicons name="help-circle-outline" size={20} color="#8E6652" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000", flex: 1 }}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" />
                </TouchableOpacity>

                {/* Privacy Policy */}
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center", padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
                    onPress={() => navigation.navigate("PrivacyPolicy")}
                >
                    <Ionicons name="document-text-outline" size={20} color="#8E6652" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000", flex: 1 }}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" />
                </TouchableOpacity>

                {/* Logout */}
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center", padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
                    onPress={() => navigation.navigate("Logout")}
                >
                    <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#E74C3C", flex: 1 }}>Logout</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" />
                </TouchableOpacity>

                {/* Delete Account */}
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center", padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
                    onPress={() => navigation.navigate("Delete")}
                >
                    <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#E74C3C", flex: 1 }}>Delete Account</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" />
                </TouchableOpacity>
            </View>

            {/* Switch to Seller */}
            <View style={{ padding: 20, marginTop: 20 }}>
                <TouchableOpacity 
                    style={{ 
                        height: 50, 
                        backgroundColor: "#8E6652", 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        borderRadius: 12,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3
                    }}
                    onPress={() => {
                        // Switch to seller mode
                        Alert.alert(
                            "Switch to Seller",
                            "Do you want to switch to seller mode?",
                            [
                                { text: "Cancel", style: "cancel" },
                                { text: "Switch", onPress: () => {
                                    // This would update Redux to change role to "Seller"
                                    Alert.alert("Info", "Seller mode switching will be implemented");
                                }}
                            ]
                        );
                    }}
                >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Switch to Seller</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
