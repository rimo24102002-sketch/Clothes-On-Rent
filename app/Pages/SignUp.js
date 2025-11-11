// screens/Signup.js
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { handleSignUp } from '../Helper/firebaseHelper';
import { setRole, setUser, initializeCart } from '../_redux/Slices/HomeDataSlice';
import { Ionicons } from '@expo/vector-icons';

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const selectedRole = useSelector((state) => state.home.selectedRole); // "Seller" or "Customer"

  useEffect(() => {
    console.log('SignUp page - Selected Role:', selectedRole);
  }, [selectedRole]);

  const navigateToLogin = async () => {
    // After successful signup, logout the user and send them to login page
    // This ensures they explicitly login with their new credentials
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../../firebase');
      await signOut(auth);
      console.log('✅ User signed out after signup - redirecting to Login');
      
      // Clear Redux state
      dispatch(setRole(''));
      dispatch(setUser({}));
      dispatch(initializeCart([]));
      
      // Navigate to Login page
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during post-signup logout:', error);
      // Still navigate to login even if logout fails
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const goToRegister = async () => {
    if (!name.trim()) return Alert.alert("Error", "Please enter your name");
    if (!email.trim()) return Alert.alert("Error", "Please enter your email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return Alert.alert("Error", "Please enter a valid email address");
    if (!address.trim()) return Alert.alert("Error", "Please enter your address");
    if (!password.trim()) return Alert.alert("Error", "Please enter a password");
    if (password.length < 6) return Alert.alert("Error", "Password must be at least 6 characters long");
    if (!confirmpassword.trim()) return Alert.alert("Error", "Please confirm your password");
    if (password !== confirmpassword) return Alert.alert("Error", "Passwords do not match");
    if (!selectedRole) return Alert.alert("Error", "No role selected. Go back and choose Seller or Customer.");

    setLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      const trimmedName = name.trim();
      const trimmedAddress = address.trim();

      const user = await handleSignUp(
        trimmedEmail,
        trimmedPassword,
        { role: selectedRole, name: trimmedName, email: trimmedEmail, address: trimmedAddress }
      );

      if (user?.uid) {
        console.log('SignUp successful - returned user:', user);
        
        // Show success message first
        Alert.alert(
          "Success",
          "Account created successfully! Please login with your credentials.",
          [
            {
              text: "OK",
              onPress: () => navigateToLogin()
            }
          ]
        );
      } else {
        Alert.alert("Error", "Sign up failed. Please try again.");
      }
    } catch (error) {
      console.log("Signup error:", error);
      let errorMessage = "Sign up failed. Please try again.";
      if (error.code === 'auth/email-already-in-use') errorMessage = "This email is already registered. Use another email or sign in.";
      else if (error.code === 'auth/invalid-email') errorMessage = "Please enter a valid email address.";
      else if (error.code === 'auth/weak-password') errorMessage = "Password is too weak. Use a stronger password.";
      else if (error.message) errorMessage = error.message;
      Alert.alert("Sign Up Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fefcfcff" }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate('Login');
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Up</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.brandBox}><Text style={styles.brandText}>Rent Clothes</Text></View>

        <View style={{ width: "100%", backgroundColor: "#ffff", paddingBottom: 80 }}>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 25, textAlign: 'center' }}>Create {selectedRole || 'Account'} Account</Text>
            <Text style={{ fontSize: 14, textAlign: 'center', color: '#666', marginTop: 5 }}>Sign up as a {selectedRole ? selectedRole.toLowerCase() : 'user'}</Text>
          </View>

          <Text style={{ marginStart: 40, marginTop: 10 }}>Name</Text>
          <TextInput onChangeText={setName} value={name} placeholder="ex: jon smith" placeholderTextColor="#c2c2c2ff" autoCapitalize="words" style={styles.input} />

          <Text style={{ marginStart: 40, marginTop: 5 }}>Email</Text>
          <TextInput onChangeText={setEmail} value={email} placeholder="ex: jon.smith@email.com" placeholderTextColor="#c2c2c2ff" keyboardType="email-address" autoCapitalize="none" style={styles.input} />

          <Text style={{ marginStart: 40, marginTop: 5 }}>Address</Text>
          <TextInput onChangeText={setAddress} value={address} placeholder="Enter your address" placeholderTextColor="#c2c2c2ff" multiline={true} style={{ ...styles.input, height: 60, borderRadius: 5 }} />

          <Text style={{ marginStart: 40, marginTop: 5 }}>Password</Text>
          <TextInput secureTextEntry onChangeText={setPassword} value={password} placeholder="Enter password (min 6 characters)" placeholderTextColor="#c2c2c2ff" style={styles.input} />

          <Text style={{ marginStart: 40, marginTop: 5 }}>Confirm password</Text>
          <TextInput secureTextEntry onChangeText={setConfirmpassword} value={confirmpassword} placeholder="Confirm your password" placeholderTextColor="#c2c2c2ff" style={styles.input} />

          <TouchableOpacity style={{ ...styles.button, backgroundColor: loading ? "#ccc" : "rgba(164, 123, 104, 1)" }} onPress={goToRegister} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
          </TouchableOpacity>

          <Text style={{ textAlign: "center", fontWeight: "200", marginTop: 12 }}>or sign up with</Text>
          <TouchableOpacity style={styles.socialBtn}><Text style={{ textAlign: "center" }}>🔵🟢🟡🔴</Text></TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
            <Text style={{ color: "#3b3b3bff", fontWeight: "200", fontSize: 12 }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: "#003366", fontWeight: "600", fontSize: 12 }}> Sign in</Text>
            </TouchableOpacity>
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
  socialBtn: { backgroundColor: "#F4F4F4", width: "13%", height: 40, alignSelf: "center", marginTop: 10, borderRadius: 6, justifyContent: 'center' }
});

export default Signup;
