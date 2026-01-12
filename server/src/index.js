import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Initialize Firebase before routes
import './utils/firebase.js';

import authRoutes from './routes/auth.js';
import analyzeRoutes from './routes/analyze.js';

// Load env: prefer server/.env, then fallback to project root .env
import fs from 'fs';
const serverEnv = path.resolve(process.cwd(), '.env');
const rootEnv = path.resolve(process.cwd(), '..', '.env');
if (fs.existsSync(serverEnv)) {
  dotenv.config({ path: serverEnv });
}
if (!process.env.GOOGLE_API_KEY && fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}

// Log environment variable status
console.log('=== Environment Variables Check ===');
console.log('GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✓ SET' : '✗ MISSING');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ SET' : '✗ MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('===================================');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration for development and production
const isProd = process.env.NODE_ENV === 'production';
const allowedOrigins = isProd 
  ? [
      process.env.FRONTEND_URL || 'https://careerlens-frontend.onrender.com',
      'http://localhost:5173',
      'http://localhost:5174'
    ]
  : true; // Allow all origins in development

app.use(cors({
  origin: allowedOrigins,
  credentials: false
}));

// Add security headers for Google Identity Services
app.use((req, res, next) => {
  // CORP header: Allow cross-origin requests to this resource
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use(express.json({ limit: '2mb' }));
app.set('views', path.resolve(process.cwd(), 'views'));
app.set('view engine', 'ejs');

// Serve uploaded files
const uploadsDir = path.resolve(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => res.json({ ok: true, status: 'healthy' }));
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);

// Simple landing page rendered with EJS (keeps React app intact)
app.get('/landing', (req, res) => {
  return res.render('landing');
});

// Serve React build in production
const clientDist = path.resolve(process.cwd(), '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // Fallback to index.html for non-API routes
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
