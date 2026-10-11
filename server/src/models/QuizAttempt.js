import mongoose from 'mongoose';

const QuizAnswerSubmissionSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    userAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    timeSpentSeconds: { type: Number, default: 0 },
  },
  { _id: false }
);

const QuizAttemptSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    answers: [QuizAnswerSubmissionSchema],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    accuracyPercentage: { type: Number, required: true },
    timeTakenSeconds: { type: Number, default: 0 },
    gapAnalysis: {
      weakConcepts: [{ type: String }],
      strongConcepts: [{ type: String }],
      remedialAdvice: { type: String, default: '' },
      remedialAdviceHi: { type: String },
    },
    attemptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

QuizAttemptSchema.index({ studentId: 1, topicId: 1, attemptedAt: -1 });

export const QuizAttempt = mongoose.model('QuizAttempt', QuizAttemptSchema);
