import mongoose from 'mongoose';

const homepageLayoutSchema = new mongoose.Schema({
  layout: { type: Object, required: true }, // JSON structure for drag-and-drop layout
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('HomepageLayout', homepageLayoutSchema);