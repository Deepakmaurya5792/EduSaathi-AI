import { TopicMastery } from '../models/TopicMastery.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Subject } from '../models/Subject.js';
import { AdaptiveLearningEngine } from '../services/adaptiveEngine.js';

export const getProgressOverview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const studentId = req.user._id;
    const profile = await StudentProfile.findOne({ userId: studentId });
    const attempts = await QuizAttempt.find({ studentId });
    const masteries = await TopicMastery.find({ studentId });

    const totalQuizzes = attempts.length;
    const totalQuestions = attempts.reduce((acc, a) => acc + a.totalQuestions, 0);
    const totalCorrect = attempts.reduce((acc, a) => acc + a.score, 0);
    const averageAccuracy =
      totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const totalTimeMinutes = masteries.reduce((acc, m) => acc + m.timeSpentMinutes, 0);

    const masteredCount = masteries.filter((m) => m.status === 'mastered').length;
    const developingCount = masteries.filter((m) => m.status === 'developing').length;
    const foundationCount = masteries.filter((m) => m.status === 'foundation').length;

    return res.status(200).json({
      success: true,
      data: {
        streakCount: profile?.streakCount || 1,
        dailyGoalMinutes: profile?.dailyGoalMinutes || 30,
        totalQuizzes,
        averageAccuracy,
        totalTimeMinutes,
        masteredCount,
        developingCount,
        foundationCount,
        classGrade: profile?.classGrade || 8,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSubjectProgress = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const studentId = req.user._id;
    const subjects = await Subject.find();
    const masteries = await TopicMastery.find({ studentId });

    const result = subjects.map((subj) => {
      const subjMasteries = masteries.filter(
        (m) => m.subjectId && m.subjectId.toString() === subj._id.toString()
      );
      const count = subjMasteries.length;
      const avgMastery =
        count > 0
          ? Math.round(
              subjMasteries.reduce((sum, m) => sum + m.masteryScore, 0) / count
            )
          : 0;

      return {
        subjectId: subj._id,
        name: subj.name,
        nameHi: subj.nameHi,
        color: subj.color,
        icon: subj.icon,
        averageMastery: avgMastery,
        topicsAttempted: count,
      };
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getWeakTopics = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const weakRecords = await AdaptiveLearningEngine.getWeakTopics(req.user._id.toString());
    return res.status(200).json({ success: true, data: weakRecords });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const gradeLevel = profile?.classGrade || 8;

    const recommendations = await AdaptiveLearningEngine.getRecommendations(
      req.user._id.toString(),
      gradeLevel
    );

    return res.status(200).json({ success: true, data: recommendations });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuizHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const attempts = await QuizAttempt.find({ studentId: req.user._id })
      .populate('quizId', 'title titleHi difficulty')
      .populate('topicId', 'title titleHi')
      .populate('subjectId', 'name nameHi color')
      .sort({ attemptedAt: -1 })
      .limit(15);

    return res.status(200).json({ success: true, count: attempts.length, data: attempts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
