import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { deleteAccount, deleteCustomerAccount } from '../Helper/firebaseHelper';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setRole, clearUser } from '../redux/Slices/HomeDataSlice';

export default function DeleteAccount({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.home.user);
  const role = useSelector(state => state.home.role);
  
  // Determine if user is customer or seller
  // Since we're forcing customer mode in _layout.js, always treat as customer
  const isCustomer = true; // Force customer mode for now
  const userType = 'Customer';
  const userTypeDisplay = 'customer';

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
      // Use appropriate delete function based on user type
      if (isCustomer) {
        await deleteCustomerAccount(user?.uid);
      } else {
        await deleteAccount();
      }
      
      // Clear Redux state
      dispatch(clearUser());
      
      Alert.alert(
        'Account Deleted', 
        `Your ${userTypeDisplay} account and all associated data have been permanently deleted.`,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      {/* Header */}
      <View style={{ height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#8E6652' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>Delete Account</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={{ flex: 1, padding: 20 }}>
      
      <View style={{backgroundColor:'#ffebee',padding:15,borderRadius:8,marginBottom:20,borderLeftWidth:4,borderLeftColor:'#f44336'}}>
        <Text style={{fontSize:16,color:'#d32f2f',fontWeight:'600',marginBottom:5}}>⚠️ Warning</Text>
        <Text style={{fontSize:14,color:'#666',lineHeight:20}}>Deleting your account will permanently remove all your data, including profile information, orders, and history. This action cannot be undone.</Text>
      </View>

      <TouchableOpacity style={{backgroundColor:'#8E6652',padding:15,borderRadius:8,alignItems:'center',marginBottom:10,opacity:isLoading?0.7:1}} onPress={handleDeleteAccount} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Delete Account Forever</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{backgroundColor:'#8E6652',padding:15,borderRadius:8,alignItems:'center'}} onPress={handleCancel} disabled={isLoading}>
        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Keep My Account</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
