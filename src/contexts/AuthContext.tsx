import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { getAuthErrorMessage } from '@/lib/authErrors';
import type { User } from '@/types';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  const displayName = firebaseUser.displayName?.trim() || firebaseUser.email?.split('@')[0] || 'User';
  const parts = displayName.split(/\s+/).filter(Boolean);
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : (parts[0]?.slice(0, 2) ?? 'U').toUpperCase();

  return {
    id: firebaseUser.uid,
    name: displayName,
    email: firebaseUser.email ?? '',
    initials,
  };
}

function assertFirebaseAuth() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      'Firebase is not configured. Copy .env.example to .env and add your Firebase web app credentials.',
    );
  }
  return auth;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const firebaseAuth = assertFirebaseAuth();
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const firebaseAuth = assertFirebaseAuth();
    try {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      if (name.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() });
      }
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const firebaseAuth = assertFirebaseAuth();
    try {
      await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const firebaseAuth = assertFirebaseAuth();
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const logout = useCallback(async () => {
    const firebaseAuth = assertFirebaseAuth();
    await signOut(firebaseAuth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAuthReady,
      login,
      signUp,
      loginWithGoogle,
      resetPassword,
      logout,
    }),
    [user, isAuthReady, login, signUp, loginWithGoogle, resetPassword, logout],
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
