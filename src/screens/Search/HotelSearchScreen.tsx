import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HomeStackParamList} from '../../navigations/HomeStack';

const accommodationTypes = [
  'Khách sạn',
  'Căn hộ',
  'Biệt thự',
  'Nhà nghỉ',
  'Resort',
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const route = useRoute();

  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedType, setSelectedType] = useState(accommodationTypes[0]);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [petsAllowed, setPetsAllowed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (route.params && 'selectedProvince' in route.params) {
        setLocation(route.params.selectedProvince as string);
      }
    }, [route.params]),
  );

  const handleStartDateChange = (_event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (_event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate && selectedDate >= startDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('ProvinceSearch')}>
        <View pointerEvents="none">
          <TextInput
            label="Vị trí"
            value={location}
            mode="outlined"
            placeholder="Xung quanh vị trí hiện tại"
            style={styles.input}
            editable={false}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setRoomModalVisible(true)}
        style={styles.menuTrigger}>
        <Text>
          Phòng và khách: {rooms} phòng, {adults} người lớn, {children} trẻ em
        </Text>
      </TouchableOpacity>

      <Modal
        visible={roomModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRoomModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn phòng và khách</Text>

            {[
              {label: 'Phòng', value: rooms, setValue: setRooms},
              {label: 'Người lớn', value: adults, setValue: setAdults},
              {label: 'Trẻ em', value: children, setValue: setChildren},
            ].map(({label, value, setValue}, index) => (
              <View key={index} style={styles.counterRow}>
                <Text style={styles.counterLabel}>{label}</Text>
                <View style={styles.counterControl}>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setValue(Math.max(0, value - 1))}>
                    <Text style={styles.counterSymbol}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{value}</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setValue(value + 1)}>
                    <Text style={styles.counterSymbol}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.toggleRow}>
              <Text>Mang thú cưng đi cùng</Text>
              <TouchableOpacity
                onPress={() => setPetsAllowed(!petsAllowed)}
                style={[
                  styles.toggleSwitch,
                  petsAllowed && styles.toggleSwitchOn,
                ]}>
                <View style={styles.toggleKnob(petsAllowed)} />
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              onPress={() => setRoomModalVisible(false)}
              style={styles.button}>
              Áp dụng
            </Button>
          </View>
        </View>
      </Modal>

      <View style={styles.dateContainer}>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={styles.dateBox}>
          <Text>Ngày đến: {startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={styles.dateBox}>
          <Text>Ngày đi: {endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
        />
      )}

      <TouchableOpacity
        onPress={() => setTypeModalVisible(true)}
        style={styles.menuTrigger}>
        <Text>Loại chỗ nghỉ: {selectedType}</Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('HotelList')}
        style={styles.button}>
        Tìm
      </Button>

      <Modal
        visible={typeModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setTypeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn loại chỗ nghỉ</Text>

            {accommodationTypes.map((type, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setSelectedType(type);
                  setTypeModalVisible(false);
                }}
                style={styles.sheetItem}>
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setTypeModalVisible(false)}
              style={styles.chooseButton}>
              <Text style={styles.chooseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '48%',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  menuTrigger: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    padding: 10,
    borderRadius: 8,
  },
  sheetItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chooseButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  chooseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  counterLabel: {
    fontSize: 16,
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  counterSymbol: {
    fontSize: 18,
  },
  counterValue: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    padding: 2,
  },
  toggleSwitchOn: {
    backgroundColor: '#4caf50',
  },

  toggleKnob: (isOn: boolean) => ({
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    transform: [{translateX: isOn ? 20 : 0}],
  }),
});

export default HomeScreen;
