import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import {TextInput, Button, Switch} from 'react-native-paper';
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

const BookingScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const route = useRoute();

  const [location, setLocation] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
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

  const dismissKeyboard = () => Keyboard.dismiss();

  useFocusEffect(
    useCallback(() => {
      if (route.params && 'selectedProvince' in route.params) {
        setLocation(route.params.selectedProvince as string);
      }
    }, [route.params]),
  );

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(error => console.error('Failed to load provinces:', error));
  }, []);

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

  const filteredProvinces = provinces.filter((item: any) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
          <TextInput
            label="Vị trí"
            value={location}
            mode="outlined"
            placeholder="Xung quanh vị trí hiện tại"
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>

        <Modal
          visible={searchModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setSearchModalVisible(false)}>
          <TouchableWithoutFeedback
            onPress={() => setSearchModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.searchModalContent}>
                  <Text style={styles.modalTitle}>Tìm kiếm tỉnh/thành</Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Nhập tên tỉnh/thành..."
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.modalInput}
                  />
                  <FlatList
                    data={filteredProvinces}
                    keyExtractor={item => item.code.toString()}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        onPress={() => {
                          setLocation(item.name);
                          setSearchModalVisible(false);
                        }}>
                        <Text style={styles.sheetItem}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View style={styles.rowBetween}>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            style={styles.dateBox}>
            <Text style={styles.dateText}>Ngày đến</Text>
            <Text>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            style={styles.dateBox}>
            <Text style={styles.dateText}>Ngày đi</Text>
            <Text>{endDate.toLocaleDateString()}</Text>
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
          onPress={() => setRoomModalVisible(true)}
          style={styles.menuTrigger}>
          <Text>
            Phòng/khách: {rooms} phòng, {adults} người lớn, {children} trẻ em
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTypeModalVisible(true)}
          style={styles.menuTrigger}>
          <Text>Loại chỗ nghỉ: {selectedType}</Text>
        </TouchableOpacity>

        <View style={styles.toggleRow}>
          <Text>Mang thú cưng</Text>
          <Switch
            value={petsAllowed}
            onValueChange={setPetsAllowed}
            color="#1E88E5"
          />
        </View>

        <Button
          mode="contained"
          onPress={() => {
            const bookingParams = {
              location,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              rooms,
              adults,
              children,
              petsAllowed,
              accommodationType: selectedType,
            };

            console.log('Booking params:', bookingParams); // kiểm tra
            navigation.navigate('HotelList', {bookingParams});
          }}
          style={styles.button}>
          Tìm
        </Button>

        {/* Modal chọn loại chỗ nghỉ */}
        <Modal visible={typeModalVisible} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setTypeModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.searchModalContent}>
                  <Text style={styles.modalTitle}>Chọn loại chỗ nghỉ</Text>
                  {accommodationTypes.map((type, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        setSelectedType(type);
                        setTypeModalVisible(false);
                      }}
                      style={[
                        styles.sheetItem,
                        selectedType === type && styles.sheetItemActive,
                      ]}>
                      <Text>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal chọn phòng và khách */}
        <Modal visible={roomModalVisible} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setRoomModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.searchModalContent}>
                  <Text style={styles.modalTitle}>Chọn phòng và khách</Text>
                  {[
                    {label: 'Phòng', value: rooms, set: setRooms},
                    {label: 'Người lớn', value: adults, set: setAdults},
                    {label: 'Trẻ em', value: children, set: setChildren},
                  ].map(({label, value, set}, idx) => (
                    <View key={idx} style={styles.counterRow}>
                      <Text style={styles.counterLabel}>{label}</Text>
                      <View style={styles.counterControl}>
                        <TouchableOpacity
                          onPress={() => set(Math.max(0, value - 1))}
                          style={styles.counterButton}>
                          <Text>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{value}</Text>
                        <TouchableOpacity
                          onPress={() => set(value + 1)}
                          style={styles.counterButton}>
                          <Text>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fbfd',
    flex: 1,
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  dateText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuTrigger: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchModalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    width: '90%',
    borderRadius: 12,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#0057d9',
  },
  modalInput: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  sheetItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    color: '#333',
  },
  sheetItemActive: {
    backgroundColor: '#E3F2FD',
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
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
    borderRadius: 6,
  },
  counterValue: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default BookingScreen;
