import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const authInstance = getAuth(app);

if (typeof window !== 'undefined') {
  (window as any).db = db;
  (window as any).firestore = { doc, setDoc };
}
