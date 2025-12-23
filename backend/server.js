import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import connectDB from './db/dbUtils.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import { initializeSocket } from './socket/socketHandler.js';

const app = express();
const PORT = process.env.PORT || 5002;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser()); // Add this line
app.use(cors({
  origin:[ 'http://localhost:3000','http://localhost:3001','http://localhost:5173'],
  credentials: true,
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.use('/api/auth', authRoutes); 
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/users', userRoutes);

// Initialize Socket.IO handlers
initializeSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
