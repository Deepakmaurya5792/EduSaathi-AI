import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env.js';

let mongod = null;

export const connectDB = async () => {
  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${config.mongoUri}`);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('[Database] Connected to external MongoDB successfully.');
  } catch (err) {
    console.warn(`[Database] Could not connect to external MongoDB: ${err.message}`);
    console.log('[Database] Starting in-memory MongoDB server for seamless zero-config development...');
    
    try {
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] In-memory MongoDB started and connected at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[Database] Fatal: Failed to initialize in-memory MongoDB:', memErr);
      throw memErr;
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('[Database] Disconnected cleanly.');
  } catch (err) {
    console.error('[Database] Disconnect error:', err);
  }
};
