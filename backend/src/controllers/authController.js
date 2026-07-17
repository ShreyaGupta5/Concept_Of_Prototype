import User from '../models/User.js';
import { signToken, asyncHandler } from '../utils/helpers.js';

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, studentId: user.studentId, department: user.department, yearOfStudy: user.yearOfStudy, role: user.role, avatar: user.avatar });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, studentId, department, yearOfStudy } = req.body;
  if (await User.exists({ $or: [{ email: email.toLowerCase() }, { studentId }] })) return res.status(409).json({ message: 'That email or student ID is already registered.' });
  const user = await User.create({ name, email, password, studentId, department, yearOfStudy });
  res.status(201).json({ token: signToken(user._id), user: safeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchesPassword(req.body.password))) return res.status(401).json({ message: 'The email or password is incorrect.' });
  res.json({ token: signToken(user._id), user: safeUser(user) });
});

export const me = asyncHandler(async (req, res) => res.json({ user: safeUser(req.user) }));
export const updateProfile = asyncHandler(async (req, res) => {
  ['name', 'department', 'yearOfStudy', 'avatar'].forEach((key) => { if (req.body[key] !== undefined) req.user[key] = req.body[key]; });
  await req.user.save();
  res.json({ user: safeUser(req.user) });
});
