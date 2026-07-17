"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { SectionTitle } from './SectionTitle';
import { Calculator, RefreshCw } from 'lucide-react';

const formatILS = (n: number) =>
  Math.round(n).toLocaleString('he-IL');

function monthlyPayment(principal: number, annualRatePct: number, years: number) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (principal <= 0 || years <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function NumberField({
  label, value, onChange, suffix, min = 0, step = 1,
}: {
  label: string; value: number; onChange: (v: number) => void; suffix?: string; min?: number; step?: number;
}) {
  return (
    <label className="block text-right">
      <span className="text-sm font-bold text-slate-600 mb-2 block">{label}</span>
      <div className="relative">
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full h-14 rounded-xl border border-slate-200 bg-white px-4 text-lg font-bold text-accent text-right focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          dir="ltr"
          style={{ textAlign: 'right' }}
        />
        {suffix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

export function MortgageCalculator({ titleSettings }: { titleSettings?: any }) {
  const [mode, setMode] = React.useState<'payment' | 'refinance'>('payment');

  // Monthly payment calculator state
  const [amount, setAmount] = React.useState(1200000);
  const [rate, setRate] = React.useState(4.2);
  const [years, setYears] = React.useState(25);

  // Refinance calculator state
  const [balance, setBalance] = React.useState(900000);
  const [currentRate, setCurrentRate] = React.useState(5.2);
  const [newRate, setNewRate] = React.useState(4.2);
  const [remainingYears, setRemainingYears] = React.useState(20);

  const payment = monthlyPayment(amount, rate, years);
  const totalPayback = payment * years * 12;
  const totalInterest = totalPayback - amount;

  const currentPayment = monthlyPayment(balance, currentRate, remainingYears);
  const newPayment = monthlyPayment(balance, newRate, remainingYears);
  const monthlySavings = currentPayment - newPayment;
  const totalSavings = monthlySavings * remainingYears * 12;

  return (
    <section className="py-20 md:py-32 px-6 bg-slate-50 border-y border-slate-100">
      <div className="max-w-4xl mx-auto">
        <SectionTitle
          subtitle={titleSettings?.subtitle || 'כלי עזר'}
          title={titleSettings?.text || 'מחשבון משכנתא'}
          fontSize={titleSettings?.fontSize}
          fontFamily={titleSettings?.fontFamily}
          color={titleSettings?.color}
          align={titleSettings?.align || 'center'}
          className="flex flex-col items-center text-center"
        />

        {/* Mode switch */}
        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setMode('payment')}
            className={cn(
              'px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2',
              mode === 'payment' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/30'
            )}
          >
            <Calculator size={16} /> חישוב החזר חודשי
          </button>
          <button
            onClick={() => setMode('refinance')}
            className={cn(
              'px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2',
              mode === 'refinance' ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/30'
            )}
          >
            <RefreshCw size={16} /> כדאיות מיחזור
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(30,58,138,0.08)] border border-slate-100 p-8 md:p-12">
          {mode === 'payment' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <NumberField label="סכום המשכנתא" value={amount} onChange={setAmount} suffix="₪" step={10000} />
                <NumberField label="ריבית שנתית ממוצעת" value={rate} onChange={setRate} suffix="%" step={0.1} />
                <NumberField label="תקופת המשכנתא" value={years} onChange={setYears} suffix="שנים" step={1} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-sm text-slate-400 font-semibold mb-1">החזר חודשי משוער</p>
                  <p className="text-3xl font-black text-primary tabular-nums">₪{formatILS(payment)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 font-semibold mb-1">סה״כ החזר לאורך התקופה</p>
                  <p className="text-3xl font-black text-accent tabular-nums">₪{formatILS(totalPayback)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 font-semibold mb-1">סה״כ ריבית משוערת</p>
                  <p className="text-3xl font-black text-accent tabular-nums">₪{formatILS(totalInterest)}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <NumberField label="יתרת קרן נוכחית" value={balance} onChange={setBalance} suffix="₪" step={10000} />
                <NumberField label="שנים שנותרו למשכנתא" value={remainingYears} onChange={setRemainingYears} suffix="שנים" step={1} />
                <NumberField label="הריבית שאני משלם היום" value={currentRate} onChange={setCurrentRate} suffix="%" step={0.1} />
                <NumberField label="ריבית חדשה משוערת" value={newRate} onChange={setNewRate} suffix="%" step={0.1} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-sm text-slate-400 font-semibold mb-1">החזר חודשי היום</p>
                  <p className="text-2xl font-black text-slate-400 tabular-nums">₪{formatILS(currentPayment)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 font-semibold mb-1">חיסכון חודשי משוער</p>
                  <p className="text-3xl font-black text-primary tabular-nums">₪{formatILS(Math.max(monthlySavings, 0))}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 font-semibold mb-1">חיסכון כולל לאורך התקופה</p>
                  <p className="text-3xl font-black text-primary tabular-nums">₪{formatILS(Math.max(totalSavings, 0))}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 leading-relaxed max-w-2xl mx-auto">
          החישוב לעיל הינו הערכה כללית בלבד לצורך המחשה, ואינו מהווה הצעה מחייבת או ייעוץ פיננסי.
          התנאים בפועל תלויים בבנק, בסוג המסלול, בעמלות ובנתונים האישיים שלכם – נשמח לבחון את המקרה הספציפי שלכם בשיחת ייעוץ ראשונית וללא עלות.
        </p>
      </div>
    </section>
  );
}
