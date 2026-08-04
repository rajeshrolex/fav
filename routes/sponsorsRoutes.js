import express from 'express';
import { getSponsors, addSponsor, editSponsor, deleteSponsor } from '../controllers/sponsorsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'add') return requireAuth()(req, res, () => addSponsor(req, res));
      if (action === 'edit') return requireAuth()(req, res, () => editSponsor(req, res));
      if (action === 'delete') return requireAuth()(req, res, () => deleteSponsor(req, res));
    }
  }
  next();
});

router.get('/', getSponsors);
router.post('/add', requireAuth(), addSponsor);
router.post('/edit', requireAuth(), editSponsor);
router.post('/delete', requireAuth(), deleteSponsor);
router.delete('/:id', requireAuth(), deleteSponsor);

export default router;
