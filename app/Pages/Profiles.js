import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import {
  getUserProfile,
  updateUserProfile,
  uploadImageToCloudinary
} from '../Helper/firebaseHelper';
import { setUser } from '../redux/Slices/HomeDataSlice';
import Header from '../Components/Header';

const CustomerProfile = ({ navigation }) => {
  const user = useSelector((state) => state.home.user);
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Profile data states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      if (user?.uid) {
        const profileData = await getUserProfile(user.uid);
        if (profileData) {
          setFirstName(profileData.firstName || '');
          setLastName(profileData.lastName || '');
          setEmail(profileData.email || user.email || '');
          setPhone(profileData.phone || '');
          setAddress(profileData.address || '');
          setGender(profileData.gender || '');
          setProfileImage(profileData.profileImageUrl || null);
        } else {
          // Set default values from user object
          setEmail(user.email || '');
          setFirstName(user.displayName?.split(' ')[0] || '');
          setLastName(user.displayName?.split(' ')[1] || '');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!firstName.trim() || !lastName.trim()) {
        Alert.alert('Error', 'Please fill in your first and last name');
        return;
      }

      setSaving(true);
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        gender: gender.trim(),
        profileImageUrl: profileImage,
        displayName: `${firstName.trim()} ${lastName.trim()}`,
        updatedAt: new Date().toISOString()
      };

      await updateUserProfile(user.uid, profileData);
      
      // Update Redux store
      dispatch(setUser({ ...user, ...profileData }));
      
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.navigate('EProfile');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageLoading(true);
        setShowImageModal(false);
        
        const imageUri = result.assets[0].uri;
        const uploadedUrl = await uploadImageToCloudinary(imageUri);
        setProfileImage(uploadedUrl);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    } finally {
      setImageLoading(false);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageLoading(true);
        setShowImageModal(false);
        
        const imageUri = result.assets[0].uri;
        const uploadedUrl = await uploadImageToCloudinary(imageUri);
        setProfileImage(uploadedUrl);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfileImage(null);
            setShowImageModal(false);
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Customer Profile" onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Customer Profile" 
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity 
            onPress={handleSaveProfile} 
            disabled={saving}
            style={styles.saveButton}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={() => setShowImageModal(true)}
            disabled={imageLoading}
          >
            {imageLoading ? (
              <View style={styles.imageLoadingContainer}>
                <ActivityIndicator size="large" color="#8E6652" />
              </View>
            ) : profileImage ? (
              <>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                <View style={styles.editIconOverlay}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </View>
              </>
            ) : (
              <>
                <Ionicons name="camera-outline" size={40} color="#8E6652" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.fullWidthContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.input, styles.emailContainer]}>
              <View style={styles.emailContent}>
                <Ionicons name="mail-outline" size={18} color="#8E6652" />
                <Text style={styles.emailText}>{email || 'No email provided'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.fullWidthContainer}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.input}>
              <View style={styles.phoneContent}>
                <Ionicons name="call-outline" size={18} color="#8E6652" />
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          <View style={styles.fullWidthContainer}>
            <Text style={styles.label}>Address</Text>
            <View style={[styles.input, styles.addressContainer]}>
              <View style={styles.addressContent}>
                <Ionicons name="location-outline" size={18} color="#8E6652" />
                <TextInput
                  style={styles.addressTextInput}
                  placeholder="Enter your address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          <View style={styles.fullWidthContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderOption,
                    gender === option && styles.selectedGenderOption
                  ]}
                  onPress={() => setGender(option)}
                >
                  <Text style={[
                    styles.genderText,
                    gender === option && styles.selectedGenderText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Image Selection Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Photo</Text>
            
            <TouchableOpacity style={styles.modalOption} onPress={pickImageFromGallery}>
              <Ionicons name="images-outline" size={24} color="#8E6652" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalOption} onPress={takePhotoWithCamera}>
              <Ionicons name="camera-outline" size={24} color="#8E6652" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            {profileImage && (
              <TouchableOpacity style={[styles.modalOption, styles.removeOption]} onPress={removeImage}>
                <Ionicons name="trash-outline" size={24} color="#dc3545" />
                <Text style={[styles.modalOptionText, { color: '#dc3545' }]}>Remove Photo</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  saveButton: {
    backgroundColor: '#8E6652',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#8E6652',
    position: 'relative',
  },
  imageLoadingContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 114,
    height: 114,
    borderRadius: 57,
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8E6652',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E6652',
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  fullWidthContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  emailContainer: {
    backgroundColor: '#f8f9fa',
    borderColor: '#d1d5db',
    justifyContent: 'center',
    minHeight: 48,
  },
  emailContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  phoneContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
    paddingVertical: 0,
  },
  addressContainer: {
    height: 80,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  addressTextInput: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
    textAlignVertical: 'top',
    paddingVertical: 0,
    minHeight: 60,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedGenderOption: {
    backgroundColor: '#8E6652',
    borderColor: '#8E6652',
  },
  genderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedGenderText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  removeOption: {
    backgroundColor: '#fff2f2',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  modalCancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
};

export default CustomerProfile;
