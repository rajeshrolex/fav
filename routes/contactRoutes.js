import express from 'express';
import { getContactMessages, submitContactMessage, updateReplyStatus, deleteContactMessage } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'submit') return submitContactMessage(req, res);
      if (action === 'update_status') return requireAuth()(req, res, () => updateReplyStatus(req, res));
      if (action === 'delete') return requireAuth()(req, res, () => deleteContactMessage(req, res));
    }
  }
  next();
});

router.get('/', requireAuth(), getContactMessages);
router.post('/submit', submitContactMessage);
router.post('/update-status', requireAuth(), updateReplyStatus);
router.post('/delete', requireAuth(), deleteContactMessage);
router.delete('/:id', requireAuth(), deleteContactMessage);

export default router;
