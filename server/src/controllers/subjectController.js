import { Subject } from '../models/Subject.js';
import { Topic } from '../models/Topic.js';

export const getSubjects = async (_req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    return res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getTopicsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { grade } = req.query;

    const query = { subjectId };
    if (grade) {
      query.gradeLevel = parseInt(grade, 10);
    }

    const topics = await Topic.find(query).populate('prerequisites', 'title titleHi').sort({ order: 1 });
    return res.status(200).json({ success: true, count: topics.length, data: topics });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
