import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const monthLabel = (year, month) => {
  const d = new Date(year, month, 1);
  return d.toLocaleString('en-US', { month: 'short' });
};

export const getAdminSummary = async (req, res, next) => {
  try {
    const [revenueAgg, ordersCount, productsCount, usersCount] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$total' } } }]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' })
    ]);

    res.json({
      revenue: revenueAgg[0]?.totalRevenue || 0,
      sales: ordersCount,
      templates: productsCount,
      clients: usersCount
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminTraffic = async (req, res, next) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthly = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          visits: { $sum: 1 },
          value: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const lookup = new Map();
    monthly.forEach((m) => {
      lookup.set(`${m._id.year}-${m._id.month}`, {
        visits: m.visits,
        value: m.value
      });
    });

    const area = [];
    const line = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const row = lookup.get(key) || { visits: 0, value: 0 };
      const label = monthLabel(d.getFullYear(), d.getMonth());
      area.push({ month: label, visits: row.visits });
      line.push({ name: label, value: row.value });
    }

    const pending = await Order.countDocuments({ status: 'pending' });
    const processing = await Order.countDocuments({ status: 'processing' });
    const delivered = await Order.countDocuments({ status: 'delivered' });

    const pie = [
      { name: 'Pending', value: pending },
      { name: 'Processing', value: processing },
      { name: 'Delivered', value: delivered }
    ];

    res.json({ area, pie, line });
  } catch (err) {
    next(err);
  }
};