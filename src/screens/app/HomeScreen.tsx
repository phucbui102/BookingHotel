import React, {useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
  Platform,
  Pressable,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '../../navigations/HomeStack';
//data tạo danh sách theo tag
const categories = [
  'Thành phố',
  'Bãi biển',
  'Thiên nhiên',
  'Thư giãn',
  'Lãng mạn',
  'Ẩm thực',
];

const data = [
  {
    id: '1',
    name: 'Hà Nội',
    image: require('../../../assets/logo.png'),
    distance: 'Cách đây 1,2 km',
    tags: ['thành phố'],
  },
  {
    id: '2',
    name: 'Lào Cai',
    image: require('../../../assets/logo.png'),
    distance: 'Cách đây 255 km',
    tags: ['thiên nhiên', 'rừng'],
  },
  {
    id: '3',
    name: 'Đà Nẵng',
    image: require('../../../assets/logo.png'),
    distance: 'Cách đây 605 km',
    tags: ['bãi biển', 'thành phố'],
  },
  // Thêm dữ liệu khác tương tự...
];

// hết

const popularDestinations = [
  {
    name: 'Hà Nội',
    image:
      'https://ik.imagekit.io/tvlk/blog/2017/06/kham-pha-cac-dia-diem-du-lich-o-ha-noi-ma-ban-khong-the-bo-qua-5.jpg',
  },
  {
    name: 'TP. HCM',
    image:
      'https://owa.bestprice.vn/images/articles/uploads/10-dia-diem-du-lich-thanh-pho-ho-chi-minh-noi-tieng-nhat-5fa039400ddbd.jpg',
  },
  {
    name: 'Đà Nẵng',
    image:
      'https://vietluxtour.com/Upload/images/2024/khamphatrongnuoc/%C4%91%E1%BB%8Ba%20%C4%91i%E1%BB%83m%20du%20l%E1%BB%8Bch%20%C4%91%C3%A0%20n%E1%BA%B5ng/dia-diem-du-lich-da-nang%20(9)-min.jpg',
  },
];

const featuredHotels = [
  {
    name: 'Khách sạn Melia',
    location: 'Hà Nội',
    image: 'https://dam.melia.com/melia/file/3ntidp7ept3oCjNncLqX.jpg',
    price: '1.200.000đ/đêm',
    latitude: 21.028511,
    longitude: 105.804817,
  },
  {
    name: 'Novotel Đà Nẵng',
    location: 'Đà Nẵng',
    image:
      'https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/72/2025/05/05150616/Novotel-Ariel_2.jpg',
    price: '1.500.000đ/đêm',
    latitude: 16.054407,
    longitude: 108.202167,
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  // code tạo danh sách dựa trên tags
  const [selectedCategory, setSelectedCategory] = useState('Ẩm thực');

  const filteredData = data.filter(item =>
    item.tags.includes(selectedCategory.toLowerCase()),
  );
  // hết
  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <Image
        source={{
          uri: 'https://www.anques.com/wp-content/uploads/2021/12/Flight-booking-banner1-1.jpg',
        }}
        style={styles.banner}
      />

      {/* Tìm kiếm + ngày nhận/trả phòng */}
      <Pressable
        style={styles.searchInput}
        onPress={() => navigation.navigate('HotelSearch')}>
        <Text style={{color: '#999'}}>Tìm kiếm khách sạn, địa điểm...</Text>
      </Pressable>

      {/* code giao diện hiện đieạ điểm theo tags */}

      {/* Danh mục */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Danh sách địa điểm */}
      <FlatList
        horizontal
        data={filteredData}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardList}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
        )}
      />

      {/* hết */}

      <View style={styles.dateContainer}>
        <TouchableOpacity
          onPress={() => setShowCheckInPicker(true)}
          style={styles.dateBox}>
          <Text>Nhận phòng: {checkIn.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowCheckOutPicker(true)}
          style={styles.dateBox}>
          <Text>Trả phòng: {checkOut.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>
      {showCheckInPicker && (
        <DateTimePicker
          value={checkIn}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowCheckInPicker(false);
            if (selectedDate) setCheckIn(selectedDate);
          }}
        />
      )}
      {showCheckOutPicker && (
        <DateTimePicker
          value={checkOut}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowCheckOutPicker(false);
            if (selectedDate) setCheckOut(selectedDate);
          }}
        />
      )}

      {/* Điểm đến phổ biến */}
      <Text style={styles.sectionTitle}>Điểm đến phổ biến</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {popularDestinations.map((item, index) => (
          <TouchableOpacity key={index} style={styles.destinationCard}>
            <Image source={{uri: item.image}} style={styles.destinationImage} />
            <Text style={styles.destinationName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Khách sạn nổi bật */}
      <Text style={styles.sectionTitle}>Khách sạn nổi bật</Text>
      {featuredHotels.map((hotel, index) => (
        <View key={index} style={styles.hotelCard}>
          <Image source={{uri: hotel.image}} style={styles.hotelImage} />
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text>{hotel.location}</Text>
            <Text style={styles.hotelPrice}>{hotel.price}</Text>
          </View>
        </View>
      ))}

      {/* Dịch vụ phổ biến */}
      <Text style={styles.sectionTitle}>Dịch vụ phổ biến</Text>
      <View style={styles.serviceContainer}>
        <View style={styles.serviceBox}>
          <Text>🏊 Hồ bơi</Text>
        </View>
        <View style={styles.serviceBox}>
          <Text>🍽 Ăn sáng</Text>
        </View>
        <View style={styles.serviceBox}>
          <Text>🏋️ Gym</Text>
        </View>
      </View>

      {/* Đánh giá gần đây */}
      <Text style={styles.sectionTitle}>Đánh giá gần đây</Text>
      <View style={styles.reviewBox}>
        <Text style={styles.hotelName}>Khách sạn Melia</Text>
        <Text>"Rất tuyệt vời, sạch sẽ và gần trung tâm." - An</Text>
      </View>

      {/* Gợi ý gần bạn */}
      <Text style={styles.sectionTitle}>Gợi ý gần bạn</Text>
      <View style={styles.nearbyBox}>
        <Text>📍 Bạn đang ở gần Hà Nội, xem các khách sạn phù hợp!</Text>
      </View>

      {/* Giả lập thanh điều hướng
      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>🏠 Trang chủ</Text>
        <Text style={styles.navItem}>🔍 Tìm kiếm</Text>
        <Text style={styles.navItem}>❤️ Ưa thích</Text>
        <Text style={styles.navItem}>👤 Hồ sơ</Text>
      </View> */}
      <Text style={styles.sectionTitle}>Bản đồ khách sạn</Text>
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: featuredHotels[0].latitude,
          longitude: featuredHotels[0].longitude,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        {featuredHotels.map((hotel, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: hotel.latitude, longitude: hotel.longitude }}
            title={hotel.name}
            description={hotel.location}
          />
        ))}
      </MapView> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 30,
  },
  container: {
    backgroundColor: '#fff',
    padding: 16,
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateBox: {
    flex: 1,
    backgroundColor: '#e1e1e1',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  destinationCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  destinationImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
  },
  categoryList: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardList: {
    paddingLeft: 10,
  },
  card: {
    width: 140,
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  name: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  distance: {
    color: '#777',
  },
  destinationName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  hotelCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  hotelImage: {
    width: 120,
    height: 90,
  },
  hotelInfo: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  hotelName: {
    fontWeight: '600',
    fontSize: 16,
  },
  hotelPrice: {
    color: '#2a9d8f',
    fontWeight: 'bold',
  },
  serviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  serviceBox: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  reviewBox: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  nearbyBox: {
    backgroundColor: '#d0f0c0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 40,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  navItem: {
    fontSize: 14,
  },
});

export default HomeScreen;
