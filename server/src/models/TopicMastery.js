import mongoose from 'mongoose';

const TopicMasterySchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    masteryScore: { type: Number, required: true, min: 0, max: 100, default: 0 },
    accuracyAverage: { type: Number, required: true, min: 0, max: 100, default: 0 },
    totalAttempts: { type: Number, default: 0 },
    timeSpentMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['foundation', 'developing', 'mastered'],
      default: 'foundation',
    },
    lastAssessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

TopicMasterySchema.index({ studentId: 1, topicId: 1 }, { unique: true });
TopicMasterySchema.index({ studentId: 1, subjectId: 1 });

export const TopicMastery = mongoose.model('TopicMastery', TopicMasterySchema);
