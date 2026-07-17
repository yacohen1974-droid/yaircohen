
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ChevronRight, Search, Image as ImageIcon,
  FileText, Layout, Settings, Box,
  Lock, ShieldCheck, Globe, Palette, HelpCircle, Heart,
  Sparkles, Orbit, Compass, Users, Star,
  Type, MousePointerClick, BookOpen, MessageSquare
} from 'lucide-react';
import { ADMIN_HELP_CONTENT } from '@/config/admin-help-content';

const ICON_MAP: Record<string, React.ReactNode> = {
  Lock: <Lock className="text-primary" />,
  Layout: <Layout className="text-primary" />,
  Type: <Type className="text-primary" />,
  Image: <ImageIcon className="text-primary" />,
  Box: <Box className="text-primary" />,
  FileText: <FileText className="text-primary" />,
  Sparkles: <Sparkles className="text-primary" />,
  MousePointerClick: <MousePointerClick className="text-primary" />,
  Globe: <Globe className="text-primary" />,
  Palette: <Palette className="text-primary" />,
  HelpCircle: <HelpCircle className="text-primary" />,
  BookOpen: <BookOpen className="text-primary" />,
};

export default function AdminHelpPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredTopics = ADMIN_HELP_CONTENT.filter(topic =>
    topic.title.includes(search) || 
    topic.content.some(c => c.sub.includes(search) || c.text.includes(search))
  );

  return (
    <main className="min-h-screen bg-stone-50 text-right">
      <Navbar />
      <section className="pt-48 pb-32 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-stone-200 pb-10">
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => router.push('/admin/dashboard')} className="text-stone-400 p-0 hover:text-primary">
              <ChevronRight className="ml-2" /> חזרה ללוח הבקרה
            </Button>
            <h1 className="text-6xl font-handwriting text-accent">מרכז ידע ותמיכה</h1>
            <p className="text-stone-500 font-headline">כל המידע שאת צריכה כדי לנהל את Brand Name בצורה מקצועית.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 size-5" />
            <Input 
              placeholder="חפשי נושא עזרה (למשל: סיסמה, תמונות...)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-12 h-12 bg-white border-none shadow-sm rounded-none font-headline"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {filteredTopics.length === 0 ? (
              <div className="text-center py-20 bg-white shadow-sm">
                <HelpCircle className="mx-auto size-12 text-stone-200 mb-4" />
                <p className="text-xl text-stone-400 font-headline">לא מצאנו תוצאות לחיפוש שלכם...</p>
              </div>
            ) : filteredTopics.map((topic) => (
              <Card key={topic.id} className="border-none shadow-xl rounded-none overflow-hidden">
                <CardHeader className="bg-stone-50/50 border-b border-stone-100 py-6">
                  <CardTitle className="flex items-center gap-4 text-2xl font-headline text-accent">
                    <span className="p-2 bg-white rounded-sm shadow-sm">{ICON_MAP[topic.icon] ?? <HelpCircle className="text-primary" />}</span>
                    {topic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <Accordion type="multiple" className="w-full">
                    {topic.content.map((item, idx) => (
                      <AccordionItem key={idx} value={`${topic.id}-${idx}`} className="border-b border-stone-50 last:border-0 pb-2">
                        <AccordionTrigger className="text-lg font-headline font-bold text-stone-700 hover:text-primary text-right py-4 hover:no-underline">
                          {item.sub}
                        </AccordionTrigger>
                        <AccordionContent className="text-base font-headline text-stone-500 leading-relaxed py-4 pr-4 border-r-2 border-primary/10">
                          {item.text}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar / Quick Tips */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-accent text-white border-none rounded-none p-8">
              <h3 className="text-2xl font-handwriting mb-6">טיפ מקצועי</h3>
              <p className="font-headline font-light leading-relaxed opacity-90">
                הכלל הזהוב: פחות זה יותר. משפטים קצרים, מרווחים גדולים בין פסקאות. זכרי — כותרת Hero ב-Handwriting + כפתור Primary בולט + תמונה נפרדת למובייל = עמוד מושלם.
              </p>
            </Card>

            <Card className="border-none shadow-lg rounded-none p-8 space-y-6">
              <h3 className="text-xl font-headline font-bold text-accent border-b border-stone-100 pb-4">אייקונים זמינים</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Heart', icon: <Heart size={16} /> },
                  { name: 'Sparkles', icon: <Sparkles size={16} /> },
                  { name: 'Orbit', icon: <Orbit size={16} /> },
                  { name: 'Compass', icon: <Compass size={16} /> },
                  { name: 'Users', icon: <Users size={16} /> },
                  { name: 'Star', icon: <Star size={16} /> },
                  { name: 'MessageSquare', icon: <MessageSquare size={16} /> },
                  { name: 'HelpCircle', icon: <HelpCircle size={16} /> },
                ].map((icon, i) => (
                  <div key={i} className="flex items-center gap-3 text-stone-400">
                    <div className="p-2 bg-stone-50 text-primary">{icon.icon}</div>
                    <span className="text-xs uppercase font-bold tracking-tighter">{icon.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="p-6 border-2 border-dashed border-stone-200 text-center space-y-4">
              <p className="text-sm font-headline text-stone-400 italic">זקוקה לעזרה טכנית נוספת?</p>
              <a href="mailto:support@brandname.com" className="block text-primary font-bold hover:underline">
                support@brandname.com
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
