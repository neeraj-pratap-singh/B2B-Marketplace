import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Extend global type for MongoDB client
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Mongoose connection for ODM
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise;
  const db = client.db('b2b-marketplace');
  return { client, db };
}

export async function connectMongoose() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    if (cached) {
      cached.promise = mongoose.connect(uri, opts);
    }
  }

  try {
    if (cached?.promise) {
      cached.conn = await cached.promise;
      return cached.conn;
    }
  } catch (e) {
    if (cached) {
      cached.promise = null;
    }
    throw e;
  }

  return mongoose;
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { client } = await connectToDatabase();
    await client.db('admin').command({ ping: 1 });
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Close database connections
export async function closeDatabaseConnections() {
  try {
    if (cached?.conn) {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
    }
    
    const client = await clientPromise;
    await client.close();
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
}

export default clientPromise; 