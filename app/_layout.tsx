import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native';
import Splash from './Pages/Splash';
import Home from './Pages/Home';
import Home2 from './Pages/Home2';
import Detail from './Pages/Detail';
import VTO from './Pages/VTO';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Password from './Pages/Password';
import Forget from './Pages/Forget';
import Cart from './Pages/Cart';
import Profile from './Pages/Profile';
import Checkout from './Pages/Checkout';
import Eprofile from './Pages/Eprofile'
import Complain from './Pages/Complain'
import Order from './Pages/Order'
import Mhndi from './Pages/Mhndi'
// import ppp from './Pages/PPP'
import Payment from './Pages/Payment'
import Reviews from './Pages/Reviews'
import Delete from './Pages/Delete'
import Privacy from './Pages/Privacy'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Home2" component={Home2} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="VTO" component={VTO} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Password" component={Password} />
        <Stack.Screen name="Forget" component={Forget} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Eprofile" component={Eprofile} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Profile" component={Profile} />
        {/* <Stack.Screen name="ppp" component={ppp} /> */}
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Reviews" component={Reviews} />
        <Stack.Screen name="Complain" component={Complain} />
        <Stack.Screen name="Mhndi" component={Mhndi} />
        <Stack.Screen name="Delete" component={Delete} />
           <Stack.Screen name="Privacy" component={Privacy} />
      </Stack.Navigator>
    </SafeAreaView>

  );
};

export default App;