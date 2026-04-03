import Discount from '../models/Discount.js';
import AppError from '../utils/AppError.js';

export const getDiscounts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const numPage = Math.max(parseInt(page, 10) || 1, 1);
    const numLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (numPage - 1) * numLimit;
    
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const [discounts, total] = await Promise.all([
      Discount.find(filter).sort({ createdAt: -1 }).skip(skip).limit(numLimit),
      Discount.countDocuments(filter)
    ]);
    
    res.json({ 
      data: discounts,
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

export const createDiscount = async (req, res, next) => {
  try {
    const { code, amount, type } = req.body;
    
    if (!code || !code.trim()) {
      return next(new AppError('Discount code is required', 400));
    }
    if (!amount || amount <= 0) {
      return next(new AppError('Amount must be greater than 0', 400));
    }
    if (type === 'percent' && amount > 100) {
      return next(new AppError('Percentage discount cannot exceed 100%', 400));
    }
    
    const payload = { ...req.body, code: String(code).toUpperCase() };
    const discount = await Discount.create(payload);
    res.status(201).json(discount);
  } catch (err) {
    next(err);
  }
};

export const updateDiscount = async (req, res, next) => {
  try {
    const { amount, type } = req.body;
    
    if (amount !== undefined) {
      if (amount <= 0) {
        return next(new AppError('Amount must be greater than 0', 400));
      }
      if (type === 'percent' && amount > 100) {
        return next(new AppError('Percentage discount cannot exceed 100%', 400));
      }
    }
    
    const payload = { ...req.body };
    if (payload.code) payload.code = String(payload.code).toUpperCase();
    const discount = await Discount.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!discount) return next(new AppError('Discount not found', 404));
    res.json(discount);
  } catch (err) {
    next(err);
  }
};

export const deleteDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return next(new AppError('Discount not found', 404));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
