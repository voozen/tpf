import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { User } from '@/types';

const SESSION_KEY = 'budgetsplit_session';

type Session = {
  user: User;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function buildUser(name: string, email: string): User {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : (parts[0]?.slice(0, 2) ?? email[0]).toUpperCase();

  return {
    id: crypto.randomUUID(),
    name: name.trim() || email.split('@')[0],
    email,
    initials,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readSession()?.user ?? null);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const sessionUser = buildUser(email.split('@')[0], email);
    const session = { user: sessionUser };
    writeSession(session);
    setUser(sessionUser);
  }, []);

  const signUp = useCallback(async (name: string, email: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const sessionUser = buildUser(name, email);
    const session = { user: sessionUser };
    writeSession(session);
    setUser(sessionUser);
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      signUp,
      logout,
    }),
    [user, login, signUp, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
