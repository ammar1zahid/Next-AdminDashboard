// app/lib/utils.js
import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;
console.log('Using MONGO_URI:', process.env.MONGO_URI ? 'present' : 'missing');

if (!mongoURI) throw new Error('MONGO_URI is not defined in environment variables');

function getGlobal() {
  // eslint-disable-next-line no-undef
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof global !== 'undefined') return global;
  if (typeof window !== 'undefined') return window;
  return Function('return this')();
}

const globalWithMongoose = getGlobal();
if (!globalWithMongoose.__mongoose) {
  globalWithMongoose.__mongoose = { conn: null, promise: null, listenersAttached: false };
}
const cached = globalWithMongoose.__mongoose;

export async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoURI).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;

    if (!cached.listenersAttached) {
      mongoose.connection.on('connected', () => console.log('MongoDB connected'));
      mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
      mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
      cached.listenersAttached = true;
    }

    console.log('Database connected');
    return cached.conn;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

export default connect;
