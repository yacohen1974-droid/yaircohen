"use client";

import React from 'react';
import { PublishBanner } from '@/components/admin/PublishBanner';
import { AdminHeader } from '@/components/admin/AdminHeader';

/** Common chrome for every screen under /admin — sticky publish banner + admin header, no public Navbar/Footer. */
export function AdminShell({ children, currentPath }: { children: React.ReactNode; currentPath?: string }) {
  return (
    <div className="min-h-screen bg-stone-50 text-right">
      <div className="sticky top-0 z-[900]">
        <PublishBanner currentPath={currentPath} />
        <AdminHeader />
      </div>
      {children}
    </div>
  );
}
