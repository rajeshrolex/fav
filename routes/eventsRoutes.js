import express from 'express';
import { getEvents, getRegistrations, registerForEvent, addEvent, editEvent, deleteEvent } from '../controllers/eventsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Legacy query action router middleware
router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'GET') {
      if (action === 'registrations') return requireAuth()(req, res, () => getRegistrations(req, res));
    } else if (req.method === 'POST') {
      if (action === 'register') return registerForEvent(req, res);
      if (action === 'add') return requireAuth()(req, res, () => addEvent(req, res));
      if (action === 'edit') return requireAuth()(req, res, () => editEvent(req, res));
      if (action === 'delete') return requireAuth()(req, res, () => deleteEvent(req, res));
    }
  }
  next();
});

router.get('/', getEvents);
router.get('/registrations', requireAuth(), getRegistrations);
router.get('/:id', getEvents);

router.post('/register', registerForEvent);
router.post('/add', requireAuth(), addEvent);
router.post('/edit', requireAuth(), editEvent);
router.post('/delete', requireAuth(), deleteEvent);
router.delete('/:id', requireAuth(), deleteEvent);

export default router;
