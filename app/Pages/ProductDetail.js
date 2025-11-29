import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../_redux/Slices/HomeDataSlice';
import { saveCartToFirebase } from '../Helper/firebaseHelper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDataById, createOrder, getCustomerProfile, getSellerData } from '../Helper/firebaseHelper';

const { width } = Dimensions.get('window');

export default function ProductDetail({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { productId } = route.params;
  const user = useSelector((state) => state.home.user);
  const cartItems = useSelector((state) => state.home.cart || []);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [address, setAddress] = useState('');
  const [customerProfile, setCustomerProfile] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [seller, setSeller] = useState(null);
  const [loadingSeller, setLoadingSeller] = useState(false);

  useEffect(() => {
    loadProductData();
    loadCustomerProfile();
  }, []);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const productData = await getDataById('products', productId);
      if (productData) {
        setProduct(productData);
        // Set default size if available
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        // Load seller data if sellerId exists
        if (productData.sellerId) {
          loadSellerData(productData.sellerId);
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details');
      if (navigation.canGoBack()) {
      navigation.goBack();
      } else {
        navigation.navigate('BottomTab');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSellerData = async (sellerId) => {
    try {
      setLoadingSeller(true);
      const sellerData = await getSellerData(sellerId);
      if (sellerData) {
        setSeller(sellerData);
      }
    } catch (error) {
      console.error('Error loading seller data:', error);
    } finally {
      setLoadingSeller(false);
    }
  };

  const loadCustomerProfile = async () => {
    try {
      const profile = await getCustomerProfile(user.uid);
      if (profile) {
        setCustomerProfile(profile);
        setAddress(profile.address || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) { // Max 10 items
      setQuantity(newQuantity);
    }
  };

  const handleWriteReview = () => {
    if (!user?.uid) {
      Alert.alert('Error', 'Please log in to write a review');
      return;
    }

    navigation.navigate('CReview', {
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl
    });
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Alert.alert('Error', 'Please select a size');
      return;
    }

    // Check if user is logged in
    if (!user?.uid) {
      Alert.alert('Error', 'Please log in to add items to cart');
      return;
    }

    try {
      setAddingToCart(true);

      // Create cart item object
      const cartItem = {
        id: `${product.id}_${selectedSize}_${Date.now()}`, // Unique ID for cart item
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: parseFloat(product.price),
        securityFee: parseFloat(product.securityFee || 0),
        size: selectedSize,
        quantity: quantity,
        sellerId: product.sellerId || product.uid,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        addedAt: Date.now()
      };

      // Add to Redux cart
      console.log('➕ Adding item to cart:', cartItem);
      dispatch(addToCart(cartItem));

      // Save to Firebase
      const updatedCart = [...cartItems, cartItem];
      console.log('💾 Saving cart to Firebase. Total items:', updatedCart.length);
      await saveCartToFirebase(user.uid, updatedCart);
      console.log('✅ Cart saved successfully');

      Alert.alert(
        'Added to Cart',
        `${product.name} (${selectedSize}) has been added to your cart!`,
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { 
            text: 'View Cart', 
            onPress: () => {
              // Navigate to BottomTab and select Cart tab
              navigation.navigate('BottomTab', { screen: 'Cart' });
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const updateAddress = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return;
    }

    setAddressModalVisible(false);
    await handleAddToCart();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1DCD1' }}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={{ marginTop: 10, color: '#8E6652' }}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1DCD1' }}>
        <Text style={{ color: '#8E6652', fontSize: 18 }}>Product not found</Text>
        <TouchableOpacity onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('BottomTab');
          }
        }} style={{ marginTop: 20 }}>
          <Text style={{ color: '#8E6652', fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: '#F1DCD1', flex: 1 }}>
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
          Product Details
        </Text>
      </View>

      {/* Product Image */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Image
          source={{ uri: product.imageUrl }}
          style={{
            width: width * 0.8,
            height: 300,
            borderRadius: 20,
            resizeMode: 'cover'
          }}
        />
      </View>

      {/* Product Info */}
      <View style={{ paddingHorizontal: 20 }}>
        {/* Title and Price */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#8E6652',
            marginBottom: 10
          }}>
            {product.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#8E6652',
              marginRight: 10
            }}>
              ${product.price}
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#666',
              textDecorationLine: 'line-through'
            }}>
              ${product.securityFee}
            </Text>
          </View>

          {/* Category Badge */}
          <View style={{
            backgroundColor: '#8E6652',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 15,
            alignSelf: 'flex-start',
            marginTop: 10
          }}>
            <Text style={{
              color: '#fff',
              fontSize: 12,
              fontWeight: '600'
            }}>
              {product.categoryName}
            </Text>
          </View>
        </View>

        {/* Description */}
        {product.description && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#8E6652',
              marginBottom: 8
            }}>
              Description
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              lineHeight: 20
            }}>
              {product.description}
            </Text>
          </View>
        )}

        {/* Seller Information */}
        {seller && (
          <View style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: '#8E6652'
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#8E6652',
              marginBottom: 12
            }}>
              Seller Information
            </Text>
            
            <View style={{ marginBottom: 8 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#333',
                marginBottom: 4
              }}>
                Name:
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#666'
              }}>
                {seller.name || 'N/A'}
              </Text>
            </View>

            {seller.email && (
              <View style={{ marginBottom: 8 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: 4
                }}>
                  Email:
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666'
                }}>
                  {seller.email}
                </Text>
              </View>
            )}

            {seller.address && (
              <View style={{ marginBottom: 8 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: 4
                }}>
                  Address:
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666'
                }}>
                  {seller.address}
                </Text>
              </View>
            )}

            {seller.sellerId && (
              <View style={{
                marginTop: 8,
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: '#eee'
              }}>
                <Text style={{
                  fontSize: 12,
                  color: '#999'
                }}>
                  Seller ID: {seller.sellerId}
                </Text>
              </View>
            )}
          </View>
        )}

        {loadingSeller && (
          <View style={{
            backgroundColor: '#fff',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
            alignItems: 'center'
          }}>
            <ActivityIndicator size="small" color="#8E6652" />
            <Text style={{
              fontSize: 14,
              color: '#666',
              marginTop: 8
            }}>
              Loading seller information...
            </Text>
          </View>
        )}

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#8E6652',
              marginBottom: 12
            }}>
              Select Size
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={{
                    backgroundColor: selectedSize === size ? '#8E6652' : '#fff',
                    borderWidth: 1,
                    borderColor: selectedSize === size ? '#8E6652' : '#ddd',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    marginRight: 10,
                    marginBottom: 8,
                    minWidth: 50,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{
                    color: selectedSize === size ? '#fff' : '#333',
                    fontWeight: '600'
                  }}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#8E6652',
            marginBottom: 12
          }}>
            Quantity
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 10
          }}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(-1)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#f0f0f0',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="remove" size={20} color="#8E6652" />
            </TouchableOpacity>

            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#8E6652',
              marginHorizontal: 20,
              minWidth: 30,
              textAlign: 'center'
            }}>
              {quantity}
            </Text>

            <TouchableOpacity
              onPress={() => handleQuantityChange(1)}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#8E6652',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Price */}
        <View style={{
          backgroundColor: '#fff',
          padding: 15,
          borderRadius: 10,
          marginBottom: 20
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{
              fontSize: 16,
              color: '#666'
            }}>
              Price per item:
            </Text>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#8E6652'
            }}>
              ${product.price}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#eee'
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#8E6652'
            }}>
              Total:
            </Text>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#8E6652'
            }}>
              ${(parseFloat(product.price) * quantity).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 15 }}>
          {/* Write Review Button */}
          <TouchableOpacity
            onPress={handleWriteReview}
            style={{
              backgroundColor: '#fff',
              borderWidth: 2,
              borderColor: '#8E6652',
              paddingVertical: 15,
              borderRadius: 25,
              alignItems: 'center',
              flex: 1,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star-outline" size={20} color="#8E6652" style={{ marginRight: 8 }} />
              <Text style={{
                fontSize: 16,
                color: '#8E6652',
                fontWeight: 'bold'
              }}>
                Write Review
              </Text>
            </View>
          </TouchableOpacity>

          {/* Add to Cart Button */}
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={addingToCart}
            style={{
              backgroundColor: addingToCart ? '#ccc' : '#8E6652',
              paddingVertical: 15,
              borderRadius: 25,
              alignItems: 'center',
              flex: 1,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            {addingToCart ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{
                fontSize: 16,
                color: '#fff',
                fontWeight: 'bold'
              }}>
                Add to Cart
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Modal */}
      <Modal
        visible={addressModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 20,
            width: width * 0.9,
            maxHeight: '70%'
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#8E6652',
              marginBottom: 15,
              textAlign: 'center'
            }}>
              Delivery Address Required
            </Text>

            <Text style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 15,
              textAlign: 'center'
            }}>
              Please enter your delivery address to continue
            </Text>

            <TextInput
              placeholder="Enter delivery address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                padding: 15,
                fontSize: 16,
                textAlignVertical: 'top',
                marginBottom: 20
              }}
              placeholderTextColor="#999"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => setAddressModalVisible(false)}
                style={{
                  backgroundColor: '#f0f0f0',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  flex: 1,
                  marginRight: 10,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#666', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={updateAddress}
                style={{
                  backgroundColor: '#8E6652',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  flex: 1,
                  marginLeft: 10,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Save & Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
