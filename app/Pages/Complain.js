import React from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Complain = () => {
    return (
        <ScrollView style={{ backgroundColor: "#fff", height: "100%", padding: 20 }}>
            {/* <TouchableOpacity>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity> */}
            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}> Complaints </Text>
            <View
                style={{ width: "90%", marginTop: 20, marginLeft: "5%", backgroundColor: "#ffffff", borderRadius: 10, padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, }} >
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
                    Order Info
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 10, fontSize: 14, color: "#555", }} >Order ID: </Text>
                    <TextInput style={{ fontWeight: "600" }} placeholder='...' />

                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 10, fontSize: 14, color: "#555", }} >Product: </Text>
                    <TextInput style={{ fontWeight: "600" }} placeholder='...' />

                </View>

            </View>
            <Text style={{ fontSize: 16, fontWeight: "15", marginTop: 25 }}> What is your complaint?</Text>

            <TextInput style={{ width: "100%", height: 100, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 15, textAlignVertical: "top" }} placeholder='Write your complaint...' />
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#f9f1ed", justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="camera-outline" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={{ marginTop: 5 }}>Add your photo</Text>
            </View>
            <View style={{ backgroundColor: 'white', padding: 30, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20, marginTop: '50' }}>
                    <Text style={{ fontSize: 18 }}>Send Complaint</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

    );
};

export default Complain

