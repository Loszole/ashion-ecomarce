import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster queries
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });
productSchema.index({ createdAt: -1 });

export default mongoose.model('Product', productSchema);