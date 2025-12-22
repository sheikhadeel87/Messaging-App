import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, getConversations } from '../../api/userApi';
import { getMessages, sendMessage } from '../../api/messageApi';

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
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
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
      });
  },
});

export const { selectUser, clearMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
