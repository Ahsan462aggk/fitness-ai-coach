'use client';

import { useRouter } from 'next/navigation';
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Defined an interface for better TypeScript support
interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  handleLogin: (userData: { name: string }) => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  
  // FIX: Changed 'let' to 'const' and used lowercase 'router' (convention)
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUserName(parsedUserData.name || '');
      } catch (e) {
        console.error("Failed to parse userData", e);
      }
    }
  }, []);

  const handleLogin = (userData: { name: string }) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUserName(userData.name);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserName('');
    router.push("/login"); // Updated to lowercase
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
