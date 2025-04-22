import mongoose from 'mongoose';

const AuditSchema = new mongoose.Schema({
  url: String,
  result: Object,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

export const Audit = mongoose.model('Audit', AuditSchema);