import { Lesson } from '../models/Lesson.js';
import { Bookmark } from '../models/Bookmark.js';

export const getLessons = async (req, res) => {
  try {
    const { topicId, subjectId, grade, difficulty, search } = req.query;

    const query = {};
    if (topicId) query.topicId = topicId;
    if (subjectId) query.subjectId = subjectId;
    if (grade) query.gradeLevel = parseInt(grade, 10);
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleHi: { $regex: search, $options: 'i' } },
        { summaryEn: { $regex: search, $options: 'i' } },
      ];
    }

    const lessons = await Lesson.find(query)
      .populate('topicId', 'title titleHi')
      .populate('subjectId', 'name nameHi icon color')
      .sort({ order: 1 });

    return res.status(200).json({ success: true, count: lessons.length, data: lessons });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id)
      .populate('topicId', 'title titleHi prerequisites')
      .populate('subjectId', 'name nameHi icon color');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    return res.status(200).json({ success: true, data: lesson });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params; // lessonId
    const existing = await Bookmark.findOne({
      studentId: req.user._id,
      lessonId: id,
    });

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      return res.status(200).json({ success: true, isBookmarked: false, message: 'Bookmark removed.' });
    } else {
      await Bookmark.create({
        studentId: req.user._id,
        lessonId: id,
      });
      return res.status(201).json({ success: true, isBookmarked: true, message: 'Lesson bookmarked.' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const bookmarks = await Bookmark.find({ studentId: req.user._id }).populate({
      path: 'lessonId',
      populate: [
        { path: 'topicId', select: 'title titleHi' },
        { path: 'subjectId', select: 'name nameHi icon color' },
      ],
    });

    return res.status(200).json({
      success: true,
      data: bookmarks.map((b) => b.lessonId).filter(Boolean),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
