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

      {/* Cookie Preferences Floating Trigger Button */}
      {!showBanner && (
        <button
          onClick={() => {
            setShowBanner(true);
            setShowSettings(true);
          }}
          className="fixed bottom-6 right-6 xl:right-8 z-50 p-3.5 bg-slate-900/90 text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-slate-800 border border-slate-700/50 transition-all duration-300 group hover:scale-110 flex items-center justify-center"
          aria-label="הגדרות עוגיות ופרטיות"
        >
          <Cookie className="size-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      {/* Slide-up Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-full p-6 md:p-8 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 text-slate-200 shadow-[0_-15px_50px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom duration-500">
          <div className="max-w-6xl mx-auto flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-6">
            <div className="flex-1 space-y-4 text-right">
              <div className="flex items-center gap-3">
                <Cookie className="size-7 text-primary animate-pulse" />
                <h4 className="text-2xl font-headline font-bold text-white">אנחנו מעריכים את הפרטיות שלך</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-light max-w-4xl">
                באתר זה נעשה שימוש בעוגיות (Cookies) ובכלי מעקב כדי לשפר את חוויית הגלישה שלכם, לנתח את תעבורת האתר ולהתאים תכנים מקצועיים. 
                בהתאם לתיקון 13 לחוק הגנת הפרטיות, עוגיות שאינן חיוניות (כמו אנליטיקה סטטיסטית) חסומות כברירת מחדל וממתינות להסכמתכם. 
                באפשרותכם לאשר את כולן, לדחות את כולן או להתאים אישית את ההגדרות. למידע נוסף, קראו את{' '}
                <a href="/privacy" className="underline text-primary hover:text-white transition-colors font-medium">
                  מדיניות הפרטיות
                </a>{' '}
                שלנו.
              </p>

              {/* Advanced Settings Panel */}
              {showSettings && (
                <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-5 animate-in fade-in duration-300">
                  <h5 className="text-lg font-headline font-bold text-white">ניהול העדפות עוגיות</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Necessary */}
                    <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col justify-between gap-3 text-right">
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <Check className="size-4 text-emerald-400" />
                          עוגיות חיוניות (הכרחיות)
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          עוגיות אלו נחוצות לצורך הפעלה תקינה ומאובטחת של האתר, כגון שמירת העדפות הפרטיות שלך או תפקוד של טפסים. לא ניתן לבתו.
                        </p>
                      </div>
                      <div className="mt-2 self-start">
                        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2.5 py-1 rounded-lg">פעיל תמיד</span>
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col justify-between gap-3 text-right">
                      <div>
                        <div className="font-bold text-white text-sm">אנליטיקה וסטטיסטיקה</div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          עוגיות אלו מסייעות לנו להבין כיצד הגולשים מתקשרים עם האתר על ידי איסוף ודיווח של מידע אנונימי (כמו זמני שהייה ודפים נצפים) באמצעות Google Analytics.
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.analytics}
                            onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          <span className="mr-2 text-xs font-medium text-slate-300">{preferences.analytics ? 'מאושר' : 'חסום'}</span>
                        </label>
                      </div>
                    </div>

                    {/* Marketing */}
                    <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col justify-between gap-3 text-right">
                      <div>
                        <div className="font-bold text-white text-sm">שיווק ופרסום</div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          עוגיות אלו משמשות למעקב אחר יעילותם של קמפיינים שיווקיים והצגת תכנים פרסומיים רלוונטיים בדפי צד שלישי (למשל ברשתות חברתיות או מנועי חיפוש).
                        </p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.marketing}
                            onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          <span className="mr-2 text-xs font-medium text-slate-300">{preferences.marketing ? 'מאושר' : 'חסום'}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col sm:flex-row xl:flex-col items-stretch justify-center gap-3 w-full xl:w-auto shrink-0 self-stretch xl:self-center">
              {showSettings ? (
                <>
                  <button
                    onClick={() => savePreferences(preferences)}
                    className="bg-primary hover:bg-primary/90 text-white font-headline font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-md shadow-primary/20 text-center"
                  >
                    שמירת העדפות
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="border border-slate-700 hover:bg-slate-900 text-slate-300 font-headline font-bold py-3 px-8 rounded-xl text-sm transition-all text-center"
                  >
                    ביטול
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleAcceptAll}
                    className="bg-primary hover:bg-primary/90 text-white font-headline font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-md shadow-primary/20 text-center"
                  >
                    אישור הכל
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="border border-slate-700 hover:bg-slate-900 text-slate-300 font-headline font-bold py-3 px-8 rounded-xl text-sm transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Sliders className="size-4" />
                    הגדרות
                  </button>
                  <button
                    onClick={handleDeclineAll}
                    className="text-slate-400 hover:text-white hover:bg-slate-900 font-headline font-bold py-3 px-8 rounded-xl text-sm transition-all text-center"
                  >
                    חיוניות בלבד
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
