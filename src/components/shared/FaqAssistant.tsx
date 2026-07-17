
"use client";

import React, { useState } from 'react';
import { X, Send, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { aiPoweredFaqAssistant } from '@/ai/flows/ai-powered-faq-assistant-flow';
import { cn } from '@/lib/utils';

export function FaqAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();
    setQuestion('');
    setChat(prev => [...prev, { role: 'user', content: userQuestion }]);
    setIsLoading(true);

    try {
      const result = await aiPoweredFaqAssistant({ question: userQuestion });
      setChat(prev => [...prev, { role: 'assistant', content: result.answer }]);
    } catch (error) {
      setChat(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[150] flex flex-col items-start">
      {isOpen && (
        <div className="mb-4 w-[280px] sm:w-[350px] h-[450px] bg-white rounded-2xl shadow-2xl border border-primary/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <div className="flex items-center space-x-reverse space-x-2">
              <Sparkles size={18} />
              <span className="font-headline font-bold text-sm">Virtual Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {chat.length === 0 && (
              <div className="text-center py-6 px-4">
                <p className="text-stone-500 text-xs leading-relaxed">היי! אני כאן לענות על שאלות בנוגע לBrand Name, Process והפעילויות.</p>
                <p className="text-primary font-bold mt-2 text-sm">How can I help?</p>
              </div>
            )}
            {chat.map((msg, i) => (
              <div key={i} className={cn(
                "max-w-[90%] p-3 rounded-xl text-xs leading-relaxed",
                msg.role === 'user' 
                  ? "bg-secondary text-foreground mr-auto" 
                  : "bg-stone-50 text-foreground ml-auto border border-stone-100"
              )}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-stone-50 p-3 rounded-xl text-xs ml-auto flex items-center space-x-reverse space-x-2">
                <Loader2 size={14} className="animate-spin text-primary" />
                <span>Thinking...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-stone-100 flex space-x-reverse space-x-2">
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-grow bg-stone-50 border-none focus:ring-1 focus:ring-primary rounded-full px-4 text-xs"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-accent text-white p-2 rounded-full hover:scale-110 transition-transform disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-accent/90 backdrop-blur-sm text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-all group flex items-center space-x-reverse space-x-2"
        aria-label="FAQ Assistant"
      >
        <HelpCircle size={24} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
