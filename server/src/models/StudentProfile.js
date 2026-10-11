import mongoose from 'mongoose';

const StudentProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    classGrade: { type: Number, required: true, min: 6, max: 10, default: 8 },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi', 'bho'],
      default: 'en',
    },
    selectedSubjects: [{ type: String }],
    learningGoals: [{ type: String }],
    dailyGoalMinutes: { type: Number, default: 30 },
    streakCount: { type: Number, default: 1 },
    lastActiveDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model('StudentProfile', StudentProfileSchema);
