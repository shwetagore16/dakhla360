import { Router } from 'express';
const router = Router({ mergeParams: true });
const { createIssue, getAssetIssues } = require('../controllers/issueController');
const { protect } = require('../middleware/auth');

router.get('/', getAssetIssues);
router.post('/', protect, createIssue);

module.exports = router;
export default router;