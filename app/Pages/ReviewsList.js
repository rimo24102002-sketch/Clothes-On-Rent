import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { 
  getProductReviews, 
  addReviewResponse,
  getCustomerReviews 
} from '../Helper/firebaseHelper';

const ReviewsList = ({ navigation, route }) => {
  const user = useSelector((state) => state.home.user);
  const userRole = useSelector((state) => state.home.role);
  const productId = route?.params?.productId;
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId, user]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      let reviewsData = [];
      
      if (productId) {
        // Load reviews for specific product
        reviewsData = await getProductReviews(productId);
      } else if (user?.uid) {
        // Load all reviews by this customer
        reviewsData = await getCustomerReviews(user.uid);
      }
      
      // Sort by date (newest first)
      reviewsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
      Alert.alert('Error', 'Failed to load reviews');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadReviews();
  };

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    try {
      setSubmittingReply(true);
      
      await addReviewResponse(reviewId, {
        response: replyText.trim(),
        sellerName: user.name || 'Seller',
        sellerId: user.uid,
        respondedAt: new Date().toISOString()
      });

      Alert.alert('Success', 'Reply posted successfully!');
      setReplyingTo(null);
      setReplyText('');
      loadReviews(); // Reload to show new reply
    } catch (error) {
      console.error('Error posting reply:', error);
      Alert.alert('Error', 'Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={{ flexDirection: 'row', marginVertical: 4 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color={star <= rating ? '#FFD700' : '#DDD'}
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  const renderReviewCard = (review) => (
    <View
      key={review.id}
      style={{
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      {/* Review Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
            {review.customerName || 'Anonymous'}
          </Text>
          <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
            {new Date(review.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {renderStars(review.rating)}
      </View>

      {/* Product Info (if viewing all reviews) */}
      {!productId && review.productName && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          padding: 8,
          borderRadius: 8,
          marginBottom: 8
        }}>
          {review.productImage && (
            <Image
              source={{ uri: review.productImage }}
              style={{ width: 40, height: 40, borderRadius: 6, marginRight: 8 }}
            />
          )}
          <Text style={{ fontSize: 14, color: '#666', flex: 1 }}>
            {review.productName}
          </Text>
        </View>
      )}

      {/* Review Text */}
      <Text style={{ fontSize: 14, color: '#444', lineHeight: 20, marginBottom: 8 }}>
        {review.reviewText}
      </Text>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
          {review.images.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                marginRight: 8
              }}
            />
          ))}
        </ScrollView>
      )}

      {/* Seller Reply Section */}
      {review.sellerResponse && (
        <View style={{
          backgroundColor: '#F0F7FF',
          borderLeftWidth: 3,
          borderLeftColor: '#8E6652',
          padding: 12,
          borderRadius: 8,
          marginTop: 8
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <MaterialIcons name="store" size={16} color="#8E6652" />
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#8E6652', marginLeft: 4 }}>
              Seller Reply
            </Text>
            <Text style={{ fontSize: 11, color: '#999', marginLeft: 8 }}>
              {new Date(review.sellerResponse.respondedAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: '#555', lineHeight: 18 }}>
            {review.sellerResponse.response}
          </Text>
        </View>
      )}

      {/* Reply Button for Sellers */}
      {userRole === 'Seller' && !review.sellerResponse && review.sellerId === user?.uid && (
        <>
          {replyingTo === review.id ? (
            <View style={{ marginTop: 12 }}>
              <TextInput
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Write your reply..."
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: '#F5F5F5',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 14,
                  textAlignVertical: 'top',
                  marginBottom: 8
                }}
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => handleReply(review.id)}
                  disabled={submittingReply}
                  style={{
                    flex: 1,
                    backgroundColor: '#8E6652',
                    padding: 10,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                >
                  {submittingReply ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>Post Reply</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#E0E0E0',
                    padding: 10,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#666', fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setReplyingTo(review.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#8E6652',
                padding: 10,
                borderRadius: 8,
                marginTop: 12
              }}
            >
              <MaterialIcons name="reply" size={18} color="#FFF" />
              <Text style={{ color: '#FFF', fontWeight: '600', marginLeft: 6 }}>
                Reply to Review
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#8E6652',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
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
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#FFF',
          marginTop: 10
        }}>
          {productId ? 'Product Reviews' : 'My Reviews'}
        </Text>
      </View>

      {/* Reviews List */}
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#8E6652']} />
        }
      >
        {reviews.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <MaterialIcons name="rate-review" size={64} color="#CCC" />
            <Text style={{ fontSize: 18, color: '#999', marginTop: 16 }}>
              No reviews yet
            </Text>
            <Text style={{ fontSize: 14, color: '#BBB', marginTop: 8, textAlign: 'center' }}>
              {productId ? 'Be the first to review this product!' : 'You haven\'t written any reviews yet'}
            </Text>
          </View>
        ) : (
          <>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 }}>
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </Text>
            {reviews.map(renderReviewCard)}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ReviewsList;
