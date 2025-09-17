import { View, Text, ImageBackground, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { setUser, setRole } from '../redux/Slices/HomeDataSlice';
import { login } from "../Helper/firebaseHelper";

const Login = ({ navigation }) => {
   
  const [email, setEmail] = useState("Fg7Kt@example.com");
  const [password, setPassword] = useState("123456");
  const dispatch = useDispatch();
  const handleLogin = async () => {
  
    const user =await login(email, password)

    alert(user.role)
      if (user?.uid) {
          dispatch(setRole("Seller"));
          dispatch(setUser(user));
            
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
                <TextInput  onChangeText={(text) => setEmail(text)}
                value={email}
                    placeholder="ex: jon.smith@email.com"
                    placeholderTextColor="#c2c2c2ff"
                    style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, justifyContent: "center", marginStart: 40, marginTop: 5 }}>
                </TextInput>
                <Text style={{ marginStart: 40, marginTop: 10 }}>Password</Text>
                <TextInput  onChangeText={(text) => setPassword(text)}
                  value={password}
                    placeholder=""
                    placeholderTextColor="#c2c2c2ff"
                    style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, justifyContent: "center", marginStart: 40, marginTop: 5 }}>
                </TextInput>

                         <TouchableOpacity style={{ marginTop: 5 }}>
                    <Text style={{ color: "#3b3b3bff", fontWeight: "300", fontSize: 10, textAlign: "right", marginRight: 35 }} onPress={() => navigation.navigate("ForgotPassword")}>Forgot Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "rgba(164, 123, 104, 1)", borderRadius: 8, alignSelf: "center", width: '80%', height: 45, justifyContent: "center", marginTop: 15 }}onPress={ handleLogin} >
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16, textAlign: "center" }} onPress={() => navigation.navigate("Profile")}>SIGN IN</Text>
                </TouchableOpacity>
                <Text style={{ textAlign: "center", fontWeight: "200", marginTop: 5 }}>or sign in with</Text>
                <TouchableOpacity style={{ backgroundColor: "#F4F4F4", width: "15%", height: "10%", alignSelf: "center", marginTop: 10 }}>
                    <Text style={{ textAlign: "center", fontSize: 15 }}>🔵🟢🟡🔴</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ color: "#3b3b3bff", fontWeight: "200", fontSize: 10, textAlign: "center", marginTop: 10 }}>Don’t have an account? </Text>
                </View>
                 <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity>
                        <Text style={{ color: "rgba(164, 123, 104, 1)", fontWeight: "800", fontSize: 11, marginTop: 10 }} onPress={() => navigation.navigate("SignUp")}>SignUp</Text>
                    </TouchableOpacity>
                    </View>
            </View>
        </ScrollView>
    )
}

export default Login;