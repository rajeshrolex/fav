import app from './app.js';
import { initDb } from './config/db.js';
import path from 'path';
import express from 'express';
import fs from 'fs';

const PORT = process.env.PORT || 5000;
const distPath = path.resolve('dist');

// Serve Vite production build if dist directory exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Initialize Database & Start Server
async function startServer() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
