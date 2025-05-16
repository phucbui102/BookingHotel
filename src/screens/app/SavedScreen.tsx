import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Định nghĩa kiểu dữ liệu cho props nếu có, ở đây không có props nên dùng React.FC
const SavedScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trang Chủ</Text>
      {/* Nội dung khác của màn hình Trang Chủ */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SavedScreen;