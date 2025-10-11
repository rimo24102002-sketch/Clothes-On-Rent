import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  getCustomerProfile,
  updateCustomerProfile,
  uploadCustomerProfileImage,
  deleteCustomerProfileImage,
  uploadImageToCloudinary
} from '../Helper/firebaseHelper';
import { setUser } from '../redux/Slices/HomeDataSlice';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const Profiles = ({ navigation }) => {
  const user = useSelector((state) => state.home.user);
  const dispatch = useDispatch();
  const nav = useNavigation();

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    gender: '',
    phone: '',
    profileImageUrl: null
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState(null);

  // Load profile data
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      if (user?.uid) {
        const profile = await getCustomerProfile(user.uid);
        if (profile) {
          setProfileData({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            address: profile.address || '',
            email: profile.email || user.email || '',
            gender: profile.gender || '',
            phone: profile.phone || '',
            profileImageUrl: profile.profileImageUrl || null
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile image selection
  const handleImagePicker = async () => {
    try {
      console.log('Starting image picker...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Permission to access photos is required to select a profile picture.'
        );
        return;
      }

      console.log('Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      console.log('Image picker result:', result);

      if (result.canceled) {
        console.log('User cancelled image picker');
        return;
      }

      const pickedImage = result.assets[0];
      setImage(pickedImage.uri);

      // Upload to Cloudinary
      setImageLoading(true);
      const uploadedUrl = await uploadImageToCloudinary(pickedImage.uri);

      if (uploadedUrl && user?.uid) {
        await uploadCustomerProfileImage(user.uid, uploadedUrl);
        setProfileData((prev) => ({ ...prev, profileImageUrl: uploadedUrl }));
        Alert.alert('Success', 'Profile image updated successfully!');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  // Handle text input changes
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate form before saving
  const validateForm = () => {
    const errors = [];

    if (!profileData.firstName.trim()) {
      errors.push('First name is required');
    }

    if (!profileData.lastName.trim()) {
      errors.push('Last name is required');
    }

    if (profileData.phone && !/^\+?[\d\s\-\(\)]+$/.test(profileData.phone.replace(/\s/g, ''))) {
      errors.push('Please enter a valid phone number');
    }

    if (profileData.address && profileData.address.length < 10) {
      errors.push('Please provide a complete address');
    }

    return errors;
  };

  // Handle profile save
  const handleSave = async () => {
    try {
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        Alert.alert('Validation Error', validationErrors.join('\n'));
        return;
      }

      setSaving(true);

      if (user?.uid) {
        const updateData = {
          firstName: profileData.firstName.trim(),
          lastName: profileData.lastName.trim(),
          address: profileData.address.trim(),
          phone: profileData.phone.trim(),
          gender: profileData.gender.trim(),
          updatedAt: new Date().toISOString()
        };

        await updateCustomerProfile(user.uid, updateData);

        const updatedUser = { ...user, ...updateData };
        dispatch(setUser(updatedUser));

        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => nav.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1DCD1' }}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={{ marginTop: 10, color: '#8E6652' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: "#F1DCD1", flex: 1 }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#8E6652',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 20
      }}>
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
          marginTop: 10
        }}>
          Edit Profile
        </Text>
      </View>

      {/* Profile Image */}
      <View style={{ alignItems: 'center', paddingVertical: 20 }}>
        <TouchableOpacity onPress={handleImagePicker} disabled={imageLoading}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}>
            {imageLoading ? (
              <ActivityIndicator size="small" color="#8E6652" />
            ) : profileData.profileImageUrl ? (
              <Image
                source={{ uri: profileData.profileImageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="camera-outline" size={40} color="#8E6652" />
                <Text style={{ fontSize: 12, color: '#8E6652', marginTop: 5 }}>Add Photo</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <Text style={{
          marginTop: 10,
          fontSize: 14,
          color: '#8E6652',
          textAlign: 'center'
        }}>
          {imageLoading ? 'Uploading...' : 'Tap to change profile photo'}
        </Text>
      </View>

      {/* Form Fields */}
      <View style={{ paddingHorizontal: 20 }}>
        {/* Name Fields */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 15,
          marginBottom: 15,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#8E6652',
            marginBottom: 8,
            marginLeft: 15,
            marginTop: 15
          }}>
            Full Name *
          </Text>
          <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
            <TextInput
              placeholder='First Name'
              value={profileData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
              style={{
                flex: 1,
                fontSize: 16,
                color: '#333',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0'
              }}
              placeholderTextColor="#999"
            />
            <TextInput
              placeholder='Last Name'
              value={profileData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              style={{
                flex: 1,
                fontSize: 16,
                color: '#333',
                paddingVertical: 12,
                marginLeft: 15,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0'
              }}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Contact Information */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 15,
          marginBottom: 15,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#8E6652',
            marginBottom: 8,
            marginLeft: 15,
            marginTop: 15
          }}>
            Contact Information
          </Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0'
          }}>
            <Ionicons name="mail-outline" size={18} color="#8E6652" style={{ marginRight: 10 }} />
            <Text style={{ fontSize: 16, color: '#333', flex: 1 }}>
              {profileData.email}
            </Text>
            <Text style={{ fontSize: 12, color: '#8E6652', fontStyle: 'italic' }}>
              (from login)
            </Text>
          </View>

          <TextInput
            placeholder='Phone Number (Optional)'
            value={profileData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            keyboardType="phone-pad"
            style={{
              fontSize: 16,
              color: '#333',
              paddingVertical: 12,
              paddingHorizontal: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0'
            }}
            placeholderTextColor="#999"
          />
        </View>

        {/* Personal Information */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 15,
          marginBottom: 15,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#8E6652',
            marginBottom: 8,
            marginLeft: 15,
            marginTop: 15
          }}>
            Personal Information
          </Text>

          <TextInput
            placeholder='Complete Address (Optional)'
            value={profileData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            multiline
            numberOfLines={2}
            style={{
              fontSize: 16,
              color: '#333',
              paddingVertical: 12,
              paddingHorizontal: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0',
              minHeight: 60,
              textAlignVertical: 'top'
            }}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder='Gender (Optional)'
            value={profileData.gender}
            onChangeText={(text) => handleInputChange('gender', text)}
            style={{
              fontSize: 16,
              color: '#333',
              paddingVertical: 12,
              paddingHorizontal: 15,
            }}
            placeholderTextColor="#999"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{
            backgroundColor: saving ? '#ccc' : '#8E6652',
            borderRadius: 25,
            height: 55,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 30,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          {saving ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>
                Saving...
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profiles;
