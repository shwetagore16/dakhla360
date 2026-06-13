import { Router } from 'express';
const router = Router({ mergeParams: true });
const { createReview, getAssetReviews, voteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/', getAssetReviews);
router.post('/', protect, createReview);
router.put('/:reviewId/vote', protect, voteReview);

module.exports = router;
export default router;