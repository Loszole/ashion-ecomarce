import mongoose from 'mongoose';
import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import SiteSetting from '../models/SiteSetting.js';
import AppError from '../utils/AppError.js';

const roundCurrency = (value) => Math.round(Number(value) * 100) / 100;

const getPaymentConfig = async () => {
  const setting = await SiteSetting.findOne({ key: 'payment' });
  const config = setting?.value || {};
  return {
    provider: config.provider || 'cod',
    codEnabled: config.codEnabled !== false,
    stripeEnabled: config.stripeEnabled === true,
    paypalEnabled: config.paypalEnabled === true
  };
};

const ensurePaymentMethodEnabled = (paymentMethod, config) => {
  if (paymentMethod === 'cod' && config.codEnabled) return;
  if (paymentMethod === 'stripe' && config.stripeEnabled) return;
  if (paymentMethod === 'paypal' && config.paypalEnabled) return;
  throw new AppError(`Payment method '${paymentMethod}' is not enabled`, 400);
};

const validateAndPrepareProducts = async (products, session) => {
  const preparedItems = [];
  let subtotal = 0;

  for (const item of products) {
    const product = await Product.findById(item.product).session(session);
    if (!product) {
      throw new AppError('One or more products were not found', 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for product: ${product.name}`, 400);
    }

    const itemPrice = roundCurrency(product.price);
    subtotal += itemPrice * item.quantity;

    preparedItems.push({
      product: product._id,
      quantity: item.quantity,
      price: itemPrice,
      stockDocument: product
    });
  }

  return {
    items: preparedItems,
    subtotal: roundCurrency(subtotal)
  };
};

const createOrderTransaction = async ({ userId, products, shippingAddress, paymentMethod, shippingCost = 0, taxAmount = 0, contactEmail = '', contactPhone = '' }) => {
  const paymentConfig = await getPaymentConfig();
  ensurePaymentMethodEnabled(paymentMethod, paymentConfig);

  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const prepared = await validateAndPrepareProducts(products, session);
      const normalizedShipping = roundCurrency(shippingCost);
      const normalizedTax = roundCurrency(taxAmount);
      const total = roundCurrency(prepared.subtotal + normalizedShipping + normalizedTax);

      createdOrder = await Order.create(
        [
          {
            user: userId,
            products: prepared.items.map((item) => ({
              product: item.product,
              quantity: item.quantity,
              price: item.price
            })),
            subtotal: prepared.subtotal,
            shippingCost: normalizedShipping,
            taxAmount: normalizedTax,
            total,
            shippingAddress,
            paymentMethod,
            contactEmail,
            contactPhone,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
          }
        ],
        { session }
      );

      for (const item of prepared.items) {
        item.stockDocument.stock -= item.quantity;
        await item.stockDocument.save({ session });
      }

      await AuditLog.create(
        [
          {
            user: userId,
            action: 'create_order',
            details: { orderId: createdOrder[0]._id, paymentMethod }
          }
        ],
        { session }
      );
    });
  } finally {
    session.endSession();
  }

  return createdOrder?.[0];
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod = 'cod',
      shippingCost = 0,
      taxAmount = 0,
      contactEmail = '',
      contactPhone = ''
    } = req.body;

    const order = await createOrderTransaction({
      userId: req.user._id,
      products,
      shippingAddress,
      paymentMethod,
      shippingCost,
      taxAmount,
      contactEmail,
      contactPhone
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const checkoutFromCart = async (req, res, next) => {
  try {
    const {
      shippingAddress,
      paymentMethod = 'cod',
      shippingCost = 0,
      taxAmount = 0,
      contactEmail = '',
      contactPhone = ''
    } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty', 400));
    }

    const order = await createOrderTransaction({
      userId: req.user._id,
      products: cart.items,
      shippingAddress,
      paymentMethod,
      shippingCost,
      taxAmount,
      contactEmail,
      contactPhone
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('products.product', 'name')
        .sort({ createdAt: -1 })
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit),
      Order.countDocuments(filter)
    ]);

    res.json({
      data: orders,
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

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('products.product', 'name');
    if (!order) return next(new AppError('Order not found', 404));

    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const trackOrder = async (req, res, next) => {
  try {
    const { orderId, email } = req.body;
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return next(new AppError('Valid orderId is required', 400));
    }

    if (!email || !email.trim()) {
      return next(new AppError('Email is required', 400));
    }

    const normalizedEmail = email.trim().toLowerCase();
    const order = await Order.findById(orderId)
      .populate('products.product', 'name')
      .populate('user', 'email name');

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    const orderContactEmail = (order.contactEmail || '').trim().toLowerCase();
    const userEmail = (order.user?.email || '').trim().toLowerCase();
    if (normalizedEmail !== orderContactEmail && normalizedEmail !== userEmail) {
      return next(new AppError('Order not found', 404));
    }

    res.json({
      data: {
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        shippingAddress: order.shippingAddress,
        products: order.products.map((item) => ({
          name: item.product?.name || 'Product',
          quantity: item.quantity,
          price: item.price
        }))
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
    if (!order) return next(new AppError('Order not found', 404));

    await AuditLog.create({ user: req.user._id, action: 'update_order', details: { orderId: order._id, status } });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return next(new AppError('Order not found', 404));

    await AuditLog.create({ user: req.user._id, action: 'delete_order', details: { orderId: order._id } });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};
