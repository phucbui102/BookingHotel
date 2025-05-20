import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  addCommentToHotel,
  fetchAmenities,
  fetchComments,
  fetchHotels,
} from '../../services/hotelService';
import {getAuth} from '@react-native-firebase/auth';
import {getApp} from '@react-native-firebase/app';
const DetailScreen = ({route}) => {
  const {hotel} = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [amenities, setAmenities] = useState<any[]>([]);
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Gọi API hoặc lưu trạng thái nếu cần
  };

  // useEffect(() => {
  //   const loadHotels = async () => {
  //     const dataHotel = await fetchComments(hotel.id);
  //     setComments(dataHotel);
  //     console.log(dataHotel + 'hehe');
  //   };

  //   loadHotels();
  // }, [hotel.id]);
  useEffect(() => {
    const loadAmenities = async () => {
      const data = await fetchAmenities(hotel.id);
      setAmenities(data); // setAmenities là state lưu danh sách tiện ích
    };

    if (hotel?.id) {
      loadAmenities();
    }
  }, [hotel?.id]);

  const loadComments = async () => {
    const data = await fetchComments(hotel.id);
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, [hotel.id]);

  const handleAddComment = async () => {
    const user = getAuth(getApp()).currentUser;
    if (!user) {
      console.log('chưa đăng nhập');
      return;
    }

    const success = await addCommentToHotel({
      hotelId: hotel.id,
      userId: user.uid,
      comment: newComment,
      rating: 5,
    });

    if (success) {
      setNewComment('');
      loadComments();
    } else {
    }
  };

  // const amenities = [
  //   {id: '1', icon: 'snowflake-o', label: 'Máy lạnh'},
  //   {id: '2', icon: 'wifi', label: 'WiFi'},
  //   {id: '3', icon: 'cutlery', label: 'Nhà hàng'},
  //   {id: '4', icon: 'clock-o', label: 'Lễ tân 24h'},
  //   {id: '5', icon: 'building-o', label: 'Thang máy'},
  //   {id: '6', icon: 'car', label: 'Bãi đậu xe'},
  // ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={20}
          color="#f1c40f"
          style={{marginRight: 4}}
        />,
      );
    }
    return (
      <View style={{flexDirection: 'row', marginVertical: 8}}>{stars}</View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={hotel.image} style={styles.image} />
      <View style={styles.headerRow}>
        <Text style={styles.name}>{hotel.name}</Text>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={24}
            color={isFavorite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.location}>{hotel.location}</Text>
      <Text style={styles.price}>{hotel.price}</Text>
      <Text style={styles.description}>{hotel.description}</Text>

      <Text style={styles.sectionTitle}>Đánh giá:</Text>
      {renderStars(3)}

      <Text style={styles.sectionTitle}>Tiện ích chính</Text>
      <View style={styles.amenityContainer}>
        {amenities.map(item => (
          <View key={item.id} style={styles.amenityItem}>
            <FontAwesome
              name={item.iconAmenities}
              size={18}
              color="#007aff"
              style={{width: 24}}
            />
            <Text style={styles.amenityText}>{item.nameAmenities}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.commentTitle}>Đánh giá từ người dùng</Text>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({item}) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>{item.user}:</Text>
            <Text style={styles.commentContent}>
              {item.content || 'hKhông có nội dung đánh giá'}
            </Text>
          </View>
        )}
        style={styles.commentList}
      />

      {/* Ô nhập đánh giá */}
      <Text style={styles.commentTitle}>Viết đánh giá của bạn</Text>
      <TextInput
        style={styles.input}
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Nhập đánh giá..."
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleAddComment}>
        <Text style={styles.buttonText}>Gửi đánh giá</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  location: {
    fontSize: 16,
    marginTop: 4,
    color: '#666',
  },
  price: {
    fontSize: 18,
    color: '#2a9d8f',
    marginTop: 8,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  amenityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  amenityItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {
    marginLeft: 8,
    fontSize: 14,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  commentList: {
    marginTop: 8,
  },
  commentItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: '600',
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DetailScreen;
