/* eslint-disable react/no-unstable-nested-components */
// AppTabsNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeStack from './HomeStack';
import SavedScreen from '../screens/app/SavedScreen';
import ProfileStack from './ProfileStack'; // Import ProfileStack
import StatusScreen from './StatusTabs';
const Tab = createBottomTabNavigator();

const AppTabsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Ionicons name="cloudy-night-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabsNavigator;
