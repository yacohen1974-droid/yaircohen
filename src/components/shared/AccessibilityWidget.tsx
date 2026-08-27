"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Accessibility, 
  X, 
  RotateCcw, 
  Eye, 
  Type, 
  Activity, 
  MousePointer, 
  Link2, 
  Plus, 
  Minus 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  const [disableAnimations, setDisableAnimations] = useState(false);
  const [largeCursor, setLargeCursor] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [textSize, setTextSize] = useState<0 | 1 | 2 | 3>(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load settings on mount
  useEffect(() => {
    try {
      const savedContrast = localStorage.getItem('acc-contrast') === 'true';
      const savedFont = localStorage.getItem('acc-font') === 'true';
      const savedAnim = localStorage.getItem('acc-anim') === 'true';
      const savedCursor = localStorage.getItem('acc-cursor') === 'true';
      const savedLinks = localStorage.getItem('acc-links') === 'true';
      const savedSize = parseInt(localStorage.getItem('acc-size') || '0', 10) as 0 | 1 | 2 | 3;

      setContrast(savedContrast);
      setReadableFont(savedFont);
      setDisableAnimations(savedAnim);
      setLargeCursor(savedCursor);
      setHighlightLinks(savedLinks);
      setTextSize(savedSize);
    } catch (e) {
      console.error('Failed to load accessibility settings', e);
    }
  }, []);

  // Update HTML classes & localStorage when settings change
  useEffect(() => {
    const root = document.documentElement;
    
    if (contrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('acc-contrast', String(contrast));
  }, [contrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (readableFont) {
      root.classList.add('readable-font');
    } else {
      root.classList.remove('readable-font');
    }
    localStorage.setItem('acc-font', String(readableFont));
  }, [readableFont]);

  useEffect(() => {
    const root = document.documentElement;
    if (disableAnimations) {
      root.classList.add('disable-animations');
    } else {
      root.classList.remove('disable-animations');
    }
    localStorage.setItem('acc-anim', String(disableAnimations));
  }, [disableAnimations]);

  useEffect(() => {
    const root = document.documentElement;
    if (largeCursor) {
      root.classList.add('large-cursor');
    } else {
      root.classList.remove('large-cursor');
    }
    localStorage.setItem('acc-cursor', String(largeCursor));
  }, [largeCursor]);

  useEffect(() => {
    const root = document.documentElement;
    if (highlightLinks) {
      root.classList.add('highlight-links');
    } else {
      root.classList.remove('highlight-links');
    }
    localStorage.setItem('acc-links', String(highlightLinks));
  }, [highlightLinks]);

  useEffect(() => {
    const root = document.documentElement;
    if (textSize > 0) {
      root.setAttribute('data-text-size', String(textSize));
    } else {
      root.removeAttribute('data-text-size');
    }
    localStorage.setItem('acc-size', String(textSize));
  }, [textSize]);

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const resetAll = () => {
    setContrast(false);
    setReadableFont(false);
    setDisableAnimations(false);
    setLargeCursor(false);
    setHighlightLinks(false);
    setTextSize(0);
  };

  const increaseText = () => {
    if (textSize < 3) setTextSize((prev) => (prev + 1) as 0 | 1 | 2 | 3);
  };

  const decreaseText = () => {
    if (textSize > 0) setTextSize((prev) => (prev - 1) as 0 | 1 | 2 | 3);
  };

  return (
    <div dir="rtl" className="fixed bottom-6 left-6 z-[999] font-sans">
      {/* ── Floating Toggle Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
          isOpen 
            ? "bg-slate-900 text-white rotate-90" 
            : "bg-primary text-white hover:bg-slate-800"
        )}
        aria-label="תפריט נגישות"
        title="נגישות"
      >
        {isOpen ? <X className="size-6" /> : <Accessibility className="size-7 animate-gentle-pulse" />}
      </button>

      {/* ── Settings Panel ── */}
      <div
        ref={panelRef}
        className={cn(
          "absolute bottom-16 sm:bottom-20 left-0 w-[300px] sm:w-[320px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 transition-all duration-300 transform origin-bottom-left",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        )}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Accessibility className="size-5 text-primary" />
            <h3 className="text-base font-bold text-slate-800">הגדרות נגישות</h3>
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-full font-medium"
            title="איפוס הגדרות"
          >
            <RotateCcw className="size-3" />
            <span>איפוס</span>
          </button>
        </div>

        {/* Settings Body */}
        <div className="space-y-3.5">
          {/* 1. Font Size Control */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-2">
              <Type className="size-4.5 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">גודל גופן</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={decreaseText}
                disabled={textSize === 0}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all"
                aria-label="הקטן טקסט"
              >
                <Minus className="size-4" />
              </button>
              <span className="text-xs font-bold text-slate-700 w-10 text-center">
                {textSize === 0 ? "רגיל" : `+${textSize * 10}%`}
              </span>
              <button
                onClick={increaseText}
                disabled={textSize === 3}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all"
                aria-label="הגדל טקסט"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* 2. High Contrast */}
          <div className="flex items-center justify-between py-1">
            <label htmlFor="acc-contrast" className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                <Eye className="size-4.5" />
              </div>
              <span className="text-sm font-medium text-slate-700">ניגודיות גבוהה</span>
            </label>
            <button
              id="acc-contrast"
              role="switch"
              aria-checked={contrast}
              onClick={() => setContrast(!contrast)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                contrast ? "bg-primary" : "bg-slate-200"
              )}
            >
              <span 
                className={cn(
                  "block w-4 h-4 rounded-full bg-white transition-transform absolute top-1",
                  contrast ? "right-6" : "right-1"
                )}
              />
            </button>
          </div>

          {/* 3. Readable Font */}
          <div className="flex items-center justify-between py-1">
            <label htmlFor="acc-font" className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 font-bold text-xs">
                A
              </div>
              <span className="text-sm font-medium text-slate-700">גופן פשוט וקריא</span>
            </label>
            <button
              id="acc-font"
              role="switch"
              aria-checked={readableFont}
              onClick={() => setReadableFont(!readableFont)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                readableFont ? "bg-primary" : "bg-slate-200"
              )}
            >
              <span 
                className={cn(
                  "block w-4 h-4 rounded-full bg-white transition-transform absolute top-1",
                  readableFont ? "right-6" : "right-1"
                )}
              />
            </button>
          </div>

          {/* 4. Disable Animations */}
          <div className="flex items-center justify-between py-1">
            <label htmlFor="acc-anim" className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                <Activity className="size-4.5" />
              </div>
              <span className="text-sm font-medium text-slate-700">ביטול אנימציות</span>
            </label>
            <button
              id="acc-anim"
              role="switch"
              aria-checked={disableAnimations}
              onClick={() => setDisableAnimations(!disableAnimations)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                disableAnimations ? "bg-primary" : "bg-slate-200"
              )}
            >
              <span 
                className={cn(
                  "block w-4 h-4 rounded-full bg-white transition-transform absolute top-1",
                  disableAnimations ? "right-6" : "right-1"
                )}
              />
            </button>
          </div>

          {/* 5. Large Cursor */}
          <div className="flex items-center justify-between py-1">
            <label htmlFor="acc-cursor" className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                <MousePointer className="size-4.5" />
              </div>
              <span className="text-sm font-medium text-slate-700">סמן עכבר ענק</span>
            </label>
            <button
              id="acc-cursor"
              role="switch"
              aria-checked={largeCursor}
              onClick={() => setLargeCursor(!largeCursor)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                largeCursor ? "bg-primary" : "bg-slate-200"
              )}
            >
              <span 
                className={cn(
                  "block w-4 h-4 rounded-full bg-white transition-transform absolute top-1",
                  largeCursor ? "right-6" : "right-1"
                )}
              />
            </button>
          </div>

          {/* 6. Highlight Links */}
          <div className="flex items-center justify-between py-1">
            <label htmlFor="acc-links" className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                <Link2 className="size-4.5" />
              </div>
              <span className="text-sm font-medium text-slate-700">הדגשת קישורים</span>
            </label>
            <button
              id="acc-links"
              role="switch"
              aria-checked={highlightLinks}
              onClick={() => setHighlightLinks(!highlightLinks)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                highlightLinks ? "bg-primary" : "bg-slate-200"
              )}
            >
              <span 
                className={cn(
                  "block w-4 h-4 rounded-full bg-white transition-transform absolute top-1",
                  highlightLinks ? "right-6" : "right-1"
                )}
              />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-center text-slate-400 font-light leading-relaxed">
          נגישות האתר מותאמת לתקן WCAG 2.1 ברמת AA
        </div>
      </div>
    </div>
  );
}
