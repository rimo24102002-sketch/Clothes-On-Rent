import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { forgotPassword } from "../Helper/firebaseHelper";
import { Ionicons } from '@expo/vector-icons';

const Password = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    return (
        <View style={{ height: "100%", width: "100%", backgroundColor: "#ffffffff" }}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => {
                        if (navigation?.canGoBack && navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('Login');
                        }
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Forgot Password</Text>
                <View style={styles.headerRight} />
            </View>

            <Text style={{ fontSize: 22, fontWeight: "700", color: "#000000ff", marginTop: 20, marginStart: 20 }}>Reset Your Password</Text>
            <Text style={{ color: "#000000ff", marginTop: 10, marginStart: 15 }} >  Enter your registered email to reset your password.</Text>
            <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, justifyContent: "center", alignSelf: "center", marginTop: 20, borderColor: "#000000ff", borderWidth: 1, borderColor: "#d1d5db", }}>
            </TextInput>

            <TouchableOpacity style={{ backgroundColor: loading ? "#ccc" : "rgba(164, 123, 104, 1)", width: '80%', height: 45, borderRadius: 12, justifyContent: "center", alignItems: "center", alignSelf: "center", marginTop: 40 }} onPress={async () => {
                if (!email.trim() || !email.includes('@')) { Alert.alert("Error", "Enter a valid email"); return; }
                setLoading(true);
                try {
                    await forgotPassword(email);
                    Alert.alert("Email sent", "Check your inbox for a reset link.");
                } catch (e) {
                    Alert.alert("Error", e?.message || "Failed to send reset email");
                } finally { setLoading(false); }
            }} disabled={loading}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>{loading ? "Sending..." : "Send reset link"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate("Login")}>
                <Text style={{ color: "#0f0f0fff", textAlign: "center" }}>
                    Back to Login
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#8E6652',
        paddingVertical: 15,
        paddingHorizontal: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    backButton: {
        padding: 8,
        width: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
});

export default Password;