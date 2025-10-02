import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { handleSignUp } from '../Helper/firebaseHelper';
import { setRole, setUser } from '../redux/Slices/HomeDataSlice';

const Signup = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const goToRegister = async () => {
        // Input validation
        if (!name.trim()) {
            Alert.alert("Error", "Please enter your name");
            return;
        }
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email");
            return;
        }
        
        // Better email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert("Error", "Please enter a valid email address (e.g., user@example.com)");
            return;
        }
        if (!address.trim()) {
            Alert.alert("Error", "Please enter your address");
            return;
        }
        if (!password.trim()) {
            Alert.alert("Error", "Please enter a password");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }
        if (!confirmpassword.trim()) {
            Alert.alert("Error", "Please confirm your password");
            return;
        }
        if (password !== confirmpassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            // Trim all inputs before sending to Firebase
            const trimmedEmail = email.trim().toLowerCase();
            const trimmedPassword = password.trim();
            const trimmedName = name.trim();
            const trimmedAddress = address.trim();
            
            const user = await handleSignUp(
                trimmedEmail,
                trimmedPassword,
                { role: "Seller", name: trimmedName, email: trimmedEmail, address: trimmedAddress }
            );

            if (user?.uid) {
                // Save role + user to redux
                dispatch(setRole("Seller"));
                dispatch(setUser(user));

                // Don't navigate - RenderStack will automatically switch to SellerStack
                // which will show BottomTabSeller as its initialRouteName
                Alert.alert("Success", "Account created successfully!", [
                    { text: "OK", onPress: () => {} }
                ]);
            } else {
                Alert.alert("Error", "Sign up failed. Please try again.");
            }
        } catch (error) {
            console.log("Signup error:", error);
            
            // Handle specific Firebase auth errors
            let errorMessage = "Sign up failed. Please try again.";
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered. Please use a different email or try logging in.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Please enter a valid email address.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Please use a stronger password.";
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert("Sign Up Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fefcfcff" }}>
            <View style={{ width: '60%', height: 50, backgroundColor: "rgba(164, 123, 104, 1)", borderRadius: 20, justifyContent: "center", alignSelf: "center", marginTop: 40 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#f9f9f9ff", textAlign: "center" }}>Rent Clothes</Text>
            </View>

            <View style={{ width: "100%", height: "90%", backgroundColor: "#ffff" }}>
                <View style={{ backgroundColor: "#ffffffff", marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25, textAlign: 'center' }}>Create your account</Text>
                </View>

                <Text style={{ marginStart: 40, marginTop: 10 }}>Name</Text>
                <TextInput
                    onChangeText={(text) => setName(text)}
                    value={name}
                    placeholder="ex: jon smith"
                    placeholderTextColor="#c2c2c2ff"
                    autoCapitalize="words"
                    style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, paddingHorizontal: 10, marginStart: 40, marginTop: 5 }}
                />

                <Text style={{ marginStart: 40, marginTop: 5 }}>Email</Text>
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="ex: jon.smith@email.com"
                    placeholderTextColor="#c2c2c2ff"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, paddingHorizontal: 10, marginStart: 40, marginTop: 5 }}
                />

                <Text style={{ marginStart: 40, marginTop: 5 }}>Address</Text>
                <TextInput
                    onChangeText={(text) => setAddress(text)}
                    value={address}
                    placeholder="Enter your address"
                    placeholderTextColor="#c2c2c2ff"
                    multiline={true}
                    style={{ backgroundColor: "#F4F4F4", borderRadius: 5, width: '80%', height: 40, paddingHorizontal: 10, marginStart: 40, marginTop: 5 }}
                />

                <Text style={{ marginStart: 40, marginTop: 5 }}>Password</Text>
                <TextInput
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Enter password (min 6 characters)"
                    placeholderTextColor="#c2c2c2ff"
                    style={{ backgroundColor: "#F4F4F4", borderRadius: 5, width: '80%', height: 40, paddingHorizontal: 10, marginStart: 40, marginTop: 5 }}
                />

                <Text style={{ marginStart: 40, marginTop: 5 }}>Confirm password</Text>
                <TextInput
                    secureTextEntry
                    onChangeText={(text) => setConfirmpassword(text)}
                    value={confirmpassword}
                    placeholder="Confirm your password"
                    placeholderTextColor="#c2c2c2ff"
                    style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, paddingHorizontal: 10, marginStart: 40, marginTop: 5 }}
                />

                <TouchableOpacity style={{ marginTop: 5, flexDirection: "row", marginStart: 40 }}>
                    <Fontisto name="checkbox-passive" size={15} color="#3b3b3bff" />
                    <Text style={{ color: "#3b3b3bff", fontWeight: "300", fontSize: 10 }}>   I understood the terms & policy.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ 
                        backgroundColor: loading ? "#ccc" : "rgba(164, 123, 104, 1)", 
                        borderRadius: 8, 
                        alignSelf: "center", 
                        width: '80%', 
                        height: 45, 
                        justifyContent: "center", 
                        marginTop: 15 
                    }}
                    onPress={goToRegister}
                    disabled={loading}
                >
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16, textAlign: "center" }}>
                        {loading ? "SIGNING UP..." : "SIGN UP"}
                    </Text>
                </TouchableOpacity>

                <Text style={{ textAlign: "center", fontWeight: "200", marginTop: 5 }}>or sign up with</Text>
                <TouchableOpacity style={{ backgroundColor: "#F4F4F4", width: "13%", height: "6%", alignSelf: "center", marginTop: 10 }}>
                    <Text style={{ textAlign: "center" }}>🔵🟢🟡🔴</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ color: "#3b3b3bff", fontWeight: "200", fontSize: 10, marginTop: 10 }}>Don’t have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={{ color: "#003366", fontWeight: "300", fontSize: 10, marginTop: 10 }}>Signin</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Signup;