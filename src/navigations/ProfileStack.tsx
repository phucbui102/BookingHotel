import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ProfileScreen from '../screens/app/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DetailProfileScreen from '../screens/auth/DetailProfileScreen';
import MessageScreen from '../screens/Message/MessageScreen';
import ProvinceSearchScreen from '../screens/Search/ProvinceSearchScreen';
import HomeScreen from '../screens/app/HomeScreen';
import libraryScreen from '../screens/library/libraryScreen';
import DetailLibraryScreen from '../screens/library/DetailLibraryScreen';
import {useAuth} from '../context/AuthContext'; // Dùng AuthContext

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  ProfileDetail: undefined;
  Message: undefined;
  ProvinceSearch: undefined;
  Home: undefined;
  library: undefined;
  DetailLibrary: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

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
      {isLoggedIn ? (
        <Stack.Screen
          name="ProfileMain"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="library" component={libraryScreen} />
      <Stack.Screen name="DetailLibrary" component={DetailLibraryScreen} />
      {/* Profile stack */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Message" component={MessageScreen} />
      <Stack.Screen name="ProvinceSearch" component={ProvinceSearchScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProfileDetail" component={DetailProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
