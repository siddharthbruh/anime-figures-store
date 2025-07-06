import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
      // Set token in API service
      apiService.setAuthToken(token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.auth.login({ email, password });
      const { token, user: userData } = response.data.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set token in API service
      apiService.setAuthToken(token);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success(`Welcome back, ${userData.firstName}!`, {
        icon: '👋',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });
      
      return { success: true };
    } catch (error) {
      const message = error.message || 'Login failed';
      toast.error(message, {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await apiService.auth.signup(userData);
      const { token, user: newUser } = response.data.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Set token in API service
      apiService.setAuthToken(token);
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      toast.success(`Welcome to Anime Figures Store, ${newUser.firstName}!`, {
        icon: '🎉',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });
      
      return { success: true };
    } catch (error) {
      const message = error.message || 'Signup failed';
      toast.error(message, {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear API token
    apiService.clearAuthToken();
    
    setUser(null);
    setIsAuthenticated(false);
    
    toast.success('Logged out successfully', {
      icon: '👋',
      style: {
        borderRadius: '12px',
        background: 'var(--surface-primary)',
        color: 'var(--gray-900)',
        border: '1px solid var(--gray-200)',
        boxShadow: 'var(--shadow-lg)'
      }
    });
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiService.auth.updateProfile(profileData);
      const updatedUser = response.data.data;
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profile updated successfully', {
        icon: '✅',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });
      
      return { success: true };
    } catch (error) {
      const message = error.message || 'Profile update failed';
      toast.error(message, {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
