import AuditLog from '../models/AuditLog.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const { user, action, startDate, endDate, page = 1, limit = 50 } = req.query;
    const numPage = Math.max(parseInt(page, 10) || 1, 1);
    const numLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
    const skip = (numPage - 1) * numLimit;
    
    const filter = {};
    if (user) filter.user = user;
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const [logs, total] = await Promise.all([
      AuditLog.find(filter).populate('user', 'name email role').sort({ createdAt: -1 }).skip(skip).limit(numLimit),
      AuditLog.countDocuments(filter)
    ]);
    
    res.json({
      data: logs,
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
