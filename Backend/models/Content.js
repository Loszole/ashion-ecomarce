import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['blog', 'page'], default: 'blog' },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Content', contentSchema);
