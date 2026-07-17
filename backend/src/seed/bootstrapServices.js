import Service from '../models/Service.js';

const serviceDefinitions = [
  ['Library Issue and Return Desk', 'library-desk', 'LIB', 'Library', 'Issue, return, renew, and resolve questions about library resources.', 'Central Library - Ground Floor', 'Desk 2', 6, 35, ['09:30', '10:30', '11:30', '14:00', '15:00']],
  ['Accounts and Fee Office', 'accounts-fee-office', 'ACC', 'Administration', 'Get support with tuition fees, receipts, scholarships, and account queries.', 'Administration Block - Level 1', 'Desk 4', 10, 25, ['10:00', '11:00', '12:00', '14:30']],
  ['Placement Assistance Cell', 'placement-assistance', 'PLC', 'Placement', 'Resume reviews, interview guidance, employer drives, and placement support.', 'Career Centre - Level 2', 'Room 204', 15, 18, ['10:30', '12:00', '14:00', '15:30']],
  ['Campus Medical Room', 'campus-medical-room', 'MED', 'Health', 'First aid, basic consultations, health referrals, and wellness support.', 'Student Centre - East Wing', 'Clinic 1', 12, 20, ['09:00', '10:00', '11:00', '15:00']],
  ['Student Help Desk', 'student-help-desk', 'HLP', 'Administration', 'A friendly first stop for campus information and general student support.', 'Main Building - Lobby', 'Welcome Desk', 5, 40, ['09:30', '11:30', '13:30', '15:30']],
  ['Hostel Administration', 'hostel-administration', 'HST', 'Hostel', 'Room allocation, maintenance requests, leave forms, and hostel records.', 'Hostel Office - Block A', 'Desk 1', 9, 24, ['10:00', '11:00', '14:00', '16:00']],
  ['Canteen Pickup Counter', 'canteen-pickup', 'CAN', 'Food', 'Collect pre-ordered meals without waiting in the regular checkout line.', 'Campus Canteen - North Counter', 'Pickup 3', 3, 50, ['11:30', '12:00', '12:30', '13:00']],
  ['IT Support Desk', 'it-support', 'ITS', 'Technical Support', 'Help with campus Wi-Fi, account access, software, and device setup.', 'Technology Block - Ground Floor', 'Desk 6', 12, 20, ['09:30', '11:00', '14:30', '16:00']]
];

const defaultServices = serviceDefinitions.map(([
  name,
  slug,
  code,
  category,
  description,
  location,
  deskNumber,
  averageServiceDuration,
  queueCapacity,
  availableSlots
]) => ({
  name,
  slug,
  code,
  category,
  description,
  location,
  deskNumber,
  averageServiceDuration,
  queueCapacity,
  availableSlots,
  department: category,
  status: 'open',
  queueOpen: true,
  contactEmail: `${slug}@campusflow.demo`,
  workingHours: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => ({
    day,
    open: '09:00',
    close: '17:00'
  })),
  faqs: [
    { question: 'What should I bring?', answer: 'Bring your college ID and any relevant receipts or documents.' },
    { question: 'Can someone visit on my behalf?', answer: 'For privacy, most requests require the student to be present.' }
  ]
}));

export const ensureDefaultServices = async () => {
  if (await Service.exists({})) return;

  try {
    const createdServices = await Service.insertMany(defaultServices);
    process.stdout.write(`Initialized ${createdServices.length} default campus services.\n`);
  } catch (error) {
    if (error?.code === 11000 && await Service.exists({})) return;
    throw error;
  }
};