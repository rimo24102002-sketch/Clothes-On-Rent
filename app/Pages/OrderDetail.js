import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
const OrderDetails = ({ navigation }) => {
  return (
    <ScrollView style={{ backgroundColor: "#fff", height: '1000%' }}>

      <View style={{ marginBottom: 15, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", }}>Order #1524</Text>
        <View
          style={{ backgroundColor: "rgba(164, 123, 104, 1)", borderRadius: 12, padding: 15, margin: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", }} >

          <View>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
              Your order is delivered
            </Text>
            <Text style={{ color: "white", fontSize: 12, marginTop: 5 }}>
              Rate product to get 5 points for collect.
            </Text>
          </View>
          <Ionicons name="cube-outline" size={32} color="white" />
        </View>

        <View style={{ borderRadius: 10, padding: 15, marginTop: 40, width: "90%", height: 200, backgroundColor: '#F3D5C6' }}>
          <Text>Order number: #1524</Text>

          <Text>Delivery address: S&I Building, Software Park</Text>
          <Text>Maxi Dress  x1   45,000</Text>
          <Text>Sub Total: 45,000</Text>
          <Text>Shipping: 500</Text>
          <Text style={{ fontWeight: "bold" }}>Total: 45,500</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Detail")} style={{ marginTop: 10, backgroundColor: "#f5f5f5", padding: 8, borderRadius: 6 }}>
            <Text>Details</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(164, 123, 104, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20, marginTop: 50 }}>
          <Text style={{ fontSize: 18 }}onPress={() => navigation.navigate("Home2")} >Return Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ height: 50, backgroundColor: "rgba(249, 246, 245, 1)", justifyContent: 'center', width: 300, alignItems: 'center', borderRadius: 20, marginTop: 50 }}>
          <Text style={{ fontSize: 18 }}onPress={() => navigation.navigate("Reviews")} >Rate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OrderDetails;
