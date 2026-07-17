"use client";

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const base = (strokeWidth = 2) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** House with magnifying glass — ייעוץ ראשוני */
export function HouseSearchIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      <path d="M22 42V28H29V42" />
      <path d="M5 22L26 5L43 19" />
      <path d="M5 22V42H22" />
      <path d="M43 19V42H29" />
      <circle cx="14" cy="31" r="6" />
      <path d="M19 36L23 40" strokeWidth={strokeWidth + 0.5} />
    </svg>
  );
}

/** Greek bank columns — השוואת בנקים */
export function BankColumnsIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      <path d="M4 18L24 4L44 18H4Z" />
      <rect x="4" y="40" width="40" height="5" rx="1" />
      <line x1="10" y1="18" x2="10" y2="40" />
      <line x1="19" y1="18" x2="19" y2="40" />
      <line x1="29" y1="18" x2="29" y2="40" />
      <line x1="38" y1="18" x2="38" y2="40" />
      <line x1="24" y1="8" x2="24" y2="12" strokeWidth={1} opacity="0.4" />
    </svg>
  );
}

/** Winding path with flag — ליווי מלא */
export function JourneyFlagIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      <path d="M6 42Q14 28 22 34Q30 40 38 24" strokeWidth={strokeWidth + 0.5} />
      <circle cx="22" cy="34" r="2.5" />
      <circle cx="38" cy="24" r="2.5" />
      <path d="M38 6V24" />
      <path d="M38 6L46 10L38 14Z" />
    </svg>
  );
}

/** Circular arrows with shekel — מחזור משכנתא */
export function RefinanceIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      <path d="M8 24C8 15.2 15.2 8 24 8c5.8 0 10.9 3 13.8 7.5" />
      <path d="M40 24c0 8.8-7.2 16-16 16-5.8 0-10.9-3-13.8-7.5" />
      <path d="M37.8 6L37.8 15.5L28.8 15.5" />
      <path d="M10.2 42L10.2 32.5L19.2 32.5" />
      {/* Shekel: U + two horizontals */}
      <path d="M20 20v8a4 4 0 0 0 8 0v-8" />
      <path d="M17 24h14" strokeWidth={strokeWidth - 0.3} />
      <path d="M17 27.5h14" strokeWidth={strokeWidth - 0.3} />
    </svg>
  );
}

/** Ornate key with house bow — דירה ראשונה */
export function FirstHomeKeyIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      {/* House as key bow */}
      <path d="M12 24L20 16L28 24V34H12V24Z" />
      <path d="M17 34V28H23V34" />
      {/* Key shaft */}
      <path d="M28 24H44" />
      <path d="M36 24V28" />
      <path d="M40 24V27" />
    </svg>
  );
}

/** Rising bars + rocket arrow — נדל״ן להשקעה */
export function InvestmentGrowthIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      <rect x="4" y="28" width="8" height="14" rx="1" />
      <rect x="16" y="20" width="8" height="22" rx="1" />
      <rect x="28" y="12" width="8" height="30" rx="1" />
      <path d="M36 6L44 6L44 14" />
      <path d="M28 14L44 6" />
    </svg>
  );
}

/** Two hands cupping a coin — שקיפות / אמינות */
export function TrustHandsIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      {/* Coin/circle on top */}
      <circle cx="24" cy="14" r="8" />
      {/* Shekel inside coin */}
      <path d="M21 10v6a3 3 0 0 0 6 0v-6" strokeWidth={strokeWidth - 0.3} />
      <path d="M19.5 13.5h9" strokeWidth={strokeWidth - 0.5} />
      {/* Hands cradling */}
      <path d="M6 32c0-4 4-6 8-4l6 3 6-3c4-2 8 0 8 4v2c0 4-4 8-8 8H14c-4 0-8-4-8-8V32Z" />
    </svg>
  );
}

/** Shield with percentage + check — ביטחון / אחריות */
export function ShieldGuaranteeIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      <path d="M24 4L6 12V26C6 35 14 42 24 44C34 42 42 35 42 26V12L24 4Z" />
      <circle cx="18" cy="20" r="3" />
      <circle cx="30" cy="30" r="3" />
      <path d="M30 20L18 30" strokeWidth={strokeWidth + 0.5} />
    </svg>
  );
}

/** Calendar with coin drop — תכנון / חיסכון */
export function SavingsPlanIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      <rect x="4" y="10" width="40" height="34" rx="3" />
      <path d="M4 20H44" />
      <path d="M14 6V14" />
      <path d="M34 6V14" />
      <path d="M12 28H22" />
      <path d="M12 34H18" />
      {/* Coin dropping in */}
      <circle cx="34" cy="33" r="6" />
      <path d="M31 31v4a3 3 0 0 0 6 0v-4" strokeWidth={strokeWidth - 0.4} />
      <path d="M29.5 33h9" strokeWidth={strokeWidth - 0.5} />
    </svg>
  );
}

/** Compare scales — השוואה / איזון */
export function CompareScalesIcon({ size = 48, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} {...base(strokeWidth)}>
      {/* Center pole */}
      <line x1="24" y1="8" x2="24" y2="42" />
      <path d="M16 42H32" />
      {/* Balance arm */}
      <path d="M8 16H40" />
      <circle cx="24" cy="10" r="3" />
      {/* Left pan - lower (heavier) */}
      <path d="M8 16L4 28" />
      <path d="M8 16L12 28" />
      <path d="M4 28C4 30 12 30 12 28" />
      {/* Right pan - higher */}
      <path d="M40 16L36 22" />
      <path d="M40 16L44 22" />
      <path d="M36 22C36 24 44 24 44 22" />
    </svg>
  );
}

/** Map of icons by name key — used in BlockRenderer + admin */
export const MORTGAGE_ICON_MAP: Record<string, React.FC<IconProps>> = {
  HouseSearch:     HouseSearchIcon,
  BankColumns:     BankColumnsIcon,
  JourneyFlag:     JourneyFlagIcon,
  Refinance:       RefinanceIcon,
  FirstHomeKey:    FirstHomeKeyIcon,
  InvestmentGrowth: InvestmentGrowthIcon,
  TrustHands:      TrustHandsIcon,
  ShieldGuarantee: ShieldGuaranteeIcon,
  SavingsPlan:     SavingsPlanIcon,
  CompareScales:   CompareScalesIcon,
};
