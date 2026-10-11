import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { TopicMastery } from '../models/TopicMastery.js';
import { QuizAttempt } from '../models/QuizAttempt.js';

export const getAssignedStudents = async (_req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name email phone isDemoUser createdAt');
    const studentIds = students.map((s) => s._id);

    const profiles = await StudentProfile.find({ userId: { $in: studentIds } });
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    const masteries = await TopicMastery.find({ studentId: { $in: studentIds } });
    const attempts = await QuizAttempt.find({ studentId: { $in: studentIds } });

    const studentList = students.map((s) => {
      const sId = s._id.toString();
      const prof = profileMap.get(sId);
      const studentMasteries = masteries.filter((m) => m.studentId.toString() === sId);
      const studentAttempts = attempts.filter((a) => a.studentId.toString() === sId);

      const avgMastery =
        studentMasteries.length > 0
          ? Math.round(
              studentMasteries.reduce((sum, m) => sum + m.masteryScore, 0) /
                studentMasteries.length
            )
          : 0;

      const needsSupport = avgMastery > 0 && avgMastery < 50;

      return {
        id: s._id,
        name: s.name,
        email: s.email,
        classGrade: prof?.classGrade || 8,
        preferredLanguage: prof?.preferredLanguage || 'en',
        streakCount: prof?.streakCount || 0,
        averageMastery: avgMastery,
        totalQuizzes: studentAttempts.length,
        needsSupport,
        isDemoUser: s.isDemoUser,
      };
    });

    return res.status(200).json({ success: true, count: studentList.length, data: studentList });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentProgressDetail = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const profile = await StudentProfile.findOne({ userId: studentId });
    const masteries = await TopicMastery.find({ studentId })
      .populate('topicId', 'title titleHi gradeLevel')
      .populate('subjectId', 'name nameHi color');

    const attempts = await QuizAttempt.find({ studentId })
      .populate('quizId', 'title difficulty')
      .populate('topicId', 'title')
      .sort({ attemptedAt: -1 })
      .limit(10);

    const weakConcepts = attempts.flatMap((a) => a.gapAnalysis?.weakConcepts || []);
    const uniqueWeakConcepts = Array.from(new Set(weakConcepts)).filter(
      (c) => c && !c.includes('None')
    );

    return res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          classGrade: profile?.classGrade || 8,
          streakCount: profile?.streakCount || 0,
        },
        masteries,
        recentAttempts: attempts,
        identifiedGaps: uniqueWeakConcepts,
        remedialPlan: uniqueWeakConcepts.length > 0
          ? `Recommended remedial session covering: ${uniqueWeakConcepts.join(', ')}.`
          : 'Student demonstrates consistent mastery across covered topics.',
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getClassInsights = async (_req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    const masteries = await TopicMastery.find().populate('topicId', 'title gradeLevel');
    const attempts = await QuizAttempt.find();

    // Group mastery by topic
    const topicScoreMap = new Map();
    masteries.forEach((m) => {
      const topicTitle = m.topicId?.title || 'General';
      if (!topicScoreMap.has(topicTitle)) {
        topicScoreMap.set(topicTitle, { title: topicTitle, scores: [] });
      }
      topicScoreMap.get(topicTitle).scores.push(m.masteryScore);
    });

    const topicAverages = Array.from(topicScoreMap.values()).map((item) => ({
      topicTitle: item.title,
      averageScore: Math.round(
        item.scores.reduce((a, b) => a + b, 0) / item.scores.length
      ),
      studentCount: item.scores.length,
    }));

    // Score distribution
    const scoreRanges = {
      below40: attempts.filter((a) => a.accuracyPercentage < 40).length,
      between40and75: attempts.filter((a) => a.accuracyPercentage >= 40 && a.accuracyPercentage < 75).length,
      above75: attempts.filter((a) => a.accuracyPercentage >= 75).length,
    };

    const studentsNeedingAttention = students.length > 0
      ? Math.round((scoreRanges.below40 / Math.max(1, attempts.length)) * students.length)
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalStudents: students.length,
        totalQuizAttempts: attempts.length,
        topicAverages,
        scoreRanges,
        studentsNeedingAttention,
        recommendedActions: [
          'Schedule extra clarification for topics scoring below 50%.',
          'Encourage daily 15-minute practice streaks to reinforce memory retention.',
          'Review real-world analogies in Hindi for rural learners.',
        ],
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
