import express from 'express';
import { getGallery, addGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'add') return requireAuth()(req, res, () => addGalleryItem(req, res));
      if (action === 'delete') return requireAuth()(req, res, () => deleteGalleryItem(req, res));
    }
  }
  next();
});

router.get('/', getGallery);
router.post('/add', requireAuth(), addGalleryItem);
router.post('/delete', requireAuth(), deleteGalleryItem);
router.delete('/:id', requireAuth(), deleteGalleryItem);

export default router;
