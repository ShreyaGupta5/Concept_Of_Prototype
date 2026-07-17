import { validationResult } from 'express-validator';
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ message: errors.array()[0].msg, errors: errors.array() });
  next();
};
