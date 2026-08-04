import express from 'express';
import { getCommittee, addCommitteeMember, editCommitteeMember, deleteCommitteeMember } from '../controllers/committeeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use((req, res, next) => {
  const action = req.query.action;
  if (action) {
    if (req.method === 'POST') {
      if (action === 'add') return requireAuth()(req, res, () => addCommitteeMember(req, res));
      if (action === 'edit') return requireAuth()(req, res, () => editCommitteeMember(req, res));
      if (action === 'delete') return requireAuth()(req, res, () => deleteCommitteeMember(req, res));
    }
  }
  next();
});

router.get('/', getCommittee);
router.post('/add', requireAuth(), addCommitteeMember);
router.post('/edit', requireAuth(), editCommitteeMember);
router.post('/delete', requireAuth(), deleteCommitteeMember);
router.delete('/:id', requireAuth(), deleteCommitteeMember);

export default router;
