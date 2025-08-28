import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const Delete = () => {
    return (
        <View style={{ height: "100%", width: "100%", backgroundColor: "#ffffffff" }}>
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: "700", color: "#000000ff" }}>Deactivating or deleting your account</Text>
                <Text style={{ color: "#000000ff", marginTop: 10 }}>If you want to take a break from this app, you can temporarily deactivate your account.{"\n"}If you want to permanently delete your account, you can also do that. You can only deactivate your account once a week.</Text>
                <View style={{ backgroundColor: "#D9D9D9", borderRadius: 12, height: 110, marginTop: 20, width: "100%", flexDirection: "row" }}>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#000", marginStart: 10, marginTop: 5 }}>Deactivate account</Text>
                        <Text style={{ color: "#000", marginStart: 10 }}>Deactivating your account is temporary, and {"\n"}it means your profile and information will be{"\n"}hidden from other users until you reactivate{"\n"}it by logging in again.</Text>
                    </View>
                    <TouchableOpacity style={{ alignSelf: "center", marginLeft: 10 }}>
                        <MaterialIcons name="radio-button-on" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: "#D9D9D9", borderRadius: 12, marginTop: 20, width: "100%", height: 140, flexDirection: "row" }}>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#000", marginStart: 10, marginTop: 5 }}>Delete account</Text>
                        <Text style={{ color: "#000", marginStart: 10 }}>Deleting your account is permanent. When{"\n"}you delete your account, all your profile{"\n"}details, applications, messages, and activity{"\n"}will be permanently removed. If you'd just{"\n"}like to take a break, choose deactivation{"\n"}instead.</Text>
                    </View>
                    <TouchableOpacity style={{ alignSelf: "center", marginLeft: 10 }}>
                        <MaterialIcons name="radio-button-off" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Delete