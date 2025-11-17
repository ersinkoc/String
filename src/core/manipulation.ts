import type { TruncateOptions, WrapOptions, SlugifyOptions, PadType } from '../types';
import { reverseUnicode, getGraphemes, getStringWidth } from '../utils/unicode';
import { removeAccents } from '../utils/unicode';

export function reverse(str: string): string {
  return reverseUnicode(str);
}

export function shuffle(str: string): string {
  const chars = getGraphemes(str);
  
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  
  return chars.join('');
}

export function repeat(str: string, count: number, separator: string = ''): string {
  if (count < 0) {
    throw new Error('Count must be non-negative');
  }

  if (count === 0) return '';
  if (count === 1) return str;

  // BUG #14 FIX: More efficient implementation using Array.fill
  return Array(count).fill(str).join(separator);
}

export function truncate(str: string, length: number, options: TruncateOptions = {}): string {
  const { suffix = '...', preserveWords = false } = options;

  if (str.length <= length) return str;

  // If suffix is longer than the allowed length, truncate the suffix too
  if (suffix.length >= length) {
    return str.slice(0, length);
  }

  if (preserveWords) {
    const words = str.split(/\s+/);
    let result = '';

    for (const word of words) {
      const potential = result ? `${result} ${word}` : word;
      if (potential.length + suffix.length > length) {
        break;
      }
      result = potential;
    }

    return result ? result + suffix : suffix.slice(0, length);
  }

  return str.slice(0, Math.max(0, length - suffix.length)) + suffix;
}

export function pad(str: string, length: number, fillString: string = ' ', type: PadType = 'end'): string {
  if (str.length >= length) return str;
  
  const padLength = length - str.length;
  const fill = fillString.repeat(Math.ceil(padLength / fillString.length)).slice(0, padLength);
  
  switch (type) {
    case 'start':
      return fill + str;
    case 'end':
      return str + fill;
    case 'both':
      const leftPadLength = Math.floor(padLength / 2);
      const rightPadLength = padLength - leftPadLength;
      const leftFill = fillString.repeat(Math.ceil(leftPadLength / fillString.length)).slice(0, leftPadLength);
      const rightFill = fillString.repeat(Math.ceil(rightPadLength / fillString.length)).slice(0, rightPadLength);
      return leftFill + str + rightFill;
    default:
      return str + fill;
  }
}

export function wrap(str: string, width: number, options: WrapOptions = {}): string {
  const { indent = '', cut = false } = options;

  // Validate width parameter
  if (width <= 0) {
    throw new Error('Width must be a positive number');
  }
  
  const words = str.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const potential = currentLine ? `${currentLine} ${word}` : word;
    const potentialWidth = getStringWidth(potential);
    
    if (potentialWidth <= width) {
      currentLine = potential;
    } else {
      if (currentLine) {
        lines.push(indent + currentLine);
        currentLine = word;
      } else {
        // Word is longer than width
        if (cut) {
          const chars = getGraphemes(word);
          let chunk = '';
          
          for (const char of chars) {
            const chunkWidth = getStringWidth(chunk + char);
            if (chunkWidth > width && chunk) {
              lines.push(indent + chunk);
              chunk = char;
            } else {
              chunk += char;
            }
          }
          
          if (chunk) {
            currentLine = chunk;
          }
        } else {
          currentLine = word;
        }
      }
    }
  }
  
  if (currentLine) {
    lines.push(indent + currentLine);
  }
  
  return lines.join('\n');
}

export function slugify(str: string, options: SlugifyOptions = {}): string {
  const {
    separator = '-',
    lowercase = true,
    strict = false,
    locale
  } = options;

  let result = removeAccents(str);

  if (lowercase) {
    result = locale ? result.toLocaleLowerCase(locale) : result.toLowerCase();
  }

  if (strict) {
    result = result.replace(/[^a-zA-Z0-9]+/g, separator);
  } else {
    result = result.replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, separator);
  }

  // Remove leading and trailing separators
  result = result.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, 'g'), '');

  // Clean up any consecutive separators that might have been created
  const escapedSep = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  result = result.replace(new RegExp(`${escapedSep}{2,}`, 'g'), separator);

  return result;
}