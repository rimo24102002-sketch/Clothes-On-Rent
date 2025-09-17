import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

export default function DeleteAccount() {
  const handleDeleteAccount = () => {
    Alert.alert('Deleted', 'Your account has been permanently deleted.');
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff',padding:20}}>
      <Text style={{fontSize:20,fontWeight:'bold',color:'black',marginBottom:20,textAlign:'center'}}>Delete Account</Text>

      <TouchableOpacity style={{backgroundColor:'#8E6652',padding:15,borderRadius:8,alignItems:'center',marginBottom:10}} onPress={handleDeleteAccount}>
        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{backgroundColor:'gray',padding:15,borderRadius:8,alignItems:'center'}}>
        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Cancel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
