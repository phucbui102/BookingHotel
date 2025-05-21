// BookingTabs.tsx
import React, {useEffect, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import StatusScreen from './../screens/app/StatusScreen';
import {fetchBookings, fetchHotels} from '../services/hotelService';

const TopTab = createMaterialTopTabNavigator();

const BookingTabs = ({route, navigation}) => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen
        name="Chờ xác nhận"
        component={StatusScreen}
        initialParams={{status: 'w_f_confirmation'}}
      />
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
