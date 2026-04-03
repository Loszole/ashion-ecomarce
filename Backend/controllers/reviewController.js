import Review from '../models/Review.js';
import AppError from '../utils/AppError.js';

export const getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const numPage = Math.max(parseInt(page, 10) || 1, 1);
    const numLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (numPage - 1) * numLimit;
    
    const filter = {};
    if (status) filter.status = status;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name email')
        .populate('product', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numLimit),
      Review.countDocuments(filter)
    ]);

    res.json({ 
      data: reviews,
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

export const updateReview = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
    }
    
    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('user', 'name email')
      .populate('product', 'name');

    if (!review) return next(new AppError('Review not found', 404));

    res.json(review);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return next(new AppError('Review not found', 404));
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};
