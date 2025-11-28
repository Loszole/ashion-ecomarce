import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];
    const product = new Product({ name, description, price, category, stock, images });
    await product.save();
    // Audit log
    await AuditLog.create({ user: req.user._id, action: 'create_product', details: { productId: product._id } });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const images = req.files ? req.files.map(file => file.path) : undefined;
    const update = { name, description, price, category, stock };
    if (images) update.images = images;
    update.updatedAt = Date.now();
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Audit log
    await AuditLog.create({ user: req.user._id, action: 'update_product', details: { productId: product._id } });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Audit log
    await AuditLog.create({ user: req.user._id, action: 'delete_product', details: { productId: product._id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
