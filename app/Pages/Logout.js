import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

export default function Logout() {
  const handleLogout = () => {
    Alert.alert('Logout Successful', 'You have been logged out successfully.');
  };

  const handleCancel = () => {
    Alert.alert('Cancelled', 'You stayed logged in.');
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff',padding:20}}>
      <Text style={{fontSize:20,fontWeight:'bold',color:'black',marginBottom:20,textAlign:'center'}}>Logout</Text>

      <TouchableOpacity style={{backgroundColor:'#8E6652',padding:15,borderRadius:8,alignItems:'center',marginBottom:10}} onPress={handleLogout}>
        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{backgroundColor:'gray',padding:15,borderRadius:8,alignItems:'center'}} onPress={handleCancel}>
        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}