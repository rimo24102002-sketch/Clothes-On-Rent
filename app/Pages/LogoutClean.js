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
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });

              Alert.alert('Success', 'You have been logged out successfully.');

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
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
        {/* Enhanced Logout Icon */}
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

        {/* Enhanced User Info Card */}
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
              {user?.role || 'Customer'}
            </Text>
          </View>
        </View>

        {/* Enhanced Logout Message */}
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
