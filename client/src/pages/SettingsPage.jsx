import React, { useState, useEffect } from 'react';
import {
  Languages,
  Moon,
  Sun,
  HardDrive,
  Trash2,
  Shield,
  Check,
  GraduationCap,
  Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { offlineStorage } from '../services/offlineStorage.js';

export const SettingsPage = () => {
  const { profile, updateProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [classGrade, setClassGrade] = useState(profile?.classGrade || 8);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(profile?.dailyGoalMinutes || 30);
  const [cachedLessonsCount, setCachedLessonsCount] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      const lessons = await offlineStorage.getAllOfflineLessons();
      setCachedLessonsCount(lessons.length);
    };
    checkStorage();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        classGrade,
        dailyGoalMinutes,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert(`Save error: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async () => {
    if (confirm('Clear all offline cached lessons and data?')) {
      await offlineStorage.clearAllStorage();
      setCachedLessonsCount(0);
      alert('Offline cache cleared successfully.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your learning language, academic class, daily goals, and offline cache.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Academic Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-600" />
          <span>Academic Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Class / Grade Level
            </label>
            <select
              value={classGrade}
              onChange={(e) => setClassGrade(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              {[6, 7, 8, 9, 10].map((g) => (
                <option key={g} value={g}>
                  Class {g} (CBSE / State Syllabus)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Daily Study Goal ({dailyGoalMinutes} Minutes)
            </label>
            <input
              type="range"
              min={15}
              max={90}
              step={15}
              value={dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(parseInt(e.target.value, 10))}
              className="w-full mt-2 accent-brand-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </form>

      {/* Language & Display */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Languages className="w-5 h-5 text-teal-600" />
          <span>Language & Interface</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Default Learning Language
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  language === 'en'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  language === 'hi'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  theme === 'light'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-700 text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                  theme === 'dark'
                    ? 'border-brand-600 bg-brand-950 text-brand-300'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Storage */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-amber-500" />
          <span>Offline Resilience & IndexedDB Storage</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Saved lessons and offline quiz attempts are stored safely in local browser IndexedDB storage for seamless learning in low-connectivity rural regions.
        </p>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Lessons Cached Offline: {cachedLessonsCount}
            </span>
            <span className="text-[11px] text-slate-500">
              Ready for immediate access without internet connection
            </span>
          </div>

          <button
            onClick={handleClearCache}
            disabled={cachedLessonsCount === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition flex items-center gap-1 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Offline Data</span>
          </button>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
        <Shield className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <p leading-relaxed>
          <strong>Student Privacy Guarantee:</strong> In accordance with UN SDG 4 and child data protection standards, EduSaathi AI collects only minimal educational progress markers. Student performance is never exposed publicly.
        </p>
      </div>
    </div>
  );
};
