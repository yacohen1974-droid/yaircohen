
'use client';

import React, { createContext, useContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextProps {
  app: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextProps>({
  app: null,
  firestore: null,
  auth: null,
});

export const FirebaseProvider: React.FC<{
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  children: React.ReactNode;
}> = ({ app, firestore, auth, children }) => {
  return (
    <FirebaseContext.Provider value={{ app, firestore, auth }}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => useContext(FirebaseContext).app;
export const useFirestore = () => useContext(FirebaseContext).firestore;
export const useAuth = () => useContext(FirebaseContext).auth;
