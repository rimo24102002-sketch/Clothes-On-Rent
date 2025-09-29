import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { changePassword, forgotPassword } from "../Helper/firebaseHelper";
import { useSelector } from "react-redux";

const Password = ({ navigation }) => {
    const user = useSelector((state) => state.home.user);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password) => {
        const minLength = password.length >= 6;
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return minLength && hasNumber && hasLetter && hasSpecial;
    };

    const handleChangePassword = async () => {
        // Validation
        if (!currentPassword.trim()) {
            Alert.alert("Error", "Please enter your current password");
            return;
        }

        if (!newPassword.trim()) {
            Alert.alert("Error", "Please enter a new password");
            return;
        }

        if (!validatePassword(newPassword)) {
            Alert.alert("Error", "Password must be at least 6 characters and include numbers, letters, and special characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }

        if (currentPassword === newPassword) {
            Alert.alert("Error", "New password must be different from current password");
            return;
        }

        try {
            setLoading(true);
            await changePassword(currentPassword, newPassword);
            
            Alert.alert(
                "Success", 
                "Password changed successfully!",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                            navigation.goBack();
                        }
                    }
                ]
            );
        } catch (error) {
            console.error("Password change error:", error);
            let errorMessage = "Failed to change password";
            
            if (error.code === 'auth/wrong-password') {
                errorMessage = "Current password is incorrect";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "New password is too weak";
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = "Please log out and log back in, then try again";
            }
            
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!user?.email) {
            Alert.alert("Error", "No email address found. Please log in again.");
            return;
        }

        Alert.alert(
            "Reset Password",
            `Send password reset email to ${user.email}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Send Email",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await forgotPassword(user.email);
                            Alert.alert(
                                "Email Sent!", 
                                `Password reset email has been sent to ${user.email}. Please check your inbox and follow the instructions to reset your password. You will be redirected to login page.`,
                                [{ 
                                    text: "OK", 
                                    onPress: () => {
                                        // Navigate to login page after forgot password
                                        navigation.navigate('Login');
                                    }
                                }]
                            );
                        } catch (error) {
                            console.error("Forgot password error:", error);
                            let errorMessage = "Failed to send password reset email. Please try again.";
                            
                            if (error.code === 'auth/user-not-found') {
                                errorMessage = "No account found with this email address.";
                            } else if (error.code === 'auth/invalid-email') {
                                errorMessage = "Invalid email address format.";
                            } else if (error.code === 'auth/too-many-requests') {
                                errorMessage = "Too many requests. Please wait a moment and try again.";
                            }
                            
                            Alert.alert("Error", errorMessage);
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
          
            <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 30 }}>
                <Text style={{ fontSize: 22, fontWeight: "700", color: "#8E6652", marginBottom: 8 }}>Edit Password</Text>
                <Text style={{ color: "#666", marginBottom: 30, lineHeight: 20 }}>
                    Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!@#$%).
                </Text>

                {/* Current Password */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 }}>Current Password</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E0E0E0", paddingHorizontal: 16 }}>
                        <TextInput
                            placeholder="Enter current password"
                            placeholderTextColor="#999"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry={!showCurrentPassword}
                            style={{ flex: 1, height: 50, fontSize: 16 }}
                        />
                        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                            <Feather name={showCurrentPassword ? "eye-off" : "eye"} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* New Password */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 }}>New Password</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E0E0E0", paddingHorizontal: 16 }}>
                        <TextInput
                            placeholder="Enter new password"
                            placeholderTextColor="#999"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNewPassword}
                            style={{ flex: 1, height: 50, fontSize: 16 }}
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                            <Feather name={showNewPassword ? "eye-off" : "eye"} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 }}>Confirm New Password</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E0E0E0", paddingHorizontal: 16 }}>
                        <TextInput
                            placeholder="Re-type new password"
                            placeholderTextColor="#999"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            style={{ flex: 1, height: 50, fontSize: 16 }}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Change Password Button */}
                <TouchableOpacity 
                    style={{ 
                        backgroundColor: "#8E6652", 
                        height: 50, 
                        borderRadius: 12, 
                        justifyContent: "center", 
                        alignItems: "center",
                        opacity: loading ? 0.7 : 1,
                        marginTop: 30
                    }}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Change Password</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Password;