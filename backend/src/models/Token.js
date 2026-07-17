import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  tokenNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  visitReason: { type: String, required: true }, note: String,
  status: { type: String, enum: ['waiting', 'called', 'serving', 'completed', 'skipped', 'cancelled'], default: 'waiting' },
  queuePosition: Number, estimatedWaitTime: Number,
  calledAt: Date, servingAt: Date, completedAt: Date
}, { timestamps: true });
tokenSchema.index({ user: 1, service: 1, status: 1 });
export default mongoose.model('Token', tokenSchema);
