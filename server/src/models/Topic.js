import mongoose from 'mongoose';

const TopicSchema = new mongoose.Schema(
  {
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true, trim: true },
    titleHi: { type: String, required: true, trim: true },
    gradeLevel: { type: Number, required: true, min: 6, max: 10 },
    order: { type: Number, default: 1 },
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    description: { type: String, required: true },
    descriptionHi: { type: String, required: true },
  },
  { timestamps: true }
);

TopicSchema.index({ subjectId: 1, gradeLevel: 1, order: 1 });

export const Topic = mongoose.model('Topic', TopicSchema);
