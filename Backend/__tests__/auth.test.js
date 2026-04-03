import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import authRoutes from '../routes/auth.js';
import { errorHandler, notFound } from '../middleware/errorHandler.js';

dotenv.config({ path: '.env.test' });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key_12345';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_jwt_refresh_secret_key_12345';

const app = express();
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

describe('Auth Routes', () => {
  let refreshToken;
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPass123!';
  const testUser = {
    name: 'Test User',
    email: testEmail,
    password: testPassword,
  };

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecom-test');
    }
  });

  afterAll(async () => {
    // Clean up - remove test user
    const User = mongoose.model('User');
    await User.deleteOne({ email: testEmail });
    // Disconnect
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(testEmail);
      expect(res.body.user.role).toBe('user');
    });

    it('should fail if user already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('should fail with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid User',
          email: 'not-an-email',
          password: testPassword,
        })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('should fail with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Pass User',
          email: `short-${Date.now()}@example.com`,
          password: 'short',
        })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      refreshToken = res.body.refreshToken;
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123!',
        })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });

    it('should fail with non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testPassword,
        })
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should return new access token with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body.accessToken).toBeTruthy();
    });

    it('should fail with invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(res.body).toHaveProperty('message');
    });

    it('should fail without refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('successfully');
    });

    it('should fail without refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty('message');
    });
  });
});
