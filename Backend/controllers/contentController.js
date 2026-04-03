import Content from '../models/Content.js';
import AppError from '../utils/AppError.js';

const validateContent = (content) => {
  if (!content.title || !content.title.trim()) {
    throw new AppError('Title is required', 400);
  }
  if (!content.content || !content.content.trim()) {
    throw new AppError('Content is required', 400);
  }
  if (!content.type || !['blog', 'page'].includes(content.type)) {
    throw new AppError('Invalid content type. Must be blog or page', 400);
  }
};

export const getContent = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const numPage = Math.max(parseInt(page, 10) || 1, 1);
    const numLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (numPage - 1) * numLimit;
    
    const filter = {};
    if (type) filter.type = type;

    const [items, total] = await Promise.all([
      Content.find(filter).sort({ createdAt: -1 }).skip(skip).limit(numLimit),
      Content.countDocuments(filter)
    ]);
    
    res.json({ 
      data: items,
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

export const createContent = async (req, res, next) => {
  try {
    validateContent(req.body);
    const item = await Content.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const updateContent = async (req, res, next) => {
  try {
    validateContent(req.body);
    const item = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return next(new AppError('Content not found', 404));
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteContent = async (req, res, next) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) return next(new AppError('Content not found', 404));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
