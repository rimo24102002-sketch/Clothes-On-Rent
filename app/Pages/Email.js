import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
export default function Email() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 10 }}>Email Support</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
    
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 20 }}>
          <Ionicons name="mail" size={24} color="#8E6652" style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 16, color: '#333' }}>Send us an email and we'll get back to you within 24 hours</Text>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#8E6652' }}>Contact Information</Text>
          
          <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>Full Name *</Text>
            <TextInput placeholder="Enter your full name" editable={false} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 }} />

            <Text style={{ fontSize: 16, marginBottom: 5 }}>Email Address *</Text>
            <TextInput placeholder="Enter your email address" editable={false} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 }} />

            <Text style={{ fontSize: 16, marginBottom: 5 }}>Subject *</Text>
            <TextInput placeholder="Brief description of your issue" editable={false} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 }} />

            <Text style={{ fontSize: 16, marginBottom: 5 }}>Message *</Text>
            <TextInput placeholder="Please describe your issue..." editable={false} multiline numberOfLines={4} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, minHeight: 100 }} />
          </View>
        </View>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8E6652', padding: 15, borderRadius: 10 }}>
          <Ionicons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Send Email</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
