import { Router } from 'express';
const router = Router();
const { getAssetSummary, getScoreExplanation, getFraudAnalysis } = require('../controllers/aiController');

router.get('/summary/:assetId', getAssetSummary);
router.get('/explain/:assetId', getScoreExplanation);
router.get('/fraud/:assetId', getFraudAnalysis);

module.exports = router;
export default router;