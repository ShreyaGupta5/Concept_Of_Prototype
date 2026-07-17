import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' }, appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  tags: [{ type: String, enum: ['Fast service', 'Helpful staff', 'Long wait', 'Easy process', 'Clear communication', 'Needs improvement'] }], comment: String
}, { timestamps: true });
schema.index({ user: 1, token: 1 }, { unique: true, partialFilterExpression: { token: { $type: 'objectId' } } });
schema.index({ user: 1, appointment: 1 }, { unique: true, partialFilterExpression: { appointment: { $type: 'objectId' } } });
export default mongoose.model('Feedback', schema);
