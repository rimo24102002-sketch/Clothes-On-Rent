import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import EProfile from './Eprofile';
import Cart from './Cart';
import Homestack from './Homestack';
import CReview from './CReview'



const Tab = createBottomTabNavigator();

export default function BottomTab() {
    return (
        <Tab.Navigator >
            <Tab.Screen name="Home" component={Homestack} options={{ tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={30} color="black" /> }} />
            <Tab.Screen name="Cart" component={Cart} options={{ tabBarIcon: ({ color }) => <Ionicons name="cart-outline" size={30} color="black" /> }} />
            <Tab.Screen name="Profile" component={EProfile} options={{ tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={30} color="black" /> }} />
            <Tab.Screen name="Review" component={CReview} options={{ tabBarIcon: ({ color }) => <MaterialIcons name="rate-review" size={26} color="black" /> }} />
        </Tab.Navigator>
    );
}
