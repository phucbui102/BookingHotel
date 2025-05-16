import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [from] = useState('TP HCM (SGN)');
  const [to] = useState('Hà Nội (HAN)');
  const [date, setDate] = useState(new Date(2025, 4, 15));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passengerModalVisible, setPassengerModalVisible] = useState(false);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt vé máy bay</Text>

      <Text style={styles.label}>Từ</Text>
      <TextInput value={from} editable={false} style={styles.input} />

      <Text style={styles.label}>Đến</Text>
      <TextInput value={to} editable={false} style={styles.input} />

      <Text style={styles.label}>Ngày đi</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowDatePicker(false);
            setDate(currentDate);
          }}
        />
      )}

      <Text style={styles.label}>Hành khách</Text>
      <TouchableOpacity style={styles.input} onPress={() => setPassengerModalVisible(true)}>
        <Text>{adults + children + infants} hành khách</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchText}>Tìm kiếm</Text>
      </TouchableOpacity>

      {/* Modal thêm hành khách */}
      <Modal visible={passengerModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Hành Khách</Text>

            <PassengerRow label="Người lớn" value={adults} setValue={setAdults} />
            <PassengerRow label="Trẻ em" value={children} setValue={setChildren} />
            <PassengerRow label="Em bé" value={infants} setValue={setInfants} />

            <TouchableOpacity
              style={styles.chooseButton}
              onPress={() => setPassengerModalVisible(false)}
            >
              <Text style={styles.chooseText}>Chọn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const PassengerRow = ({ label, value, setValue }) => (
  <View style={styles.passengerRow}>
    <Text style={styles.passengerLabel}>{label}</Text>
    <View style={styles.counter}></View>
    <TouchableOpacity onPress={() => setValue(Math.max(0, value - 1))}>
        <Text style={styles.counterBtn}>−</Text>
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity onPress={() => setValue(value + 1)}>
        <Text style={styles.counterBtn}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  searchButton: {
    backgroundColor: '#f97316',
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
  },
  searchText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  passengerLabel: {
    fontSize: 16,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    fontSize: 28,
    paddingHorizontal: 12,
  },
  counterValue: {
    fontSize: 18,
    marginHorizontal: 4,
  },
  chooseButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  chooseText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});