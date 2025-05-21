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
  Modal,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  addCommentToHotel,
  fetchAmenities,
  fetchComments,
} from '../../services/hotelService';
import {getAuth} from '@react-native-firebase/auth';
import {getApp} from '@react-native-firebase/app';

const DetailScreen = ({route, navigation}) => {
  const {hotel} = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [amenities, setAmenities] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(new Date().getTime() + 2 * 3600000),
  );
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [activeField, setActiveField] = useState<'checkIn' | 'checkOut' | null>(
    null,
  );

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const loadAmenities = async () => {
      const data = await fetchAmenities(hotel.id);
      setAmenities(data);
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
    if (!user) return;

    const success = await addCommentToHotel({
      hotelId: hotel.id,
      userId: user.uid,
      comment: newComment,
      rating: 5,
    });

    if (success) {
      setNewComment('');
      loadComments();
    }
  };

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

  const handleDateChange = (event, selectedDate) => {
    if (!selectedDate) {
      setShowPicker(false);
      return;
    }

    if (activeField === 'checkIn') {
      if (pickerMode === 'date') {
        const current = new Date(checkInDate);
        current.setFullYear(selectedDate.getFullYear());
        current.setMonth(selectedDate.getMonth());
        current.setDate(selectedDate.getDate());
        setCheckInDate(current);
        setPickerMode('time');
      } else {
        const current = new Date(checkInDate);
        current.setHours(selectedDate.getHours());
        current.setMinutes(selectedDate.getMinutes());
        setCheckInDate(current);
        setShowPicker(false);
        setPickerMode('date');
      }
    } else if (activeField === 'checkOut') {
      if (pickerMode === 'date') {
        const current = new Date(checkOutDate);
        current.setFullYear(selectedDate.getFullYear());
        current.setMonth(selectedDate.getMonth());
        current.setDate(selectedDate.getDate());
        setCheckOutDate(current);
        setPickerMode('time');
      } else {
        const current = new Date(checkOutDate);
        current.setHours(selectedDate.getHours());
        current.setMinutes(selectedDate.getMinutes());
        setCheckOutDate(current);
        setShowPicker(false);
        setPickerMode('date');
      }
    }
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
              {item.content || 'Không có nội dung đánh giá'}
            </Text>
          </View>
        )}
        style={styles.commentList}
      />

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

      {/* Nút đặt phòng */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.bookButtonText}>Đặt ngay</Text>
      </TouchableOpacity>

      {/* Modal đặt phòng */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Chọn ngày giờ đặt</Text>

            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setActiveField('checkIn');
                setShowPicker(true);
                setPickerMode('date');
              }}>
              <Text>Ngày đến: {checkInDate.toLocaleString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setActiveField('checkOut');
                setShowPicker(true);
                setPickerMode('date');
              }}>
              <Text>Ngày trả: {checkOutDate.toLocaleString()}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={activeField === 'checkIn' ? checkInDate : checkOutDate}
                mode={pickerMode}
                is24Hour
                display="default"
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            <View style={{flexDirection: 'row', marginTop: 16}}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {flex: 1, backgroundColor: '#ccc', marginRight: 8},
                ]}
                onPress={() => {
                  setModalVisible(false);
                  setShowPicker(false);
                }}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, {flex: 1, backgroundColor: '#2a9d8f'}]}
                onPress={() => {
                  if (checkInDate <= new Date()) {
                    alert('Ngày đến phải sau thời điểm hiện tại');
                    return;
                  }
                  if (checkOutDate <= checkInDate) {
                    alert('Ngày trả phải sau ngày đến');
                    return;
                  }

                  const bookingInfo = {
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                  };

                  setModalVisible(false);
                  navigation.navigate('Payment', {hotel, bookingInfo});
                }}>
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#fff', flex: 1},
  image: {width: '100%', height: 200, borderRadius: 10, marginBottom: 16},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {fontSize: 22, fontWeight: '700', flex: 1, marginRight: 8},
  location: {fontSize: 16, marginTop: 4, color: '#666'},
  price: {fontSize: 18, color: '#2a9d8f', marginTop: 8, fontWeight: 'bold'},
  description: {marginTop: 16, fontSize: 16, lineHeight: 22},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', marginTop: 16},
  amenityContainer: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 8},
  amenityItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityText: {marginLeft: 8, fontSize: 14},
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  commentList: {marginTop: 8},
  commentItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentUser: {fontWeight: '600', marginBottom: 4},
  commentContent: {fontSize: 14, color: '#333'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 50,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  bookButton: {
    backgroundColor: '#2a9d8f',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  bookButtonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
});

export default DetailScreen;
