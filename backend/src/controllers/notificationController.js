import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/helpers.js';
export const listNotifications = asyncHandler(async (req, res) => res.json({ notifications: await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100) }));
export const readNotification = asyncHandler(async (req, res) => res.json({ notification: await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true }) }));
export const readAll = asyncHandler(async (req, res) => { await Notification.updateMany({ user: req.user._id, read: false }, { read: true }); res.json({ message: 'All notifications marked as read.' }); });
