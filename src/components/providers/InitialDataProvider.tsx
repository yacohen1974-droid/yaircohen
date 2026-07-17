"use client";

import React, { createContext, useContext } from 'react';

const InitialDataContext = createContext<any>(null);

export function InitialDataProvider({ children, initialData }: { children: React.ReactNode; initialData: any }) {
  return (
    <InitialDataContext.Provider value={initialData}>
      {children}
    </InitialDataContext.Provider>
  );
}

export function useInitialData() {
  return useContext(InitialDataContext);
}
