// BookingTabs.tsx
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import StatusScreen from './../screens/app/StatusScreen';

const TopTab = createMaterialTopTabNavigator();

const BookingTabs = () => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen
        name="Đang đặt"
        component={StatusScreen}
        initialParams={{status: 'pending'}}
      />
      <TopTab.Screen
        name="Đã đặt"
        component={StatusScreen}
        initialParams={{status: 'confirmed'}}
      />
      <TopTab.Screen
        name="Đã hủy"
        component={StatusScreen}
        initialParams={{status: 'cancelled'}}
      />
    </TopTab.Navigator>
  );
};

export default BookingTabs;
