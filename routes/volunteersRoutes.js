import express from 'express';
import { getVolunteers, applyVolunteer, updateVolunteerStatus, deleteVolunteer } from '../controllers/volunteersController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'apply' || action === 'register') return applyVolunteer(req, res);
      if (action === 'update_status' || action === 'status') return requireAuth()(req, res, () => updateVolunteerStatus(req, res));
      if (action === 'delete') return requireAuth()(req, res, () => deleteVolunteer(req, res));
    }
  }
  next();
});

router.get('/', requireAuth(), getVolunteers);
router.post('/apply', applyVolunteer);
router.post('/update-status', requireAuth(), updateVolunteerStatus);
router.post('/delete', requireAuth(), deleteVolunteer);
router.delete('/:id', requireAuth(), deleteVolunteer);

export default router;
