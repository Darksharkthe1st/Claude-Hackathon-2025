import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app.js';
import connectDB from './config/db.js';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : undefined });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

startServer();

