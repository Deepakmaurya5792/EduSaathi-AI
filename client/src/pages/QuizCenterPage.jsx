import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  Play,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';

export const QuizCenterPage = ({
  initialTopicId,
  initialQuizId,
  onNavigateTutor,
}) => {
  const { profile } = useAuth();
  const { language, t } = useLanguage();

  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Generator modal state
  const [showGenerator, setShowGenerator] = useState(false);
  const [genSubjectId, setGenSubjectId] = useState('');
  const [genTopics, setGenTopics] = useState([]);
  const [genTopicId, setGenTopicId] = useState(initialTopicId || '');
  const [genDifficulty, setGenDifficulty] = useState('medium');
  const [genCount, setGenCount] = useState(4);
  const [generating, setGenerating] = useState(false);

  // Active quiz runner state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [qRes, sRes] = await Promise.allSettled([
          api.getQuizzes(),
          api.getSubjects(),
        ]);

        if (qRes.status === 'fulfilled' && qRes.value?.success) {
          setQuizzes(qRes.value.data);
          if (initialQuizId) {
            const found = qRes.value.data.find((q) => q._id === initialQuizId);
            if (found) startQuiz(found);
          }
        }

        if (sRes.status === 'fulfilled' && sRes.value?.success) {
          setSubjects(sRes.value.data);
          if (sRes.value.data.length > 0 && !genSubjectId) {
            setGenSubjectId(sRes.value.data[0]._id);
          }
        }
      } catch (e) {
        console.warn('Quiz center load error:', e);
      }
    };

    init();
  }, [initialQuizId]);

  useEffect(() => {
    if (!genSubjectId) return;
    const loadTopics = async () => {
      try {
        const res = await api.getTopicsBySubject(genSubjectId, profile?.classGrade || 8);
        if (res.success) {
          setGenTopics(res.data);
          if (res.data.length > 0) setGenTopicId(res.data[0]._id);
        }
      } catch (e) {
        console.warn('Topics load error:', e);
      }
    };
    loadTopics();
  }, [genSubjectId]);

  useEffect(() => {
    let interval = null;
    if (activeQuiz && !quizSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuiz, quizSubmitted]);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimerSeconds(0);
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const handleSelectAnswer = (questionId, answer) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || submitting) return;
    setSubmitting(true);

    const answersPayload = activeQuiz.questions.map((q) => ({
      questionId: q.id,
      userAnswer: userAnswers[q.id] || '',
      timeSpentSeconds: Math.round(timerSeconds / activeQuiz.questions.length),
    }));

    try {
      const res = await api.submitQuiz(activeQuiz._id, answersPayload, timerSeconds);
      if (res.success) {
        setQuizResult(res.data);
        setQuizSubmitted(true);

        if (res.data.accuracyPercentage >= 75) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (e) {
      alert(`Submission error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!genTopicId) return;
    setGenerating(true);

    try {
      const res = await api.generateQuiz({
        topicId: genTopicId,
        difficulty: genDifficulty,
        questionCount: genCount,
        language,
      });

      if (res.success && res.data) {
        setQuizzes((prev) => [res.data, ...prev]);
        setShowGenerator(false);
        startQuiz(res.data);
      }
    } catch (e) {
      alert(`AI Quiz Generator Error: ${e.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {activeQuiz ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {activeQuiz.difficulty.toUpperCase()} Assessment • Class {activeQuiz.gradeLevel}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {language === 'hi' && activeQuiz.titleHi ? activeQuiz.titleHi : activeQuiz.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-brand-500" />
                <span>
                  {Math.floor(timerSeconds / 60)}:
                  {timerSeconds % 60 < 10 ? `0${timerSeconds % 60}` : timerSeconds % 60}
                </span>
              </div>

              <button
                onClick={() => setActiveQuiz(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Exit Quiz
              </button>
            </div>
          </div>

          {!quizSubmitted ? (
            <div>
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                {activeQuiz.questions.map((q, idx) => {
                  const answered = !!userAnswers[q.id];
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition shrink-0 ${
                        isCurrent
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 ring-2 ring-brand-300'
                          : answered
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {(() => {
                const q = activeQuiz.questions[currentQuestionIndex];
                if (!q) return null;
                const selected = userAnswers[q.id];

                return (
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                        {language === 'hi' && q.questionTextHi ? q.questionTextHi : q.questionText}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {(q.options || ['True', 'False']).map((opt, oIdx) => {
                        const isChosen = selected === opt;
                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-4 rounded-2xl border text-sm font-semibold cursor-pointer transition flex items-center justify-between ${
                              isChosen
                                ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/60 dark:border-brand-500 dark:text-brand-100 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-300'
                            }`}
                          >
                            <span>{opt}</span>
                            {isChosen && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition"
                      >
                        Previous
                      </button>

                      {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={submitting}
                          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25 transition"
                        >
                          {submitting ? 'Evaluating...' : 'Submit Answers'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 border border-brand-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-brand-500/30">
                    {quizResult?.accuracyPercentage}%
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {quizResult && quizResult.accuracyPercentage >= 75
                        ? 'Mastery Achieved! 🎉'
                        : quizResult && quizResult.accuracyPercentage >= 40
                        ? 'Good Effort! Keep Practicing'
                        : 'Foundational Review Needed'}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      You scored {quizResult?.score} out of {quizResult?.totalQuestions} questions correctly.
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                    Updated Topic Mastery
                  </span>
                  <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                    {quizResult?.updatedMastery?.masteryScore}%
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      Personalized Remedial Advice
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {language === 'hi' && quizResult?.gapAnalysis?.remedialAdviceHi
                        ? quizResult.gapAnalysis.remedialAdviceHi
                        : quizResult?.gapAnalysis?.remedialAdvice}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Detailed Answer Review
                </h4>
                {activeQuiz.questions.map((q, idx) => {
                  const userAns = userAnswers[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-sm ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900'
                          : 'border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {idx + 1}. {language === 'hi' && q.questionTextHi ? q.questionTextHi : q.questionText}
                        </span>
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </div>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-slate-500">Your answer: </span>
                          <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {userAns || '(Unanswered)'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span className="text-slate-500">Correct answer: </span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">
                              {q.correctAnswer}
                            </span>
                          </div>
                        )}
                        <p className="mt-2 text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-200/60 dark:border-slate-800">
                          💡 Explanation: {language === 'hi' && q.explanationHi ? q.explanationHi : q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => startQuiz(activeQuiz)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Quiz</span>
                </button>

                <button
                  onClick={() =>
                    onNavigateTutor(
                      `I just completed the quiz for "${activeQuiz.title}". Can you help me revise the weak concepts I missed?`
                    )
                  }
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Discuss Weak Concepts with AI Tutor</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Adaptive Quiz Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Generate personalized practice quizzes or take curriculum-standard assessments.
              </p>
            </div>

            <button
              onClick={() => setShowGenerator(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate AI Quiz</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Class {quiz.gradeLevel} • {quiz.questions.length} Questions
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        quiz.difficulty === 'hard'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : quiz.difficulty === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {language === 'hi' && quiz.titleHi ? quiz.titleHi : quiz.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Topic: {quiz.topicId?.title || 'Core Subject Area'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{quiz.timeLimitMinutes || 10} mins</span>
                  </div>

                  <button
                    onClick={() => startQuiz(quiz)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Start Quiz</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setShowGenerator(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Generate AI Quiz
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Custom-tailored question set with verified explanations
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={genSubjectId}
                  onChange={(e) => setGenSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                >
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {language === 'hi' ? s.nameHi : s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic
                </label>
                <select
                  value={genTopicId}
                  onChange={(e) => setGenTopicId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
                >
                  {genTopics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {language === 'hi' ? t.titleHi : t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'medium', 'hard'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setGenDifficulty(lvl)}
                      className={`py-1.5 text-xs font-bold rounded-lg capitalize border transition ${
                        genDifficulty === lvl
                          ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Question Count: {genCount}
                </label>
                <input
                  type="range"
                  min={3}
                  max={6}
                  value={genCount}
                  onChange={(e) => setGenCount(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition disabled:opacity-50"
              >
                {generating ? 'Generating Validated Quiz...' : 'Generate & Start Quiz'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
