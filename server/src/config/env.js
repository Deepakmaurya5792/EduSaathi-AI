import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'edusaathi_development_secret_key_1234567890',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/edusaathi',
  aiProvider: process.env.AI_PROVIDER || 'demo',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  masteryThresholdFoundation: parseInt(process.env.MASTERY_THRESHOLD_FOUNDATION || '40', 10),
  masteryThresholdMastery: parseInt(process.env.MASTERY_THRESHOLD_MASTERY || '75', 10),
};
