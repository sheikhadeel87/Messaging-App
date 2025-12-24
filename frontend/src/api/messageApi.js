// src/api/messageApi.js
import API from './axios';

// Get messages for a conversation with a specific user
export const getMessages = async (userId) => {
  const response = await API.get(`/messages/${userId}`);
  return response.data;
};

// Send a message to a specific user
export const sendMessage = async (userId, messageData) => {
  const response = await API.post(`/messages/send/${userId}`,  messageData );
  return response.data;
};

// Delete a message
export const deleteMessage = async (messageId) => {
  const response = await API.delete(`/messages/${messageId}`);
  return response.data;
};

// Edit a message
export const editMessage = async (messageId, message) => {
  const response = await API.put(`/messages/${messageId}`, { message });
  return response.data;
};
