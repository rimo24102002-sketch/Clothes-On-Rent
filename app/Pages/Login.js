import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from "../Helper/firebaseHelper";
import { setRole, setUser } from '../redux/Slices/HomeDataSlice';

const Login = ({ navigation }) => {
   
  const [email, setEmail] = useState("anum@gmail.com");
  const [password, setPassword] = useState("Anum@@");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    // Input validation
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }
    if (!email.includes('@')) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);

      if (user?.uid) {
        // Determine role based on seller status
        let userRole = user.role || "Seller";
        if (user.role === "Seller" && user.status === "pending") {
          userRole = "pending";
        }
        
        dispatch(setRole(userRole));
        dispatch(setUser(user));
        // Navigation will be handled by RenderStack based on role and status
        // No need to navigate manually as the stack will render appropriately
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
      }
    } catch (error) {
      console.log("Login error:", error);
      
      // Handle specific Firebase auth errors
      let errorMessage = "Login failed. Please try again.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

 return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fefcfcff" }}>
            <View style={{ width: '60%', height: 50, backgroundColor: "rgba(164, 123, 104, 1)", borderRadius: 20, justifyContent: "center", alignSelf: "center", marginTop: 40, }} >
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#f9f9f9ff", textAlign: "center" }}>Rent Clothes</Text>
            </View>
            <View style={{ width: "100%", backgroundColor: "#ffff" }}>
                <View style={{ backgroundColor: "#ffffffff", marginTop: 50 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25, textAlign: 'center' }}>Sign in to your account</Text>
                </View>
                <Text style={{ marginStart: 40, marginTop: 30 }}>Email</Text>
                <TextInput  
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="ex: jon.smith@email.com"
                    placeholderTextColor="#c2c2c2ff"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, paddingHorizontal: 10, marginStart: 40, marginTop: 5 }}>
                </TextInput>
                <Text style={{ marginStart: 40, marginTop: 10 }}>Password</Text>
                <TextInput  
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor="#c2c2c2ff"
                    secureTextEntry={true}
                    style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, paddingHorizontal: 10, marginStart: 40, marginTop: 5 }}>
                </TextInput>

                <TouchableOpacity style={{ marginTop: 5 }} onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={{ color: "#3b3b3bff", fontWeight: "300", fontSize: 10, textAlign: "right", marginRight: 35 }}>Forgot Password</Text>
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
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16, textAlign: "center" }}>
                        {loading ? "SIGNING IN..." : "SIGN IN"}
                    </Text>
                </TouchableOpacity>
                <Text style={{ textAlign: "center", fontWeight: "200", marginTop: 5 }}>or sign in with</Text>
                <TouchableOpacity style={{ backgroundColor: "#F4F4F4", width: "15%", height: "10%", alignSelf: "center", marginTop: 10 }}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>🔵🟢🟡🔴</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ color: "#3b3b3bff", fontWeight: "200", fontSize: 10, textAlign: "center", marginTop: 10 }}>Don’t have an account? </Text>
                </View>
                 <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={{ color: "rgba(164, 123, 104, 1)", fontWeight: "800", fontSize: 11, marginTop: 10 }}>SignUp</Text>
                    </TouchableOpacity>
                    </View>
            </View>
        </ScrollView>
    )
}

export default Login;