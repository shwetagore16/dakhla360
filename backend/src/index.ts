import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Dakhla360 API is running 🚀' });
});

const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);

const assetRoutes = require('./routes/assets');
app.use('/api/v1/assets', assetRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/api/v1/assets/:assetId/reviews', reviewRoutes);

const issueRoutes = require('./routes/issues');
app.use('/api/v1/assets/:assetId/issues', issueRoutes);

const aiRoutes = require('./routes/ai');
app.use('/api/v1/ai', aiRoutes);

const userRoutes = require('./routes/users');
app.use('/api/v1/users', userRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;