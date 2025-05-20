import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from 'react-native';
import {HomeStackParamList} from '../../navigations/HomeStack';
import {fetchDataHotelsFind} from '../../services/hotelService';

// const hotels = [
//   {
//     id: '1',
//     name: 'Paradise Grand Hotel',
//     rating: 5,
//     score: 10,
//     review: 'Xuất sắc',
//     reviewsCount: 3,
//     address: 'Tại trung tâm thành phố',
//     price: 720000,
//     originalPrice: 2250000,
//     breakfast: true,
//     freeCancel: true,
//     payLater: true,
//     image:
//       'https://cf.bstatic.com/xdata/images/hotel/square600/678852673.webp?k=adde50956f9fbab0b9796b550e895f329cfc974fa77e1f9fde840f3898c47441&o=',
//   },
//   {
//     id: '2',
//     name: 'Dusit Le Palais Tu Hoa Hanoi',
//     rating: 5,
//     score: null,
//     review: null,
//     reviewsCount: 0,
//     address: 'Quận Tây Hồ • cách trung tâm 6,4km',
//     price: 3555000,
//     originalPrice: 3950000,
//     breakfast: false,
//     freeCancel: true,
//     payLater: true,
//     image:
//       'https://cf.bstatic.com/xdata/images/hotel/square600/680981331.webp?k=cc2b1682a7b891814371f16937df18d8c05df0a9ec7cd1c68046be244857e334&o=',
//   },
//   // Thêm nhiều khách sạn khác...
// ];

export default function HotelListScreen() {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  const [filters, setFilters] = useState({
    breakfast: false,
    freeCancel: false,
    payLater: false,
  });
  const route = useRoute();
  const {bookingParams} = route.params;
  const [sortType, setSortType] = useState<'none' | 'asc' | 'desc'>('none');
  const [hotels, SetHotels] = useState<any[]>([]);
  console.log(bookingParams);

  useEffect(() => {
    const loadHotels = async () => {
      const dataHotel = await fetchDataHotelsFind({
        location: bookingParams.location,
        classify: bookingParams.classify,
      });
      SetHotels(dataHotel);
      console.log(dataHotel);
    };
    loadHotels();
  }, []);
  // Lọc dữ liệu
  let filteredHotels = hotels.filter(h => {
    if (filters.breakfast && !h.breakfast) return false;
    if (filters.freeCancel && !h.freeCancel) return false;
    if (filters.payLater && !h.payLater) return false;
    return true;
  });

  // Sắp xếp dữ liệu
  if (sortType === 'asc') {
    filteredHotels = filteredHotels.sort((a, b) => a.price - b.price);
  } else if (sortType === 'desc') {
    filteredHotels = filteredHotels.sort((a, b) => b.price - a.price);
  }

  const renderStars = (count: number) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  const renderItem = ({item: hotel}: {item: any}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        console.log('item');
        console.log(hotel);
        navigation.navigate('Detail', {hotel});
      }}>
      <Image source={hotel.image} style={styles.image} />
      <View style={styles.cardBody}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{hotel.name}</Text>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingText}>{renderStars(hotel.ranking)}</Text>
          </View>
        </View>
        {hotel.review && (
          <Text style={styles.review}>
            {hotel.review} ({hotel.reviewsCount} đánh giá)
          </Text>
        )}
        <Text style={styles.address}>{hotel.address}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.originalPrice}>
            {hotel.originalPrice.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
          <Text style={styles.price}>
            {hotel.price.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
        </View>
        <Text style={styles.taxNote}>Đã bao gồm thuế và phí</Text>
        <View style={styles.tagsRow}>
          {hotel.breakfast && <Tag text="Bao gồm bữa sáng" />}
          {hotel.freeCancel && <Tag text="Hủy miễn phí" />}
          {hotel.payLater && <Tag text="Thanh toán sau" />}
        </View>
      </View>
    </TouchableOpacity>
  );

  const Tag = ({text}: {text: string}) => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm khách sạn, địa điểm..."
              placeholderTextColor="#bbb"
              returnKeyType="search"
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Buttons Sắp xếp, Lọc */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setSortVisible(true)}>
          <Text style={styles.actionText}>Sắp xếp ↓</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setFilterVisible(true)}>
          <Text style={styles.actionText}>Lọc 🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách khách sạn */}
      <FlatList
        data={filteredHotels}
        keyExtractor={hotel => hotel.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 24}}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal Lọc */}
      <Modal
        animationType="slide"
        transparent
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.bottomSheet}>
                <Text style={styles.sheetTitle}>Lọc khách sạn</Text>

                <FilterOption
                  label="Bao gồm bữa sáng"
                  value={filters.breakfast}
                  onToggle={() =>
                    setFilters({...filters, breakfast: !filters.breakfast})
                  }
                />
                <FilterOption
                  label="Hủy miễn phí"
                  value={filters.freeCancel}
                  onToggle={() =>
                    setFilters({...filters, freeCancel: !filters.freeCancel})
                  }
                />
                <FilterOption
                  label="Thanh toán sau"
                  value={filters.payLater}
                  onToggle={() =>
                    setFilters({...filters, payLater: !filters.payLater})
                  }
                />

                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => setFilterVisible(false)}>
                  <Text style={styles.applyButtonText}>Áp dụng</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal Sắp xếp */}
      <Modal
        animationType="slide"
        transparent
        visible={sortVisible}
        onRequestClose={() => setSortVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setSortVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.bottomSheet}>
                <Text style={styles.sheetTitle}>Sắp xếp theo giá</Text>

                <SortOption
                  label="Giá tăng dần"
                  selected={sortType === 'asc'}
                  onPress={() => {
                    setSortType('asc');
                    setSortVisible(false);
                  }}
                />
                <SortOption
                  label="Giá giảm dần"
                  selected={sortType === 'desc'}
                  onPress={() => {
                    setSortType('desc');
                    setSortVisible(false);
                  }}
                />
                <SortOption
                  label="Không sắp xếp"
                  selected={sortType === 'none'}
                  onPress={() => {
                    setSortType('none');
                    setSortVisible(false);
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const FilterOption = ({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.filterOption} onPress={onToggle}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Text style={styles.checkboxTick}>✓</Text>}
      </View>
      <Text style={styles.filterLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const SortOption = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.sortOption} onPress={onPress}>
      <View style={[styles.radioOuter, selected && styles.radioSelectedOuter]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.sortLabel, selected && styles.sortLabelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9fafc'},

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 28,
    color: '#3b82f6',
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#eef2f7',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 22,
    elevation: 2,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 190,
  },
  cardBody: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    paddingRight: 8,
  },
  ratingBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#f59e0b', // màu vàng
    fontWeight: '600',
  },
  review: {
    marginTop: 6,
    fontSize: 13,
    color: '#555',
  },
  address: {
    marginTop: 6,
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  originalPrice: {
    color: '#999',
    fontSize: 13,
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  price: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 18,
  },
  taxNote: {
    marginTop: 4,
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0f2fe',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 8,
  },
  tagText: {
    color: '#0369a1',
    fontSize: 12,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
    color: '#111',
  },

  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxTick: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
  },

  applyButton: {
    marginTop: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 28,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  radioSelectedOuter: {
    borderColor: '#3b82f6',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
  },
  //mới

  sortLabel: {
    fontSize: 16,
    color: '#444',
  },
  sortLabelSelected: {
    color: '#3b82f6',
    fontWeight: '700',
  },
});
