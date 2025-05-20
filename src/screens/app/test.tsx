import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const HotelList = () => {
  const [hotels, setHotels] = useState<any[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const querySnapshot = await firestore().collection('hotels').get();
        const hotelList: any[] = [];

        querySnapshot.forEach(doc => {
          hotelList.push({id: doc.id, ...doc.data()});
        });

        setHotels(hotelList);
      } catch (error) {
        console.log('Lỗi khi lấy danh sách khách sạn:', error);
      }
    };

    fetchHotels();
  }, []);

  return (
    <View>
      {hotels.map(hotel => (
        <Text key={hotel.id}>
          {hotel.name} - {hotel.location}
        </Text>
      ))}
    </View>
  );
};

export default HotelList;
