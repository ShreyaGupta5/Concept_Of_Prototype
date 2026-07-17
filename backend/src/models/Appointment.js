import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  appointmentDate: { type: Date, required: true }, timeSlot: { type: String, required: true },
  purpose: { type: String, required: true }, note: String,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'], default: 'pending' }
}, { timestamps: true });
appointmentSchema.index({ service: 1, appointmentDate: 1, timeSlot: 1 });
export default mongoose.model('Appointment', appointmentSchema);
