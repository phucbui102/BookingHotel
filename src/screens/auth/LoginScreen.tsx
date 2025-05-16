// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
// } from 'react-native';
// import { getApp } from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';
// import { LoginScreenProps } from '../../navigations/types';
// import { useAuth } from '../../context/AuthContext';

// const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { setIsLoggedIn, setUser } = useAuth();

//   const handleLogin = async () => {
//     try {
//       // Sử dụng getApp() thay vì auth() trực tiếp
//       const app = getApp();
//       await auth(app).signInWithEmailAndPassword(email, password);
//       Alert.alert('Đăng nhập thành công', `Xin chào ${email}`);
//       setIsLoggedIn(true);
//     } catch (error: any) {
//       Alert.alert('Lỗi đăng nhập', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Đăng nhập vào tài khoản</Text>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           placeholder="Nhập email"
//           value={email}
//           onChangeText={setEmail}
//           style={styles.input}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Mật khẩu</Text>
//         <TextInput
//           placeholder="Nhập mật khẩu"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//           style={styles.input}
//         />
//       </View>

//       <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//         <Text style={styles.loginButtonText}>Đăng nhập</Text>
//       </TouchableOpacity>

//       <Text style={styles.orText}>Hoặc tiếp tục với</Text>

//       <View style={styles.socialContainer}>
//         <TouchableOpacity style={styles.socialButton}>
//           <Image
//             source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
//             style={styles.socialIcon}
//           />
//           <Text style={styles.socialText}>Google</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.socialButton, styles.fbButton]}>
//           <Image
//             source={{
//               uri: 'https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png',
//             }}
//             style={styles.socialIcon}
//           />
//           <Text style={[styles.socialText, { color: '#fff' }]}>Facebook</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//         <Text style={styles.registerText}>
//           Bạn chưa có tài khoản?{' '}
//           <Text style={styles.registerLink}>Đăng ký ngay</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     backgroundColor: '#f9f9f9',
//     justifyContent: 'center',
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: '700',
//     marginBottom: 32,
//     textAlign: 'center',
//     color: '#333',
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     marginBottom: 6,
//     fontSize: 14,
//     color: '#555',
//     fontWeight: '500',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//   },
//   loginButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   loginButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   orText: {
//     textAlign: 'center',
//     color: '#888',
//     marginVertical: 20,
//     fontSize: 14,
//   },
//   socialContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 30,
//   },
//   socialButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     minWidth: '42%',
//     justifyContent: 'center',
//   },
//   fbButton: {
//     backgroundColor: '#3b5998',
//     borderColor: '#3b5998',
//   },
//   socialIcon: {
//     width: 22,
//     height: 22,
//     marginRight: 8,
//   },
//   socialText: {
//     fontSize: 15,
//     color: '#333',
//     fontWeight: '500',
//   },
//   registerText: {
//     textAlign: 'center',
//     color: '#666',
//     fontSize: 14,
//   },
//   registerLink: {
//     color: '#007bff',
//     fontWeight: '600',
//   },
// });

// export default LoginScreen;

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {getApp} from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {LoginScreenProps} from '../../navigations/types';
import {useAuth} from '../../context/AuthContext';

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setIsLoggedIn, setUser} = useAuth();

  const handleLogin = async () => {
    try {
      // Sử dụng getApp() thay vì auth() trực tiếp
      const app = getApp();
      await auth(app).signInWithEmailAndPassword(email, password);
      Alert.alert('Đăng nhập thành công', `Xin chào ${email}`);
      setIsLoggedIn(true);
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đăng nhập vào tài khoản</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Nhập email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Hoặc tiếp tục với</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={{uri: 'https://img.icons8.com/color/48/google-logo.png'}}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, styles.fbButton]}>
          <Image
            source={{
              uri: 'https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png',
            }}
            style={styles.socialIcon}
          />
          <Text style={[styles.socialText, {color: '#fff'}]}>Facebook</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Bạn chưa có tài khoản?{' '}
          <Text style={styles.registerLink}>Đăng ký ngay</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
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
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: '42%',
    justifyContent: 'center',
  },
  fbButton: {
    backgroundColor: '#3b5998',
    borderColor: '#3b5998',
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  socialText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  registerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#007bff',
    fontWeight: '600',
  },
});

export default LoginScreen;
