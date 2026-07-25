"use client";

import React, { useEffect, useState } from 'react';
import { Eye, X } from 'lucide-react';

export function PreviewModeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(document.cookie.split('; ').some(c => c.trim() === 'cms_preview=1'));
  }, []);

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-amber-500 text-stone-900 min-h-12 flex flex-wrap items-center justify-between gap-2 px-4 md:px-8 py-2 text-sm font-bold shadow-lg"
    >
      <div className="flex items-center gap-2">
        <Eye size={16} className="shrink-0" />
        <span>מצב תצוגה מקדימה — התוכן כאן טרם פורסם באתר החי</span>
      </div>
      <a
        href="/api/admin/preview/exit"
        className="flex items-center gap-1 hover:underline shrink-0"
      >
        <X size={14} /> יציאה מהתצוגה המקדימה
      </a>
    </div>
  );
}
