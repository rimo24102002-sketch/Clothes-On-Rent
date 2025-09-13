import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';
import Profile from './Profile';
import Home2 from './Home2';
import Mhndi from './Mhndi';
import VTO from './VTO';
import Detail from './Detail';
import Eprofile from './Eprofile';
import Checkout from './Checkout';
import Payment from './Payment';
import Order from './Order';
import Reviews from './Reviews';
import Complain from './Complain';
import Pending from './Pending';
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    // <NavigationContainer>
    <SafeAreaView   style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Navigator  screenOptions={{
            headerShown:false}} initialRouteName="Home2">
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Home2" component={Home2} />
        <Stack.Screen name="Mhndi" component={Mhndi} />
        {/* <Stack.Screen name="Detail" component={Detail} /> */}
        <Stack.Screen name="VTO" component={VTO} />
        <Stack.Screen name="Eprofile" component={Eprofile} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Reviews" component={Reviews} />
        <Stack.Screen name="Complain" component={Complain} />
 <Stack.Screen name="Pending" component={Pending} />


      </Stack.Navigator>
    </SafeAreaView>
    // </NavigationContainer>
  );
};

export default HomeStack;