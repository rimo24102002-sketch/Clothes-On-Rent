import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Profile = () => {
    return (
        <ScrollView style={{ backgroundColor: 'rgba(243, 213, 198, 1)', height: '1000%' }}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 30}}>
                <View style={{ width: '19%', height: 60, borderRadius: 30, backgroundColor:"rgba(164, 123, 104, 1)", justifyContent: "center", alignItems: "center", }}>
                    <Ionicons name="person" size={30} color="#000" />
                </View>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}> Haya Pectrus</Text>
                    <Text style={{ fontSize: 14, color: "gray" }}>haya12@gmail.com</Text>
                </View>
                <View style={{ marginLeft: "auto" }}>
                    <Ionicons name="settings-sharp" size={22} color="#000" />
                </View>
            </View>

            <View
                style={{  backgroundColor: "#fffefeff",  borderRadius: 15,paddingVertical:25}} >
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 15, }} >
                    <Ionicons name="create-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>Edit Profile</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" style={{ marginLeft: "auto" }} />
                </TouchableOpacity>

             <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 15, }} >
                    <Ionicons name="settings-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>Privacy Setting</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" style={{ marginLeft: "auto" }} />
                </TouchableOpacity>
 <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 15, }} >
                    <Ionicons name="shield-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" style={{ marginLeft: "auto" }} />
                </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 15, }} >
                    <Ionicons name="trash-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>Delete Account</Text>
                    <Ionicons name="chevron-forward" size={18} color="gray" style={{ marginLeft: "auto" }} />
                </TouchableOpacity>
 <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", padding: 15, }} >
                    <Ionicons name="log-out-outline" size={20} color="gray" />
                    <Text style={{ marginLeft: 15, fontSize: 16, color: "#000" }}>Log out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Profile
