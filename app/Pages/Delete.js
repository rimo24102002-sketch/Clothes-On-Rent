import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { deleteAccount, reauthenticateUser } from '../Helper/firebaseHelper';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setRole } from '../redux/Slices/HomeDataSlice';
import { Feather } from '@expo/vector-icons';

export default function DeleteAccount({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.home.user);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Forever', 
          style: 'destructive',
          onPress: () => setShowPasswordModal(true)
        }
      ]
    );
  };

  const performAccountDeletion = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password to confirm account deletion.');
      return;
    }

    setIsLoading(true);
    try {
      // First re-authenticate the user
      await reauthenticateUser(user.email, password);
      
      // Then delete the account
      await deleteAccount();
      
      // Clear Redux state
      dispatch(setUser({}));
      dispatch(setRole(''));
      
      // Close modal and reset password
      setShowPasswordModal(false);
      setPassword('');
      
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
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please enter your correct password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/requires-recent-login') {
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

      <TouchableOpacity style={{backgroundColor:'#8E6652',padding:15,borderRadius:8,alignItems:'center',marginBottom:10,opacity:isLoading?0.7:1}} onPress={handleDeleteAccount} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Delete Account Forever</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{backgroundColor:'#8E6652',padding:15,borderRadius:8,alignItems:'center'}} onPress={handleCancel} disabled={isLoading}>
        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Keep My Account</Text>
      </TouchableOpacity>

      {/* Password Confirmation Modal */}
      <Modal visible={showPasswordModal} transparent={true} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%', maxWidth: 400 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Feather name="shield" size={24} color="#8E6652" />
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#333', marginLeft: 10 }}>Confirm Your Identity</Text>
            </View>
            
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 }}>
              For security reasons, please enter your password to confirm account deletion.
            </Text>
            
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Password</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  backgroundColor: '#F8F9FA'
                }}
                placeholder="Enter your password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                autoFocus={true}
              />
            </View>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#E0E0E0',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center'
                }}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
                disabled={isLoading}
              >
                <Text style={{ color: '#666', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#dc3545',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: isLoading ? 0.7 : 1
                }}
                onPress={performAccountDeletion}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Delete Forever</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
