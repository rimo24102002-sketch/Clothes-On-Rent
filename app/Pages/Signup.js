import { View, Text, ImageBackground, TouchableOpacity,ScrollView } from 'react-native'
import React from 'react'
import Fontisto from '@expo/vector-icons/Fontisto';

const Signup = () => {
    return (
       <ScrollView style={{ flex: 1, backgroundColor: "#fefcfcff" }}>
                  <View style={{ width: '60%', height: 50, backgroundColor:"rgba(164, 123, 104, 1)", borderRadius: 20, justifyContent: "center", alignSelf: "center", marginTop: 40, }} >
                      <Text style={{ fontSize:20, fontWeight: "bold", color: "#f9f9f9ff", textAlign: "center" }}>Rent Clothes</Text>
                  </View>
            <View style={{ width: "100%", height: "90%", backgroundColor: "#ffff" }}>
                <View style={{ backgroundColor: "#ffffffff", marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25, textAlign: 'center' }}>Create your account</Text>
                </View>
                <Text style={{ marginStart: 40, marginTop: 10 }}>Name</Text>
                <TouchableOpacity style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, justifyContent: "center", marginStart: 40, marginTop: 5 }}>
                    <Text style={{ color: "#c2c2c2ff", fontWeight: "400", fontSize: 16 }}>  ex: jon smith</Text>
                </TouchableOpacity>
                <Text style={{ marginStart: 40, marginTop: 5 }}>Email/Mobile</Text>
                <TouchableOpacity style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, justifyContent: "center", marginStart: 40, marginTop: 5 }}>
                    <Text style={{ color: "#c2c2c2ff", fontWeight: "400", fontSize: 16 }}>  ex: jon.smith@email.com</Text>
                </TouchableOpacity>
                <Text style={{ marginStart: 40, marginTop: 5 }}>Address</Text>
                <TouchableOpacity style={{ backgroundColor: "#F4F4F4", borderRadius: 5, width: '80%', height: 40, justifyContent: "center", marginStart: 40, marginTop: 5 }}>
                    <Text style={{ color: "#c2c2c2ff", fontWeight: "400", fontSize: 16 }}>*********</Text>
                </TouchableOpacity>
               
                <Text style={{ marginStart: 40, marginTop: 5 }}>Password</Text>
                <TouchableOpacity style={{ backgroundColor: "#F4F4F4", borderRadius: 5, width: '80%', height: 40, justifyContent: "center", marginStart: 40, marginTop: 5 }}>
                    <Text style={{ color: "#c2c2c2ff", fontWeight: "400", fontSize: 16 }}>  *********</Text>
                </TouchableOpacity>
                <Text style={{ marginStart: 40, marginTop: 5 }}>Confirm password</Text>
                <TouchableOpacity style={{ backgroundColor: "#F4F4F4", borderRadius: 10, width: '80%', height: 40, justifyContent: "center", marginStart: 40, marginTop: 5 }}>
                    <Text style={{ color: "#c2c2c2ff", fontWeight: "400", fontSize: 16 }}>  *********</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 5, flexDirection: "row", marginStart: 40 }}>
                    <Fontisto name="checkbox-passive" size={15} color="#3b3b3bff" />
                    <Text style={{ color: "#3b3b3bff", fontWeight: "300", fontSize: 10, textAlign: "right", marginRight: 35 }}>   I understood the terms & policy.</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor:"rgba(164, 123, 104, 1)", borderRadius: 8, alignSelf: "center", width: '80%', height: 45, justifyContent: "center", marginTop: 15 }}>
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16, textAlign: "center" }}>SIGN UP</Text>
                </TouchableOpacity>
                <Text style={{ textAlign: "center", fontWeight: "200", marginTop: 5 }}>or sign up with</Text>
                <TouchableOpacity style={{ backgroundColor: "#F4F4F4", width: "13%", height: "6%", alignSelf: "center", marginTop: 10 }}>
                    <Text style={{ textAlign: "center" }}>🔵🟢🟡🔴</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={{ color: "#3b3b3bff", fontWeight: "200", fontSize: 10, textAlign: "center", marginTop: 10 }}>Don’t have an account? </Text>
                    <TouchableOpacity>
                        <Text style={{ color: "#003366", fontWeight: "300", fontSize: 10, marginTop: 10 }}>Signin</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default Signup