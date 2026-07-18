"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[140] flex items-center justify-center",
        "w-12 h-12 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100/80 bg-white/90 backdrop-blur-md text-accent",
        "transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:bg-primary hover:text-white hover:border-primary active:scale-95",
        isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="חזרה לראש העמוד"
    >
      <ArrowUp size={20} strokeWidth={2} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
