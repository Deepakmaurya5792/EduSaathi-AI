import { offlineStorage } from './offlineStorage.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  getToken() {
    return localStorage.getItem('edusaathi_token');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      if (!navigator.onLine || err.message.includes('Failed to fetch')) {
        throw new Error('Network unavailable. You are currently offline.');
      }
      throw err;
    }
  }

  // Auth Endpoints
  async register(body) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // Subjects & Topics
  async getSubjects() {
    return this.request('/subjects');
  }

  async getTopicsBySubject(subjectId, grade) {
    const q = grade ? `?grade=${grade}` : '';
    return this.request(`/subjects/${subjectId}/topics${q}`);
  }

  // Lessons
  async getLessons(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.subjectId) searchParams.append('subjectId', params.subjectId);
    if (params.topicId) searchParams.append('topicId', params.topicId);
    if (params.grade) searchParams.append('grade', params.grade.toString());
    if (params.search) searchParams.append('search', params.search);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/lessons${query}`);
  }

  async getLessonById(id) {
    return this.request(`/lessons/${id}`);
  }

  async toggleBookmark(lessonId) {
    return this.request(`/lessons/${lessonId}/bookmark`, { method: 'POST' });
  }

  async getBookmarks() {
    return this.request('/lessons/bookmarks/all');
  }

  // AI Tutor
  async chatWithTutor(data) {
    return this.request('/tutor/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getConversations() {
    return this.request('/tutor/conversations');
  }

  async getConversationById(id) {
    return this.request(`/tutor/conversations/${id}`);
  }

  // Quizzes
  async generateQuiz(params) {
    return this.request('/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getQuizzes(params = {}) {
    const q = params.topicId ? `?topicId=${params.topicId}` : '';
    return this.request(`/quizzes${q}`);
  }

  async getQuizById(id) {
    return this.request(`/quizzes/${id}`);
  }

  async submitQuiz(quizId, answers, timeTakenSeconds) {
    if (!navigator.onLine) {
      const offlineQueueId = await offlineStorage.queueOfflineQuizAttempt(
        quizId,
        answers,
        timeTakenSeconds
      );
      return {
        success: true,
        isOfflineQueued: true,
        message: 'You are currently offline. Your quiz attempt is saved locally and will auto-sync when online!',
        data: {
          attemptId: offlineQueueId,
          score: answers.length,
          totalQuestions: answers.length,
          accuracyPercentage: 100,
          gapAnalysis: {
            weakConcepts: [],
            strongConcepts: ['Offline Practice Completed'],
            remedialAdvice: 'Attempt stored offline. Syncing automatically when connected.',
          },
          updatedMastery: { masteryScore: 70, status: 'developing', totalAttempts: 1 },
        },
      };
    }

    return this.request(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeTakenSeconds }),
    });
  }

  // Progress & Analytics
  async getProgressOverview() {
    return this.request('/progress/overview');
  }

  async getSubjectProgress() {
    return this.request('/progress/subjects');
  }

  async getWeakTopics() {
    return this.request('/progress/weak-topics');
  }

  async getRecommendations() {
    return this.request('/progress/recommendations');
  }

  async getQuizHistory() {
    return this.request('/progress/history');
  }

  // Teacher Endpoints
  async getTeacherStudents() {
    return this.request('/teacher/students');
  }

  async getTeacherStudentDetail(studentId) {
    return this.request(`/teacher/students/${studentId}/progress`);
  }

  async getTeacherClassInsights() {
    return this.request('/teacher/class-insights');
  }

  // Admin Endpoints
  async getAdminAnalytics() {
    return this.request('/admin/analytics');
  }

  async getAdminUsers(role) {
    const q = role ? `?role=${role}` : '';
    return this.request(`/admin/users${q}`);
  }

  async updateAdminUserRole(userId, role) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // Automatic offline sync worker
  async syncOfflineAttempts() {
    if (!navigator.onLine) return 0;
    const pending = await offlineStorage.getPendingQuizAttempts();
    if (!pending.length) return 0;

    let syncedCount = 0;
    for (const attempt of pending) {
      try {
        await this.request(`/quizzes/${attempt.quizId}/submit`, {
          method: 'POST',
          body: JSON.stringify({
            answers: attempt.answers,
            timeTakenSeconds: attempt.timeTakenSeconds,
          }),
        });
        await offlineStorage.removeSyncedAttempt(attempt.id);
        syncedCount++;
      } catch (e) {
        console.warn(`[Sync] Failed to sync attempt ${attempt.id}:`, e);
      }
    }
    return syncedCount;
  }
}

export const api = new ApiService();
