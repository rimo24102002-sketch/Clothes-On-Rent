import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { getDataById } from '../Helper/firebaseHelper';
import { setUser } from '../redux/Slices/HomeDataSlice';
import { logout } from '../Helper/firebaseHelper';
import { setRole } from '../redux/Slices/HomeDataSlice';

const PendingApproval = ({ navigation }) => {
  const user = useSelector((state) => state.home.user);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // Auto-check status on component mount
  useEffect(() => {
    checkApprovalStatus(true); // Silent check on mount
  }, []);

  const checkApprovalStatus = async (silent = false) => {
    setRefreshing(true);
    try {
      console.log('Checking approval status for user:', user.uid);
      console.log('Checking approval status for sellerId:', user.sellerId);
      
      // Check both users and sellers collections
      const userData = await getDataById('users', user.uid);
      console.log('Fetched user data:', userData);
      console.log('User status:', userData?.status);
      
      // Also check sellers collection if sellerId exists
      let sellerData = null;
      if (user.sellerId) {
        sellerData = await getDataById('sellers', user.sellerId);
        console.log('Fetched seller data:', sellerData);
        console.log('Seller status:', sellerData?.status);
      }
      
      // Use seller status if available, otherwise use user status
      const currentStatus = sellerData?.status || userData?.status;
      console.log('Final status to use:', currentStatus);
      
      if (currentStatus === 'approved') {
        // Update Redux with merged data (prioritize seller data)
        const updatedUserData = {
          ...userData,
          ...sellerData,
          uid: userData.uid, // Keep original uid
          status: 'approved'
        };
        dispatch(setUser(updatedUserData));
        console.log('Status approved! Updated Redux store with:', updatedUserData);
        if (!silent) {
          Alert.alert('Approved!', 'Your seller account has been approved! You can now access all features.');
        }
      } else if (currentStatus === 'rejected') {
        console.log('Status rejected');
        if (!silent) {
          Alert.alert('Application Rejected', 'Your seller application has been rejected. Please contact support for more information.');
        }
      } else {
        console.log('Status still pending');
        if (!silent) {
          Alert.alert('Still Pending', 'Your account is still awaiting admin approval. Please check back later.');
        }
      }
    } catch (error) {
      console.error('Error checking approval status:', error);
      if (!silent) {
        Alert.alert('Error', 'Failed to check approval status. Please try again.');
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              dispatch(setRole(''));
              dispatch(setUser({}));
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#8E6652', paddingVertical: 20, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 20 }}>
          Pending Approval
        </Text>
        <Text style={{ fontSize: 14, color: '#f5f5f5', marginTop: 8 }}>
          Your seller account is awaiting admin approval
        </Text>
      </View>

      {/* Status Banner */}
      <View style={{ margin: 24, backgroundColor: '#FFF3CD', borderRadius: 12, padding: 20, borderLeftWidth: 4, borderLeftColor: '#FFA500' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Feather name="clock" size={24} color="#FF8C00" />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#856404', marginLeft: 12 }}>
            Awaiting Approval
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: '#856404', lineHeight: 22 }}>
          Your seller account is currently under review. You'll be able to access all seller features once an admin approves your account. This usually takes 24-48 hours.
        </Text>
      </View>

      {/* Credentials Card */}
      <View style={{ marginHorizontal: 24, marginBottom: 24, backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 20 }}>
          Your Account Details
        </Text>

        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Feather name="user" size={18} color="#8E6652" />
            <Text style={{ fontSize: 14, color: "#666", marginLeft: 10, flex: 1 }}>
              Name: <Text style={{ fontWeight: '600', color: '#333' }}>{user?.name || "Not available"}</Text>
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Feather name="mail" size={18} color="#8E6652" />
            <Text style={{ fontSize: 14, color: "#666", marginLeft: 10, flex: 1 }}>
              Email: <Text style={{ fontWeight: '600', color: '#333' }}>{user?.email || "Not available"}</Text>
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Feather name="tag" size={18} color="#8E6652" />
            <Text style={{ fontSize: 14, color: "#666", marginLeft: 10, flex: 1 }}>
              Seller ID: <Text style={{ fontWeight: '600', color: '#333' }}>{user?.sellerId || user?.uid?.substring(0, 8) || "Pending"}</Text>
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Feather name="map-pin" size={18} color="#8E6652" />
            <Text style={{ fontSize: 14, color: "#666", marginLeft: 10, flex: 1 }}>
              Address: <Text style={{ fontWeight: '600', color: '#333' }}>{user?.address || "Not available"}</Text>
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="info" size={18} color="#8E6652" />
            <Text style={{ fontSize: 14, color: "#666", marginLeft: 10, flex: 1 }}>
              Status: <Text style={{ fontWeight: '600', color: '#FFA500', textTransform: 'capitalize' }}>{user?.status || "Pending"}</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Refresh Button */}
      <TouchableOpacity 
        style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#8E6652', 
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
          marginHorizontal: 24,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3
        }}
        onPress={checkApprovalStatus}
        disabled={refreshing}
      >
        {refreshing ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Feather name="refresh-cw" size={20} color="#fff" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff', marginLeft: 8 }}>
              Check Approval Status
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity 
        style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff', 
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
          marginHorizontal: 24,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: '#8E6652'
        }}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color="#8E6652" />
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#8E6652', marginLeft: 8 }}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* Help Text */}
      <View style={{ marginHorizontal: 24, marginBottom: 40 }}>
        <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', lineHeight: 18 }}>
          Need help? Contact support at{' '}
          <Text style={{ color: '#8E6652', fontWeight: '600' }}>support@rentclothes.com</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default PendingApproval;
