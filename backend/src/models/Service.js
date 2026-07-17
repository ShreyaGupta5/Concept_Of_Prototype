import mongoose from 'mongoose';

const hoursSchema = new mongoose.Schema({ day: String, open: String, close: String, closed: { type: Boolean, default: false } }, { _id: false });
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  code: { type: String, required: true, uppercase: true, maxlength: 3 },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Academics', 'Administration', 'Library', 'Placement', 'Health', 'Hostel', 'Food', 'Technical Support'] },
  department: String, location: String, deskNumber: String,
  status: { type: String, enum: ['open', 'busy', 'closed'], default: 'open' },
  queueOpen: { type: Boolean, default: true },
  workingHours: [hoursSchema],
  averageServiceDuration: { type: Number, default: 8, min: 1 },
  queueCapacity: { type: Number, default: 30, min: 1 },
  contactEmail: String,
  availableSlots: [String],
  faqs: [{ question: String, answer: String }]
}, { timestamps: true });
export default mongoose.model('Service', serviceSchema);
