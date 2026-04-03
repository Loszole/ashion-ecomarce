import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true, uppercase: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
    expires: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Discount', discountSchema);
