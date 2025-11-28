import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', auditLogSchema);