import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import AppError from '../utils/AppError.js';

const normalizeCartResponse = (cart) => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    ...cart.toObject(),
    subtotal
  };
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
      cart = await cart.populate('items.product', 'name price images stock');
    }

    res.json(normalizeCartResponse(cart));
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const parsedQty = Number(quantity);

    if (!productId) {
      return next(new AppError('productId is required', 400));
    }

    if (!Number.isInteger(parsedQty) || parsedQty <= 0) {
      return next(new AppError('Quantity must be a positive integer', 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => String(item.product) === String(product._id));

    if (itemIndex >= 0) {
      const nextQuantity = cart.items[itemIndex].quantity + parsedQty;
      if (nextQuantity > product.stock) {
        return next(new AppError('Requested quantity exceeds available stock', 400));
      }

      cart.items[itemIndex].quantity = nextQuantity;
      cart.items[itemIndex].price = product.price;
    } else {
      if (parsedQty > product.stock) {
        return next(new AppError('Requested quantity exceeds available stock', 400));
      }

      cart.items.push({
        product: product._id,
        quantity: parsedQty,
        price: product.price
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock');
    res.status(201).json(normalizeCartResponse(cart));
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const parsedQty = Number(quantity);

    if (!Number.isInteger(parsedQty) || parsedQty <= 0) {
      return next(new AppError('Quantity must be a positive integer', 400));
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return next(new AppError('Cart item not found', 404));
    }

    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    if (parsedQty > product.stock) {
      return next(new AppError('Requested quantity exceeds available stock', 400));
    }

    item.quantity = parsedQty;
    item.price = product.price;

    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.json(normalizeCartResponse(cart));
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return next(new AppError('Cart item not found', 404));
    }

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.json(normalizeCartResponse(cart));
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ items: [], subtotal: 0 });
    }

    cart.items = [];
    await cart.save();

    res.json(normalizeCartResponse(cart));
  } catch (err) {
    next(err);
  }
};
