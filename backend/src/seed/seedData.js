import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Token from '../models/Token.js';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import Feedback from '../models/Feedback.js';

const services = [
  ['Library Issue and Return Desk', 'library-desk', 'LIB', 'Library', 'Issue, return, renew, and resolve questions about library resources.', 'Central Library · Ground Floor', 'Desk 2', 6, 35, ['09:30', '10:30', '11:30', '14:00', '15:00']],
  ['Accounts and Fee Office', 'accounts-fee-office', 'ACC', 'Administration', 'Get support with tuition fees, receipts, scholarships, and account queries.', 'Administration Block · Level 1', 'Desk 4', 10, 25, ['10:00', '11:00', '12:00', '14:30']],
  ['Placement Assistance Cell', 'placement-assistance', 'PLC', 'Placement', 'Resume reviews, interview guidance, employer drives, and placement support.', 'Career Centre · Level 2', 'Room 204', 15, 18, ['10:30', '12:00', '14:00', '15:30']],
  ['Campus Medical Room', 'campus-medical-room', 'MED', 'Health', 'First aid, basic consultations, health referrals, and wellness support.', 'Student Centre · East Wing', 'Clinic 1', 12, 20, ['09:00', '10:00', '11:00', '15:00']],
  ['Student Help Desk', 'student-help-desk', 'HLP', 'Administration', 'A friendly first stop for campus information and general student support.', 'Main Building · Lobby', 'Welcome Desk', 5, 40, ['09:30', '11:30', '13:30', '15:30']],
  ['Hostel Administration', 'hostel-administration', 'HST', 'Hostel', 'Room allocation, maintenance requests, leave forms, and hostel records.', 'Hostel Office · Block A', 'Desk 1', 9, 24, ['10:00', '11:00', '14:00', '16:00']],
  ['Canteen Pickup Counter', 'canteen-pickup', 'CAN', 'Food', 'Collect pre-ordered meals without waiting in the regular checkout line.', 'Campus Canteen · North Counter', 'Pickup 3', 3, 50, ['11:30', '12:00', '12:30', '13:00']],
  ['IT Support Desk', 'it-support', 'ITS', 'Technical Support', 'Help with campus Wi-Fi, account access, software, and device setup.', 'Technology Block · Ground Floor', 'Desk 6', 12, 20, ['09:30', '11:00', '14:30', '16:00']]
].map(([name, slug, code, category, description, location, deskNumber, averageServiceDuration, queueCapacity, availableSlots]) => ({
  name, slug, code, category, description, location, deskNumber, averageServiceDuration, queueCapacity, availableSlots,
  department: category, status: Math.random() > 0.2 ? 'open' : 'busy', queueOpen: true, contactEmail: `${slug}@campusflow.demo`,
  workingHours: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => ({ day, open: '09:00', close: '17:00' })),
  faqs: [{ question: 'What should I bring?', answer: 'Bring your college ID and any relevant receipts or documents.' }, { question: 'Can someone visit on my behalf?', answer: 'For privacy, most requests require the student to be present.' }]
}));

const run = async () => {
  await connectDatabase();
  await Promise.all([User.deleteMany(), Service.deleteMany(), Token.deleteMany(), Appointment.deleteMany(), Notification.deleteMany(), Feedback.deleteMany()]);
  const [student, admin, secondStudent] = await User.create([
    { name: 'Aarav Mehta', email: 'student@campusflow.demo', password: 'Student@123', studentId: 'CF2026001', department: 'Computer Science', yearOfStudy: 3 },
    { name: 'Maya Rao', email: 'admin@campusflow.demo', password: 'Admin@123', role: 'admin', department: 'Campus Operations' },
    { name: 'Nisha Kapoor', email: 'nisha@campusflow.demo', password: 'Student@123', studentId: 'CF2026002', department: 'Economics', yearOfStudy: 2 }
  ]);
  const createdServices = await Service.insertMany(services);
  const [library, accounts, placement, medical] = createdServices;
  const now = new Date();
  const tokens = await Token.create([
    { tokenNumber: 'LIB-021', user: secondStudent._id, service: library._id, visitReason: 'Return books', status: 'serving', queuePosition: 0, estimatedWaitTime: 0, servingAt: now },
    { tokenNumber: 'LIB-024', user: student._id, service: library._id, visitReason: 'Renew issued books', status: 'waiting', queuePosition: 3, estimatedWaitTime: 12 },
    { tokenNumber: 'ACC-012', user: secondStudent._id, service: accounts._id, visitReason: 'Fee receipt', status: 'waiting', queuePosition: 1, estimatedWaitTime: 0 },
    { tokenNumber: 'MED-007', user: student._id, service: medical._id, visitReason: 'Consultation', status: 'completed', queuePosition: 1, estimatedWaitTime: 8, completedAt: new Date(now - 86400000) }
  ]);
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
  const appointment = await Appointment.create({ user: student._id, service: placement._id, appointmentDate: tomorrow, timeSlot: '14:00', purpose: 'Resume review', status: 'confirmed' });
  await Notification.create([
    { user: student._id, title: 'Queue update', message: 'Only three students are ahead of you for the Library Desk.', type: 'queue' },
    { user: student._id, title: 'Appointment confirmed', message: 'Your Placement Assistance appointment is confirmed for tomorrow at 2:00 PM.', type: 'appointment' },
    { user: student._id, title: 'Welcome to CampusFlow', message: 'Your campus services are now one tap away.', type: 'success', read: true }
  ]);
  await Feedback.create({ user: student._id, service: medical._id, token: tokens[3]._id, rating: 5, tags: ['Helpful staff', 'Easy process'], comment: 'The nurse was thoughtful and the process was quick.' });
  process.stdout.write(`Seeded ${createdServices.length} services, demo users, queues, appointments, notifications, and feedback.\n`);
  await mongoose.disconnect();
};
run().catch(async (error) => { process.stderr.write(`${error.message}\n`); await mongoose.disconnect(); process.exit(1); });
