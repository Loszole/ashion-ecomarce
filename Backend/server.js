// Entry point for the backend server
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import categoryRoutes from './routes/categories.js';
import homepageRoutes from './routes/homepage.js';
import auditLogRoutes from './routes/auditLogs.js';
import settingsRoutes from './routes/settings.js';
import blogRoutes from './routes/blog.js';
import adminRoutes from './routes/admin.js';
import usersRoutes from './routes/users.js';
import reviewsRoutes from './routes/reviews.js';
import discountsRoutes from './routes/discounts.js';
import contentRoutes from './routes/content.js';
import reportsRoutes from './routes/reports.js';
import messagesRoutes from './routes/messages.js';
import appearanceRoutes from './routes/appearance.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
// NOTE: express-mongo-sanitize has compatibility issues with Express 5
// Using Zod input validation instead for NoSQL injection prevention
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically
const uploadsDir = join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecomdb';

if (!process.env.JWT_SECRET) {
  console.error('Missing required environment variable: JWT_SECRET');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('E-Commerce Backend API');
});


// Auth routes
app.use('/api/auth', authRoutes);
// Product routes
app.use('/api/products', productRoutes);
// Order routes
app.use('/api/orders', orderRoutes);
// Cart routes
app.use('/api/cart', cartRoutes);
// Category routes
app.use('/api/categories', categoryRoutes);
// Homepage layout routes
app.use('/api/homepage', homepageRoutes);
// Audit log routes
app.use('/api/audit-logs', auditLogRoutes);
// Settings routes
app.use('/api/settings', settingsRoutes);
// Blog routes
app.use('/api/blog', blogRoutes);
// Admin routes
app.use('/api/admin', adminRoutes);
// Users routes
app.use('/api/users', usersRoutes);
// Reviews routes
app.use('/api/reviews', reviewsRoutes);
// Discounts routes
app.use('/api/discounts', discountsRoutes);
// Content routes
app.use('/api/content', contentRoutes);
// Reports routes
app.use('/api/reports', reportsRoutes);
// Messages routes
app.use('/api/messages', messagesRoutes);
// Appearance routes
app.use('/api/appearance', appearanceRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
