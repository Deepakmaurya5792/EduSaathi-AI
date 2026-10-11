import React from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  BarChart3,
  Globe2,
  WifiOff,
  GraduationCap,
  ArrowRight,
  Users,
  Shield,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export const LandingPage = ({ onGetStarted, onExplore }) => {
  const { loginAsDemo } = useAuth();
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* SDG 4 Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-sm mb-6 animate-fade-in">
            <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Aligned with UN Sustainable Development Goal 4: Quality Education</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Your Personal AI Tutor.{' '}
            <span className="bg-gradient-to-r from-brand-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              Learning Without Limits.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Designed specifically for rural and underserved students in Classes 6–10. Multilingual AI tutoring, adaptive quizzes, and offline-first learning that adapts to every child's pace.
          </p>

          {/* 1-Click Evaluation Bar */}
          <div className="mt-8 max-w-2xl mx-auto p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              ⚡ Instant 1-Click Demo Evaluation (No Setup Required)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => loginAsDemo('student')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 transition"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Try as Student</span>
              </button>
              <button
                onClick={() => loginAsDemo('teacher')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition"
              >
                <Users className="w-4 h-4" />
                <span>Try as Teacher</span>
              </button>
              <button
                onClick={() => loginAsDemo('admin')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition"
              >
                <Shield className="w-4 h-4" />
                <span>Try as Admin</span>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 transition hover:scale-[1.02]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onExplore('library')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition"
            >
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>Explore Curriculum (Class 6-10)</span>
            </button>
          </div>
        </div>
      </section>

      {/* SDG 4 Alignment Highlight Section */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 mb-3">
              United Nations SDG 4
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Democratizing Quality Education for Every Student
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Millions of students in rural schools lack dedicated subject teachers, personalized tutoring, and digital resources. EduSaathi AI bridges this gap directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Target 4.1: Equal Quality Education</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Empowers every rural child with an on-demand personal tutor that explains complex science and math concepts in simple language with everyday analogies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Target 4.5: Regional Equity</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Native Hindi & English bilingual support with speech synthesis and voice recognition removes language barriers that hold students back.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Low-Bandwidth & Offline Resilience</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Offline lesson caching via IndexedDB and automatic sync for quiz attempts ensure learning never stops during rural power or connectivity cuts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Designed to Adapt to Every Student
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Every feature is built around the core principle that students learn at different paces and with different styles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">AI Socratic Tutor</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Asks guiding questions instead of spoon-feeding answers, encouraging real scientific thinking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Adaptive Learning Engine</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Maintains 0-100% mastery scores and alerts students when prerequisites need revision.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Schema-Validated Quizzes</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Generates high-quality MCQs, True/False and Fill-in-Blanks with instant diagnostic gap analysis.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Teacher & Admin Insights</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Flags students requiring support early and provides concrete remedial recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>EduSaathi AI — Built for Quality Education (UN SDG 4) & Rural Empowerment.</p>
        <p className="mt-1">Class 6–10 Mathematics, Science & English | Open Curriculum</p>
      </footer>
    </div>
  );
};
