import { Request, Response } from 'express';
import Asset from '../models/Asset';

const createAsset = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, type, description, location, attributes } = req.body;

    if (!name || !type) {
      res.status(400).json({ success: false, message: 'Name and type are required' });
      return;
    }

    const asset = await Asset.create({
      name,
      type,
      description,
      location,
      attributes,
      owner: req.user.id,
      ownershipHistory: [{ owner: req.user.id, acquiredAt: new Date() }],
    });

    try {
      const { registerAssetOnChain } = require('../services/algorandService');
      const { txHash } = await registerAssetOnChain(
        asset.assetId,
        asset.name,
        asset.type,
        req.user.id
      );
      await Asset.findByIdAndUpdate(asset._id, { algorandTxHash: txHash });
      asset.algorandTxHash = txHash;
      console.log('✅ Blockchain tx:', txHash);
    } catch (err: any) {
      console.error('Blockchain registration failed (non-critical):', err.message);
    }

    res.status(201).json({ success: true, data: asset });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllAssets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, search, page = 1, limit = 12, minTrust, maxTrust } = req.query;

    const query: any = {};

    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { assetId: { $regex: search, $options: 'i' } },
      ];
    }
    if (minTrust || maxTrust) {
      query.trustScore = {};
      if (minTrust) query.trustScore.$gte = Number(minTrust);
      if (maxTrust) query.trustScore.$lte = Number(maxTrust);
    }

    const total = await Asset.countDocuments(query);
    const assets = await Asset.find(query)
      .populate('owner', 'name avatar reputation')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      data: assets,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAssetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const asset = await Asset.findOne({ assetId: req.params.assetId })
      .populate('owner', 'name avatar reputation email')
      .populate('ownershipHistory.owner', 'name avatar')
      .populate('verifiedBy', 'name avatar');

    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }

    res.json({ success: true, data: asset });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAsset = async (req: any, res: Response): Promise<void> => {
  try {
    const asset = await Asset.findOne({ assetId: req.params.assetId });

    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }

    if (asset.owner.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { name, description, location, attributes } = req.body;
    if (name) asset.name = name;
    if (description) asset.description = description;
    if (location) asset.location = location;
    if (attributes) asset.attributes = attributes;

    await asset.save();
    res.json({ success: true, data: asset });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserAssets = async (req: any, res: Response): Promise<void> => {
  try {
    const assets = await Asset.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: assets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadAssetImages = async (req: any, res: Response): Promise<void> => {
  try {
    const asset = await Asset.findOne({ assetId: req.params.assetId });
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }

    if (asset.owner.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Not authorized' });
      return;
    }

    if (!req.files || req.files.length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded' });
      return;
    }

    const { uploadToIPFS } = require('../services/ipfsService');
    const imageHashes: string[] = [];

    for (const file of req.files as Express.Multer.File[]) {
      const hash = await uploadToIPFS(file.buffer, file.originalname, file.mimetype);
      imageHashes.push(hash);
    }

    await Asset.findByIdAndUpdate(asset._id, {
      $push: { images: { $each: imageHashes } },
    });

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: imageHashes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const transferAsset = async (req: any, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const { newOwnerEmail } = req.body;

    const asset = await Asset.findOne({ assetId });
    if (!asset) {
      res.status(404).json({ success: false, message: 'Asset not found' });
      return;
    }

    if (asset.owner.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Only the owner can transfer this asset' });
      return;
    }

    const User = require('../models/User').default;
    const newOwner = await User.findOne({ email: newOwnerEmail });
    if (!newOwner) {
      res.status(404).json({ success: false, message: 'New owner not found. They must be registered on Dakhla360.' });
      return;
    }

    if (newOwner._id.toString() === req.user.id) {
      res.status(400).json({ success: false, message: 'Cannot transfer to yourself' });
      return;
    }

    let txHash = '';
    try {
      const { transferOwnershipOnChain } = require('../services/algorandService');
      const result = await transferOwnershipOnChain(assetId, newOwner._id.toString());
      txHash = result.txHash;
    } catch (err) {
      console.error('Blockchain transfer failed (non-critical):', err);
    }

    const currentHistory = asset.ownershipHistory;
    if (currentHistory.length > 0) {
      currentHistory[currentHistory.length - 1].transferredAt = new Date();
      if (txHash) currentHistory[currentHistory.length - 1].txHash = txHash;
    }

    currentHistory.push({
      owner: newOwner._id,
      acquiredAt: new Date(),
      txHash,
    });

    asset.owner = newOwner._id;
    asset.ownershipHistory = currentHistory;
    asset.status = 'active';
    await asset.save();

    res.json({
      success: true,
      message: 'Asset transferred successfully',
      data: {
        asset,
        txHash,
        newOwner: {
          name: newOwner.name,
          email: newOwner.email,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  getUserAssets,
  uploadAssetImages,
  transferAsset,
};

export {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  getUserAssets,
  uploadAssetImages,
  transferAsset,
};