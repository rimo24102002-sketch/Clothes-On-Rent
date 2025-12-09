import React, { useState, memo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import StandardHeader from '../Components/StandardHeader';
import { addData } from "../Helper/firebaseHelper";

// Define styles first so InputField can access them
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1DCD1',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8E6652',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8E6652',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#dc3545',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  submitButton: {
    backgroundColor: '#8E6652',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});

// Memoized InputField component to prevent recreation on each render
const InputField = memo(({ label, value, onChangeText, placeholder, keyboardType = 'default', icon, required = false }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
    <View style={styles.inputWrapper}>
      {icon && <Ionicons name={icon} size={20} color="#8E6652" style={styles.inputIcon} />}
      <TextInput
        style={[styles.input, icon && styles.inputWithIcon]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
      />
    </View>
  </View>
));

export default function RiderManagement({ navigation }) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid || '';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cnic: '',
    address: '',
    city: '',
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    notes: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter rider name');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Validation Error', 'Please enter rider phone number');
      return false;
    }
    if (!formData.cnic.trim()) {
      Alert.alert('Validation Error', 'Please enter CNIC number');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Validation Error', 'Please enter address');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Validation Error', 'Please enter city');
      return false;
    }
    if (!formData.vehicleType.trim()) {
      Alert.alert('Validation Error', 'Please enter vehicle type');
      return false;
    }
    if (!formData.vehicleNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter vehicle number');
      return false;
    }
    if (!formData.licenseNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter license number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const riderData = {
        ...formData,
        sellerId: sellerId,
        status: 'active', // active, inactive, on-delivery
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await addData('riders', riderData);
      
      Alert.alert(
        'Success',
        'Rider registered successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                name: '',
                phone: '',
                email: '',
                cnic: '',
                address: '',
                city: '',
                vehicleType: '',
                vehicleNumber: '',
                licenseNumber: '',
                emergencyContact: '',
                emergencyContactPhone: '',
                notes: '',
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error registering rider:', error);
      Alert.alert('Error', 'Failed to register rider. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StandardHeader 
        title="Rider Management" 
        navigation={navigation} 
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Register New Rider</Text>
          <Text style={styles.sectionSubtitle}>Fill in the details to register a new rider</Text>

          {/* Personal Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={18} color="#8E6652" />
              <Text style={styles.sectionHeaderText}>Personal Information</Text>
            </View>
            
            <InputField
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter rider's full name"
              icon="person-outline"
              required
            />

            <InputField
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              icon="call-outline"
              required
            />

            <InputField
              label="Email (Optional)"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter email address"
              keyboardType="email-address"
              icon="mail-outline"
            />

            <InputField
              label="CNIC Number"
              value={formData.cnic}
              onChangeText={(value) => handleInputChange('cnic', value)}
              placeholder="Enter CNIC number (e.g., 12345-1234567-1)"
              icon="card-outline"
              required
            />
          </View>

          {/* Address Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={18} color="#8E6652" />
              <Text style={styles.sectionHeaderText}>Address Information</Text>
            </View>
            
            <InputField
              label="Address"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Enter street address"
              icon="home-outline"
              required
            />

            <InputField
              label="City"
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
              placeholder="Enter city"
              icon="location-outline"
              required
            />
          </View>

          {/* Vehicle Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="car-outline" size={18} color="#8E6652" />
              <Text style={styles.sectionHeaderText}>Vehicle Information</Text>
            </View>
            
            <InputField
              label="Vehicle Type"
              value={formData.vehicleType}
              onChangeText={(value) => handleInputChange('vehicleType', value)}
              placeholder="e.g., Motorcycle, Bicycle, Car"
              icon="bicycle-outline"
              required
            />

            <InputField
              label="Vehicle Number"
              value={formData.vehicleNumber}
              onChangeText={(value) => handleInputChange('vehicleNumber', value)}
              placeholder="Enter vehicle registration number"
              icon="car-sport-outline"
              required
            />

            <InputField
              label="License Number"
              value={formData.licenseNumber}
              onChangeText={(value) => handleInputChange('licenseNumber', value)}
              placeholder="Enter driving license number"
              icon="card-outline"
              required
            />
          </View>

          {/* Emergency Contact */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call-outline" size={18} color="#8E6652" />
              <Text style={styles.sectionHeaderText}>Emergency Contact</Text>
            </View>
            
            <InputField
              label="Emergency Contact Name"
              value={formData.emergencyContact}
              onChangeText={(value) => handleInputChange('emergencyContact', value)}
              placeholder="Enter emergency contact name"
              icon="person-outline"
            />

            <InputField
              label="Emergency Contact Phone"
              value={formData.emergencyContactPhone}
              onChangeText={(value) => handleInputChange('emergencyContactPhone', value)}
              placeholder="Enter emergency contact phone"
              keyboardType="phone-pad"
              icon="call-outline"
            />
          </View>

          {/* Additional Notes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={18} color="#8E6652" />
              <Text style={styles.sectionHeaderText}>Additional Information</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(value) => handleInputChange('notes', value)}
                placeholder="Any additional notes or information"
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Register Rider</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

