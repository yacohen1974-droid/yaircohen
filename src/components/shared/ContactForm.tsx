"use client";

import React, { useState } from 'react';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, ArrowLeft, Phone, User, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';

export function ContactForm({ isLight = false }: { isLight?: boolean }) {
  const revealRef = useReveal();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Portrait image of Yair
  const yairPortrait = "https://69ef5d7cabe5326bdb422710.imgix.net/%D7%99%D7%90%D7%99%D7%A8%20%D7%9B%D7%94%D7%9F1.png";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/maqlpnkl", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        throw new Error("שליחת הטופס נכשלה");
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 animate-in fade-in zoom-in duration-700 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/60 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-4xl md:text-5xl font-headline font-bold text-accent mb-6">תודה, ההודעה התקבלה!</h3>
        <p className="text-xl text-slate-600 font-light mb-10 max-w-lg mx-auto leading-relaxed px-6">
          קיבלתי את הפרטים שלכם. אני כבר מתחיל לעבור על הנתונים ואחזור אליכם בהקדם לשיחת ייעוץ ראשונית.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="btn-3d btn-3d-gold px-12 py-4 rounded-xl font-bold inline-flex items-center gap-3"
        >
          חזרה לטופס
          <ArrowLeft size={18} />
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={revealRef} 
      className="max-w-7xl mx-auto reveal px-4 md:px-0"
    >
      <div className="finance-gradient rounded-[3rem] overflow-hidden shadow-[0_30px_90px_rgba(30,58,138,0.3)] border border-white/10 grid grid-cols-1 lg:grid-cols-10 gap-0 relative">
        
        {/* ── Left Side: Yair Portrait (30%) ── */}
        <div className="lg:col-span-3 relative min-h-[350px] lg:min-h-[550px] bg-white/5 overflow-hidden group border-b lg:border-b-0 lg:border-l border-white/10">
          {/* Decorative aura behind Yair */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] bg-[radial-gradient(circle,hsl(var(--primary)/0.15)_0%,transparent_70%)] animate-pulse pointer-events-none" />
          
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative w-full h-[95%] transition-transform duration-1000 group-hover:scale-105">
              <Image 
                src={yairPortrait} 
                alt="יאיר כהן - מומחה למשכנתאות ומימון נדל״ן" 
                fill 
                unoptimized={true}
                className="object-contain object-bottom drop-shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>
          </div>

          {/* Floating Trust Badge */}
          <div className="absolute bottom-10 right-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 animate-float text-white lg:bottom-auto lg:top-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold opacity-60 uppercase tracking-tighter">מומחיות מוכחת</div>
              <div className="text-sm font-headline font-bold">ליווי אישי מקצה לקצה</div>
            </div>
          </div>
        </div>

        {/* ── Right Side: Form (70%) ── */}
        <div className="lg:col-span-7 p-8 md:p-14 lg:p-16 flex flex-col justify-center relative bg-white/[0.02] backdrop-blur-sm">
          <div className="mb-10 max-w-3xl">
            <h3 className="text-3xl md:text-5xl font-headline font-bold text-white mb-6 leading-tight">
              הגיע הזמן שהבנקים יעבדו בשבילכם
            </h3>
            <p className="text-primary-foreground/70 text-lg md:text-xl font-light leading-relaxed">
              השאירו פרטים ותנו לי להפוך את המשא ומתן המתיש מול הבנקים לחיסכון של מאות אלפי שקלים בתיק המשכנתא שלכם.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-white/50 text-[11px] font-bold mr-2 uppercase tracking-widest block">שם מלא</label>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                    <User size={16} />
                  </div>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="איך תרצו שנקרא לכם?"
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/40 focus:bg-white/10 rounded-xl py-3.5 pr-11 pl-4 text-white placeholder:text-white/15 outline-none transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/50 text-[11px] font-bold mr-2 uppercase tracking-widest block">טלפון ליצירת קשר</label>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                    <Phone size={16} />
                  </div>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    placeholder="המספר הכי זמין שלכם"
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/40 focus:bg-white/10 rounded-xl py-3.5 pr-11 pl-4 text-white placeholder:text-white/15 outline-none transition-all duration-300 text-sm font-sans"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/50 text-[11px] font-bold mr-2 uppercase tracking-widest block">יעד הפנייה</label>
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors pointer-events-none">
                    <Star size={16} />
                  </div>
                  <select 
                    name="service" 
                    required
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/40 focus:bg-white/10 rounded-xl py-3.5 pr-11 pl-4 text-white placeholder:text-white/15 outline-none transition-all duration-300 appearance-none text-sm"
                  >
                    <option value="" className="text-slate-900">באיזה שלב אתם?</option>
                    <option value="first-home" className="text-slate-900">רכישת דירה ראשונה</option>
                    <option value="investment" className="text-slate-900">השקעת נדל"ן מניבה</option>
                    <option value="refinance" className="text-slate-900">שיפור תנאי משכנתא קיימת</option>
                    <option value="consult" className="text-slate-900">ייעוץ פיננסי אסטרטגי</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/50 text-[11px] font-bold mr-2 uppercase tracking-widest block">ספרו לי קצת על המקרה שלכם</label>
              <div className="relative group">
                <div className="absolute right-4 top-5 text-white/20 group-focus-within:text-primary transition-colors">
                  <MessageSquare size={16} />
                </div>
                <textarea 
                  name="message" 
                  rows={2}
                  placeholder="מה האתגר העיקרי שלכם כרגע?"
                  className="w-full bg-white/5 border border-white/10 focus:border-primary/40 focus:bg-white/10 rounded-xl py-3.5 pr-11 pl-4 text-white placeholder:text-white/15 outline-none transition-all duration-300 text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
              <div className="flex items-center gap-3 text-white/30 text-[11px]">
                <input type="checkbox" id="terms" required className="w-4 h-4 rounded border-white/10 bg-white/5 accent-primary cursor-pointer" />
                <label htmlFor="terms" className="cursor-pointer hover:text-white transition-colors">
                  אני מאשר קבלת שיחה חוזרת מיאיר כהן ייעוץ למשכנתאות
                </label>
              </div>

              <button 
                type="submit"
                disabled={status === 'submitting'}
                className="btn-3d btn-3d-gold w-full md:w-auto px-10 py-4 rounded-xl font-headline font-bold text-lg flex items-center justify-center gap-3 group disabled:opacity-50 transition-all"
              >
                {status === 'submitting' ? 'שולח נתונים...' : 'לבדיקת פוטנציאל החיסכון'}
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
              </button>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-3 text-red-300 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-in fade-in">
                <AlertCircle size={18} />
                <p className="text-xs">אירעה שגיאה. בואו ננסה שוב או דברו איתי בוואטסאפ.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
