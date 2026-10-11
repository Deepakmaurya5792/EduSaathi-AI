import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext({
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isOnline: true,
  pendingSyncCount: 0,
  login: async () => {},
  register: async () => {},
  loginAsDemo: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  syncPendingData: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('edusaathi_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingData = async () => {
    try {
      const synced = await api.syncOfflineAttempts();
      if (synced > 0) {
        console.log(`[Sync] Successfully uploaded ${synced} offline quiz attempts to cloud.`);
      }
      setPendingSyncCount(0);
    } catch (e) {
      console.warn('Sync failed:', e);
    }
  };

  // Check existing session
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('edusaathi_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          setProfile(res.profile || null);
        } else {
          localStorage.removeItem('edusaathi_token');
          setToken(null);
        }
      } catch {
        const cachedUser = localStorage.getItem('edusaathi_cached_user');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
          } catch {
            // Ignored
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('edusaathi_token', res.token);
        localStorage.setItem('edusaathi_cached_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        setProfile(res.profile || null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      if (res.success && res.token) {
        localStorage.setItem('edusaathi_token', res.token);
        localStorage.setItem('edusaathi_cached_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        setProfile(res.profile || null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (demoRole) => {
    let email = 'student@edusaathi.ai';
    let pass = 'Student@123';

    if (demoRole === 'teacher') {
      email = 'teacher@edusaathi.ai';
      pass = 'Teacher@123';
    } else if (demoRole === 'admin') {
      email = 'admin@edusaathi.ai';
      pass = 'Admin@123';
    }

    await login(email, pass);
  };

  const logout = () => {
    localStorage.removeItem('edusaathi_token');
    localStorage.removeItem('edusaathi_cached_user');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.updateProfile(data);
      if (res.success && res.profile) {
        setProfile(res.profile);
      }
    } catch (e) {
      console.error('Update profile error:', e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!user,
        isLoading,
        isOnline,
        pendingSyncCount,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
        syncPendingData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
