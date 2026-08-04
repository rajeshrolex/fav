import express from 'express';
import { getDashboardStats, recordHit } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.query.action === 'hit') {
    return recordHit(req, res);
  }
  return requireAuth()(req, res, () => getDashboardStats(req, res));
});

export default router;
