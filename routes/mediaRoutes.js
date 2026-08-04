import express from 'express';
import { listMedia, createFolder, deleteMediaItem, handleFileUpload } from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'GET') {
      if (action === 'list') return requireAuth(['Super Admin', 'Admin', 'Editor'])(req, res, () => listMedia(req, res));
    } else if (req.method === 'POST') {
      if (action === 'create_folder') return requireAuth(['Super Admin', 'Admin', 'Editor'])(req, res, () => createFolder(req, res));
      if (action === 'delete') return requireAuth(['Super Admin', 'Admin', 'Editor'])(req, res, () => deleteMediaItem(req, res));
      if (action === 'upload') return requireAuth(['Super Admin', 'Admin', 'Editor'])(req, res, () => upload.single('file')(req, res, () => handleFileUpload(req, res)));
    }
  }
  next();
});

router.get('/list', requireAuth(['Super Admin', 'Admin', 'Editor']), listMedia);
router.post('/create-folder', requireAuth(['Super Admin', 'Admin', 'Editor']), createFolder);
router.post('/delete', requireAuth(['Super Admin', 'Admin', 'Editor']), deleteMediaItem);
router.post('/upload', requireAuth(['Super Admin', 'Admin', 'Editor']), upload.single('file'), handleFileUpload);

export default router;
