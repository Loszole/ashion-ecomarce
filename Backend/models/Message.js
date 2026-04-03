import mongoose from 'mongoose';

const messageReplySchema = new mongoose.Schema(
  {
    reply: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    replies: { type: [messageReplySchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
