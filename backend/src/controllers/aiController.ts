import { Request, Response } from 'express';
import Asset from '../models/Asset';
import Review from '../models/Review';
import IssueReport from '../models/IssueReport';
import { generateAssetSummary, explainTrustScore, detectFraud } from '../services/aiService';

const getAssetSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const asset = await Asset.findOne({ assetId }).populate('owner', 'name');
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }
    const reviews = await Review.find({ asset: asset._id });
    const summary = await generateAssetSummary(asset, reviews);
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getScoreExplanation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const asset = await Asset.findOne({ assetId });
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }
    const reviews = await Review.find({ asset: asset._id });
    const explanation = await explainTrustScore(asset, reviews);
    res.json({ success: true, data: explanation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFraudAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const asset = await Asset.findOne({ assetId });
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }
    const [reviews, issues] = await Promise.all([
      Review.find({ asset: asset._id }),
      IssueReport.find({ asset: asset._id }),
    ]);
    const analysis = await detectFraud(asset, reviews, issues);
    res.json({ success: true, data: analysis });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAssetSummary, getScoreExplanation, getFraudAnalysis };
export { getAssetSummary, getScoreExplanation, getFraudAnalysis };