// src/navigations/types.ts
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Định nghĩa kiểu cho Auth Stack
export type AuthStackParamList = {
  Login: undefined; // Màn hình Login không nhận tham số ban đầu
  Register: undefined; // Màn hình Register không nhận tham số ban đầu
  Home: undefined;
  Detail: undefined;
};

// Định nghĩa kiểu cho App Tabs (tương tự RootTabParamList trước đó)
export type AppTabsParamList = {
  HomeTab: undefined; // Hoặc bất kỳ tên route nào bạn dùng cho tab Home
  SavedTab: undefined; // Tên route cho tab Saved
  ProfileTab: undefined; // Tên route cho tab Profile
};

// Nếu có Stack Navigator bên trong các tab (ví dụ: Profile có Stack riêng), định nghĩa ở đây
// export type ProfileStackParamList = { ... };

// Định nghĩa kiểu cho Root Stack Navigator (Navigator cấp cao nhất)
// Root Stack sẽ chứa hoặc AuthStack hoặc AppTabs
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>; // Route 'Auth' trỏ đến AuthStack
  App: NavigatorScreenParams<AppTabsParamList>;   // Route 'App' trỏ đến AppTabs
};
// Các loại Props cho từng màn hình, dùng khi khai báo component
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;
export type HomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Home'>;
export type DetailScreenProps = NativeStackScreenProps<AuthStackParamList, 'Detail'>;

// Ví dụ kiểu Props cho màn hình trong App Tabs (ProfileScreen nằm trong Tab)
export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabsParamList, 'ProfileTab'>, // Props từ Bottom Tab
  NativeStackScreenProps<RootStackParamList> // Props từ Navigator gốc (RootStack)
>;

// Thêm các kiểu props cho các màn hình khác trong App Tabs tương tự
// export type HomeScreenProps = ...
// export type SavedScreenProps = ...