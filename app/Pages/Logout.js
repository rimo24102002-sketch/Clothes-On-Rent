import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setRole, setUser, setName, setSelectedRole, clearCart } from '../_redux/Slices/HomeDataSlice';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '../_redux/store/Index';

const { width } = Dimensions.get('window');


export default function Logout({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.home.user);
  const userRole = useSelector(state => state.home.role);

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      `Are you sure you want to logout, ${user?.name || 'User'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              console.log('🚺 Starting logout process...');

              // Step 1: Sign out from Firebase Auth
              console.log('🔥 Signing out from Firebase...');
              await signOut(auth);
              
              // Verify Firebase sign-out
              const isSignedOut = auth.currentUser === null;
              console.log('✅ Firebase signOut complete - currentUser is null:', isSignedOut);

              // Step 2: Clear all Redux state
              console.log('🧹 Clearing Redux state...');
              dispatch(setUser({}));
              dispatch(setName(''));
              dispatch(setRole(''));
              dispatch(setSelectedRole(''));
              dispatch(clearCart());

              // Step 3: Wait for state to propagate
              await new Promise(resolve => setTimeout(resolve, 100));
              
              console.log('✅ Logout complete!');

              // Hide loading before showing success alert
              setIsLoading(false);

              // Show success alert with role-specific message
              const logoutMessage = userRole === 'Seller' 
                ? "You're logged out of your Seller account. Your shop dashboard, listings, and seller data remain safe — log back in anytime to resume. If you want to delete your seller account permanently, contact support."
                : "You're logged out of your Customer account. Your rentals, order history and preferences are saved — sign back in anytime to continue. Want to delete your account? Visit Settings → Delete Account.";

              Alert.alert(
                'Logged Out Successfully',
                logoutMessage,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to Home screen (not Login) - users can choose their path from there
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                      });
                      console.log('� Navigated to Home screen after logout');
                    }
                  }
                ]
              );

            } catch (error) {
              console.error('❌ Logout error:', error);
              setIsLoading(false);
              Alert.alert('Error', 'Failed to logout. Please try again.');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      {isLoading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.8)',
          zIndex: 1000,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 12,
            alignItems: 'center',
            elevation: 6
          }}>
            <ActivityIndicator size="large" color="#8E6652" />
            <Text style={{ marginTop: 12, color: '#8E6652', fontWeight: '600' }}>Signing out...</Text>
          </View>
        </View>
      )}
      {/* Professional Header */}
      <View style={{
        backgroundColor: '#8E6652',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 20
      }}>
        <TouchableOpacity
          onPress={handleCancel}
          style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
          marginTop: 10
        }}>
          Logout
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, alignItems: 'center' }}>
        {/* Logout Icon */}
        <View style={{
          marginBottom: 30,
          alignItems: 'center'
        }}>
          <View style={{
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            borderWidth: 4,
            borderColor: '#F1DCD1'
          }}>
            <MaterialIcons name="logout" size={70} color="#8E6652" />
          </View>
        </View>

        {/* User Info Card */}
        <View style={{
          backgroundColor: '#fff',
          padding: 25,
          borderRadius: 20,
          width: width - 40,
          marginBottom: 30,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.15,
          shadowRadius: 8
        }}>
          <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#8E6652',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            alignSelf: 'center',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4
          }}>
            <Text style={{
              color: '#fff',
              fontSize: 24,
              fontWeight: 'bold'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>

          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#8E6652',
            textAlign: 'center',
            marginBottom: 8
          }}>
            {user?.name || 'User'}
          </Text>

          <Text style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
            marginBottom: 5
          }}>
            {user?.email || 'user@example.com'}
          </Text>

          <View style={{
            backgroundColor: '#f8f9fa',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 15,
            alignSelf: 'center',
            marginTop: 8
          }}>
            <Text style={{
              fontSize: 12,
              color: '#8E6652',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {userRole === 'seller' ? 'Seller Account' : 'Customer Account'}
            </Text>
          </View>
        </View>

        {/* Logout Message */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 15,
          padding: 20,
          marginBottom: 30,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          width: width - 40
        }}>
          <Text style={{
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 15
          }}>
            Are you sure you want to logout?
          </Text>

          <Text style={{
            fontSize: 14,
            color: '#999',
            textAlign: 'center',
            lineHeight: 20
          }}>
            You'll need to sign in again to access your account and continue using the app.
          </Text>
        </View>

        {/* Enhanced Action Buttons */}
        <TouchableOpacity
          style={{
            backgroundColor: '#8E6652',
            paddingVertical: 18,
            paddingHorizontal: 50,
            borderRadius: 15,
            width: width - 40,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15,
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            ...(isLoading && { opacity: 0.7 })
          }}
          onPress={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Feather name="log-out" size={20} color="white" style={{ marginRight: 10 }} />
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold'
              }}>
                Logout
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: 'transparent',
            paddingVertical: 18,
            paddingHorizontal: 50,
            borderRadius: 15,
            width: width - 40,
            borderWidth: 2,
            borderColor: '#8E6652',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            ...(isLoading && { opacity: 0.7 })
          }}
          onPress={handleCancel}
          disabled={isLoading}
        >
          <Text style={{
            color: '#8E6652',
            fontSize: 16,
            fontWeight: '600'
          }}>
            Stay Logged In
          </Text>
        </TouchableOpacity>

        {/* Enhanced Security Note */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 15,
          padding: 20,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          width: width - 40
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10
          }}>
            <Feather name="shield" size={18} color="#27AE60" />
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#27AE60',
              marginLeft: 8
            }}>
              Secure Logout
            </Text>
          </View>
          <Text style={{
            fontSize: 12,
            color: '#666',
            lineHeight: 18,
            textAlign: 'center'
          }}>
            Your session will be ended securely. All your data remains safe and will be available when you sign back in.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
