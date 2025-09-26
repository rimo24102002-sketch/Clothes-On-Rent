import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { deleteAccount } from '../Helper/firebaseHelper';
import { useDispatch } from 'react-redux';
import { setUser, setRole } from '../redux/Slices/HomeDataSlice';

export default function DeleteAccount({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Forever', 
          style: 'destructive',
          onPress: () => {
            // Second confirmation
            Alert.alert(
              'Final Confirmation',
              'This is your last chance. Are you 100% sure you want to permanently delete your account?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Yes, Delete Forever', 
                  style: 'destructive',
                  onPress: performAccountDeletion
                }
              ]
            );
          }
        }
      ]
    );
  };

  const performAccountDeletion = async () => {
    setIsLoading(true);
    try {
      await deleteAccount();
      
      // Clear Redux state
      dispatch(setUser({}));
      dispatch(setRole(''));
      
      Alert.alert(
        'Account Deleted', 
        'Your account has been permanently deleted. We\'re sorry to see you go.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Delete account error:', error);
      
      let errorMessage = 'Failed to delete account. Please try again.';
      
      // Handle specific Firebase errors
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'For security reasons, please log out and log back in before deleting your account.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff',padding:20}}>
      <Text style={{fontSize:20,fontWeight:'bold',color:'black',marginBottom:20,textAlign:'center'}}>Delete Account</Text>
      
      <View style={{backgroundColor:'#ffebee',padding:15,borderRadius:8,marginBottom:20,borderLeftWidth:4,borderLeftColor:'#f44336'}}>
        <Text style={{fontSize:16,color:'#d32f2f',fontWeight:'600',marginBottom:5}}>⚠️ Warning</Text>
        <Text style={{fontSize:14,color:'#666',lineHeight:20}}>Deleting your account will permanently remove all your data, including profile information, orders, and history. This action cannot be undone.</Text>
      </View>

      <TouchableOpacity style={{backgroundColor:'#f44336',padding:15,borderRadius:8,alignItems:'center',marginBottom:10,opacity:isLoading?0.7:1}} onPress={handleDeleteAccount} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Delete Account Forever</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{backgroundColor:'#4caf50',padding:15,borderRadius:8,alignItems:'center'}} onPress={handleCancel} disabled={isLoading}>
        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Keep My Account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
