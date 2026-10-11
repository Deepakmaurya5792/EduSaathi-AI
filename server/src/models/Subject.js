import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameHi: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, required: true, default: 'BookOpen' },
    color: { type: String, required: true, default: '#2563EB' },
    description: { type: String, required: true },
    descriptionHi: { type: String, required: true },
    gradeLevels: [{ type: Number, min: 6, max: 10 }],
  },
  { timestamps: true }
);

export const Subject = mongoose.model('Subject', SubjectSchema);
