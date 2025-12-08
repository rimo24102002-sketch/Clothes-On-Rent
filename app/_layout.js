// Core React/React Native imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SafeAreaView } from "react-native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./_redux/store/Index";
import AccountSetting from './Pages/AccountSetting';
import AddProduct from './Pages/AddProduct';
import BottomTabSeller from './Pages/BottomTabSeller';
import Delete from './Pages/Delete';
import Delivery from './Pages/Delivery';
import DirectChat from './Pages/DirectChat';
import Email from './Pages/Email';
import ForgotPassword from './Pages/ForgotPassword';
import HelpCenter from './Pages/HelpCenter';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import Management from './Pages/Management';
import NotificationSettings from './Pages/NotificationSettings';
import OrderPayment from './Pages/OrderPayment';
import Password from './Pages/Password';
import PickUp from './Pages/PickUp';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import ProductDetail from './Pages/ProductDetail';
import Profile from './Pages/Profile';
import Reviews from './Pages/Reviews';
import SellerComplaint from './Pages/SellerComplaint';
import SellerComplaints from './Pages/SellerComplaints';
import SignUp from './Pages/SignUp';
import Splash from './Pages/Splash';
import TermsOfService from './Pages/TermsOfService';
import ViewProduct from './Pages/ViewProduct';

// Redux and Navigation setup
const Stack = createNativeStackNavigator();

// Page Components - Customer Stack
import BottomTab from './Pages/BottomTab';
import Cancel from './Pages/Cancel';
import Cart from './Pages/Cart';
import CategoryPage from './Pages/CategoryPage';
import Checkout from './Pages/Checkout';
import Complain from './Pages/Complain';
import CPending from './Pages/CPending';
import CReview from './Pages/CReview';
import CustomerComplaint from './Pages/CustomerComplaint';
import CustomerComplaintsList from './Pages/CustomerComplaintsList';
import Delivered from './Pages/Delivered';
import Detail from './Pages/Detail';
import EProfile from './Pages/Eprofile';
import Home2 from './Pages/Home2';
import Homestack from './Pages/Homestack';
import Mhndi from './Pages/Mhndi';
import MyOrders from './Pages/MyOrders';
import Order from './Pages/Order';
import OrderApproval from './Pages/OrderApproval';
import OrderDetail from './Pages/OrderDetail';
import Payment from './Pages/Payment';
import PendingApproval from './Pages/PendingApproval';
import Profiles from './Pages/Profiles';
import ReviewsList from './Pages/ReviewsList';
import VTO from './Pages/VTO';

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
      <Stack.Screen name="BottomTabSeller" component={BottomTabSeller} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Delete" component={Delete} />
      <Stack.Screen name="Reviews" component={Reviews} />
      <Stack.Screen name="DirectChat" component={DirectChat} options={{ headerShown: false }} />
      <Stack.Screen name="SellerComplaints" component={SellerComplaints} />
      <Stack.Screen name="TermsOfService" component={TermsOfService} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="HelpCenter" component={HelpCenter} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ViewProduct" options={{headerShown:false}} component={ViewProduct} />
      <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: false }} />
      <Stack.Screen name="PickUp" component={PickUp} options={{ headerShown: false }} />
      <Stack.Screen name="Email" component={Email} />
      <Stack.Screen name="AccountSetting" component={AccountSetting} />
      <Stack.Screen name="Logout" component={Logout} />
      <Stack.Screen name="OrderPayment" component={OrderPayment} />
      <Stack.Screen name="Delivery" component={Delivery} options={{ headerShown: false }} />
      <Stack.Screen name="Management" component={Management} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="PendingApproval" component={PendingApproval} options={{ headerShown: false }} />
      <Stack.Screen name="OrderApproval" component={OrderApproval} options={{ headerShown: false }} />
      <Stack.Screen name="SellerComplaint" component={SellerComplaint} options={{ headerShown: false }} />

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
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const CustomerStack = () => (
  <Stack.Navigator initialRouteName="BottomTab">
    {/* Main Bottom Tab Navigator - MUST be first as initialRouteName */}
    <Stack.Screen name="BottomTab" component={BottomTab} options={{ headerShown: false }} />

    {/* Customer Profile Screens */}
    <Stack.Screen name="Profiles" component={Profiles} options={{ headerShown: false }} />
    <Stack.Screen name="EProfile" component={EProfile} options={{ headerShown: false }} />
    <Stack.Screen name="CReview" component={CReview} options={{ headerShown: false }} />
    <Stack.Screen name="ReviewsList" component={ReviewsList} options={{ headerShown: false }} />
    <Stack.Screen name="MyOrders" component={MyOrders} options={{ headerShown: false }} />

    {/* Product & Order Screens */}
    <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false }} />
    <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
    <Stack.Screen name="OrderDetail" component={OrderDetail} options={{ headerShown: false }} />
    <Stack.Screen name="CPending" component={CPending} options={{ headerShown: false }} />
    <Stack.Screen name="Cancel" component={Cancel} options={{ headerShown: false }} />
    <Stack.Screen name="Delivered" component={Delivered} options={{ headerShown: false }} />
    <Stack.Screen name="Detail" component={Detail} options={{ headerShown: false }} />

    {/* Shopping Screens */}
    <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
    <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
    <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />

    {/* Complaint Screens */}
    <Stack.Screen name="CustomerComplaint" component={CustomerComplaint} options={{ headerShown: false }} />
    <Stack.Screen name="CustomerComplaintsList" component={CustomerComplaintsList} options={{ headerShown: false }} />
    <Stack.Screen name="DirectChat" component={DirectChat} options={{ headerShown: false }} />

    {/* Category & Browse Screens */}
    <Stack.Screen name="Home2" component={Home2} options={{ headerShown: false }} />
    <Stack.Screen name="VTO" component={VTO} options={{ headerShown: false }} />
    <Stack.Screen name="Homestack" component={Homestack} options={{ headerShown: false }} />
    <Stack.Screen name="Mhndi" component={Mhndi} options={{ headerShown: false }} />
    <Stack.Screen name="Category" component={CategoryPage} options={{ headerShown: false }} />

    {/* Support & Settings Screens */}
    <Stack.Screen name="Complain" component={Complain} options={{ headerShown: false }} />
    <Stack.Screen name="HelpCenter" component={HelpCenter} options={{ headerShown: false }} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }} />
    <Stack.Screen name="TermsOfService" component={TermsOfService} options={{ headerShown: false }} />
    <Stack.Screen name="AccountSetting" component={AccountSetting} options={{ headerShown: false }} />
    <Stack.Screen name="NotificationSettings" component={NotificationSettings} options={{ headerShown: false }} />

    {/* Account Management Screens */}
    <Stack.Screen name="Password" component={Password} options={{ headerShown: false }} />
    <Stack.Screen name="Delete" component={Delete} options={{ headerShown: false }} />
    <Stack.Screen name="Logout" component={Logout} options={{ headerShown: false }} />

    {/* Auth Screens (for switching accounts) */}
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />

  </Stack.Navigator>
);

const RenderStack = ({ role, user }) => {
  // if (!user?.uid) {
  //   console.log('🔒 User not authenticated - showing auth stack only');

  //   return (
  //     <Stack.Navigator
  //       initialRouteName="Splash"
  //       screenOptions={{
  //         headerShown: false,
  //         headerBackTitleVisible: false,
  //       }}
  //     >
  //       <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
  //       <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
  //       <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
  //       <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
  //       <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
  //     </Stack.Navigator>
  //   );
  // }

 
  // If user is logged in, use their role to determine the stack
  switch (role) {

    

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
      // 🔒 Fallback: If role is unrecognized, redirect to auth stack
      console.log('⚠️ Unrecognized role or missing role - redirecting to Home');
      return (
        <Stack.Navigator
          key="auth-stack"
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        </Stack.Navigator>
      );
  }
};

const RootNavigation = () => {
  const role = useSelector((state) => state.home.role);
  const user = useSelector((state) => state.home.user);

  alert (role)

  const navigationKey = React.useMemo(() => {
    if (!user?.uid) return 'nav-auth';
    if (role === "Seller") return 'nav-seller';
    if (role === "pending") return 'nav-pending';
    if (role === "Customer") return 'nav-customer';
    return 'nav-auth';
  }, [role, user?.uid]);

  return (
    <NavigationContainer key={navigationKey}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <RenderStack role={role} user={user} />
      </SafeAreaView>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootNavigation />
      </PersistGate>
    </Provider>
  );
};

export default App;
