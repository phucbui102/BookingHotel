import React from 'react';
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

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

type RouteParams = {
  params: {
    status: BookingStatus;
  };
};

const StatusScreen = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const navigation = useNavigation();
  const {status} = route.params;

  const mockData = [
    {
      id: '1',
      name: 'Khách sạn A',
      location: 'Hà Nội',
      price: '1.200.000đ',
      status: 'pending',
      image:
        'https://ik.imagekit.io/tvlk/blog/2017/06/kham-pha-cac-dia-diem-du-lich-o-ha-noi-ma-ban-khong-the-bo-qua-5.jpg',
    },
    {
      id: '1',
      name: 'Khách sạn AA',
      location: 'Bình Dương',
      price: '1.200.000đ',
      status: 'pending',
      image:
        'https://cf.bstatic.com/xdata/images/hotel/max1280x900/683297972.jpg?k=be7214247a6e454bec3575587552a9e2fe4e9c64d07e808f286681f28459ff82&o=&hp=1',
    },
    {
      id: '2',
      name: 'Khách sạn B',
      location: 'TP. Hồ Chí Minh',
      price: '1.500.000đ/đêm',
      status: 'confirmed',
      image:
        'https://ik.imagekit.io/tvlk/blog/2017/06/kham-pha-cac-dia-diem-du-lich-o-ha-noi-ma-ban-khong-the-bo-qua-5.jpg',
    },
    {
      id: '3',
      name: 'Khách sạn C',
      location: 'Đà Nẵng',
      price: '980.000đ/đêm',
      status: 'cancelled',
      image:
        'https://ik.imagekit.io/tvlk/blog/2017/06/kham-pha-cac-dia-diem-du-lich-o-ha-noi-ma-ban-khong-the-bo-qua-5.jpg',
    },
  ];

  const filteredData = mockData.filter(item => item.status === status);

  const handleCancel = (name: string) => {
    Alert.alert('Hủy đặt phòng', `Bạn đã hủy phòng tại ${name}`);
    // TODO: gọi API hoặc cập nhật lại danh sách
  };

  const handleRebook = (name: string) => {
    Alert.alert('Đặt lại', `Bạn muốn đặt lại phòng tại ${name}`);
    // TODO: điều hướng sang màn hình chi tiết đặt phòng
    // navigation.navigate('BookingDetailScreen', { hotelId: item.id });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>
        {status === 'pending'
          ? 'Đang chờ xác nhận'
          : status === 'confirmed'
          ? 'Đã đặt'
          : 'Đã hủy'}
      </Text> */}

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={{uri: item.image}} style={styles.hotelImage} />
            <View style={styles.infoContainer}>
              <Text style={styles.hotelName}>{item.name}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={[styles.status, getStatusStyle(item.status)]}>
                {getStatusLabel(item.status)}
              </Text>

              {/* Hiển thị nút phù hợp */}
              {item.status === 'pending' && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancel(item.name)}>
                  <Text style={styles.buttonText}>Hủy đặt phòng</Text>
                </TouchableOpacity>
              )}

              {item.status === 'cancelled' && (
                <TouchableOpacity
                  style={styles.rebookButton}
                  onPress={() => handleRebook(item.name)}>
                  <Text style={styles.buttonText}>Đặt lại</Text>
                </TouchableOpacity>
              )}

              {item.status === 'confirmed' && (
                <TouchableOpacity style={[styles.disabledButton]} disabled>
                  <Text style={styles.buttonText}>Đã xác nhận</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có phòng nào.</Text>
        }
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
};

const getStatusLabel = (status: BookingStatus) => {
  switch (status) {
    case 'pending':
      return 'Đang chờ xác nhận';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'cancelled':
      return 'Đã hủy';
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
  }
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
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
  disabledButton: {
    marginTop: 10,
    backgroundColor: '#BDBDBD',
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
