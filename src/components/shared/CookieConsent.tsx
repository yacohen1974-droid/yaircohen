"use client";

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { Cookie, Sliders, ChevronDown, Check } from 'lucide-react';

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: ConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_PREFERENCES);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('cookie-consent-preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
      } catch (e) {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (prefs: ConsentPreferences) => {
    localStorage.setItem('cookie-consent-preferences', JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleDeclineAll = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
    });
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Dynamic Google Analytics script if analytics is accepted */}
      {preferences.analytics && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-CTGVLV3791"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CTGVLV3791');
            `}
          </Script>
        </>
      )}



      {/* Slide-up Banner */}
      {showBanner && (
        <div 
          dir="rtl"
          className="fixed bottom-6 left-6 right-6 md:right-auto md:w-[380px] max-w-full z-50 p-5 bg-white border border-stone-200/80 text-stone-900 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col gap-4 text-right animate-in slide-in-from-bottom duration-500"
        >
          <div className="space-y-2 text-right">
            <h4 className="text-sm font-bold text-stone-900 font-sans">
              אנחנו מכבדים את הפרטיות שלכם
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed font-sans font-normal">
              אנחנו משתמשים בעוגיות כדי לשפר את חווית הגלישה באתר ולנתח את התנועה בו. בהמשך הגלישה או בלחיצה על "אישור הכל", אתם מסכימים לשימוש בעוגיות.{' '}
              <a href="/privacy" className="underline text-primary hover:text-primary/80 transition-colors font-semibold">
                מדיניות פרטיות
              </a>
            </p>

            {/* Advanced Settings Panel */}
            {showSettings && (
              <div className="mt-4 pt-4 border-t border-stone-100 space-y-3 animate-in fade-in duration-300">
                <h5 className="text-xs font-bold text-stone-900 font-sans">ניהול העדפות עוגיות</h5>
                <div className="space-y-2">
                  {/* Necessary */}
                  <div className="flex items-center justify-between gap-3 p-2 bg-stone-50 rounded-lg border border-stone-100">
                    <div className="flex-1 text-right">
                      <div className="font-bold text-stone-800 text-[11px] font-sans">עוגיות חיוניות</div>
                      <p className="text-[9px] text-stone-500 leading-normal font-sans">
                        נחוצות לצורך הפעלה תקינה ומאובטחת של האתר.
                      </p>
                    </div>
                    <span className="text-[9px] bg-stone-200 text-stone-600 font-bold px-2 py-0.5 rounded shrink-0">פעיל תמיד</span>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between gap-3 p-2 bg-stone-50 rounded-lg border border-stone-100">
                    <div className="flex-1 text-right">
                      <div className="font-bold text-stone-800 text-[11px] font-sans">אנליטיקה וסטטיסטיקה</div>
                      <p className="text-[9px] text-stone-500 leading-normal font-sans">
                        מסייעות לנו להבין כיצד הגולשים מתקשרים עם האתר.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between gap-3 p-2 bg-stone-50 rounded-lg border border-stone-100">
                    <div className="flex-1 text-right">
                      <div className="font-bold text-stone-800 text-[11px] font-sans">שיווק ופרסום</div>
                      <p className="text-[9px] text-stone-500 leading-normal font-sans">
                        עוגיות למעקב והתאמת תכנים פרסומיים ברשתות.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showSettings ? (
              <>
                <button
                  onClick={() => savePreferences(preferences)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-bold py-2 px-3.5 rounded-lg text-xs transition-all shadow-sm shrink-0"
                >
                  שמירת העדפות
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="border border-primary text-primary hover:bg-primary/5 bg-transparent font-sans font-bold py-2 px-3.5 rounded-lg text-xs transition-all shrink-0"
                >
                  ביטול
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-bold py-2 px-3.5 rounded-lg text-xs transition-all shadow-sm shrink-0"
                >
                  אישור הכל
                </button>
                <button
                  onClick={handleDeclineAll}
                  className="border border-primary text-primary hover:bg-primary/5 bg-transparent font-sans font-bold py-2 px-3.5 rounded-lg text-xs transition-all shrink-0"
                >
                  דחייה
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="border border-primary text-primary hover:bg-primary/5 bg-transparent font-sans font-bold py-2 px-3.5 rounded-lg text-xs transition-all shrink-0"
                >
                  התאמה אישית
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
