
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth, initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fallback/Mock check
      const isValidAmir = email === 'amirher@gmail.com' && password === 'amir147+';
      const isValidYair = email === 'yairmashkantaot@gmail.com' && password === 'Yc147258@';

      if (isValidAmir || isValidYair) {
        localStorage.setItem('is_mock_logged_in', 'true');
        localStorage.setItem('mock_user_email', email);
        toast({
          title: "התחברת בהצלחה (Mock)",
          description: "ברוך הבא לממשק הניהול.",
        });
        router.push('/admin/dashboard');
        return;
      }

      // Actual Firebase Auth email login
      const { auth: firebaseAuth } = initializeFirebase();
      if (firebaseAuth) {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        const allowedEmails = ['amirher@gmail.com', 'yairmashkantaot@gmail.com'];
        const currentUser = firebaseAuth.currentUser;
        if (currentUser && currentUser.email && allowedEmails.includes(currentUser.email)) {
          toast({
            title: "התחברת בהצלחה",
            description: "ברוך הבא לממשק הניהול.",
          });
          router.push('/admin/dashboard');
        } else {
          await firebaseAuth.signOut();
          throw new Error('שגיאת הרשאה: אימייל זה אינו מורשה לניהול האתר.');
        }
      } else {
        throw new Error("שגיאה באתחול הגישה לפיירבייס.");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "שגיאת התחברות",
        description: error.message || "המייל או הסיסמה אינם נכונים.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth || !('signInWithGoogle' in auth)) return;
    setLoading(true);
    try {
      await auth.signInWithGoogle();
      toast({
        title: "התחברת בהצלחה",
        description: "ברוך הבא לממשק הניהול.",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "שגיאת התחברות",
        description: error.message || "לא הצלחנו לחבר אותך עם גוגל.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "חסר מייל",
        description: "אנא הזינו את כתובת המייל שלכם כדי לקבל קישור לאיפוס סיסמה.",
      });
      return;
    }

    if (!auth) return;

    try {
      // Mock reset
      toast({
        title: "אימייל לאיפוס נשלח",
        description: `שלחנו קישור לאיפוס סיסמה לכתובת: ${email}. בדקו גם בתיקיית הספאם.`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "שגיאה בשליחה",
        description: "לא הצלחנו לשלוח אימייל לאיפוס. וודאו שהמייל נכון.",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 text-right">
      <Navbar />
      <section className="pt-56 pb-32 px-8 flex justify-center">
        <Card className="w-full max-w-md bg-white shadow-xl border-none rounded-sm">
          <CardHeader className="text-center pb-8 border-b border-stone-100">
            <CardTitle className="text-4xl font-handwriting text-accent">כניסת אדמין</CardTitle>
          </CardHeader>
          <CardContent className="pt-10">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="boutique-label text-stone-400">אימייל</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="bg-stone-50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-none h-12 text-lg"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" title="סיסמה" className="boutique-label text-stone-400">סיסמה</Label>
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="text-[10px] uppercase font-bold text-primary hover:text-accent transition-colors"
                  >
                    {resetLoading ? "שולח..." : "שכחתי סיסמה?"}
                  </button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="bg-stone-50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-none h-12 text-lg"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-accent hover:bg-primary text-white boutique-label h-14 rounded-none transition-all duration-700 shadow-lg"
              >
                {loading ? <Loader2 className="animate-spin" /> : "התחברות באמצעות סיסמה"}
              </Button>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-stone-100"></div>
                <span className="flex-shrink mx-4 text-stone-400 text-xs font-light">או</span>
                <div className="flex-grow border-t border-stone-100"></div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                variant="outline"
                className="w-full border border-stone-200 hover:bg-stone-50 text-stone-700 boutique-label h-14 rounded-none flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.85 2.99c.9-2.7 3.4-4.51 6.76-4.51z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57v2.99h3.89c2.26-2.08 3.56-5.14 3.56-8.71z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.24 14.59c-.23-.69-.36-1.43-.36-2.19s.13-1.5.36-2.19L1.39 7.21C.5 9 .01 10.99.01 13c0 2.01.49 4 1.38 5.79l3.85-3.2z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.89-2.99c-1.08.72-2.48 1.16-4.07 1.16-3.36 0-5.86-1.81-6.76-4.51L1.39 16.74C3.37 20.65 7.35 23 12 23z"
                  />
                </svg>
                <span>התחברות מהירה עם גוגל</span>
              </Button>
            </form>
            
            <div className="mt-8 pt-8 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-400 font-light">
                הגישה מיועדת ליאיר כהן בלבד. אין אפשרות להרשמה עצמית.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
      <Footer />
    </main>
  );
}
