import mongoose from 'mongoose';

const QuizQuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    questionText: { type: String, required: true },
    questionTextHi: { type: String },
    type: {
      type: String,
      enum: ['mcq', 'true_false', 'fill_blank', 'short_answer'],
      default: 'mcq',
      required: true,
    },
    options: [{ type: String }],
    optionsHi: [{ type: String }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    explanationHi: { type: String },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      required: true,
    },
    conceptTag: { type: String, required: true },
  },
  { _id: false }
);

const QuizSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    gradeLevel: { type: Number, required: true, min: 6, max: 10 },
    title: { type: String, required: true, trim: true },
    titleHi: { type: String },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'bho'],
      default: 'en',
    },
    questions: [QuizQuestionSchema],
    isAIGenerated: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeLimitMinutes: { type: Number, default: 10 },
  },
  { timestamps: true }
);

QuizSchema.index({ topicId: 1, difficulty: 1 });

export const Quiz = mongoose.model('Quiz', QuizSchema);
