// src/api/authApi.js
import api from './axios';

export const authApi = {
  // Register new user
  register: (userData) => {
    return api.post('/register', userData);
  },

  // Login user
  login: (credentials) => {
    return api.post('/login', credentials);
  },

  // Get current user profile
  getMe: () => {
    return api.get('/me');
  },

  // Update user profile
  updateProfile: (userData) => {
    return api.put('/update-profile', userData);
  },

  // Logout user
  logout: () => {
    return api.post('/logout');
  },

  // Check if user is authenticated
  checkAuth: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get stored user data
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Store authentication data
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear authentication data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};