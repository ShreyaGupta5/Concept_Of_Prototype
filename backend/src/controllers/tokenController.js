import Token from '../models/Token.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';
import { asyncHandler, refreshQueue } from '../utils/helpers.js';

export const createToken = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.body.serviceId);
  if (!service) return res.status(404).json({ message: 'Service not found.' });
  if (!service.queueOpen || service.status === 'closed') return res.status(409).json({ message: 'This queue is currently closed.' });
  const activeFilter = { service: service._id, status: { $in: ['waiting', 'called', 'serving'] } };
  if (await Token.exists({ ...activeFilter, user: req.user._id })) return res.status(409).json({ message: 'You already have an active token for this service.' });
  const count = await Token.countDocuments(activeFilter);
  if (count >= service.queueCapacity) return res.status(409).json({ message: 'This queue has reached capacity. Please check back shortly.' });
  const issuedTokenCount = await Token.countDocuments({ service: service._id });
  const token = await Token.create({ tokenNumber: `${service.code}-${String(issuedTokenCount + 1).padStart(3, '0')}`, user: req.user._id, service: service._id, visitReason: req.body.visitReason, note: req.body.note, queuePosition: count + 1, estimatedWaitTime: count * service.averageServiceDuration });
  await Notification.create({ user: req.user._id, title: 'Token created', message: `Your token ${token.tokenNumber} has been created.`, type: 'queue', relatedEntity: token._id });
  res.status(201).json({ token: await token.populate('service') });
});
export const myTokens = asyncHandler(async (req, res) => res.json({ tokens: await Token.find({ user: req.user._id }).populate('service').sort({ createdAt: -1 }) }));
export const getToken = asyncHandler(async (req, res) => {
  const token = await Token.findById(req.params.id).populate('service user', 'name email');
  if (!token || (req.user.role !== 'admin' && String(token.user._id) !== String(req.user._id))) return res.status(404).json({ message: 'Token not found.' });
  res.json({ token });
});
export const serviceTokens = asyncHandler(async (req, res) => res.json({ tokens: await Token.find({ service: req.params.serviceId }).populate('user', 'name studentId').sort({ createdAt: 1 }) }));
export const cancelToken = asyncHandler(async (req, res) => {
  const token = await Token.findOne({ _id: req.params.id, user: req.user._id }).populate('service');
  if (!token || !['waiting', 'called'].includes(token.status)) return res.status(409).json({ message: 'This token can no longer be cancelled.' });
  token.status = 'cancelled'; await token.save(); await refreshQueue(token.service._id, token.service.averageServiceDuration);
  await Notification.create({ user: req.user._id, message: `Your queue token ${token.tokenNumber} was cancelled.`, type: 'warning', relatedEntity: token._id });
  res.json({ token });
});
export const updateTokenStatus = asyncHandler(async (req, res) => {
  const token = await Token.findById(req.params.id).populate('service');
  if (!token) return res.status(404).json({ message: 'Token not found.' });
  token.status = req.body.status;
  if (token.status === 'called') token.calledAt = new Date(); if (token.status === 'serving') token.servingAt = new Date(); if (token.status === 'completed') token.completedAt = new Date();
  await token.save();
  await Notification.create({ user: token.user, title: `Token ${token.status}`, message: token.status === 'called' ? `Your token has been called. Please proceed to ${token.service.location}, ${token.service.deskNumber}.` : `Token ${token.tokenNumber} is now ${token.status}.`, type: 'queue', relatedEntity: token._id });
  await refreshQueue(token.service._id, token.service.averageServiceDuration); res.json({ token });
});
export const callNext = asyncHandler(async (req, res) => {
  const token = await Token.findOne({ service: req.params.serviceId, status: 'waiting' }).sort({ createdAt: 1 });
  if (!token) return res.status(404).json({ message: 'There are no waiting tokens.' });
  req.params.id = token._id; req.body.status = 'called'; return updateTokenStatus(req, res);
});
