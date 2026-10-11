import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { Topic } from '../models/Topic.js';
import { Subject } from '../models/Subject.js';
import { AIProviderFactory } from '../services/aiProvider.js';
import { AdaptiveLearningEngine } from '../services/adaptiveEngine.js';

export const generateQuiz = async (req, res) => {
  try {
    const {
      topicId,
      difficulty = 'medium',
      questionCount = 5,
      language = 'en',
    } = req.body;

    if (!topicId) {
      return res.status(400).json({ success: false, message: 'topicId is required.' });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found.' });
    }

    const subject = await Subject.findById(topic.subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found.' });
    }

    const provider = AIProviderFactory.getProvider();
    const rawQuestions = await provider.generateQuiz({
      gradeLevel: topic.gradeLevel,
      subjectName: subject.name,
      topicTitle: topic.title,
      difficulty,
      questionCount: parseInt(questionCount, 10) || 5,
      language,
    });

    // Validate generated questions
    const validatedQuestions = [];
    for (const q of rawQuestions) {
      if (q.questionText && q.correctAnswer && q.explanation) {
        validatedQuestions.push({
          id: q.id || `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          questionText: q.questionText,
          questionTextHi: q.questionTextHi,
          type: q.type || 'mcq',
          options: q.options || [],
          optionsHi: q.optionsHi,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          explanationHi: q.explanationHi,
          difficulty: q.difficulty || difficulty,
          conceptTag: q.conceptTag || topic.title.toLowerCase().replace(/\s+/g, '_'),
        });
      }
    }

    if (validatedQuestions.length === 0) {
      return res.status(500).json({ success: false, message: 'Failed to generate valid quiz questions.' });
    }

    const quiz = await Quiz.create({
      topicId: topic._id,
      subjectId: subject._id,
      gradeLevel: topic.gradeLevel,
      title: `${topic.title} — ${difficulty.toUpperCase()} Assessment`,
      titleHi: `${topic.titleHi} — क्विज`,
      difficulty,
      language,
      questions: validatedQuestions,
      isAIGenerated: true,
      createdBy: req.user?._id,
      timeLimitMinutes: Math.max(5, validatedQuestions.length * 2),
    });

    return res.status(201).json({
      success: true,
      message: 'Quiz generated successfully.',
      data: quiz,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const { topicId, grade, difficulty } = req.query;
    const query = {};
    if (topicId) query.topicId = topicId;
    if (grade) query.gradeLevel = parseInt(grade, 10);
    if (difficulty) query.difficulty = difficulty;

    const quizzes = await Quiz.find(query)
      .populate('topicId', 'title titleHi')
      .populate('subjectId', 'name nameHi icon color')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id)
      .populate('topicId', 'title titleHi prerequisites')
      .populate('subjectId', 'name nameHi icon color');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    return res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const submitQuizAttempt = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params; // quizId
    const { answers, timeTakenSeconds = 60 } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required.' });
    }

    const quiz = await Quiz.findById(id).populate('topicId').populate('subjectId');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    let correctCount = 0;
    const incorrectQuestions = [];
    const processedAnswers = [];

    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) continue;

      const isCorrect =
        ans.userAnswer?.toString().trim().toLowerCase() ===
        q.correctAnswer.toString().trim().toLowerCase();

      if (isCorrect) {
        correctCount++;
      } else {
        incorrectQuestions.push({
          questionText: q.questionText,
          userAnswer: ans.userAnswer,
          correctAnswer: q.correctAnswer,
          conceptTag: q.conceptTag,
        });
      }

      processedAnswers.push({
        questionId: q.id,
        userAnswer: ans.userAnswer,
        isCorrect,
        timeSpentSeconds: ans.timeSpentSeconds || 10,
      });
    }

    const totalQuestions = quiz.questions.length;
    const accuracyPercentage = Math.round((correctCount / totalQuestions) * 100);

    // Call AI / Adaptive Gap Analysis
    const provider = AIProviderFactory.getProvider();
    const gapAnalysis = await provider.analyzeGaps({
      subjectName: quiz.subjectId?.name || 'Subject',
      topicTitle: quiz.topicId?.title || 'Topic',
      score: correctCount,
      totalQuestions,
      incorrectQuestions,
      language: quiz.language,
    });

    const attempt = await QuizAttempt.create({
      studentId: req.user._id,
      quizId: quiz._id,
      topicId: quiz.topicId._id,
      subjectId: quiz.subjectId._id,
      answers: processedAnswers,
      score: correctCount,
      totalQuestions,
      accuracyPercentage,
      timeTakenSeconds,
      gapAnalysis,
      attemptedAt: new Date(),
    });

    // Update Adaptive Learning Mastery Score
    const updatedMastery = await AdaptiveLearningEngine.updateMastery(
      req.user._id.toString(),
      quiz.topicId._id.toString(),
      quiz.subjectId._id.toString(),
      accuracyPercentage,
      timeTakenSeconds
    );

    return res.status(200).json({
      success: true,
      message: 'Quiz attempt processed successfully.',
      data: {
        attemptId: attempt._id,
        score: correctCount,
        totalQuestions,
        accuracyPercentage,
        gapAnalysis,
        updatedMastery: {
          masteryScore: updatedMastery.masteryScore,
          status: updatedMastery.status,
          totalAttempts: updatedMastery.totalAttempts,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuizResults = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params; // attemptId
    const attempt = await QuizAttempt.findById(id)
      .populate('quizId')
      .populate('topicId', 'title titleHi')
      .populate('subjectId', 'name nameHi icon color');

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Quiz attempt not found.' });
    }

    return res.status(200).json({ success: true, data: attempt });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
