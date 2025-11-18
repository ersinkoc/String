/**
 * Round 3 Bug Fixes Test Suite
 * Tests for newly discovered bugs after rounds 1 and 2
 */

import {
  boxify,
  progressBar,
  pad,
  wrap,
  getStringWidth
} from '../../src/index';

describe('Round 3 Bug Fixes - CRITICAL & HIGH Severity', () => {
  describe('BUG #40: boxify() - Spread operator stack overflow', () => {
    it('should not cause stack overflow with many lines', () => {
      const manyLines = Array(1000).fill('test').join('\n');
      expect(() => boxify(manyLines)).not.toThrow();
      const result = boxify(manyLines);
      expect(result).toContain('test');
    });

    it('should handle lines of varying lengths efficiently', () => {
      const lines = Array(500).fill(0).map((_, i) => 'x'.repeat(i % 50)).join('\n');
      expect(() => boxify(lines)).not.toThrow();
    });

    it('should work correctly with normal input', () => {
      const result = boxify('Hello\nWorld');
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });
  });

  describe('BUG #41: progressBar() - No width validation', () => {
    it('should throw error for zero width', () => {
      expect(() => progressBar(50, { width: 0 })).toThrow('Width must be a positive number');
    });

    it('should throw error for negative width', () => {
      expect(() => progressBar(50, { width: -10 })).toThrow('Width must be a positive number');
    });

    it('should throw error for extremely large width (DoS prevention)', () => {
      expect(() => progressBar(50, { width: 1000000 })).toThrow('Width exceeds maximum allowed');
    });

    it('should work normally with valid width', () => {
      const result = progressBar(50, { width: 20 });
      expect(result).toMatch(/[█░]/);
      expect(result).toContain('50.0%');
    });
  });

  describe('BUG #42: pad() - Empty fillString handling', () => {
    it('should throw error for empty fillString', () => {
      expect(() => pad('test', 10, '')).toThrow('fillString cannot be empty');
    });

    it('should work normally with valid fillString', () => {
      expect(pad('test', 10, ' ')).toBe('test      ');
      expect(pad('test', 10, '-')).toBe('test------');
    });

    it('should handle multi-character fillString correctly', () => {
      expect(pad('test', 10, 'ab')).toBe('testababab');
    });
  });

  describe('BUG #43: boxify() - Title overflow', () => {
    it('should handle title longer than content gracefully', () => {
      const result = boxify('Hi', { title: 'This is a very long title that exceeds content width' });
      expect(result).toContain('Hi');
      expect(result).not.toContain('undefined');
      expect(result.split('\n').every(line => !line.includes('-'.repeat(100)))).toBe(true);
    });

    it('should handle title equal to content width', () => {
      const result = boxify('Hello', { title: 'World' });
      expect(result).toContain('Hello');
      expect(result).toContain('World');
    });

    it('should work normally with shorter title', () => {
      const result = boxify('Hello World', { title: 'Hi' });
      expect(result).toContain('Hello World');
      expect(result).toContain('Hi');
    });
  });
});

describe('Round 3 Bug Fixes - MEDIUM Severity', () => {
  describe('BUG #44: wrap() - Indent can exceed width', () => {
    it('should throw error when indent length >= width', () => {
      expect(() => wrap('test', 10, { indent: '          ' })).toThrow('Indent must be shorter than width');
    });

    it('should throw error when indent length > width', () => {
      expect(() => wrap('test', 10, { indent: '            ' })).toThrow('Indent must be shorter than width');
    });

    it('should work when indent length < width', () => {
      const result = wrap('hello world test', 15, { indent: '  ' });
      expect(result).toContain('  ');
      expect(result.split('\n').every(line => line.length <= 17)).toBe(true); // 15 + 2 indent
    });
  });

  describe('BUG #45: getStringWidth() - Control characters', () => {
    it('should return 0 width for null character', () => {
      expect(getStringWidth('\x00')).toBe(0);
    });

    it('should return 0 width for tab character', () => {
      expect(getStringWidth('\t')).toBe(0);
    });

    it('should return 0 width for newline', () => {
      expect(getStringWidth('\n')).toBe(0);
    });

    it('should handle strings with control characters correctly', () => {
      expect(getStringWidth('hello\x00world')).toBe(10); // 5 + 5, control char = 0
      expect(getStringWidth('test\t\nvalue')).toBe(9); // test(4) + value(5), \t and \n = 0
    });

    it('should work normally with regular text', () => {
      expect(getStringWidth('hello')).toBe(5);
      expect(getStringWidth('Hello World')).toBe(11);
    });
  });
});

describe('Round 3 Bug Fixes - LOW Severity', () => {
  describe('BUG #46: extractEmails() - Weak validation', () => {
    it('should extract valid emails', () => {
      const text = 'Contact us at test@example.com or support@test.org';
      const emails = require('../../src/core/advanced').extractEmails(text);
      expect(emails).toContain('test@example.com');
      expect(emails).toContain('support@test.org');
    });

    it('should not extract obviously invalid emails', () => {
      const text = 'Not an email: @example.com or test@ or @';
      const emails = require('../../src/core/advanced').extractEmails(text);
      expect(emails).not.toContain('@example.com');
      expect(emails).not.toContain('test@');
      expect(emails).not.toContain('@');
    });
  });

  describe('BUG #47: extractUrls() - Weak validation', () => {
    it('should extract valid URLs', () => {
      const text = 'Visit https://example.com or http://test.org';
      const urls = require('../../src/core/advanced').extractUrls(text);
      expect(urls).toContain('https://example.com');
      expect(urls).toContain('http://test.org');
    });

    it('should handle URLs with paths and query strings', () => {
      const text = 'Check https://example.com/path?query=value';
      const urls = require('../../src/core/advanced').extractUrls(text);
      expect(urls).toContain('https://example.com/path?query=value');
    });
  });

  describe('BUG #48: pad() - Performance with large length', () => {
    it('should throw error for extremely large padding (DoS prevention)', () => {
      expect(() => pad('test', 10000000)).toThrow('Length exceeds maximum allowed');
    });

    it('should work with reasonable large padding', () => {
      const result = pad('test', 1000);
      expect(result.length).toBe(1000);
      expect(result.startsWith('test')).toBe(true);
    });
  });
});

describe('Round 3 Regression Tests', () => {
  it('boxify() should still work normally', () => {
    const result = boxify('Hello');
    expect(result).toContain('Hello');
    expect(result).toContain('┌');
    expect(result).toContain('└');
  });

  it('progressBar() should work with default options', () => {
    const result = progressBar(75);
    expect(result).toContain('75.0%');
  });

  it('pad() should work with default parameters', () => {
    expect(pad('test', 10)).toBe('test      ');
  });

  it('wrap() should work normally', () => {
    const result = wrap('hello world', 10);
    expect(result).toBe('hello\nworld');
  });

  it('getStringWidth() should work for ASCII', () => {
    expect(getStringWidth('hello')).toBe(5);
  });
});
