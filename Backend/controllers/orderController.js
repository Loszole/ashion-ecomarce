import Order from '../models/Order.js';
import AuditLog from '../models/AuditLog.js';

export const createOrder = async (req, res) => {
  try {
    const { products, total, shippingAddress } = req.body;
    const order = new Order({
      user: req.user._id,
      products,
      total,
      shippingAddress
    });
    await order.save();
    await AuditLog.create({ user: req.user._id, action: 'create_order', details: { orderId: order._id } });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('products.product', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('products.product', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await AuditLog.create({ user: req.user._id, action: 'update_order', details: { orderId: order._id, status } });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    await AuditLog.create({ user: req.user._id, action: 'delete_order', details: { orderId: order._id } });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
