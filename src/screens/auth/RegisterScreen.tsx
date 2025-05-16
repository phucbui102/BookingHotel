import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {RegisterScreenProps} from '../../navigations/types';

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!username || !email || !password) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      await auth().createUserWithEmailAndPassword(email, password);

      const user = auth().currentUser;
      if (user) {
        await firestore().collection('users').doc(user.uid).set({
          username,
          email,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

        setUser({username, email});
        setIsLoggedIn(true);
        Alert.alert('Thành công', 'Tài khoản đã được tạo. Hãy đăng nhập!');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      console.error('Đăng ký thất bại:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Lỗi', 'Email đã được sử dụng, vui lòng chọn email khác');
      } else {
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tạo tài khoản mới</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên người dùng</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên người dùng"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>Đăng ký</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>
          Đã có tài khoản?{' '}
          <Text style={styles.loginLinkHighlight}>Đăng nhập</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 24,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  loginLinkHighlight: {
    color: '#007bff',
    fontWeight: '600',
  },
});

export default RegisterScreen;
