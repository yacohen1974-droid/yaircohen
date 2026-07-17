export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://www.yourdomain.co.il';

export const SITE_NAME = 'יאיר כהן – יועץ משכנתאות ופיננסים';
export const SITE_PHONE = '+972506285476';
export const SITE_THEME: 'boutique' | 'masculine' = 'masculine';

export const ALLOWED_ADMIN_EMAILS = [
  'amirher@gmail.com',
  'yairmashkantaot@gmail.com',
  'yacohen1974@gmail.com'
];
