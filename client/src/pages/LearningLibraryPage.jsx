import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Download,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { offlineStorage } from '../services/offlineStorage.js';
import { speechService } from '../services/speechService.js';

export const LearningLibraryPage = ({
  onTakeQuiz,
  onAskTutor,
  selectedLessonId,
  selectedSubjectId,
}) => {
  const { profile } = useAuth();
  const { language, t } = useLanguage();

  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [activeSubject, setActiveSubject] = useState(selectedSubjectId || 'all');
  const [activeGrade, setActiveGrade] = useState(profile?.classGrade || 8);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [offlineSavedIds, setOfflineSavedIds] = useState(new Set());
  const [lessonLang, setLessonLang] = useState(language);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjRes, bookRes] = await Promise.allSettled([
          api.getSubjects(),
          api.getBookmarks(),
        ]);

        if (subjRes.status === 'fulfilled' && subjRes.value?.success) {
          setSubjects(subjRes.value.data);
        }

        if (bookRes.status === 'fulfilled' && bookRes.value?.success) {
          const ids = new Set((bookRes.value.data || []).map((b) => b._id));
          setBookmarkedIds(ids);
        }

        const offlineLessons = await offlineStorage.getAllOfflineLessons();
        setOfflineSavedIds(new Set(offlineLessons.map((l) => l._id)));
      } catch (err) {
        console.warn('Library load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const res = await api.getLessons({
          subjectId: activeSubject !== 'all' ? activeSubject : undefined,
          grade: activeGrade,
          search: searchQuery || undefined,
        });

        if (res.success) {
          setLessons(res.data);
          if (selectedLessonId) {
            const match = res.data.find((l) => l._id === selectedLessonId);
            if (match) setSelectedLesson(match);
          }
        }
      } catch (err) {
        const cached = await offlineStorage.getAllOfflineLessons();
        setLessons(cached);
      }
    };

    loadLessons();
  }, [activeSubject, activeGrade, searchQuery, selectedLessonId]);

  const handleToggleBookmark = async (lessonId) => {
    try {
      const res = await api.toggleBookmark(lessonId);
      if (res.success) {
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          if (res.isBookmarked) next.add(lessonId);
          else next.delete(lessonId);
          return next;
        });
      }
    } catch (e) {
      console.warn('Bookmark error:', e);
    }
  };

  const handleToggleOffline = async (lesson) => {
    const isCurrentlySaved = offlineSavedIds.has(lesson._id);
    if (isCurrentlySaved) {
      await offlineStorage.removeLessonOffline(lesson._id);
      setOfflineSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(lesson._id);
        return next;
      });
    } else {
      await offlineStorage.saveLessonOffline(lesson);
      setOfflineSavedIds((prev) => {
        const next = new Set(prev);
        next.add(lesson._id);
        return next;
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Title & Search bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Curriculum Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bilingual, bite-sized lessons designed for CBSE & State Board Classes 6–10.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons & topics..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Filter Row: Grade & Subject Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubject('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubject === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Subjects
          </button>
          {subjects.map((s) => (
            <button
              key={s._id}
              onClick={() => setActiveSubject(s._id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeSubject === s._id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'hi' ? s.nameHi : s.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {[6, 7, 8, 9, 10].map((gr) => (
            <button
              key={gr}
              onClick={() => setActiveGrade(gr)}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeGrade === gr
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Class {gr}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {lessons.map((lesson) => {
          const isBookmarked = bookmarkedIds.has(lesson._id);
          const isSavedOffline = offlineSavedIds.has(lesson._id);

          return (
            <div
              key={lesson._id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-500/50 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span className="font-bold text-brand-600 dark:text-brand-400 truncate max-w-[200px]">
                    {language === 'hi'
                      ? lesson.topicId?.titleHi || lesson.topicId?.title
                      : lesson.topicId?.title}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleBookmark(lesson._id)}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        isBookmarked ? 'text-amber-500' : 'text-slate-400'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleToggleOffline(lesson)}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        isSavedOffline ? 'text-emerald-500 font-bold' : 'text-slate-400'
                      }`}
                      title={isSavedOffline ? 'Saved for offline use' : 'Save for offline access'}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3
                  onClick={() => setSelectedLesson(lesson)}
                  className="font-bold text-base text-slate-900 dark:text-white cursor-pointer group-hover:text-brand-600 dark:group-hover:text-brand-400 transition"
                >
                  {language === 'hi' ? lesson.titleHi : lesson.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {language === 'hi' ? lesson.summaryHi : lesson.summaryEn}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lesson.readingTimeMinutes} min read</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLesson(lesson)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 transition"
                  >
                    Read Lesson
                  </button>
                  <button
                    onClick={() => onTakeQuiz(lesson.topicId?._id || lesson.topicId)}
                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                    title="Take Quiz on this topic"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lesson Reader Drawer / Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedLesson(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-base font-bold p-1 rounded-lg"
            >
              ✕
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pr-8">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Class {selectedLesson.gradeLevel} • {selectedLesson.topicId?.title}
              </span>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setLessonLang('en')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    lessonLang === 'en'
                      ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLessonLang('hi')}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    lessonLang === 'hi'
                      ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {lessonLang === 'hi' ? selectedLesson.titleHi : selectedLesson.title}
            </h2>

            <div className="my-3 flex items-center gap-2">
              <button
                onClick={() =>
                  speechService.speak(
                    lessonLang === 'hi' ? selectedLesson.contentHi : selectedLesson.contentEn,
                    lessonLang
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              >
                <Volume2 className="w-3.5 h-3.5 text-brand-600" />
                <span>{t('listenSpeech')}</span>
              </button>
            </div>

            <div className="mt-4 prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {lessonLang === 'hi' ? selectedLesson.contentHi : selectedLesson.contentEn}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-2">
                Key Takeaways / मुख्य बिंदु:
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {(lessonLang === 'hi'
                  ? selectedLesson.keyTakeawaysHi
                  : selectedLesson.keyTakeawaysEn
                )?.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedLesson(null);
                  onAskTutor(
                    `I just read "${selectedLesson.title}". Can you give me a real-world example to deepen my understanding?`
                  );
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Tutor About This</span>
              </button>

              <button
                onClick={() => {
                  setSelectedLesson(null);
                  onTakeQuiz(selectedLesson.topicId?._id || selectedLesson.topicId);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Take Practice Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
