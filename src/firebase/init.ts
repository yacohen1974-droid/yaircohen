import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDataConnect } from 'firebase/data-connect';
import { firebaseConfig } from './config';
import { connectorConfig } from '@/lib/dataconnect';

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const authInstance = getAuth(app);
export const dataConnect = getDataConnect(app, connectorConfig);
