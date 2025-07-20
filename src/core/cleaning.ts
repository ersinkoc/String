import { removeAccents as unicodeRemoveAccents } from '../utils/unicode';

export function trim(str: string, chars?: string): string {
  if (!str || typeof str !== 'string') return '';
  
  if (!chars) {
    return str.trim();
  }
  
  const pattern = new RegExp(`^[${escapeRegExp(chars)}]+|[${escapeRegExp(chars)}]+$`, 'g');
  return str.replace(pattern, '');
}

export function trimStart(str: string, chars?: string): string {
  if (!str || typeof str !== 'string') return '';
  
  if (!chars) {
    return str.trimStart();
  }
  
  const pattern = new RegExp(`^[${escapeRegExp(chars)}]+`, 'g');
  return str.replace(pattern, '');
}

export function trimEnd(str: string, chars?: string): string {
  if (!str || typeof str !== 'string') return '';
  
  if (!chars) {
    return str.trimEnd();
  }
  
  const pattern = new RegExp(`[${escapeRegExp(chars)}]+$`, 'g');
  return str.replace(pattern, '');
}

export function removeExtraSpaces(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\s+/g, ' ').trim();
}

export function normalizeWhitespace(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/[\t\n\r\f\v]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function removeNonPrintable(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
}

export function stripHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&[#\w]+;/g, (entity) => {
      const htmlEntities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
        '&nbsp;': ' ',
        '&copy;': '©',
        '&reg;': '®',
        '&trade;': '™'
      };
      return htmlEntities[entity] || entity;
    });
}

export function stripAnsi(str: string): string {
  if (!str || typeof str !== 'string') return '';
  const ansiRegex = /\x1b\[[0-9;]*m/g;
  return str.replace(ansiRegex, '');
}

export function removeAccents(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return unicodeRemoveAccents(str);
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}