// src/api/authApi.js
import API from './axios';

// Register user
export const registerUser = async (userData) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

// Get logged-in user
export const getCurrentUser = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};
