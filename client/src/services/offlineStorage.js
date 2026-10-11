import { openDB } from 'idb';

const DB_NAME = 'edusaathi_offline_db';
const DB_VERSION = 1;

let dbPromise = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('lessons')) {
          db.createObjectStore('lessons', { keyPath: '_id' });
        }
        if (!db.objectStoreNames.contains('offlineQuizQueue')) {
          db.createObjectStore('offlineQuizQueue', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const offlineStorage = {
  // Save lesson offline
  async saveLessonOffline(lesson) {
    const db = await getDB();
    await db.put('lessons', { ...lesson, isSavedOffline: true });
  },

  // Remove lesson from offline storage
  async removeLessonOffline(lessonId) {
    const db = await getDB();
    await db.delete('lessons', lessonId);
  },

  // Check if a lesson is saved offline
  async isLessonOffline(lessonId) {
    const db = await getDB();
    const item = await db.get('lessons', lessonId);
    return !!item;
  },

  // Get all offline lessons
  async getAllOfflineLessons() {
    const db = await getDB();
    return db.getAll('lessons');
  },

  // Queue quiz attempt offline
  async queueOfflineQuizAttempt(quizId, answers, timeTakenSeconds) {
    const db = await getDB();
    const queueId = `offline_attempt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.put('offlineQuizQueue', {
      id: queueId,
      quizId,
      answers,
      timeTakenSeconds,
      timestamp: Date.now(),
      synced: false,
    });
    return queueId;
  },

  // Get all pending offline quiz attempts
  async getPendingQuizAttempts() {
    const db = await getDB();
    return db.getAll('offlineQuizQueue');
  },

  // Remove synchronized item
  async removeSyncedAttempt(id) {
    const db = await getDB();
    await db.delete('offlineQuizQueue', id);
  },

  // Clear all cached storage
  async clearAllStorage() {
    const db = await getDB();
    await db.clear('lessons');
    await db.clear('offlineQuizQueue');
  },
};
