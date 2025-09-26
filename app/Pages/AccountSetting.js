import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function AccountSettings({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#ddd' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Account Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ padding: 15 }}>

        <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 10 }}>Account Management</Text>
        <TouchableOpacity 
          style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}
          onPress={() => navigation.navigate('Password')}
        >
          <Text style={{ fontSize: 15 }}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 10 }}>Privacy & Security</Text>
        <TouchableOpacity 
          style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <Text style={{ fontSize: 15 }}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}
          onPress={() => navigation.navigate('TermsOfService')}
        >
          <Text style={{ fontSize: 15 }}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 10 }}>Support</Text>
        <TouchableOpacity 
          style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <Text style={{ fontSize: 15 }}>Help Center</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}
          onPress={() => navigation.navigate('Reviews')}
        >
          <Text style={{ fontSize: 15 }}>Reviews</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: '600', marginVertical: 10 }}>Danger Zone</Text>
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center', backgroundColor: '#8E6652', borderRadius: 8, marginBottom: 10 }}
          onPress={() => navigation.navigate('Logout')}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center', backgroundColor: '#8E6652', borderRadius: 8 }}
          onPress={() => navigation.navigate('Delete')}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
