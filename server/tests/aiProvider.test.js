import { describe, it, expect } from 'vitest';
import { DemoAIProvider } from '../src/services/aiProvider.js';

describe('Adaptive Learning Engine & AI Demo Provider Tests', () => {
  const provider = new DemoAIProvider();

  it('generates rich pedagogical tutor response with guiding questions in English', async () => {
    const res = await provider.generateTutorResponse({
      studentMessage: 'Can you explain photosynthesis?',
      gradeLevel: 8,
      subjectName: 'Science',
      topicTitle: 'Nutrition in Plants',
      language: 'en',
      explanationLevel: 'beginner',
    });

    expect(res).toBeDefined();
    expect(res.replyText).toContain('Photosynthesis');
    expect(res.suggestedFollowUps.length).toBeGreaterThanOrEqual(1);
    expect(res.isDemoFallback).toBe(true);
  });

  it('generates rich pedagogical tutor response in Hindi (Devanagari)', async () => {
    const res = await provider.generateTutorResponse({
      studentMessage: 'प्रकाश संश्लेषण क्या है?',
      gradeLevel: 8,
      subjectName: 'Science',
      topicTitle: 'पौधों में पोषण',
      language: 'hi',
      explanationLevel: 'intermediate',
    });

    expect(res).toBeDefined();
    expect(res.replyText).toContain('प्रकाश संश्लेषण');
    expect(res.suggestedFollowUps.length).toBeGreaterThanOrEqual(1);
  });

  it('generates structured and validated quiz questions', async () => {
    const questions = await provider.generateQuiz({
      gradeLevel: 8,
      subjectName: 'Science',
      topicTitle: 'Nutrition in Plants',
      difficulty: 'easy',
      questionCount: 3,
      language: 'en',
    });

    expect(questions.length).toBe(3);
    expect(questions[0]).toHaveProperty('questionText');
    expect(questions[0]).toHaveProperty('correctAnswer');
    expect(questions[0]).toHaveProperty('explanation');
    expect(questions[0]).toHaveProperty('conceptTag');
  });

  it('accurately identifies weak concepts in gap analysis for lower scores', async () => {
    const analysis = await provider.analyzeGaps({
      subjectName: 'Mathematics',
      topicTitle: 'Linear Equations',
      score: 1,
      totalQuestions: 4,
      incorrectQuestions: [
        {
          questionText: 'Solve 2x = 8',
          userAnswer: '2',
          correctAnswer: '4',
          conceptTag: 'variable_isolation',
        },
      ],
      language: 'en',
    });

    expect(analysis.weakConcepts).toContain('variable_isolation');
    expect(analysis.remedialAdvice).toContain('revision');
  });
});
