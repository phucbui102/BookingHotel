import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {
  route: any;
  navigation: any;
}

const PaymentScreen: React.FC<Props> = ({route, navigation}) => {
  const {hotel, bookingInfo} = route.params;
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);

  const handlePayment = async () => {
    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Lỗi', 'Bạn chưa đăng nhập');
      return;
    }

    try {
      await firestore().collection('bookings').add({
        userId: user.uid,
        hotelId: hotel.id,
        checkIn: bookingInfo.checkIn,
        checkOut: bookingInfo.checkOut,
        price: hotel.price,
        status: 'chờ xác nhận',
        timestamp: new Date(),
      });

      // Hiện modal thành công
      setSuccessVisible(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể xử lý thanh toán');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán cho {hotel.name}</Text>
      <TextInput
        placeholder="Số thẻ"
        style={styles.input}
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Ngày hết hạn (MM/YY)"
        style={styles.input}
        value={expiry}
        onChangeText={setExpiry}
      />
      <TextInput
        placeholder="CVV"
        style={styles.input}
        value={cvv}
        onChangeText={setCvv}
        secureTextEntry
      />
      <Button title="Thanh toán" onPress={handlePayment} />

      <Modal isVisible={successVisible}>
        <View style={styles.modalContainer}>
          <FontAwesome name="check-circle" size={60} color="#2ecc71" />
          <Text style={styles.modalTitle}>Thanh toán thành công!</Text>
          <Text style={styles.modalMessage}>Đơn đặt phòng đã được xử lý.</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setSuccessVisible(false);
              navigation.navigate('Status', {Bookings}); // Tab của bạn
            }}>
            <Text style={styles.modalButtonText}>Xem đơn của tôi</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {padding: 20, flex: 1},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 20},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
    color: '#555',
  },
  modalButton: {
    backgroundColor: '#2a9d8f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
