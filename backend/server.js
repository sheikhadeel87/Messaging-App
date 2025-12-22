import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './db/dbUtils.js';

import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';

const app = express();
const PORT = process.env.PORT || 5002;

dotenv.config();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser()); // Add this line
app.use(cors({
  origin:[ 'http://localhost:3000','http://localhost:3001','http://localhost:5173'],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.use('/api/auth', authRoutes); 
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
