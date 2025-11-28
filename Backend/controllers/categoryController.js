import Category from '../models/Category.js';
import AuditLog from '../models/AuditLog.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    await AuditLog.create({ user: req.user._id, action: 'create_category', details: { categoryId: category._id } });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const update = { name, description, updatedAt: Date.now() };
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await AuditLog.create({ user: req.user._id, action: 'update_category', details: { categoryId: category._id } });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await AuditLog.create({ user: req.user._id, action: 'delete_category', details: { categoryId: category._id } });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
