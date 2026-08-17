import mongoose from 'mongoose';

// Fail fast instead of hanging forever: if Mongo is unreachable, queued
// operations (find/create/etc.) used to hang indefinitely because Mongoose
// buffers commands by default while disconnected. bufferCommands:false makes
// those calls reject immediately with a clear error instead of hanging the
// HTTP request (and the client) forever.
mongoose.set('bufferCommands', false);

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectWithRetry = async (attempt = 1) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000, // fail fast if the cluster is unreachable
      socketTimeoutMS: 20000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`);
    if (attempt >= MAX_RETRIES) {
      console.error('MongoDB connection failed after maximum retries. Exiting.');
      process.exit(1);
    }
    setTimeout(() => connectWithRetry(attempt + 1), RETRY_DELAY_MS);
  }
};

const connectDB = () => connectWithRetry();

export default connectDB;
