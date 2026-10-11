import mongoose from 'mongoose';

const TutorMessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    sender: {
      type: String,
      enum: ['student', 'tutor'],
      required: true,
    },
    text: { type: String, required: true },
    language: {
      type: String,
      enum: ['en', 'hi', 'bho'],
      default: 'en',
    },
    explanationLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    suggestedFollowUps: [{ type: String }],
    isDemoFallback: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TutorConversationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    title: { type: String, required: true, default: 'Learning Discussion' },
    messages: [TutorMessageSchema],
  },
  { timestamps: true }
);

TutorConversationSchema.index({ studentId: 1, updatedAt: -1 });

export const TutorConversation = mongoose.model('TutorConversation', TutorConversationSchema);
