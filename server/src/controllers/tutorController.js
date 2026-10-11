import { TutorConversation } from '../models/TutorConversation.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Subject } from '../models/Subject.js';
import { Topic } from '../models/Topic.js';
import { TopicMastery } from '../models/TopicMastery.js';
import { AIProviderFactory } from '../services/aiProvider.js';

export const chatWithTutor = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      message,
      conversationId,
      subjectId,
      topicId,
      explanationLevel = 'intermediate',
      language = 'en',
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty.' });
    }

    const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
    const gradeLevel = studentProfile?.classGrade || 8;

    let subjectName = '';
    if (subjectId) {
      const subjectDoc = await Subject.findById(subjectId);
      if (subjectDoc) subjectName = subjectDoc.name;
    }

    let topicTitle = '';
    if (topicId) {
      const topicDoc = await Topic.findById(topicId);
      if (topicDoc) topicTitle = topicDoc.title;
    }

    let masteryScore = 50;
    if (topicId) {
      const masteryDoc = await TopicMastery.findOne({
        studentId: req.user._id,
        topicId,
      });
      if (masteryDoc) masteryScore = masteryDoc.masteryScore;
    }

    // Retrieve or create conversation
    let conversation = null;
    if (conversationId) {
      conversation = await TutorConversation.findOne({
        _id: conversationId,
        studentId: req.user._id,
      });
    }

    if (!conversation) {
      const snippet = message.slice(0, 32);
      conversation = new TutorConversation({
        studentId: req.user._id,
        subjectId: subjectId || undefined,
        topicId: topicId || undefined,
        title: snippet.length >= 32 ? `${snippet}...` : snippet,
        messages: [],
      });
    }

    // Call AI Provider
    const provider = AIProviderFactory.getProvider();
    const tutorResult = await provider.generateTutorResponse({
      studentMessage: message,
      studentName: req.user.name,
      gradeLevel,
      subjectName,
      topicTitle,
      masteryScore,
      language,
      explanationLevel,
      conversationHistory: conversation.messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      })),
    });

    const studentMsgId = `s_${Date.now()}`;
    const tutorMsgId = `t_${Date.now() + 1}`;

    conversation.messages.push({
      id: studentMsgId,
      sender: 'student',
      text: message,
      language,
      explanationLevel,
      timestamp: new Date(),
    });

    conversation.messages.push({
      id: tutorMsgId,
      sender: 'tutor',
      text: tutorResult.replyText,
      language,
      explanationLevel,
      suggestedFollowUps: tutorResult.suggestedFollowUps,
      isDemoFallback: tutorResult.isDemoFallback,
      timestamp: new Date(),
    });

    await conversation.save();

    return res.status(200).json({
      success: true,
      conversationId: conversation._id,
      reply: tutorResult.replyText,
      suggestedFollowUps: tutorResult.suggestedFollowUps,
      isDemoFallback: tutorResult.isDemoFallback,
      providerUsed: tutorResult.providerUsed,
      studentMessageId: studentMsgId,
      tutorMessageId: tutorMsgId,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const conversations = await TutorConversation.find({ studentId: req.user._id })
      .populate('subjectId', 'name nameHi icon')
      .populate('topicId', 'title titleHi')
      .sort({ updatedAt: -1 })
      .limit(20);

    return res.status(200).json({ success: true, count: conversations.length, data: conversations });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const conversation = await TutorConversation.findOne({
      _id: req.params.id,
      studentId: req.user._id,
    })
      .populate('subjectId', 'name nameHi')
      .populate('topicId', 'title titleHi');

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    return res.status(200).json({ success: true, data: conversation });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
