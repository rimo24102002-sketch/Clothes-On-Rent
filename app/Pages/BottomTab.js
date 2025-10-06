import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EProfile from './Eprofile';
import Cart from './Cart';
import HomeStack from './Homestack';
import CReview from './CReview'



const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (
        <Tab.Navigator 
            screenOptions={{
                tabBarActiveTintColor: '#8E6652',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
                    height: 80,
                    paddingBottom: 12,
                    paddingTop: 12
                },
                headerShown: false
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeStack} 
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <Icon name="home-outline" size={30} color={focused ? '#8E6652' : '#999'} />
                    ),
                    tabBarLabel: 'Home'
                }} 
            />
            <Tab.Screen 
                name="Cart" 
                component={Cart} 
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <Icon name="cart-outline" size={30} color={focused ? '#8E6652' : '#999'} />
                    ),
                    tabBarLabel: 'Cart'
                }} 
            />
            <Tab.Screen 
                name="Profile" 
                component={EProfile} 
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <Icon name="person-outline" size={30} color={focused ? '#8E6652' : '#999'} />
                    ),
                    tabBarLabel: 'Profile'
                }} 
            />
            <Tab.Screen 
                name="Review" 
                component={CReview} 
                options={{ 
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialIcons name="rate-review" size={26} color={focused ? '#8E6652' : '#999'} />
                    ),
                    tabBarLabel: 'Reviews'
                }} 
            />
        </Tab.Navigator>
    );
}
