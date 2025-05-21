import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {fetchBookings, fetchHotels} from '../../services/hotelService';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'w_f_confirmation';

type RouteParams = {
  params: {
    status: BookingStatus;
  };
};

const StatusScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const navigation = useNavigation();
  const {status} = route.params;

  const [bookingsWithHotels, setBookingsWithHotels] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const bookings = await fetchBookings();

      const hotelDataArray = await Promise.all(
        bookings.map(booking => fetchHotels({hotelId: booking.hotelId})),
      );

      const flatHotels = hotelDataArray.flat();

      const combined = bookings.map((booking, index) => ({
        ...booking,
        hotel: flatHotels[index] || null,
      }));

      setBookingsWithHotels(combined);
    };

    load();
  }, []);

  const filteredData = bookingsWithHotels.filter(
    item => item.status === status,
  );

  const handleCancel = (name: string) => {
    Alert.alert('Hủy đặt phòng', `Bạn đã hủy phòng tại ${name}`);
    // TODO: Gọi API hủy phòng ở đây
  };

  const handleRebook = (name: string) => {
    Alert.alert('Đặt lại', `Bạn muốn đặt lại phòng tại ${name}`);
    // TODO: Điều hướng đến màn hình đặt phòng
    // navigation.navigate('BookingDetailScreen', { hotelId: ... });
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'Đang đặt';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'w_f_confirmation':
        return 'Đợi xác nhận';
      default:
        return '';
    }
  };

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return {color: '#FFA500'};
      case 'confirmed':
        return {color: '#4CAF50'};
      case 'cancelled':
        return {color: '#F44336'};
      default:
        return {color: '#999'};
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image
              source={{
                uri:
                  item.hotel?.image?.uri ||
                  'https://via.placeholder.com/300x180?text=No+Image',
              }}
              style={styles.hotelImage}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.hotelName}>
                {item.hotel?.name || 'Không rõ tên'}
              </Text>
              <Text style={styles.location}>
                {item.hotel?.location || 'Không rõ địa điểm'}
              </Text>
              <Text style={styles.price}>
                {item.hotel?.price
                  ? `${item.hotel.price.toLocaleString('vi-VN')}đ/đêm`
                  : 'Giá không rõ'}
              </Text>
              <Text style={[styles.status, getStatusStyle(item.status)]}>
                {getStatusLabel(item.status)}
              </Text>

              {item.status === 'w_f_confirmation' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancel(item.hotel?.name || '')}>
                  <Text style={styles.buttonText}>Hủy đặt phòng</Text>
                </TouchableOpacity>
              )}
              {['confirmed', 'cancelled'].includes(item.status) && (
                <TouchableOpacity
                  style={styles.rebookButton}
                  onPress={() => handleRebook(item.hotel?.name || '')}>
                  <Text style={styles.buttonText}>Đặt lại</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có phòng nào.</Text>
        }
      />
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  hotelImage: {
    width: '100%',
    height: 180,
  },
  infoContainer: {
    padding: 12,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  location: {
    color: '#666',
    marginTop: 4,
  },
  price: {
    marginTop: 8,
    fontWeight: '600',
    color: '#1E88E5',
  },
  status: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 8,
  },
  rebookButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#777',
  },
});

export default StatusScreen;
