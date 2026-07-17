export const notFound = (req, res) => res.status(404).json({ message: `Route ${req.originalUrl} was not found.` });

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);
  const duplicate = error.code === 11000;
  const status = duplicate ? 409 : error.status || 500;
  const field = duplicate ? Object.keys(error.keyPattern || {})[0] : null;
  res.status(status).json({ message: duplicate ? `An account or booking with that ${field} already exists.` : error.message || 'Something went wrong. Please try again.' });
};
