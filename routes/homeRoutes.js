import express from 'express';
import { getHeroSlides, addHeroSlide, editHeroSlide, deleteHeroSlide, reorderHeroSlides } from '../controllers/homeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'add') return requireAuth(['Super Admin', 'Admin'])(req, res, () => addHeroSlide(req, res));
      if (action === 'edit') return requireAuth(['Super Admin', 'Admin'])(req, res, () => editHeroSlide(req, res));
      if (action === 'delete') return requireAuth(['Super Admin', 'Admin'])(req, res, () => deleteHeroSlide(req, res));
      if (action === 'reorder') return requireAuth(['Super Admin', 'Admin'])(req, res, () => reorderHeroSlides(req, res));
    }
  }
  next();
});

router.get('/', getHeroSlides);
router.post('/add', requireAuth(['Super Admin', 'Admin']), addHeroSlide);
router.post('/edit', requireAuth(['Super Admin', 'Admin']), editHeroSlide);
router.post('/delete', requireAuth(['Super Admin', 'Admin']), deleteHeroSlide);
router.post('/reorder', requireAuth(['Super Admin', 'Admin']), reorderHeroSlides);

export default router;
