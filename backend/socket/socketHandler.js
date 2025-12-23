import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';

export const initializeSocket = (io) => {
  // Authenticate socket connections
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const token = cookies.jwt;
      if (!token) return next(new Error('No token'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Auth failed'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.userId);
    socket.join(socket.userId);

    // Handle sendMessage event
    socket.on('sendMessage', async ({ receiverId, message }) => {
      try {
        const senderId = socket.userId;
        
        let conversation = await Conversation.findOne({
          participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [senderId, receiverId],
          });
        }

        const newMessage = new Message({ senderId, receiverId, message });
        conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(), newMessage.save()]);
        // Send to receiver
        io.to(receiverId).emit('receiveMessage', newMessage);
        // Confirm to sender
        socket.emit('messageSent', newMessage);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.userId);
    });
  });
};

