// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import {ProfileStackParamList} from '../../navigations/ProfileStack';
// import {useAuth} from '../../context/AuthContext';

// const ProfileScreen: React.FC = () => {
//   const navigation =
//     useNavigation<StackNavigationProp<ProfileStackParamList>>();
//   const {isLoggedIn, setIsLoggedIn} = useAuth();

//   const [userData, setUserData] = useState<any>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth().currentUser;
//       if (user) {
//         const uid = user.uid;
//         const docSnap = await firestore().collection('users').doc(uid).get();

//         if (docSnap.exists) {
//           const data = docSnap.data();
//           console.log('User data:', data);
//           setUserData(data);
//         } else {
//           console.log('Không tìm thấy dữ liệu người dùng!');
//         }
//       } else {
//         console.log('Chưa đăng nhập');
//       }
//     };

//     if (isLoggedIn) {
//       fetchUserData();
//     }
//   }, [isLoggedIn]);

//   const handleLogout = async () => {
//     try {
//       await auth().signOut();
//       setIsLoggedIn(false);
//     } catch (error) {
//       console.error('Lỗi khi đăng xuất:', error);
//     }
//   };

//   return (
//     <>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Tài khoản</Text>
//         <View style={styles.iconGroup}>
//           <Ionicons name="pricetags-outline" size={24} color="#fff" style={styles.icon} />
//           <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" style={styles.icon} />
//           <Ionicons name="settings-outline" size={24} color="#fff" />
//         </View>
//       </View>

//       <ScrollView style={styles.container}>
//         {isLoggedIn ? (
//           <>
//             {/* User Info Card */}
//             <View style={styles.userCard}>
//               <View style={styles.avatar}>
//                 <Text style={styles.avatarText}>
//                   {userData?.name?.[0]?.toUpperCase() || 'U'}
//                 </Text>
//               </View>
//               <View style={styles.userInfo}>
//                 <Text style={styles.userName}>{userData?.name || 'Người dùng'}</Text>
//                 <Text style={styles.userLoginMethod}>Đăng nhập bằng {userData?.provider || 'Email'}</Text>
//               </View>
//               <TouchableOpacity>
//                 <Ionicons name="pencil" size={20} color="#007bff" />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity style={styles.buttonPrimary}>
//               <Text style={styles.buttonText}>Xem trang cá nhân</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <>
//             <View style={styles.userCard}>
//               <TouchableOpacity
//                 style={styles.buttonPrimary_noLogin}
//                 onPress={() => navigation.navigate('Login')}>
//                 <Text style={styles.buttonText}> Đăng Nhập/Đăng ký</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         )}

//         <Text style={styles.sectionTitle}>Lựa chọn thanh toán của tôi</Text>
//         <Item
//           icon="card-outline"
//           label="Thanh toán"
//           sub="Thêm hoặc quản lý các thẻ đã lưu"
//         />

//         <Text style={styles.sectionTitle}>Phần thưởng của tôi</Text>
//         <Item icon="cash-outline" label="0 Xu" sub="Đổi Xu lấy Mã Ưu đãi, khám phá thêm nhiều cách khác" />
//         <Item icon="flag-outline" label="Nhiệm vụ của tôi" sub="Hoàn thành càng nhiều Nhiệm vụ, kiếm càng nhiều phần thưởng" />
//         <Item icon="ticket-outline" label="Mã giảm giá của tôi" sub="Xem danh sách mã giảm giá" />
//         <Item icon="gift-outline" label="Reward Zone" sub="Xem tiến độ hoặc bắt đầu nhiệm vụ mới" />

//         {isLoggedIn && (
//           <Item
//             icon="log-out-outline"
//             label="Đăng xuất"
//             sub="Thoát khỏi tài khoản"
//             onPress={handleLogout}
//           />
//         )}
//       </ScrollView>
//     </>
//   );
// };

// const Item = ({
//   icon,
//   label,
//   sub,
//   onPress,
// }: {
//   icon: string;
//   label: string;
//   sub: string;
//   onPress?: () => void;
// }) => (
//   <TouchableOpacity style={styles.item} onPress={onPress}>
//     <Ionicons name={icon} size={24} color="#666" style={styles.itemIcon} />
//     <View style={{flex: 1}}>
//       <Text style={styles.itemLabel}>{label}</Text>
//       <Text style={styles.itemSub}>{sub}</Text>
//     </View>
//     <Ionicons name="chevron-forward" size={20} color="#ccc" />
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#f2f2f2'},
//   header: {
//     backgroundColor: '#0d99ff',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 16,
//     alignItems: 'center',
//   },
//   headerText: {fontSize: 20, color: '#fff', fontWeight: 'bold'},
//   iconGroup: {flexDirection: 'row'},
//   icon: {marginHorizontal: 6},
//   userCard: {
//     backgroundColor: '#fff',
//     marginTop: 10,
//     marginHorizontal: 16,
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 3,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#ddd',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   avatarText: {fontWeight: 'bold', fontSize: 16},
//   userInfo: {flex: 1},
//   userName: {fontSize: 16, fontWeight: '600'},
//   userLoginMethod: {fontSize: 12, color: '#666'},
//   buttonPrimary: {
//     marginTop: 10,
//     marginHorizontal: 16,
//     backgroundColor: '#0d99ff',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   buttonPrimary_noLogin: {
//     marginTop: 10,
//     marginHorizontal: 16,
//     backgroundColor: '#0d99ff',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//     width: 300,
//   },
//   buttonText: {color: '#fff', fontWeight: 'bold'},
//   sectionTitle: {
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 8,
//     marginHorizontal: 16,
//     fontSize: 14,
//     color: '#555',
//   },
//   item: {
//     backgroundColor: '#fff',
//     padding: 16,
//     marginHorizontal: 16,
//     marginBottom: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   itemIcon: {marginRight: 16},
//   itemLabel: {fontWeight: '500', fontSize: 14},
//   itemSub: {fontSize: 12, color: '#666'},
// });

// export default ProfileScreen;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {ProfileStackParamList} from '../../navigations/ProfileStack';
import {useAuth} from '../../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const {isLoggedIn, setIsLoggedIn} = useAuth();

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth().currentUser;
      if (user) {
        const uid = user.uid;
        const docSnap = await firestore().collection('users').doc(uid).get();

        console.log('User data:', uid);
        if (docSnap.exists()) {
          const data = docSnap.data();

          console.log('User data:', data);
          setUserData(data);
        } else {
          console.log('Không tìm thấy dữ liệu người dùng!');
        }
      } else {
        console.log('Chưa đăng nhập');
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Tài khoản</Text>
        <View style={styles.iconGroup}>
          <Ionicons
            name="pricetags-outline"
            size={24}
            color="#fff"
            style={styles.icon}
          />
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#fff"
            style={styles.icon}
            onPress={() => navigation.navigate('Message', {userData})}
          />
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView style={styles.container}>
        {isLoggedIn ? (
          <>
            {/* User Info Card */}
            <View style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userData?.username?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {userData?.username || 'Người dùng'}
                </Text>
                <Text style={styles.userLoginMethod}>
                  {userData?.email || 'Email'}
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="pencil" size={20} color="#007bff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonPrimary}>
              <Text
                style={styles.buttonText}
                onPress={() =>
                  navigation.navigate('ProfileDetail', {userData})
                }>
                Xem trang cá nhân
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.userCard}>
              <TouchableOpacity
                style={styles.buttonPrimary_noLogin}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}> Đăng Nhập/Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Lựa chọn thanh toán của tôi</Text>
        <Item
          icon="card-outline"
          label="Thanh toán"
          sub="Thêm hoặc quản lý các thẻ đã lưu"
        />

        <Text style={styles.sectionTitle}>Bộ sưu tập</Text>
        <Item
          icon="albums-outline"
          label="Đã lưu"
          sub="Thêm hoặc quản lý các thẻ đã lưu"
          onPress={() => navigation.navigate('library')}
        />

        <Text style={styles.sectionTitle}>Phần thưởng của tôi</Text>
        <Item
          icon="cash-outline"
          label={userData?.point != null ? `${userData.point}0 Xu` : '0 Xu'}
          sub="Đổi Xu lấy Mã Ưu đãi, khám phá thêm nhiều cách khác"
        />
        <Item
          icon="flag-outline"
          label="Nhiệm vụ của tôi"
          sub="Hoàn thành càng nhiều Nhiệm vụ, kiếm càng nhiều phần thưởng"
        />
        <Item
          icon="ticket-outline"
          label="Mã giảm giá của tôi"
          sub="Xem danh sách mã giảm giá"
        />
        <Item
          icon="gift-outline"
          label="Reward Zone"
          sub="Xem tiến độ hoặc bắt đầu nhiệm vụ mới"
        />

        <Text style={styles.sectionTitle}>Phần thưởng của tôi</Text>
        <Item
          icon="cash-outline"
          label={userData?.point != null ? `${userData.point}0 Xu` : '0 Xu'}
          sub="Đổi Xu lấy Mã Ưu đãi, khám phá thêm nhiều cách khác"
        />
        <Item
          icon="flag-outline"
          label="Nhiệm vụ của tôi"
          sub="Hoàn thành càng nhiều Nhiệm vụ, kiếm càng nhiều phần thưởng"
        />
        <Text style={styles.sectionTitle}></Text>
        {isLoggedIn && (
          <Item
            icon="log-out-outline"
            label="Đăng xuất"
            sub="Thoát khỏi tài khoản"
            onPress={handleLogout}
          />
        )}
      </ScrollView>
    </>
  );
};

const Item = ({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: string;
  label: string;
  sub: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#666" style={styles.itemIcon} />
    <View style={{flex: 1}}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemSub}>{sub}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f2f2f2'},
  header: {
    backgroundColor: '#0d99ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {fontSize: 20, color: '#fff', fontWeight: 'bold'},
  iconGroup: {flexDirection: 'row'},
  icon: {marginHorizontal: 6},
  userCard: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {fontWeight: 'bold', fontSize: 16},
  userInfo: {flex: 1},
  userName: {fontSize: 16, fontWeight: '600'},
  userLoginMethod: {fontSize: 12, color: '#666'},
  buttonPrimary: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: '#0d99ff',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonPrimary_noLogin: {
    marginTop: 10,
    marginHorizontal: 16,
    backgroundColor: '#0d99ff',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    width: 300,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 16,
    fontSize: 14,
    color: '#555',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {marginRight: 16},
  itemLabel: {fontWeight: '500', fontSize: 14},
  itemSub: {fontSize: 12, color: '#666'},
});

export default ProfileScreen;
