import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { AntDesign, Ionicons, MaterialCommunityIcons, Foundation, Feather, Fontisto } from "@expo/vector-icons";

const Privacy = () => {
    return (
        <View style={{ height: "100%", width: "100%", backgroundColor: "#ffff" }}>
            <Text style={{ fontWeight: "600", fontSize: 20, marginTop: 30, textAlign: "center" }}>Privacy Setting</Text>
            <View style={{ backgroundColor: "#ffffffff", height: 300, width: '90%', borderRadius: 12, alignSelf: "center", marginTop: 25, justifyContent: "space-evenly" }}>
                <View style={{ width: "100%", height: "70", backgroundColor: "#efeeeeff", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text>   Show my profile to others</Text>
                    </View>
                    <TouchableOpacity style={{ justifyContent: "flex-end", marginRight: 15 }}>
                        <Fontisto name="toggle-on" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%", height: "70", backgroundColor: "#efeeeeff", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text>   Share my email</Text>
                    </View>
                    <TouchableOpacity style={{ justifyContent: "flex-end", marginRight: 15 }}>
                        <Fontisto name="toggle-on" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%", height: "70", backgroundColor: "#efeeeeff", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text>   Allow notifications</Text>
                    </View>
                    <TouchableOpacity style={{ justifyContent: "flex-end", marginRight: 15 }}>
                        <Fontisto name="toggle-on" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%", height: "70", backgroundColor: "#efeeeeff", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text>   Allow location access</Text>
                    </View>
                    <TouchableOpacity style={{ justifyContent: "flex-end", marginRight: 15 }}>
                        <Fontisto name="toggle-on" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Privacy