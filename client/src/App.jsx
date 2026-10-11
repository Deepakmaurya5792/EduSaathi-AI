import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { OfflineBanner } from './components/OfflineBanner.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { StudentDashboard } from './pages/StudentDashboard.jsx';
import { AITutorPage } from './pages/AITutorPage.jsx';
import { LearningLibraryPage } from './pages/LearningLibraryPage.jsx';
import { QuizCenterPage } from './pages/QuizCenterPage.jsx';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage.jsx';
import { TeacherDashboard } from './pages/TeacherDashboard.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

function MainApp() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [navigationMeta, setNavigationMeta] = useState({});

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'teacher') {
        setCurrentTab('teacher');
      } else if (user.role === 'admin') {
        setCurrentTab('admin');
      } else {
        setCurrentTab('dashboard');
      }
    } else if (!isLoading && !isAuthenticated) {
      setCurrentTab('landing');
    }
  }, [isAuthenticated, user?.role]);

  const handleNavigate = (tab, meta = {}) => {
    setNavigationMeta(meta);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Loading EduSaathi AI...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <OfflineBanner />
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setShowAuthModal(true)}
            onExplore={(tab) => handleNavigate(tab)}
          />
        )}

        {currentTab === 'dashboard' && (
          <StudentDashboard onNavigate={handleNavigate} />
        )}

        {currentTab === 'tutor' && (
          <AITutorPage initialMessage={navigationMeta.initialMessage} />
        )}

        {currentTab === 'library' && (
          <LearningLibraryPage
            selectedLessonId={navigationMeta.lessonId}
            selectedSubjectId={navigationMeta.subjectId}
            onTakeQuiz={(topicId) => handleNavigate('quizzes', { initialTopicId: topicId })}
            onAskTutor={(query) => handleNavigate('tutor', { initialMessage: query })}
          />
        )}

        {currentTab === 'quizzes' && (
          <QuizCenterPage
            initialTopicId={navigationMeta.initialTopicId}
            initialQuizId={navigationMeta.quizId}
            onNavigateTutor={(query) => handleNavigate('tutor', { initialMessage: query })}
          />
        )}

        {currentTab === 'analytics' && (
          <ProgressAnalyticsPage
            onNavigateTutor={(query) => handleNavigate('tutor', { initialMessage: query })}
            onNavigateQuiz={(topicId) => handleNavigate('quizzes', { initialTopicId: topicId })}
          />
        )}

        {currentTab === 'teacher' && <TeacherDashboard />}

        {currentTab === 'admin' && <AdminDashboard />}

        {currentTab === 'settings' && <SettingsPage />}
      </main>

      {showAuthModal && (
        <AuthPage
          onSuccess={() => setShowAuthModal(false)}
          onCancel={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
