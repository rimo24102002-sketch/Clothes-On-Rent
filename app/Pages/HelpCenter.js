import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Modal, Alert } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { getHelpArticles, sendSellerComplaint, getSellerComplaints } from "../Helper/firebaseHelper";

export default function HelpCenter({navigation}) {
  const user = useSelector((state) => state.home.user);
  const sellerId = user?.sellerId || user?.uid;
  
  const [showFAQ, setShowFAQ] = useState(false);
  const [helpArticles, setHelpArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showComplaintHistory, setShowComplaintHistory] = useState(false);
  const [sellerComplaints, setSellerComplaints] = useState([]);
  const [complaintForm, setComplaintForm] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "general"
  });

  useEffect(() => {
    loadHelpData();
  }, []);

  const loadHelpData = async () => {
    try {
      const articles = await getHelpArticles();
      setHelpArticles(articles || []);
    } catch (error) {
      console.error("Error loading help articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadComplaintHistory = async () => {
    try {
      if (!sellerId) return;
      const complaints = await getSellerComplaints(sellerId);
      setSellerComplaints(complaints || []);
    } catch (error) {
      console.error("Error loading complaints:", error);
      Alert.alert("Error", "Failed to load complaint history");
    }
  };

  const handleSubmitComplaint = async () => {
    if (!complaintForm.subject.trim()) {
      Alert.alert("Error", "Please enter a subject");
      return;
    }
    if (!complaintForm.description.trim()) {
      Alert.alert("Error", "Please describe your issue");
      return;
    }

    try {
      const complaintData = {
        ...complaintForm,
        sellerId,
        sellerName: user?.name || "Unknown Seller",
        sellerEmail: user?.email || "",
        subject: complaintForm.subject.trim(),
        description: complaintForm.description.trim(),
      };

      await sendSellerComplaint(complaintData);
      
      Alert.alert(
        "Complaint Submitted", 
        "Your complaint has been sent to admin. You will receive a response within 24-48 hours.",
        [
          {
            text: "OK",
            onPress: () => {
              setComplaintForm({ subject: "", description: "", priority: "medium", category: "general" });
              setShowComplaintModal(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert("Error", "Failed to submit complaint. Please try again.");
    }
  };

  const faqData = [
    {
    id: 1,
    question: "How do I list my items for rent?",
  },
  {
    id: 2,
    question: "How do I get paid?",
    answer: "All payments are collected as Cash on Delivery (COD). You receive your earnings when the item is returned successfully."
  },
  {
    id: 3,
    question: "Who handles delivery?",
    answer: "We provide prepaid shipping labels. You only need to package the item securely for pickup and return."
  },
  {
    id: 4,
    question: "What if my item is damaged?",
    answer: "Minor wear is normal. If significant damage occurs, the renter is responsible for repair or replacement costs."
  },
  {
    id: 5,
    question: "Can I set my own rental prices?",
    answer: "Yes, you control your rental prices. However, we may suggest competitive pricing to increase bookings."
  },
  {
    id: 6,
    question: "How do I track my rentals?",
    answer: "Use your seller dashboard to track active orders, COD payments, and item return status."
  }
  ];

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#F8F9FA'}}>
        <Text style={{fontSize:22,fontWeight:'600',color:'#8E6652',marginLeft:25,marginTop:20}}>Help Center</Text>
    

      <ScrollView contentContainerStyle={{padding:20}}>
        {/* Search Bar */}
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderRadius:12,padding:12,marginBottom:16,borderWidth:1,borderColor:'#E0E0E0'}}>
          <Feather name="search" size={20} color="#8E6652" style={{marginRight:10}} />
          <TextInput
            style={{flex:1,fontSize:15,color:'#333'}}
            placeholder="Search for help..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Actions */}
        <View style={{backgroundColor:'#fff',borderRadius:12,padding:16,marginBottom:16,borderWidth:1,borderColor:'#E0E0E0'}}>
          <Text style={{fontSize:16,fontWeight:'700',color:'#8E6652',marginBottom:12}}>Get Help</Text>
          
          {/* Contact Admin */}
          <TouchableOpacity 
            style={{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#F0F0F0'}}
            onPress={() => setShowComplaintModal(true)}
          >
            <Feather name="message-circle" size={20} color="#8E6652" />
            <Text style={{fontSize:15,color:'#333',fontWeight:'600',marginLeft:12,flex:1}}>Contact Admin</Text>
            <Feather name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          {/* Email Support */}
          <TouchableOpacity 
            style={{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#F0F0F0'}}
            onPress={() => navigation.navigate('Email')}
          >
            <Feather name="mail" size={20} color="#8E6652" />
            <Text style={{fontSize:15,color:'#333',fontWeight:'600',marginLeft:12,flex:1}}>Email Support</Text>
            <Feather name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>

          {/* Complaint History */}
          <TouchableOpacity 
            style={{flexDirection:'row',alignItems:'center',paddingVertical:12}}
            onPress={() => {
              loadComplaintHistory();
              setShowComplaintHistory(true);
            }}
          >
            <Feather name="clock" size={20} color="#8E6652" />
            <Text style={{fontSize:15,color:'#333',fontWeight:'600',marginLeft:12,flex:1}}>My Complaints</Text>
            <Feather name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor:'#FFFFFF',borderRadius:12,padding:16,marginBottom:14,borderWidth:1,borderColor:'#8E6652'}}>
          <TouchableOpacity onPress={() => setShowFAQ(!showFAQ)}>
            <Text style={{fontSize:16,fontWeight:'700',color:'#8E6652',marginBottom:12}}>FAQ {showFAQ ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          
          {showFAQ && faqData.map((faq) => (
            <View key={faq.id} style={{paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#F1DCD1'}}>
              <Text style={{fontSize:16,color:'#8E6652',fontWeight:'600',marginBottom:4}}>{faq.question}</Text>
              <Text style={{fontSize:14,color:'#8E6652',lineHeight:20}}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        <View style={{backgroundColor:'#FFFFFF',borderRadius:12,padding:16,marginBottom:14,borderWidth:1,borderColor:'#8E6652'}}>
          <Text style={{fontSize:16,fontWeight:'700',color:'#8E6652',marginBottom:12}}>Contact Us</Text>
          <Text style={{fontSize:14,color:'#8E6652',lineHeight:22,textAlign:'center'}}>
            Email: support@rentclothes.com{'\n'}
            Available 24/7
          </Text>
        </View>

        <View style={{height:24}} />
      </ScrollView>

      {/* Contact Admin Modal */}
      <Modal visible={showComplaintModal} transparent={true} animationType="slide">
        <View style={{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(0,0,0,0.5)'}}>
          <View style={{backgroundColor:'#fff',padding:20,borderTopLeftRadius:20,borderTopRightRadius:20,maxHeight:'80%'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'700',color:'#333'}}>Contact Admin</Text>
              <TouchableOpacity onPress={() => setShowComplaintModal(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Category */}
              <View style={{marginBottom:16}}>
                <Text style={{fontSize:14,fontWeight:'600',color:'#333',marginBottom:8}}>Category</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>
                  {['general', 'technical', 'payment', 'account'].map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={{
                        paddingHorizontal:12,
                        paddingVertical:6,
                        borderRadius:20,
                        backgroundColor: complaintForm.category === cat ? '#8E6652' : '#F0F0F0',
                        borderWidth: complaintForm.category === cat ? 0 : 1,
                        borderColor: '#E0E0E0'
                      }}
                      onPress={() => setComplaintForm({...complaintForm, category: cat})}
                    >
                      <Text style={{
                        color: complaintForm.category === cat ? '#fff' : '#666',
                        fontSize:12,
                        fontWeight:'600',
                        textTransform:'capitalize'
                      }}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Priority */}
              <View style={{marginBottom:16}}>
                <Text style={{fontSize:14,fontWeight:'600',color:'#333',marginBottom:8}}>Priority</Text>
                <View style={{flexDirection:'row',gap:8}}>
                  {['low', 'medium', 'high'].map(priority => (
                    <TouchableOpacity
                      key={priority}
                      style={{
                        flex:1,
                        paddingVertical:8,
                        borderRadius:8,
                        backgroundColor: complaintForm.priority === priority ? '#8E6652' : '#F0F0F0',
                        alignItems:'center'
                      }}
                      onPress={() => setComplaintForm({...complaintForm, priority})}
                    >
                      <Text style={{
                        color: complaintForm.priority === priority ? '#fff' : '#666',
                        fontSize:14,
                        fontWeight:'600',
                        textTransform:'capitalize'
                      }}>{priority}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Subject */}
              <View style={{marginBottom:16}}>
                <Text style={{fontSize:14,fontWeight:'600',color:'#333',marginBottom:8}}>Subject *</Text>
                <TextInput
                  value={complaintForm.subject}
                  onChangeText={(text) => setComplaintForm({...complaintForm, subject: text})}
                  placeholder="Brief description of your issue"
                  style={{
                    borderWidth:1,
                    borderColor:'#E0E0E0',
                    borderRadius:8,
                    padding:12,
                    fontSize:14
                  }}
                />
              </View>

              {/* Description */}
              <View style={{marginBottom:20}}>
                <Text style={{fontSize:14,fontWeight:'600',color:'#333',marginBottom:8}}>Description *</Text>
                <TextInput
                  value={complaintForm.description}
                  onChangeText={(text) => setComplaintForm({...complaintForm, description: text})}
                  placeholder="Please describe your issue in detail..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{
                    borderWidth:1,
                    borderColor:'#E0E0E0',
                    borderRadius:8,
                    padding:12,
                    minHeight:100,
                    fontSize:14
                  }}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={{
                  backgroundColor:'#8E6652',
                  paddingVertical:12,
                  borderRadius:8,
                  alignItems:'center'
                }}
                onPress={handleSubmitComplaint}
              >
                <Text style={{color:'#fff',fontSize:16,fontWeight:'600'}}>Submit Complaint</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Complaint History Modal */}
      <Modal visible={showComplaintHistory} transparent={true} animationType="slide">
        <View style={{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(0,0,0,0.5)'}}>
          <View style={{backgroundColor:'#fff',padding:20,borderTopLeftRadius:20,borderTopRightRadius:20,maxHeight:'80%'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <Text style={{fontSize:18,fontWeight:'700',color:'#333'}}>My Complaints</Text>
              <TouchableOpacity onPress={() => setShowComplaintHistory(false)}>
                <Feather name="x" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {sellerComplaints.length === 0 ? (
                <View style={{alignItems:'center',paddingVertical:40}}>
                  <Feather name="inbox" size={48} color="#CCC" />
                  <Text style={{marginTop:16,color:'#666',fontSize:16}}>No complaints yet</Text>
                  <Text style={{marginTop:8,color:'#999',fontSize:14,textAlign:'center'}}>
                    Your complaints to admin will appear here
                  </Text>
                </View>
              ) : (
                sellerComplaints.map((complaint, index) => (
                  <View key={complaint.id || index} style={{
                    borderWidth:1,
                    borderColor:'#E0E0E0',
                    borderRadius:12,
                    padding:16,
                    marginBottom:12,
                    backgroundColor:'#fff'
                  }}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <Text style={{fontWeight:'600',color:'#333',fontSize:16}}>{complaint.subject}</Text>
                      <View style={{
                        paddingHorizontal:8,
                        paddingVertical:4,
                        borderRadius:12,
                        backgroundColor: complaint.status === 'pending' ? '#FFF3CD' : 
                                       complaint.status === 'in_progress' ? '#D1ECF1' : '#D4EDDA'
                      }}>
                        <Text style={{
                          fontSize:10,
                          fontWeight:'600',
                          color: complaint.status === 'pending' ? '#856404' : 
                                complaint.status === 'in_progress' ? '#0C5460' : '#155724',
                          textTransform:'capitalize'
                        }}>{complaint.status.replace('_', ' ')}</Text>
                      </View>
                    </View>
                    
                    <Text style={{color:'#666',fontSize:14,marginBottom:8}}>{complaint.description}</Text>
                    
                    {complaint.adminResponse && (
                      <View style={{backgroundColor:'#F8F9FA',padding:12,borderRadius:8,marginTop:8}}>
                        <Text style={{fontWeight:'600',color:'#8E6652',marginBottom:4}}>Admin Response:</Text>
                        <Text style={{color:'#333',fontSize:14}}>{complaint.adminResponse}</Text>
                      </View>
                    )}
                    
                    <Text style={{fontSize:10,color:'#999',marginTop:8}}>
                      {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : ''}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}