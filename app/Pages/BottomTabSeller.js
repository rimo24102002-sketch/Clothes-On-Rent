import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Notification from './Notification';
import Profile from './Profile';
import AccountSettings from './AccountSetting';
import Management from './Management';

const Tab = createBottomTabNavigator();

export default function BottomTabSeller() {
    return (
        <Tab.Navigator screenOptions={{tabBarActiveTintColor:'#8E6652',tabBarInactiveTintColor:'#666',tabBarStyle:{backgroundColor:'#FFFFFF',borderTopWidth:0,elevation:20,shadowColor:'#000',shadowOffset:{width:0,height:-4},shadowOpacity:0.15,shadowRadius:8,height:95,paddingBottom:20,paddingTop:10,borderTopLeftRadius:20,borderTopRightRadius:20},tabBarLabelStyle:{fontSize:12,fontWeight:'600',marginTop:2,textTransform:'uppercase',letterSpacing:0.5},tabBarItemStyle:{paddingVertical:5},headerShown:false}}>
            <Tab.Screen name="Profile" component={Profile} options={{tabBarIcon:({color,focused})=><Ionicons name="person" size={26} color={color} />,tabBarLabel:'PROFILE'}} />
            <Tab.Screen name="Management" component={Management} options={{tabBarIcon:({color,focused})=><MaterialIcons name="manage-accounts" size={26} color={color} />,tabBarLabel:'MANAGE'}} />
            <Tab.Screen name="AccountSetting" component={AccountSettings} options={{tabBarIcon:({color,focused})=><Ionicons name="settings" size={26} color={color} />,tabBarLabel:'SETTINGS'}} />
            <Tab.Screen name="Notification" component={Notification} options={{tabBarIcon:({color,focused})=><Ionicons name="notifications" size={26} color={color} />,tabBarLabel:'ALERTS'}} />
        </Tab.Navigator>
    );
}
