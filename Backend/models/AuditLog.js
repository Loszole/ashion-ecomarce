import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for faster filtering and sorting
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);