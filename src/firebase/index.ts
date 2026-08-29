'use client';

import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app, db, authInstance } from './init';

/**
 * Checks the `admins/{email}` Firestore doc for the signed-in user. Admin
 * access is granted/revoked by creating/deleting that doc in the Firebase
 * console — no code or security-rules change needed.
 */
export async function isAdminEmail(email: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'admins', email.toLowerCase()));
    return snap.exists();
  } catch (e) {
    console.error('isAdminEmail check failed (likely a Firestore rules/permission issue, not a missing doc):', e);
    return false;
  }
}

export function initializeFirebase() {
  return { app, firestore: db, auth: authInstance };
}

/** ID token for the signed-in admin, to send as `Authorization: Bearer <token>` on admin API calls. */
export async function getAdminIdToken(): Promise<string | null> {
  const user = authInstance.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
}

export const useFirestore = () => db;

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return authInstance.onAuthStateChanged((usr) => {
      setUser(usr);
      setLoading(false);
    });
  }, []);

  const signOut = async () => {
    try {
      await fbSignOut(authInstance);
      if (typeof window !== 'undefined') {
        document.cookie = 'cms_preview=; path=/; max-age=0';
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
      if (result.user && result.user.email && await isAdminEmail(result.user.email)) {
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
