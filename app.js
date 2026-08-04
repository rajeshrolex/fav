import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import sponsorsRoutes from './routes/sponsorsRoutes.js';
import committeeRoutes from './routes/committeeRoutes.js';
import volunteersRoutes from './routes/volunteersRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory (accessible via /uploads and /api/uploads)
const uploadsPath = path.resolve('uploads');
app.use('/uploads', express.static(uploadsPath));
app.use('/api/uploads', express.static(uploadsPath));

// Route Mounts (supporting both REST paths and legacy .php extensions)
const routePairs = [
  ['/api/auth', authRoutes],
  ['/api/auth.php', authRoutes],
  ['/api/events', eventsRoutes],
  ['/api/events.php', eventsRoutes],
  ['/api/gallery', galleryRoutes],
  ['/api/gallery.php', galleryRoutes],
  ['/api/sponsors', sponsorsRoutes],
  ['/api/sponsors.php', sponsorsRoutes],
  ['/api/committee', committeeRoutes],
  ['/api/committee.php', committeeRoutes],
  ['/api/volunteers', volunteersRoutes],
  ['/api/volunteers.php', volunteersRoutes],
  ['/api/contact', contactRoutes],
  ['/api/contact.php', contactRoutes],
  ['/api/news', newsRoutes],
  ['/api/news.php', newsRoutes],
  ['/api/settings', settingsRoutes],
  ['/api/settings.php', settingsRoutes],
  ['/api/dashboard', dashboardRoutes],
  ['/api/dashboard.php', dashboardRoutes],
  ['/api/about', aboutRoutes],
  ['/api/about.php', aboutRoutes],
  ['/api/home', homeRoutes],
  ['/api/home.php', homeRoutes],
  ['/api/media', mediaRoutes],
  ['/api/media.php', mediaRoutes],
  ['/api/history', historyRoutes],
  ['/api/history.php', historyRoutes]
];

for (const [routePath, routerHandler] of routePairs) {
  app.use(routePath, routerHandler);
}

// Global 404 for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found', data: null });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null
  });
});

export default app;
