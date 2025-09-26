import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Profiles from './Profiles';
import Cart from './Cart';
import HomeStack from './Homestack';
import CReview from './CReview'



const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (
        <Tab.Navigator >
            <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: ({ color }) => <Icon name="home-outline" size={30} color="black" /> }} />
            <Tab.Screen name="Cart" component={Cart} options={{ tabBarIcon: ({ color }) => <Icon name="cart-outline" size={30} color="black" /> }} />
            <Tab.Screen name="Profile" component={Profiles} options={{ tabBarIcon: ({ color }) => <Icon name="person-outline" size={30} color="black" /> }} />
            <Tab.Screen name="Review" component={CReview} options={{ tabBarIcon: ({ color }) => <MaterialIcons name="rate-review" size={26} color="black" /> }} />
        </Tab.Navigator>
    );
}
