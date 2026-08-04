import express from 'express';
import {
  getHistoryEvents,
  addHistoryEvent,
  updateHistoryEvent,
  deleteHistoryEvent
} from '../controllers/historyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/history - Public fetch
router.get('/', getHistoryEvents);

// POST /api/history - Action dispatch or standard creation
router.post('/', (req, res, next) => {
  const action = req.query.action;
  if (action === 'add' || action === 'add_timeline') {
    return requireAuth(req, res, () => addHistoryEvent(req, res));
  } else if (action === 'edit' || action === 'edit_timeline') {
    return requireAuth(req, res, () => updateHistoryEvent(req, res));
  } else if (action === 'delete' || action === 'delete_timeline') {
    return requireAuth(req, res, () => deleteHistoryEvent(req, res));
  }
  return requireAuth(req, res, () => addHistoryEvent(req, res));
});

// Standard REST verbs
router.put('/:id', requireAuth, updateHistoryEvent);
router.delete('/:id', requireAuth, deleteHistoryEvent);

export default router;
