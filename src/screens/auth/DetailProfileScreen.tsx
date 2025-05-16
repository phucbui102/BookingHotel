import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute} from '@react-navigation/native';

const ProfileDetailScreen = () => {
  const route = useRoute();
  const {userData} = route.params as {userData: any};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{uri: userData.linkAvt}} style={styles.avatar} />
        <Text style={styles.name}>{userData.email}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <InfoRow icon="call" label="Số điện thoại" value={userData.email} />
        <InfoRow icon="location" label="Địa chỉ" value={userData.email} />
        <InfoRow icon="calendar" label="Ngày sinh" value={userData.email} />
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.row}>
    <Ionicons name={icon} size={20} color="#333" style={{marginRight: 10}} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
  },
  email: {
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  label: {
    color: '#999',
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default ProfileDetailScreen;
