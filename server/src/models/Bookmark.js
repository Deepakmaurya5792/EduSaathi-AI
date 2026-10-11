import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

BookmarkSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

export const Bookmark = mongoose.model('Bookmark', BookmarkSchema);
