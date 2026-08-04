import express from 'express';
import { getNews, createNews, editNews, deleteNews } from '../controllers/newsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'create') return requireAuth()(req, res, () => createNews(req, res));
      if (action === 'edit') return requireAuth()(req, res, () => editNews(req, res));
      if (action === 'delete') return requireAuth()(req, res, () => deleteNews(req, res));
    }
  }
  next();
});

router.get('/', getNews);
router.get('/:slug', getNews);
router.post('/create', requireAuth(), createNews);
router.post('/edit', requireAuth(), editNews);
router.post('/delete', requireAuth(), deleteNews);
router.delete('/:id', requireAuth(), deleteNews);

export default router;
