import React, { useState, useEffect } from 'react';
import {
  Flame,
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Compass,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';

export const StudentDashboard = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const { language, t } = useLanguage();

  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [quickQuestion, setQuickQuestion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ovRes, subRes, recRes, qRes] = await Promise.allSettled([
          api.getProgressOverview(),
          api.getSubjectProgress(),
          api.getRecommendations(),
          api.getQuizHistory(),
        ]);

        if (ovRes.status === 'fulfilled' && ovRes.value?.success) {
          setOverview(ovRes.value.data);
        }
        if (subRes.status === 'fulfilled' && subRes.value?.success) {
          setSubjects(subRes.value.data);
        }
        if (recRes.status === 'fulfilled' && recRes.value?.success) {
          setRecommendations(recRes.value.data);
        }
        if (qRes.status === 'fulfilled' && qRes.value?.success) {
          setRecentQuizzes(qRes.value.data);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAskTutorSubmit = (e) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    onNavigate('tutor', { initialMessage: quickQuestion });
  };

  const topRecommendation = recommendations[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-teal-700 p-6 sm:p-8 text-white shadow-xl shadow-brand-600/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-3">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Class {profile?.classGrade || 8} • CBSE / State Board Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('welcomeBack')}, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-brand-100">
            {language === 'hi'
              ? 'आज आप क्या नया सीखना चाहते हैं? आपका एआई एडूसाथी हर कदम पर मदद के लिए तैयार है।'
              : 'What would you like to master today? Your AI EduSaathi is ready to guide you step-by-step.'}
          </p>

          {/* Quick Ask Tutor Input */}
          <form onSubmit={handleAskTutorSubmit} className="mt-6 flex items-center gap-2 max-w-lg">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder={t('tutorPlaceholder')}
                className="w-full pl-4 pr-10 py-3 rounded-xl text-sm bg-white/95 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-md"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </form>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
          <BookOpen className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Metrics Row: Streak, Quizzes, Accuracy, Time */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {overview?.streakCount || profile?.streakCount || 1} Days
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('dayStreak')}</div>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {overview?.averageAccuracy || 88}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('averageAccuracy')}</div>
          </div>
        </div>

        {/* Quizzes Completed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {overview?.totalQuizzes || recentQuizzes.length || 3}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('quizzesSolved')}</div>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {profile?.dailyGoalMinutes || 30} min
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('dailyGoal')}</div>
          </div>
        </div>
      </div>

      {/* Adaptive Recommendation Spotlight */}
      {topRecommendation && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-teal-500/10 border border-amber-300 dark:border-amber-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  {t('recommendedNext')}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Mastery: {topRecommendation.currentMastery}%
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                {language === 'hi' ? topRecommendation.topicTitleHi : topRecommendation.topicTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
                {language === 'hi'
                  ? topRecommendation.actionableMessageHi
                  : topRecommendation.actionableMessageEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
            {topRecommendation.suggestedLessonId && (
              <button
                onClick={() => onNavigate('library', { lessonId: topRecommendation.suggestedLessonId })}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center gap-1.5 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('startLesson')}</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('quizzes', { topicId: topRecommendation.topicId })}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>{t('takeQuiz')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Subject Mastery Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Subject Mastery & Topics
          </h2>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {subjects.map((subj) => (
            <div
              key={subj.subjectId}
              onClick={() => onNavigate('library', { subjectId: subj.subjectId })}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/50 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                  {language === 'hi' ? subj.nameHi : subj.name}
                </span>
                <span
                  className="text-xs font-black px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: subj.color || '#2563EB' }}
                >
                  {subj.averageMastery}%
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${subj.averageMastery}%`,
                    backgroundColor: subj.color || '#2563EB',
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>{subj.topicsAttempted} Topics Mastered</span>
                <span className="text-brand-600 dark:text-brand-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Learn <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Quizzes & Practice History */}
      {recentQuizzes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Recent Assessments
            </h2>
            <button
              onClick={() => onNavigate('quizzes')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Quiz Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {recentQuizzes.slice(0, 3).map((item) => (
              <div key={item._id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      item.accuracyPercentage >= 75
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : item.accuracyPercentage >= 40
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {item.accuracyPercentage}%
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.quizId?.title || item.topicId?.title || 'Practice Quiz'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Score: {item.score} / {item.totalQuestions} • {Math.round(item.timeTakenSeconds || 0)}s taken
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('quizzes', { quizId: item.quizId?._id })}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-test</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
