import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons";
const Payment = ({navigation}) => {
    return (
        <ScrollView style={{ backgroundColor: '#fffefeff', height: '1000%' }}>
            <View style={{ height: 90, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Order</Text>
            </View>
            <View style={{ height: 250, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Ionicons name="checkmark-circle" size={95} color="rgba(243, 216, 202, 1)'" />
                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginLeft: -23 }}>Order Successfull</Text>
                    <Text style={{ fontSize: 17 }}>Thank You!</Text>
                    
                </View>

            </View>
            <View style={{ backgroundColor: 'white', padding: 30, height:40, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ height: 30, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width:150, alignItems: 'center', borderRadius: 10,marginBottom:50 }}>
                    <Text style={{ fontSize: 18 }} onPress={() => navigation.navigate("Pending")}>View Order</Text>
                </TouchableOpacity>
            </View>
               <View style={{ backgroundColor: 'white', padding: 30, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20, }}>
                    <Text style={{ fontSize: 18 }} onPress={() => navigation.navigate("Home2")}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
}

export default Payment