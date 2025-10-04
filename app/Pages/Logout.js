import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Helper/firebaseHelper';
import { setRole, setUser } from '../redux/Slices/HomeDataSlice';

const { width } = Dimensions.get('window');

export default function Logout({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.home.user);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      `Are you sure you want to logout, ${user?.name || 'User'}?`,
      [
        { 
          text: 'Stay Logged In', 
          style: 'cancel',
          onPress: () => navigation.goBack()
        },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // Firebase logout
              await logout();
              
              // Clear Redux state
              dispatch(setUser({}));
              dispatch(setRole(''));
              
              // Navigate to login page
              // navigation.reset({
              //   index: 0,
              //   routes: [{ name: 'Login' }],
              // });
              
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e9ecef', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
       <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8E6652' }}>Logout</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 40, alignItems: 'center' }}>
        {/* Logout Icon */}
        <View style={{ marginBottom: 30 }}>
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 }}>
            <MaterialIcons name="logout" size={60} color="#8E6652" />
          </View>
        </View>

        {/* User Info Card */}
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 12, width: width - 40, marginBottom: 30, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 }}>
          <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#8E6652', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>{user?.name || 'User'}</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>{user?.email || 'user@example.com'}</Text>
            <Text style={{ fontSize: 12, color: '#8E6652', fontWeight: '600' }}>{user?.role || 'User'}</Text>
          </View>
        </View>

        {/* Logout Message */}
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40, lineHeight: 24, paddingHorizontal: 20 }}>
          Are you sure you want to logout? You'll need to sign in again to access your account.
        </Text>

        {/* Logout Button */}
        <TouchableOpacity 
          style={{ backgroundColor: '#8E6652', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 12, width: width - 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, ...(isLoading && { opacity: 0.7 }) }} 
          onPress={handleLogout} 
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Feather name="log-out" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity 
          style={{ backgroundColor: 'transparent', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 12, width: width - 40, borderWidth: 2, borderColor: '#dee2e6', justifyContent: 'center', alignItems: 'center', marginBottom: 30, ...(isLoading && { opacity: 0.7 }) }} 
          onPress={handleCancel} 
          disabled={isLoading}
        >
          <Text style={{ color: '#6c757d', fontSize: 16, fontWeight: '600' }}>Stay Logged In</Text>
        </TouchableOpacity>

        {/* Footer Message */}
        <Text style={{ fontSize: 14, color: '#adb5bd', textAlign: 'center', fontStyle: 'italic' }}>
          Your data is safe and will be available when you sign back in.
        </Text>
      </View>
    </SafeAreaView>
  );
}
