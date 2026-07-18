'use client';

import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { app, db, authInstance } from './init';
import { ALLOWED_ADMIN_EMAILS } from '@/lib/site-config';

export function initializeFirebase() {
  return { app, firestore: db, auth: authInstance };
}

export const useFirestore = () => db;

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMock = false;
    if (typeof window !== 'undefined') {
      const isMockLoggedIn = window.localStorage.getItem('is_mock_logged_in') === 'true';
      const mockEmail = window.localStorage.getItem('mock_user_email');
      if (isMockLoggedIn && mockEmail) {
        setUser({ email: mockEmail, isMock: true });
        setLoading(false);
        isMock = true;
      }
    }

    if (isMock) return;

    return authInstance.onAuthStateChanged((usr) => {
      setUser(usr);
      setLoading(false);
    });
  }, []);

  const signOut = async () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('is_mock_logged_in');
        window.localStorage.removeItem('mock_user_email');
      }
      await fbSignOut(authInstance);
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(authInstance, provider);
      const allowedEmails = ALLOWED_ADMIN_EMAILS;
      if (result.user && result.user.email && allowedEmails.includes(result.user.email)) {
        return result.user;
      } else {
        await fbSignOut(authInstance);
        throw new Error('שגיאת הרשאה: אימייל זה אינו מורשה לניהול האתר.');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  return { user, loading, signOut, signInWithGoogle };
};

export const useUser = useAuth;

export { useDoc } from './firestore/use-doc';
export { useCollection } from './firestore/use-collection';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  return children;
}
