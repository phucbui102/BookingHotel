import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

// Define type for province data
interface Province {
  code: number;
  name: string;
}

const ProvinceSearchScreen: React.FC = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [filtered, setFiltered] = useState<Province[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch province data on component mount
    const fetchProvinces = async () => {
      try {
        const res = await axios.get('https://provinces.open-api.vn/api/p/');
        setProvinces(res.data);
        setFiltered(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError('Failed to load provinces. Please try again later.');
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Handle search with partial matching
  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length >= 1) {
      // Allow search after 1 character
      const filteredData = provinces.filter(
        item => item.name.toLowerCase().includes(text.toLowerCase()), // Search based on partial match
      );
      setFiltered(filteredData);
    } else {
      setFiltered(provinces);
    }
  };

  const renderItem = ({item}: {item: Province}) => (
    <TouchableOpacity style={styles.item}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tìm kiếm Tỉnh/Thành</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên tỉnh/thành..."
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.code.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.noResult}>Không tìm thấy</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 15},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noResult: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
});

export default ProvinceSearchScreen;
