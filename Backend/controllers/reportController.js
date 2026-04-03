import Order from '../models/Order.js';

const toStartDate = (period) => {
  const now = new Date();
  if (period === 'day') return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === 'week') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (period === 'year') return new Date(now.getFullYear(), 0, 1);
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const salesLabel = (date, period) => {
  if (period === 'day') return `${date.getHours()}:00`;
  if (period === 'week') return date.toLocaleDateString('en-US', { weekday: 'short' });
  if (period === 'year') return date.toLocaleDateString('en-US', { month: 'short' });
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

export const getSalesReport = async (req, res, next) => {
  try {
    const period = req.query.period || 'month';
    const start = toStartDate(period);

    const orders = await Order.find({ createdAt: { $gte: start } }).sort({ createdAt: 1 });
    const grouped = new Map();

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const label = salesLabel(date, period);
      grouped.set(label, (grouped.get(label) || 0) + Number(order.total || 0));
    });

    const data = Array.from(grouped.entries()).map(([label, total]) => ({ label, total }));
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

export const getTrafficReport = async (req, res, next) => {
  try {
    const period = req.query.period || 'month';
    const start = toStartDate(period);

    const orders = await Order.find({ createdAt: { $gte: start } }).sort({ createdAt: 1 });
    const grouped = new Map();

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const label = salesLabel(date, period);
      grouped.set(label, (grouped.get(label) || 0) + 1);
    });

    const data = Array.from(grouped.entries()).map(([label, visits]) => ({ label, visits }));
    res.json({ data });
  } catch (err) {
    next(err);
  }
};

export const getProductsReport = async (req, res, next) => {
  try {
    const period = req.query.period || 'month';
    const start = toStartDate(period);

    const rows = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.product',
          sold: { $sum: '$products.quantity' }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDoc'
        }
      },
      {
        $project: {
          _id: 0,
          name: {
            $ifNull: [
              { $arrayElemAt: ['$productDoc.name', 0] },
              { $concat: ['Product ', { $toString: '$_id' }] }
            ]
          },
          sold: 1
        }
      }
    ]);

    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};
