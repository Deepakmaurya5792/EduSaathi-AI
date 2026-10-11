import { User } from './models/User.js';
import { StudentProfile } from './models/StudentProfile.js';
import { Subject } from './models/Subject.js';
import { Topic } from './models/Topic.js';
import { Lesson } from './models/Lesson.js';
import { Quiz } from './models/Quiz.js';
import { QuizAttempt } from './models/QuizAttempt.js';
import { TopicMastery } from './models/TopicMastery.js';
import { connectDB } from './config/db.js';

export const seedDatabaseIfEmpty = async () => {
  const existingUsersCount = await User.countDocuments();
  if (existingUsersCount > 0) {
    console.log('[Seed] Database already contains records. Skipping auto-seed.');
    return;
  }
  await seedDatabase();
};

export const seedDatabase = async () => {
  console.log('[Seed] Starting EduSaathi AI database seeding...');

  // 1. Create Demo Users
  const studentUser = await User.create({
    name: 'Aarav Sharma (Demo Student)',
    email: 'student@edusaathi.ai',
    password: 'Student@123',
    role: 'student',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    isDemoUser: true,
  });

  const student2 = await User.create({
    name: 'Priya Kumari (Demo Student)',
    email: 'priya@edusaathi.ai',
    password: 'Student@123',
    role: 'student',
    phone: '+91 98765 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    isDemoUser: true,
  });

  const teacherUser = await User.create({
    name: 'Sunita Verma (Demo Teacher)',
    email: 'teacher@edusaathi.ai',
    password: 'Teacher@123',
    role: 'teacher',
    phone: '+91 98765 88990',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    isDemoUser: true,
  });

  const adminUser = await User.create({
    name: 'Dr. Ramesh Chandra (Demo Admin)',
    email: 'admin@edusaathi.ai',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91 98765 99999',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    isDemoUser: true,
  });

  // 2. Student Profiles
  await StudentProfile.create({
    userId: studentUser._id,
    classGrade: 8,
    preferredLanguage: 'hi',
    selectedSubjects: ['Mathematics', 'Science', 'English'],
    learningGoals: ['Master Linear Equations', 'Prepare for Science Olympiad', 'Learn in Hindi'],
    dailyGoalMinutes: 30,
    streakCount: 5,
    lastActiveDate: new Date(),
  });

  await StudentProfile.create({
    userId: student2._id,
    classGrade: 9,
    preferredLanguage: 'en',
    selectedSubjects: ['Mathematics', 'Science'],
    learningGoals: ['Understand Physics motion laws', 'Improve test accuracy'],
    dailyGoalMinutes: 45,
    streakCount: 3,
    lastActiveDate: new Date(),
  });

  // 3. Subjects
  const mathSubject = await Subject.create({
    name: 'Mathematics',
    nameHi: 'गणित',
    code: 'MATH',
    icon: 'Calculator',
    color: '#2563EB',
    description: 'Numbers, algebra, geometry, and real-world problem solving.',
    descriptionHi: 'संख्याएं, बीजगणित, ज्यामिति और व्यावहारिक समस्याओं का समाधान।',
    gradeLevels: [6, 7, 8, 9, 10],
  });

  const scienceSubject = await Subject.create({
    name: 'Science',
    nameHi: 'विज्ञान',
    code: 'SCI',
    icon: 'FlaskConical',
    color: '#0D9488',
    description: 'Physics, chemistry, biology, and experiential scientific thinking.',
    descriptionHi: 'भौतिकी, रसायन, जीव विज्ञान और प्रायोगिक वैज्ञानिक दृष्टिकोण।',
    gradeLevels: [6, 7, 8, 9, 10],
  });

  const englishSubject = await Subject.create({
    name: 'English Grammar & Writing',
    nameHi: 'अंग्रेजी व्याकरण व लेखन',
    code: 'ENG',
    icon: 'BookOpenCheck',
    color: '#F59E0B',
    description: 'Parts of speech, sentence framing, vocabulary, and confident reading.',
    descriptionHi: 'शब्द भेद, वाक्य रचना, शब्दावली और आत्मविश्वास से अंग्रेजी पढ़ना।',
    gradeLevels: [6, 7, 8, 9, 10],
  });

  // 4. Topics
  // Math Topics
  const topicFractions = await Topic.create({
    subjectId: mathSubject._id,
    title: 'Fractions & Rational Numbers',
    titleHi: 'भिन्न और परिमेय संख्याएं',
    gradeLevel: 8,
    order: 1,
    prerequisites: [],
    description: 'Understanding parts of a whole, addition, and real-life division of resources.',
    descriptionHi: 'पूर्ण के भागों की समझ, जोड़-घटाव और दैनिक जीवन में वस्तुओं का बंटवारा।',
  });

  const topicLinearEquations = await Topic.create({
    subjectId: mathSubject._id,
    title: 'Linear Equations in One Variable',
    titleHi: 'एक चर वाले रैखिक समीकरण',
    gradeLevel: 8,
    order: 2,
    prerequisites: [topicFractions._id],
    description: 'Balancing mathematical scales to find unknown quantities.',
    descriptionHi: 'तराजू की तरह समीकरण को संतुलित कर अज्ञात मान (x, y) ज्ञात करना।',
  });

  // Science Topics
  const topicPhotosynthesis = await Topic.create({
    subjectId: scienceSubject._id,
    title: 'Nutrition in Plants & Photosynthesis',
    titleHi: 'पौधों में पोषण और प्रकाश संश्लेषण',
    gradeLevel: 8,
    order: 1,
    prerequisites: [],
    description: 'How green leaves convert sunlight, air, and water into food and oxygen.',
    descriptionHi: 'हरी पत्तियां सूर्य के प्रकाश, हवा और पानी से भोजन और ऑक्सीजन कैसे बनाती हैं।',
  });

  const topicMotion = await Topic.create({
    subjectId: scienceSubject._id,
    title: 'Force and Laws of Motion',
    titleHi: 'बल तथा गति के नियम',
    gradeLevel: 8,
    order: 2,
    prerequisites: [],
    description: 'Push, pull, inertia, and Sir Isaac Newton’s 3 foundational principles.',
    descriptionHi: 'धक्का, खिंचाव, जड़त्व और सर आइजक न्यूटन के गति के 3 मूलभूत नियम।',
  });

  // English Topic
  const topicTenses = await Topic.create({
    subjectId: englishSubject._id,
    title: 'Tenses and Time in Action',
    titleHi: 'काल (Tenses) और क्रिया रूप',
    gradeLevel: 8,
    order: 1,
    prerequisites: [],
    description: 'Mastering Present, Past, and Future simple and continuous expressions.',
    descriptionHi: 'वर्तमान, भूत और भविष्य काल में वाक्यों का सही निर्माण।',
  });

  // 5. Lessons
  await Lesson.create({
    topicId: topicFractions._id,
    subjectId: mathSubject._id,
    gradeLevel: 8,
    title: 'The Art of Sharing: Understanding Fractions',
    titleHi: 'बंटवारे की कला: भिन्न को समझें',
    contentEn: `### What is a Fraction?
A fraction represents a part of a whole. When a field, a cake, or a quantity of grain is divided into equal parts, each part is a fraction.

- **Numerator (Top Number):** How many parts you have.
- **Denominator (Bottom Number):** Total equal parts into which the whole was split.

#### Everyday Village Example
If your village well pumps water into 4 equal storage drums, and 3 drums are full, you have **3/4** of full storage capacity!`,
    contentHi: `### भिन्न (Fraction) क्या है?
भिन्न किसी पूर्ण वस्तु के एक भाग को दर्शाती है। जब किसी खेत, रोटी या वस्तु को बराबर भागों में बांटा जाता है, तो प्रत्येक भाग भिन्न कहलाता है।

- **अंश (Numerator):** आपके पास कितने हिस्से हैं।
- **हर (Denominator):** कुल कितने बराबर हिस्से किए गए हैं।

#### दैनिक ग्रामीण उदाहरण
यदि 4 भाई-बहनों में 1 तरबूज बराबर बांटा जाए, तो प्रत्येक को **1/4** हिस्सा मिलेगा। यदि आप 2 हिस्से लेते हैं, तो यह **2/4** या **1/2** (आधा) होगा!`,
    summaryEn: 'Fractions represent equal parts of a whole with Numerator over Denominator.',
    summaryHi: 'भिन्न किसी पूरी वस्तु का समान हिस्सा है, जिसे अंश/हर के रूप में लिखा जाता है।',
    keyTakeawaysEn: [
      'Denominator cannot be zero',
      'Proper fraction: Numerator < Denominator',
      'Improper fraction: Numerator >= Denominator',
    ],
    keyTakeawaysHi: [
      'हर कभी भी शून्य नहीं हो सकता',
      'उचित भिन्न: अंश < हर',
      'विषम भिन्न: अंश >= हर',
    ],
    difficulty: 'easy',
    readingTimeMinutes: 4,
    order: 1,
  });

  await Lesson.create({
    topicId: topicLinearEquations._id,
    subjectId: mathSubject._id,
    gradeLevel: 8,
    title: 'Balancing the Scales: Linear Equations',
    titleHi: 'तराजू का संतुलन: एक चर वाले रैखिक समीकरण',
    contentEn: `### Thinking Like a Balance Scale
In any market, a shopkeeper balances weights on both sides of a scale. An algebraic equation works the exact same way!

- Whatever operation you perform on the Left Hand Side (LHS), you **MUST** perform identically on the Right Hand Side (RHS).
- Example: $2x + 4 = 10$
  - Step 1: Subtract 4 from both sides: $2x = 6$
  - Step 2: Divide both sides by 2: $x = 3$`,
    contentHi: `### तराजू की तरह सोचें
बाज़ार में सब्जी वाला तराजू के दोनों पलड़ों को बराबर रखता है। समीकरण भी ठीक उसी तराजू की तरह काम करता है!

- बाईं ओर (LHS) जो भी बदलाव करेंगे, वही दाईं ओर (RHS) भी करना अनिवार्य है।
- उदाहरण: $2x + 4 = 10$
  - चरण 1: दोनों तरफ से 4 घटाएं: $2x = 6$
  - चरण 2: दोनों तरफ 2 से भाग दें: $x = 3$`,
    summaryEn: 'Solve linear equations by applying symmetrical operations to maintain equality.',
    summaryHi: 'समीकरण हल करते समय दोनों पक्षों पर समान संक्रियाएं करके अज्ञात मान ज्ञात करें।',
    keyTakeawaysEn: ['Equal operations maintain balance', 'Isolate the variable on one side'],
    keyTakeawaysHi: ['समान बदलाव से संतुलन बना रहता है', 'चर (x) को एक तरफ अकेला करें'],
    difficulty: 'medium',
    readingTimeMinutes: 5,
    order: 1,
  });

  await Lesson.create({
    topicId: topicPhotosynthesis._id,
    subjectId: scienceSubject._id,
    gradeLevel: 8,
    title: 'The Solar Kitchen: How Plants Feed the Earth',
    titleHi: 'सूर्य की रसोई: पौधे कैसे बनाते हैं भोजन',
    contentEn: `### The Magic of Green Leaves
Plants are autotrophs — meaning they make their own food!
Through small pores called **stomata**, leaves breathe in $CO_2$. Roots suck up water from soil. Green pigment called **chlorophyll** traps solar photons.

**Chemical Formula:**
$$6CO_2 + 6H_2O + \\text{Sunlight} \\rightarrow C_6H_{12}O_6 + 6O_2$$`,
    contentHi: `### हरी पत्तियों का जादू
पौधे स्वपोषी होते हैं — यानी वे अपना भोजन स्वयं बनाते हैं!
पत्तियों में मौजूद छोटे छिद्रों (**रंध्र या स्टोमेटा**) से वे कार्बन डाइऑक्साइड सोखते हैं। जड़ें मिट्टी से पानी लेती हैं और **क्लोरोफिल** धूप को बांधता है।

**रासायनिक समीकरण:**
$$6CO_2 + 6H_2O + \\text{सूर्य का प्रकाश} \\rightarrow C_6H_{12}O_6 (ग्लूकोज) + 6O_2 (ऑक्सीजन)$$`,
    summaryEn: 'Plants turn carbon dioxide, water, and sunlight into glucose and oxygen.',
    summaryHi: 'पौधे धूप, पानी और कार्बन डाइऑक्साइड से ग्लूकोज और प्राणवायु (ऑक्सीजन) बनाते हैं।',
    keyTakeawaysEn: ['Chlorophyll is essential', 'Releases oxygen into the atmosphere'],
    keyTakeawaysHi: ['क्लोरोफिल अनिवार्य है', 'वातावरण में ऑक्सीजन गैस मुक्त होती है'],
    difficulty: 'easy',
    readingTimeMinutes: 4,
    order: 1,
  });

  // 6. Practice Quizzes
  const mathQuiz = await Quiz.create({
    topicId: topicFractions._id,
    subjectId: mathSubject._id,
    gradeLevel: 8,
    title: 'Fractions Mastery Check',
    titleHi: 'भिन्न दक्षता परीक्षा',
    difficulty: 'easy',
    language: 'hi',
    timeLimitMinutes: 8,
    isAIGenerated: false,
    questions: [
      {
        id: 'q_frac_1',
        questionText: 'यदि किसी भिन्न का अंश 5 और हर 8 है, तो वह कौन सी भिन्न है?',
        questionTextHi: 'यदि किसी भिन्न का अंश 5 और हर 8 है, तो वह कौन सी भिन्न है?',
        type: 'mcq',
        options: ['5/8 (उचित भिन्न)', '8/5 (विषम भिन्न)', '13/8', '3/8'],
        correctAnswer: '5/8 (उचित भिन्न)',
        explanation: 'अंश < हर होने पर यह उचित भिन्न (Proper Fraction) कहलाती है।',
        difficulty: 'easy',
        conceptTag: 'fractions_proper',
      },
      {
        id: 'q_frac_2',
        questionText: '1/2 + 1/4 का मान क्या होगा?',
        questionTextHi: '1/2 + 1/4 का मान क्या होगा?',
        type: 'mcq',
        options: ['3/4', '2/6', '1/6', '1'],
        correctAnswer: '3/4',
        explanation: 'समान हर करने पर 2/4 + 1/4 = 3/4 होता है।',
        difficulty: 'medium',
        conceptTag: 'fractions_addition',
      },
      {
        id: 'q_frac_3',
        questionText: 'किसी भिन्न का हर कभी भी शून्य (0) नहीं हो सकता।',
        questionTextHi: 'किसी भिन्न का हर कभी भी शून्य (0) नहीं हो सकता।',
        type: 'true_false',
        options: ['सत्य (True)', 'असत्य (False)'],
        correctAnswer: 'सत्य (True)',
        explanation: 'शून्य से विभाजन गणित में अपरिभाषित (Undefined) होता है।',
        difficulty: 'easy',
        conceptTag: 'fractions_denominator_zero',
      },
    ],
  });

  const scienceQuiz = await Quiz.create({
    topicId: topicPhotosynthesis._id,
    subjectId: scienceSubject._id,
    gradeLevel: 8,
    title: 'Photosynthesis Core Concepts Quiz',
    titleHi: 'प्रकाश संश्लेषण ज्ञान परख',
    difficulty: 'easy',
    language: 'hi',
    timeLimitMinutes: 6,
    isAIGenerated: false,
    questions: [
      {
        id: 'q_sci_1',
        questionText: 'प्रकाश संश्लेषण के दौरान पौधे कौन सी गैस छोड़ते हैं?',
        type: 'mcq',
        options: ['ऑक्सीजन (O2)', 'कार्बन डाइऑक्साइड (CO2)', 'नाइट्रोजन', 'मीथेन'],
        correctAnswer: 'ऑक्सीजन (O2)',
        explanation: 'प्रकाश संश्लेषण में सह-उत्पाद के रूप में शुद्ध ऑक्सीजन गैस निकलती है।',
        difficulty: 'easy',
        conceptTag: 'photosynthesis_gas_output',
      },
      {
        id: 'q_sci_2',
        questionText: 'पत्तियों में पाए जाने वाले छोटे छिद्रों को क्या कहते हैं?',
        type: 'mcq',
        options: ['रंध्र (Stomata)', 'क्लोरोप्लास्ट', 'जाइलम', 'फ्लोएम'],
        correctAnswer: 'रंध्र (Stomata)',
        explanation: 'रंध्र गैसों के आदान-प्रदान और वाष्पोत्सर्जन में सहायता करते हैं।',
        difficulty: 'easy',
        conceptTag: 'plant_stomata',
      },
    ],
  });

  // 7. Sample Learning History & Mastery Scores for Demo Student (Aarav)
  await TopicMastery.create({
    studentId: studentUser._id,
    topicId: topicFractions._id,
    subjectId: mathSubject._id,
    masteryScore: 85,
    accuracyAverage: 88,
    totalAttempts: 3,
    timeSpentMinutes: 32,
    status: 'mastered',
    lastAssessedAt: new Date(Date.now() - 24 * 3600 * 1000),
  });

  await TopicMastery.create({
    studentId: studentUser._id,
    topicId: topicLinearEquations._id,
    subjectId: mathSubject._id,
    masteryScore: 35, // Foundational need (<40%) so adaptive engine highlights it!
    accuracyAverage: 40,
    totalAttempts: 1,
    timeSpentMinutes: 15,
    status: 'foundation',
    lastAssessedAt: new Date(),
  });

  await TopicMastery.create({
    studentId: studentUser._id,
    topicId: topicPhotosynthesis._id,
    subjectId: scienceSubject._id,
    masteryScore: 78,
    accuracyAverage: 80,
    totalAttempts: 2,
    timeSpentMinutes: 25,
    status: 'mastered',
    lastAssessedAt: new Date(Date.now() - 48 * 3600 * 1000),
  });

  // Sample Quiz Attempt
  await QuizAttempt.create({
    studentId: studentUser._id,
    quizId: mathQuiz._id,
    topicId: topicFractions._id,
    subjectId: mathSubject._id,
    answers: [
      { questionId: 'q_frac_1', userAnswer: '5/8 (उचित भिन्न)', isCorrect: true, timeSpentSeconds: 15 },
      { questionId: 'q_frac_2', userAnswer: '3/4', isCorrect: true, timeSpentSeconds: 22 },
      { questionId: 'q_frac_3', userAnswer: 'सत्य (True)', isCorrect: true, timeSpentSeconds: 10 },
    ],
    score: 3,
    totalQuestions: 3,
    accuracyPercentage: 100,
    timeTakenSeconds: 47,
    gapAnalysis: {
      weakConcepts: [],
      strongConcepts: ['fractions_proper', 'fractions_addition'],
      remedialAdvice: 'Excellent understanding of fractions! You are ready for linear equations.',
      remedialAdviceHi: 'भिन्न पर आपकी मजबूत पकड़ है! आप रैखिक समीकरण सीखने के लिए पूरी तरह तैयार हैं।',
    },
    attemptedAt: new Date(Date.now() - 24 * 3600 * 1000),
  });

  console.log('[Seed] Seeding completed successfully!');
  console.log('Demo Credentials:');
  console.log('- Student: student@edusaathi.ai / Student@123');
  console.log('- Teacher: teacher@edusaathi.ai / Teacher@123');
  console.log('- Admin:   admin@edusaathi.ai / Admin@123');
};

// If run directly from terminal: `node src/seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      process.exit(0);
    } catch (err) {
      console.error('[Seed Error]', err);
      process.exit(1);
    }
  })();
}
