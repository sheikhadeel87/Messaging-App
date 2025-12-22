// src/api/userApi.js
import API from './axios';

// Get all users
export const getAllUsers = async () => {
  const response = await API.get('/users');
  return response.data;
};

// Get conversations (users with latest messages)
export const getConversations = async () => {
  const response = await API.get('/conversations');
  return response.data;
};

// Create or get conversation
export const createOrGetConversation = async (userId) => {
  const response = await API.post('/conversations', { userId });
  return response.data;
};
