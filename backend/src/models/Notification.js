import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, title: String, message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'queue', 'appointment'], default: 'info' }, read: { type: Boolean, default: false },
  relatedEntity: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });
export default mongoose.model('Notification', schema);
