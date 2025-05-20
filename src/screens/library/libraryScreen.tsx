import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {ProfileStackParamList} from '../../navigations/ProfileStack';

const initialData = [
  {
    id: '1',
    title: 'cute',
    count: 64,
    name: 'khách sạn A',
    price: '10000',
    time: '1 tháng',
    images: [
      {
        uri: 'https://cf.bstatic.com/xdata/images/hotel/square240/601453690.jpg?k=f1bc4e8be372764148db726156bc2fdd455bd8bea0ce240efe63f056a5603198&o=',
      },
      {
        uri: 'https://cf.bstatic.com/xdata/images/hotel/square240/608461465.jpg?k=04d624b08ed0f054cf14d996c138bdb98435f02a154d02b160aa8458b4c732b7&o=',
      },
      {
        uri: 'https://cf.bstatic.com/xdata/images/hotel/square240/536409944.jpg?k=5bbb5f09abed50e7caf4b35d52b5d9e12f76639aae7d362b316350ac54cd43f2&o=',
      },
    ],
  },
  {
    id: '2',
    title: 'biến hóa',
    count: 80,
    name: 'khách sạn A',
    price: '10000',
    time: '1 tháng',
    images: [
      {
        uri: 'https://cf.bstatic.com/xdata/images/hotel/square240/636527353.jpg?k=e860568fe83d7da521820b940be3c02f8f1742a0f1bf6d093839b092aa8ff0f7&o=',
      },
      {
        uri: 'https://cf.bstatic.com/xdata/images/hotel/square240/536409944.jpg?k=5bbb5f09abed50e7caf4b35d52b5d9e12f76639aae7d362b316350ac54cd43f2&o=',
      },
    ],
  },
];

const ITEM_WIDTH = Dimensions.get('window').width / 2 - 20;
const DEFAULT_IMAGE = {
  uri: 'https://i.pinimg.com/736x/b8/8d/cf/b88dcf58674caa517a052206c866225d.jpg',
};
export default function LibraryScreen() {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const [data, setData] = useState([
    {id: 'add', isAddButton: true},
    ...initialData,
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = () => {
    if (!newTitle.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên bộ sưu tập!');
      return;
    }

    const newCollection = {
      id: Date.now().toString(),
      title: newTitle,
      count: 0,
      time: 'vừa xong',
      images: [],
    };

    setData(prev => [prev[0], newCollection, ...prev.slice(1)]);
    setNewTitle('');
    setModalVisible(false);
  };

  const AddCard = () => (
    <TouchableOpacity
      style={[styles.card, styles.addCard]}
      onPress={() => setModalVisible(true)}>
      <Text style={styles.addIcon}>＋</Text>
      <Text style={styles.addText}>Thêm bộ sưu tập</Text>
    </TouchableOpacity>
  );

  const GroupCard = ({item}) => {
    const images =
      item.images && item.images.length > 0
        ? item.images.slice(0, 3)
        : [DEFAULT_IMAGE];
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('DetailLibrary', {collection: item})
        }>
        <View style={styles.imageLayout}>
          {images.length === 1 ? (
            <Image
              source={images[0]}
              style={[styles.largeImage, {flex: 1, borderRadius: 12}]}
              resizeMode="cover"
            />
          ) : (
            <>
              <Image
                source={images[0]}
                style={styles.largeImage}
                resizeMode="cover"
              />
              <View style={styles.smallImagesColumn}>
                {images[1] && (
                  <Image
                    source={images[1]}
                    style={styles.smallImage}
                    resizeMode="cover"
                  />
                )}
                {images[2] && (
                  <Image
                    source={images[2]}
                    style={styles.smallImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            </>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subText}>
            {item.count} Ghim · {item.time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item}) =>
          item.isAddButton ? <AddCard /> : <GroupCard item={item} />
        }
        contentContainerStyle={{padding: 10}}
        columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 16}}
        showsVerticalScrollIndicator={false}
      />

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tạo bộ sưu tập mới</Text>
            <TextInput
              placeholder="Nhập tên bộ sưu tập..."
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleCreate}
                style={styles.createButton}>
                <Text style={styles.buttonText}>Tạo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    width: ITEM_WIDTH,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 5,
  },
  imageLayout: {flexDirection: 'row', height: ITEM_WIDTH},
  largeImage: {
    flex: 2,
    marginRight: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  smallImagesColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  smallImage: {
    height: ITEM_WIDTH / 2 - 2,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  info: {padding: 8},
  title: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  subText: {color: '#555', fontSize: 14},
  addCard: {
    backgroundColor: '#e0f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_WIDTH,
  },
  addIcon: {fontSize: 36, color: '#00796b', marginBottom: 4},
  addText: {fontSize: 16, color: '#00796b', fontWeight: 'bold'},

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
