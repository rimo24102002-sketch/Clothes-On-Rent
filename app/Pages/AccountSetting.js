import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from "@expo/vector-icons";

export default function AccountSettings({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    
      <View style={{ height:80,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#ddd',backgroundColor:'#8E6652'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '700',color:'#fff',marginRight:110}}>Account Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ padding: 15 }}>

        <Text style={{ fontSize: 19, fontWeight: '600', marginVertical: 10,color:'#8E6652',marginTop:15 }}>Account Management</Text>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}
          onPress={() => navigation.navigate('Password')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="lock" size={20} color="#8E6652" />
            <Text style={{ fontSize: 15, marginLeft: 12 }}>Change Password</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="bell" size={20} color="#8E6652" />
            <Text style={{ fontSize: 15, marginLeft: 12 }}>Notification Settings</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: '635', marginVertical: 10 }}>Privacy & Security</Text>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="shield" size={20} color="#8E6652" />
            <Text style={{ fontSize: 15, marginLeft: 12 }}>Privacy Policy</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}
          onPress={() => navigation.navigate('TermsOfService')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="file-text" size={20} color="#8E6652" />
            <Text style={{ fontSize: 15, marginLeft: 12 }}>Terms of Service</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: '635', marginVertical: 10 }}>Support</Text>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="help-circle" size={20} color="#8E6652" />
            <Text style={{ fontSize: 15, marginLeft: 12 }}>Help Center</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}
          onPress={() => navigation.navigate('Reviews')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="star" size={20} color="#8E6652" />
            <Text style={{ fontSize: 15, marginLeft: 12 }}>Reviews</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: '635', marginVertical: 10,marginTop:20 }}>Danger Zone</Text>
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center', backgroundColor: '#8E6652', borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'center' }}
          onPress={() => navigation.navigate('Logout')}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 8 }}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ padding: 15, alignItems: 'center', backgroundColor: '#8E6652', borderRadius: 8, flexDirection: 'row', justifyContent: 'center' }}
          onPress={() => navigation.navigate('Delete')}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 8 }}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
