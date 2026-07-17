import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';

export const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

export const refreshQueue = async (serviceId, duration) => {
  const waiting = await Token.find({ service: serviceId, status: { $in: ['waiting', 'called'] } }).sort({ createdAt: 1 });
  await Promise.all(waiting.map((token, index) => Token.updateOne({ _id: token._id }, { queuePosition: index + 1, estimatedWaitTime: index * duration })));
};

export const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
