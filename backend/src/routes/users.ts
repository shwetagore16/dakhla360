import { Router } from 'express';
const router = Router();
const { protect } = require('../middleware/auth');

const getUserProfile = async (req: any, res: any) => {
  try {
    const User = require('../models/User').default;
    const Asset = require('../models/Asset').default;
    const Review = require('../models/Review').default;

    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const assets = await Asset.find({ owner: user._id }).sort({ createdAt: -1 });
    const reviews = await Review.find({ reviewer: user._id })
      .populate('asset', 'name assetId type')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        user,
        assets,
        reviews,
        stats: {
          totalAssets: assets.length,
          totalReviews: reviews.length,
          avgTrustScore: assets.length > 0
            ? Math.round(assets.reduce((s: number, a: any) => s + a.trustScore, 0) / assets.length)
            : 0,
          verifiedAssets: assets.filter((a: any) => a.isVerified).length,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyProfile = async (req: any, res: any) => {
  req.params.userId = req.user.id;
  return getUserProfile(req, res);
};

router.get('/me', protect, getMyProfile);
router.get('/:userId', getUserProfile);

module.exports = router;
export default router;