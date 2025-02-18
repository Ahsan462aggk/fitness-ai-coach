// AuthContext.tsx
'use client';

import { useRouter } from 'next/navigation';
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  let Router= useRouter()
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!token);
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUserName(parsedUserData.name);
    }
  }, []);

  const handleLogin = (userData) => {
    // localStorage.setItem('token', userData.token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUserName(userData.name);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserName('');
    Router.push("/login")
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
