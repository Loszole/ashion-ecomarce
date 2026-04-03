import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import AppError from '../utils/AppError.js';

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived access token
  );

  const refreshToken = jwt.sign(
    { id: userId, jti: randomUUID() },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d' } // Long-lived refresh token
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return next(new AppError('User already exists', 400));

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: 'user' });
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Store refresh token in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ userId: user._id, token: refreshToken, expiresAt });

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new AppError('Invalid credentials', 400));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError('Invalid credentials', 400));

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Revoke older refresh tokens for this user, then store a fresh one.
    await RefreshToken.updateMany({ userId: user._id, revokedAt: null }, { revokedAt: new Date() });

    // Store refresh token in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ userId: user._id, token: refreshToken, expiresAt });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError('Refresh token required', 400));

    // Verify refresh token exists in DB and not revoked
    const storedToken = await RefreshToken.findOne({ token: refreshToken, revokedAt: null });
    if (!storedToken) return next(new AppError('Invalid or revoked refresh token', 401));

    // Verify JWT signature
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    } catch (err) {
      return next(new AppError('Invalid refresh token', 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User not found', 404));

    const { accessToken: newAccessToken } = generateTokens(user._id, user.role);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError('Refresh token required', 400));

    // Mark refresh token as revoked
    await RefreshToken.updateOne(
      { token: refreshToken },
      { revokedAt: new Date() }
    );

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
