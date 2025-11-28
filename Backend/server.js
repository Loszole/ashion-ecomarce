// Entry point for the backend server
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import categoryRoutes from './routes/categories.js';
import homepageRoutes from './routes/homepage.js';
import auditLogRoutes from './routes/auditLogs.js';

dotenv.config();

const app = express();
app.use(cors());

// Serve uploads statically
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecomdb';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
// Category routes
app.use('/api/categories', categoryRoutes);
// Homepage layout routes
app.use('/api/homepage', homepageRoutes);
// Audit log routes
app.use('/api/audit-logs', auditLogRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
