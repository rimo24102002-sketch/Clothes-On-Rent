import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const Password = ({navigation}) => {
    return (
        <View style={{ height: "100%", width: "100%", backgroundColor: "#ffffffff" }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#000000ff", marginTop: 20, marginStart: 20 }}>Forgot password</Text>
            <Text style={{ color: "#000000ff", marginTop: 10, marginStart: 15 }} >  Enter your registered email to reset your password.</Text>
            <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#999"
                style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, justifyContent: "center", alignSelf: "center", marginTop: 20, borderColor: "#000000ff", borderWidth: 1, borderColor: "#d1d5db", }}>
            </TextInput>

            <TouchableOpacity style={{ backgroundColor: "rgba(164, 123, 104, 1)", width: '80%', height: 45, borderRadius: 12, justifyContent: "center", alignItems: "center", alignSelf: "center", marginTop: 40 }}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Send reset link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }}>
                <Text style={{ color: "#0f0f0fff", textAlign: "center" }} onPress={() => navigation.navigate("Login")}>
                    Back to Login
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Password;