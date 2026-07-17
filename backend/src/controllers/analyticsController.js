import Token from '../models/Token.js';
import Appointment from '../models/Appointment.js';
import Feedback from '../models/Feedback.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/helpers.js';

export const overview = asyncHandler(async (req, res) => {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const [servedToday, waiting, activeQueues, completedAppointments, cancelledTokens, rating] = await Promise.all([
    Token.countDocuments({ status: 'completed', completedAt: { $gte: start } }), Token.countDocuments({ status: { $in: ['waiting', 'called'] } }), Service.countDocuments({ queueOpen: true }), Appointment.countDocuments({ status: 'completed' }), Token.countDocuments({ status: 'cancelled' }), Feedback.aggregate([{ $group: { _id: null, average: { $avg: '$rating' } } }])
  ]);
  res.json({ servedToday, waiting, activeQueues, completedAppointments, cancelledTokens, satisfaction: rating[0]?.average || 0, students: await User.countDocuments({ role: 'student' }) });
});
export const queueAnalytics = asyncHandler(async (req, res) => res.json({
  byService: await Token.aggregate([{ $group: { _id: '$service', tokens: { $sum: 1 }, averageWait: { $avg: '$estimatedWaitTime' }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } }, { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } }, { $unwind: '$service' }, { $project: { name: '$service.name', tokens: 1, averageWait: 1, completed: 1 } }]),
  byHour: await Token.aggregate([{ $group: { _id: { $hour: '$createdAt' }, tokens: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
  byDay: await Token.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, tokens: { $sum: 1 } } }, { $sort: { _id: 1 } }, { $limit: 14 }])
}));
export const appointmentAnalytics = asyncHandler(async (req, res) => res.json({ statuses: await Appointment.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]) }));
export const feedbackAnalytics = asyncHandler(async (req, res) => res.json({ ratings: await Feedback.aggregate([{ $group: { _id: '$rating', value: { $sum: 1 } } }, { $sort: { _id: 1 } }]), tags: await Feedback.aggregate([{ $unwind: '$tags' }, { $group: { _id: '$tags', value: { $sum: 1 } } }, { $sort: { value: -1 } }]) }));
