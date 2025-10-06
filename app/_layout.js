import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaView } from "react-native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store/Index";

// Screens (Seller)
import AccountSetting from './Pages/AccountSetting';
import AddProduct from './Pages/AddProduct';
import BottomTabSeller from './Pages/BottomTabSeller';
import Delete from './Pages/Delete';
import Delivery from './Pages/Delivery';
import Email from './Pages/Email';
import ForgotPassword from './Pages/ForgotPassword';
import HelpCenter from './Pages/HelpCenter';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import Management from './Pages/Management';
import Notification from './Pages/Notification';
import NotificationSettings from './Pages/NotificationSettings';
import OrderPayment from './Pages/OrderPayment';
import Password from './Pages/Password';
import PendingApproval from './Pages/PendingApproval';
import PickUp from './Pages/PickUp';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import Profile from './Pages/Profile';
import Reviews from './Pages/Reviews';
import SignUp from './Pages/SignUp';
import Splash from './Pages/Splash';
import TermsOfService from './Pages/TermsOfService';
import ViewProduct from './Pages/ViewProduct';

// Screens (Customer)
import BottomTab from './Pages/BottomTab';
import CPending from './Pages/CPending';
import CReview from './Pages/CReview';
import Cancel from './Pages/Cancel';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Complain from './Pages/Complain';
import Delivered from './Pages/Delivered';
import Detail from './Pages/Detail';
import EProfile from './Pages/Eprofile';
import Home2 from './Pages/Home2';
import Homestack from './Pages/Homestack';
import Index from "./Pages/Index";
import Mhndi from './Pages/Mhndi';
import Order from "./Pages/Order";
import OrderDetail from './Pages/OrderDetail';
import Payment from "./Pages/Payment";
import Profiles from './Pages/Profiles';
import VTO from './Pages/VTO';

const Stack = createNativeStackNavigator();
const SellerStack = () => {
  console.log('=== SellerStack Debug ===');
  console.log('SellerStack is rendering');
  console.log('Initial route should be: BottomTabSeller');
  console.log('=== End SellerStack Debug ===');
  
  return (
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
    <Stack.Screen name="Password" component={Password}  />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Delete" component={Delete}  />
    <Stack.Screen name="Reviews" component={Reviews}  />
    <Stack.Screen name="TermsOfService" component={TermsOfService}  />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy}  />
    <Stack.Screen name="HelpCenter" component={HelpCenter}  />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword}  />
    <Stack.Screen name="ViewProduct" component={ViewProduct}  />
    <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: false }} />
    <Stack.Screen name="PickUp" component={PickUp} options={{ headerShown: false }} />
    <Stack.Screen name="Email" component={Email}  />
    <Stack.Screen name="AccountSetting" component={AccountSetting}  />
    <Stack.Screen name="Logout" component={Logout}  />
    <Stack.Screen name="OrderPayment" component={OrderPayment}  />
    <Stack.Screen name="Delivery" component={Delivery} options={{ headerShown: false }} />
    <Stack.Screen name="Notification" component={Notification} />
    <Stack.Screen name="Management" component={Management}/>
    <Stack.Screen name="NotificationSettings" component={NotificationSettings}/>
    <Stack.Screen name="PendingApproval" component={PendingApproval} options={{ headerShown: false }} />
  </Stack.Navigator>
  );
};

const PendingStack = () => {
  console.log('=== PendingStack Debug ===');
  console.log('PendingStack is rendering');
  console.log('=== End PendingStack Debug ===');
  
  return (
    <Stack.Navigator 
      initialRouteName="PendingApproval"
      screenOptions={{
        headerStyle: { backgroundColor: '#8E6652' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="PendingApproval" component={PendingApproval} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const CustomerStack = () => (
  <Stack.Navigator initialRouteName="BottomTab">
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
    <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />

  </Stack.Navigator>
);

const RenderStack = () => {
  const role = useSelector((state) => state.home.role);
  const user = useSelector((state) => state.home.user);

  alert (role)
  
  console.log('=== RenderStack Debug ===');
  console.log('RenderStack - Role:', role);
  console.log('RenderStack - User:', user);
  console.log('RenderStack - User UID:', user?.uid);
  console.log('=== End RenderStack Debug ===');
  
  // If user exists but role is empty, wait for role to be set
  if (user?.uid && !role) {
    console.log('User exists but role is empty, waiting...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8E6652" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  // Force customer mode for testing
  const forceRole = "Customer";
  
  switch (forceRole) {
    case "Seller":
      // Approved sellers go to seller stack
      console.log('Rendering SellerStack for approved seller');
      return <SellerStack key="seller-stack" />;
    case "pending":
      // Pending sellers go to pending stack
      console.log('Rendering PendingStack for pending seller');
      return <PendingStack key="pending-stack" />;
    case "Customer":
      console.log('Rendering CustomerStack for customer');
      return <CustomerStack key="customer-stack" />;
    default:
      console.log('Rendering auth stack - no role or user');
      return (
        <Stack.Navigator key="auth-stack" initialRouteName="Login">
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
          <RenderStack key="main-render-stack" />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
