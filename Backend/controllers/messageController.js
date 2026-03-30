import Message from '../models/Message.js';
import AppError from '../utils/AppError.js';

export const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !name.trim()) {
      return next(new AppError('Name is required', 400));
    }

    if (!email || !email.trim()) {
      return next(new AppError('Email is required', 400));
    }

    if (!message || !message.trim()) {
      return next(new AppError('Message is required', 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return next(new AppError('Please provide a valid email', 400));
    }

    const created = await Message.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject && subject.trim() ? subject.trim() : 'General Inquiry',
      message: message.trim()
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const numPage = Math.max(parseInt(page, 10) || 1, 1);
    const numLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (numPage - 1) * numLimit;
    
    const filter = {};
    if (status) filter.status = status;

    const [messages, total] = await Promise.all([
      Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(numLimit),
      Message.countDocuments(filter)
    ]);
    
    res.json({
      data: messages,
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

export const replyMessage = async (req, res, next) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return next(new AppError('Reply cannot be empty', 400));
    }
    const message = await Message.findById(req.params.id);
    if (!message) return next(new AppError('Message not found', 404));

    message.replies.push({ reply: reply.trim(), date: new Date() });
    await message.save();

    res.json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

export const closeMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });
    if (!message) return next(new AppError('Message not found', 404));

    res.json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};
