import { Response } from 'express';
import IssueReport from '../models/IssueReport';
import Asset from '../models/Asset';

const createIssue = async (req: any, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const { type, title, description } = req.body;

    const asset = await Asset.findOne({ assetId });
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }

    const issue = await IssueReport.create({
      asset: asset._id,
      reporter: req.user.id,
      type,
      title,
      description,
    });

    if (type === 'fraud' || type === 'stolen') {
      await Asset.findByIdAndUpdate(asset._id, { status: 'disputed' });
    }

    const populated = await IssueReport.findById(issue._id).populate('reporter', 'name avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAssetIssues = async (req: any, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const asset = await Asset.findOne({ assetId });
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }
    const issues = await IssueReport.find({ asset: asset._id })
      .populate('reporter', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: issues });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createIssue, getAssetIssues };
export { createIssue, getAssetIssues };