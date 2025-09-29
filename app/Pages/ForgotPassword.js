import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { forgotPassword } from "../Helper/firebaseHelper";

const Password = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    return (
        <View style={{ height: "100%", width: "100%", backgroundColor: "#ffffffff" }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#000000ff", marginTop: 20, marginStart: 20 }}>Forgot password</Text>
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

export default Password;