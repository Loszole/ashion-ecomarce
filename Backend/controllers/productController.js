import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';
import AppError from '../utils/AppError.js';

const normalizeStoredImagePath = (value) => {
  if (!value) return '';

  const raw = String(value).trim();
  if (!raw) return '';

  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) {
    return raw;
  }

  const normalized = raw.replace(/\\/g, '/');
  const uploadsMarker = '/uploads/';
  const markerIndex = normalized.toLowerCase().lastIndexOf(uploadsMarker);

  if (markerIndex >= 0) {
    return normalized.slice(markerIndex);
  }

  if (normalized.toLowerCase().startsWith('uploads/')) {
    return `/${normalized}`;
  }

  if (normalized.toLowerCase().startsWith('/uploads/')) {
    return normalized;
  }

  return normalized;
};

const serializeProduct = (productDoc) => {
  const product = productDoc?.toObject ? productDoc.toObject() : { ...productDoc };

  if (Array.isArray(product.images)) {
    product.images = product.images.map(normalizeStoredImagePath).filter(Boolean);
  }

  if (product.image) {
    product.image = normalizeStoredImagePath(product.image);
  }

  return product;
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
    const product = new Product({ name, description, price, category, stock, images });
    await product.save();
    // Audit log
    await AuditLog.create({ user: req.user._id, action: 'create_product', details: { productId: product._id } });
    res.status(201).json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const allowedSortFields = ['createdAt', 'price', 'name', 'updatedAt'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'createdAt';
    const sortDirection = order === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit),
      Product.countDocuments(filter)
    ]);

    res.json({
      data: products.map(serializeProduct),
      meta: {
        page: numericPage,
        limit: numericLimit,
        total,
        pages: Math.ceil(total / numericLimit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));

    res.json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : undefined;
    const update = { name, description, price, category, stock };
    if (images) update.images = images;
    update.updatedAt = Date.now();
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return next(new AppError('Product not found', 404));

    // Audit log
    await AuditLog.create({ user: req.user._id, action: 'update_product', details: { productId: product._id } });
    res.json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new AppError('Product not found', 404));

    // Audit log
    await AuditLog.create({ user: req.user._id, action: 'delete_product', details: { productId: product._id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
