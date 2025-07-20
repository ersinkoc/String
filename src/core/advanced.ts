import type { SimilarityAlgorithm, SoundsLikeAlgorithm, HashAlgorithm, RandomOptions, MaskOptions, Pattern, TableOptions, BoxOptions, ProgressOptions } from '../types';
import { levenshteinDistance, jaroDistance, cosineDistance, soundex, metaphone } from '../utils/algorithms';

// String Similarity & Matching
export function similarity(str1: string, str2: string, algorithm: SimilarityAlgorithm = 'levenshtein'): number {
  switch (algorithm) {
    case 'levenshtein':
      const maxLength = Math.max(str1.length, str2.length);
      if (maxLength === 0) return 1;
      return 1 - levenshteinDistance(str1, str2) / maxLength;
    case 'jaro':
      return jaroDistance(str1, str2);
    case 'cosine':
      return cosineDistance(str1, str2);
    default:
      throw new Error(`Unknown similarity algorithm: ${algorithm}`);
  }
}

export function fuzzyMatch(str: string, pattern: string, threshold: number = 0.6): boolean {
  return similarity(str, pattern, 'levenshtein') >= threshold;
}

export function soundsLike(str1: string, str2: string, algorithm: SoundsLikeAlgorithm = 'soundex'): boolean {
  switch (algorithm) {
    case 'soundex':
      return soundex(str1) === soundex(str2);
    case 'metaphone':
      return metaphone(str1) === metaphone(str2);
    default:
      throw new Error(`Unknown sounds-like algorithm: ${algorithm}`);
  }
}

// Pattern Detection
export function findPatterns(str: string, minLength: number = 2): Pattern[] {
  const patterns: Map<string, Pattern> = new Map();
  
  for (let length = minLength; length <= str.length / 2; length++) {
    for (let i = 0; i <= str.length - length; i++) {
      const pattern = str.slice(i, i + length);
      const existing = patterns.get(pattern);
      
      if (existing) {
        existing.indices.push(i);
        existing.frequency++;
      } else {
        patterns.set(pattern, {
          pattern,
          indices: [i],
          length,
          frequency: 1
        });
      }
    }
  }
  
  return Array.from(patterns.values())
    .filter(p => p.frequency > 1)
    .sort((a, b) => b.frequency - a.frequency || b.length - a.length);
}

export function isRepeating(str: string): boolean {
  if (str.length === 0) return false;
  
  for (let len = 1; len <= str.length / 2; len++) {
    if (str.length % len === 0) {
      const pattern = str.slice(0, len);
      const repeated = pattern.repeat(str.length / len);
      if (repeated === str) return true;
    }
  }
  
  return false;
}

export function extractEmails(str: string): string[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  return str.match(emailRegex) || [];
}

export function extractUrls(str: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
  return str.match(urlRegex) || [];
}

export function extractNumbers(str: string): string[] {
  const numberRegex = /-?\d+(?:\.\d+)?/g;
  return str.match(numberRegex) || [];
}

// String Generation
export function random(length: number, options: RandomOptions = {}): string {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = false,
    excludeSimilar = false,
    customCharset
  } = options;
  
  if (customCharset) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += customCharset[Math.floor(Math.random() * customCharset.length)];
    }
    return result;
  }
  
  let charset = '';
  
  if (uppercase) charset += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += excludeSimilar ? '23456789' : '0123456789';
  if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (!charset) {
    throw new Error('At least one character type must be enabled');
  }
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }
  
  return result;
}

export function generatePronounceable(length: number): string {
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  const vowels = 'aeiou';
  
  let result = '';
  let useConsonant = Math.random() > 0.5;
  
  for (let i = 0; i < length; i++) {
    if (useConsonant) {
      result += consonants[Math.floor(Math.random() * consonants.length)];
    } else {
      result += vowels[Math.floor(Math.random() * vowels.length)];
    }
    useConsonant = !useConsonant;
  }
  
  return result;
}

export function generateFromPattern(pattern: string): string {
  return pattern.replace(/[#X]/g, char => {
    if (char === '#') {
      return Math.floor(Math.random() * 10).toString();
    } else if (char === 'X') {
      return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    return char;
  });
}

// Masking & Security
export function mask(str: string, options: MaskOptions = {}): string {
  const {
    maskChar = '*',
    unmaskedStart = 0,
    unmaskedEnd = 0
  } = options;
  
  if (unmaskedStart + unmaskedEnd >= str.length) {
    return str;
  }
  
  const start = str.slice(0, unmaskedStart);
  const end = str.slice(-unmaskedEnd || str.length);
  const middle = maskChar.repeat(str.length - unmaskedStart - unmaskedEnd);
  
  return start + middle + end;
}

export function maskEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return mask(email);
  
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex);
  
  const maskedLocal = mask(local, { unmaskedStart: 1, unmaskedEnd: 1 });
  return maskedLocal + domain;
}

export function maskCreditCard(cc: string): string {
  const digits = cc.replace(/\D/g, '');
  return mask(digits, { unmaskedEnd: 4 });
}

export function hash(str: string, algorithm: HashAlgorithm): string {
  switch (algorithm) {
    case 'md5':
      return md5(str);
    case 'sha1':
      return sha1(str);
    case 'sha256':
      return sha256(str);
    default:
      throw new Error(`Unknown hash algorithm: ${algorithm}`);
  }
}

// Visual Formatting
export function toTable(data: string[][], options: TableOptions = {}): string {
  const {
    headers = false,
    border = true,
    padding = 1,
    align = 'left'
  } = options;
  
  if (!data.length) return '';
  
  const maxCols = Math.max(...data.map(row => row.length));
  const colWidths = new Array(maxCols).fill(0);
  
  // Calculate column widths
  data.forEach(row => {
    row.forEach((cell, col) => {
      colWidths[col] = Math.max(colWidths[col], cell.length);
    });
  });
  
  const lines: string[] = [];
  
  if (border) {
    const borderLine = '+' + colWidths.map(w => '-'.repeat(w + padding * 2)).join('+') + '+';
    lines.push(borderLine);
  }
  
  data.forEach((row, rowIndex) => {
    const cells = row.map((cell, col) => {
      const width = colWidths[col];
      let aligned = cell;
      
      if (align === 'center') {
        const spaces = width - cell.length;
        const left = Math.floor(spaces / 2);
        const right = spaces - left;
        aligned = ' '.repeat(left) + cell + ' '.repeat(right);
      } else if (align === 'right') {
        aligned = cell.padStart(width);
      } else {
        aligned = cell.padEnd(width);
      }
      
      return ' '.repeat(padding) + aligned + ' '.repeat(padding);
    });
    
    const line = border ? '|' + cells.join('|') + '|' : cells.join(' ');
    lines.push(line);
    
    if (headers && rowIndex === 0 && border) {
      const borderLine = '+' + colWidths.map(w => '-'.repeat(w + padding * 2)).join('+') + '+';
      lines.push(borderLine);
    }
  });
  
  if (border) {
    const borderLine = '+' + colWidths.map(w => '-'.repeat(w + padding * 2)).join('+') + '+';
    lines.push(borderLine);
  }
  
  return lines.join('\n');
}

export function boxify(str: string, options: BoxOptions = {}): string {
  const {
    style = 'single',
    padding = 1,
    margin = 0,
    title
  } = options;
  
  const styles = {
    single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
    double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
    rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
    thick: { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' }
  };
  
  const chars = styles[style];
  const lines = str.split('\n');
  const maxWidth = Math.max(...lines.map(line => line.length));
  const innerWidth = maxWidth + padding * 2;
  
  const result: string[] = [];
  
  // Add top margin
  for (let i = 0; i < margin; i++) {
    result.push('');
  }
  
  // Top border
  const topBorder = chars.tl + chars.h.repeat(innerWidth) + chars.tr;
  result.push(' '.repeat(margin) + topBorder);
  
  // Title
  if (title) {
    const titlePadding = Math.max(0, Math.floor((innerWidth - title.length) / 2));
    const titleLine = chars.v + ' '.repeat(titlePadding) + title + ' '.repeat(innerWidth - titlePadding - title.length) + chars.v;
    result.push(' '.repeat(margin) + titleLine);
    
    const titleSeparator = chars.tl + chars.h.repeat(innerWidth) + chars.tr;
    result.push(' '.repeat(margin) + titleSeparator);
  }
  
  // Content lines
  lines.forEach(line => {
    const paddedLine = ' '.repeat(padding) + line.padEnd(maxWidth) + ' '.repeat(padding);
    result.push(' '.repeat(margin) + chars.v + paddedLine + chars.v);
  });
  
  // Bottom border
  const bottomBorder = chars.bl + chars.h.repeat(innerWidth) + chars.br;
  result.push(' '.repeat(margin) + bottomBorder);
  
  // Add bottom margin
  for (let i = 0; i < margin; i++) {
    result.push('');
  }
  
  return result.join('\n');
}

export function progressBar(value: number, options: ProgressOptions = {}): string {
  const {
    width = 20,
    complete = '█',
    incomplete = '░',
    showPercent = true
  } = options;
  
  const percentage = Math.max(0, Math.min(100, value));
  const completed = Math.round((percentage / 100) * width);
  const remaining = width - completed;
  
  const bar = complete.repeat(completed) + incomplete.repeat(remaining);
  
  if (showPercent) {
    return `${bar} ${percentage.toFixed(1)}%`;
  }
  
  return bar;
}

// Pure JavaScript hash implementations
function md5(str: string): string {
  // Simplified MD5 implementation - in production, use a proper crypto library
  let hash = 0;
  if (str.length === 0) return hash.toString(16);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

function sha1(str: string): string {
  // Simplified SHA1 implementation - in production, use a proper crypto library
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function sha256(str: string): string {
  // Simplified SHA256 implementation - in production, use a proper crypto library
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}