import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import EProfile from './Eprofile';
import Cart from './Cart';
import HomeStack from './Homestack';
import ReviewsList from './ReviewsList';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
    const cartItems = useSelector((state) => state.home.cart || []);
    const cartCount = cartItems.length;

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    height: 80,
                    paddingBottom: 14,
                    paddingTop: 14,
                    paddingHorizontal: 25,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarActiveTintColor: '#8E6652',
                tabBarInactiveTintColor: '#999',
                tabBarLabelStyle: {
                    fontSize: 13,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarItemStyle: {
                    paddingHorizontal: 12,
                },
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cart"
                component={Cart}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <View>
                            <Ionicons name="cart-outline" size={size} color={color} />
                            {cartCount > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    right: -8,
                                    top: -4,
                                    backgroundColor: '#FF4444',
                                    borderRadius: 10,
                                    minWidth: 18,
                                    height: 18,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 4
                                }}>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 10,
                                        fontWeight: 'bold'
                                    }}>
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                    tabBarBadge: cartCount > 0 ? cartCount : null,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={EProfile}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Reviews"
                component={ReviewsList}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="rate-review" size={size - 2} color={color} />
                    ),
                    tabBarLabel: 'Reviews'
                }}
            />
        </Tab.Navigator>
    );
}
