import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, getConversations } from '../../api/userApi';
import { getMessages, sendMessage, deleteMessage, editMessage } from '../../api/messageApi';

// Async thunk for fetching users (all users)
export const fetchUsers = createAsyncThunk(
  'chat/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const data = await getAllUsers();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to fetch users' });
    }
  }
);

// Async thunk for fetching conversations (users with latest messages, sorted)
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, thunkAPI) => {
    try {
      const data = await getConversations();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to fetch conversations' });
    }
  }
);

// Async thunk for fetching messages
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (userId, thunkAPI) => {
    try {
      const data = await getMessages(userId);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to fetch messages' });
    }
  }
);

// Async thunk for sending message
export const sendMessageThunk = createAsyncThunk(
  'chat/sendMessage',
  async ({ userId, message }, thunkAPI) => {
    try {
      const data = await sendMessage(userId, message);
      return { data, userId }; // Return both message data and userId
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to send message' });
    }
  }
);

// Async thunk for deleting message
export const deleteMessageThunk = createAsyncThunk(
  'chat/deleteMessage',
  async (messageId, thunkAPI) => {
    try {
      await deleteMessage(messageId);
      return messageId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to delete message' });
    }
  }
);

// Async thunk for editing message
export const editMessageThunk = createAsyncThunk(
  'chat/editMessage',
  async ({ messageId, message }, thunkAPI) => {
    try {
      const data = await editMessage(messageId, message);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to edit message' });
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    users: [],
    conversations: [],
    selectedUser: null,
    messages: [],
    loading: false,
    sendingMessage: false,
    error: null,
  },
  reducers: {
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = []; // Clear messages when selecting new user
      state.error = null; // Clear any errors
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      })
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch conversations';
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch messages';
      })
      // Send Message
      .addCase(sendMessageThunk.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.sendingMessage = false;
        state.messages.push(action.payload.data);
        
        // Update conversations list - move this conversation to top
        const userId = action.payload.userId;
        const conversationIndex = state.conversations.findIndex(
          conv => conv.user._id === userId
        );
        
        if (conversationIndex !== -1) {
          const conversation = state.conversations[conversationIndex];
          conversation.latestMessage = {
            message: action.payload.data.message,
            createdAt: action.payload.data.createdAt,
            senderId: action.payload.data.senderId
          };
          conversation.updatedAt = new Date().toISOString();
          
          // Move to top
          state.conversations.splice(conversationIndex, 1);
          state.conversations.unshift(conversation);
        }
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload?.message || 'Failed to send message';
      })
      // Delete Message - don't set loading/error as it's handled by toast in UI
      .addCase(deleteMessageThunk.fulfilled, (state, action) => {
        state.messages = state.messages.filter(msg => msg._id !== action.payload);
      })
      // Edit Message - don't set loading/error as it's handled by toast in UI
      .addCase(editMessageThunk.fulfilled, (state, action) => {
        const index = state.messages.findIndex(msg => msg._id === action.payload._id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      });
  },
});

export const { selectUser, clearMessages, addMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;
