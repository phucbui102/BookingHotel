import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MessageScreen from '../screens/Message/MessageScreen';
import ProvinceSearchScreen from '../screens/Search/ProvinceSearchScreen';
import HotelSearchScreen from '../screens/Search/HotelSearchScreen';
import HotelListScreen from '../screens/Search/HotelListScreen';
import HomeScreen from '../screens/app/HomeScreen';
import DetailScreen from '../screens/Booking/DetailScreen';
import PaymentScreen from '../screens/pay/PaymentScreen';
import StatusScreen from '../screens/app/StatusScreen';
import {useAuth} from '../context/AuthContext'; // Dùng AuthContext

export type HomeStackParamList = {
  Message: undefined;
  ProvinceSearch: undefined;
  HomeMain: undefined;
  HotelSearch: undefined;
  HotelList: undefined;
  Detail: undefined;
  Payment: undefined;
  Status: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const ProfileStack: React.FC = () => {
  const {isLoggedIn} = useAuth(); // Lấy trạng thái đăng nhập

  return (
    <Stack.Navigator>
      {/* {isLoggedIn ? (
        <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )} */}
      {/* Profile stack */}
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Message" component={MessageScreen} />
      <Stack.Screen name="HotelSearch" component={HotelSearchScreen} />
      <Stack.Screen
        name="HotelList"
        component={HotelListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="ProvinceSearch" component={ProvinceSearchScreen} />
      {/* <Stack.Screen name="Status" component={StatusScreen} /> */}
    </Stack.Navigator>
  );
};

export default ProfileStack;
