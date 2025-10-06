import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function Checkout({navigation}) {
    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Checkout</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', gap:15 }}>
                <TextInput placeholder="Full Name"
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: '80%', height: 45, padding: 10, }} />
                <TextInput placeholder="Street Address"
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: '80%', height: 45, padding: 10, }} />
                <TextInput placeholder="City"
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: '80%', height: 45, padding: 10, }} />
                <TextInput placeholder="State/Province"
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: '80%', height: 45, padding: 25 }} />
                <TextInput placeholder="Phone Number"
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: '80%', height: 45, padding: 10, }} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold',padding:30}}>Shipping Method</Text>
           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 ,padding:10}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 2, borderColor: '#a7daa7ff', alignItems: 'center', justifyContent: 'center',   marginRight:10 }}>
          <TouchableOpacity style={{  height: 10,  width: 10,  borderRadius: 5,  backgroundColor: '#4caf50',padding:5}} />
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>₨ 500  Delivery to home</Text>
          <Text style={{ fontSize: 13, color: 'gray' }}>Delivery within 3 to 7 business days</Text>
        </View>
      </View>
    </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity style={{ backgroundColor: "rgba(164, 123, 104, 1)", borderRadius: 18, alignSelf: "center", width: '80%', height: 45, justifyContent: "center", marginTop: 15 }} >
                    <Text style={{ color:'black', fontWeight: "600", fontSize: 16, textAlign: "center" }} onPress={() => navigation.navigate("Payment")}>Continue To Payment</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
