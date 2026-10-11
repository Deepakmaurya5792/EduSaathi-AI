import React, { createContext, useContext, useState } from 'react';

const translations = {
  // Brand & Nav
  appName: { en: 'EduSaathi AI', hi: 'एडूसाथी एआई', bho: 'एडूसाथी एआई' },
  tagline: {
    en: 'Your Personal AI Tutor. Learning Without Limits.',
    hi: 'आपका व्यक्तिगत एआई ट्यूटर। सीमाओं से परे शिक्षा।',
    bho: 'रउआ आपन व्यक्तिगत एआई ट्यूटर। बिना कवनो सीमा के पढ़ाई।',
  },
  sdg4Badge: {
    en: 'UN SDG 4: Quality Education for All',
    hi: 'संयुक्त राष्ट्र SDG 4: सभी के लिए गुणवत्तापूर्ण शिक्षा',
    bho: 'संयुक्त राष्ट्र SDG 4: सभ खातिर नीक पढ़ाई',
  },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड', bho: 'डैशबोर्ड' },
  aiTutor: { en: 'AI Tutor', hi: 'एआई ट्यूटर', bho: 'एआई ट्यूटर' },
  learningLibrary: { en: 'Library', hi: 'पुस्तकालय', bho: 'पुस्तकालय' },
  quizCenter: { en: 'Quiz Center', hi: 'क्विज केंद्र', bho: 'क्विज केंद्र' },
  analytics: { en: 'Analytics', hi: 'प्रगति चार्ट', bho: 'प्रगति चार्ट' },
  teacherHub: { en: 'Teacher Hub', hi: 'शिक्षक केंद्र', bho: 'शिक्षक केंद्र' },
  adminPanel: { en: 'Admin Panel', hi: 'प्रशासन कक्ष', bho: 'प्रशासन कक्ष' },
  settings: { en: 'Settings', hi: 'सेटिंग्स', bho: 'सेटिंग्स' },
  login: { en: 'Login', hi: 'लॉग इन करें', bho: 'लॉग इन करीं' },
  register: { en: 'Get Started', hi: 'शुरू करें', bho: 'शुरू करीं' },
  logout: { en: 'Log Out', hi: 'लॉग आउट', bho: 'लॉग आउट' },

  // Dashboard Strings
  welcomeBack: { en: 'Welcome back', hi: 'स्वागत है', bho: 'स्वागत बा' },
  dailyGoal: { en: 'Daily Learning Goal', hi: 'दैनिक अध्ययन लक्ष्य', bho: 'दैनिक पढ़ाई के लक्ष्य' },
  dayStreak: { en: 'Day Streak', hi: 'दिनों की निरंतरता', bho: 'दिन के निरंतरता' },
  quizzesSolved: { en: 'Quizzes Completed', hi: 'पूर्ण किए गए क्विज', bho: 'हल कइल क्विज' },
  averageAccuracy: { en: 'Average Accuracy', hi: 'औसत सटीकता', bho: 'औसत सटीकता' },
  recommendedNext: { en: 'Recommended Next Step', hi: 'अनुशंसित अगला कदम', bho: 'सलाह दिहल अगिला कदम' },
  continueLearning: { en: 'Continue Learning', hi: 'अध्ययन जारी रखें', bho: 'पढ़ाई जारी राखीं' },
  takeQuiz: { en: 'Take Adaptive Quiz', hi: 'अनुकूली क्विज दें', bho: 'क्विज दीं' },
  askAiTutor: { en: 'Ask AI Tutor Anything', hi: 'एआई ट्यूटर से कुछ भी पूछें', bho: 'एआई ट्यूटर से कुछ भी पूछीं' },
  startLesson: { en: 'Start Lesson', hi: 'पाठ शुरू करें', bho: 'पाठ शुरू करीं' },

  // Tutor strings
  tutorPlaceholder: {
    en: 'Ask a question in English or Hindi (e.g. "Explain photosynthesis with an example")...',
    hi: 'सरल हिंदी या अंग्रेजी में सवाल पूछें (उदा. "प्रकाश संश्लेषण को आसान उदाहरण से समझाएं")...',
    bho: 'हिंदी चाहे अंग्रेजी में सवाल पूछीं...',
  },
  beginnerLevel: { en: 'Beginner', hi: 'शुरुआती', bho: 'शुरुआती' },
  intermediateLevel: { en: 'Intermediate', hi: 'मध्यम', bho: 'मध्यम' },
  advancedLevel: { en: 'Advanced', hi: 'उन्नत', bho: 'उन्नत' },
  listenSpeech: { en: 'Read Aloud', hi: 'बोलकर सुनाएं', bho: 'बोल के सुनाईं' },
  stopSpeech: { en: 'Stop', hi: 'रोकें', bho: 'रोकीं' },
  voiceInput: { en: 'Speak Question', hi: 'बोलकर पूछें', bho: 'बोल के पूछीं' },
  listening: { en: 'Listening...', hi: 'सुन रहा हूँ...', bho: 'सुनत बानी...' },

  // Quiz strings
  generateAiQuiz: { en: 'Generate AI Quiz', hi: 'एआई क्विज बनाएं', bho: 'एआई क्विज बनाईं' },
  submitAnswers: { en: 'Submit Answers', hi: 'उत्तर जमा करें', bho: 'उत्तर जमा करीं' },
  quizResult: { en: 'Quiz Result', hi: 'क्विज परिणाम', bho: 'क्विज परिणाम' },
  score: { en: 'Score', hi: 'अंक', bho: 'अंक' },
  weakAreas: { en: 'Weak Concepts to Revise', hi: 'कमजोर बिंदु (पुनरावृत्ति करें)', bho: 'कमजोर बिंदु' },
  retryQuiz: { en: 'Retry Quiz', hi: 'पुनः प्रयास करें', bho: 'फेरु से कोशिश करीं' },

  // Offline strings
  offlineBanner: {
    en: 'Offline Mode: You are viewing saved lessons. Offline quiz attempts will automatically sync when connected.',
    hi: 'ऑफलाइन मोड: आप सहेजे गए पाठ देख रहे हैं। ऑफलाइन क्विज पुनः जुड़ने पर स्वतः सिंक हो जाएंगे।',
    bho: 'ऑफलाइन मोड: इंटरनेट नइखे। सहेजल पाठ देख सकत बानी।',
  },
  savedOffline: { en: 'Saved Offline', hi: 'ऑफलाइन सहेजा गया', bho: 'ऑफलाइन सहेजल गइल' },
  saveForOffline: { en: 'Save for Offline', hi: 'ऑफलाइन सहेजें', bho: 'ऑफलाइन सहेजीं' },
};

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('edusaathi_lang') || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('edusaathi_lang', lang);
  };

  const t = (key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
