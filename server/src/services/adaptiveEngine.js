import { config } from '../config/env.js';
import { TopicMastery } from '../models/TopicMastery.js';
import { Topic } from '../models/Topic.js';
import { Lesson } from '../models/Lesson.js';
import { QuizAttempt } from '../models/QuizAttempt.js';

export class AdaptiveLearningEngine {
  /**
   * Updates or initializes a student's mastery score for a given topic
   * using an exponential moving average weighted by quiz accuracy and attempt counts.
   */
  static async updateMastery(studentId, topicId, subjectId, latestAccuracy, timeSpentSeconds) {
    let masteryRecord = await TopicMastery.findOne({ studentId, topicId });
    const timeSpentMinutes = Math.round((timeSpentSeconds || 0) / 60);

    if (!masteryRecord) {
      // First attempt
      const initialScore = Math.round(latestAccuracy);
      const status =
        initialScore >= config.masteryThresholdMastery
          ? 'mastered'
          : initialScore >= config.masteryThresholdFoundation
          ? 'developing'
          : 'foundation';

      masteryRecord = new TopicMastery({
        studentId,
        topicId,
        subjectId,
        masteryScore: initialScore,
        accuracyAverage: initialScore,
        totalAttempts: 1,
        timeSpentMinutes,
        status,
        lastAssessedAt: new Date(),
      });
    } else {
      // Update with weighted score (60% existing mastery + 40% latest attempt)
      const currentScore = masteryRecord.masteryScore;
      const newScore = Math.min(
        100,
        Math.max(0, Math.round(currentScore * 0.6 + latestAccuracy * 0.4))
      );

      const totalAttempts = masteryRecord.totalAttempts + 1;
      const newAvg = Math.round(
        (masteryRecord.accuracyAverage * masteryRecord.totalAttempts + latestAccuracy) /
          totalAttempts
      );

      const status =
        newScore >= config.masteryThresholdMastery
          ? 'mastered'
          : newScore >= config.masteryThresholdFoundation
          ? 'developing'
          : 'foundation';

      masteryRecord.masteryScore = newScore;
      masteryRecord.accuracyAverage = newAvg;
      masteryRecord.totalAttempts = totalAttempts;
      masteryRecord.timeSpentMinutes += timeSpentMinutes;
      masteryRecord.status = status;
      masteryRecord.lastAssessedAt = new Date();
    }

    await masteryRecord.save();
    return masteryRecord;
  }

  /**
   * Generates transparent, explainable recommendations for the student
   * based on their actual topic mastery scores and prerequisite graph.
   */
  static async getRecommendations(studentId, gradeLevel) {
    // 1. Fetch all topics for the student's grade level
    const topics = await Topic.find({ gradeLevel }).sort({ order: 1 });
    if (!topics || !topics.length) return [];

    // 2. Fetch all existing mastery records for the student
    const masteryRecords = await TopicMastery.find({ studentId });
    const masteryMap = new Map();
    masteryRecords.forEach((m) => {
      masteryMap.set(m.topicId.toString(), m.masteryScore);
    });

    const recommendations = [];

    for (const topic of topics) {
      const topicIdStr = topic._id.toString();
      const score = masteryMap.get(topicIdStr);

      // Check prerequisites
      let unfulfilledPrereq = null;
      if (topic.prerequisites && topic.prerequisites.length > 0) {
        for (const prereqId of topic.prerequisites) {
          const prereqScore = masteryMap.get(prereqId.toString()) ?? 0;
          if (prereqScore < config.masteryThresholdFoundation) {
            unfulfilledPrereq = await Topic.findById(prereqId);
            break;
          }
        }
      }

      // If a critical prerequisite is weak, alert immediately!
      if (unfulfilledPrereq) {
        const lesson = await Lesson.findOne({ topicId: unfulfilledPrereq._id });
        recommendations.push({
          topicId: topicIdStr,
          topicTitle: topic.title,
          topicTitleHi: topic.titleHi,
          subjectId: topic.subjectId ? topic.subjectId.toString() : '',
          currentMastery: score ?? 0,
          recommendationType: 'prerequisite_alert',
          actionableMessageEn: `Before diving into ${topic.title}, strengthen foundational concepts in "${unfulfilledPrereq.title}".`,
          actionableMessageHi: `${topic.titleHi} शुरू करने से पहले "${unfulfilledPrereq.titleHi}" की बुनियादी समझ मजबूत करें।`,
          suggestedLessonId: lesson?._id?.toString(),
          suggestedDifficulty: 'easy',
        });
        continue;
      }

      // If topic has not been started yet
      if (score === undefined) {
        const lesson = await Lesson.findOne({ topicId: topic._id });
        recommendations.push({
          topicId: topicIdStr,
          topicTitle: topic.title,
          topicTitleHi: topic.titleHi,
          subjectId: topic.subjectId ? topic.subjectId.toString() : '',
          currentMastery: 0,
          recommendationType: 'guided_practice',
          actionableMessageEn: `Ready to start ${topic.title}! Begin with foundational concepts and everyday examples.`,
          actionableMessageHi: `${topic.titleHi} शुरू करने का सही समय! दैनिक उदाहरणों और सरल परिभाषा से शुरुआत करें।`,
          suggestedLessonId: lesson?._id?.toString(),
          suggestedDifficulty: 'easy',
        });
        continue;
      }

      // Topic has been attempted: apply threshold rules
      const lesson = await Lesson.findOne({ topicId: topic._id });

      if (score < config.masteryThresholdFoundation) {
        // Foundation needs review (<40%)
        recommendations.push({
          topicId: topicIdStr,
          topicTitle: topic.title,
          topicTitleHi: topic.titleHi,
          subjectId: topic.subjectId ? topic.subjectId.toString() : '',
          currentMastery: score,
          recommendationType: 'foundation_review',
          actionableMessageEn: `Mastery is at ${score}%. Revise foundational summary notes for ${topic.title} before attempting the next quiz.`,
          actionableMessageHi: `दक्षता ${score}% है। अगला क्विज देने से पहले ${topic.titleHi} के मुख्य नोट्स और सरल उदाहरण दोबारा पढ़ें।`,
          suggestedLessonId: lesson?._id?.toString(),
          suggestedDifficulty: 'easy',
        });
      } else if (score < config.masteryThresholdMastery) {
        // Developing (40% - 75%)
        recommendations.push({
          topicId: topicIdStr,
          topicTitle: topic.title,
          topicTitleHi: topic.titleHi,
          subjectId: topic.subjectId ? topic.subjectId.toString() : '',
          currentMastery: score,
          recommendationType: 'guided_practice',
          actionableMessageEn: `Good progress in ${topic.title} (${score}%). Solve medium-level practice questions to achieve complete mastery.`,
          actionableMessageHi: `${topic.titleHi} में अच्छी प्रगति (${score}%)। पूर्ण पकड़ बनाने के लिए मध्यम स्तर के अभ्यास प्रश्न हल करें।`,
          suggestedLessonId: lesson?._id?.toString(),
          suggestedDifficulty: 'medium',
        });
      } else {
        // Mastered (>75%)
        recommendations.push({
          topicId: topicIdStr,
          topicTitle: topic.title,
          topicTitleHi: topic.titleHi,
          subjectId: topic.subjectId ? topic.subjectId.toString() : '',
          currentMastery: score,
          recommendationType: 'advance_next',
          actionableMessageEn: `Excellent! You've mastered ${topic.title} (${score}%). Ready for challenging questions and the next chapter!`,
          actionableMessageHi: `अति उत्तम! ${topic.titleHi} पर आपकी मजबूत पकड़ (${score}%) है। अब आप अगले अध्याय की ओर बढ़ सकते हैं!`,
          suggestedLessonId: lesson?._id?.toString(),
          suggestedDifficulty: 'hard',
        });
      }
    }

    return recommendations.slice(0, 6);
  }

  /**
   * Retrieves topics where student scored below foundation threshold (<40%)
   * to highlight knowledge gaps on student & teacher dashboards.
   */
  static async getWeakTopics(studentId) {
    const records = await TopicMastery.find({
      studentId,
      masteryScore: { $lt: config.masteryThresholdFoundation },
    })
      .populate('topicId')
      .populate('subjectId')
      .sort({ masteryScore: 1 })
      .limit(5);

    return records;
  }
}
