import express from 'express';
import { login, checkAuth, logout, forgotPassword, resetPassword, changePassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to handle legacy ?action= query requests (from PHP api/auth.php?action=...)
router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'login') return login(req, res);
      if (action === 'forgot-password') return forgotPassword(req, res);
      if (action === 'reset-password') return resetPassword(req, res);
      if (action === 'change-password') return requireAuth()(req, res, () => changePassword(req, res));
    } else if (req.method === 'GET') {
      if (action === 'check') return checkAuth(req, res);
      if (action === 'logout') return logout(req, res);
    }
  }
  next();
});

router.post('/login', login);
router.get('/check', checkAuth);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', requireAuth(), changePassword);

export default router;
