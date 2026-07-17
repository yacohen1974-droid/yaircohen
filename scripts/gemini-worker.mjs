#!/usr/bin/env node
/**
 * Gemini Worker — BeinMe SEO Agent
 * Usage: node scripts/gemini-worker.mjs "<content>" "<prompt>"
 *
 * Reads GEMINI_API_KEY from .env and calls Gemini 2.0 Flash.
 * Designed for large-context SEO audits, schema generation, and copywriting.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// --- Load .env manually (no external deps needed) ---
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, '../.env');

try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env not found — rely on shell environment
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set.');
  process.exit(1);
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// --- Parse arguments ---
const [,, content, prompt] = process.argv;

if (!content || !prompt) {
  console.error('Usage: node scripts/gemini-worker.mjs "<content>" "<prompt>"');
  process.exit(1);
}

const fullPrompt = `${prompt}\n\n---\nContent:\n${content}`;

// --- Call Gemini API ---
const response = await fetch(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: fullPrompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 8192,
    },
  }),
});

if (!response.ok) {
  const err = await response.text();
  console.error(`Gemini API error ${response.status}:`, err);
  process.exit(1);
}

const data = await response.json();
const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!text) {
  console.error('Empty response from Gemini:', JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log(text);
