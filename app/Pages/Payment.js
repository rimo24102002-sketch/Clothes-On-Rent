import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from 'react-native-vector-icons/Ionicons';
const Payment = () => {
    return (
        <ScrollView style={{ backgroundColor: '#fffefeff', height: '1000%' }}>
            <View style={{ height: 90, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Payment Method</Text>
            </View>
            <View style={{ height: 120, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <FontAwesome5 name="motorcycle" size={30} color="#000" />
                    <Text style={{ fontSize: 17, marginRight: '80', marginTop: '5' }}>Cash on delivery</Text>
                </View>
                <TouchableOpacity style={{ height: 40, width: '12%', backgroundColor: "rgba(164, 123, 104, 1)", borderRadius: 50,justifyContent:'center',alignItems:'center' }}>
                       <Ionicons name="checkmark" size={30} color="white" />
                      </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: 'white', padding: 30, height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20, }}>
                    <Text style={{ fontSize: 18 }}>Confirm Payment</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default Payment