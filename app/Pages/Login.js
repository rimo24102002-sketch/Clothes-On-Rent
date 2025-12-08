// screens/Login.js - COMPLETELY REWRITTEN FOR STABILITY
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../firebase';
import { login } from "../Helper/firebaseHelper";
import { setRole, setUser } from '../_redux/Slices/HomeDataSlice';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("sukaina@gmail.com");
  const [password, setPassword] = useState("112233");
  const [loading, setLoading] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const loginInProgress = useRef(false);
  const dispatch = useDispatch();

  const selectedRole = useSelector((state) => state.home.selectedRole);

  useEffect(() => {
    console.log('Login page - Selected Role:', selectedRole);
    // Reset login attempt flag when component mounts
    loginInProgress.current = false;
  }, [selectedRole]);

  const normalizeRole = (roleValue) => {
    const value = (roleValue || "").toString().trim().toLowerCase();
    if (value === "seller") return "Seller";
    if (value === "customer") return "Customer";
    if (value === "pending") return "pending";
    return "";
  };

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (!selectedRole) {
      Alert.alert("Error", "No role selected. Please choose Customer or Seller on the previous screen.");
      return;
    }

    // CRITICAL: Prevent multiple simultaneous login attempts
    if (loading || loginInProgress.current) {
      console.log('⚠️ Login already in progress, ignoring duplicate attempt');
      return;
    }

    // Set flags to prevent duplicate attempts
    loginInProgress.current = true;
    setLoading(true);
    setLoginAttempted(true);
    
    console.log('🔐 Starting login process...');
    console.log('📧 Email:', email.trim().toLowerCase());
    console.log('👤 Expected Role:', selectedRole);
    
    try {
      // Step 1: Authenticate with Firebase
      console.log('Step 1: Authenticating...');
      const userData = await login(email.trim().toLowerCase(), password);

      if (!userData?.uid) {
        throw new Error('No user data returned from login');
      }

      console.log('✅ Authentication successful');
      console.log('👤 User:', userData.email, '| Role:', userData.role);

      // Step 2: Validate role matches
      const userRoleFromDB = (userData.role || "").toString().trim().toLowerCase();
      const expectedRole = (selectedRole || "").toString().trim().toLowerCase();

      if (userRoleFromDB !== expectedRole) {
        console.log('❌ Role mismatch - signing out');
        await signOut(auth);
        Alert.alert(
          "Wrong Account Type",
          `This account is registered as a ${userData.role}. Please select the correct account type.`
        );
        loginInProgress.current = false;
        setLoading(false);
        return;
      }

      console.log('✅ Role validation passed');

      // Step 3: Determine final role (handle pending sellers)
      const normalizedDbRole = normalizeRole(userData.role);
      const normalizedSelectedRole = normalizeRole(selectedRole);

      let finalRole = "Customer";

      if (userData.status && userData.status.toString().toLowerCase() === "pending") {
        finalRole = "pending";
      } else if (normalizedDbRole) {
        finalRole = normalizedDbRole;
      } else if (normalizedSelectedRole) {
        finalRole = normalizedSelectedRole;
      }

      console.log('📝 Final role:', finalRole);

      // Step 4: Update Redux state
      console.log('Step 2: Updating Redux state...');
      dispatch(setRole(finalRole));
      dispatch(setUser(userData));

      // Step 5: Load cart
      // console.log('Step 3: Loading cart...');
      // try {
      //   const cartData = await loadCartFromFirebase(userData.uid);
      //   dispatch(initializeCart(Array.isArray(cartData) ? cartData : []));
      //   console.log('✅ Cart loaded:', cartData?.length || 0, 'items');
      // } catch (cartError) {
      //   console.error('⚠️ Cart load error:', cartError);
      //   dispatch(initializeCart([]));
      // }

      // Step 6: Clear form
      // setEmail("");
      // setPassword("");
      
      // Step 7: Navigate (with small delay to ensure state propagation)
      console.log('Step 4: Navigating to dashboard...');

      setLoading(false);
      loginInProgress.current = false;
      
      // setTimeout(() => {
      //   const navigationMap = {
      //     'pending': 'PendingApproval',
      //     'Seller': 'BottomTabSeller',
      //     'Customer': 'BottomTab'
      //   };

      //   const targetScreen = navigationMap[finalRole] || 'BottomTab';
        
      //   console.log('🧭 Navigating to:', targetScreen);
        
      //   navigation.reset({
      //     index: 0,
      //     routes: [{ name: targetScreen }]
      //   });
        
      //   loginInProgress.current = false;
      //   setLoading(false);
      //   console.log('✅ Login complete!');
      // }, 100);

    } catch (error) {
      console.error("❌ Login error:", error);
      
      // Reset flags
      loginInProgress.current = false;
      setLoading(false);
      
      // Determine error message
      let errorMessage = "Login failed. Please try again.";
      
      const errorCode = error.code || '';
      
      if (errorCode === 'auth/user-not-found') {
        errorMessage = "No account found with this email.";
      } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (errorCode === 'auth/user-disabled') {
        errorMessage = "This account has been disabled.";
      } else if (errorCode === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please wait and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fefcfcff" }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => { if (navigation.canGoBack()) navigation.goBack(); else navigation.navigate('Home'); }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign In</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.brandBox}><Text style={styles.brandText}>Rent Clothes</Text></View>

        <View style={{ width: "100%", backgroundColor: "#ffff", paddingBottom: 80 }}>
          <View style={{ marginTop: 50 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 25, textAlign: 'center' }}>Sign in as {selectedRole || 'Account'}</Text>
            <Text style={{ fontSize: 14, textAlign: 'center', color: '#666', marginTop: 5 }}>Login to your {selectedRole ? selectedRole.toLowerCase() : 'account'}</Text>
          </View>

          <Text style={{ marginStart: 40, marginTop: 30 }}>Email</Text>
          <TextInput onChangeText={setEmail} value={email} placeholder="ex: jon.smith@email.com" placeholderTextColor="#c2c2c2ff" keyboardType="email-address" autoCapitalize="none" style={styles.input} />

          <Text style={{ marginStart: 40, marginTop: 10 }}>Password</Text>
          <TextInput onChangeText={setPassword} value={password} placeholder="Enter your password" placeholderTextColor="#c2c2c2ff" secureTextEntry style={styles.input} />

          <TouchableOpacity style={{ marginTop: 5 }} onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={{ color: "#3b3b3bff", fontWeight: "300", fontSize: 12, textAlign: "right", marginRight: 35 }}>Forgot Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.button, backgroundColor: loading ? "#ccc" : "rgba(164, 123, 104, 1)" }} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>SIGN IN</Text>}
          </TouchableOpacity>

          <Text style={{ textAlign: "center", fontWeight: "200", marginTop: 12 }}>or sign in with</Text>
          <TouchableOpacity style={styles.socialBtn}><Text style={{ textAlign: "center", fontSize: 15 }}>🔵🟢🟡🔴</Text></TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
            <Text style={{ color: "#3b3b3bff", fontWeight: "200", fontSize: 12 }}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}><Text style={{ color: "rgba(164, 123, 104, 1)", fontWeight: "800", fontSize: 12 }}> Sign Up</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#8E6652', paddingTop: 40, paddingBottom: 15, paddingHorizontal: 15 },
  backButton: { padding: 8, borderRadius: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1, textAlign: 'center', marginRight: 40 },
  headerRight: { width: 40 },
  brandBox: { width: '60%', height: 50, backgroundColor: "rgba(164, 123, 104, 1)", borderRadius: 20, justifyContent: "center", alignSelf: "center", marginTop: 40 },
  brandText: { fontSize: 20, fontWeight: "bold", color: "#f9f9f9ff", textAlign: "center" },
  input: { backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, paddingHorizontal: 10, marginStart: 40, marginTop: 5 },
  button: { borderRadius: 8, alignSelf: "center", width: '80%', height: 45, justifyContent: "center", marginTop: 15 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16, textAlign: "center" },
  socialBtn: { backgroundColor: "#F4F4F4", width: "15%", height: 40, alignSelf: "center", marginTop: 10, borderRadius: 6, justifyContent: 'center' }
});

export default Login;
