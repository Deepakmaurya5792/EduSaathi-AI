import { config } from '../config/env.js';

export class DemoAIProvider {
  name = 'EduSaathi Local Pedagogical Engine (Demonstration Mode)';

  async generateTutorResponse(params) {
    const isHindi = params.language === 'hi';
    const query = (params.studentMessage || '').toLowerCase();
    const grade = params.gradeLevel || 8;
    const subject = params.subjectName || 'General Studies';
    const topic = params.topicTitle || 'Concepts';
    const level = params.explanationLevel || 'intermediate';

    let reply = '';
    let followUps = [];

    if (query.includes('photosynthesis') || query.includes('प्रकाश संश्लेषण')) {
      if (isHindi) {
        reply = `**नमस्ते ${params.studentName || 'साथी'}!** आइए प्रकाश संश्लेषण (Photosynthesis) को एक सरल उदाहरण से समझें:\n\n` +
          `1. **मुख्य विचार:** जैसे आपकी माँ रसोई में धूप, पानी और सामग्री से खाना बनाती हैं, वैसे ही पौधे पत्तियों में अपना भोजन तैयार करते हैं!\n` +
          `2. **समीकरण:** कार्बन डाइऑक्साइड ($CO_2$) + जल ($H_2O$) + सूर्य का प्रकाश + क्लोरोफिल $\\rightarrow$ ग्लूकोज (भोजन) + ऑक्सीजन ($O_2$)\n` +
          `3. **याद रखने की ट्रिक:** पौधे हमें सांस लेने के लिए प्राणवायु (ऑक्सीजन) देते हैं!\n\n` +
          `*सोचने के लिए एक सवाल:* अगर पौधों को अंधेरे कमरे में 5 दिन रखें, तो उनकी पत्तियों का क्या होगा?`;
        followUps = [
          'पौधों में क्लोरोफिल का क्या काम है?',
          'स्टोमेटा (रंध्र) क्या होते हैं?',
          'एक सरल प्रयोग से इसे कैसे सिद्ध करें?'
        ];
      } else {
        reply = `**Hello ${params.studentName || 'friend'}!** Let's break down Photosynthesis step-by-step for Class ${grade}:\n\n` +
          `1. **The Core Analogy:** Think of a plant leaf as a solar-powered green kitchen! 🍃\n` +
          `2. **The Recipe:** Carbon Dioxide ($CO_2$) from air + Water ($H_2O$) from soil + Sunlight absorbed by green chlorophyll $\\rightarrow$ Glucose (Energy) + Oxygen ($O_2$ released).\n` +
          `3. **Key Real-World Concept:** This is why planting trees keeps our rural air pure and provides the oxygen every living being breathes.\n\n` +
          `*Guiding Question for you:* What do you think happens to this process at night when there is no sunlight?`;
        followUps = [
          'What is the role of stomata in leaves?',
          'Why do leaves appear green?',
          'Can you give me a practice question on this?'
        ];
      }
    } else if (query.includes('fraction') || query.includes('भिन्न') || query.includes('ratio')) {
      if (isHindi) {
        reply = `**भिन्न (Fractions) को समझना बहुत आसान है!**\n\n` +
          `रोटी का उदाहरण:\n- मान लीजिए आपके पास 1 पूरी रोटी है और 4 भाई-बहन हैं।\n` +
          `- अगर आप रोटी के 4 बराबर टुकड़े करें और 1 टुकड़ा लें, तो वह भाग होगा **$\\frac{1}{4}$** (एक-चौथाई)।\n` +
          `- यहाँ 1 **अंश (Numerator)** है और 4 **हर (Denominator)** है।\n\n` +
          `*प्रश्न आपके लिए:* अगर आप 3 टुकड़े खा लेते हैं, तो आपने रोटी का कितना भिन्न खाया?`;
        followUps = [
          'समान हर वाले भिन्नों को कैसे जोड़ें?',
          'मिश्रित भिन्न (Mixed Fractions) क्या हैं?',
          'दशमलव और भिन्न में क्या संबंध है?'
        ];
      } else {
        reply = `**Great question about Fractions for Class ${grade}!**\n\n` +
          `Imagine sharing a single flatbread (Roti) with friends:\n` +
          `- If you cut it into 4 equal slices and take 1 slice, your share is **$\\frac{1}{4}$**.\n` +
          `- The top number (1) is the **Numerator** (what you have).\n` +
          `- The bottom number (4) is the **Denominator** (total equal pieces).\n\n` +
          `*Guiding Check:* If you eat 3 of those pieces, what fraction did you eat? And what fraction remains?`;
        followUps = [
          'How do I add fractions with different denominators?',
          'Show me a real-life problem on fractions',
          'Explain proper vs improper fractions'
        ];
      }
    } else if (query.includes('newton') || query.includes('गति') || query.includes('force') || query.includes('बल')) {
      if (isHindi) {
        reply = `**न्यूटन के गति के नियम (Newton's Laws of Motion):**\n\n` +
          `1. **पहला नियम (जड़त्व / Inertia):** जब आप रुकी हुई बस में बैठे हों और बस अचानक चले, तो आप पीछे की ओर झुक जाते हैं। कोई भी वस्तु अपनी स्थिति तब तक नहीं बदलती जब तक उस पर बाहरी बल न लगे।\n` +
          `2. **दूसरा नियम:** बल = द्रव्यमान $\\times$ त्वरण ($F = m \\times a$)। भारी पत्थर को धक्का देने में ज्यादा बल लगता है!\n` +
          `3. **तीसरा नियम (क्रिया-प्रतिक्रिया):** जब आप नाव से किनारे पर कूदते हैं, तो नाव पीछे खिसकती है।\n\n` +
          `*आपके लिए सवाल:* क्या आप साइकिल चलाते समय इनमें से किसी नियम का अनुभव कर सकते हैं?`;
        followUps = [
          'जड़त्व (Inertia) के 2 दैनिक उदाहरण दें',
          'F = ma पर एक सवाल हल करवाइए',
          'घर्षण बल (Friction) क्या होता है?'
        ];
      } else {
        reply = `**Newton's Laws of Motion made crystal clear:**\n\n` +
          `1. **1st Law (Inertia):** When you are riding in a tractor or bus and the brakes are hit suddenly, you lurch forward! Objects like to keep doing what they are already doing unless an external force intervenes.\n` +
          `2. **2nd Law ($F = m \\cdot a$):** The heavier an object, the harder you must push to accelerate it.\n` +
          `3. **3rd Law (Action-Reaction):** When you jump off a boat onto the shore, the boat pushes backwards.\n\n` +
          `*Think about this:* Why does a cricket fielder pull their hands backward while catching a fast ball?`;
        followUps = [
          'Explain momentum with an easy example',
          'Solve a numerical on F = m * a',
          'Give me a quiz on laws of motion'
        ];
      }
    } else {
      if (isHindi) {
        reply = `**नमस्ते! मैं आपका एडूसाथी (EduSaathi AI) ट्यूटर हूँ।**\n\n` +
          `आपने पूछा: *"${params.studentMessage}"*\n\n` +
          `कक्षा ${grade} के ${subject} (${topic}) के अनुसार:\n` +
          `1. **मूल सिद्धांत:** हर बड़ा विषय छोटे-छोटे सरल नियमों से मिलकर बनता है।\n` +
          `2. **सरल व्याख्या (${level} स्तर):** किसी भी समस्या को हल करने से पहले देखें कि क्या दिया गया है और क्या पूछा गया है।\n` +
          `3. **दैनिक जीवन से जुड़ाव:** विज्ञान और गणित हमारे खेतों, बाज़ारों और दैनिक कार्यों में हर जगह मौजूद हैं!\n\n` +
          `कृपया मुझे बताएं कि आप इस विषय में क्या हल करना चाहते हैं, हम साथ मिलकर हल करेंगे।`;
        followUps = [
          'कृपया मुझे एक आसान उदाहरण के साथ समझाइए',
          'इसे चरण-दर-चरण (Step-by-step) हल कैसे करें?',
          'मेरी तैयारी जांचने के लिए एक छोटा प्रश्न पूछिए'
        ];
      } else {
        reply = `**Hello! I am your EduSaathi AI Tutor.**\n\n` +
          `You asked: *"${params.studentMessage}"*\n\n` +
          `Here is how to approach this for Class ${grade} ${subject} (${topic}) at the **${level}** level:\n\n` +
          `1. **Core Concept:** Break the question down into its essential parts — what is given, and what concept connects them.\n` +
          `2. **Intuitive Step:** Relate this to something you see around you every day (like flow of water, shadows, or counting crops).\n` +
          `3. **Step-by-Step Path:** Test your understanding by predicting the outcome before calculating.\n\n` +
          `*Note: I am in demonstration mode. Ask me any topic from Class 6-10 Math, Science, or English!*`;
        followUps = [
          'Can you explain this with a real-life village example?',
          'Give me a step-by-step formula breakdown',
          'Can you test me with a practice question?'
        ];
      }
    }

    return {
      replyText: reply,
      suggestedFollowUps: followUps,
      isDemoFallback: true,
      providerUsed: 'EduSaathi Local Pedagogical Engine (Deterministic Demo)',
    };
  }

  async generateQuiz(params) {
    const isHindi = params.language === 'hi';
    const count = Math.min(Math.max(params.questionCount, 1), 10);
    const questions = [];

    const samplePool = [
      {
        id: 'q1',
        questionText: isHindi
          ? 'पौधों में प्रकाश संश्लेषण के लिए कौन सी गैस आवश्यक है?'
          : 'Which gas is taken in by green plants during photosynthesis?',
        type: 'mcq',
        options: isHindi
          ? ['ऑक्सीजन (O2)', 'कार्बन डाइऑक्साइड (CO2)', 'नाइट्रोजन (N2)', 'हाइड्रोजन (H2)']
          : ['Oxygen (O2)', 'Carbon Dioxide (CO2)', 'Nitrogen (N2)', 'Hydrogen (H2)'],
        correctAnswer: isHindi ? 'कार्बन डाइऑक्साइड (CO2)' : 'Carbon Dioxide (CO2)',
        explanation: isHindi
          ? 'पौधे वातावरण से कार्बन डाइऑक्साइड अवशोषित करते हैं और ऑक्सीजन छोड़ते हैं।'
          : 'Green plants absorb carbon dioxide through stomata and release oxygen.',
        difficulty: 'easy',
        conceptTag: 'photosynthesis_basics',
      },
      {
        id: 'q2',
        questionText: isHindi
          ? 'यदि किसी भिन्न का अंश 3 और हर 4 है, तो वह भिन्न क्या होगी?'
          : 'If the numerator of a fraction is 3 and the denominator is 4, what is the fraction?',
        type: 'mcq',
        options: ['3/4', '4/3', '7/12', '1/4'],
        correctAnswer: '3/4',
        explanation: isHindi
          ? 'भिन्न = अंश / हर, इसलिए 3 / 4 होगी।'
          : 'Fraction is represented as Numerator / Denominator, thus 3/4.',
        difficulty: 'easy',
        conceptTag: 'fractions_definition',
      },
      {
        id: 'q3',
        questionText: isHindi
          ? 'बल (Force) का SI मात्रक (Unit) क्या है?'
          : 'What is the SI unit of Force?',
        type: 'mcq',
        options: isHindi
          ? ['जूल (Joule)', 'न्यूटन (Newton)', 'वाट (Watt)', 'पास्कल (Pascal)']
          : ['Joule', 'Newton', 'Watt', 'Pascal'],
        correctAnswer: isHindi ? 'न्यूटन (Newton)' : 'Newton',
        explanation: isHindi
          ? 'बल का मात्रक न्यूटन (N) है, जिसका नाम सर आइजक न्यूटन के नाम पर रखा गया है।'
          : 'The SI unit of force is the Newton (N), named after Sir Isaac Newton.',
        difficulty: 'medium',
        conceptTag: 'force_and_laws_of_motion',
      },
      {
        id: 'q4',
        questionText: isHindi
          ? 'प्रकाश संश्लेषण केवल दिन के समय (सूर्य के प्रकाश में) होता है। (सत्य / असत्य)'
          : 'Photosynthesis occurs primarily in the presence of sunlight. (True / False)',
        type: 'true_false',
        options: isHindi ? ['सत्य (True)', 'असत्य (False)'] : ['True', 'False'],
        correctAnswer: isHindi ? 'सत्य (True)' : 'True',
        explanation: isHindi
          ? 'प्रकाश अभिक्रिया सूर्य के प्रकाश की उपस्थिति में ही संपन्न होती है।'
          : 'The light reactions of photosynthesis require solar radiation.',
        difficulty: 'easy',
        conceptTag: 'photosynthesis_conditions',
      },
      {
        id: 'q5',
        questionText: isHindi
          ? 'समीकरण 2x + 6 = 14 में x का मान क्या होगा?'
          : 'In the equation 2x + 6 = 14, what is the value of x?',
        type: 'mcq',
        options: ['2', '4', '6', '8'],
        correctAnswer: '4',
        explanation: isHindi
          ? '2x = 14 - 6 = 8, इसलिए x = 8 / 2 = 4।'
          : '2x = 14 - 6 = 8 => x = 8 / 2 = 4.',
        difficulty: 'medium',
        conceptTag: 'linear_equations_solving',
      },
    ];

    for (let i = 0; i < count; i++) {
      const template = samplePool[i % samplePool.length];
      questions.push({
        ...template,
        id: `gen_q_${i + 1}_${Date.now()}`,
      });
    }

    return questions;
  }

  async analyzeGaps(params) {
    const isHindi = params.language === 'hi';
    const weak = params.incorrectQuestions.map((q) => q.conceptTag);
    const uniqueWeak = Array.from(new Set(weak));

    let adviceEn = '';
    let adviceHi = '';

    if (params.score / params.totalQuestions >= 0.8) {
      adviceEn = `Outstanding performance! You have a solid grasp of ${params.topicTitle}. Move ahead to higher difficulty practice.`;
      adviceHi = `शानदार प्रदर्शन! आपकी ${params.topicTitle} पर अच्छी पकड़ है। अब आप अगले कठिन पाठ पर आगे बढ़ सकते हैं।`;
    } else if (params.score / params.totalQuestions >= 0.5) {
      adviceEn = `Good effort! You showed understanding in core principles, but need to revise: ${uniqueWeak.join(', ')}. Try the guided examples.`;
      adviceHi = `अच्छा प्रयास! आपने मुख्य बिंदु समझे हैं, लेकिन इन विषयों पर पुनः अभ्यास करें: ${uniqueWeak.join(', ')}।`;
    } else {
      adviceEn = `Foundational revision recommended. Let's revisit the concept summary for ${params.topicTitle} before re-attempting the quiz.`;
      adviceHi = `बुनियादी पुनरावृत्ति की आवश्यकता है। आइए क्विज दोबारा करने से पहले ${params.topicTitle} के मुख्य नोट्स पढ़ें।`;
    }

    return {
      weakConcepts: uniqueWeak.length > 0 ? uniqueWeak : ['None! Great job'],
      strongConcepts: [`${params.topicTitle} fundamentals`],
      remedialAdvice: isHindi ? adviceHi : adviceEn,
      remedialAdviceHi: adviceHi,
    };
  }
}

export class GeminiAIProvider {
  name = 'Google Gemini AI';

  constructor(apiKey, model = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateTutorResponse(params) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const systemPrompt = `You are EduSaathi AI, an empathetic, highly encouraging personal tutor designed for Indian students (Grade ${params.gradeLevel}) including rural learners.
Teaching Principles:
- Use supportive Socratic questioning. Give helpful hints and analogies before flat-out giving answers.
- Adapt tone to explanation level: ${params.explanationLevel || 'intermediate'}.
- Subject: ${params.subjectName || 'General'}, Topic: ${params.topicTitle || 'General'}.
- Language required: ${params.language === 'hi' ? 'Hindi (Devanagari script)' : 'Clear English'}.
- Clearly state that you are an AI assistant and keep answers concise and pedagogical.
- Format your response with clear markdown and return a JSON object with keys:
  "replyText": string (markdown supported),
  "suggestedFollowUps": array of 3 string suggestions the student can ask next.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nStudent asks: "${params.studentMessage}"` }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response from Gemini');

      const parsed = JSON.parse(text);
      return {
        replyText: parsed.replyText || text,
        suggestedFollowUps: Array.isArray(parsed.suggestedFollowUps) ? parsed.suggestedFollowUps : [],
        isDemoFallback: false,
        providerUsed: `Google Gemini (${this.model})`,
      };
    } catch (err) {
      console.warn(`[AIProvider] Gemini failed: ${err.message}. Falling back to DemoAIProvider.`);
      const demo = new DemoAIProvider();
      return demo.generateTutorResponse(params);
    }
  }

  async generateQuiz(params) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const prompt = `Generate a validated educational quiz for Class ${params.gradeLevel} ${params.subjectName} on topic "${params.topicTitle}".
Difficulty: ${params.difficulty}. Number of questions: ${params.questionCount}. Language: ${params.language === 'hi' ? 'Hindi' : 'English'}.
Strictly output a JSON array of question objects with this schema:
[
  {
    "id": "q1",
    "questionText": "string",
    "type": "mcq",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact matching string from options",
    "explanation": "Clear explanation of why it is correct",
    "difficulty": "${params.difficulty}",
    "conceptTag": "specific_subtopic_tag"
  }
]`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        }),
      });

      if (!response.ok) throw new Error(`Gemini quiz API error: ${response.status}`);

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((q, idx) => ({
          ...q,
          id: `ai_${idx + 1}_${Date.now()}`,
        }));
      }
      throw new Error('Invalid quiz array returned by Gemini');
    } catch (err) {
      console.warn(`[AIProvider] Gemini quiz generation failed: ${err.message}. Using fallback.`);
      const demo = new DemoAIProvider();
      return demo.generateQuiz(params);
    }
  }

  async analyzeGaps(params) {
    const demo = new DemoAIProvider();
    return demo.analyzeGaps(params);
  }
}

export class AIProviderFactory {
  static getProvider() {
    const provider = (config.aiProvider || '').toLowerCase();

    if (provider === 'gemini' && config.geminiApiKey) {
      return new GeminiAIProvider(config.geminiApiKey, config.geminiModel);
    }

    return new DemoAIProvider();
  }
}
