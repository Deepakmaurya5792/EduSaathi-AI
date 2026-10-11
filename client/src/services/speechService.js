export const speechService = {
  isTTSSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  isSTTSupported() {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  },

  speak(text, lang = 'en') {
    return new Promise((resolve, reject) => {
      if (!this.isTTSSupported()) {
        reject(new Error('Text-to-speech is not supported on this browser.'));
        return;
      }

      window.speechSynthesis.cancel(); // Stop active speech

      const plainText = text
        .replace(/[*#_`$]/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .trim();

      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const targetPrefix = lang === 'hi' ? 'hi' : 'en';
      const selectedVoice = voices.find((v) => v.lang.startsWith(targetPrefix));
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      window.speechSynthesis.speak(utterance);
    });
  },

  stopSpeech() {
    if (this.isTTSSupported()) {
      window.speechSynthesis.cancel();
    }
  },

  startListening(onResult, onError, lang = 'en') {
    if (!this.isSTTSupported()) {
      onError('Speech recognition is not supported in this browser. You can type your question.');
      return null;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      onError(event.error || 'Voice input error occurred.');
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignored
      }
    };
  },
};
