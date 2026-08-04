import express from 'express';
import { getAboutDetails, addTimelineEvent, editTimelineEvent, deleteTimelineEvent, updateAboutDetails } from '../controllers/aboutController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'add_timeline') return requireAuth(['Super Admin', 'Admin'])(req, res, () => addTimelineEvent(req, res));
      if (action === 'edit_timeline') return requireAuth(['Super Admin', 'Admin'])(req, res, () => editTimelineEvent(req, res));
      if (action === 'delete_timeline') return requireAuth(['Super Admin', 'Admin'])(req, res, () => deleteTimelineEvent(req, res));
      if (action === 'update_details') return requireAuth(['Super Admin', 'Admin'])(req, res, () => updateAboutDetails(req, res));
    }
  }
  next();
});

router.get('/', getAboutDetails);
router.post('/add-timeline', requireAuth(['Super Admin', 'Admin']), addTimelineEvent);
router.post('/edit-timeline', requireAuth(['Super Admin', 'Admin']), editTimelineEvent);
router.post('/delete-timeline', requireAuth(['Super Admin', 'Admin']), deleteTimelineEvent);
router.post('/update-details', requireAuth(['Super Admin', 'Admin']), updateAboutDetails);

export default router;
