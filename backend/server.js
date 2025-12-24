import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';
import uploadRoutes from './routes/uploadRoutes.js';

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

// CORS configuration - allows local development and ngrok
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3002',
  'http://localhost:5173',
  /\.vercel\.app$/,      // Allow Vercel deployments
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches regex
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      return allowed.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('🚫 Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Initialize Socket.IO
const io = new Server(server, {
  cors: corsOptions,
});

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// Manual CORS headers (in case cors() middleware is being overridden)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  console.log(`${req.method} ${req.path} from ${origin || 'NO ORIGIN'}`);
  
  // For OPTIONS (preflight), always respond with proper headers
  if (req.method === 'OPTIONS') {
    console.log('🔍 Preflight OPTIONS request detected');
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      return allowed.test(origin);
    });
    
    if (isAllowed && origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
      res.setHeader('Access-Control-Max-Age', '86400'); // Cache for 24 hours
      console.log('✅ Preflight allowed for origin:', origin);
      return res.status(204).end();
    } else {
      console.log('❌ Preflight blocked for origin:', origin);
      return res.status(403).end();
    }
  }
  
  // For actual requests
  const isAllowed = allowedOrigins.some(allowed => {
    if (typeof allowed === 'string') {
      return origin === allowed;
    }
    return allowed.test(origin);
  });
  
  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
    // Prevent caching of CORS preflight responses
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
});

// Removed cors() middleware - using manual CORS headers above instead
// app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello World!!');
});

app.use('/api/auth', authRoutes); 
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Initialize Socket.IO handlers
initializeSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
