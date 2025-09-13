import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
const VTO = ({navigation}) => {
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fdfdfdff" }}>
            <View style={{with:"100%",height:700,backgroundColor:'white',paddingVertical:300}}>
                <View style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Text style={{ textAlign: "center" }}>Take a full-front body photo{"\n"} using a mobile device</Text>
                    <View style={{ width: "100%",height: 50, justifyContent: 'space-between', alignItems: 'center', }}>
                        <TouchableOpacity><Ionicons name="camera-outline" size={50} color="black" onPress={() => navigation.navigate("Cart")} /></TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default VTO