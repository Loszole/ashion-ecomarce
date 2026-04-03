import Category from '../models/Category.js';
import AuditLog from '../models/AuditLog.js';
import AppError from '../utils/AppError.js';

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    await AuditLog.create({ user: req.user._id, action: 'create_category', details: { categoryId: category._id } });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));

    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const update = { name, description, updatedAt: Date.now() };
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!category) return next(new AppError('Category not found', 404));

    await AuditLog.create({ user: req.user._id, action: 'update_category', details: { categoryId: category._id } });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new AppError('Category not found', 404));

    await AuditLog.create({ user: req.user._id, action: 'delete_category', details: { categoryId: category._id } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
