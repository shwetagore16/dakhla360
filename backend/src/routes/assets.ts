import { Router } from 'express';
import multer from 'multer';

const router = Router();

const {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  getUserAssets,
  uploadAssetImages,
  transferAsset,
} = require('../controllers/assetController');

const { protect } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  },
});

router.get('/', getAllAssets);
router.post('/', protect, createAsset);
router.get('/my-assets', protect, getUserAssets);
router.get('/:assetId', getAssetById);
router.put('/:assetId', protect, updateAsset);
router.post('/:assetId/images', protect, upload.array('images', 10), uploadAssetImages);
router.post('/:assetId/transfer', protect, transferAsset);

module.exports = router;
export default router;