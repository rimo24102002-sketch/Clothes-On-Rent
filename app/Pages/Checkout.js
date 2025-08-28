import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native'
import React from 'react'
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
const Checkout = () => {
    return (
        <ScrollView style={{ backgroundColor: "#F3D5C6", height: '1000%' }}>
            <View style={{ width: '100%', height: 300, backgroundColor: "#f9f9f9ff", }}>
                <View style={{ alignItems: "center", padding: 15, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>Checkout</Text>
                </View>
                <View style={{ height: 50, backgroundColor: "#f8f8f8ff", flexDirection: 'row', padding: 15, gap: 135 }}>
                    <Text>Shipping Address</Text>
                    <TouchableOpacity style={{ width: '25%', height: 35, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}><Text>CHANGE</Text></TouchableOpacity>
                </View>
                <View style={{ width: '40%', flexDirection: 'row', padding: 10}}>
                    <Ionicons name="location-outline" size={22} color="black" />
                    <Text>Home</Text>
                    <View style={{  marginTop: '10', marginLeft: '-40' }}>
                        <TextInput placeholder="Address">
                        </TextInput>
                    </View>
                </View>
                <View style={{ height: 50, backgroundColor: "#fcf5f5ff", flexDirection: 'row', padding: 15, gap: 100 }}>
                    <Text>Choosing Shipping Type</Text>
                    <TouchableOpacity style={{ width: '25%', height: 35, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', alignItems: 'center', borderRadius: 10 }} ><Text>CHANGE</Text></TouchableOpacity>
                </View>
                <View style={{ width: '40%', flexDirection: 'row', padding: 5, height: 60, marginLeft:'10'}}>
                    <MaterialIcons name="local-shipping" size={20} color="black" />
                    <Text>Economy</Text>
                     <View style={{  marginTop: '15', marginLeft: '-65' }}>
                        <TextInput placeholder="Estimated Arrival 25,august,2026">
                        </TextInput>
                    </View>
                </View>
            </View>
            <Text style={{ fontWeight: 'bold', padding: 17, fontSize: 15 }}>Order List</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3D5C6", padding: 10, }}>
                <Image source={require('./Bold.png')} style={{ width: 70, height: 90, borderRadius: 8, marginRight: 12 }} />
                <View style={{ backgroundColor: "#F3D5C6", width: '60%' }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Eastern Gharara</Text>
                    <Text style={{ fontSize: 14, color: "gray", marginVertical: 5 }}>Rs: 39,999</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <TouchableOpacity style={{ width: '15%', height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 8 }}>1</Text>
                        <TouchableOpacity style={{ width: 32, height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontSize: 14, marginHorizontal: 8 }}>M</Text>
                <TouchableOpacity>
                    <Ionicons name="trash-outline" size={22} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3D5C6", padding: 10, }}>
                <Image source={require('./Bold1.png')} style={{ width: 70, height: 90, borderRadius: 8, marginRight: 12 }} />
                <View style={{ backgroundColor: "#F3D5C6", width: '60%' }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>Lehnga</Text>
                    <Text style={{ fontSize: 14, color: "gray", marginVertical: 5 }}>Rs:32,000</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                        <TouchableOpacity style={{ width: '15%', height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 8 }}>1</Text>
                        <TouchableOpacity style={{ width: 32, height: 28, borderWidth: 1, borderColor: "gray", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontSize: 14, marginHorizontal: 8 }}>L</Text>
                <TouchableOpacity>
                    <Ionicons name="trash-outline" size={22} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: "#F3D5C6", padding: 30 }}>
                <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20 }}>
                    <Text style={{ fontSize: 18 }}>Continue to payment</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
}

export default Checkout