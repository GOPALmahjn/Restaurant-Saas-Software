import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  updateProfile as updateProfileApi,
} from '../api/authApi';

const AuthContext = createContext(null);

const USER_KEY = 'user';
const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSession = ({ user, accessToken, refreshToken }) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
};

const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

/**
 * A network error (backend not running) — as opposed to a real 4xx from the
 * server rejecting the credentials. The app is designed to work without the
 * Java backend, so on a genuine network failure we fall back to a local demo
 * session instead of blocking the user.
 */
const isNetworkError = (error) => !error?.response;

const buildDemoUser = ({ name, email, phone }) => ({
  id: 'demo-user',
  name: name || (email ? email.split('@')[0] : 'Guest'),
  email: email || 'guest@velvetbloom.local',
  phone: phone || '',
  role: 'customer',
  avatar: null,
  preferences: { language: 'en', notifications: true },
  favorites: [],
  createdAt: new Date().toISOString(),
  demo: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  // Hydrate from the backend on mount when we have a token.
  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      const token = localStorage.getItem(ACCESS_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getMe();
        if (!cancelled && data?.data) {
          setUser(data.data);
          localStorage.setItem(USER_KEY, JSON.stringify(data.data));
        }
      } catch (error) {
        // Keep an existing demo/session user offline; only drop it on a real 401.
        if (!cancelled && !isNetworkError(error)) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      const { data } = await loginUser({ email, password });
      const payload = data?.data;
      persistSession(payload);
      setUser(payload.user);
      return payload.user;
    } catch (error) {
      if (isNetworkError(error)) {
        const demoUser = buildDemoUser({ email });
        persistSession({ user: demoUser, accessToken: 'demo-token' });
        setUser(demoUser);
        return demoUser;
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }, []);

  const register = useCallback(async ({ name, email, password, phone }) => {
    try {
      const { data } = await registerUser({ name, email, password, phone });
      const payload = data?.data;
      persistSession(payload);
      setUser(payload.user);
      return payload.user;
    } catch (error) {
      if (isNetworkError(error)) {
        const demoUser = buildDemoUser({ name, email, phone });
        persistSession({ user: demoUser, accessToken: 'demo-token' });
        setUser(demoUser);
        return demoUser;
      }
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore — we clear the local session regardless.
    }
    clearSession();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      try {
        const { data } = await updateProfileApi(updates);
        const updated = data?.data;
        setUser(updated);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        return updated;
      } catch (error) {
        if (isNetworkError(error)) {
          const updated = { ...user, ...updates };
          setUser(updated);
          localStorage.setItem(USER_KEY, JSON.stringify(updated));
          return updated;
        }
        throw new Error(error.response?.data?.message || 'Could not update profile');
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, loading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
