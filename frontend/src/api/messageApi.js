// src/api/messageApi.js
import API from './axios';

// Get messages for a conversation with a specific user
export const getMessages = async (userId) => {
  const response = await API.get(`/messages/${userId}`);
  return response.data;
};

// Send a message to a specific user
export const sendMessage = async (userId, message) => {
  const response = await API.post(`/messages/send/${userId}`, { message });
  return response.data;
};
