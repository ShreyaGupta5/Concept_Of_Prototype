import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    process.stdout.write('MongoDB connected\n');
  } catch (error) {
    process.stderr.write(`MongoDB connection failed: ${error.message}\n`);
    process.exit(1);
  }
};
