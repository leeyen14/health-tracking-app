import React, { createContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase-client';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Gửi token đến backend
      const response = await axios.post('/api/auth/google', { idToken });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setAccessToken(null);
    await axios.post('/api/auth/logout');
  };

  // Tự động refresh token
  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        try {
          const response = await axios.post('/api/auth/refresh');
          setAccessToken(response.data.accessToken);
        } catch {
          logout();
        }
      }
    }, 14 * 60 * 1000); // Refresh mỗi 14 phút

    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, accessToken, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;