import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import { persistor, store } from "./redux/store";

// Screens (Customer)
import Splash from "./Pages/Splash";
import Home from "./Pages/Home";
import Home2 from "./Pages/Home2";
import Detail from "./Pages/Detail";
import VTO from "./Pages/VTO";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Password from "./Pages/Password";
import Forget from "./Pages/Forget";
import Cart from "./Pages/Cart";
import Profile from "./Pages/Profile";
import Checkout from "./Pages/Checkout";
import Eprofile from "./Pages/Eprofile";
import Complain from "./Pages/Complain";
import Order from "./Pages/Order";
import Mhndi from "./Pages/Mhndi";
import Payment from "./Pages/Payment";
import Reviews from "./Pages/Reviews";
import Delete from "./Pages/Delete";
import Privacy from "./Pages/Privacy";
import BottomTab from "./Pages/BottomTab";
import Pending from "./Pages/Pending";
import Cancel from "./Pages/Cancel";
import Deliverd from "./Pages/Deliverd";
import OrderDetail from "./Pages/OrderDetail";
import Slider from "./Pages/Slider";
import userprofile from "./Pages/userprofile"

// Screens (Seller)
import Products from "./Pages/Products";
import Pickup from "./Pages/Pickup";
import Email from "./Pages/Email";
import Sellprofile from "./Pages/Sellprofile";
import TOS from "./Pages/TOS";
import Report from "./Pages/Report";
import Logout from "./Pages/Logout";
import Help from "./Pages/Help";

const Stack = createNativeStackNavigator();

const CustomerStack = () => (
  <Stack.Navigator initialRouteName="BottomTab" >
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Home2" component={Home2} />
    <Stack.Screen name="Detail" component={Detail} />
    <Stack.Screen name="VTO" component={VTO} />
    {/* <Stack.Screen name="Login" component={Login} /> */}
    {/* <Stack.Screen name="Signup" component={Signup} /> */}
    <Stack.Screen name="Password" component={Password} />
    <Stack.Screen name="Forget" component={Forget} />
    <Stack.Screen name="Cart" component={Cart} />
    <Stack.Screen name="Eprofile" component={Eprofile} />
    <Stack.Screen name="Checkout" component={Checkout} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Payment" component={Payment} />
    <Stack.Screen name="Order" component={Order} />
    <Stack.Screen name="Reviews" component={Reviews} />
    <Stack.Screen name="Complain" component={Complain} />
    <Stack.Screen name="Mhndi" component={Mhndi} />
    <Stack.Screen name="Delete" component={Delete} />
    <Stack.Screen name="Privacy" component={Privacy} />
    <Stack.Screen name="BottomTab" component={BottomTab} />
    <Stack.Screen name="Slider" component={Slider} />
    <Stack.Screen name="Pending" component={Pending} />
    <Stack.Screen name="Deliverd" component={Deliverd} />
    <Stack.Screen name="Cancel" component={Cancel} />
    <Stack.Screen name="OrderDetail" component={OrderDetail} />
     <Stack.Screen name="userprofile" component={userprofile} />
  </Stack.Navigator>
);

const SellerStack = () => (
  <Stack.Navigator initialRouteName="Home2">
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Home" component={Home} />
    {/* <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} /> */}
    <Stack.Screen name="Products" component={Products} />
    <Stack.Screen name="Pickup" component={Pickup} />
    <Stack.Screen name="Email" component={Email} />
    <Stack.Screen name="Sellprofile" component={Sellprofile} />
    <Stack.Screen name="TOS" component={TOS} />
    <Stack.Screen name="Report" component={Report} />
    <Stack.Screen name="Logout" component={Logout} />
    <Stack.Screen name="Help" component={Help} />
  </Stack.Navigator>
);

const RenderStack = () => {
  const role = useSelector((state) => state.home.role); 

  switch (role) {
    case "Customer":
      return <CustomerStack />;
    case "Seller":
      return <SellerStack />;
    default:
      return (
         
        <Stack.Navigator  initialRouteName="Login">
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Home" component={Home} />
                {/* <Stack.Screen name="Home" component={Home2} /> */}
            
        </Stack.Navigator>
       
      );
  }
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
         
            <RenderStack />
          
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;

