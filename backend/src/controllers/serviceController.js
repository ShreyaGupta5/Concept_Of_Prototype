import Service from '../models/Service.js';
import Token from '../models/Token.js';
import { asyncHandler } from '../utils/helpers.js';

export const listServices = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) filter.$or = ['name', 'description', 'location'].map((field) => ({ [field]: { $regex: req.query.search, $options: 'i' } }));
  const services = await Service.find(filter).lean();
  const result = await Promise.all(services.map(async (service) => {
    const waitingCount = await Token.countDocuments({ service: service._id, status: { $in: ['waiting', 'called'] } });
    return { ...service, waitingCount, estimatedWait: waitingCount * service.averageServiceDuration };
  }));
  res.json({ services: result });
});
export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).lean();
  if (!service) return res.status(404).json({ message: 'Service not found.' });
  const waitingCount = await Token.countDocuments({ service: service._id, status: { $in: ['waiting', 'called'] } });
  res.json({ service: { ...service, waitingCount, estimatedWait: waitingCount * service.averageServiceDuration } });
});
export const createService = asyncHandler(async (req, res) => res.status(201).json({ service: await Service.create(req.body) }));
export const updateService = asyncHandler(async (req, res) => res.json({ service: await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }) }));
export const deleteService = asyncHandler(async (req, res) => { await Service.findByIdAndDelete(req.params.id); res.status(204).end(); });
export const queueStatus = asyncHandler(async (req, res) => res.json({ service: await Service.findByIdAndUpdate(req.params.id, { queueOpen: req.body.queueOpen, status: req.body.status }, { new: true }) }));
