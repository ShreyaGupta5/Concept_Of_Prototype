import Feedback from '../models/Feedback.js';
import Token from '../models/Token.js';
import Appointment from '../models/Appointment.js';
import { asyncHandler } from '../utils/helpers.js';
export const createFeedback = asyncHandler(async (req, res) => {
  const { token: tokenId, appointment: appointmentId } = req.body;
  const completed = tokenId ? await Token.findOne({ _id: tokenId, user: req.user._id, status: 'completed' }) : await Appointment.findOne({ _id: appointmentId, user: req.user._id, status: 'completed' });
  if (!completed) return res.status(403).json({ message: 'Feedback is available after your service is completed.' });
  const feedback = await Feedback.create({ ...req.body, user: req.user._id, service: completed.service });
  res.status(201).json({ feedback });
});
export const serviceFeedback = asyncHandler(async (req, res) => res.json({ feedback: await Feedback.find({ service: req.params.serviceId }).populate('user', 'name').sort({ createdAt: -1 }) }));
export const allFeedback = asyncHandler(async (req, res) => res.json({ feedback: await Feedback.find().populate('user service', 'name').sort({ createdAt: -1 }) }));

export const myFeedback = asyncHandler(async (req, res) => res.json({ feedback: await Feedback.find({ user: req.user._id }).select('token appointment') }));
