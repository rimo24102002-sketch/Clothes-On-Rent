import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Cancel = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
      {/* Professional Header */}
      <View style={{
        backgroundColor: '#8E6652',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 20
      }}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('BottomTab');
            }
          }}
          style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
          marginTop: 10
        }}>
          Cancelled Orders
        </Text>
      </View>

      <View style={{ marginBottom: 15, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop:30, marginHorizontal: 20, gap: 20 }} >
          <TouchableOpacity onPress={() => navigation.navigate('CPending')}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "Black", backgroundColor: '#f7f1eeff', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, }}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Delivered')}>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "Black", backgroundColor: '#f7f1eeff', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, }}>
              Delivered
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ fontSize: 14, fontWeight: "500", color: "Black", backgroundColor: "rgba(164, 123, 104, 1)", paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, }}>
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ borderRadius: 10, padding: 15, marginTop: 40, width: "90%", height: 170, backgroundColor: '#F3D5C6' }}>
          <Text style={{ fontWeight: "bold" }}>Order #1524</Text>
          <Text> Date: 13/05/2025 </Text>
          <Text>Quantity: 1  </Text>
          <Text>Subtotal:34,500</Text>
          <Text style={{ color: 'red', marginTop: 5 }}>Cancelled</Text>
          <TouchableOpacity style={{ marginTop: 10, backgroundColor: "#f5f5f5", padding: 8, borderRadius: 6 }}>
            <Text>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Cancel;
