import express from 'express';
import { getSettings, updateSettings, updateSeo } from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'seo') return requireAuth(['Super Admin', 'Admin'])(req, res, () => updateSeo(req, res));
    }
  }
  next();
});

router.get('/', getSettings);
router.post('/seo', requireAuth(['Super Admin', 'Admin']), updateSeo);
router.post('/', requireAuth(['Super Admin', 'Admin']), updateSettings);

export default router;
