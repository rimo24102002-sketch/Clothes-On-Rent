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
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {
  submitCustomerReview,
  uploadImageToCloudinary,
  getProductReviewStats
} from '../Helper/firebaseHelper';

const CReview = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.home.user);

  // Get product info from route params or props (safer extraction)
  const productId = route?.params?.productId;
  const productName = route?.params?.productName;
  const productImage = route?.params?.productImage;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productStats, setProductStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  useEffect(() => {
    loadProductStats();
  }, [productId]);

  const loadProductStats = async () => {
    try {
      setLoading(true);

      if (!productId) {
        console.log('No productId provided, skipping stats load');
        return;
      }

      console.log('Loading product stats for productId:', productId);
      const stats = await getProductReviewStats(productId);
      console.log('Product stats loaded:', stats);
      setProductStats(stats);
    } catch (error) {
      console.error('Error loading product stats:', error);
      // Set empty stats to prevent UI breaking
      setProductStats({
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRatingPress = (starRating) => {
    setRating(starRating);
  };

  const handleImageUpload = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Permission to access camera roll is required to upload images.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Show options for camera or gallery
      Alert.alert(
        'Select Image',
        'Choose an option',
        [
          { text: 'Camera', onPress: openCamera },
          { text: 'Photo Library', onPress: openImageLibrary },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening image library:', error);
      Alert.alert('Error', 'Failed to open photo library');
    }
  };

  const uploadImage = async (imageUri) => {
    try {
      setUploadingImages(true);

      // Upload to Cloudinary
      const uploadedUrl = await uploadImageToCloudinary(imageUri);

      // Add to review images array
      setReviewImages(prev => [...prev, uploadedUrl]);

    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setReviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return false;
    }
    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please write a review');
      return false;
    }
    if (reviewText.trim().length < 10) {
      Alert.alert('Error', 'Review must be at least 10 characters long');
      return false;
    }
    return true;
  };

  const handleSubmitReview = async () => {
    if (!validateForm()) return;

    if (!user?.uid) {
      Alert.alert('Error', 'Please login to submit a review');
      return;
    }

    if (!productId) {
      Alert.alert('Error', 'Product information is missing');
      return;
    }

    try {
      setIsSubmitting(true);

      const reviewData = {
        productId,
        customerId: user.uid,
        customerName: user.name || user.firstName + ' ' + user.lastName || 'Anonymous',
        customerEmail: user.email,
        rating: rating,
        reviewText: reviewText.trim(),
        reviewImages: reviewImages,
        createdAt: new Date().toISOString(),
      };

      const reviewId = await submitCustomerReview(reviewData);

      // Refresh product stats
      await loadProductStats();

      Alert.alert(
        'Success',
        'Thank you for your review!',
        [
          {
            text: 'View All Reviews',
            onPress: () => {
              // Navigate to reviews list
              navigation.navigate('ReviewsList', { productId });
            }
          },
          {
            text: 'Write Another',
            onPress: () => {
              // Reset form
              setRating(0);
              setReviewText('');
              setReviewImages([]);
            },
            style: 'cancel'
          }
        ]
      );

    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (interactive = true, size = 32) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => interactive && handleRatingPress(i)}
          disabled={!interactive}
          style={{ marginRight: 4 }}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={size}
            color={i <= rating ? '#FFD700' : '#ddd'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const renderRatingDistribution = () => {
    if (!productStats || productStats.totalReviews === 0) return null;

    const { ratingDistribution, totalReviews } = productStats;

    return (
      <View style={styles.ratingDistribution}>
        <Text style={styles.sectionTitle}>Rating Distribution</Text>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingDistribution[star] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <View key={star} style={styles.ratingRow}>
              <View style={styles.ratingLabel}>
                <Text style={styles.ratingText}>{star}</Text>
                <Ionicons name="star" size={14} color="#FFD700" />
              </View>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: `${percentage}%` }]} />
              </View>
              <Text style={styles.ratingCount}>{count}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If no product info provided, show a message
  if (!productId && !productName) {
    return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Write a Review</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.noProductContainer}>
          <Ionicons name="information-circle-outline" size={64} color="#8E6652" />
          <Text style={styles.noProductTitle}>No Product Selected</Text>
          <Text style={styles.noProductText}>
            Please navigate to a product detail page and select "Write Review" to submit your feedback.
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write a Review</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Product Info */}
      {productName && (
        <View style={styles.productInfo}>
          {productImage && (
            <Image source={{ uri: productImage }} style={styles.productImage} />
          )}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{productName}</Text>
            {productStats && (
              <View style={styles.productStats}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.averageRating}>{productStats.averageRating}</Text>
                  <View style={styles.starsContainer}>
                    {renderStars(false, 16)}
                  </View>
                </View>
                <Text style={styles.totalReviews}>
                  {productStats.totalReviews} review{productStats.totalReviews !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Rating Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How would you rate this product?</Text>
        <View style={styles.ratingInput}>
          {renderStars(true)}
        </View>
      </View>

      {/* Review Text */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Share your experience</Text>
        <TextInput
          style={styles.reviewInput}
          multiline
          placeholder="Tell others about your experience with this product..."
          value={reviewText}
          onChangeText={setReviewText}
          maxLength={1000}
        />
        <Text style={styles.characterCount}>
          {reviewText.length}/1000 characters
        </Text>
      </View>

      {/* Image Upload */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add photos (optional)</Text>
        <TouchableOpacity
          style={[styles.imageUploadButton, uploadingImages && styles.imageUploadButtonDisabled]}
          onPress={handleImageUpload}
          disabled={uploadingImages}
        >
          {uploadingImages ? (
            <ActivityIndicator size="small" color="#8E6652" />
          ) : (
            <>
              <Ionicons name="camera-outline" size={24} color="#8E6652" />
              <Text style={styles.imageUploadText}>Add Photos</Text>
            </>
          )}
        </TouchableOpacity>

        {reviewImages.length > 0 && (
          <View style={styles.imagePreview}>
            {reviewImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {reviewImages.length > 0 && (
          <Text style={styles.imageCount}>
            {reviewImages.length} photo{reviewImages.length !== 1 ? 's' : ''} added
          </Text>
        )}
      </View>

      {/* Rating Distribution */}
      {renderRatingDistribution()}

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmitReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noProductContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  noProductTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8E6652',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  noProductText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  imagePreview: {
    flexDirection: 'row',
    marginTop: 15,
    flexWrap: 'wrap',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  imageCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  productStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  averageRating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E6652',
    marginRight: 5,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ratingInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    minHeight: 120,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#8E6652',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  imageUploadButtonDisabled: {
    opacity: 0.6,
  },
  imageUploadText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#8E6652',
    fontWeight: '500',
  },
  ratingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#666',
    width: 30,
    textAlign: 'right',
  },
  submitSection: {
    padding: 20,
  },
  submitButton: {
    backgroundColor: '#8E6652',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
};

export default CReview;
