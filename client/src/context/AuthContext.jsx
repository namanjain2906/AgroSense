import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { axiosPublic } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On Initial Load (Mount): Silent refresh using cookie
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Silent request to /api/auth/refresh
        const response = await axiosPublic.get('/api/auth/refresh', {
          withCredentials: true,
        });
        
        const newAccessToken = response.data.accessToken;
        
        // 2. Temporarily set token in local storage so `api` interceptor can use it
        localStorage.setItem('token', newAccessToken);
        setToken(newAccessToken);

        // 3. Fetch latest user data
        const userRes = await api.get('/api/auth/get-me');
        const userData = userRes.data.user;
        
        // 4. Update state
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        // If silent refresh fails (no cookie, expired, etc.), fall back to existing localStorage
        console.log("Silent refresh failed, checking local storage fallback...");
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // Use axiosPublic to avoid trigger interceptor on 401
      const response = await axiosPublic.post('/api/auth/login', credentials);
      const { accessToken, user: userData } = response.data;
      
      // Synchronously save to localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setToken(accessToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axiosPublic.post('/api/auth/register', userData);
      const { accessToken, user: newUser } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(accessToken);
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      // Call backend to clear the httpOnly cookie
      await axiosPublic.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state and storage
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
