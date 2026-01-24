import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  is_admin?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<any>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<User>;
  initializeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const isAuthenticated = !!token;
  const isAdmin = !!user?.is_admin;

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/login', credentials);
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  const register = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    try {
      const response = await api.post('/register', data);
      // Don't set token if email is not verified
      if (response.data.email_verified) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const fetchUser = async (): Promise<User> => {
    try {
      const response = await api.get('/user');
      setUser(response.data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  const initializeAuth = () => {
    try {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchUser().catch((error) => {
          console.error('Failed to fetch user:', error);
          // Only logout if token is invalid, not on network errors
          if (error?.response?.status === 401) {
            logout();
          }
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  };

  useEffect(() => {
    try {
      initializeAuth();
    } catch (error) {
      console.error('Error initializing auth in useEffect:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        fetchUser,
        initializeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

