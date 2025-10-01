import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile, logout } from '../Helper/firebaseHelper';
import { clearUser } from '../redux/Slices/HomeDataSlice';
import Header from '../Components/Header';

const EProfile = ({ navigation }) => {
  const user = useSelector((state) => state.home.user);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      if (user?.uid) {
        const data = await getUserProfile(user.uid);
        setProfileData(data || user);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfileData(user);
    } finally {
      setLoading(false);
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
              dispatch(clearUser());
              // Navigation will be handled by the auth state change
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getDisplayName = () => {
    if (profileData?.firstName && profileData?.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`;
    }
    return profileData?.displayName || user?.displayName || 'Customer';
  };

  const getEmail = () => {
    return profileData?.email || user?.email || 'No email';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Customer Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Customer Profile" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profileData?.profileImageUrl ? (
              <Image 
                source={{ uri: profileData.profileImageUrl }} 
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={30} color="#8E6652" />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{getDisplayName()}</Text>
            <View style={styles.emailRow}>
              <Ionicons name="mail-outline" size={14} color="#8E6652" />
              <Text style={styles.profileEmail}>{getEmail()}</Text>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Profiles')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="create-outline" size={20} color="#666" />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Order')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="bag-outline" size={20} color="#666" />
              <Text style={styles.menuItemText}>My Orders</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Password')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-outline" size={20} color="#666" />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={20} color="#666" />
              <Text style={styles.menuItemText}>Privacy Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Complain')}
          >
            <View style={styles.menuItemLeft}>
              <AntDesign name="exclamationcircleo" size={20} color="#666" />
              <Text style={styles.menuItemText}>Issue a Complaint</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Delete')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="trash-outline" size={20} color="#dc3545" />
              <Text style={[styles.menuItemText, { color: '#dc3545' }]}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#dc3545" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="log-out-outline" size={20} color="#dc3545" />
              <Text style={[styles.menuItemText, { color: '#dc3545' }]}>Logout</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#dc3545" />
          </TouchableOpacity>
        </View>

        {/* Switch to Seller */}
        <View style={styles.switchContainer}>
          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => {
              // Here you would implement role switching logic
              Alert.alert('Coming Soon', 'Seller mode will be available soon!');
            }}
          >
            <Ionicons name="storefront-outline" size={20} color="#fff" />
            <Text style={styles.switchButtonText}>Switch to Seller</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F1DCD1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8E6652',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 6,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  switchContainer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E6652',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
};

export default EProfile;
