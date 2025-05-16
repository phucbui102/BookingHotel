// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu người dùng
interface UserInfo {
  username: string;
  email: string;
  // Bạn có thể thêm các trường khác cho người dùng nếu cần
}

interface AuthContextType {
  isLoggedIn: boolean;  // Trạng thái đăng nhập (true nếu đã đăng nhập)
  setIsLoggedIn: (value: boolean) => void;  // Hàm để thay đổi trạng thái đăng nhập
  user: UserInfo | null;  // Thông tin người dùng, nếu có
  setUser: (user: UserInfo | null) => void;  // Hàm để thay đổi thông tin người dùng
}

// Tạo Context để cung cấp trạng thái đăng nhập và thông tin người dùng cho toàn bộ ứng dụng
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Định nghĩa kiểu cho props của AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Tạo Provider component để cung cấp dữ liệu AuthContext cho các component con
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Khởi tạo trạng thái đăng nhập và thông tin người dùng (mặc định là chưa đăng nhập)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng AuthContext trong các component con
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Kiểm tra nếu context chưa được khởi tạo
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
