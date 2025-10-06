import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { sendCustomerComplaint } from "../Helper/firebaseHelper";

export default function CustomerHelpCenter({ navigation }) {
  const user = useSelector((state) => state.home.user);
  
  const [showContactModal, setShowContactModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Contact form state
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const categories = [
    { id: 'order', name: 'Order Issues', icon: 'receipt-outline' },
    { id: 'payment', name: 'Payment Problems', icon: 'card-outline' },
    { id: 'delivery', name: 'Delivery Issues', icon: 'car-outline' },
    { id: 'product', name: 'Product Quality', icon: 'cube-outline' },
    { id: 'account', name: 'Account Issues', icon: 'person-outline' },
    { id: 'general', name: 'General Inquiry', icon: 'help-circle-outline' }
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: '#27AE60' },
    { id: 'medium', name: 'Medium', color: '#F39C12' },
    { id: 'high', name: 'High', color: '#E74C3C' }
  ];

  const faqItems = [
    {
      question: "How do I submit a complaint?",
      answer: "Use the 'Submit Complaint to Admin' button above to send your complaint directly to our admin team."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Cash on Delivery (COD) for all orders. Online payment options will be available soon."
    },
    {
      question: "How long does it take to get a response?",
      answer: "Our admin team typically responds to complaints within 24-48 hours during business days."
    },
    {
      question: "What information should I include in my complaint?",
      answer: "Please provide as much detail as possible including order details, seller information, and a clear description of the issue."
    },
    {
      question: "Can I contact sellers directly?",
      answer: "For any issues or complaints, please contact our admin team who will handle all communications with sellers on your behalf."
    }
  ];

  const handleSubmitComplaint = async () => {
    if (!category || !priority || !subject.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      
      const complaintData = {
        customerId: user?.uid,
        customerName: user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Customer',
        customerEmail: user?.email || '',
        category,
        priority,
        subject: subject.trim(),
        description: description.trim()
      };

      await sendCustomerComplaint(complaintData);
      
      Alert.alert(
        "Success", 
        "Your complaint has been submitted successfully. Our support team will review it and get back to you soon.",
        [{ text: "OK", onPress: () => {
          setShowContactModal(false);
          resetForm();
        }}]
      );
      
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert("Error", "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategory('');
    setPriority('');
    setSubject('');
    setDescription('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      {/* Header */}
      <View style={{ height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#8E6652' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Contact Support */}
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15 }}>Contact Support</Text>
          
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
            onPress={() => setShowContactModal(true)}
          >
            <Ionicons name="mail-outline" size={20} color="#8E6652" />
            <Text style={{ marginLeft: 12, fontSize: 16, color: '#333', flex: 1 }}>Submit Complaint to Admin</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15 }}>Frequently Asked Questions</Text>
          
          {faqItems.map((item, index) => (
            <View key={index} style={{ marginBottom: 15, paddingBottom: 15, borderBottomWidth: index < faqItems.length - 1 ? 1 : 0, borderBottomColor: '#f0f0f0' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>{item.question}</Text>
              <Text style={{ fontSize: 13, color: '#666', lineHeight: 18 }}>{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* Admin Contact Info */}
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15 }}>Admin Support Team</Text>
          
          <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, padding: 15, marginBottom: 15 }}>
            <Text style={{ fontSize: 14, color: '#333', fontWeight: '500', marginBottom: 8 }}>
              📧 All complaints are handled by our admin team
            </Text>
            <Text style={{ fontSize: 13, color: '#666', lineHeight: 18 }}>
              Our admin team manages all customer and seller complaints to ensure fair resolution for everyone.
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="mail-outline" size={18} color="#8E6652" />
            <Text style={{ marginLeft: 12, fontSize: 14, color: '#666' }}>admin@clotherental.com</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="call-outline" size={18} color="#8E6652" />
            <Text style={{ marginLeft: 12, fontSize: 14, color: '#666' }}>+92 300 1234567</Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={18} color="#8E6652" />
            <Text style={{ marginLeft: 12, fontSize: 14, color: '#666' }}>Mon-Fri: 9:00 AM - 6:00 PM</Text>
          </View>
        </View>
      </ScrollView>

      {/* Contact Modal */}
      <Modal visible={showContactModal} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>Contact Support</Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 20 }}>
              {/* Category Selection */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 }}>Category</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategory(cat.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: category === cat.id ? '#8E6652' : '#f5f5f5',
                      borderWidth: 1,
                      borderColor: category === cat.id ? '#8E6652' : '#E0E0E0'
                    }}
                  >
                    <Ionicons name={cat.icon} size={16} color={category === cat.id ? '#fff' : '#666'} />
                    <Text style={{ marginLeft: 6, fontSize: 12, color: category === cat.id ? '#fff' : '#666' }}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Priority Selection */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 }}>Priority</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                {priorities.map((pri) => (
                  <TouchableOpacity
                    key={pri.id}
                    onPress={() => setPriority(pri.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: priority === pri.id ? pri.color : '#f5f5f5',
                      borderWidth: 1,
                      borderColor: priority === pri.id ? pri.color : '#E0E0E0'
                    }}
                  >
                    <Text style={{ fontSize: 12, color: priority === pri.id ? '#fff' : '#666' }}>
                      {pri.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Subject */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 }}>Subject</Text>
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="Brief description of your issue"
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  marginBottom: 20
                }}
              />

              {/* Description */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 }}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Please provide detailed information about your issue..."
                multiline
                numberOfLines={4}
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  textAlignVertical: 'top',
                  marginBottom: 20,
                  minHeight: 100
                }}
              />

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitComplaint}
                disabled={loading}
                style={{
                  backgroundColor: '#8E6652',
                  paddingVertical: 15,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Submit Request</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
