import { getGraphemes, getCodePoints } from '../utils/unicode';
import { boyerMooreSearch } from '../utils/algorithms';

export function contains(str: string, search: string, caseSensitive: boolean = true): boolean {
  if (!caseSensitive) {
    return str.toLowerCase().includes(search.toLowerCase());
  }
  return str.includes(search);
}

export function count(str: string, search: string): number {
  if (!search) return 0;
  
  let count = 0;
  let position = 0;
  
  while ((position = str.indexOf(search, position)) !== -1) {
    count++;
    position += search.length;
  }
  
  return count;
}

export function indexOfAll(str: string, search: string): number[] {
  if (!search) return [];
  
  return boyerMooreSearch(str, search);
}

export function words(str: string, locale?: string): string[] {
  if (locale && typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter(locale, { granularity: 'word' });
      return Array.from(segmenter.segment(str))
        .filter((segment: any) => segment.isWordLike)
        .map((segment: any) => segment.segment);
    } catch {
      // Fall back to default implementation if locale is invalid
    }
  }
  
  // Use a more inclusive regex that handles Unicode characters
  return str.match(/[\p{L}\p{N}]+/gu) || [];
}

export function chars(str: string): string[] {
  return getGraphemes(str);
}

export function codePoints(str: string): number[] {
  return getCodePoints(str);
}

export function graphemes(str: string): string[] {
  return getGraphemes(str);
}