import React, {useEffect, useState} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '../../navigations/HomeStack';
// import firestore from '@react-native-firebase/firestore';
import {fetchHotels} from '../../services/hotelService';

// Danh mục hiển thị
const categories = [
  'Tất cả',
  'Thành Phố',
  'Bãi biển',
  'Thiên nhiên',
  'Thư giãn',
  'Lãng mạn',
  'Ẩm thực',
];

// Điểm đến phổ biến
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
      'https://vietluxtour.com/Upload/images/2024/khamphatrongnuoc/dia-diem-du-lich-da-nang%20(9)-min.jpg',
  },
];

// Danh sách khách sạn nổi bật có thông tin map

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const [hotels, setHotels] = useState<any[]>([]);
  const [featuredHotels, setFeaturedHotels] = useState<any[]>([]);
  const [NearbyHotels, setNearbyHotels] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  useEffect(() => {
    const loadHotels = async () => {
      const dataHotel = await fetchHotels();
      setHotels(dataHotel);
      // lấy danh sách khách sạn nổi bật
      const datafeaturedHotels = await fetchHotels({featuredHotels: true});
      setFeaturedHotels(datafeaturedHotels);

      // lấy danh sách khách sạn ở gần
      const dataNearbyHotels = await fetchHotels({location: 'Đà Nẵng'});
      setNearbyHotels(dataNearbyHotels);
    };

    loadHotels();
  }, []);

  const filteredData = hotels.filter(hotel =>
    hotel.tags.some(
      (tag: string) => tag.toLowerCase() === selectedCategory.toLowerCase(),
    ),
  );

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <Image
        source={{
          uri: 'https://www.anques.com/wp-content/uploads/2021/12/Flight-booking-banner1-1.jpg',
        }}
        style={styles.banner}
      />

      {/* Ô tìm kiếm */}
      <Pressable
        style={styles.searchInput}
        onPress={() => navigation.navigate('HotelSearch')}>
        <Text style={{color: '#999'}}>Tìm kiếm khách sạn, địa điểm...</Text>
      </Pressable>

      {/* Danh mục theo tag */}
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
            <Text style={styles.distance}>{item.price}</Text>
          </View>
        )}
      />

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
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate('Detail', {hotel})}
          style={styles.hotelCard}>
          <Image source={hotel.image} style={styles.hotelImage} />
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text>{hotel.location}</Text>
            <Text style={styles.hotelPrice}>{hotel.price}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Dịch vụ phổ biến */}
      <Text style={styles.sectionTitle}>Dịch vụ phổ biến</Text>
      <View style={styles.serviceContainer}>
        {['🏊 Hồ bơi', '🍽 Ăn sáng', '🏋️ Gym'].map((service, idx) => (
          <View key={idx} style={styles.serviceBox}>
            <Text>{service}</Text>
          </View>
        ))}
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

      {/* Bản đồ */}
      <Text style={styles.sectionTitle}>Bản đồ khách sạn</Text>
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: NearbyHotels[0].latitude,
          longitude: NearbyHotels[0].longitude,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}>
        {NearbyHotels.map((hotel, index) => (
          <Marker
            key={index}
            coordinate={{latitude: hotel.latitude, longitude: hotel.longitude}}
            title={hotel.Name}
            description={hotel.location}
          />
        ))}
      </MapView> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
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
    marginBottom: 10,
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
  destinationCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  destinationImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
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
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 30,
  },
});

export default HomeScreen;
