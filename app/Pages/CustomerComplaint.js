import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { submitCustomerComplaint } from "../Helper/firebaseHelper";
import * as ImagePicker from 'expo-image-picker';

const CustomerComplaint = ({ navigation }) => {
  const user = useSelector((state) => state.home.user);

  // Initialize state with proper defaults
  const [complaintData, setComplaintData] = useState({
    category: '',
    subject: '',
    description: '',
    orderId: '',
    productName: '',
    priority: 'medium',
    imageUrl: null
  });

  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const categories = [
    { id: 'general', name: 'General Issue', icon: 'help-circle-outline' },
    { id: 'order', name: 'Order Related', icon: 'receipt-outline' },
    { id: 'product', name: 'Product Quality', icon: 'shirt-outline' },
    { id: 'delivery', name: 'Delivery Issue', icon: 'car-outline' },
    { id: 'payment', name: 'Payment Problem', icon: 'card-outline' },
    { id: 'technical', name: 'App/Technical', icon: 'bug-outline' },
    { id: 'other', name: 'Other', icon: 'ellipsis-horizontal-outline' }
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: '#28A745' },
    { id: 'medium', name: 'Medium', color: '#FFC107' },
    { id: 'high', name: 'High', color: '#DC3545' }
  ];

  const handleInputChange = (field, value) => {
    setComplaintData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageLoading(true);
        setComplaintData(prev => ({ ...prev, imageUrl: result.assets[0].uri }));
        setImageLoading(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
      setImageLoading(false);
    }
  };

  const validateForm = () => {
    if (!complaintData.category) {
      Alert.alert('Error', 'Please select a complaint category');
      return false;
    }
    if (!complaintData.subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return false;
    }
    if (!complaintData.description.trim()) {
      Alert.alert('Error', 'Please describe your issue');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!user?.uid) {
      Alert.alert('Error', 'Please log in to submit a complaint');
      return;
    }

    try {
      setLoading(true);

      const complaintPayload = {
        customerId: user.uid,
        customerName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer',
        customerEmail: user.email,
        category: complaintData.category,
        subject: complaintData.subject.trim(),
        description: complaintData.description.trim(),
        orderId: complaintData.orderId.trim(),
        productName: complaintData.productName.trim(),
        priority: complaintData.priority,
        imageUrl: complaintData.imageUrl,
        status: 'pending',
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      };

      await submitCustomerComplaint(complaintPayload);

      Alert.alert(
        'Complaint Submitted Successfully!',
        'Thank you for your feedback. We will review your complaint and respond within 24-48 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              setComplaintData({
                category: '',
                subject: '',
                description: '',
                orderId: '',
                productName: '',
                priority: 'medium',
                imageUrl: null
              });
              if (navigation.canGoBack()) {
              navigation.goBack();
              } else {
                navigation.navigate('BottomTab');
              }
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert('Error', 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryModal = () => (
    <Modal
      visible={showCategoryModal}
      animationType="slide"
      transparent={true}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
      }}>
        <View style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '60%'
        }}>
          <View style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#8E6652'
            }}>
              Select Complaint Category
            </Text>
          </View>

          <ScrollView style={{ padding: 20 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0'
                }}
                onPress={() => {
                  handleInputChange('category', category.id);
                  setShowCategoryModal(false);
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#F1DCD1',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 15
                }}>
                  <Ionicons name={category.icon} size={20} color="#8E6652" />
                </View>
                <Text style={{
                  fontSize: 16,
                  color: '#333',
                  flex: 1
                }}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={{
              padding: 20,
              alignItems: 'center',
              backgroundColor: '#f8f9fa'
            }}
            onPress={() => setShowCategoryModal(false)}
          >
            <Text style={{ color: '#8E6652', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const selectedCategory = categories.find(cat => cat.id === complaintData.category);

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
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('BottomTab');
            }
          }}
          style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
          marginTop: 10
        }}>
          Submit Complaint
        </Text>
        <Text style={{
          fontSize: 14,
          textAlign: 'center',
          color: '#F1DCD1',
          marginTop: 5
        }}>
          We value your feedback
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {/* Info Banner */}
        <View style={{
          backgroundColor: '#E8F5E8',
          borderRadius: 15,
          padding: 15,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          borderLeftWidth: 4,
          borderLeftColor: '#8E6652'
        }}>
          <Ionicons name="information-circle-outline" size={24} color="#8E6652" style={{ marginRight: 12 }} />
          <Text style={{ fontSize: 14, color: '#333', flex: 1 }}>
            Your complaint will be reviewed within 24-48 hours. We'll respond via email.
          </Text>
        </View>

        {/* Category Selection */}
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
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0'
            }}
            onPress={() => setShowCategoryModal(true)}
          >
            <View style={{
              width: 45,
              height: 45,
              borderRadius: 22.5,
              backgroundColor: '#F1DCD1',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 15
            }}>
              <Ionicons
                name={selectedCategory?.icon || 'help-circle-outline'}
                size={22}
                color="#8E6652"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                color: '#666',
                marginBottom: 2
              }}>
                What type of issue are you facing?
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: selectedCategory ? '#333' : '#999'
              }}>
                {selectedCategory ? selectedCategory.name : 'Select a category'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E6652" />
          </TouchableOpacity>

          {/* Priority Selection */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15
          }}>
            <Text style={{
              fontSize: 14,
              color: '#666',
              marginRight: 15,
              minWidth: 60
            }}>
              Priority:
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.id}
                  style={{
                    backgroundColor: complaintData.priority === priority.id ? priority.color : '#f0f0f0',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 15,
                    marginRight: 8,
                    borderWidth: complaintData.priority === priority.id ? 2 : 1,
                    borderColor: priority.color
                  }}
                  onPress={() => handleInputChange('priority', priority.id)}
                >
                  <Text style={{
                    color: complaintData.priority === priority.id ? '#fff' : '#333',
                    fontSize: 12,
                    fontWeight: '600'
                  }}>
                    {priority.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Order/Product Info */}
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
            fontSize: 16,
            fontWeight: '600',
            color: '#8E6652',
            marginBottom: 15,
            marginLeft: 20,
            marginTop: 20
          }}>
            Related Information (Optional)
          </Text>

          <View style={{
            paddingHorizontal: 20,
            paddingBottom: 20
          }}>
            <TextInput
              placeholder="Order ID (if applicable)"
              value={complaintData.orderId}
              onChangeText={(text) => handleInputChange('orderId', text)}
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: 10,
                padding: 15,
                fontSize: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#e9ecef'
              }}
              placeholderTextColor="#999"
            />

            <TextInput
              placeholder="Product Name (if applicable)"
              value={complaintData.productName}
              onChangeText={(text) => handleInputChange('productName', text)}
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: 10,
                padding: 15,
                fontSize: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#e9ecef'
              }}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Subject & Description */}
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
          <TextInput
            placeholder="Brief subject of your complaint *"
            value={complaintData.subject}
            onChangeText={(text) => handleInputChange('subject', text)}
            style={{
              padding: 20,
              fontSize: 16,
              color: '#333',
              borderBottomWidth: 1,
              borderBottomColor: '#f0f0f0'
            }}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Please describe your issue in detail... *"
            value={complaintData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
            numberOfLines={6}
            style={{
              padding: 20,
              fontSize: 16,
              color: '#333',
              minHeight: 120,
              textAlignVertical: 'top'
            }}
            placeholderTextColor="#999"
          />
        </View>

        {/* Image Upload */}
        <TouchableOpacity
          onPress={handleImagePicker}
          disabled={imageLoading}
          style={{
            backgroundColor: '#fff',
            borderRadius: 15,
            marginBottom: 15,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            padding: 20,
            alignItems: 'center'
          }}
        >
          {imageLoading ? (
            <ActivityIndicator size="small" color="#8E6652" />
          ) : complaintData.imageUrl ? (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: complaintData.imageUrl }}
                style={{ width: 60, height: 60, borderRadius: 10, marginBottom: 10 }}
              />
              <Text style={{ color: '#8E6652', fontSize: 14 }}>Change Image</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#F1DCD1',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10
              }}>
                <Ionicons name="camera-outline" size={28} color="#8E6652" />
              </View>
              <Text style={{ color: '#8E6652', fontSize: 14 }}>Add Supporting Image</Text>
              <Text style={{ color: '#999', fontSize: 12, marginTop: 5 }}>
                (Optional - helps us understand better)
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#8E6652',
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
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{
              fontSize: 18,
              color: '#fff',
              fontWeight: 'bold'
            }}>
              Submit Complaint
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {renderCategoryModal()}
    </ScrollView>
  );
};

export default CustomerComplaint;
