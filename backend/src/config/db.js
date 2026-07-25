import mongoose from 'mongoose';
import env from './env.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== 'production',
    });
    isConnected = true;
    console.log(`[MongoDB] Connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message);
    console.error('[MongoDB] Make sure MONGO_URI is set correctly in your .env file.');
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Disconnected');
    isConnected = false;
  });

  return mongoose.connection;
};

export default connectDB;
