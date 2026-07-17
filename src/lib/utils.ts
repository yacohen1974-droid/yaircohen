import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeEncodeURI(url: string | null | undefined): string {
  if (!url) return "";
  try {
    return encodeURI(decodeURI(url));
  } catch {
    try {
      return encodeURI(url);
    } catch {
      return url;
    }
  }
}

