import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import productRoutes from '../routes/products.js';
import cartRoutes from '../routes/cart.js';
import orderRoutes from '../routes/orders.js';
import { errorHandler, notFound } from '../middleware/errorHandler.js';

import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import RefreshToken from '../models/RefreshToken.js';

dotenv.config({ path: '.env.test' });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_12345';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_jwt_refresh_secret_key_12345';

const app = express();
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

const signAccessToken = (user) => jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

describe('E-Commerce API Integration', () => {
  let adminUser;
  let normalUser;
  let adminToken;
  let userToken;
  let createdProduct;
  let createdOrder;
  let createdCartItemId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom-test');
    }

    const seedTag = Date.now();
    const adminPassword = await bcrypt.hash('AdminPass123!', 10);
    const userPassword = await bcrypt.hash('UserPass123!', 10);

    adminUser = await User.create({
      name: 'Test Admin',
      email: `admin-${seedTag}@example.com`,
      password: adminPassword,
      role: 'admin'
    });

    normalUser = await User.create({
      name: 'Test User',
      email: `user-${seedTag}@example.com`,
      password: userPassword,
      role: 'user'
    });

    adminToken = signAccessToken(adminUser);
    userToken = signAccessToken(normalUser);
  });

  afterAll(async () => {
    const userIds = [adminUser?._id, normalUser?._id].filter(Boolean);

    await Promise.all([
      Cart.deleteMany({ user: { $in: userIds } }),
      Order.deleteMany({ user: { $in: userIds } }),
      AuditLog.deleteMany({ user: { $in: userIds } }),
      RefreshToken.deleteMany({ userId: { $in: userIds } }),
      Product.deleteMany({ _id: createdProduct?._id }),
      User.deleteMany({ _id: { $in: userIds } })
    ]);

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('Products', () => {
    it('creates a product as admin', async () => {
      const productPayload = {
        name: `Integration Product ${Date.now()}`,
        description: 'A test product',
        price: 49.99,
        category: 'test-category',
        stock: 20
      };

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', productPayload.name)
        .field('description', productPayload.description)
        .field('price', String(productPayload.price))
        .field('category', productPayload.category)
        .field('stock', String(productPayload.stock))
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(productPayload.name);
      createdProduct = res.body;
    });

    it('lists products publicly with pagination', async () => {
      const res = await request(app)
        .get('/api/products?page=1&limit=5&search=Integration Product')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('page');
    });
  });

  describe('Cart', () => {
    it('adds product to user cart', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: createdProduct._id, quantity: 2 })
        .expect(201);

      expect(res.body).toHaveProperty('items');
      expect(res.body.items.length).toBeGreaterThanOrEqual(1);
      createdCartItemId = res.body.items[0]._id;
    });

    it('gets user cart', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body).toHaveProperty('subtotal');
    });

    it('updates cart item quantity', async () => {
      const res = await request(app)
        .put(`/api/cart/${createdCartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 })
        .expect(200);

      expect(res.body.items[0].quantity).toBe(3);
    });
  });

  describe('Orders', () => {
    it('creates order from cart checkout endpoint', async () => {
      const payload = {
        shippingAddress: '123 Integration Street',
        paymentMethod: 'cod',
        shippingCost: 0,
        taxAmount: 0,
        contactEmail: normalUser.email,
        contactPhone: '1234567890'
      };

      const res = await request(app)
        .post('/api/orders/checkout')
        .set('Authorization', `Bearer ${userToken}`)
        .send(payload)
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.paymentMethod).toBe('cod');
      createdOrder = res.body;
    });

    it('returns my orders for authenticated user', async () => {
      const res = await request(app)
        .get('/api/orders/my?page=1&limit=10')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('tracks order by id + email', async () => {
      const res = await request(app)
        .post('/api/orders/track')
        .send({ orderId: createdOrder._id, email: normalUser.email })
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data._id.toString()).toBe(createdOrder._id.toString());
    });

    it('forbids normal user from admin order list endpoint', async () => {
      await request(app)
        .get('/api/orders/list?page=1&limit=10')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('allows admin to list all orders', async () => {
      const res = await request(app)
        .get('/api/orders/list?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
