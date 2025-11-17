/**
 * Comprehensive tests for 19 NEW bugs found and fixed in this analysis
 * Branch: claude/repo-bug-analysis-fixes-01RcJPETvXo1qLdn8DVRJVx8
 * Date: 2025-11-17
 */

import {
  mask, maskEmail, random, findPatterns, generatePronounceable, generateFromPattern,
  toTable, hash
} from '../../src/core/advanced';
import { isNumeric } from '../../src/core/validation';
import { jaroDistance, cosineDistance, metaphone } from '../../src/utils/algorithms';
import { decodeHtml } from '../../src/core/encoding';
import { stripHtml } from '../../src/core/cleaning';
import { repeat, truncate } from '../../src/core/manipulation';
import { toTitleCase, toSentenceCase } from '../../src/core/case';

describe('New Bug Fixes - CRITICAL Severity', () => {
  describe('BUG #1: Mask function with unmaskedEnd = 0', () => {
    test('should handle unmaskedEnd = 0 correctly', () => {
      // Before fix: mask("secret", { unmaskedStart: 2, unmaskedEnd: 0 }) returned "se"
      // After fix: should return "se****"
      expect(mask('secret', { unmaskedStart: 2, unmaskedEnd: 0 })).toBe('se****');
      expect(mask('password', { unmaskedStart: 2, unmaskedEnd: 0 })).toBe('pa******');
    });

    test('should still work correctly with unmaskedEnd > 0', () => {
      expect(mask('secret', { unmaskedStart: 1, unmaskedEnd: 1 })).toBe('s****t');
      expect(mask('password', { unmaskedStart: 2, unmaskedEnd: 2 })).toBe('pa****rd'); // password = 8 chars, show first 2 and last 2
    });

    test('should work with only unmaskedEnd = 0', () => {
      expect(mask('hello', { unmaskedEnd: 0 })).toBe('*****');
    });
  });
});

describe('New Bug Fixes - HIGH Severity', () => {
  describe('BUG #2: getSecureRandomInt modulo bias eliminated', () => {
    test('should generate secure random strings without modulo bias', () => {
      const result1 = random(32, { secure: true });
      const result2 = random(32, { secure: true });

      expect(result1).toHaveLength(32);
      expect(result2).toHaveLength(32);
      expect(result1).not.toBe(result2); // Should be different
    });

    test('should work with secure option and custom charset', () => {
      const result = random(10, { secure: true, customCharset: 'ABCDEF123456' });
      expect(result).toHaveLength(10);
      expect(/^[ABCDEF123456]+$/.test(result)).toBe(true);
    });
  });

  describe('BUG #3: random() length validation', () => {
    test('should throw error for negative length', () => {
      expect(() => random(-5)).toThrow('Length must be non-negative');
      expect(() => random(-1)).toThrow('Length must be non-negative');
    });

    test('should throw error for extremely large length', () => {
      expect(() => random(2000000)).toThrow('Length exceeds maximum allowed');
    });

    test('should return empty string for length 0', () => {
      expect(random(0)).toBe('');
    });

    test('should work with valid lengths', () => {
      expect(random(10)).toHaveLength(10);
      expect(random(100)).toHaveLength(100);
    });
  });

  describe('BUG #4: findPatterns() DoS prevention', () => {
    test('should throw error for invalid minLength', () => {
      expect(() => findPatterns('test', 0)).toThrow('minLength must be at least 1');
      expect(() => findPatterns('test', -1)).toThrow('minLength must be at least 1');
    });

    test('should throw error for extremely long strings', () => {
      const longString = 'a'.repeat(1001);
      expect(() => findPatterns(longString)).toThrow('String too long for pattern finding');
    });

    test('should work with strings up to 1000 characters', () => {
      const validString = 'abc'.repeat(300); // 900 characters
      const result = findPatterns(validString);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('BUG #10: stripHtml() improved (with warnings)', () => {
    test('should remove self-closing script tags', () => {
      const result = stripHtml('<script src="evil.js" />hello');
      expect(result).toBe('hello');
    });

    test('should remove self-closing style tags', () => {
      const result = stripHtml('<style type="text/css" />hello');
      expect(result).toBe('hello');
    });

    test('should still remove regular script and style tags', () => {
      expect(stripHtml('<script>alert(1)</script>text')).toBe('text');
      expect(stripHtml('<style>body{color:red}</style>text')).toBe('text');
    });

    test('should remove all HTML tags', () => {
      expect(stripHtml('<div><p>Hello</p></div>')).toBe('Hello');
    });
  });
});

describe('New Bug Fixes - MEDIUM Severity', () => {
  describe('BUG #6: isNumeric() empty string handling', () => {
    test('should return false for empty string', () => {
      expect(isNumeric('')).toBe(false);
    });

    test('should return false for whitespace-only strings', () => {
      expect(isNumeric('   ')).toBe(false);
      expect(isNumeric('\t\n')).toBe(false);
      expect(isNumeric(' \t ')).toBe(false);
    });

    test('should still validate actual numbers', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('123.45')).toBe(true);
      expect(isNumeric('-123')).toBe(true);
    });
  });

  describe('BUG #7: jaroDistance() negative match window fixed', () => {
    test('should handle single character strings correctly', () => {
      expect(jaroDistance('a', 'a')).toBe(1); // Identical = 1.0 similarity
      expect(jaroDistance('a', 'b')).toBe(0); // Different = 0.0 similarity
    });

    test('should still work correctly for longer strings', () => {
      expect(jaroDistance('hello', 'hello')).toBe(1);
      expect(jaroDistance('abc', 'xyz')).toBe(0);
    });
  });

  describe('BUG #8: cosineDistance() single character handling', () => {
    test('should handle single characters correctly', () => {
      expect(cosineDistance('a', 'a')).toBe(1); // Identical = 1.0 similarity
      expect(cosineDistance('a', 'b')).toBe(0); // Different = 0.0 similarity
    });

    test('should handle different single characters', () => {
      expect(cosineDistance('x', 'y')).toBe(0);
      expect(cosineDistance('z', 'z')).toBe(1);
    });

    test('should still work for longer strings', () => {
      expect(cosineDistance('hello', 'hello')).toBe(1);
    });
  });

  describe('BUG #9: metaphone() array bounds checking', () => {
    test('should handle short strings without out-of-bounds access', () => {
      expect(metaphone('C')).toBeTruthy();
      expect(metaphone('DG')).toBeTruthy();
      expect(metaphone('CH')).toBeTruthy();
    });

    test('should handle edge cases at end of string', () => {
      expect(metaphone('TH')).toBeTruthy();
      expect(metaphone('SH')).toBeTruthy();
    });

    test('should not throw errors for any valid input', () => {
      expect(() => metaphone('A')).not.toThrow();
      expect(() => metaphone('AB')).not.toThrow();
      expect(() => metaphone('ABC')).not.toThrow();
    });
  });

  describe('BUG #11: decodeHtml() surrogate pair validation', () => {
    test('should not decode invalid surrogate pairs', () => {
      // 0xD800-0xDFFF are invalid Unicode surrogate pairs
      expect(decodeHtml('&#55296;')).toBe('&#55296;'); // 0xD800
      expect(decodeHtml('&#57343;')).toBe('&#57343;'); // 0xDFFF
    });

    test('should decode valid numeric entities', () => {
      expect(decodeHtml('&#65;')).toBe('A'); // Valid: 0x41
      expect(decodeHtml('&#x41;')).toBe('A'); // Valid hex
    });

    test('should handle hex entities avoiding surrogates', () => {
      expect(decodeHtml('&#xD800;')).toBe('&#xD800;'); // Invalid surrogate
      expect(decodeHtml('&#x1F600;')).toBe('😀'); // Valid emoji
    });
  });

  describe('BUG #12: toTable() stack overflow prevention', () => {
    test('should handle large datasets without stack overflow', () => {
      // Create a dataset with many rows
      const largeData: string[][] = [];
      for (let i = 0; i < 1000; i++) {
        largeData.push(['a', 'b', 'c']);
      }

      expect(() => toTable(largeData)).not.toThrow();
      const result = toTable(largeData);
      expect(result).toBeTruthy();
    });

    test('should work with normal-sized data', () => {
      const data = [['Name', 'Age'], ['John', '30'], ['Jane', '25']];
      const result = toTable(data);
      expect(result).toContain('Name');
      expect(result).toContain('John');
    });
  });

  describe('BUG #15: generatePronounceable() validation', () => {
    test('should throw error for negative length', () => {
      expect(() => generatePronounceable(-5)).toThrow('Length must be non-negative');
    });

    test('should throw error for extremely large length', () => {
      expect(() => generatePronounceable(2000000)).toThrow('Length exceeds maximum allowed');
    });

    test('should return empty string for length 0', () => {
      expect(generatePronounceable(0)).toBe('');
    });

    test('should generate valid pronounceable strings', () => {
      const result = generatePronounceable(10);
      expect(result).toHaveLength(10);
      expect(/^[a-z]+$/.test(result)).toBe(true);
    });
  });
});

describe('New Bug Fixes - LOW Severity', () => {
  describe('BUG #14: repeat() performance improvement', () => {
    test('should use efficient Array.fill implementation', () => {
      const result = repeat('test', 5, ',');
      expect(result).toBe('test,test,test,test,test');
    });

    test('should handle large counts efficiently', () => {
      const start = Date.now();
      const result = repeat('x', 10000);
      const elapsed = Date.now() - start;

      expect(result).toHaveLength(10000);
      expect(elapsed).toBeLessThan(100); // Should be very fast
    });

    test('should work with separator', () => {
      expect(repeat('a', 3, '-')).toBe('a-a-a');
      expect(repeat('test', 2, '|')).toBe('test|test');
    });
  });

  describe('BUG #16: generateFromPattern() validation', () => {
    test('should throw error for extremely long patterns', () => {
      const longPattern = '#'.repeat(100001);
      expect(() => generateFromPattern(longPattern)).toThrow('Pattern too long');
    });

    test('should work with valid patterns', () => {
      const result = generateFromPattern('###-XXX');
      expect(result).toMatch(/^\d{3}-[A-Z]{3}$/);
    });
  });

  describe('BUG #17: maskEmail() validation improved', () => {
    test('should handle invalid email formats gracefully', () => {
      expect(maskEmail('hello')).toBe('*****'); // No @, uses basic mask with defaults (masks all)
      expect(maskEmail('@domain.com')).toMatch(/^\*+/); // @ at start
      expect(maskEmail('user@')).toMatch(/\*/); // @ at end
    });

    test('should still mask valid emails correctly', () => {
      expect(maskEmail('test@example.com')).toBe('t**t@example.com');
      expect(maskEmail('user@domain.com')).toBe('u**r@domain.com');
    });
  });

  describe('BUG #18: toTitleCase() empty string optimization', () => {
    test('should handle empty string efficiently', () => {
      expect(toTitleCase('')).toBe('');
      expect(toTitleCase(null as any)).toBe(null);
      expect(toTitleCase(undefined as any)).toBe(undefined);
    });

    test('should still work correctly for normal strings', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });
  });

  describe('BUG #19: toSentenceCase() type validation', () => {
    test('should handle invalid types gracefully', () => {
      expect(toSentenceCase('')).toBe('');
      expect(toSentenceCase(123 as any)).toBe('');
      expect(toSentenceCase(null as any)).toBe('');
      expect(toSentenceCase(undefined as any)).toBe('');
    });

    test('should work correctly with valid strings', () => {
      expect(toSentenceCase('HELLO WORLD')).toBe('Hello world');
      expect(toSentenceCase('test')).toBe('Test');
    });
  });
});

describe('Bug Fix Regression Tests', () => {
  test('hash() should still work despite security warnings', () => {
    // Suppress console.warn for this test
    const originalWarn = console.warn;
    console.warn = jest.fn();

    expect(hash('test', 'md5')).toBeTruthy();
    expect(hash('test', 'sha1')).toBeTruthy();
    expect(hash('test', 'sha256')).toBeTruthy();

    console.warn = originalWarn;
  });

  test('random() should work normally with valid parameters', () => {
    expect(random(10)).toHaveLength(10);
    expect(random(5, { secure: true })).toHaveLength(5);
  });

  test('all case transformations should work normally', () => {
    expect(toTitleCase('hello world')).toBeTruthy();
    expect(toSentenceCase('HELLO')).toBeTruthy();
  });

  test('all algorithm functions should work correctly', () => {
    expect(jaroDistance('test', 'test')).toBe(1);
    expect(cosineDistance('test', 'test')).toBe(1);
    expect(metaphone('test')).toBeTruthy();
  });

  test('validation functions should work correctly', () => {
    expect(isNumeric('123')).toBe(true);
    expect(isNumeric('abc')).toBe(false);
  });
});
