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
app.use(express.json({ limit: '2mb' }));
app.set('views', path.resolve(process.cwd(), 'views'));
app.set('view engine', 'ejs');

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
