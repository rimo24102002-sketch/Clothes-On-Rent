import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const Pending = ({ navigation }) => {
    return (
        <ScrollView style={{ backgroundColor: "#fff", height: '1000%' }}>
            <View style={{ marginBottom: 15, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", }}>My Orders</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 30, marginHorizontal: 20, gap: 20 }} >
                    <TouchableOpacity><Text style={{ fontSize: 14, fontWeight: "500", color: "Black", backgroundColor: '#f7f1eeff', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, }} onPress={() => navigation.navigate("Pending")} > Pending</Text></TouchableOpacity>
                    <TouchableOpacity ><Text style={{ fontSize: 14, fontWeight: "500", color: "Black", backgroundColor: "rgba(164, 123, 104, 1)", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, }} >Deliverd</Text></TouchableOpacity>
                    <TouchableOpacity><Text style={{ fontSize: 14, fontWeight: "500", color: "Black", backgroundColor: '#f7f1eeff', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, }} onPress={() => navigation.navigate("Cancel")} >Cancelled</Text></TouchableOpacity>
                </View>
                <View style={{ borderRadius: 10, padding: 15, marginTop: 20, width: "90%", height: 170, backgroundColor: '#F3D5C6' }}>
                    <Text style={{ fontWeight: "bold" }}>Order #1524</Text>
                    <Text> Date: 13/05/2025 </Text>
                    <Text>Quantity: 1  </Text>
                    <Text>Subtotal:34,500</Text>
                   <TouchableOpacity onPress={() => navigation.navigate("OrderDetail")}><Text style={{ color: 'green', marginTop: 5 }}>Deliverd</Text></TouchableOpacity> 
                    <TouchableOpacity style={{ marginTop: 10, backgroundColor: "#f5f5f5", padding: 8, borderRadius: 6 }}>
                        <Text>Details</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderRadius: 10, padding: 15, marginTop: 20, width: "90%", height: 170, backgroundColor: '#F3D5C6' }}>
                    <Text style={{ fontWeight: "bold" }}>Order #1010</Text>
                    <Text> Date: 25/09/2025 </Text>
                    <Text>Quantity:2 </Text>
                    <Text>Subtotal:44,000</Text>
                    <Text style={{ color: 'green', marginTop: 5 }}>Deliverd</Text>
                    <TouchableOpacity style={{ marginTop: 10, backgroundColor: "#f5f5f5", padding: 8, borderRadius: 6 }}>
                        <Text>Details</Text>
                    </TouchableOpacity>
                </View>
            </View>



        </ScrollView>
    );
};

export default Pending
