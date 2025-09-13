import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setRole } from '../redux/Slices/HomeDataSlice';
import { handleSignUp } from '../Helper/firebaseHelper';

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const dispatch = useDispatch();

  const goToRegister = async () => {

    const user = await handleSignUp(
      email,
      password,
      { role: "Customer", name, email, address }
    );

    if (user?.uid) {
      dispatch(setRole("Customer"));
      dispatch(setUser(user));

    } else {
      alert("Error in sign up");
    }

  }
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
          placeholder="ex: jon smith"
          placeholderTextColor="#c2c2c2ff"
          style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, marginStart: 40, marginTop: 5 }}
        />

        <Text style={{ marginStart: 40, marginTop: 5 }}>Email</Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          placeholder="ex: jon.smith@email.com"
          placeholderTextColor="#c2c2c2ff"
          style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, marginStart: 40, marginTop: 5 }}
        />

        <Text style={{ marginStart: 40, marginTop: 5 }}>Address</Text>
        <TextInput
          onChangeText={(text) => setAddress(text)}
          placeholder="xxxxxxx"
          placeholderTextColor="#c2c2c2ff"
          style={{ backgroundColor: "#F4F4F4", borderRadius: 5, width: '80%', height: 40, marginStart: 40, marginTop: 5 }}
        />

        <Text style={{ marginStart: 40, marginTop: 5 }}>Password</Text>
        <TextInput
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          placeholder="********"
          placeholderTextColor="#c2c2c2ff"
          style={{ backgroundColor: "#F4F4F4", borderRadius: 5, width: '80%', height: 40, marginStart: 40, marginTop: 5 }}
        />

        <Text style={{ marginStart: 40, marginTop: 5 }}>Confirm password</Text>
        <TextInput
          secureTextEntry
          onChangeText={(text) => setConfirmpassword(text)}
          placeholder="*********"
          placeholderTextColor="#c2c2c2ff"
          style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, marginStart: 40, marginTop: 5 }}
        />

        <TouchableOpacity style={{ marginTop: 5, flexDirection: "row", marginStart: 40 }}>
          <Fontisto name="checkbox-passive" size={15} color="#3b3b3bff" />
          <Text style={{ color: "#3b3b3bff", fontWeight: "300", fontSize: 10 }}>   I understood the terms & policy.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: "rgba(164, 123, 104, 1)", borderRadius: 8, alignSelf: "center", width: '80%', height: 45, justifyContent: "center", marginTop: 15 }}
          onPress={goToRegister}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16, textAlign: "center" }}>SIGN UP</Text>
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

