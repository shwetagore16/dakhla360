import { Response } from 'express';
import Review from '../models/Review';
import Asset from '../models/Asset';

const calculateTrustScore = async (assetId: string): Promise<number> => {
  const reviews = await Review.find({ asset: assetId });
  if (reviews.length === 0) return 0;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingPoints = (avg / 5) * 40;
  const countPoints = Math.min(reviews.length / 10, 1) * 20;
  const score = Math.round(ratingPoints + countPoints);
  return Math.min(score, 100);
};

const createReview = async (req: any, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const { rating, title, body, tags } = req.body;

    const asset = await Asset.findOne({ assetId });
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }

    const existing = await Review.findOne({ asset: asset._id, reviewer: req.user.id });
    if (existing) {
      res.status(400).json({ success: false, message: 'You already reviewed this asset' });
      return;
    }

    const review = await Review.create({
      asset: asset._id,
      reviewer: req.user.id,
      rating,
      title,
      body,
      tags: tags || [],
    });

    const newScore = await calculateTrustScore(String(asset._id));
    await Asset.findByIdAndUpdate(asset._id, { trustScore: newScore });

    const populated = await Review.findById(review._id).populate('reviewer', 'name avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAssetReviews = async (req: any, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const asset = await Asset.findOne({ assetId });
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }
    const reviews = await Review.find({ asset: asset._id })
      .populate('reviewer', 'name avatar reputation')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const voteReview = async (req: any, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    const upIdx = review.upvotes.findIndex((id) => id.toString() === userId);
    const downIdx = review.downvotes.findIndex((id) => id.toString() === userId);

    if (type === 'up') {
      if (upIdx > -1) {
        review.upvotes.splice(upIdx, 1);
      } else {
        review.upvotes.push(userId);
        if (downIdx > -1) review.downvotes.splice(downIdx, 1);
      }
    } else {
      if (downIdx > -1) {
        review.downvotes.splice(downIdx, 1);
      } else {
        review.downvotes.push(userId);
        if (upIdx > -1) review.upvotes.splice(upIdx, 1);
      }
    }

    await review.save();
    res.json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getAssetReviews, voteReview };
export { createReview, getAssetReviews, voteReview };