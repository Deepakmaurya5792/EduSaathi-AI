import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    gradeLevel: { type: Number, required: true, min: 6, max: 10 },
    title: { type: String, required: true, trim: true },
    titleHi: { type: String, required: true, trim: true },
    contentEn: { type: String, required: true },
    contentHi: { type: String, required: true },
    summaryEn: { type: String, required: true },
    summaryHi: { type: String, required: true },
    keyTakeawaysEn: [{ type: String }],
    keyTakeawaysHi: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    readingTimeMinutes: { type: Number, default: 5 },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

LessonSchema.index({ topicId: 1, order: 1 });

export const Lesson = mongoose.model('Lesson', LessonSchema);
