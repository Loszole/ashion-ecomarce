import User from '../models/User.js';

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const numPage = Math.max(parseInt(page, 10) || 1, 1);
    const numLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (numPage - 1) * numLimit;

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(numLimit),
      User.countDocuments()
    ]);

    res.json({
      data: users,
      pagination: {
        total,
        page: numPage,
        limit: numLimit,
        pages: Math.ceil(total / numLimit)
      }
    });
  } catch (err) {
    next(err);
  }
};
