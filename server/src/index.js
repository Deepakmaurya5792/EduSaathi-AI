import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedDatabaseIfEmpty } from './seed.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Security and middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost dev servers or configured CLIENT_URL
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiters for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});

const tutorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { success: false, message: 'AI tutoring rate limit reached. Please pause a moment.' },
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'EduSaathi AI',
    version: '1.0.0',
    sdgGoal: 'SDG 4 - Quality Education',
    aiProvider: config.aiProvider,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/tutor', tutorLimiter, tutorRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// Start Server and Connect DB
export const startServer = async () => {
  try {
    await connectDB();
    // Auto-seed if database is fresh so developer and evaluator get immediate full data
    await seedDatabaseIfEmpty();

    const server = app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`🚀 EduSaathi AI Server running on port ${config.port}`);
      console.log(`🎓 UN SDG 4 — Quality Education Platform`);
      console.log(`🤖 AI Provider: ${config.aiProvider}`);
      console.log(`🌐 Health check: http://localhost:${config.port}/api/health`);
      console.log(`====================================================`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
