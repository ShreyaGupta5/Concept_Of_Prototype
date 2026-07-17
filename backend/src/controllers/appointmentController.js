import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/helpers.js';

const normalizeDate = (value) => { const date = new Date(value); date.setHours(0, 0, 0, 0); return date; };
export const createAppointment = asyncHandler(async (req, res) => {
  const date = normalizeDate(req.body.appointmentDate);
  if (date < normalizeDate(new Date())) return res.status(422).json({ message: 'Appointments cannot be booked in the past.' });
  const service = await Service.findById(req.body.serviceId);
  if (!service || !service.availableSlots.includes(req.body.timeSlot)) return res.status(409).json({ message: 'That appointment slot is not available.' });
  const conflict = await Appointment.exists({ service: service._id, appointmentDate: date, timeSlot: req.body.timeSlot, status: { $in: ['pending', 'confirmed'] } });
  if (conflict) return res.status(409).json({ message: 'That time was just booked. Please choose another slot.' });
  const appointment = await Appointment.create({ user: req.user._id, service: service._id, appointmentDate: date, timeSlot: req.body.timeSlot, purpose: req.body.purpose, note: req.body.note });
  await Notification.create({ user: req.user._id, title: 'Appointment requested', message: `Your appointment with ${service.name} is pending confirmation.`, type: 'appointment', relatedEntity: appointment._id });
  res.status(201).json({ appointment: await appointment.populate('service') });
});
export const myAppointments = asyncHandler(async (req, res) => res.json({ appointments: await Appointment.find({ user: req.user._id }).populate('service').sort({ appointmentDate: 1 }) }));
export const allAppointments = asyncHandler(async (req, res) => {
  const filter = {}; if (req.query.status) filter.status = req.query.status; if (req.query.service) filter.service = req.query.service;
  res.json({ appointments: await Appointment.find(filter).populate('service user', 'name email studentId').sort({ appointmentDate: 1 }) });
});
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id });
  if (!appointment || !['pending', 'confirmed'].includes(appointment.status)) return res.status(409).json({ message: 'This appointment can no longer be cancelled.' });
  appointment.status = 'cancelled'; await appointment.save(); res.json({ appointment });
});
export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id }).populate('service');
  const date = normalizeDate(req.body.appointmentDate);
  if (!appointment || !['pending', 'confirmed'].includes(appointment.status) || date < normalizeDate(new Date()) || !appointment.service.availableSlots.includes(req.body.timeSlot)) return res.status(409).json({ message: 'This appointment cannot be rescheduled to that slot.' });
  const conflict = await Appointment.exists({ _id: { $ne: appointment._id }, service: appointment.service._id, appointmentDate: date, timeSlot: req.body.timeSlot, status: { $in: ['pending', 'confirmed'] } });
  if (conflict) return res.status(409).json({ message: 'That time is no longer available.' });
  appointment.appointmentDate = date; appointment.timeSlot = req.body.timeSlot; appointment.status = 'pending'; await appointment.save();
  await Notification.create({ user: req.user._id, message: 'Your appointment has been rescheduled and is awaiting confirmation.', type: 'appointment' });
  res.json({ appointment });
});
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }).populate('service');
  if (!appointment) return res.status(404).json({ message: 'Appointment not found.' });
  await Notification.create({ user: appointment.user, title: 'Appointment updated', message: `Your appointment with ${appointment.service.name} is ${appointment.status}.`, type: 'appointment' });
  res.json({ appointment });
});
