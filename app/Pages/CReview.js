import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert, ActivityIndicator, Image, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import { getCustomerReviews, submitCustomerReview, updateCustomerReview, deleteCustomerReview, uploadImageToCloudinary } from "../Helper/firebaseHelper";

const CustomerReviews = ({ navigation }) => {
  const user = useSelector((state) => state.home.user);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showWriteReview, setShowWriteReview] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [productName, setProductName] = useState('');
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    loadCustomerReviews();
  }, []);

  const loadCustomerReviews = async () => {
    try {
      if (!user?.uid) return;
      
      const customerReviews = await getCustomerReviews(user.uid);
      setReviews(customerReviews);
    } catch (error) {
      console.error("Error loading customer reviews:", error);
      Alert.alert("Error", "Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setReviewImages([...reviewImages, imageUri]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }
    
    if (!reviewText.trim()) {
      Alert.alert("Error", "Please write a review");
      return;
    }

    if (!productName.trim()) {
      Alert.alert("Error", "Please enter the product name");
      return;
    }

    try {
      setSubmitting(true);
      
      // Upload images to Cloudinary
      const uploadedImages = [];
      for (const imageUri of reviewImages) {
        const uploadedUrl = await uploadImageToCloudinary(imageUri);
        uploadedImages.push(uploadedUrl);
      }

      const reviewData = {
        customerId: user.uid,
        customerName: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer',
        productName: productName.trim(),
        rating: rating,
        reviewText: reviewText.trim(),
        images: uploadedImages,
        // Note: In a real app, you'd get these from the actual product/order
        productId: `product_${Date.now()}`, // Placeholder
        sellerId: `seller_${Date.now()}`, // Placeholder
        orderId: `order_${Date.now()}` // Placeholder
      };

      if (editingReview) {
        await updateCustomerReview(editingReview.id, reviewData);
        Alert.alert("Success", "Review updated successfully!");
      } else {
        await submitCustomerReview(reviewData);
        Alert.alert("Success", "Review submitted successfully!");
      }

      // Reset form
      resetForm();
      setShowWriteReview(false);
      loadCustomerReviews();
      
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setReviewText('');
    setReviewImages([]);
    setProductName('');
    setEditingReview(null);
  };

  const editReview = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setReviewText(review.reviewText);
    setProductName(review.productName);
    setReviewImages(review.images || []);
    setShowWriteReview(true);
  };

  const deleteReview = (reviewId) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCustomerReview(reviewId);
              Alert.alert("Success", "Review deleted successfully");
              loadCustomerReviews();
            } catch (error) {
              Alert.alert("Error", "Failed to delete review");
            }
          }
        }
      ]
    );
  };

  const renderStars = (currentRating, onPress = null) => {
    return (
      <View style={{ flexDirection: "row", marginVertical: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress && onPress(star)}
            disabled={!onPress}
          >
            <Ionicons
              name={star <= currentRating ? "star" : "star-outline"}
              size={32}
              color={star <= currentRating ? "#FFA500" : "#ccc"}
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const ReviewCard = ({ review }) => (
    <View style={{ 
      backgroundColor: '#fff', 
      borderRadius: 12, 
      padding: 16, 
      marginBottom: 16, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#f0f0f0'
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 }}>{review.productName}</Text>
          {renderStars(review.rating)}
          <Text style={{ fontSize: 12, color: '#666' }}>
            {new Date(review.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => editReview(review)}>
            <Ionicons name="create-outline" size={20} color="#8E6652" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteReview(review.id)}>
            <Ionicons name="trash-outline" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={{ fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 12 }}>
        {review.reviewText}
      </Text>

      {review.images && review.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {review.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width: 80, height: 80, borderRadius: 8, marginRight: 8 }}
            />
          ))}
        </ScrollView>
      )}

      {review.sellerResponse && (
        <View style={{ backgroundColor: '#f8f9fa', borderRadius: 8, padding: 12, marginTop: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#8E6652', marginBottom: 4 }}>
            Seller Response:
          </Text>
          <Text style={{ fontSize: 13, color: '#333' }}>{review.sellerResponse.message}</Text>
          <Text style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
            {new Date(review.sellerResponse.respondedAt).toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
        <View style={{ height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: '#8E6652' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>My Reviews</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#8E6652" />
          <Text style={{ marginTop: 16, color: '#666' }}>Loading your reviews...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1DCD1' }}>
      {/* Header */}
      <View style={{ height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#8E6652' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>My Reviews</Text>
        <TouchableOpacity onPress={() => setShowWriteReview(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <ScrollView style={{ flex: 1, padding: 20 }}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="star-outline" size={80} color="#ccc" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16 }}>
              No reviews yet
            </Text>
            <Text style={{ fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' }}>
              Share your experience with products you've purchased
            </Text>
            <TouchableOpacity 
              style={{ 
                backgroundColor: '#8E6652', 
                paddingHorizontal: 24, 
                paddingVertical: 12, 
                borderRadius: 8, 
                marginTop: 20 
              }}
              onPress={() => setShowWriteReview(true)}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Write Your First Review</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Write Review Modal */}
      <Modal visible={showWriteReview} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>
                {editingReview ? 'Edit Review' : 'Write Review'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowWriteReview(false);
                resetForm();
              }}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 20 }}>
              {/* Product Name */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Product Name</Text>
              <TextInput
                value={productName}
                onChangeText={setProductName}
                placeholder="Enter product name"
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  marginBottom: 20
                }}
              />

              {/* Rating */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Your Rating</Text>
              {renderStars(rating, setRating)}

              {/* Review Text */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Your Review</Text>
              <TextInput
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Share your experience with this product..."
                multiline
                numberOfLines={6}
                style={{
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  textAlignVertical: 'top',
                  marginBottom: 20,
                  minHeight: 120
                }}
              />

              {/* Images */}
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>Add Photos (Optional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                {reviewImages.map((image, index) => (
                  <View key={index} style={{ marginRight: 10, position: 'relative' }}>
                    <Image source={{ uri: image }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                    <TouchableOpacity
                      style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#E74C3C', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}
                      onPress={() => setReviewImages(reviewImages.filter((_, i) => i !== index))}
                    >
                      <Ionicons name="close" size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: '#E0E0E0',
                    borderStyle: 'dashed',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons name="camera-outline" size={24} color="#8E6652" />
                </TouchableOpacity>
              </ScrollView>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={submitReview}
                disabled={submitting}
                style={{
                  backgroundColor: '#8E6652',
                  paddingVertical: 15,
                  borderRadius: 8,
                  alignItems: 'center',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                    {editingReview ? 'Update Review' : 'Submit Review'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CustomerReviews;
