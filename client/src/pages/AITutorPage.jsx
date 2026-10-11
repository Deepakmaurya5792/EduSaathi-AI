import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { speechService } from '../services/speechService.js';

export const AITutorPage = ({ initialMessage }) => {
  const { user, profile } = useAuth();
  const { language: globalLang } = useLanguage();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialMessage || '');
  const [conversationId, setConversationId] = useState(null);
  const [explanationLevel, setExplanationLevel] = useState('intermediate');
  const [tutorLanguage, setTutorLanguage] = useState(globalLang);
  const [loading, setLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const stopListeningRef = useRef(null);
  const messagesEndRef = useRef(null);

  const starterPrompts = [
    {
      title: 'Photosynthesis Analogy',
      titleHi: 'प्रकाश संश्लेषण का सरल उदाहरण',
      prompt: 'Explain Photosynthesis like a village kitchen recipe with an everyday analogy.',
      promptHi: 'प्रकाश संश्लेषण को रसोई के उदाहरण से सरल भाषा में समझाइए।',
    },
    {
      title: 'Fractions in Daily Life',
      titleHi: 'दैनिक जीवन में भिन्न',
      prompt: 'How do fractions work when dividing grain or flatbread with siblings?',
      promptHi: 'रोटी या खेत का बंटवारा करते समय भिन्न (Fractions) का क्या उपयोग है?',
    },
    {
      title: 'Newton’s First Law',
      titleHi: 'न्यूटन का पहला नियम',
      prompt: 'Why do we fall forward when a moving bus suddenly hits the brakes?',
      promptHi: 'जब चलती हुई बस अचानक रुकती है तो हम आगे क्यों झुक जाते हैं?',
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (messages.length === 0) {
      const isHi = tutorLanguage === 'hi';
      setMessages([
        {
          id: 'welcome_1',
          sender: 'tutor',
          text: isHi
            ? `**नमस्ते ${user?.name?.split(' ')[0] || 'विद्यार्थी'}!** मैं आपका एडूसाथी एआई ट्यूटर हूँ।\n\nआप मुझसे कक्षा ${profile?.classGrade || 8} के किसी भी गणित, विज्ञान या अंग्रेजी के विषय पर सवाल पूछ सकते हैं। मैं आपको सीधे उत्तर रटने की बजाय चरण-दर-चरण (Step-by-Step) सोचने और समझने में मदद करूँगा!\n\n*आप नीचे दिए गए किसी विषय पर क्लिक कर सकते हैं या अपना सवाल लिख/बोल सकते हैं।*`
            : `**Hello ${user?.name?.split(' ')[0] || 'Student'}!** I am your EduSaathi AI Tutor.\n\nI am here to guide your learning for Class ${profile?.classGrade || 8} Mathematics, Science, and English. Rather than simply giving answers, I love using guiding hints, real-world village analogies, and step-by-step thinking!\n\n*Feel free to select a prompt below or type/speak your question.*`,
          suggestedFollowUps: isHi
            ? ['पौधों में क्लोरोफिल का क्या काम है?', 'भिन्न और दशमलव में क्या अंतर है?', 'गति के दूसरे नियम का सूत्र क्या है?']
            : ['Explain Photosynthesis with an analogy', 'How to solve 2x + 4 = 10', 'What is Newton’s Law of Inertia?'],
          isDemoFallback: true,
          providerUsed: 'EduSaathi Local Pedagogical Engine',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [tutorLanguage]);

  useEffect(() => {
    if (initialMessage && messages.length === 1 && !loading) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await api.chatWithTutor({
        message: text,
        conversationId: conversationId || undefined,
        explanationLevel,
        language: tutorLanguage,
      });

      if (res.success) {
        if (res.conversationId) setConversationId(res.conversationId);
        const tutorMsg = {
          id: res.tutorMessageId || `t_${Date.now()}`,
          sender: 'tutor',
          text: res.reply,
          suggestedFollowUps: res.suggestedFollowUps || [],
          isDemoFallback: res.isDemoFallback,
          providerUsed: res.providerUsed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, tutorMsg]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'tutor',
          text: `⚠️ **Notice:** ${err.message || 'Unable to connect to tutor service. Please check connection.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSpeak = async (msgId, text) => {
    if (speakingMsgId === msgId) {
      speechService.stopSpeech();
      setSpeakingMsgId(null);
      return;
    }

    try {
      setSpeakingMsgId(msgId);
      await speechService.speak(text, tutorLanguage);
      setSpeakingMsgId(null);
    } catch (e) {
      console.warn('TTS error:', e);
      setSpeakingMsgId(null);
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      if (stopListeningRef.current) stopListeningRef.current();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const stopFn = speechService.startListening(
      (transcript) => {
        setInputText(transcript);
        setIsListening(false);
      },
      (err) => {
        alert(err);
        setIsListening(false);
      },
      tutorLanguage
    );
    stopListeningRef.current = stopFn;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Tutor Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              EduSaathi AI Personal Tutor
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                Class {profile?.classGrade || 8}
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Socratic Teaching • Real-world Analogies • Regional Speech
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {['beginner', 'intermediate', 'advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setExplanationLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  explanationLevel === lvl
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTutorLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition ${
                tutorLanguage === 'en'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setTutorLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg transition ${
                tutorLanguage === 'hi'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed transition ${
                msg.sender === 'student'
                  ? 'bg-brand-600 text-white rounded-br-none shadow-brand-600/10'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-none'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-2 text-xs opacity-75">
                <span className="font-bold">
                  {msg.sender === 'student' ? user?.name || 'You' : 'EduSaathi Tutor'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'tutor' && (
                    <button
                      onClick={() => handleToggleSpeak(msg.id, msg.text)}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                        speakingMsgId === msg.id ? 'text-amber-500 font-bold' : ''
                      }`}
                      title={speakingMsgId === msg.id ? 'Stop reading' : 'Read aloud in native voice'}
                    >
                      {speakingMsgId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.sender === 'tutor' && (
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-amber-500" />
                    <span>{msg.providerUsed || 'Pedagogical AI Engine'}</span>
                  </span>
                  <span>*AI response • verify with teacher</span>
                </div>
              )}
            </div>

            {msg.sender === 'tutor' && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%] sm:max-w-[78%]">
                {msg.suggestedFollowUps.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 dark:bg-slate-800 dark:hover:bg-brand-950/60 dark:text-slate-300 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1"
                  >
                    <span>{chip}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-4 max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 animate-pulse">
            <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
            <span>EduSaathi is preparing an intuitive explanation...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starters */}
      {messages.length <= 2 && (
        <div className="py-2 shrink-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Suggested Discussion Starters:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {starterPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(tutorLanguage === 'hi' ? p.promptHi : p.prompt)}
                className="p-2.5 rounded-xl text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-xs shadow-sm transition group"
              >
                <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 transition">
                  {tutorLanguage === 'hi' ? p.titleHi : p.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {tutorLanguage === 'hi' ? p.promptHi : p.prompt}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shrink-0 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={handleToggleMic}
          className={`p-2.5 rounded-xl transition ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Speak question in Hindi or English'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            isListening
              ? 'Listening to your voice...'
              : tutorLanguage === 'hi'
              ? 'सवाल लिखें या माइक दबाकर पूछें...'
              : 'Ask a question in English or Hindi...'
          }
          className="flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white shadow-sm transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
