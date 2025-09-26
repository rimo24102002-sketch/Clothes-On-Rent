import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "./redux/store/Index";

// Screens (Seller)
import Splash from './Pages/Splash';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Password from './Pages/Password';
import Profile from './Pages/Profile';
import Delete from './Pages/Delete';
import Reviews from './Pages/Reviews';
import TermsOfService from './Pages/TermsOfService';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import HelpCenter from './Pages/HelpCenter';
import ForgotPassword from './Pages/ForgotPassword';
import ViewProduct from './Pages/ViewProduct';
import PickUp from './Pages/PickUp';
import Email from './Pages/Email';
import AccountSetting from './Pages/AccountSetting';
import Logout from './Pages/Logout';
import OrderPayment from './Pages/OrderPayment';
import Delivery from './Pages/Delivery';
import ComplaintMg from './Pages/ComplaintMg';
import BottomTabSeller from './Pages/BottomTabSeller';
import Notification from './Pages/Notification';
import Management from './Pages/Management';

// Screens (Customer)
import Profiles from './Pages/Profiles';
import EProfile from './Pages/Eprofile';
import CReview from './Pages/CReview';
import OrderDetail from './Pages/OrderDetail';
import CPending from './Pages/CPending';
import Cancel from './Pages/Cancel';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Complain from './Pages/Complain';
import Delivered from './Pages/Delivered';
import Detail from './Pages/Detail';
import Home2 from './Pages/Home2';
import VTO from './Pages/VTO';
import Homestack from './Pages/Homestack';
import Mhndi from './Pages/Mhndi';
import Payment from "./Pages/Payment";
import Order from "./Pages/Order";
import Index from "./Pages/Index";
import BottomTab from './Pages/BottomTab';

const Stack = createNativeStackNavigator();
const SellerStack = () => (
  <Stack.Navigator 
    initialRouteName="BottomTabSeller"
    screenOptions={{
      headerStyle: { backgroundColor: '#8E6652' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerBackTitleVisible: false,
    }}
  >
    <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
    <Stack.Screen name="BottomTabSeller" component={BottomTabSeller} options={{ headerShown: false }} />
    <Stack.Screen name="Home" component={Home}  />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUp" component={SignUp}  />
    <Stack.Screen name="Password" component={Password}  />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Delete" component={Delete}  />
    <Stack.Screen name="Reviews" component={Reviews}  />
    <Stack.Screen name="TermsOfService" component={TermsOfService}  />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy}  />
    <Stack.Screen name="HelpCenter" component={HelpCenter}  />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword}  />
    <Stack.Screen name="ViewProduct" component={ViewProduct}  />
    <Stack.Screen name="PickUp" component={PickUp}  />
    <Stack.Screen name="Email" component={Email}  />
    <Stack.Screen name="AccountSetting" component={AccountSetting}  />
    <Stack.Screen name="Logout" component={Logout}  />
    <Stack.Screen name="OrderPayment" component={OrderPayment}  />
    <Stack.Screen name="Delivery" component={Delivery}  />
    <Stack.Screen name="ComplaintMg" component={ComplaintMg} />
    <Stack.Screen name="Notification" component={Notification} />
    <Stack.Screen name="Management" component={Management}/>
  </Stack.Navigator>
);

const CustomerStack = () => (
  <Stack.Navigator initialRouteName="Complain">
    <Stack.Screen name="Profiles" component={Profiles} />
    <Stack.Screen name="EProfile" component={EProfile} />
    <Stack.Screen name="CReview" component={CReview} />
    <Stack.Screen name="OrderDetail" component={OrderDetail} />
    <Stack.Screen name="CPending" component={CPending} />
    <Stack.Screen name="Cancel" component={Cancel} />
    <Stack.Screen name="Cart" component={Cart} />
    <Stack.Screen name="Checkout" component={Checkout} />
    <Stack.Screen name="Complain" component={Complain} />
    <Stack.Screen name="Delivered" component={Delivered} />
    <Stack.Screen name="Detail" component={Detail} />
    <Stack.Screen name="Home2" component={Home2} />
    <Stack.Screen name="VTO" component={VTO} />
    <Stack.Screen name="Homestack" component={Homestack} />
    <Stack.Screen name="Mhndi" component={Mhndi} />
    <Stack.Screen name="Payment" component={Payment} />
    <Stack.Screen name="Order" component={Order} />
    <Stack.Screen name="Index" component={Index} />
    <Stack.Screen name="BottomTab" component={BottomTab} />

  </Stack.Navigator>
);

const RenderStack = () => {
  const role = useSelector((state) => state.home.role);
  const user = useSelector((state) => state.home.user);

  switch (role) {
    case "Seller":
      return <SellerStack />;
    case "Customer":
      return <CustomerStack />;
    default:
      return (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
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
